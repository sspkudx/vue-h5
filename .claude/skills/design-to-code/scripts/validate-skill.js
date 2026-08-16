#!/usr/bin/env node

/**
 * Design-to-Code 技能验证脚本
 * 
 * 此脚本用于验证 Design-to-Code 技能的结构和内容是否符合规范。
 */

const fs = require('fs');
const path = require('path');

// 验证配置
const VALIDATION_RULES = {
    requiredFiles: [
        'SKILL.md',
        'examples.md',
        'reference.md',
        'scripts/check-code-quality.js',
        'scripts/package.json',
        'scripts/README.md',
    ],
    
    skillMd: {
        maxLines: 500,
        requiredSections: [
            'name:',
            'description:',
            '# Design-to-Code 技能',
            '## 概述',
            '## 使用场景',
            '## 核心原则',
            '## 工作流程',
            '## 注意事项',
        ],
    },
    
    examplesMd: {
        minExamples: 4,
        minCodeBlocks: 5,
        examplePatterns: [
            /^##\s+示例\s+\d+:/,
            /^##\s+Example\s+\d+:/i,
        ],
    },
    
    referenceMd: {
        requiredSections: [
            'TypeScript 规范',
            'Vue 3 规范',
            'CSS Modules 规范',
            'PostCSS 配置',
        ],
    },
};

// 验证结果
const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: [],
    warningsList: [],
};

/**
 * 验证技能结构
 */
function validateSkillStructure(skillDir) {
    console.log('🔍 验证 Design-to-Code 技能结构...\n');
    
    // 检查必需文件
    console.log('📁 检查必需文件:');
    for (const file of VALIDATION_RULES.requiredFiles) {
        const filePath = path.join(skillDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`   ✅ ${file}`);
            results.passed++;
        } else {
            console.log(`   ❌ ${file} (缺失)`);
            results.failed++;
            results.errors.push(`必需文件缺失: ${file}`);
        }
    }
    console.log();
}

/**
 * 验证 SKILL.md 文件
 */
function validateSkillMd(skillDir) {
    const filePath = path.join(skillDir, 'SKILL.md');
    console.log('📄 验证 SKILL.md 文件:');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ❌ SKILL.md 文件不存在');
        results.failed++;
        results.errors.push('SKILL.md 文件不存在');
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // 检查行数
    if (lines.length > VALIDATION_RULES.skillMd.maxLines) {
        console.log(`   ⚠️  文件行数 ${lines.length} 超过建议限制 ${VALIDATION_RULES.skillMd.maxLines} 行`);
        results.warnings++;
        results.warningsList.push(`SKILL.md 文件行数过多 (${lines.length} 行)`);
    } else {
        console.log(`   ✅ 文件行数 ${lines.length} 在限制内`);
        results.passed++;
    }
    
    // 检查必需章节
    console.log('   📖 检查必需章节:');
    for (const section of VALIDATION_RULES.skillMd.requiredSections) {
        if (content.includes(section)) {
            console.log(`      ✅ ${section}`);
            results.passed++;
        } else {
            console.log(`      ❌ ${section} (未找到)`);
            results.failed++;
            results.errors.push(`SKILL.md 缺少章节: ${section}`);
        }
    }
    
    // 检查 YAML frontmatter
    if (content.startsWith('---')) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            if (frontmatter.includes('name:') && frontmatter.includes('description:')) {
                console.log('   ✅ YAML frontmatter 格式正确');
                results.passed++;
            } else {
                console.log('   ❌ YAML frontmatter 缺少必需字段');
                results.failed++;
                results.errors.push('SKILL.md YAML frontmatter 缺少必需字段');
            }
        }
    } else {
        console.log('   ❌ 缺少 YAML frontmatter (---)');
        results.failed++;
        results.errors.push('SKILL.md 缺少 YAML frontmatter');
    }
    console.log();
}

/**
 * 验证 examples.md 文件
 */
