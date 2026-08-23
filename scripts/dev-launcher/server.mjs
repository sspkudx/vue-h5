/**
 * Web 控制台后端
 * @description 原生 Node http 服务（零框架）：
 * - 托管 web/dist 下的 Vue 控制台构建产物（前端源码见 web/，构建：pnpm -F dev-launcher-web build）
 * - JSON API：条目列表（每次请求实时重扫）、启动/停止、保存勾选
 * - 子进程日志同时输出到启动终端的控制台（带 [名称] 前缀）
 */

import http from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, ProcessManager, ROOT_DIR, saveConfig, scanEntries } from './core.mjs';

/** 控制台默认端口，可用 --port 或环境变量 DEV_LAUNCHER_PORT 覆盖 */
export const DEFAULT_PORT = 8888;

/** 静态资源目录（Vue 前端构建产物） */
const PUBLIC_DIR = fileURLToPath(new URL('./web/dist', import.meta.url));

/** 产物缺失时的提示页（引导先构建前端） */
const BUILD_HINT_HTML = `<!doctype html>
<html lang="zh-Hans">
    <head>
        <meta charset="utf-8" />
        <title>vue-h5 开发启动器</title>
    </head>
    <body style="font-family: sans-serif; padding: 40px; line-height: 1.8">
        <h1>控制台前端尚未构建</h1>
        <p>请先在项目根目录执行：</p>
        <pre style="background: #f5f6f8; padding: 12px 16px; border-radius: 6px">pnpm install && pnpm build:launcher</pre>
        <p>完成后刷新本页。前端源码位于 <code>scripts/dev-launcher/web/</code>。</p>
    </body>
</html>`;

/** 静态资源 MIME 映射 */
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

/** 读取请求体（JSON） */
const readJsonBody = req =>
    new Promise(resolve => {
        let raw = '';
        req.on('data', chunk => {
            raw += chunk;
            // 防止超大请求体
            if (raw.length > 1e6) {
                req.destroy();
            }
        });
        req.on('end', () => {
            try {
                resolve(raw ? JSON.parse(raw) : {});
            } catch {
                resolve({});
            }
        });
        req.on('error', () => resolve({}));
    });

/** 统一 JSON 响应 */
const sendJson = (res, status, data) => {
    const body = JSON.stringify(data);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
};

/** 静态文件响应（仅允许产物目录内的文件；入口缺失时提示先构建前端） */
const serveStatic = (res, urlPath) => {
    if (!existsSync(path.join(PUBLIC_DIR, 'index.html'))) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(BUILD_HINT_HTML);
        return;
    }
    const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
    if (!filePath.startsWith(PUBLIC_DIR) || !existsSync(filePath) || !statSync(filePath).isFile()) {
        sendJson(res, 404, { ok: false, message: '资源不存在' });
        return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const content = readFileSync(filePath);
    res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream',
        'Content-Length': content.length,
    });
    res.end(content);
};

/**
 * 启动 Web 控制台服务
 * @param options - { port?: number }
 * @returns 服务实例
 */
export const startServer = (options = {}) => {
    const manager = new ProcessManager((name, line) => {
        // 子进程日志实时输出到启动器所在终端，带名称前缀便于区分多服务
        console.log(`[${name}] ${line}`);
    });

    const server = http.createServer(async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

        // 静态资源（页面入口与样式脚本）
        if (req.method === 'GET' && !url.pathname.startsWith('/api/')) {
            serveStatic(res, url.pathname === '/' ? '/index.html' : url.pathname);
            return;
        }

        // 条目列表：每次请求实时重扫，新增 app/package 自动出现
        if (req.method === 'GET' && url.pathname === '/api/entries') {
            sendJson(res, 200, { ok: true, entries: manager.list(), config: loadConfig() });
            return;
        }

        // 某条目的最近日志（环形缓冲）
        if (req.method === 'GET' && url.pathname === '/api/logs') {
            const name = url.searchParams.get('name') ?? '';
            sendJson(res, 200, { ok: true, name, logs: manager.logs(name) });
            return;
        }

        if (req.method === 'POST') {
            const body = await readJsonBody(req);

            // 启动条目
            if (url.pathname === '/api/start') {
                const entry = scanEntries().find(item => item.name === body.name);
                if (!entry) {
                    sendJson(res, 404, { ok: false, message: `条目不存在：${body.name}` });
                    return;
                }
                const result = manager.start(entry);
                sendJson(res, result.ok ? 200 : 409, result);
                return;
            }

            // 停止条目
            if (url.pathname === '/api/stop') {
                sendJson(res, 200, manager.stop(body.name ?? ''));
                return;
            }

            // 停止全部
            if (url.pathname === '/api/stop-all') {
                manager.stopAll();
                sendJson(res, 200, { ok: true, message: '已请求停止全部服务' });
                return;
            }

            // 保存勾选记忆（apps/packages 名称数组；null 表示首次/全选）
            if (url.pathname === '/api/selection') {
                const config = loadConfig();
                config.selection = {
                    apps: Array.isArray(body.apps) ? body.apps : null,
                    packages: Array.isArray(body.packages) ? body.packages : null,
                };
                saveConfig(config);
                sendJson(res, 200, { ok: true, message: '已保存选择' });
                return;
            }
        }

        sendJson(res, 404, { ok: false, message: '接口不存在' });
    });

    // 退出清理：Ctrl+C 只命中启动器自身的进程组（服务均为 detached 独立组），
    // 必须显式停止全部子进程，否则会残留 dev server
    const shutdown = signal => {
        console.log(`\n[launcher] 收到 ${signal}，正在停止全部服务...`);
        manager.stopAll();
        setTimeout(() => process.exit(0), 1000);
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    const port = options.port ?? (Number(process.env.DEV_LAUNCHER_PORT) || DEFAULT_PORT);

    return new Promise((resolve, reject) => {
        // 端口被占用时自动 +1 重试，保证控制台总能起来
        const listen = attempt => {
            server.once('error', err => {
                if (err.code === 'EADDRINUSE' && attempt < 10) {
                    listen(attempt + 1);
                    return;
                }
                reject(err);
            });
            server.listen(port + attempt - 1, '127.0.0.1', () => {
                const actualPort = server.address().port;
                console.log('');
                console.log('========================================');
                console.log('  vue-h5 开发启动器（Web 控制台）');
                console.log(`  访问地址: http://localhost:${actualPort}`);
                console.log('  在页面勾选要启动的应用/包，点击「启动所选」');
                console.log('  服务日志实时输出在本终端，Ctrl+C 退出并停止全部');
                console.log('========================================');
                console.log('');
                resolve(server);
            });
        };
        listen(1);
    });
};
