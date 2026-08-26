/**
 * 开发启动器核心模块
 * @description 负责：
 * 1. 自动发现 workspace 内全部可启动包（读 pnpm-workspace.yaml，每次调用重新扫描，新增即出现）
 * 2. 读取/写入 .dev-launcher.json（记忆上次勾选 + exclude 排除 + extra 手工兜底条目）
 * 3. 进程管理：spawn/kill 服务进程、环形缓冲日志、从 vite 输出校准实际端口
 */

import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 项目根目录（本文件位于 scripts/dev-launcher/ 下，向上两级） */
export const ROOT_DIR = fileURLToPath(new URL('../..', import.meta.url));

/** 启动器控制台前端自身目录（扫描时排除，避免启动器把自己当条目） */
const LAUNCHER_WEB_DIR = fileURLToPath(new URL('./web', import.meta.url));

/** 本地配置文件路径（gitignore，记忆勾选 + 手工兜底） */
const CONFIG_PATH = path.join(ROOT_DIR, '.dev-launcher.json');

/** 每个服务保留的最近日志行数（页面轮询展示用） */
export const MAX_LOG_LINES = 200;

/** vite dev 服务器默认端口（未在 vite.config.ts 显式配置时） */
const VITE_DEFAULT_PORT = 5173;

/** 默认配置：selection 为 null 表示首次启动，前端按全选处理 */
const createDefaultConfig = () => ({
    selection: { apps: null, packages: null },
    exclude: [],
    extra: [],
});

/** 读取本地配置，文件缺失或损坏时回退默认值 */
export const loadConfig = () => {
    try {
        const raw = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
        const defaults = createDefaultConfig();
        return {
            ...defaults,
            ...raw,
            selection: { ...defaults.selection, ...(raw.selection ?? {}) },
        };
    } catch {
        return createDefaultConfig();
    }
};

/** 保存本地配置（自动补齐缺失字段并格式化写入） */
export const saveConfig = config => {
    const merged = {
        ...createDefaultConfig(),
        ...config,
        selection: { ...createDefaultConfig().selection, ...(config.selection ?? {}) },
    };
    mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
    writeFileSync(CONFIG_PATH, `${JSON.stringify(merged, null, 4)}\n`, 'utf8');
};

/** vite 配置文件候选（按优先级顺序探测，命中第一个即解析） */
const VITE_CONFIG_FILES = ['vite.config.ts', 'vite.config.mts', 'vite.config.js', 'vite.config.mjs', 'vite.config.cjs'];

/**
 * 从 vite 配置中解析开发服务器端口
 * @description 依次探测 .ts/.mts/.js/.mjs/.cjs 五种文件名，正则匹配 `port: <数字>`；
 * 兼容 defineConfig 对象写法与函数式写法（函数体内 return 的字面量同样能被正则命中）
 * @param dir - 应用目录
 * @returns 端口号；未显式配置或无配置文件时返回 null（由调用方回退 vite 默认值）
 */
const readPortFromViteConfig = dir => {
    for (const file of VITE_CONFIG_FILES) {
        const configPath = path.join(dir, file);
        if (!existsSync(configPath)) {
            continue;
        }
        const content = readFileSync(configPath, 'utf8');
        // 兼容 server.port: 2000 的各种空格写法（含函数式 config 内 return 的字面量）
        const match = content.match(/port\s*:\s*(\d+)/);
        if (match) {
            return Number(match[1]);
        }
    }
    return null;
};

/** 读取目录下 package.json 的关键字段，缺失时返回空对象 */
const readPackageMeta = dir => {
    const pkgPath = path.join(dir, 'package.json');
    if (!existsSync(pkgPath)) {
        return null;
    }
    return JSON.parse(readFileSync(pkgPath, 'utf8'));
};

