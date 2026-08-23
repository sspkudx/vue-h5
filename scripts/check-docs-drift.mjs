#!/usr/bin/env node
/**
 * 文档/模板漂移检查器（check-docs-drift）
 *
 * 背景：项目经 AI 大规模迭代后，README / docs/agents / .claude/skills 模板
 * 与真实代码（package.json scripts、版本基线、目录结构）多次失同步。
 * 本脚本用机器校验兜底，任何把"文档里声称的"与"代码里真实的"重新拉齐的改动，
 * 都必须通过本检查（CI 中由 `pnpm check:docs` 触发）。
 *
 * 检查项：
 *  1. 命令校验：文档中出现的 `pnpm <cmd>` 必须存在于根 package.json scripts、
 *     workspace 包 scripts 或 pnpm 内建命令；`pnpm -F <pkg> <cmd>` 会校验包存在
 *     且命令在该包 scripts 中。
 *  2. 过期术语：Vue CLI / Webpack / vue.config.js / historyApiFallback / vitest /
 *     App.tsx / baseUrl / TypeScript 4.x / pnpm 10 / 错误技能目录路径 等。
 *  3. 技能模板基线：create-a-package / create-vue-app 模板不得回退到旧版本基线，
 *     必须保留 exports `development` 条件。
 *  4. 技能数量一致性：.claude/skills 目录数应与文档宣称一致。
 *  5. .browserslistrc 必须为 `chrome >= 49`（范围下限语义）。
 *
 * 用法：node scripts/check-docs-drift.mjs        （通过根 package.json 的 check:docs 调用）
 * 退出码：0 全部通过；1 存在漂移（CI 失败）。
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

// ---------------------------------------------------------------------------
// 读取真实基线
// ---------------------------------------------------------------------------

function readJson(rel) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, 'utf8'));
}

const rootPkg = readJson('package.json');
const rootScripts = rootPkg?.scripts ?? {};

/** workspace 包：{ name -> { dir, scripts } } */
const workspacePkgs = {};
for (const dir of ['apps', 'packages', 'scripts/dev-launcher/web']) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const entry of readdirSync(abs)) {
        const pkgJson = join(abs, entry, 'package.json');
        if (existsSync(pkgJson)) {
            const pkg = JSON.parse(readFileSync(pkgJson, 'utf8'));
            if (pkg.name) workspacePkgs[pkg.name] = { dir: join(dir, entry), scripts: pkg.scripts ?? {} };
        }
    }
}

const docsFiles = [
    'README.md',
    'apps/README.md',
    'packages/README.md',
    'CHANGELOG.md',
    'AGENTS.md',
    'CONTEXT.md',
    ...(existsSync(join(ROOT, 'docs/agents'))
        ? readdirSync(join(ROOT, 'docs/agents'))
              .filter(f => f.endsWith('.md'))
              .map(f => `docs/agents/${f}`)
        : []),
    ...(existsSync(join(ROOT, '.claude/skills'))
        ? readdirSync(join(ROOT, '.claude/skills'))
              .filter(d => existsSync(join(ROOT, '.claude/skills', d, 'SKILL.md')))
              .map(d => `.claude/skills/${d}/SKILL.md`)
        : []),
].filter(f => existsSync(join(ROOT, f)));

// ---------------------------------------------------------------------------
// 检查 1：命令校验
// ---------------------------------------------------------------------------

const PNPM_BUILTINS = new Set([
    'add',
    'install',
    'i',
    'update',
    'up',
    'remove',
    'rm',
    'link',
    'unlink',
    'import',
    'rebuild',
    'prune',
    'fetch',
    'patch',
    'patch-commit',
    'patch-remove',
    'approve-builds',
    'audit',
    'licenses',
    'outdated',
    'why',
    'list',
    'dlx',
    'create',
    'env',
    'exec',
    'run',
    'store',
    'server',
    'root',
    'bin',
    'setup',
    'config',
    'publish',
    'pack',
    'deploy',
    'dedupe',
    'test',
    'view',
]);
/** 文档示例中由 create-vue-app 技能生成到根 scripts 的 app 脚本名（示例应用名） */
const ALLOWED_APP_SCRIPT_NAMES = new Set(['my-app', 'admin-panel', 'user-portal']);
/** 文档中声明为"已移除/将失败"的历史命令，检查时豁免 */
const KNOWN_REMOVED_COMMANDS = new Set(['sync:skills']);

/** 去除命令/包名 token 首尾的非命令字符（引号、反引号、标点、CJK） */
function stripToken(tok) {
    return tok.replace(/^[^a-zA-Z0-9:@._/-]+/, '').replace(/[^a-zA-Z0-9:@._/-]+$/, '');
}

