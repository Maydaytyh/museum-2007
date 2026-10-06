/* ============================================================
   win.js —— XP 窗口管理器 / 任务栏 / 开始菜单 / 托盘 / 图标库
   2007 数字生活博物馆核心框架。所有应用模块通过 window.APPS 注册。
   ============================================================ */

/* ---------------- 共享 SVG 图标库（XP 风格手绘近似） ---------------- */
const ICONS = {};

ICONS.mycomputer = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="6" width="30" height="21" rx="2" fill="#d9d4c5" stroke="#7a7568" stroke-width="1.5"/>
  <rect x="8" y="9" width="24" height="15" fill="#2a6bd6"/>
  <rect x="8" y="9" width="24" height="15" fill="url(#mcscr)"/>
  <defs><linearGradient id="mcscr" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5ba3ff"/><stop offset="0.5" stop-color="#2a6bd6"/><stop offset="1" stop-color="#173e8c"/>
  </linearGradient></defs>
  <path d="M6 9 L14 9 L8 24 Z" fill="#ffffff" opacity="0.12"/>
  <rect x="15" y="27" width="10" height="3" fill="#b8b2a0" stroke="#7a7568"/>
  <rect x="10" y="30" width="20" height="3.5" rx="1.5" fill="#cfc9b8" stroke="#7a7568"/>
</svg>`;

ICONS.ie = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="iebg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7ec3ff"/><stop offset="1" stop-color="#1b5fc4"/>
  </linearGradient></defs>
  <circle cx="20" cy="20" r="13" fill="url(#iebg)"/>
  <path d="M8 18 Q20 8 32 18 Q26 24 20 22 Q14 20 8 26 Q14 32 26 28" fill="none" stroke="#fff" stroke-width="2.4" opacity="0.9"/>
  <text x="20" y="27" font-family="Times New Roman,serif" font-style="italic" font-weight="bold" font-size="19" fill="#fff" text-anchor="middle">e</text>
</svg>`;

ICONS.qq = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20" cy="23" rx="12" ry="13" fill="#1a1a1a"/>
  <ellipse cx="20" cy="26" rx="7.5" ry="8.5" fill="#fff"/>
  <ellipse cx="20" cy="11" rx="8.5" ry="7" fill="#1a1a1a"/>
  <circle cx="17" cy="10" r="1.7" fill="#fff"/><circle cx="23" cy="10" r="1.7" fill="#fff"/>
  <path d="M18 13 L20 15.5 L22 13 Z" fill="#f5b800"/>
  <path d="M11 19 Q20 14 29 19 Q29 23 20 21.5 Q11 23 11 19" fill="#e03a3a"/>
  <ellipse cx="11.5" cy="30" rx="3.4" ry="2.4" fill="#f5b800" transform="rotate(-15 11.5 30)"/>
  <ellipse cx="28.5" cy="30" rx="3.4" ry="2.4" fill="#f5b800" transform="rotate(15 28.5 30)"/>
  <path d="M15 32 Q20 36 25 32" fill="#1a1a1a"/>
</svg>`;

ICONS.thunder = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="thg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#1667c9"/>
  </linearGradient></defs>
  <path d="M6 24 Q16 4 36 8 Q24 12 22 20 L28 20 L14 36 L18 24 Z" fill="url(#thg)" stroke="#0c4a94" stroke-width="1"/>
</svg>`;

ICONS.ttplayer = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="ttg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffb75e"/><stop offset="1" stop-color="#ed7d31"/>
  </linearGradient></defs>
  <rect x="5" y="8" width="30" height="24" rx="4" fill="url(#ttg)" stroke="#b35917"/>
  <path d="M17 26 L17 15 L26 13 L26 23" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>
  <circle cx="15.6" cy="26" r="2.5" fill="#fff"/><circle cx="24.6" cy="23" r="2.5" fill="#fff"/>
