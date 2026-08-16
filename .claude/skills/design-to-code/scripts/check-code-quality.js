#!/usr/bin/env node

/**
 * Design-to-Code 代码质量检查脚本
 * 
 * 此脚本用于检查生成的 Vue 3 代码是否符合项目规范。
 * 包括 TypeScript 类型、CSS Modules、mpx 单位、BEM 命名等检查。
 */

const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');
const stylelint = require('stylelint');

// 配置项
const CONFIG = {
    // 要检查的文件扩展名
    extensions: ['.tsx', '.ts', '.vue', '.less'],
    
    // 要检查的目录
    directories: ['src/components', 'src/views', 'src/styles'],
    
    // 必须使用的 mpx 单位
    requiredUnit: 'mpx',
    
    // 不允许使用的单位
    disallowedUnits: ['px', 'rem', 'em'],
    
    // 必须使用的颜色变量前缀
    colorVariablePrefix: '@',
    
    // BEM 命名正则
    bemPattern: /^[a-z]([a-z0-9-]+)?(__[a-z0-9]([a-z0-9-]+)?)?(--[a-z0-9]([a-z0-9-]+)?)?$/,
    
    // CSS 变量正则
    cssVariablePattern: /var\(--[a-z-]+\)|@[a-z-]+/,
};

/**
 * 检查目录下的所有文件
 */
async function checkAllFiles(directory) {
    const results = {
        passed: 0,
        failed: 0,
        warnings: 0,
        errors: [],
        warningsList: [],
    };

    try {
        const files = await getFiles(directory);
        
        for (const file of files) {
            if (CONFIG.extensions.some(ext => file.endsWith(ext))) {
                const result = await checkFile(file);
                if (result.status === 'passed') {
                    results.passed++;
                } else if (result.status === 'warning') {
                    results.warnings++;
                    results.warningsList.push({
                        file,
                        issues: result.issues,
                    });
                } else {
                    results.failed++;
                    results.errors.push({
                        file,
                        issues: result.issues,
                    });
                }
            }
        }
    } catch (error) {
        console.error(`检查目录时出错: ${directory}`, error.message);
    }

    return results;
}

/**
 * 递归获取所有文件
 */
async function getFiles(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(entry => {
            const fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ? getFiles(fullPath) : fullPath;
        })
    );
    return files.flat();
}

/**
 * 检查单个文件
 */
async function checkFile(filePath) {
    const ext = path.extname(filePath);
    const issues = [];

    try {
        const content = await fs.promises.readFile(filePath, 'utf8');

        if (ext === '.tsx' || ext === '.ts') {
            issues.push(...await checkTypeScriptFile(content, filePath));
        } else if (ext === '.vue') {
            issues.push(...await checkVueFile(content, filePath));
        } else if (ext === '.less') {
            issues.push(...await checkLessFile(content, filePath));
        }

        // 通用检查
        issues.push(...checkCommonIssues(content, filePath));
    } catch (error) {
        issues.push({
            type: 'error',
            message: `读取文件失败: ${error.message}`,
            line: 1,
        });
    }

    const hasErrors = issues.some(issue => issue.type === 'error');
    const hasWarnings = issues.some(issue => issue.type === 'warning');

    return {
        status: hasErrors ? 'failed' : hasWarnings ? 'warning' : 'passed',
        issues,
    };
}

/**
 * 检查 TypeScript/TSX 文件
 */
async function checkTypeScriptFile(content, filePath) {
    const issues = [];

    // 检查 TypeScript 类型使用
    if (!content.includes('PropType') && content.includes('props:')) {
        issues.push({
            type: 'warning',
            message: '建议使用 PropType 定义组件 props 类型',
            line: getLineNumber(content, 'props:'),
        });
    }

    // 检查是否使用了 any 类型
    const anyRegex = /:\s*any\b/g;
    let match;
    while ((match = anyRegex.exec(content)) !== null) {
        issues.push({
            type: 'warning',
            message: '避免使用 any 类型，请使用具体的类型定义',
            line: getLineNumber(content, match.index),
        });
    }

    // 检查 defineComponent 使用
    if (content.includes('export default') && !content.includes('defineComponent')) {
        issues.push({
            type: 'error',
            message: 'Vue 3 组件必须使用 defineComponent 定义',
            line: getLineNumber(content, 'export default'),
        });
    }

    // 检查 JSX 语法
    if (content.includes('setup()') && !content.includes('return render')) {
        issues.push({
            type: 'warning',
            message: '建议在 setup 函数中返回 render 函数',
            line: getLineNumber(content, 'setup()'),
        });
    }

    return issues;
}

/**
 * 检查 Vue 文件
 */
