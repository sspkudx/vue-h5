#!/usr/bin/env node
/**
 * 文档/模板漂移检查器（check-docs-drift）—— compat/node-14 分支版
 *
 * 背景：本分支与 main 工具链不同（webpack/vue-cli、jest、pnpm 7、Node 14 基线），
 * 文档与模板在跟随 main 演进时极易带入 main 的工具链事实（Vite/Vitest/pnpm 11 等）。
 * 本脚本用机器校验兜底：任何把"文档里声称的"与"代码里真实的"重新拉齐的改动，
 * 都必须通过本检查（CI 中由 `pnpm check:docs` 触发）。
 *
 * 检查项：
 *  1. 命令校验：文档中出现的 `pnpm <cmd>` 必须存在于根 package.json scripts、
 *     workspace 包 scripts 或 pnpm 内建命令；`pnpm -F <pkg> <cmd>` 会校验包存在
 *     且命令在该包 scripts 中。
 *  2. 过期术语（相对本分支基线）：Vite/Vitest/catalog/pnpm 10+/Node 16+ 基线/
 *     dev-launcher/Playwright/import.meta.env/-legacy 双产物/build-packages.sh 等
 *     ——这些是 main 分支的事实，不应出现在本分支的现行文档中。
 *  3. 技能模板基线：create-a-package / create-vue-app 模板不得回退——必须保留
 *     exports 嵌套形态的 development 条件；不得硬编码 @my-app/* paths。
 *  4. 技能数量一致性：.claude/skills 目录数应与文档宣称一致（7 个）。
 *  5. .browserslistrc 必须为 `chrome >= 49`（范围下限语义，裸 `chrome 49` 是陷阱）。
 *
 * 用法：node scripts/check-docs-drift.mjs   （通过根 package.json 的 check:docs 调用）
 * 退出码：0 全部通过；1 存在漂移（CI 失败）。
 */
const { readFileSync, readdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');

const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// 读取真实基线
// ---------------------------------------------------------------------------

function readJson(rel) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, 'utf8'));
}

const rootPkg = readJson('package.json');
const rootScripts = (rootPkg && rootPkg.scripts) || {};

/** workspace 包：{ name -> { dir, scripts } } */
const workspacePkgs = {};
for (const dir of ['apps', 'packages']) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const entry of readdirSync(abs)) {
        const pkgJson = join(abs, entry, 'package.json');
        if (existsSync(pkgJson)) {
            const pkg = JSON.parse(readFileSync(pkgJson, 'utf8'));
            if (pkg.name) workspacePkgs[pkg.name] = { dir: join(dir, entry), scripts: pkg.scripts || {} };
        }
    }
}

const docsFiles = [
    'README.md',
    'apps/README.md',
    'packages/README.md',
    'AGENTS.md',
    'CONTEXT.md',
    ...(existsSync(join(ROOT, 'docs/agents'))
        ? readdirSync(join(ROOT, 'docs/agents'))
              .filter(f => f.endsWith('.md'))
              .map(f => `docs/agents/${f}`)
        : []),
    ...(existsSync(join(ROOT, '.claude/skills'))
        ? readdirSync(join(ROOT, '.claude/skills')).reduce((acc, d) => {
              const dir = join(ROOT, '.claude/skills', d);
              if (existsSync(dir) && existsSync(join(dir, 'SKILL.md'))) {
                  for (const f of readdirSync(dir)) {
                      if (f.endsWith('.md')) acc.push(`.claude/skills/${d}/${f}`);
                  }
              }
              return acc;
          }, [])
        : []),
].filter(f => existsSync(join(ROOT, f)));

// ---------------------------------------------------------------------------
// 检查 1：命令校验
// ---------------------------------------------------------------------------

const PNPM_BUILTINS = new Set([
    'add', 'install', 'i', 'update', 'up', 'remove', 'rm', 'link', 'unlink', 'import',
    'rebuild', 'prune', 'fetch', 'patch', 'approve-builds', 'audit', 'licenses', 'outdated',
    'why', 'list', 'dlx', 'create', 'env', 'exec', 'run', 'store', 'server', 'root', 'bin',
    'setup', 'config', 'publish', 'pack', 'deploy', 'dedupe', 'test', 'view',
]);
/** 文档示例中由 create-vue-app 技能生成到根 scripts 的 app 脚本名（示例应用名） */
const ALLOWED_APP_SCRIPT_NAMES = new Set(['my-app', 'admin-panel', 'user-portal']);
/** 文档中声明为"已移除/将失败"的历史命令，检查时豁免 */
const KNOWN_REMOVED_COMMANDS = new Set(['sync:skills']);