</svg>`;

ICONS.storm = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="stg"><stop offset="0" stop-color="#63c7ff"/><stop offset="1" stop-color="#0b4f9e"/></radialGradient></defs>
  <circle cx="20" cy="20" r="14" fill="url(#stg)" stroke="#073a75"/>
  <path d="M12 16 Q14 11 20 12 Q17 14 18 17 Q22 12 27 16 Q23 16 23 20 Q27 19 28 24 Q24 22 22 25 Q19 22 14 24 Q16 20 12 16 Z" fill="#fff" opacity="0.92"/>
</svg>`;

ICONS.recycle = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 12 L30 12 L27.5 34 Q27.5 36 25 36 L15 36 Q12.5 36 12.5 34 Z" fill="#b9d7ea" stroke="#587e9e" opacity="0.92"/>
  <rect x="8" y="8" width="24" height="4.5" rx="2" fill="#8fb5cf" stroke="#587e9e"/>
  <path d="M16 5 L24 5 L25 8 L15 8 Z" fill="#8fb5cf" stroke="#587e9e"/>
  <path d="M20 16 L23 21 L17 21 Z M14.5 25 L17.5 30 L11.5 30 Z M25.5 25 L28.5 30 L22.5 30 Z" fill="#2e7d32"/>
  <path d="M18 27 Q20 19 22 27" fill="none" stroke="#1b5e20" stroke-width="2"/>
</svg>`;

ICONS.phone = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="11" y="4" width="18" height="32" rx="4" fill="#2b2b2b" stroke="#111"/>
  <rect x="13.5" y="8" width="13" height="20" rx="1.5" fill="#9adfff"/>
  <rect x="13.5" y="8" width="13" height="20" rx="1.5" fill="none" stroke="#666"/>
  <circle cx="20" cy="31.5" r="2.2" fill="#555"/>
  <rect x="15" y="6" width="10" height="1.6" rx="0.8" fill="#444"/>
</svg>`;

ICONS.museum = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="16" width="28" height="18" fill="#d9cfb4" stroke="#8a7c5a"/>
  <path d="M4 16 L20 5 L36 16 Z" fill="#c4b58e" stroke="#8a7c5a"/>
  <rect x="13" y="21" width="6" height="13" fill="#7a5c34"/>
  <rect x="22" y="21" width="6" height="13" fill="#7a5c34"/>
  <rect x="17" y="8.5" width="6" height="5" fill="#fff" stroke="#8a7c5a"/>
</svg>`;

ICONS.capsule = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="cpg" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#c8a24a"/><stop offset="0.5" stop-color="#f3dd9a"/><stop offset="1" stop-color="#c8a24a"/>
  </linearGradient></defs>
  <rect x="12" y="10" width="16" height="22" rx="8" fill="url(#cpg)" stroke="#8a6a1e"/>
  <ellipse cx="20" cy="10" rx="8" ry="2.6" fill="#f8ecc0" stroke="#8a6a1e"/>
  <path d="M16 18 L20 14 L24 18 L20 22 Z" fill="#8a6a1e" opacity="0.7"/>
</svg>`;

ICONS.folder = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 10 L15 10 L18 14 L36 14 L36 33 L4 33 Z" fill="#f0c36a" stroke="#a3801f"/>
  <path d="M4 10 L15 10 L18 14 L36 14 L36 33 L4 33 Z" fill="none"/>
  <rect x="6" y="17" width="28" height="14" fill="#f8dfa0" opacity="0.6"/>
</svg>`;

ICONS.volume = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 6 L5 6 L9 2 L9 14 L5 10 L2 10 Z" fill="#fff"/>
  <path d="M11 5 Q14 8 11 11" fill="none" stroke="#fff" stroke-width="1.5"/>
</svg>`;

ICONS.rising = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 1 L14 3.5 L14 8 Q14 13 8 15 Q2 13 2 8 L2 3.5 Z" fill="#f5a623" stroke="#b36b08"/>
  <path d="M8 4 L8 12 M5 7 L11 7 M6 5.5 L10 5.5 M6 8.5 L10 8.5 M7 10.5 L9 10.5" stroke="#fff" stroke-width="1.2"/>