/**
 * 解析 pnpm-workspace.yaml 的 packages 字段（极简手写解析，仅取顶层 packages 列表）
 * @description 不引入 yaml 依赖：逐行扫描 `packages:` 下的 `- 'glob'` 条目，
 * 遇到非列表的顶层键即结束；文件缺失时回退默认 `apps/*` + `packages/*`
 * @returns glob 字符串数组
 */
const readWorkspaceGlobs = () => {
    const wsPath = path.join(ROOT_DIR, 'pnpm-workspace.yaml');
    if (!existsSync(wsPath)) {
        return ['apps/*', 'packages/*'];
    }
    const content = readFileSync(wsPath, 'utf8');
    const globs = [];
    let inPackages = false;
    for (const line of content.split('\n')) {
        // 跳过注释行
        if (/^\s*#/.test(line)) {
            continue;
        }
        // 进入 packages 列表
        if (/^packages\s*:/.test(line)) {
            inPackages = true;
            continue;
        }
        if (inPackages) {
            // 列表项：- 'glob' 或 - glob
            const itemMatch = line.match(/^\s*-\s*['"]?([^'"]+?)['"]?\s*$/);
            if (itemMatch) {
                globs.push(itemMatch[1].trim());
                continue;
            }
            // 遇到顶格非空行（下一个顶层键），列表结束
            if (/^\S/.test(line)) {
                inPackages = false;
            }
        }
    }
    return globs.length ? globs : ['apps/*', 'packages/*'];
};

/**
 * 展开 workspace glob 为实际目录绝对路径
 * @description 仅支持末段含 `*` 的通配（如 `apps/*`、`packages/*`），无 `*` 时视为直接路径；
 * 通配段过滤为目录且含 package.json（避免扫到 README 等杂项）
 * @param globStr - pnpm-workspace.yaml 中的 glob 字符串
 * @returns 目录绝对路径数组
 */
const expandGlob = globStr => {
    const full = path.join(ROOT_DIR, globStr);
    if (globStr.includes('*')) {
        const parent = path.dirname(full);
        if (!existsSync(parent)) {
            return [];
        }
        return readdirSync(parent)
            .map(name => path.join(parent, name))
            .filter(dir => {
                try {
                    return statSync(dir).isDirectory();
                } catch {
                    return false;
                }
            });
    }
    return existsSync(full) ? [full] : [];
};

/**
 * 依据目录相对路径判定条目类型
 * @description apps/ 下视为应用（dev server），其余视为包（watch 构建/构建一次）；
 * 与原硬编码行为保持一致，同时兼容 workspace 中其他位置的包
 */
const kindOfDir = dir => {
    const rel = path.relative(ROOT_DIR, dir);
    return rel.startsWith(`apps${path.sep}`) || rel.startsWith('apps/') ? 'app' : 'package';
};

/**
 * 扫描全部可启动条目（每次调用实时重扫）
 * @returns 条目数组：{ kind, name, displayName, dir, description, port, hasDevScript, buildIsWatch, command, extra }
 */
