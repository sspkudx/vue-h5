/**
 * 开发启动器页面逻辑
 * @description 无框架原生 JS：
 * - 轮询 /api/entries 渲染条目状态（后端每次请求实时重扫，新增即出现）
 * - 勾选变化自动保存记忆；全选/全不选/启动所选/停止全部/刷新按钮
 * - 展开条目查看最近日志（轮询 /api/logs）
 */

/** 状态徽标文案映射 */
const STATUS_TEXT = {
    stopped: '未启动',
    starting: '启动中',
    running: '运行中',
    stopping: '停止中',
    done: '已完成',
};

/** 状态徽标样式映射 */
const STATUS_BADGE = {
    stopped: 'badge-stopped',
    starting: 'badge-starting',
    running: 'badge-running',
    stopping: 'badge-stopping',
    done: 'badge-done',
};

/** 当前条目缓存（name → entry）与勾选记忆缓存 */
let entriesCache = [];
let selectionCache = { apps: null, packages: null };
let pollingTimer = null;
const POLL_INTERVAL = 3000;

/** 轻量请求封装 */
const api = async (url, options = {}) => {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    return res.json();
};

/** 根据条目名生成安全的 DOM id（条目名可能含 @ / 等字符） */
const idOf = name => `entry_${String(name).replace(/[^a-zA-Z0-9_-]/g, '_')}`;

/** HTML 转义，防止条目描述注入 */
const escapeHtml = text =>
    String(text).replace(
        /[&<>"']/g,
        char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
    );

/** 当前条目是否已勾选（记忆为 null 时视为全选） */
const isChecked = entry => {
    const saved = selectionCache[entry.kind === 'app' ? 'apps' : 'packages'];
    return Array.isArray(saved) ? saved.includes(entry.name) : true;
};

/** 保存勾选记忆到后端 */
const saveSelection = () => {
    api('/api/selection', { method: 'POST', body: JSON.stringify(selectionCache) });
};

/** 打开/关闭某条目的日志区 */
const toggleLogs = async (name, btn) => {
    const box = document.getElementById(`logs-${idOf(name)}`);
    if (!box) {
        return;
    }
    box.classList.toggle('open');
    btn.textContent = box.classList.contains('open') ? '收起日志' : '查看日志';
    if (box.classList.contains('open')) {
        const data = await api(`/api/logs?name=${encodeURIComponent(name)}`);
        box.textContent = data.logs?.length ? data.logs.join('\n') : '（暂无日志）';
    }
};

/** 渲染一个条目卡片 */
const renderEntry = entry => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.name = entry.name;

    const port = entry.actualPort ?? entry.port;
    const statusText =
        entry.status === 'exited' ? `已退出（code=${entry.exitCode}）` : (STATUS_TEXT[entry.status] ?? entry.status);
    const link = entry.kind === 'app' && port ? `http://localhost:${port}` : '';
    const running = entry.status === 'running' || entry.status === 'starting';
    const badgeClass = STATUS_BADGE[entry.status] ?? 'badge-stopped';
    const id = idOf(entry.name);

    card.innerHTML = `
        <div class="entry-row">
            <input type="checkbox" data-check="${id}" ${isChecked(entry) ? 'checked' : ''} />
            <div>
                <div class="entry-name">${escapeHtml(entry.displayName)}</div>
                <div class="entry-desc">${escapeHtml(entry.description || (entry.extra ? '手工登记条目' : '（无描述）'))}</div>
            </div>
            <div class="entry-meta">
                ${entry.kind === 'app' ? `<span>端口 ${port}</span>` : `<span>${entry.hasDevScript ? 'watch 构建' : '构建一次'}</span>`}
                <span class="badge ${badgeClass}">${escapeHtml(statusText)}</span>
            </div>
        </div>
        <div class="entry-row" style="margin-top: 6px">
            ${link ? `<a href="${link}" target="_blank" rel="noopener">打开应用 →</a>` : ''}
            <button type="button" class="btn logs-toggle" data-toggle="${id}">查看日志</button>
            <button type="button" class="btn ${running ? 'btn-danger' : 'btn-primary'}" data-action="${id}" style="margin-left: auto">
                ${running ? '停止' : '启动'}
            </button>
        </div>
        <div class="logs-box" id="logs-${id}"></div>
    `;

    // 勾选变化：更新记忆并持久化
    card.querySelector(`input[data-check="${id}"]`).addEventListener('change', e => {
        const key = entry.kind === 'app' ? 'apps' : 'packages';
        const list = Array.isArray(selectionCache[key])
            ? selectionCache[key]
            : entriesCache.filter(item => item.kind === entry.kind).map(item => item.name);
        selectionCache[key] = e.target.checked
            ? [...new Set([...list, entry.name])]
            : list.filter(name => name !== entry.name);
        saveSelection();
    });

    // 查看/收起日志
    card.querySelector(`button[data-toggle="${id}"]`).addEventListener('click', e => {
        toggleLogs(entry.name, e.target);
    });

    // 启动/停止单个条目
    card.querySelector(`button[data-action="${id}"]`).addEventListener('click', async e => {
        e.target.disabled = true;
        await api(running ? '/api/stop' : '/api/start', {
            method: 'POST',
            body: JSON.stringify({ name: entry.name }),
        });
        await refresh();
    });

    return card;
};

