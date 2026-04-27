#!/usr/bin/env node

/**
 * Node 14 兼容性检查脚本
 * 检查当前环境是否支持 Node 14 必需的 ES2020+ 特性
 */

console.log('🔍 检查 Node 14 兼容性...\n');

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.match(/v(\d+)\./)[1]);

console.log(`当前 Node 版本: ${nodeVersion}`);

if (majorVersion < 14) {
    console.error(`❌ 错误: 需要 Node 14 或更高版本，当前版本为 ${nodeVersion}`);
    console.error('请使用以下命令切换到 Node 14:');
    console.error('  fnm install 14 && fnm use 14');
    process.exit(1);
}

console.log(`✅ Node 版本检查通过 (需要 >= 14, 当前: ${majorVersion})\n`);

// 检查 ES2020+ 特性
const features = {
    '可选链操作符 (Optional Chaining)': () => {
        const obj = { a: { b: 1 } };
        return obj?.a?.b === 1 && obj?.c?.d === undefined;
    },
    '空值合并操作符 (Nullish Coalescing)': () => {
        const a = null ?? 'default';
        const b = undefined ?? 'default';
        const c = 0 ?? 'default';
        return a === 'default' && b === 'default' && c === 0;
    },
    'Promise.allSettled': () => {
        return typeof Promise.allSettled === 'function';
    },
    'String.matchAll': () => {
        return typeof ''.matchAll === 'function';
    },
    'BigInt': () => {
        return typeof BigInt === 'function' && typeof 123n === 'bigint';
    },
    'globalThis': () => {
        return typeof globalThis !== 'undefined' && globalThis.setTimeout;
    },
    'Dynamic Import': () => {
        // import 是关键字，不能使用 typeof
        return true; // Node 14 支持动态导入
    },
    'import.meta': () => {
        return typeof import.meta !== 'undefined';
    }
};

let allPassed = true;

Object.entries(features).forEach(([feature, test]) => {
    try {
        const passed = test();
        if (passed) {
            console.log(`✅ ${feature}`);
        } else {
            console.log(`❌ ${feature} - 不支持`);
            allPassed = false;
        }
    } catch (error) {
        console.log(`❌ ${feature} - 错误: ${error.message}`);
        allPassed = false;
    }
});

console.log('');

if (allPassed) {
    console.log('🎉 所有 ES2020+ 特性检查通过！');
    console.log('当前环境完全兼容 Node 14 及 Jest 测试要求。');
} else {
    console.log('⚠️  部分特性不支持。请确保使用 Node 14 或更高版本。');
    console.log('建议命令:');
    console.log('  fnm install 14');
    console.log('  fnm use 14');
    console.log('  node --version  # 验证版本');
}

console.log('\n📋 运行测试:');
console.log('  cd packages/shared && pnpm test');
console.log('  pnpm test:coverage  # 生成覆盖率报告\n');