export const scanEntries = () => {
    const config = loadConfig();
    const excluded = new Set(config.exclude ?? []);
    const entries = [];
    const seenDirs = new Set();

    // workspace 自动扫描：读 pnpm-workspace.yaml，展开全部 glob，按目录位置判定 app/package
    for (const globStr of readWorkspaceGlobs()) {
        for (const dir of expandGlob(globStr)) {
            // 排除启动器控制台前端自身
            if (path.resolve(dir) === path.resolve(LAUNCHER_WEB_DIR)) {
                continue;
            }
            if (seenDirs.has(dir)) {
                continue;
            }
            const pkg = readPackageMeta(dir);
            if (!pkg) {
                continue; // 跳过 README.md 等非包目录
            }
            const name = path.basename(dir);
            if (excluded.has(name)) {
                continue;
            }
            seenDirs.add(dir);
            const hasDevScript = Boolean(pkg.scripts?.dev);
            // build 脚本含 --watch / -w 时视为 watch 构建（无 dev 脚本也能持续运行）
            const buildIsWatch = !hasDevScript && /(^|\s)(--watch|-w)(\b|=)/.test(pkg.scripts?.build ?? '');
            entries.push({
                kind: kindOfDir(dir),
                name,
                displayName: pkg.name ?? name,
                dir,
                description: pkg.description ?? '',
                port: readPortFromViteConfig(dir) ?? VITE_DEFAULT_PORT,
                hasDevScript,
                buildIsWatch,
                command: null,
                extra: false,
            });
        }
    }

    // 手工兜底条目：目录不在 workspace 下或需要自定义命令的场景
    for (const item of config.extra ?? []) {
        if (!item?.name || excluded.has(item.name)) {
            continue;
        }
        const dir = path.resolve(ROOT_DIR, item.dir ?? item.name);
        const pkg = readPackageMeta(dir) ?? {};
        if (seenDirs.has(dir)) {
            continue; // workspace 已收录则跳过，避免重复
        }
        seenDirs.add(dir);
        const hasDevScript = Boolean(item.command) || Boolean(pkg.scripts?.dev);
        entries.push({
            kind: item.kind === 'package' ? 'package' : 'app',
            name: item.name,
            displayName: pkg.name ?? item.name,
            dir,
            description: item.description ?? pkg.description ?? '',
            port: item.port ?? readPortFromViteConfig(dir) ?? VITE_DEFAULT_PORT,
            hasDevScript,
            buildIsWatch: false,
            command: item.command ?? null,
            extra: true,
        });
    }

    return entries;
};

/**
 * 向目标进程及其整棵后代进程树发送信号
 * @description 先收集后代（pgrep -P 递归）再逐层发送，并对每个进程尝试进程组信号
 * （pnpm 可能把脚本放进独立进程组，仅杀根进程会残留孤儿 vite/tsc）
 * @param pid - 根进程 PID
 * @param signal - 信号名（SIGTERM / SIGKILL）
 */
const killProcessTree = (pid, signal) => {
    const descendants = [];
    const collect = parent => {
        let children = [];
        try {
            children = execFileSync('pgrep', ['-P', String(parent)], { encoding: 'utf8' })
                .trim()
                .split('\n')
                .filter(Boolean)
                .map(Number);
        } catch {
            /* 无后代进程 */
        }
        for (const child of children) {
            descendants.push(child);
            collect(child);
        }
    };
    collect(pid);

    // 从叶子到根：先尝试进程组信号（-pid），失败则退化为单进程信号
    const signalTo = target => {
        try {
            process.kill(-target, signal);
        } catch {
            try {
                process.kill(target, signal);
            } catch {
                /* 进程已退出 */
            }
        }
    };
    for (const child of descendants.reverse()) {
        signalTo(child);
    }
    signalTo(pid);
};

/**
 * 进程管理器
 * @description 维护每个条目的运行状态：进程引用、环形缓冲日志、实际端口（从输出校准）、
 * 状态机（stopped → starting → running / exited），并提供启动/停止（杀整棵进程树）能力
 */
export class ProcessManager {
    /** @type {Map<string, { entry: object, proc: import('node:child_process').ChildProcess | null, logs: string[], status: string, actualPort: number | null, oneShot: boolean, exitCode: number | null }>} */
    #processes = new Map();

    /**
     * @param {(name: string, line: string) => void} [onLog] - 日志回调（终端侧用于带前缀输出）
     */
    constructor(onLog) {
        this.onLog = onLog ?? null;
    }