function checkCommands(file, lines, errors) {
    lines.forEach((line, idx) => {
        const words = line.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
            if (words[i] !== 'pnpm') continue;

            let j = i + 1;
            if (words[j] === 'run') j++;

            // pnpm -F <pkg> <cmd>
            if (words[j] === '-F' || words[j] === '--filter') {
                const filter = stripToken(words[j + 1] ?? '');
                const command = stripToken(words[j + 2] ?? '');
                if (!filter || !command) continue;
                if (filter.includes('{') || command.includes('{')) continue; // 占位符示例
                if (/^[a-z-]*app-?name$/i.test(filter)) continue; // app-name / appName 占位符示例
                if (ALLOWED_APP_SCRIPT_NAMES.has(filter)) continue; // 技能文档中假设的应用
                if (PNPM_BUILTINS.has(command)) continue;
                if (!workspacePkgs[filter]) {
                    errors.push(
                        `${file}:${idx + 1}  pnpm -F ${filter}：工作区中不存在该包（现有：${Object.keys(workspacePkgs).join(', ') || '无'}）`
                    );
                    continue;
                }
                if (command in workspacePkgs[filter].scripts) continue;
                errors.push(
                    `${file}:${idx + 1}  pnpm -F ${filter} ${command}：包内无此脚本（现有：${Object.keys(workspacePkgs[filter].scripts).join(', ') || '无'}）`
                );
                continue;
            }

            // pnpm -r / -w / 其他 flag 后跟命令（如 `pnpm -r add lodash`）
            if (words[j] === '-r' || words[j] === '-w' || words[j] === '--recursive' || words[j] === '--workspace') j++;
            if (words[j] && words[j].startsWith('-')) continue; // pnpm -v / --version / --cli 等纯 flag

            const command = stripToken(words[j] ?? '');
            if (!command) continue;
            if (command.includes('{')) continue; // 占位符示例
            if (!/^[a-zA-Z@]/.test(command)) continue; // 非命令词（如 `pnpm 11`、`pnpm 的`）
            if (command in rootScripts) continue;
            if (PNPM_BUILTINS.has(command)) continue;
            if (KNOWN_REMOVED_COMMANDS.has(command)) continue;

            // 技能生成的 app 脚本模式（dev:my-app / build:user-portal 等）
            const appScript = command.match(/^(dev|build|lint):([a-z0-9-]+)$/);
            if (appScript) {
                const [, , name] = appScript;
                if (
                    ALLOWED_APP_SCRIPT_NAMES.has(name) ||
                    workspacePkgs[`@my-app/${name}`] ||
                    existsSync(join(ROOT, 'apps', name))
                )
                    continue;
            }

            if (command === 'clean') continue; // 通用包级脚本约定（模板 prebuild 引用）
            errors.push(
                `${file}:${idx + 1}  pnpm ${command}：根 package.json scripts 中不存在（现有：${Object.keys(rootScripts).join(', ')}）`
            );
        }
    });
}

// ---------------------------------------------------------------------------
// 检查 2：过期术语
// ---------------------------------------------------------------------------