async function checkVueFile(content, filePath) {
    const issues = [];

    // 检查 template 部分是否使用 JSX
    if (content.includes('<template>') && content.includes('</template>')) {
        issues.push({
            type: 'warning',
            message: '建议使用 JSX 语法替代 template 标签',
            line: getLineNumber(content, '<template>'),
        });
    }

    // 检查 script setup 语法
    if (content.includes('<script setup>')) {
        issues.push({
            type: 'info',
            message: '使用了 script setup 语法糖',
            line: getLineNumber(content, '<script setup>'),
        });
    }

    // 检查样式部分
    if (content.includes('<style>')) {
        const styleStart = content.indexOf('<style>');
        const styleEnd = content.indexOf('</style>');
        const styleContent = content.substring(styleStart, styleEnd + 8);
        
        // 检查是否使用 CSS Modules
        if (styleContent.includes('<style>') && !styleContent.includes('module')) {
            issues.push({
                type: 'error',
                message: 'Vue 单文件组件样式应使用 CSS Modules (添加 module 属性)',
                line: getLineNumber(content, '<style>'),
            });
        }

        // 检查是否使用 mpx 单位
        const pxRegex = /(\d+)px/g;
        let pxMatch;
        while ((pxMatch = pxRegex.exec(styleContent)) !== null) {
            issues.push({
                type: 'error',
                message: `应使用 mpx 单位，而不是 px 单位: ${pxMatch[0]}`,
                line: getLineNumber(content, pxMatch.index),
            });
        }
    }

    return issues;
}

/**
 * 检查 Less 文件
 */