function validateExamplesMd(skillDir) {
    const filePath = path.join(skillDir, 'examples.md');
    console.log('📄 验证 examples.md 文件:');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ❌ examples.md 文件不存在');
        results.failed++;
        results.errors.push('examples.md 文件不存在');
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查示例数量（使用多种模式匹配）
    let exampleCount = 0;
    for (const pattern of VALIDATION_RULES.examplesMd.examplePatterns) {
        const matches = content.match(new RegExp(pattern, 'gm'));
        if (matches) {
            exampleCount += matches.length;
        }
    }
    
    // 如果没有匹配到模式，尝试使用中文模式
    if (exampleCount === 0) {
        exampleCount = (content.match(/^##\s+示例.*/gm) || []).length;
    }
    
    if (exampleCount >= VALIDATION_RULES.examplesMd.minExamples) {
        console.log(`   ✅ 包含 ${exampleCount} 个示例（要求至少 ${VALIDATION_RULES.examplesMd.minExamples} 个）`);
        results.passed++;
    } else {
        console.log(`   ❌ 只有 ${exampleCount} 个示例（要求至少 ${VALIDATION_RULES.examplesMd.minExamples} 个）`);
        results.failed++;
        results.errors.push(`examples.md 示例数量不足 (${exampleCount} 个)`);
    }
    
    // 检查代码块
    const codeBlockCount = (content.match(/```(tsx|less|vue|typescript|javascript|bash|json)/g) || []).length;
    if (codeBlockCount >= VALIDATION_RULES.examplesMd.minCodeBlocks) {
        console.log(`   ✅ 包含 ${codeBlockCount} 个代码块（要求至少 ${VALIDATION_RULES.examplesMd.minCodeBlocks} 个）`);
        results.passed++;
    } else {
        console.log(`   ⚠️  只有 ${codeBlockCount} 个代码块（要求至少 ${VALIDATION_RULES.examplesMd.minCodeBlocks} 个）`);
        results.warnings++;
        results.warningsList.push(`examples.md 代码块数量较少 (${codeBlockCount} 个)`);
    }
    
    // 检查示例内容
    if (content.includes('按钮') || content.includes('Button')) {
        console.log('   ✅ 包含按钮组件示例');
        results.passed++;
    } else {
        console.log('   ⚠️  缺少按钮组件示例（建议添加）');
        results.warnings++;
        results.warningsList.push('examples.md 缺少按钮组件示例');
    }
    
    if (content.includes('卡片') || content.includes('Card')) {
        console.log('   ✅ 包含卡片组件示例');
        results.passed++;
    } else {
        console.log('   ⚠️  缺少卡片组件示例（建议添加）');
        results.warnings++;
        results.warningsList.push('examples.md 缺少卡片组件示例');
    }
    
    console.log();
}

/**
 * 验证 reference.md 文件
 */
function validateReferenceMd(skillDir) {
    const filePath = path.join(skillDir, 'reference.md');
    console.log('📄 验证 reference.md 文件:');
    
    if (!fs.existsSync(filePath)) {
        console.log('   ❌ reference.md 文件不存在');
        results.failed++;
        results.errors.push('reference.md 文件不存在');
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查必需章节
    console.log('   📖 检查技术参考章节:');
    for (const section of VALIDATION_RULES.referenceMd.requiredSections) {
        if (content.includes(section)) {
            console.log(`      ✅ ${section}`);
            results.passed++;
        } else {
            console.log(`      ❌ ${section} (未找到)`);
            results.failed++;
            results.errors.push(`reference.md 缺少章节: ${section}`);
        }
    }
    
    // 检查是否有详细的技术说明
    const detailCount = (content.match(/### /g) || []).length;
    if (detailCount >= 4) {
        console.log(`   ✅ 包含 ${detailCount} 个详细技术说明`);
        results.passed++;
    } else {
        console.log(`   ⚠️  详细技术说明较少 (${detailCount} 个)`);
        results.warnings++;
        results.warningsList.push(`reference.md 技术说明较少 (${detailCount} 个)`);
    }
    console.log();
}

/**
 * 验证 scripts 目录
 */
function validateScripts(skillDir) {
    const scriptsDir = path.join(skillDir, 'scripts');
    console.log('🔧 验证 scripts 目录:');
    
    if (!fs.existsSync(scriptsDir)) {
        console.log('   ❌ scripts 目录不存在');
        results.failed++;
        results.errors.push('scripts 目录不存在');
        return;
    }
    
    // 检查 check-code-quality.js
    const checkScriptPath = path.join(scriptsDir, 'check-code-quality.js');
    if (fs.existsSync(checkScriptPath)) {
        const content = fs.readFileSync(checkScriptPath, 'utf8');
        if (content.includes('checkAllFiles') && content.includes('checkFile')) {
            console.log('   ✅ check-code-quality.js 功能完整');
            results.passed++;
        } else {
            console.log('   ❌ check-code-quality.js 缺少必需函数');
            results.failed++;
            results.errors.push('check-code-quality.js 缺少必需函数');
        }
    } else {
        console.log('   ❌ check-code-quality.js 文件不存在');
        results.failed++;
        results.errors.push('check-code-quality.js 文件不存在');
    }
    
    // 检查 package.json
    const packagePath = path.join(scriptsDir, 'package.json');
    if (fs.existsSync(packagePath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            if (pkg.name && pkg.version && pkg.main) {
                console.log('   ✅ package.json 配置正确');
                results.passed++;
            } else {
                console.log('   ❌ package.json 缺少必需字段');
                results.failed++;
                results.errors.push('package.json 缺少必需字段');
            }
        } catch (error) {
            console.log(`   ❌ package.json 解析错误: ${error.message}`);
            results.failed++;
            results.errors.push(`package.json 解析错误: ${error.message}`);
        }
    } else {
        console.log('   ❌ package.json 文件不存在');
        results.failed++;
        results.errors.push('package.json 文件不存在');
    }
    
    // 检查 README.md
    const readmePath = path.join(scriptsDir, 'README.md');
    if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf8');
        if (content.includes('使用方法') || content.includes('使用示例')) {
            console.log('   ✅ README.md 内容完整');
            results.passed++;
        } else {
            console.log('   ⚠️  README.md 缺少使用说明');
            results.warnings++;
            results.warningsList.push('README.md 缺少详细使用说明');
        }
    } else {
        console.log('   ❌ README.md 文件不存在');
        results.failed++;
        results.errors.push('README.md 文件不存在');
    }
    console.log();
}

/**
 * 验证技能完整性
 */
function validateSkillCompleteness() {
    console.log('📊 验证技能完整性:');
    
    // 检查技能描述是否包含关键信息
    const skillMdPath = path.join(__dirname, '..', 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
        const content = fs.readFileSync(skillMdPath, 'utf8');
        
        const checks = [
            { keyword: 'Figma', desc: '支持 Figma 设计稿' },
            { keyword: '蓝湖', desc: '支持蓝湖设计稿' },
            { keyword: 'mpx', desc: '使用 mpx 单位' },
            { keyword: 'CSS Modules', desc: '支持 CSS Modules' },
            { keyword: 'TypeScript', desc: '使用 TypeScript' },
            { keyword: 'Vue 3', desc: '基于 Vue 3' },
            { keyword: '视觉走查', desc: '支持视觉走查' },
            { keyword: '设计稿', desc: '设计稿转代码' },
            { keyword: 'TypeScript', desc: 'TypeScript 规范' },
            { keyword: 'BEM', desc: 'BEM 命名规范' },
        ];
        
        for (const check of checks) {
            if (content.includes(check.keyword)) {
                console.log(`   ✅ ${check.desc}`);
                results.passed++;
            } else {
                console.log(`   ⚠️  缺少 ${check.desc} 说明`);
                results.warnings++;
                results.warningsList.push(`技能描述缺少: ${check.desc}`);
            }
        }
    }
    console.log();
}

/**
 * 输出验证结果
 */
function outputResults() {
    console.log('📊 验证结果汇总:');
    console.log(`   ✅ 通过: ${results.passed}`);
    console.log(`   ⚠️  警告: ${results.warnings}`);
    console.log(`   ❌ 失败: ${results.failed}`);
    console.log();
    
    if (results.errors.length > 0) {
        console.log('❌ 错误详情:');
        for (const error of results.errors) {
            console.log(`   • ${error}`);
        }
        console.log();
    }
    
    if (results.warningsList.length > 0) {
        console.log('⚠️  警告详情:');
        for (const warning of results.warningsList) {
            console.log(`   • ${warning}`);
        }
        console.log();
    }
    
    // 总结和建议
    console.log('💡 改进建议:');
    if (results.failed > 0) {
        console.log('   1. 请优先修复所有错误（必需文件缺失或功能不完整）');
    }
    
    if (results.warnings > 0) {
        console.log('   2. 考虑修复警告以提高技能质量');
        console.log('   3. 确保示例代码完整且可运行');
        console.log('   4. 补充缺少的技术参考文档');
    }
    
    if (results.failed === 0 && results.warnings === 0) {
        console.log('   🎉 技能验证通过！所有检查项均符合要求。');
    }
    
    // 退出码
    if (results.failed > 0) {
        console.log('\n❌ 技能验证失败，请修复上述错误。');
        process.exit(1);
    } else if (results.warnings > 0) {
        console.log('\n⚠️  技能验证通过，但有警告需要关注。');
        process.exit(0);
    } else {
        console.log('\n✅ 技能验证完全通过！');
        process.exit(0);
    }
}

/**
 * 主函数
 */
function main() {
    const skillDir = path.join(__dirname, '..');
    
    console.log('🔍 Design-to-Code 技能验证开始\n');
    console.log('📁 技能目录:', skillDir);
    console.log('📅 验证时间:', new Date().toLocaleString());
    console.log('='.repeat(60));
    
    validateSkillStructure(skillDir);
    validateSkillMd(skillDir);
    validateExamplesMd(skillDir);
    validateReferenceMd(skillDir);
    validateScripts(skillDir);
    validateSkillCompleteness();
    
    console.log('='.repeat(60));
    outputResults();
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = {
    validateSkillStructure,
    validateSkillMd,
    validateExamplesMd,
    validateReferenceMd,
    validateScripts,
    validateSkillCompleteness,
    VALIDATION_RULES,
};