const STALE_TERMS = [
    // 历史变更记录（AGENTS.md 文档更新历史 / CONTEXT.md 决策记录 / CHANGELOG.md）允许提及旧工具名
    {
        re: /vue\.config\.js/,
        msg: '应使用 vite.config.ts（Vue CLI 已迁移 Vite 8）',
        except: ['AGENTS.md', 'CONTEXT.md', 'CHANGELOG.md'],
    },
    { re: /historyApiFallback\s*[:=]/, msg: 'Vite 没有 historyApiFallback 选项' },
    { re: /TypeScript 4\.\d/, msg: 'TypeScript 基线为 6.0' },
    { re: /Webpack 构建错误|检查 Webpack|Webpack 配置/, msg: '构建工具为 Vite，不应再出现 Webpack' },
    { re: /Vue CLI/, msg: '已迁移 Vite，勿再提 Vue CLI（CONTEXT.md 迁移记录除外）', except: ['CONTEXT.md'] },
    { re: /from 'vitest'|使用 Vitest|Vitest 进行/, msg: '全仓测试统一 Jest' },
    { re: /App\.tsx/, msg: '应用根组件为 App.vue' },
    { re: /baseUrl\s*:/, msg: 'TS 6.0 已废弃移除 baseUrl（paths 相对 tsconfig 解析）' },
    { re: /PNPM 10/, msg: 'pnpm 基线为 11' },
    { re: /^[├└]──\s+skills\//m, msg: '技能目录应为 .claude/skills/（树状图中不要写裸 skills/）' },
    { re: /"@types\/jest": "\^29/, msg: '@types/jest 基线为 ^30' },
    { re: /"typescript": "\^[45]\./, msg: 'typescript 模板应走 catalog:（当前 ^6.0.3）' },
    { re: /"node": ">= ?14/, msg: 'Node 基线为 22 LTS' },
    {
        re: /"dev": "vite build --watch"/,
        msg: '包 dev 脚本应为 bash ../../scripts/watch-package.sh（先完整构建再并行 watch）',
    },
];

function checkStaleTerms(file, lines, errors) {
    const base = file.split('/').pop();
    lines.forEach((line, idx) => {
        for (const term of STALE_TERMS) {
            if (term.except?.includes(base)) continue;
            if (term.re.test(line)) {
                errors.push(`${file}:${idx + 1}  过期术语「${term.msg}」：${line.trim().slice(0, 90)}`);
            }
        }
    });
}

// ---------------------------------------------------------------------------
// 检查 3：技能模板基线
// ---------------------------------------------------------------------------

function checkSkillBaselines(errors) {
    const pkgSkill = join(ROOT, '.claude/skills/create-a-package/SKILL.md');
    if (existsSync(pkgSkill)) {
        const text = readFileSync(pkgSkill, 'utf8');
        if (!/["']development["']\s*:\s*["']\.\/src\/index\.ts["']/.test(text)) {
            errors.push(
                '.claude/skills/create-a-package/SKILL.md：模板必须保留 exports 的 development 条件（指向 src）'
            );
        }
        for (const [re, msg] of [
            [/vitest/i, '不应出现 vitest（全仓统一 Jest）'],
            [/"typescript": "\^4\./, 'typescript 版本回退到 4.x'],
            [/"typescript": "\^5\./, 'typescript 版本回退到 5.x（应为 catalog: 或 ^6）'],
            [/"@types\/jest": "\^29/, '@types/jest 回退到 ^29（应为 ^30）'],
            [/"node": ">= ?14/, 'engines.node 回退到 14（应为 >=22.0.0）'],
            [
                /["']@vue\/babel-plugin-jsx["']\s*:/,
                '不应作为依赖出现 @vue/babel-plugin-jsx（Vite 用 @vitejs/plugin-vue-jsx）',
            ],
            [/@vue\/vue3-jest/, '不应出现 @vue/vue3-jest（仓库未内置组件测试）'],
        ]) {
            const m = text.match(re);
            if (m) errors.push(`.claude/skills/create-a-package/SKILL.md：${msg}（命中：${m[0]}）`);
        }
    }

    const appSkill = join(ROOT, '.claude/skills/create-vue-app/SKILL.md');
    if (existsSync(appSkill)) {
        const text = readFileSync(appSkill, 'utf8');
        const m = text.match(/"baseUrl"\s*:/);
        if (m)
            errors.push(
                `.claude/skills/create-vue-app/SKILL.md：tsconfig 模板含已废弃的 baseUrl（TS 6.0 移除，命中：${m[0]}）`
            );
    }
}

// ---------------------------------------------------------------------------
// 检查 4：技能数量一致性
// ---------------------------------------------------------------------------

function checkSkillCount(errors) {
    const dir = join(ROOT, '.claude/skills');
    if (!existsSync(dir)) return;
    const count = readdirSync(dir).filter(d => existsSync(join(dir, d, 'SKILL.md'))).length;
    if (count !== 8) {
        errors.push(
            `.claude/skills/：技能目录数为 ${count}，与文档宣称的 8 个不一致（新增技能后请同步 AGENTS.md / docs/agents/overview.md）`
        );
    }
}

// ---------------------------------------------------------------------------
// 检查 5：.browserslistrc
// ---------------------------------------------------------------------------

function checkBrowserslist(errors) {
    const p = join(ROOT, '.browserslistrc');
    if (!existsSync(p)) return;
    const text = readFileSync(p, 'utf8');
    if (!/chrome\s*>=\s*49/.test(text)) {
        errors.push(
            '.browserslistrc：必须为 `chrome >= 49`（范围下限语义；裸 `chrome 49` 只精确匹配一个版本，是陷阱）'
        );
    }
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

const errors = [];

for (const file of docsFiles) {
    const lines = readFileSync(join(ROOT, file), 'utf8').split('\n');
    checkCommands(file, lines, errors);
    checkStaleTerms(file, lines, errors);
}
checkSkillBaselines(errors);
checkSkillCount(errors);
checkBrowserslist(errors);

if (errors.length === 0) {
    console.log(`✅ check-docs-drift 通过：${docsFiles.length} 个文档文件与真实代码无漂移`);
    process.exit(0);
}

console.error(`❌ check-docs-drift 发现 ${errors.length} 处漂移：\n`);
for (const e of errors) console.error(`  - ${e}`);
console.error(
    '\n修复方式：修改文档/模板使其与真实代码一致；确属历史记录的引用请移入 CONTEXT.md 或 AGENTS.md 变更记录，或调整本脚本的豁免清单。'
);
process.exit(1);