</svg>`;

ICONS.winflag = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 4 L9 2.5 L9 9.5 L2 10 Z" fill="#f25022"/>
  <path d="M10.5 2.2 L18 0.8 L18 9.3 L10.5 9.5 Z" fill="#7fba00"/>
  <path d="M2 11.2 L9 10.7 L9 17.7 L2 16.2 Z" fill="#00a4ef"/>
  <path d="M10.5 10.7 L18 10.5 L18 19.2 L10.5 17.4 Z" fill="#ffb900"/>
</svg>`;

ICONS.userpic = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="60" fill="#7ba2e7"/>
  <circle cx="30" cy="23" r="11" fill="#f0d0a0"/>
  <path d="M12 60 Q14 38 30 38 Q46 38 48 60 Z" fill="#3a6ea5"/>
  <path d="M22 42 Q30 48 38 42 L38 46 Q30 52 22 46 Z" fill="#fff"/>
</svg>`;

/* ---------------- 应用注册表 ---------------- */
window.APPS = window.APPS || {};

/* ---------------- 窗口管理器 ---------------- */
const WM = {
  wins: {},
  z: 100,
  activeId: null,

  open(opts) {
    const id = opts.id || ('win' + Date.now() + Math.floor(Math.random() * 999));
    if (this.wins[id]) { this.focus(id); return this.wins[id]; }

    const desktop = document.getElementById('desktop');
    const el = document.createElement('div');
    el.className = 'xp-win';
    el.dataset.winId = id;

    const dw = desktop.clientWidth, dh = desktop.clientHeight;
    const w = Math.min(opts.w || 500, dw - 20);
    const h = Math.min(opts.h || 400, dh - 50);
    const x = opts.x !== undefined ? opts.x : Math.max(4, Math.min(40 + (this.z % 8) * 24, dw - w - 10));
    const y = opts.y !== undefined ? opts.y : Math.max(4, Math.min(30 + (this.z % 8) * 20, dh - h - 40));
    el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${++this.z}`;

    const icon = opts.icon || ICONS.folder;
    el.innerHTML = `
      <div class="xp-titlebar">
        <div class="t-icon">${icon}</div>
        <div class="t-text">${opts.title || '窗口'}</div>
        <div class="t-btns">
          ${opts.min === false ? '' : `<div class="t-btn min" title="最小化"><svg viewBox="0 0 11 11"><rect x="1" y="8" width="7" height="2.4" fill="#fff"/></svg></div>`}
          ${opts.max ? `<div class="t-btn max" title="最大化"><svg viewBox="0 0 11 11"><rect x="1" y="1" width="9" height="9" fill="none" stroke="#fff" stroke-width="1.6"/><rect x="1" y="1" width="9" height="2.6" fill="#fff"/></svg></div>` : ''}
          <div class="t-btn close" title="关闭"><svg viewBox="0 0 11 11"><path d="M2 2 L9 9 M9 2 L2 9" stroke="#fff" stroke-width="2"/></svg></div>
        </div>
      </div>
      <div class="xp-win-body xp-scroll"></div>`;

    const body = el.querySelector('.xp-win-body');
    if (typeof opts.content === 'string') body.innerHTML = opts.content;
    else if (opts.content) body.appendChild(opts.content);

    desktop.appendChild(el);

    const rec = { id, el, body, opts, minimized: false, maximized: false, prevRect: null };
    this.wins[id] = rec;

    /* 事件绑定 */
    el.addEventListener('mousedown', () => this.focus(id));
    el.querySelector('.t-btn.close').addEventListener('click', (e) => { e.stopPropagation(); this.close(id); });
    const minBtn = el.querySelector('.t-btn.min');
    if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); this.minimize(id); });
    const maxBtn = el.querySelector('.t-btn.max');
    if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMax(id); });
    this._makeDraggable(rec);
    this.focus(id);
    Taskbar.addButton(rec);
    if (opts.onOpen) opts.onOpen(rec);
    return rec;
  },

  close(id) {
    const rec = this.wins[id];
    if (!rec) return;
    if (rec.opts.onClose && rec.opts.onClose(rec) === false) return;
    rec.el.remove();
    Taskbar.removeButton(id);
    delete this.wins[id];
    /* 激活下一个 */
    const rest = Object.values(this.wins).filter(r => !r.minimized);
    if (rest.length) this.focus(rest[rest.length - 1].id);
    else { this.activeId = null; document.querySelectorAll('.xp-win').forEach(w => w.classList.add('inactive')); }
  },

  focus(id) {
    const rec = this.wins[id];
    if (!rec || rec.minimized) { if (rec) this.restore(id); return; }
    this.activeId = id;
    rec.el.style.zIndex = ++this.z;
    document.querySelectorAll('.xp-win').forEach(w => w.classList.add('inactive'));
    rec.el.classList.remove('inactive');
    Taskbar.setActive(id);
  },

  minimize(id) {
    const rec = this.wins[id];
    if (!rec) return;
    rec.minimized = true;
    rec.el.style.display = 'none';
    Taskbar.setInactive(id);
    const rest = Object.values(this.wins).filter(r => !r.minimized);
    if (rest.length) this.focus(rest[rest.length - 1].id);
  },

  restore(id) {
    const rec = this.wins[id];
    if (!rec) return;
    rec.minimized = false;
    rec.el.style.display = 'flex';
    this.focus(id);
  },

  toggleMax(id) {
    const rec = this.wins[id];
    if (!rec) return;
    if (!rec.maximized) {
      rec.prevRect = { x: rec.el.offsetLeft, y: rec.el.offsetTop, w: rec.el.offsetWidth, h: rec.el.offsetHeight };
      rec.el.style.left = '0px'; rec.el.style.top = '0px';
      rec.el.style.width = '100%'; rec.el.style.height = 'calc(100% - 30px)';
      rec.el.classList.add('maximized');
      rec.maximized = true;
    } else {
      const p = rec.prevRect || { x: 40, y: 40, w: 500, h: 400 };
      rec.el.style.left = p.x + 'px'; rec.el.style.top = p.y + 'px';
      rec.el.style.width = p.w + 'px'; rec.el.style.height = p.h + 'px';
      rec.el.classList.remove('maximized');
      rec.maximized = false;
    }
  },

  setTitle(id, title) {
    const rec = this.wins[id];
    if (rec) rec.el.querySelector('.t-text').textContent = title;
    Taskbar.renameButton(id, title);
  },

  _makeDraggable(rec) {
    const bar = rec.el.querySelector('.xp-titlebar');
    bar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.t-btn')) return;
      if (rec.maximized) return;
      const sx = e.clientX, sy = e.clientY;
      const ox = rec.el.offsetLeft, oy = rec.el.offsetTop;
      document.body.classList.add('dragging');
      const mv = (ev) => {
        rec.el.style.left = Math.max(-rec.el.offsetWidth + 80, Math.min(ox + ev.clientX - sx, window.innerWidth - 40)) + 'px';
        rec.el.style.top = Math.max(0, Math.min(oy + ev.clientY - sy, window.innerHeight - 60)) + 'px';
      };
      const up = () => {
        document.body.classList.remove('dragging');
        document.removeEventListener('mousemove', mv);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', mv);
      document.addEventListener('mouseup', up);
    });
  },

  /* 托盘气泡通知 */
  balloon({ title, text, icon, timeout = 6000 }) {
    document.querySelectorAll('.tray-balloon').forEach(b => b.remove());
    const b = document.createElement('div');
    b.className = 'tray-balloon';
    b.innerHTML = `<div class="balloon-title">${icon || ICONS.qq}${title}</div><div>${text}</div>`;
    b.addEventListener('click', () => b.remove());
    document.body.appendChild(b);
    if (timeout) setTimeout(() => b.remove(), timeout);
    return b;
  },

  center(rec) {
    const dw = document.getElementById('desktop').clientWidth;
    const dh = document.getElementById('desktop').clientHeight;
    rec.el.style.left = Math.max(0, (dw - rec.el.offsetWidth) / 2) + 'px';
    rec.el.style.top = Math.max(0, (dh - rec.el.offsetHeight) / 2) + 'px';
  }
};

