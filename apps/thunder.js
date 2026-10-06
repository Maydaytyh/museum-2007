/* ============================================================
   apps/thunder.js —— 迅雷 5 窗口复原 + 下载体验模拟
   速度模型（research/internet.md）：宿舍 2M ADSL 晚高峰，
   新任务起速 ~20KB/s，波动爬升至 80–110KB/s 再回落（随机游走）；
   HTTP 直链 20–50KB/s。
   350MB《越狱》集在 ~90KB/s 下剩余约 1 小时——按真实速度走，不做弊；
   仅提供右键「快进演示」×60 供本馆访客加速。
   跨模块契约：window.__DOWNLOADEVENT(key)（浏览器模拟器调用）；
   window.__DLSTATE.pbPct / pbDone 供暴风影音读取（S03E04 进度联动）。
   ============================================================ */
(function () {
  if (!window.DOWNLOADDATA) return;

  /* ---- 样式（仅注入一次） ---- */
  function injectCss() {
    if (document.getElementById('thunder-css')) return;
    const st = document.createElement('style');
    st.id = 'thunder-css';
    st.textContent = `
      .th-win { display:flex; flex-direction:column; height:100%; overflow:hidden; background:#dcebfd; font-size:12px; }
      .th-menu { display:flex; gap:2px; padding:2px 6px; flex:none; background:#eaf3fe; border-bottom:1px solid #b7cdf0; }
      .th-menu span { padding:2px 8px; } .th-menu span:hover { background:#1667c9; color:#fff; }
      .th-toolbar { display:flex; align-items:center; gap:4px; padding:4px 8px; flex:none;
        background:linear-gradient(180deg,#fdfeff 0%,#e8f1fc 50%,#cfe2f8 100%); border-bottom:1px solid #9dbde6; }
      .th-tool { width:34px; height:34px; border:1px solid #9dbde6; border-radius:3px; margin-right:2px;
        background:linear-gradient(180deg,#fff,#d8e9fa); display:flex; flex-direction:column;
        align-items:center; justify-content:center; gap:1px; font-size:11px; color:#0c4a94; }
      .th-tool:hover { filter:brightness(1.08); border-color:#1667c9; }
      .th-tool svg { width:15px; height:15px; }
      .th-search { margin-left:auto; display:flex; gap:2px; }
      .th-search input { width:130px; border:1px solid #7f9db9; font-size:12px; padding:2px 4px; }
      .th-search button { border:1px solid #1667c9; background:linear-gradient(180deg,#8fd0ff,#1667c9);
        color:#fff; font-size:12px; padding:2px 8px; }
      .th-main { flex:1; display:flex; min-height:0; }
      .th-cat { width:150px; flex:none; background:#f4f9ff; border-right:1px solid #b7cdf0; overflow-y:auto; padding:4px 0; }
      .th-cat-title { padding:3px 10px; color:#0c4a94; font-weight:bold; }
      .th-cat-item { display:flex; align-items:center; gap:6px; padding:3px 10px 3px 22px; cursor:default; }
      .th-cat-item:hover { background:#d8e9fa; }
      .th-cat-item.cur { background:#1667c9; color:#fff; }
      .th-cat-item .cnt { margin-left:auto; font-family:Tahoma; color:#888; font-size:11px; }
      .th-cat-item.cur .cnt { color:#d8e9fa; }
      .th-tasks { flex:1; overflow:auto; background:#fff; }
      .th-tasks table { width:100%; border-collapse:collapse; }
      .th-tasks th { position:sticky; top:0; background:linear-gradient(180deg,#f7fbff,#d9e8f8); text-align:left;
        padding:3px 8px; border-right:1px solid #e3edfa; border-bottom:1px solid #9dbde6; color:#0c4a94; white-space:nowrap; }
      .th-tasks td { padding:3px 8px; border-right:1px solid #eef4fb; border-bottom:1px solid #eef4fb;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:230px; font-family:Tahoma; }
      .th-tasks tr:hover td { background:#eaf3fe; }
      .th-tasks tr.failed td { color:#c00; }
      .th-tasks tr.paused td { color:#888; }
      .th-pbar { width:110px; height:11px; border:1px solid #9dbde6; background:#f0f4f8; position:relative; overflow:hidden; }
      .th-pbar i { position:absolute; left:0; top:0; bottom:0; background:linear-gradient(180deg,#7ec3ff,#1667c9); display:block; }
      .th-pbar b { position:absolute; left:0; right:0; top:0; bottom:0; text-align:center; font-size:10px;
        font-family:Tahoma; color:#0c4a94; line-height:11px; font-weight:normal; }
      .th-sp { width:70px; text-align:right; }
      .th-ad { flex:none; height:20px; background:linear-gradient(180deg,#ffe9b8,#ffd88a); border-top:1px solid #d9b25c;
        display:flex; align-items:center; justify-content:center; gap:8px; color:#7a4d00; }
      .th-status { flex:none; display:flex; gap:0; border-top:1px solid #b7cdf0; background:#ece9d8; }
      .th-status .sb { border:1px solid #d4d0c4; border-right-color:#fff; border-bottom-color:#fff;
        padding:1px 8px; height:18px; display:flex; align-items:center; font-family:Tahoma; font-size:11px; color:#333; }
      .th-status .sb.grow { flex:1; }`;
    document.head.appendChild(st);
  }

  const SVG_NEW = '<svg viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" fill="#fff" stroke="#1667c9"/><path d="M8 5.5 v5 M5.5 8 h5" stroke="#1667c9" stroke-width="1.6"/></svg>';
  const SVG_START = '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="#3a9b3a"/><path d="M6.5 5 L11 8 L6.5 11 Z" fill="#fff"/></svg>';
  const SVG_PAUSE = '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="#d98a10"/><rect x="5" y="5" width="2" height="6" fill="#fff"/><rect x="9" y="5" width="2" height="6" fill="#fff"/></svg>';
  const SVG_DEL = '<svg viewBox="0 0 16 16"><rect x="2" y="5" width="12" height="9" rx="1" fill="#c96060"/><rect x="4" y="3" width="8" height="2" fill="#a03c3c"/><path d="M6 7 v4 M10 7 v4" stroke="#fff" stroke-width="1.2"/></svg>';
  const SVG_DIR = '<svg viewBox="0 0 16 16"><path d="M1 4 L6 4 L8 6 L15 6 L15 13 L1 13 Z" fill="#f0c36a" stroke="#a3801f"/></svg>';

  function fmtMB(mb) { return mb >= 1024 ? (mb / 1024).toFixed(2) + 'GB' : Math.round(mb) + 'MB'; }
  function fmtRemain(sec) {
    sec = Math.max(0, Math.round(sec));
    if (!isFinite(sec)) return '…';
    if (sec >= 3600) return Math.floor(sec / 3600) + '时' + Math.floor(sec % 3600 / 60) + '分';
    return Math.floor(sec / 60) + '分' + ('0' + sec % 60).slice(-2) + '秒';
  }

  /* ================= 联动状态（暴风影音读取） ================= */
  window.__DLSTATE = window.__DLSTATE || { pbPct: 47, pbDone: false };

  /* ================= 运行状态（关窗后保留，托盘「后台运行」既视感） ================= */
  var S = null;
  var win = null;   /* 当前窗口 rec（可能为 null） */

  function freshState() {
    const D = window.DOWNLOADDATA;
    const dl = D.initial.downloading.map(function (t) {
      return { name: t.name, sizeMB: t.sizeMB, src: t.src, cat: t.cat, resources: t.resources,
        doneKB: Math.round(t.sizeMB * 1024 * t.progress / 100),
        v: 78 + Math.random() * 22, ramp: 60, mult: 1, state: 'run' };
    });
    const failed = D.initial.failed.map(function (t) {
      return { name: t.name, sizeMB: 0, src: t.src, cat: t.cat, resources: '0/0',
        doneKB: 0, v: 0, mult: 1, state: 'fail', msg: t.msg };
    });
    return {
      downloading: dl, failed: failed,
      done: D.initial.done.slice(), trash: D.initial.trash.slice(),
      cat: 'run', timer: null
    };
  }

  /* ---- 速度模拟：起速 20KB/s 爬升至 80–110KB/s 再随机游走、偶尔回落 ---- */
  function speedWalk(t) {
    t.ramp++;
    if (t.ramp < 60) {
      t.v += 1.0 + Math.random() * 1.6;
    } else {
      t.v += (Math.random() - 0.48) * 12;
      if (Math.random() < 0.04) t.v *= 0.55;   /* 瞬时掉速：宿舍晚高峰真实体感 */
    }
    if (t.src === 'HTTP下载') t.v = Math.max(18, Math.min(52, t.v));   /* HTTP 直链 20–50KB/s */
    else t.v = Math.max(22, Math.min(115, t.v));                       /* BT 好资源 60–110KB/s */
    return t.v;
  }

  function isPB(t) { return t.name.indexOf('S03E04') >= 0; }

  function completeTask(t) {
    t.doneKB = t.sizeMB * 1024;
    const i = S.downloading.indexOf(t);
    if (i >= 0) S.downloading.splice(i, 1);
    S.done.unshift({ name: t.name, sizeMB: t.sizeMB, src: t.src, cat: t.cat, date: '2007-10-17' });
    if (isPB(t)) {
      window.__DLSTATE.pbPct = 100; window.__DLSTATE.pbDone = true;
      WM.balloon({
        title: '迅雷5：任务完成',
        text: '《越狱》第三季 第4集 下载完成（350MB）。\n想看的话用暴风影音直接播放，别剧透给隔壁宿舍。',
        icon: ICONS.thunder, timeout: 12000
      });
    } else {
      WM.balloon({ title: '迅雷5：任务完成', text: '「' + t.name + '」下载完成。', icon: ICONS.thunder, timeout: 6000 });
    }
  }

  /* ---- 唯一心跳（窗口开与关都推进；窗口开着时刷新 UI） ---- */
  function tickOnce() {
    let total = 0;
    S.downloading.forEach(function (t) {
      if (t.state !== 'run') return;
      speedWalk(t);
      t.doneKB += t.v * (t.mult || 1);
      total += t.v;
      if (t.doneKB >= t.sizeMB * 1024) completeTask(t);
    });
    S.downloading.forEach(function (t) {
      if (isPB(t)) window.__DLSTATE.pbPct = Math.min(100, t.doneKB / (t.sizeMB * 1024) * 100);
    });
    if (win && WM.wins['thunder5']) refreshUI(total);
  }

  /* ---- 添加任务（窗口内/跨模块共用） ---- */
  function addTask(def) {
    if (!S) S = freshState();
    const exists = S.downloading.concat(S.done).some(function (t) { return t.name === def.name; });
    if (exists) {
      WM.balloon({ title: '迅雷5', text: '任务「' + def.name + '」已在列表中，无需重复添加。\n〔馆注〕右键任务行可×60 快进演示。', icon: ICONS.thunder, timeout: 6000 });
      if (win && WM.wins['thunder5']) WM.focus('thunder5');
      return;
    }
    S.downloading.unshift({
      name: def.name, sizeMB: def.sizeMB, src: def.src, cat: def.cat || '影视',
      resources: def.resources || '3/12',
      doneKB: 0, v: 18, ramp: 0, mult: 1, state: 'run'
    });
    if (!S.timer) S.timer = setInterval(tickOnce, 1000);
    WM.balloon({
      title: '迅雷5：新建任务',
      text: '「' + def.name + '」（' + fmtMB(def.sizeMB) + '）已添加，开始连接资源…' + (def.note ? '\n' + def.note : '') + '\n〔馆注〕下载很慢是当年的真实：右键任务行可×60 快进演示。',
      icon: ICONS.thunder, timeout: 9000
    });
    S.cat = 'run';
    if (win && WM.wins['thunder5']) refreshUI();
  }

  /* ================= UI ================= */
  function refreshUI(totalSpeed) {
    const body = win.body;
    const cr = body.querySelector('#th-c-run'), cd = body.querySelector('#th-c-done'),
      ct = body.querySelector('#th-c-trash'), tb = body.querySelector('#th-tasks');
    if (cr) cr.textContent = S.downloading.length + S.failed.length;
    if (cd) cd.textContent = S.done.length;
    if (ct) ct.textContent = S.trash.length;

    if (S.cat === 'run') {
      let total = (totalSpeed === undefined) ? null : totalSpeed;
      if (total === null) { total = 0; S.downloading.forEach(function (t) { if (t.state === 'run') total += t.v; }); }
      let html = '<table><tr><th style="width:26px;">状态</th><th>文件名</th><th>大小</th><th>进度</th><th>速度</th><th>资源</th><th>剩余时间</th></tr>';
      S.downloading.forEach(function (t, i) {
        const totalKB = t.sizeMB * 1024, pct = Math.min(100, t.doneKB / totalKB * 100);
        const rem = (t.state === 'run' && t.v > 1) ? (totalKB - t.doneKB) / t.v : Infinity;
        html += `<tr data-idx="${i}" class="${t.state === 'pause' ? 'paused' : ''}">
          <td>${t.state === 'pause' ? '⏸' : '↓'}</td><td title="${t.src}">${t.name}</td><td>${fmtMB(t.sizeMB)}</td>
          <td><div class="th-pbar"><i style="width:${pct}%"></i><b>${pct.toFixed(1)}%</b></div></td>
          <td class="th-sp">${t.state === 'pause' ? '0.0' : t.v.toFixed(1)} KB/s${t.mult > 1 ? '<br><span style="color:#c60">演示×' + t.mult + '</span>' : ''}</td>
          <td>${t.resources}</td><td>${t.state === 'pause' ? '已暂停' : fmtRemain(rem)}</td></tr>`;
      });
      S.failed.forEach(function (t) {
        html += `<tr class="failed"><td>✕</td><td title="${t.msg}">${t.name}</td><td>0.0MB</td><td>死链</td><td>0 KB/s</td><td>0/0</td><td>—</td></tr>`;
      });
      tb.innerHTML = html + '</table>';
      Array.prototype.forEach.call(tb.querySelectorAll('tr[data-idx]'), function (tr) {
        tr.addEventListener('contextmenu', function (e) {
          e.preventDefault();
          const t = S.downloading[+tr.dataset.idx];
          if (!t) return;
          showCtxMenu(e.clientX, e.clientY, [
            { text: t.state === 'pause' ? '开始下载(S)' : '暂停下载(P)', action: function () { t.state = (t.state === 'pause') ? 'run' : 'pause'; refreshUI(); } },
            '-',
            { text: t.mult > 1 ? '恢复正常速度（退出演示）' : '快进演示 ×60（本馆访客专用）', action: function () { t.mult = (t.mult > 1 ? 1 : 60); refreshUI(); } },
            '-',
            { text: '打开目录(D)', action: function () { WM.balloon({ title: '资源管理器', text: window.DOWNLOADDATA.defaultDir + '\n' + t.name, icon: ICONS.folder, timeout: 4000 }); } },
            { text: '删除任务(X)', action: function () {
              const i = S.downloading.indexOf(t);
              if (i >= 0) { S.downloading.splice(i, 1); S.trash.push({ name: t.name, msg: '任务已删除', date: '2007-10-17' }); }
              refreshUI();
            } }
          ]);
        });
      });
      const ts = body.querySelector('#th-total');
      if (ts) ts.textContent = '总速度: ' + total.toFixed(1) + ' KB/s' + (total >= 1024 ? ' (' + (total / 1024).toFixed(2) + ' M)' : '');
    } else if (S.cat === 'done') {
      let html = '<table><tr><th>文件名</th><th>大小</th><th>来源</th><th>完成时间</th></tr>';
      S.done.forEach(function (t) {
        html += `<tr><td>${t.name}</td><td>${fmtMB(t.sizeMB)}</td><td>${t.src}</td><td>${t.date}</td></tr>`;
      });
      tb.innerHTML = html + '</table>';
    } else {
      let html = '<table><tr><th>文件名</th><th>备注</th><th>删除时间</th></tr>';
      S.trash.forEach(function (t) {
        html += `<tr class="failed"><td>${t.name}</td><td>${t.msg}</td><td>${t.date}</td></tr>`;
      });
      tb.innerHTML = html + '</table>';
    }
    const cn = body.querySelector('#th-count');
    if (cn) cn.textContent = '任务 ' + S.downloading.length + '/' + (S.downloading.length + S.done.length) + ' · 服务器连接正常';
  }

  APPS.thunder = {
    title: '迅雷5',
    icon: ICONS.thunder,
    desktop: true,
    order: 7,
    hint: '迅雷5 —— 下载一切',
    launch: function () {
      injectCss();
      if (win && WM.wins['thunder5']) { WM.focus('thunder5'); return; }
      if (!S) S = freshState();
      const D = window.DOWNLOADDATA;

      win = WM.open({
        id: 'thunder5', title: '迅雷5 - ' + D.version, icon: ICONS.thunder,
        w: 720, h: 500, x: 90, y: 40,
        content: `
          <div class="th-win">
            <div class="th-menu"><span>任务(T)</span><span>编辑(E)</span><span>查看(V)</span><span>收藏(C)</span><span>工具(L)</span><span>帮助(H)</span></div>
            <div class="th-toolbar">
              <div class="th-tool" id="th-new" title="新建下载任务">${SVG_NEW}新建</div>
              <div class="th-tool" id="th-start" title="开始任务">${SVG_START}开始</div>
              <div class="th-tool" id="th-pause" title="暂停任务">${SVG_PAUSE}暂停</div>
              <div class="th-tool" id="th-del" title="删除任务">${SVG_DEL}删除</div>
              <div class="th-tool" id="th-dir" title="打开目录">${SVG_DIR}目录</div>
              <div class="th-search">
                <input id="th-q" placeholder="狗狗搜索：片名/歌曲/游戏">
                <button id="th-go">搜索</button>
              </div>
            </div>
            <div class="th-main">
              <div class="th-cat">
                <div class="th-cat-title">任务分类</div>
                <div class="th-cat-item cur" data-cat="run">▶ 正在下载<span class="cnt" id="th-c-run"></span></div>
                <div class="th-cat-item" data-cat="done">✔ 已完成<span class="cnt" id="th-c-done"></span></div>
                <div class="th-cat-item" data-cat="trash">✕ 垃圾箱<span class="cnt" id="th-c-trash"></span></div>
                <div class="th-cat-title" style="margin-top:6px;">我的收藏</div>
                <div class="th-cat-item" style="color:#999;">电影 音乐 游戏</div>
              </div>
              <div class="th-tasks xp-scroll" id="th-tasks"></div>
            </div>
            <div class="th-ad">★ 狗狗影视 gougou.com —— 《越狱》第三季 每周三更新 · RMVB 火热下载中</div>
            <div class="th-status">
              <div class="sb" id="th-total" style="min-width:150px;">总速度: 0 KB/s</div>
              <div class="sb">2M ADSL（宿舍·四人均摊）</div>
              <div class="sb grow" id="th-count"></div>
              <div class="sb">P2SP 多资源超线程</div>
            </div>
          </div>`,
        onClose: function () { win = null; }   /* 心跳不清理：托盘「后台继续下载」 */
      });

      const q = function (sel) { return win.body.querySelector(sel); };

      /* 分类切换 */
      Array.prototype.forEach.call(win.body.querySelectorAll('.th-cat-item[data-cat]'), function (it) {
        it.addEventListener('click', function () {
          Array.prototype.forEach.call(win.body.querySelectorAll('.th-cat-item'), function (x) { x.classList.remove('cur'); });
          it.classList.add('cur');
          S.cat = it.dataset.cat;
          refreshUI();
        });
      });

      /* 工具栏 */
      q('#th-new').addEventListener('click', function () { newTaskDialog(''); });
      q('#th-start').addEventListener('click', function () { S.downloading.forEach(function (t) { t.state = 'run'; }); refreshUI(); });
      q('#th-pause').addEventListener('click', function () { S.downloading.forEach(function (t) { t.state = 'pause'; }); refreshUI(); });
      q('#th-del').addEventListener('click', function () {
        const t = S.downloading[0];
        if (t) {
          const i = S.downloading.indexOf(t);
          S.downloading.splice(i, 1);
          S.trash.push({ name: t.name, msg: '任务已删除', date: '2007-10-17' });
          refreshUI();
        }
      });
      q('#th-dir').addEventListener('click', function () {
        WM.balloon({ title: '资源管理器', text: window.DOWNLOADDATA.defaultDir + '\n共 12 个文件，7.9GB（剩余空间 92.4GB）', icon: ICONS.folder, timeout: 5000 });
      });
      function doSearch() {
        const kw = q('#th-q').value.trim();
        if (!kw) return;
        addTask({ name: kw + '.DVDRip中字.rmvb', sizeMB: 300 + Math.floor(Math.random() * 400), src: 'BT下载', cat: '影视', resources: '5/31' });
      }
      q('#th-go').addEventListener('click', doSearch);
      q('#th-q').addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });

      refreshUI();
      if (!S.timer) S.timer = setInterval(tickOnce, 1000);
    }
  };

  /* ---- 新建任务弹窗（默认填 ed2k 链接，存 D:\电影\） ---- */
  function newTaskDialog() {
    const D = window.DOWNLOADDATA;
    const w2 = WM.open({
      id: 'th-newtask', title: '建立新的下载任务', icon: ICONS.thunder, w: 460, h: 260, x: 240, y: 160,
      content: `
        <div style="padding:12px 16px;display:flex;flex-direction:column;gap:8px;height:100%;">
          <div>网址(URL)：</div>
          <input class="xp-input" id="th-url" style="width:100%;" value="${D.demoURL}">
          <div>存储路径：</div>
          <input class="xp-input" id="th-dir" style="width:100%;" value="${D.defaultDir}">
          <div style="display:flex;gap:8px;align-items:center;">分类：
            <select class="xp-select"><option>影视</option><option>音乐</option><option>游戏</option><option>软件</option></select>
            <span style="color:#808080;">（多资源超线程已就绪）</span>
          </div>
          <div style="margin-top:auto;display:flex;justify-content:flex-end;gap:8px;">
            <button class="xp-btn" id="th-ok">确定</button>
            <button class="xp-btn" id="th-cancel">取消</button>
          </div>
        </div>`
    });
    WM.center(w2);
    w2.body.querySelector('#th-ok').addEventListener('click', function () {
      const u = w2.body.querySelector('#th-url').value.trim();
      const m = u.match(/file\|([^|]+)\|(\d+)/);
      const name = m ? m[1] : (u.slice(0, 40) + '.bin');
      const sizeMB = m ? Math.max(1, Math.round(+m[2] / 1048576)) : (200 + Math.floor(Math.random() * 500));
      addTask({
        name: name, sizeMB: sizeMB,
        src: u.indexOf('ed2k') === 0 ? 'ed2k下载' : 'HTTP下载', cat: '影视',
        resources: (2 + Math.floor(Math.random() * 4)) + '/' + (8 + Math.floor(Math.random() * 20))
      });
      WM.close('th-newtask');
    });
    w2.body.querySelector('#th-cancel').addEventListener('click', function () { WM.close('th-newtask'); });
  }

  /* ================= 跨模块契约：浏览器模拟器调用 ================= */
  window.__DOWNLOADEVENT = function (key) {
    const def = window.DOWNLOADDATA.keymap[key];
    APPS.thunder.launch();            /* 打开（或聚焦）迅雷窗口 */
    if (def) addTask(def);            /* 已存在时 addTask 内部会提示，不重复添加 */
  };
})();