async function checkLessFile(content, filePath) {
    const issues = [];

    // 检查是否使用 CSS Modules
    if (!filePath.includes('.module.less')) {
        issues.push({
            type: 'error',
            message: '样式文件应使用 .module.less 后缀以启用 CSS Modules',
            line: 1,
        });
    }

    // 检查是否使用 mpx 单位
    const disallowedUnits = CONFIG.disallowedUnits.join('|');
    const unitRegex = new RegExp(`(\\d+)(${disallowedUnits})(?!\\s*[\\/*])`, 'gi');
    let unitMatch;
    while ((unitMatch = unitRegex.exec(content)) !== null) {
        issues.push({
            type: 'error',
            message: `应使用 ${CONFIG.requiredUnit} 单位，而不是 ${unitMatch[2]} 单位: ${unitMatch[0]}`,
            line: getLineNumber(content, unitMatch.index),
        });
    }

    // 检查 BEM 命名规范
    const classRegex = /\.([a-zA-Z0-9_-]+)/g;
    let classMatch;
    while ((classMatch = classRegex.exec(content)) !== null) {
        const className = classMatch[1];
        // 跳过 CSS 变量和 mixins
        if (!className.startsWith('--') && !className.includes('(')) {
            const parts = className.split(/[._]/);
            const mainClass = parts[0];
            
            // 检查是否是有效的 BEM 命名
            if (!CONFIG.bemPattern.test(mainClass) && !isCssVariable(className)) {
                issues.push({
                    type: 'warning',
                    message: `类名 "${mainClass}" 可能不符合 BEM 命名规范`,
                    line: getLineNumber(content, classMatch.index),
                });
            }
        }
    }

    // 检查是否使用颜色变量
    const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(/g;
    let colorMatch;
    while ((colorMatch = colorRegex.exec(content)) !== null) {
        // 跳过注释中的颜色
        const line = content.substring(0, colorMatch.index).split('\n').length;
        const lineContent = content.split('\n')[line - 1];
        
        if (!lineContent.includes('//') && !lineContent.includes('/*')) {
            issues.push({
                type: 'warning',
                message: `建议使用颜色变量替代硬编码颜色: ${colorMatch[0]}`,
                line: line,
            });
        }
    }

    return issues;
}

/**
 * 检查通用问题
 */
function checkCommonIssues(content, filePath) {
    const issues = [];

    // 检查文件头是否有 TypeScript 类型导入
    if (path.extname(filePath) === '.tsx') {
        if (!content.includes("import { defineComponent } from 'vue'")) {
            issues.push({
                type: 'error',
                message: '缺少 Vue defineComponent 导入',
                line: 1,
            });
        }
    }

    // 检查是否使用了路径别名
    if (content.includes('../..')) {
        issues.push({
            type: 'warning',
            message: '建议使用路径别名 (@/) 替代相对路径',
            line: getLineNumber(content, '../..'),
        });
    }

    // 检查是否有 console.log 等调试代码
    const debugRegex = /console\.(log|warn|error|info)\(/g;
    let debugMatch;
    while ((debugMatch = debugRegex.exec(content)) !== null) {
        issues.push({
            type: 'warning',
            message: '生产代码中应移除调试语句',
            line: getLineNumber(content, debugMatch.index),
        });
    }

    return issues;
}

/**
 * 是否为 CSS 变量
 */
function isCssVariable(className) {
    return className.startsWith('--') || CONFIG.cssVariablePattern.test(className);
}

/**
 * 获取行号
 */
function getLineNumber(content, position) {
    if (typeof position === 'number') {
        return content.substring(0, position).split('\n').length;
    } else if (typeof position === 'string') {
        const index = content.indexOf(position);
        if (index !== -1) {
            return content.substring(0, index).split('\n').length;
        }
    }
    return 1;
}

/**
 * 运行 ESLint 检查
 */
async function runESLintCheck(filePath) {
    try {
        const eslint = new ESLint({
            useEslintrc: true,
            cwd: process.cwd(),
        });

        const results = await eslint.lintFiles([filePath]);
        const issues = [];

        for (const result of results) {
            for (const message of result.messages) {
                issues.push({
                    type: message.severity === 2 ? 'error' : 'warning',
                    message: `${message.ruleId}: ${message.message}`,
                    line: message.line,
                });
            }
        }

        return issues;
    } catch (error) {
        console.error(`ESLint 检查失败: ${error.message}`);
        return [];
    }
}

/**
 * 运行 Stylelint 检查
 */
async function runStylelintCheck(filePath) {
    try {
        const result = await stylelint.lint({
            files: filePath,
            config: {
                extends: ['stylelint-config-standard', 'stylelint-config-recommended-less', 'stylelint-config-recommended-vue'],
            },
        });

        const issues = [];
        for (const warning of result.results[0].warnings) {
            issues.push({
                type: warning.severity === 'error' ? 'error' : 'warning',
                message: `${warning.rule}: ${warning.text}`,
                line: warning.line,
            });
        }

        return issues;
    } catch (error) {
        console.error(`Stylelint 检查失败: ${error.message}`);
        return [];
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('🔍 开始 Design-to-Code 代码质量检查...\n');
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalWarnings = 0;
    const allErrors = [];
    const allWarnings = [];

    // 检查所有目录
    for (const dir of CONFIG.directories) {
        if (fs.existsSync(dir)) {
            console.log(`📁 检查目录: ${dir}`);
            const results = await checkAllFiles(dir);
            
            totalPassed += results.passed;
            totalFailed += results.failed;
            totalWarnings += results.warnings;
            allErrors.push(...results.errors);
            allWarnings.push(...results.warningsList);
            
            console.log(`   ✅ 通过: ${results.passed}, ⚠️ 警告: ${results.warnings}, ❌ 失败: ${results.failed}`);
        } else {
            console.log(`📁 跳过不存在的目录: ${dir}`);
        }
    }

    // 汇总结果
    console.log('\n📊 检查结果汇总:');
    console.log(`   ✅ 总通过数: ${totalPassed}`);
    console.log(`   ⚠️ 总警告数: ${totalWarnings}`);
    console.log(`   ❌ 总失败数: ${totalFailed}`);

    // 输出错误
    if (allErrors.length > 0) {
        console.log('\n❌ 错误详情:');
        for (const error of allErrors) {
            console.log(`\n   📄 文件: ${error.file}`);
            for (const issue of error.issues) {
                console.log(`     ${issue.type === 'error' ? '❌' : '⚠️'} 行 ${issue.line}: ${issue.message}`);
            }
        }
    }

    // 输出警告
    if (allWarnings.length > 0) {
        console.log('\n⚠️ 警告详情:');
        for (const warning of allWarnings) {
            console.log(`\n   📄 文件: ${warning.file}`);
            for (const issue of warning.issues) {
                if (issue.type === 'warning') {
                    console.log(`     ⚠️ 行 ${issue.line}: ${issue.message}`);
                }
            }
        }
    }

    // 总结和建议
    console.log('\n💡 建议:');
    
    if (totalFailed > 0) {
        console.log('   1. 请优先修复所有错误 (❌)');
        console.log('   2. 确保所有样式使用 mpx 单位');
        console.log('   3. 检查 Vue 组件是否使用 defineComponent');
        console.log('   4. 确保样式文件使用 .module.less 后缀');
    }
    
    if (totalWarnings > 0) {
        console.log('   1. 考虑修复警告以提高代码质量');
        console.log('   2. 检查是否使用了硬编码颜色值');
        console.log('   3. 确保类名符合 BEM 命名规范');
        console.log('   4. 避免使用 any 类型，使用具体类型');
    }
    
    if (totalFailed === 0 && totalWarnings === 0) {
        console.log('   🎉 所有代码符合规范！');
    }
    
    // 退出码
    process.exit(totalFailed > 0 ? 1 : 0);
}

// 运行主函数
if (require.main === module) {
    main().catch(error => {
        console.error('检查过程出错:', error);
        process.exit(1);
    });
}

module.exports = {
    checkAllFiles,
    checkFile,
    checkTypeScriptFile,
    checkVueFile,
    checkLessFile,
    checkCommonIssues,
    CONFIG,
};