#!/usr/bin/env node
/**
 * 开发启动器入口
 * @description pnpm dev → Web 控制台（默认）；pnpm dev --cli → 终端多选交互。
 * 两种模式共用 scripts/dev-launcher/core.mjs 的发现与进程管理逻辑。
 * 不使用顶层 await：CLI 常驻等待由子进程句柄维持事件循环，避免 unsettled 警告。
 */

import { runCli } from './cli.mjs';
import { startServer } from './server.mjs';

// 解析命令行参数：--cli 走终端交互；--port 指定 Web 控制台端口
const args = process.argv.slice(2);
const useCli = args.includes('--cli') || args.includes('-c');
const portArgIndex = args.findIndex(arg => arg === '--port');
const portArg = portArgIndex >= 0 ? Number(args[portArgIndex + 1]) : undefined;

if (useCli) {
    runCli().then(code => {
        process.exitCode = code;
    });
} else {
    startServer({ port: portArg }).catch(err => {
        console.error('[launcher] 控制台启动失败:', err.message);
        process.exitCode = 1;
    });
}