/** 提取命令/包名 token：从首个命令字符起取连续合法段，遇到反引号/CJK/标点即止 */
function stripToken(tok) {
    const m = tok.match(/^[`'"]?([a-zA-Z@][a-zA-Z0-9:@._/-]*)/);
    return m ? m[1] : '';
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
                const filterRaw = words[j + 1] || '';
                const commandRaw = words[j + 2] || '';
                // 占位符示例（{app-name} / <app-name> 等）跳过
                if (filterRaw.includes('{') || commandRaw.includes('{') || filterRaw.includes('<') || commandRaw.includes('<'))
                    continue;
                const filter = stripToken(filterRaw);
                const command = stripToken(commandRaw);
                if (!filter || !command) continue;
                if (filter.startsWith('.') || filter.startsWith('/') || filter.startsWith('"')) continue; // 路径过滤
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
            if (words[j] && words[j].startsWith('-')) continue; // pnpm -v / --version 等纯 flag

            const cmdRaw = words[j] || '';
            if (cmdRaw.includes('{') || cmdRaw.includes('<')) continue; // 占位符示例（dev:{app-name} 等）
            const command = stripToken(cmdRaw);
            if (!command) continue;
            if (!/^[a-zA-Z@]/.test(command)) continue; // 非命令词（如 `pnpm 7`、`pnpm 的`）
            if (command in rootScripts) continue;
            if (PNPM_BUILTINS.has(command)) continue;
            if (KNOWN_REMOVED_COMMANDS.has(command)) continue;

            // 技能生成的 app 脚本模式（dev:my-app / build:user-portal 等）
            const appScript = command.match(/^(dev|build|lint):([a-z0-9-]+)$/);
            if (appScript) {
                const name = appScript[2];
                if (ALLOWED_APP_SCRIPT_NAMES.has(name) || workspacePkgs[`@my-app/${name}`] || existsSync(join(ROOT, 'apps', name)))
                    continue;
            }

            if (command === 'clean') continue; // 通用包级脚本约定
            errors.push(
                `${file}:${idx + 1}  pnpm ${command}：根 package.json scripts 中不存在（现有：${Object.keys(rootScripts).join(', ')}）`
            );
        }
    });
}

// ---------------------------------------------------------------------------
// 检查 2：过期术语（相对 compat/node-14 基线；历史记录文件豁免）
// ---------------------------------------------------------------------------

// 本分支基线：webpack/vue-cli 构建、jest 测试、pnpm 7、Node 14.18+。
// main 分支的工具链事实出现在本分支现行文档中即视为漂移。
const STALE_TERMS = [
    // 历史变更记录允许提及 main 的工具链（AGENTS.md 更新历史 / CONTEXT.md 决策记录）
    { re: /vitest|@vitest\/coverage|from ['"]vitest['"]/, msg: '本分支测试框架为 Jest 29（Vitest 仅存在于 main）', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /\bcatalog:/, msg: 'catalog 协议需 pnpm 9.5+，本分支为 pnpm 7', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /pnpm ?1[01]\b|pnpm@1[01]/, msg: '本分支包管理器基线为 pnpm 7', except: ['AGENTS.md', 'CONTEXT.md'] },
    {
        re: /"node":\s*">=?\s*(1[5-9]|2\d)/,
        msg: 'engines.node 基线应为 >=14.18.0（出现更高版本声明即为 main 漂移或笔误）',
        except: ['AGENTS.md', 'CONTEXT.md'],
    },
    { re: /scripts\/watch-package\.sh/, msg: 'watch-package.sh 属 main 分支，本分支无此脚本', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /dev-launcher|开发启动器/, msg: 'dev-launcher 仅 main 分支存在（依赖 Node 18+）', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /[Pp]laywright/, msg: 'E2E（Playwright）未在本分支落地（需 Node 18+）', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /import\.meta\.env/, msg: 'Vue CLI 应用经 process.env.VUE_APP_* 读环境变量（import.meta.env 属 Vite）', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /@vitejs\/plugin-legacy/, msg: '本分支为 vue-cli differential loading（自动 legacy/module 双产物），无 Vite legacy 插件', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /build-packages\.sh/, msg: '构建编排已收敛为 pnpm -r run build，build-packages.sh 已删除', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /vue\.config\.js 已迁移|已迁移 Vite|迁移到 Vite/, msg: '本分支构建工具链为 Vue CLI/webpack，不存在 Vite 迁移', except: ['AGENTS.md', 'CONTEXT.md'] },
    { re: /TypeScript [67]\.\d 基线|typescript":\s*"\^(6|7)\./, msg: '本分支 TypeScript 基线为 ^5.9（main 为 6.x）', except: ['AGENTS.md', 'CONTEXT.md'] },
];

function checkStaleTerms(file, lines, errors) {
    const base = file.split('/').pop();
    lines.forEach((line, idx) => {
        for (const term of STALE_TERMS) {
            if (term.except.includes(base)) continue;
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
        // development 条件必须是嵌套形态（自含 types+default 指向 src）
        if (!/"development":\s*\{[^}]{0,200}"types":\s*"\.\/src\/index\.ts"/.test(text)) {
            errors.push(
                '.claude/skills/create-a-package/SKILL.md：exports 的 development 条件必须为嵌套形态（自含 types+default 指向 src）'
            );
        }
        if (/"development":\s*"\.\/src\/index\.ts"/.test(text)) {
            errors.push('.claude/skills/create-a-package/SKILL.md：存在扁平形态的 development 条件（应改为嵌套形态）');
        }
        for (const [re, msg] of [
            [/\bvitest\b/i, '不应出现 vitest（本分支测试框架为 Jest 29）'],
            [/catalog:/, '不应出现 catalog:（pnpm 7 不支持）'],
            [/"typescript":\s*"\^6\./, 'typescript 版本超出本分支基线（应 ^5.9）'],
            [/"node":\s*">=\s*(16|18|20|22)/, 'engines.node 回退异常（本分支基线 >= 14.18.0）'],
        ]) {
            const m = text.match(re);
            if (m) errors.push(`.claude/skills/create-a-package/SKILL.md：${msg}（命中：${m[0]}）`);
        }
    }

    const appSkill = join(ROOT, '.claude/skills/create-vue-app/SKILL.md');
    if (existsSync(appSkill)) {
        const text = readFileSync(appSkill, 'utf8');
        const pathsHardcode = text.match(/"@my-app\/[^"]+":\s*\[/);
        if (pathsHardcode) {
            errors.push(
                `.claude/skills/create-vue-app/SKILL.md：tsconfig 模板硬编码 @my-app/* paths（应由 customConditions 解析，命中：${pathsHardcode[0]}）`
            );
        }
        // 正向基线：HomeView 导航按钮示例与 PlaygroundPage 示例页必须保留
        if (!text.includes('home-view__nav')) {
            errors.push('.claude/skills/create-vue-app/SKILL.md：HomeView 模板缺少导航按钮示例（home-view__nav）');
        }
        if (!text.includes('PlaygroundPage')) {
            errors.push('.claude/skills/create-vue-app/SKILL.md：缺少 PlaygroundPage 示例页说明');
        }
    }
}

// ---------------------------------------------------------------------------
// 检查 4：技能数量一致性
// ---------------------------------------------------------------------------

function checkSkillCount(errors) {
    const dir = join(ROOT, '.claude/skills');
    if (!existsSync(dir)) return;
    const count = readdirSync(dir).filter(d => existsSync(join(dir, d, 'SKILL.md'))).length;
    if (count !== 7) {
        errors.push(
            `.claude/skills/：技能目录数为 ${count}，与文档宣称的 7 个不一致（新增技能后请同步 AGENTS.md / docs/agents/overview.md）`
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
    console.log('[check:docs] 文档/模板与真实基线一致，未发现漂移。');
    process.exit(0);
}

console.error(`[check:docs] 发现 ${errors.length} 处文档/模板漂移：\n`);
for (const e of errors) console.error(`  - ${e}`);
console.error('\n请修正上述漂移后重试（历史记录文件 AGENTS.md / CONTEXT.md 豁免部分术语检查）。');
process.exit(1);
