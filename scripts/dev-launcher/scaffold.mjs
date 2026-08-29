/**
 * 开发启动器脚手架模块
 * @description 供 Web 控制台「新建应用 / 新建包」调用，将 create-vue-app /
 * create-a-package 技能的程序化流程落地为可复用代码：
 * 1. 名称/端口校验（npm 规范 + workspace 内查重，防路径穿越）
 * 2. 模板复制 + 占位符替换（templates/ 下的文件模板，见 templates/README.md）
 * 3. 应用可选：更新根目录 package.json 的 dev/build/lint:{name} 脚本
 * 4. 包可选：生成 __tests__ 测试文件
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT_DIR, scanEntries } from './core.mjs';

/** 模板根目录（本模块位于 scripts/dev-launcher/ 下） */
const TEMPLATES_DIR = fileURLToPath(new URL('./templates', import.meta.url));

/** npm 包名规范：小写字母/数字/连字符，不能以连字符开头 */
const NAME_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const NAME_MAX_LEN = 50;

/** 包类型 → 模板变体目录名 */
export const PACKAGE_TYPE_TO_VARIANT = {
    utility: 'utility',
    component: 'component',
    helper: 'helper',
    plugin: 'plugin',
};

/**
 * 展开模板目录为「相对路径 → 文件内容」映射（跳过子目录）
 * @param dir - 模板目录绝对路径
 * @returns Map<相对路径, 文件内容>
 */
const readTemplateTree = dir => {
    const files = new Map();
    const walk = current => {
        for (const name of readdirSync(current)) {
            const full = path.join(current, name);
            if (statSync(full).isDirectory()) {
                walk(full);
            } else {
                files.set(path.relative(dir, full), readFileSync(full, 'utf8'));
            }
        }
    };
    walk(dir);
    return files;
};

/** 渲染模板：将占位符替换为实际值；支持 {{token}} 与裸标识符 __TOKEN__（后者用于必须保持合法 TS/JS 语法的模板） */
const render = (content, tokens) => {
    let out = Object.entries(tokens).reduce((acc, [token, value]) => acc.replaceAll(`{{${token}}}`, value), content);
    for (const [token, value] of Object.entries(tokens)) {
        if (token.startsWith('__') && token.endsWith('__')) {
            out = out.replaceAll(token, value);
        }
    }
    return out;
};

/**
 * 仅校验，不生成：应用名是否符合规范且未被占用
 * @param name - 应用名
 * @returns 错误消息；通过时返回 ''
 */
export const validateAppName = name => {
    if (!name || !NAME_RE.test(name) || name.length > NAME_MAX_LEN) {
        return '应用名称需为 1-50 位小写字母/数字/连字符（如 my-app）；不能以连字符开头';
    }
    const target = path.join(ROOT_DIR, 'apps', name);
    if (existsSync(target)) {
        return `apps/${name} 已存在`;
    }
    return '';
};

/**
 * 仅校验，不生成：包名是否符合规范且未被占用
 * @param name - 包名（不含 @my-app/ 前缀）
 * @returns 错误消息；通过时返回 ''
 */
export const validatePackageName = name => {
    if (!name || !NAME_RE.test(name) || name.length > NAME_MAX_LEN) {
        return '包名称需为 1-50 位小写字母/数字/连字符（如 utils、ui-components）；不能以连字符开头';
    }
    const target = path.join(ROOT_DIR, 'packages', name);
    if (existsSync(target)) {
        return `packages/${name} 已存在`;
    }
    return '';
};

/**
 * 校验包类型
 * @param type - 包类型
 * @returns 错误消息；通过时返回 ''
 */
export const validatePackageType = type => {
    if (!PACKAGE_TYPE_TO_VARIANT[type]) {
        return `未知包类型：${type}（可用：${Object.keys(PACKAGE_TYPE_TO_VARIANT).join(' / ')}）`;
    }
    return '';
};

/** 校验端口：合法区间 + 不与现有应用冲突（扫描实时端口） */
export const validatePort = (port, name) => {
    if (port === undefined || port === null || port === '') {
        return '';
    }
    const num = typeof port === 'number' ? port : Number(port);
    if (!Number.isInteger(num) || num < 1024 || num > 65535) {
        return '端口需为 1024-65535 的整数';
    }
    const conflict = scanEntries().find(item => item.kind === 'app' && item.port === num && item.name !== name);
    if (conflict) {
        return `端口 ${num} 已被 ${conflict.displayName} 使用`;
    }
    return '';
};

/**
 * 写入模板目录到目标位置
 * @param templateDir - 模板目录绝对路径
 * @param destDir - 目标目录绝对路径
 * @param tokens - 占位符替换映射
 * @param includeTests - 是否包含模板的 tests/ 目录
 * @param testSource - tests 源文件名（utility.test.ts 等）
 * @param testDest - 目标测试文件名（__tests__/index.test.ts 等）
 * @returns 生成的文件相对路径数组
 */
const writeTemplate = (templateDir, destDir, tokens) => {
    const files = readTemplateTree(templateDir);
    const written = [];
    for (const [rel, content] of files) {
        // 变体目录由 createPackage 按类型挑选，此处一律跳过
        if (rel.startsWith('variants/') || rel.startsWith('tests/')) {
            continue;
        }
        const destPath = path.join(destDir, rel);
        mkdirSync(path.dirname(destPath), { recursive: true });
        writeFileSync(destPath, render(content, tokens), 'utf8');
        written.push(rel);
    }
    return written;
};

