# vue-h5 - Vue 3 Monorepo Project Template 🚀

> English | [简体中文](./README_zh-CN.md)

A modern H5 project template built on Vue 3 + TypeScript + PNPM Workspaces, with Monorepo architecture and built-in AI-powered development skills.

> ⚡ **Out of the box** | 🏗️ **Monorepo architecture** | 🤖 **AI-assisted development** | 📦 **PNPM Workspaces**

## ✨ Highlights

- **Modern tech stack**: Vue 3 + TypeScript + Vite + PNPM
- **Monorepo architecture**: Unified management of multiple apps and packages
- **AI-assisted development**: Built-in Skills to quickly scaffold apps and packages
- **Complete toolchain**: ESLint, Stylelint, Prettier, Vitest, Vite, Husky + commitlint, GitHub Actions CI

## ⚡ Quick Start (5 minutes)

### 1. Get the project template

```bash
# Get the project template
npx degit sspkudx/vue-h5#main my-vue-project
```

### 2. Install dependencies

```bash
cd my-vue-project
pnpm i  # PNPM is recommended
```

### 3. Start the dev server

```bash
# Option 1: Dev launcher (recommended) — pick apps/packages to start from a web console
pnpm dev
# Open http://localhost:8888 in your browser, check the boxes, then click "Start selected"

# Option 2: Interactive multi-select in the terminal (also auto-discovers apps/* and packages/*)
pnpm dev --cli

# Option 3: Start the example app directly
pnpm dev:example
```

Open http://localhost:2000 in your browser to see the example app!

