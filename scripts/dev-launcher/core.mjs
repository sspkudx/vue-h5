/**
 * 开发启动器核心模块
 * @description 负责：
 * 1. 自动发现 apps/* 与 packages/*（每次调用重新扫描，新增即出现）
 * 2. 读取/写入 .dev-launcher.json（记忆上次勾选 + exclude 排除 + extra 手工兜底条目）
 * 3. 进程管理：spawn/kill 服务进程、环形缓冲日志、从 vite 输出校准实际端口
 */

import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 项目根目录（本文件位于 scripts/dev-launcher/ 下，向上两级） */
export const ROOT_DIR = fileURLToPath(new URL('../..', import.meta.url));

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

/**
 * 从 vite.config.ts 中解析开发服务器端口
 * @param dir - 应用目录
 * @returns 端口号；未显式配置时返回 null（由调用方回退 vite 默认值）
 */
const readPortFromViteConfig = dir => {
    const viteConfigPath = path.join(dir, 'vite.config.ts');
    if (!existsSync(viteConfigPath)) {
        return null;
    }
    const content = readFileSync(viteConfigPath, 'utf8');
    // 兼容 server.port: 2000 的各种空格写法
    const match = content.match(/port\s*:\s*(\d+)/);
    return match ? Number(match[1]) : null;
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
 * 扫描全部可启动条目（每次调用实时重扫）
 * @returns 条目数组：{ kind, name, displayName, dir, description, port, hasDevScript, command, extra }
 */
export const scanEntries = () => {
    const config = loadConfig();
    const excluded = new Set(config.exclude ?? []);
    const entries = [];

    // 标准目录扫描：apps/* 视为应用（dev server），packages/* 视为包（watch 构建/构建一次）
    for (const [kind, subdir] of [
        ['app', 'apps'],
        ['package', 'packages'],
    ]) {
        const base = path.join(ROOT_DIR, subdir);
        if (!existsSync(base)) {
            continue;
        }
        for (const name of readdirSync(base)) {
            if (excluded.has(name)) {
                continue;
            }
            const dir = path.join(base, name);
            const pkg = readPackageMeta(dir);
            if (!pkg) {
                continue; // 跳过 README.md 等非包目录
            }
            entries.push({
                kind,
                name,
                displayName: pkg.name ?? name,
                dir,
                description: pkg.description ?? '',
                port: readPortFromViteConfig(dir) ?? VITE_DEFAULT_PORT,
                hasDevScript: Boolean(pkg.scripts?.dev),
                command: null,
                extra: false,
            });
        }
    }

    // 手工兜底条目：目录不在 apps/packages 下或需要自定义命令的场景
    for (const item of config.extra ?? []) {
        if (!item?.name || excluded.has(item.name)) {
            continue;
        }
        const dir = path.resolve(ROOT_DIR, item.dir ?? item.name);
        const pkg = readPackageMeta(dir) ?? {};
        entries.push({
            kind: item.kind === 'package' ? 'package' : 'app',
            name: item.name,
            displayName: pkg.name ?? item.name,
            dir,
            description: item.description ?? pkg.description ?? '',
            port: item.port ?? readPortFromViteConfig(dir) ?? VITE_DEFAULT_PORT,
            hasDevScript: Boolean(item.command) || Boolean(pkg.scripts?.dev),
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

        // 命令优先级：extra 自定义命令 > 有 dev 脚本用 dev > 包无 dev 脚本则构建一次
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
            oneShot: !entry.hasDevScript && entry.kind === 'package' && !entry.command,
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