/** 拉取条目并重新渲染 */
const refresh = async () => {
    const data = await api('/api/entries');
    entriesCache = data.entries ?? [];
    selectionCache = data.config?.selection ?? selectionCache;

    const appList = document.getElementById('app-list');
    const packageList = document.getElementById('package-list');
    const extraSection = document.getElementById('extra-section');
    const extraList = document.getElementById('extra-list');

    appList.innerHTML = '';
    packageList.innerHTML = '';
    extraList.innerHTML = '';
    extraSection.style.display = 'none';

    for (const entry of entriesCache) {
        const target = entry.extra ? extraList : entry.kind === 'app' ? appList : packageList;
        if (entry.extra) {
            extraSection.style.display = '';
        }
        target.appendChild(renderEntry(entry));
    }

    // 首次启动无记忆时，按「全选」回填并持久化，后续保持用户的选择
    if (!Array.isArray(selectionCache.apps) && !Array.isArray(selectionCache.packages) && entriesCache.length > 0) {
        selectionCache = {
            apps: entriesCache.filter(entry => entry.kind === 'app').map(entry => entry.name),
            packages: entriesCache.filter(entry => entry.kind === 'package').map(entry => entry.name),
        };
        saveSelection();
    }

    document.getElementById('last-updated').textContent = `更新于 ${new Date().toLocaleTimeString('zh-Hans')}`;
};

/** 全选/全不选（仅作用于当前渲染的条目） */
const setAllChecked = checked => {
    const allNames = entriesCache.map(entry => entry.name);
    document.querySelectorAll('.entry-card input[type="checkbox"]').forEach(box => {
        box.checked = checked;
    });
    selectionCache = {
        apps: checked ? entriesCache.filter(entry => entry.kind === 'app').map(entry => entry.name) : [],
        packages: checked ? entriesCache.filter(entry => entry.kind === 'package').map(entry => entry.name) : [],
    };
    if (checked && allNames.length === 0) {
        selectionCache = { apps: null, packages: null };
    }
    saveSelection();
    refresh();
};

/** 启动所有已勾选条目（跳过已在运行的） */
const startSelected = async () => {
    const checkedNames = new Set(
        [...document.querySelectorAll('.entry-card input[type="checkbox"]:checked')].map(box => {
            const card = box.closest('.entry-card');
            return card?.dataset.name;
        })
    );
    const targets = entriesCache.filter(
        entry => checkedNames.has(entry.name) && entry.status !== 'running' && entry.status !== 'starting'
    );
    for (const entry of targets) {
        await api('/api/start', { method: 'POST', body: JSON.stringify({ name: entry.name }) });
    }
    await refresh();
};

/** 初始化事件绑定与轮询 */
const init = () => {
    document.getElementById('btn-select-all').addEventListener('click', () => setAllChecked(true));
    document.getElementById('btn-select-none').addEventListener('click', () => setAllChecked(false));
    document.getElementById('btn-start').addEventListener('click', startSelected);
    document.getElementById('btn-stop-all').addEventListener('click', async () => {
        await api('/api/stop-all', { method: 'POST' });
        await refresh();
    });
    document.getElementById('btn-refresh').addEventListener('click', refresh);

    refresh();
    pollingTimer = setInterval(refresh, POLL_INTERVAL);
};

init();