    /**
     * 启动条目对应的服务
     * @param entry - scanEntries 返回的条目
     * @returns { ok: boolean, message: string }
     */
    start(entry) {
        const existing = this.#processes.get(entry.name);
        if (existing?.proc && existing.proc.exitCode === null) {
            return { ok: false, message: '已在运行中' };
        }

        // 命令优先级：extra 自定义命令 > 有 dev 脚本用 dev > 否则用 build（含 --watch 时为 watch 构建）
        const command = entry.command ?? `pnpm -F ${entry.displayName} ${entry.hasDevScript ? 'dev' : 'build'}`;
        // detached + 进程组：停止时可连带杀掉 pnpm 派生的 vite/tsc 子进程
        const proc = spawn('bash', ['-c', command], {
            cwd: ROOT_DIR,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        const state = {
            entry,
            proc,
            logs: [],
            status: 'starting',
            actualPort: null,
            // 一次性构建：包无 dev 脚本且 build 脚本非 watch，且非 extra 自定义命令
            oneShot: !entry.hasDevScript && !entry.buildIsWatch && entry.kind === 'package' && !entry.command,
            exitCode: null,
            startedAt: Date.now(),
        };
        this.#processes.set(entry.name, state);

        const appendLog = text => {
            for (const line of text.split('\n')) {
                if (!line.trim()) {
                    continue;
                }
                state.logs.push(line);
                if (state.logs.length > MAX_LOG_LINES) {
                    state.logs.shift();
                }
                this.onLog?.(entry.name, line);
            }
        };

        proc.stdout.on('data', chunk => {
            const text = chunk.toString();
            appendLog(text);
            // 应用 dev server：从 vite 输出校准实际端口（端口被占用自动 +1 时也能拿到真实端口）
            const portMatch = text.match(/Local:\s+http:\/\/[^:/\s]+:(\d+)/);
            if (portMatch && state.status === 'starting') {
                state.actualPort = Number(portMatch[1]);
                state.status = 'running';
            }
            // 包 watch 构建：vite build --watch 输出监听提示后视为运行中
            if (state.status === 'starting' && /watching for file changes/i.test(text)) {
                state.status = 'running';
            }
        });
        proc.stderr.on('data', chunk => appendLog(chunk.toString()));

        proc.on('exit', code => {
            state.exitCode = code;
            state.proc = null;
            // 一次性构建（包无 dev 脚本）正常退出视为完成；其余退出视为停止
            state.status = state.oneShot && code === 0 ? 'done' : 'stopped';
            this.onLog?.(entry.name, `进程已退出（code=${code}）`);
        });

        return { ok: true, message: '已启动' };
    }

    /**
     * 停止条目对应的服务（SIGTERM 进程组，5 秒未退出则 SIGKILL）
     * @param name - 条目名称
     * @returns { ok: boolean, message: string }
     */
    stop(name) {
        const state = this.#processes.get(name);
        if (!state?.proc) {
            return { ok: false, message: '未在运行' };
        }
        // SIGTERM 整棵进程树（pnpm 可能另起进程组，需逐层清理）
        killProcessTree(state.proc.pid, 'SIGTERM');
        state.status = 'stopping';
        // 兜底强杀：5 秒后仍有未退出进程则 SIGKILL 整棵树
        setTimeout(() => {
            if (state.proc && state.proc.exitCode === null) {
                killProcessTree(state.proc.pid, 'SIGKILL');
            }
        }, 5000);
        return { ok: true, message: '已发送停止信号' };
    }

    /** 停止全部服务（CLI/页面「停止全部」共用） */
    stopAll() {
        for (const name of this.#processes.keys()) {
            this.stop(name);
        }
    }

    /**
     * 将扫描结果与运行状态合并，供页面/CLI 渲染
     * @returns 条目 + 状态数组
     */
    list() {
        return scanEntries().map(entry => {
            const state = this.#processes.get(entry.name);
            return {
                ...entry,
                status: state?.status ?? 'stopped',
                actualPort: state?.actualPort ?? null,
                exitCode: state?.exitCode ?? null,
                startedAt: state?.startedAt ?? null,
            };
        });
    }

    /** 取某条目的最近日志（环形缓冲全部内容） */
    logs(name) {
        return this.#processes.get(name)?.logs ?? [];
    }
}