/* ---------------- 任务栏 ---------------- */
const Taskbar = {
  buttons: {},

  addButton(rec) {
    const tb = document.getElementById('task-buttons');
    const btn = document.createElement('div');
    btn.className = 'task-btn';
    btn.innerHTML = `<span class="tb-icon">${rec.opts.icon || ICONS.folder}</span><span class="tb-text">${rec.opts.title || ''}</span>`;
    btn.addEventListener('click', () => {
      if (rec.minimized) WM.restore(rec.id);
      else if (WM.activeId === rec.id) WM.minimize(rec.id);
      else WM.focus(rec.id);
    });
    tb.appendChild(btn);
    this.buttons[rec.id] = btn;
  },

  removeButton(id) { if (this.buttons[id]) { this.buttons[id].remove(); delete this.buttons[id]; } },
  setActive(id) {
    Object.entries(this.buttons).forEach(([k, b]) => b.classList.toggle('active', k === id));
  },
  setInactive(id) { if (this.buttons[id]) this.buttons[id].classList.remove('active'); },
  renameButton(id, t) { if (this.buttons[id]) this.buttons[id].querySelector('.tb-text').textContent = t; }
};

/* ---------------- 开始菜单 ---------------- */
const StartMenu = {
  el: null,

  init() {
    const sm = document.createElement('div');
    sm.id = 'start-menu';
    sm.innerHTML = `
      <div class="sm-header">
        <div class="avatar">${ICONS.userpic}</div>
        <div class="uname">张伟</div>
      </div>
      <div class="sm-body">
        <div class="sm-left" id="sm-programs"></div>
        <div class="sm-right" id="sm-places">
          <div class="sm-item" data-app="__mydoc"><span class="si-ico">${ICONS.folder}</span><span class="si-text">我的文档</span></div>
          <div class="sm-item" data-app="__mycomputer"><span class="si-ico">${ICONS.mycomputer}</span><span class="si-text">我的电脑</span></div>
          <div class="sm-sep"></div>
          <div class="sm-item" data-app="browser"><span class="si-ico">${ICONS.ie}</span><span class="si-text">Internet Explorer</span></div>
          <div class="sm-item" data-app="museum"><span class="si-ico">${ICONS.museum}</span><span class="si-text">数字博物馆</span></div>
          <div class="sm-item" data-app="capsule"><span class="si-ico">${ICONS.capsule}</span><span class="si-text">时间胶囊</span></div>
          <div class="sm-sep"></div>
          <div class="sm-item" data-app="whatchanged"><span class="si-ico">${ICONS.capsule}</span><span class="si-text">What Changed?（2007→2026）</span></div>
        </div>
      </div>
      <div class="sm-brand">Windows XP<br>Professional</div>
      <div class="sm-footer">
        <div class="sm-fbtn" id="sm-logout"><svg viewBox="0 0 20 20"><path d="M3 3 h8 v14 h-8 z" fill="#2e7d32"/><path d="M11 7 h6 v6 h-6 z" fill="#66bb6a"/><path d="M13 10 h6 M17 8 l2 2 -2 2" stroke="#fff" stroke-width="1.5" fill="none"/></svg>注销</div>
        <div class="sm-fbtn" id="sm-shutdown"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#c62828"/><path d="M10 5 v6" stroke="#fff" stroke-width="2.4"/><path d="M6 6.5 Q3.5 9 6 13.5" stroke="#fff" stroke-width="1.6" fill="none"/></svg>关闭计算机</div>
      </div>`;
    document.body.appendChild(sm);
    this.el = sm;

    /* 左栏程序列表 */
    const left = sm.querySelector('#sm-programs');
    Object.entries(APPS).filter(([k, a]) => a && a.startMenu !== false).forEach(([key, app]) => {
      const it = document.createElement('div');
      it.className = 'sm-item';
      it.innerHTML = `<span class="si-ico">${app.icon}</span><span class="si-text">${app.title}</span>`;
      it.addEventListener('click', () => { this.close(); app.launch(); });
      left.appendChild(it);
    });

    sm.querySelectorAll('.sm-item[data-app]').forEach(it => {
      it.addEventListener('click', () => {
        const key = it.dataset.app;
        this.close();
        if (key === '__mycomputer') { if (APPS.mycomputer) APPS.mycomputer.launch(); }
        else if (key === '__mydoc') { if (APPS.mycomputer) APPS.mycomputer.launch('mydoc'); }
        else if (APPS[key]) APPS[key].launch();
      });
    });

    document.getElementById('start-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      sm.classList.contains('open') ? this.close() : this.open();
    });
    document.addEventListener('mousedown', (e) => {
      if (!sm.contains(e.target) && !e.target.closest('#start-btn')) this.close();
    });

    sm.querySelector('#sm-shutdown').addEventListener('click', () => this.shutdown());
    sm.querySelector('#sm-logout').addEventListener('click', () => {
      this.close();
      if (window.confirm('注销会丢掉今晚的聊天记录和下载进度。\n\n确定要注销吗？')) location.reload();
    });
  },

  open() { this.el.classList.add('open'); document.getElementById('start-btn').classList.add('pressed'); },
  close() { this.el.classList.remove('open'); document.getElementById('start-btn').classList.remove('pressed'); },

  shutdown() {
    this.close();
    const ov = document.createElement('div');
    ov.style.cssText = 'position:absolute;inset:0;background:#000;z-index:30000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;font-family:Tahoma;font-size:18px;';
    ov.innerHTML = `<div>正在关机...</div><div style="color:#888;font-size:12px;">（你以为真的能关掉 2007 年吗？）</div>`;
    document.body.appendChild(ov);
    setTimeout(() => { ov.innerHTML = `<div style="font-size:14px;color:#aaa;cursor:pointer" onclick="location.reload()">Windows 正在停止... 点击任意处重新开机</div>`; }, 2200);
  }
};