/**
 * 更新根目录 package.json 的 scripts（dev/build/lint:{name}）
 * @param name - 应用名
 * @returns 新增的脚本名数组
 */
export const updateRootScripts = name => {
    const rootPkgPath = path.join(ROOT_DIR, 'package.json');
    const pkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
    const scripts = pkg.scripts ?? {};
    scripts[`dev:${name}`] = `pnpm -F ${name} dev`;
    scripts[`build:${name}`] = `pnpm -F ${name} build`;
    scripts[`lint:${name}`] = `pnpm -F ${name} lint`;
    pkg.scripts = scripts;
    writeFileSync(rootPkgPath, `${JSON.stringify(pkg, null, 4)}\n`, 'utf8');
    return [`dev:${name}`, `build:${name}`, `lint:${name}`];
};

/**
 * 创建新 Vue 应用
 * @param options - { name, port?, withScripts }
 * @returns { ok: true, dir, files, scripts? } ；校验失败抛 Error（message 可直接展示给用户）
 */
export const createApp = options => {
    const name = options.name;
    const err = validateAppName(name);
    if (err) {
        throw new Error(err);
    }
    const port = options.port === undefined || options.port === '' ? 3000 : Number(options.port);
    const portErr = validatePort(port, name);
    if (portErr) {
        throw new Error(portErr);
    }

    const destDir = path.join(ROOT_DIR, 'apps', name);
    const tokens = { 'app-name': name, port: String(port), __LAUNCHER_PORT__: String(port) };
    const files = writeTemplate(path.join(TEMPLATES_DIR, 'app'), destDir, tokens);

    let scripts = null;
    if (options.withScripts !== false) {
        scripts = updateRootScripts(name);
    }

    return { ok: true, dir: `apps/${name}`, files, scripts };
};

/**
 * 创建新依赖包
 * @param options - { name, description?, type, withTests? }
 * @returns { ok: true, dir, files, tests? } ；校验失败抛 Error
 */
export const createPackage = options => {
    const name = options.name;
    const err = validatePackageName(name);
    if (err) {
        throw new Error(err);
    }
    const type = options.type ?? 'utility';
    const typeErr = validatePackageType(type);
    if (typeErr) {
        throw new Error(typeErr);
    }
    const description = (options.description ?? '').trim() || '由开发启动器创建的工具包';
    const withTests = options.withTests !== false;

    const variant = PACKAGE_TYPE_TO_VARIANT[type];
    const destDir = path.join(ROOT_DIR, 'packages', name);
    const tokens = { 'package-name': name, description };

    // 公共文件（tsconfig / vite.config / README / src；tests/ 目录在此跳过）
    const files = writeTemplate(path.join(TEMPLATES_DIR, 'package'), destDir, tokens);

    // 类型变体文件（package.json / 类型特有源码 / 组件库特有 vite.config）
    const variantDir = path.join(TEMPLATES_DIR, 'package', 'variants', variant);
    const variantFiles = writeTemplate(variantDir, destDir, tokens);

    // 测试文件按类型选择
    let tests = null;
    if (withTests) {
        const testsMap = {
            utility: 'utility.test.ts',
            helper: 'helper.test.ts',
            plugin: 'plugin.test.ts',
            component: 'component.test.tsx',
        };
        const srcName = testsMap[type];
        const destName = type === 'component' ? 'Button.test.tsx' : 'index.test.ts';
        const testContent = readFileSync(path.join(TEMPLATES_DIR, 'package', 'tests', srcName), 'utf8');
        const testPath = path.join(destDir, '__tests__', destName);
        mkdirSync(path.dirname(testPath), { recursive: true });
        writeFileSync(testPath, render(testContent, tokens), 'utf8');
        tests = [`__tests__/${destName}`];
    }

    // 变体文件可能覆盖基础树同名文件（如 src/index.ts），合并去重保留后者
    const mergedFiles = [...new Map([...files, ...variantFiles].map(rel => [rel, rel])).values()];
    return { ok: true, dir: `packages/${name}`, files: mergedFiles, tests };
};

/** pnpm install 运行状态（供页面轮询，模块级单例） */
export const pkgInstallState = {
    running: false,
    logs: [],
    done: false,
    exitCode: null,
};

/**
 * 后台执行 pnpm install（新包首次入 workspace 锁文件时需要）
 * @param onLog - 日志回调（终端侧带前缀输出）
 * @returns { ok: boolean, message: string }
 */
export const runPkgInstall = onLog => {
    if (pkgInstallState.running) {
        return { ok: false, message: 'pnpm install 正在进行中，请稍候' };
    }
    pkgInstallState.running = true;
    pkgInstallState.done = false;
    pkgInstallState.exitCode = null;
    pkgInstallState.logs = [];

    const appendLog = line => {
        if (!line.trim()) {
            return;
        }
        pkgInstallState.logs.push(line);
        if (pkgInstallState.logs.length > 50) {
            pkgInstallState.logs.shift();
        }
        onLog?.(line);
    };

    const proc = spawn('bash', ['-c', 'pnpm install'], {
        cwd: ROOT_DIR,
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    proc.stdout.on('data', chunk => appendLog(chunk.toString()));
    proc.stderr.on('data', chunk => appendLog(chunk.toString()));
    proc.on('exit', code => {
        pkgInstallState.exitCode = code;
        pkgInstallState.running = false;
        pkgInstallState.done = true;
    });

    return { ok: true, message: '已在后台执行 pnpm install，安装日志见启动终端' };
};