> 💡 **How the three launch options fit together**:
>
> - `pnpm dev` only starts the **dev launcher console** (http://localhost:8888). The example app runs on http://localhost:2000 only after you check `example-app` in the console and click "Start selected";
> - `pnpm dev --cli` does the same interactively in the terminal;
> - To skip the console and start the example app directly, use `pnpm dev:example` (visit http://localhost:2000).

## 📚 Detailed Guide

### 📦 Environment Requirements

| Tool            | Requirement | Notes                                            |
| --------------- | ----------- | ------------------------------------------------ |
| **Node.js**     | 22 LTS      | See `.node-version` in the project root          |
| **Pkg Manager** | PNPM 11+    | `packageManager` is pinned; corepack recommended |

```bash
# On first use, enable corepack to automatically match the pnpm version declared in packageManager
corepack enable
```

> 💡 **Build machine still on Node 14?** The main branch requires Node 22 LTS. If your pipeline/build machine can't upgrade yet, you can reuse the `compat/node-14` branch template directly (keeps the Node 14 baseline + legacy toolchain, with the same Chrome 49 compatibility baseline):
>
> ```bash
> npx degit sspkudx/vue-h5#compat/node-14 my-project
> ```

### 🔄 Reusing the Template with degit

#### What is degit?

**degit** (de-git) is a tool by Rich Harris (creator of Svelte and Rollup), purpose-built for project templates:

| Feature                | **degit**                                   | **git clone**                        |
| ---------------------- | ------------------------------------------- | ------------------------------------ |
| **Git history**        | ❌ No history, faster download              | ✅ Full history included             |
| **Init a new project** | ✅ Ready to use, no need to remove .git     | ❌ Must remove .git and re-init      |
| **Disk usage**         | ⚡ Smaller                                  | 📦 Larger                            |
| **Speed**              | 🚀 Fast (downloads only the latest content) | Slow (downloads all history)         |
| **Use case**           | **Creating project templates**              | **Collaboration / history tracking** |

#### Multiple Ways to Use It

**Method 1: Using npx (recommended)**

```bash
# Using npx (recommended)
npx degit sspkudx/vue-h5#main my-project
```

**Method 2: Using pnpm dlx**

```bash
pnpm dlx degit sspkudx/vue-h5#main my-project
```

**Method 3: Using yarn dlx**

```bash
yarn dlx degit sspkudx/vue-h5#main my-project
```

#### Advanced Usage

```bash
# Use a specific version
npx degit sspkudx/vue-h5#v1.0.0 my-project

# Use a specific commit
npx degit sspkudx/vue-h5#abcdef1 my-project

# Create from a local template
npx degit ./path/to/vue-h5#main my-project

# Force-overwrite an existing directory
npx degit sspkudx/vue-h5#main my-project --force
```

#### Post-Usage Initialization Steps

1. **Enter the project directory** `cd my-project`
2. **Install dependencies** `pnpm i`
3. **Initialize Git (optional)**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit from vue-h5 template"
    ```
4. **Update configuration**:
    - Modify the `name` field in the root `package.json`
    - Adjust sub-package configuration as needed
    - Update `README.md`
5. **Start the dev server** `pnpm dev:example`

### 🏗️ Project Structure

```
vue-h5/
├── apps/                    # Apps directory
│   ├── example-app/         # Example app (starting point)
│   └── [your-app]/         # Your app (created via AI skills)
├── packages/                # Shared packages directory
│   └── shared/             # Shared utils package example
├── .claude/skills/          # AI-assisted development skills (8, checked in)
│   ├── create-vue-app/     # Skill: create a Vue app
│   ├── create-a-vue-page/  # Skill: create a Vue page
│   ├── create-component/   # Skill: create a Vue component
│   ├── create-a-package/   # Skill: create a dependency package
│   ├── design-to-code/     # Skill: design-to-code
│   ├── update-dependencies/# Skill: update dependencies
│   ├── create-skill/       # Skill: create a new skill
│   └── git-commit-push/    # Skill: git commit & push
├── scripts/                 # Build scripts & dev launcher
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

### 🤖 AI-Assisted Development Skills

This project ships with skills in the standard AI Skills format, usable in AI editors that support skills (e.g., Cursor, Windsurf, Trae, etc.):

#### Create a New Vue App

```bash
# Just ask in your AI editor:
"Create a new Vue app named my-app"
"Create a new app named admin-panel on port 8080"
"Add a new app user-portal under the apps directory"
```

**Skill location**: `./.claude/skills/create-vue-app/SKILL.md`

- ✅ Auto-generates a complete Vue 3 + TypeScript app structure
- ✅ Supports custom app name and port
- ✅ Includes routing, state management, and example components

#### Create a New Dependency Package

```bash
# Just ask in your AI editor:
"Create a new dependency package named utils, type: utility library"
"Create a new component library named ui-components"
"Add a new package auth-helpers under the packages directory, type: utility functions, description: 'auth-related utility functions'"
```

**Skill location**: `./.claude/skills/create-a-package/SKILL.md`

- ✅ Supports four package types: utility library, component library, utility functions, plugin library
- ✅ Auto-configures a TypeScript + Vite (lib mode) + Vitest development environment
- ✅ Generates test framework configuration and detailed docs

### 🔧 Monorepo Development Guide

#### Workspace Configuration

The `pnpm-workspace.yaml` at the project root defines the workspace:

```yaml
packages:
    - 'apps/*' # all apps
    - 'packages/*' # all shared packages
```

#### Common Commands

**Package management**

```bash
# Install all dependencies
pnpm i

# Add a dependency to all packages
pnpm -r add lodash

# Add a dependency to a specific package
pnpm -F @my-app/shared add lodash

# Remove a dependency
pnpm -F example-app remove lodash
```

**Development & build**

```bash
# Dev launcher: web console (default) or terminal multi-select (--cli), auto-discovers all apps and packages
pnpm dev
pnpm dev --cli

# Start the example app dev server directly
pnpm dev:example

# Lint (ESLint, read-only; use lint:fix to auto-fix)
pnpm lint:example

# Run tests
pnpm test
pnpm test:shared

# Build all packages
pnpm build:packages

# Build the example app
pnpm build:example

# Full build
pnpm build
```

**App/package-specific commands**

```bash
# Run commands in a specific app
pnpm -F example-app dev       # start dev server
pnpm -F example-app build     # build the app
pnpm -F example-app lint      # lint

# Run commands in a specific package
pnpm -F @my-app/shared build  # build the package
pnpm -F @my-app/shared test   # run tests
```

### 🚨 Troubleshooting

#### 1. Local Node version doesn't match the project requirement

```bash
# Using fnm (recommended)
fnm install 22
fnm use 22

# Using nvm
nvm install 22
nvm use 22

# Verify the version (should print v22.x; .node-version is auto-detected by fnm/nvm)
node --version
```

#### 2. Dependency installation fails

```bash
# Clean node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm i
```

#### 3. Workspace package reference issues

```bash
# Make sure all packages are built
pnpm build:packages

# Re-link dependencies
pnpm i --force
```

### 📋 Command Cheat Sheet

| Command | Purpose | Notes |
| --- | --- | --- |
| `pnpm dev` | Dev launcher (web console) | Check apps/packages to start; visit http://localhost:8888 |
| `pnpm dev --cli` | Dev launcher (terminal multi-select) | Space to select, Enter to confirm, Ctrl+C to stop all |
| `pnpm dev:example` | Start example app dev server | Visit http://localhost:2000 |
| `pnpm build:example` | Build the example app | Production build |
| `pnpm lint:example` | Lint the example app | ESLint (read-only; use `pnpm lint:fix` to auto-fix) |
| `pnpm test` | Run all tests | Unit tests (Vitest: packages + app component tests) |
| `pnpm test:e2e` | E2E smoke tests | Playwright (first run: `pnpm exec playwright install chromium`) |
| `pnpm build:packages` | Build all shared packages | For package development |
| `pnpm build` | Full build | Build all apps and packages |
| `pnpm -F [pkg] [cmd]` | Run a command in a specific package | e.g., `pnpm -F example-app dev` |

### 📁 Project Structure in Detail

#### Apps directory (`apps/`)

Contains standalone Vue 3 apps; each app includes:

```
apps/example-app/
├── src/
│   ├── App.vue           # App root component (SFC)
│   ├── main.ts           # App entry file
│   ├── plugins/          # Vue plugins (Pinia, etc.)
│   ├── router/           # Router configuration (hash mode + lazy loading)
│   ├── utils/            # Request wrapper (axios interceptors)
│   ├── api/              # API layer
│   └── views/            # Page components (tsx / .vue)
├── index.html           # Vite entry template
├── .postcssrc.js        # PostCSS config (mpx → vmin mobile adaptation)
├── package.json         # App configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build configuration
```

#### Packages directory (`packages/`)

Contains shared dependency packages, reusable across apps:

```
packages/shared/
├── src/
│   ├── index.ts         # Package entry file (type guards + number utilities)
│   └── __tests__/       # Vitest tests
├── dist/                # Build output (vite lib + tsc d.ts)
├── package.json         # Package configuration (exports with development condition)
├── vite.config.ts       # Vite lib-mode build configuration
└── tsconfig*.json       # TypeScript configuration
```

### 📄 License

This project template is licensed under the `LICENSE` in the repository.

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📞 Support

- 📖 **View examples**: Check the `example-app` directory for sample code
- 🤖 **Use skills**: Use the built-in AI Skills to quickly scaffold apps and packages
- ⚙️ **Reference configs**: Customize development based on the existing configuration
- 🐛 **Report issues**: Report issues on GitHub Issues

---

## 🎯 Pick Your Starting Point

**If you're a beginner**:

1. Create the project with `npx degit sspkudx/vue-h5#main my-project`
2. Run `cd my-project && pnpm i` to install dependencies
3. Run `pnpm dev:example` to start the dev server
4. Check the sample code in `example-app` to get started

**If you want to kick off a new project quickly**:

1. Create the project with `npx degit sspkudx/vue-h5#main my-app`
2. Use AI skills to create your app: `"Create a new Vue app named my-app"`
3. Create shared packages as needed: `"Create a new dependency package named utils, type: utility library"`
4. Start developing!

**Start your Vue H5 project development journey!** 🚀🎉

> 💡 **Tip**: If you run into issues, check the [🚨 Troubleshooting](#troubleshooting) section first — most problems have a solution there.