/* ---------------- 托盘 ---------------- */
const Tray = {
  /* 2007-10-17 21:07 起，按真实速度走 */
  fakeNow: new Date(2007, 9, 17, 21, 7, 0),

  init() {
    const clock = document.getElementById('tray-clock');
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    setInterval(() => {
      this.fakeNow = new Date(this.fakeNow.getTime() + 1000);
      const p = (n) => String(n).padStart(2, '0');
      clock.textContent = `${p(this.fakeNow.getHours())}:${p(this.fakeNow.getMinutes())}`;
      clock.title = `${this.fakeNow.getFullYear()}-${p(this.fakeNow.getMonth() + 1)}-${p(this.fakeNow.getDate())} ${week[this.fakeNow.getDay()]}`;
    }, 1000);
    /* QQ 托盘图标 */
    const qq = document.getElementById('tray-qq');
    if (qq) qq.title = '腾讯QQ2007 - 张伟 [在线]';
  }
};

/* ---------------- 右键菜单 ---------------- */
function showCtxMenu(x, y, items) {
  document.querySelectorAll('.ctx-menu').forEach(m => m.remove());
  const m = document.createElement('div');
  m.className = 'ctx-menu';
  items.forEach(it => {
    if (it === '-') { const s = document.createElement('div'); s.className = 'ctx-sep'; m.appendChild(s); return; }
    const d = document.createElement('div');
    d.className = 'ctx-item';
    d.textContent = it.text;
    if (it.disabled) { d.style.color = '#999'; }
    else d.addEventListener('click', () => { if (it.action) it.action(); m.remove(); });
    m.appendChild(d);
  });
  document.body.appendChild(m);
  m.style.left = Math.min(x, window.innerWidth - m.offsetWidth - 4) + 'px';
  m.style.top = Math.min(y, window.innerHeight - m.offsetHeight - 4) + 'px';
  const close = () => { m.remove(); document.removeEventListener('mousedown', close); };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}
