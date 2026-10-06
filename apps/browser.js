/* ============================================================
   browser.js —— Internet Explorer 6 模拟器（2007 学生机主力）
   契约：WM.open / ICONS.ie / APPS.browser = {title, icon, desktop, order, launch}
   站点渲染：window.WEBDATA.resolve(url)（见 data/web.js）
   断代：单窗口无标签；菜单栏+工具栏+地址栏+状态栏；弹出窗口直接弹
   ============================================================ */
(function () {
  'use strict';

  var HOMEPAGE = 'www.baidu.com';
  var winSeq = 0;
  var adSession = 0;        /* 流氓广告条：每个会话最多 2 次 */
  var states = {};          /* winId → {hist, idx, timers} */

  /* ---------- IE chrome 样式（一次性注入，.ie- 前缀隔离） ---------- */
  function injectChromeCSS() {
    if (document.getElementById('ie-chrome-css')) return;
    var s = document.createElement('style');
    s.id = 'ie-chrome-css';
    s.textContent = [
      '.ie-root { flex:1; display:flex; flex-direction:column; min-height:0; position:relative; font:12px SimSun,宋体; background:#ece9d8; }',
      '.ie-menubar .m-item { padding:2px 8px; cursor:default; }',
      '.ie-menubar .m-item:hover { background:#316ac5; color:#fff; }',
      '.ie-toolbar .tb-btn { width:26px; height:26px; display:flex; align-items:center; justify-content:center; border:1px solid transparent; cursor:default; }',
      '.ie-toolbar .tb-btn:hover { border-color:#b6bdd2; background:#dfeaf7; }',
      '.ie-toolbar .tb-btn.on:active { background:#c1d2ee; }',
      '.ie-toolbar .tb-btn.dis { opacity:.35; filter:grayscale(1); }',
      '.ie-toolbar .tb-btn svg { width:20px; height:20px; }',
      '.ie-sep { width:1px; height:22px; background:#c9c6bb; margin:0 3px; }',
      '.ie-addr-label { color:#444; margin-left:6px; }',
      '.ie-addr { flex:none; display:flex; align-items:center; gap:4px; padding:2px 4px; background:#ece9d8; border-bottom:1px solid #c9c6bb; }',
      '.ie-addr input { flex:1; border:1px solid #7f9db9; padding:2px 4px; font:12px SimSun,宋体; background:#fff; }',
      '.ie-go { padding:1px 10px; font:12px SimSun,宋体; background:linear-gradient(180deg,#fff,#e5e3d6); border:1px solid #a6a296; cursor:pointer; }',
      '.ie-page { flex:1; overflow:auto; background:#fff; position:relative; min-height:0; }',
      '.ie-page a { cursor:pointer; }',
      '.ie-sb-prog { width:120px; height:11px; border:1px solid #a0a0a0; background:#fff; overflow:hidden; padding:1px; }',
      '.ie-sb-prog i { display:block; height:100%; background:repeating-linear-gradient(90deg,#2b7cd3 0 6px,#5aa5ee 6px 9px); width:0%; }',
      '.ie-favmenu { position:absolute; z-index:60; background:#fff; border:1px solid #8c8c8c; box-shadow:2px 2px 4px rgba(0,0,0,.3); min-width:170px; padding:2px; }',
      '.ie-favmenu .fi { padding:4px 22px 4px 26px; cursor:default; background:no-repeat 8px center; }',
      '.ie-favmenu .fi:hover { background-color:#316ac5; color:#fff; }',
      '.ie-adbar { position:absolute; left:0; right:0; bottom:26px; z-index:55; display:flex; align-items:center; gap:8px;',
      '  padding:4px 8px; background:linear-gradient(180deg,#fff7c0,#ffe25e); border-top:1px solid #d0a000; color:#a04000; font:12px SimSun; }',
      '.ie-adbar .blink { animation:ie-blink 1s steps(1) infinite; font-weight:bold; flex:1; }',
      '.ie-adbar a { color:#c00; text-decoration:underline; }',
      '.ie-adbar .x { margin-left:auto; padding:0 5px; border:1px solid #c09000; background:#fff8d8; cursor:pointer; color:#603000; }',
      '@keyframes ie-blink { 50% { opacity:.25; } }',
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ---------- 简画 SVG 图标 ---------- */
  var IC = {
    back: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#3fa63f" stroke="#1e7a1e"/><path d="M12 5 L6.5 10 L12 15" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    fwd: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#9fbf9f" stroke="#7a9a7a"/><path d="M8 5 L13.5 10 L8 15" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    stop: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#d84c1f" stroke="#a03000"/><path d="M6.5 6.5 L13.5 13.5 M13.5 6.5 L6.5 13.5" stroke="#fff" stroke-width="2.2"/></svg>',
    refresh: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#3fa63f" stroke="#1e7a1e"/><path d="M6 8 A5 5 0 1 1 6 12" fill="none" stroke="#fff" stroke-width="2"/><path d="M4.5 6 L6.5 8.8 L9 7" fill="#fff"/></svg>',
    home: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#4a90d8" stroke="#1c5da0"/><path d="M5.5 10.5 L10 6 L14.5 10.5 M7 10 L7 14 L13 14 L13 10" fill="none" stroke="#fff" stroke-width="1.8"/></svg>',
    globe: '<svg viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" fill="#4a90d8" stroke="#1c5da0"/><path d="M2 7 h10 M7 1.5 c-3 3.5 -3 7.5 0 11 M7 1.5 c3 3.5 3 7.5 0 11" stroke="#fff" stroke-width="0.9" fill="none"/></svg>',
    mail: '<svg viewBox="0 0 14 14"><rect x="1.5" y="3" width="11" height="8" fill="#fff" stroke="#888"/><path d="M2 3.5 L7 8 L12 3.5" fill="none" stroke="#888"/></svg>'
  };

  function normUrl(v) {
    v = String(v || '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    if (!v) return null;
    return v;
  }

  /* ---------- 每窗口状态 ---------- */
  function newState() {
    return { hist: [], idx: -1, timers: [], progTimer: null, url: null };
  }
  function clearTimers(st) {
    st.timers.forEach(clearTimeout);
    st.timers = [];
    if (st.progTimer) { clearTimeout(st.progTimer); st.progTimer = null; }
  }
  function later(st, fn, ms) {
    var t = setTimeout(function () {
      var i = st.timers.indexOf(t);
      if (i > -1) st.timers.splice(i, 1);
      fn();
    }, ms);
    st.timers.push(t);
  }

  /* ============================================================
     打开浏览器窗口
     ============================================================ */
  function launch(startUrl) {
    injectChromeCSS();
    var id = 'ie-win-' + (++winSeq);
    var st = newState();

    var rec = WM.open({
      id: id,
      title: (startUrl ? '' : '百度一下，你就知道 - ') + 'Microsoft Internet Explorer',
      icon: ICONS.ie,
      w: 900, h: 620,
      max: true,
      content: buildChrome(id),
      onClose: function () { clearTimers(st); delete states[id]; }
    });

    var root = rec.body.querySelector('.ie-root');
    wireChrome(id, rec, root, st);
    states[id] = st;

    setTimeout(function () { navigate(id, startUrl || HOMEPAGE); }, 60);
    return rec;
  }

  function buildChrome(id) {
    var favItems = (window.WEBDATA && WEBDATA.FAVORITES || []).map(function (f) {
      return '<div class="fi" data-fav="' + f.url + '">' + f.name + '</div>';
    }).join('');
    return '<div class="ie-root">' +
      '<div class="xp-menubar ie-menubar">' +
        '<span class="m-item">文件(F)</span><span class="m-item">编辑(E)</span><span class="m-item">查看(V)</span>' +
        '<span class="m-item" data-menu="fav">收藏夹(A) ▾</span>' +
        '<span class="m-item">工具(T)</span><span class="m-item">帮助(H)</span>' +
        '<div class="ie-favmenu" style="display:none;">' + favItems + '</div>' +
      '</div>' +
      '<div class="xp-toolbar ie-toolbar">' +
        '<span class="tb-btn dis" data-act="back" title="后退">' + IC.back + '</span>' +
        '<span class="tb-btn dis" data-act="fwd" title="前进">' + IC.fwd + '</span>' +
        '<span class="tb-btn" data-act="stop" title="停止">' + IC.stop + '</span>' +
        '<span class="tb-btn" data-act="refresh" title="刷新">' + IC.refresh + '</span>' +
        '<span class="tb-btn" data-act="home" title="主页">' + IC.home + '</span>' +
        '<span class="ie-sep"></span>' +
        '<span style="display:flex;align-items:center;gap:6px;flex:1;min-width:0;overflow:hidden;">' + '<span style="display:inline-flex;width:16px;height:16px;flex:none;">' + IC.mail + '</span>' + '<span style="color:#316ac5;">邮件</span><span style="color:#888;">| 打印</span></span>' +
      '</div>' +
      '<div class="ie-addr">' +
        '<span class="ie-addr-label">地址(D)</span>' +
        '<input type="text" class="ie-url" value="">' +
        '<button type="button" class="ie-go">转到</button>' +
      '</div>' +
      '<div class="ie-page xp-scroll"></div>' +
      '<div class="xp-statusbar">' +
        '<span class="sb-block ie-status" style="flex:1;overflow:hidden;">完成</span>' +
        '<span class="sb-block ie-prog-wrap" style="padding:2px 3px;"><span class="ie-sb-prog"><i></i></span></span>' +
        '<span class="sb-block" style="gap:4px;">' + IC.globe + ' Internet</span>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
     事件接线
     ============================================================ */
  function wireChrome(id, rec, root, st) {
    var page = root.querySelector('.ie-page');
    var urlInput = root.querySelector('.ie-url');
    var statusEl = root.querySelector('.ie-status');
    var progBar = root.querySelector('.ie-sb-prog i');
    var progWrap = root.querySelector('.ie-prog-wrap');

    st.el = { page: page, urlInput: urlInput, statusEl: statusEl, progBar: progBar, progWrap: progWrap, root: root, rec: rec };

    function setStatus(t) { statusEl.textContent = t; }
    function setProg(p) { progBar.style.width = p + '%'; }
    st.setStatus = setStatus; st.setProg = setProg;

    /* 工具栏 */
    root.querySelector('.ie-toolbar').addEventListener('click', function (e) {
      var b = e.target.closest('.tb-btn');
      if (!b || b.classList.contains('dis')) return;
      var act = b.dataset.act;
      if (act === 'back') goBack(id);
      else if (act === 'fwd') goFwd(id);
      else if (act === 'refresh') { if (st.url) { render(id, st.url); } }
      else if (act === 'home') navigate(id, HOMEPAGE);
      else if (act === 'stop') { clearTimers(st); setProg(0); setStatus('完成'); }
    });

    /* 地址栏 */
    function addrGo() {
      var u = normUrl(urlInput.value);
      if (u) navigate(id, u);
    }
    urlInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addrGo(); } });
    root.querySelector('.ie-go').addEventListener('click', addrGo);

    /* 收藏夹菜单 */
    var favMenu = root.querySelector('.ie-favmenu');
    var favBtn = root.querySelector('[data-menu="fav"]');
    favBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      favMenu.style.display = favMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('mousedown', function closeFav(e) {
      if (!favMenu.isConnected) { document.removeEventListener('mousedown', closeFav); return; }
      if (favMenu.style.display === 'block' && !e.target.closest('.ie-favmenu')) favMenu.style.display = 'none';
    });
    favMenu.addEventListener('click', function (e) {
      var fi = e.target.closest('.fi');
      if (!fi) return;
      favMenu.style.display = 'none';
      navigate(id, fi.dataset.fav);
    });

    /* 页内链接接管 + 状态栏悬停 URL + 站内搜索表单 */
    page.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-href]');
      if (a) { e.preventDefault(); navigate(id, a.dataset.href); }
    });
    page.addEventListener('mouseover', function (e) {
      var a = e.target.closest('a[data-href]');
      if (a) setStatus('http://' + a.dataset.href);
    });
    page.addEventListener('mouseout', function (e) {
      if (e.target.closest('a[data-href]')) setStatus('完成');
    });
    page.addEventListener('submit', function (e) {
      var f = e.target.closest('form[data-search]');
      if (!f) return;
      e.preventDefault();
      var q = (f.querySelector('input[name="q"]') || {}).value || '';
      q = String(q).trim().replace(/^张伟，说点什么吧……$/, '');
      if (!q) { q = '百度'; }
      navigate(id, f.dataset.search.replace('{q}', encodeURIComponent(q)));
    });
  }

  /* ============================================================
     导航 + 历史栈
     ============================================================ */
  function navigate(id, url) {
    var st = states[id];
    if (!st) return;
    url = normUrl(url) || HOMEPAGE;
    st.hist = st.hist.slice(0, st.idx + 1);
    st.hist.push(url);
    if (st.hist.length > 40) st.hist.shift();
    st.idx = st.hist.length - 1;
    render(id, url);
  }
  function goBack(id) {
    var st = states[id];
    if (!st || st.idx <= 0) return;
    st.idx--;
    render(id, st.hist[st.idx]);
  }
  function goFwd(id) {
    var st = states[id];
    if (!st || st.idx >= st.hist.length - 1) return;
    st.idx++;
    render(id, st.hist[st.idx]);
  }

  function updateNavBtns(id) {
    var st = states[id];
    if (!st || !st.el) return;
    var back = st.el.root.querySelector('[data-act="back"]');
    var fwd = st.el.root.querySelector('[data-act="fwd"]');
    back.classList.toggle('dis', st.idx <= 0);
    fwd.classList.toggle('dis', st.idx >= st.hist.length - 1);
  }

  /* ============================================================
     渲染：进度条模拟 + WEBDATA / 404
     ============================================================ */
  function render(id, url) {
    var st = states[id];
    if (!st) return;
    clearTimers(st);
    st.url = url;
    st.el.urlInput.value = 'http://' + url;
    st.setStatus('正在打开网页 http://' + url + '……');
    st.setProg(12);

    later(st, function () { if (st.url === url) st.setProg(48); }, 260);
    later(st, function () { if (st.url === url) st.setProg(78); }, 520);
    later(st, function () {
      if (st.url !== url || !states[id]) return;
      var site = window.WEBDATA ? WEBDATA.resolve(url) : null;
      st.el.page.scrollTop = 0;
      if (site) {
        site.render(st.el.page);
        WM.setTitle(id, site.title + ' - Microsoft Internet Explorer');
      } else {
        render404(st.el.page, url);
        WM.setTitle(id, '无法显示网页 - Microsoft Internet Explorer');
      }
      st.setProg(100);
      st.setStatus('完成');
      updateNavBtns(id);
      later(st, function () { if (st.url === url) st.setProg(0); }, 900);
      maybeAdBar(id, url);
      maybePopup(id, url);
    }, 760);
  }

  function render404(page, url) {
    page.innerHTML =
      '<style>.err-p{min-height:100%;background:#fff;font:12px/1.8 SimSun,宋体;padding:30px 40px;color:#000;}' +
      '.err-p h2{font:bold 20px SimSun;margin:0 0 4px;}.err-ico{float:left;margin-right:14px;}' +
      '.err-p ul{margin:8px 0 18px 22px;padding:0;}.err-p li{margin:3px 0;}' +
      '.err-p a{color:#00c;}.err-hr{border:none;border-top:1px solid #ccc;margin:16px 0;}' +
      '.err-sec{color:#888;}</style>' +
      '<div class="err-p">' +
      '<div class="err-ico"><svg viewBox="0 0 34 34" width="34" height="34"><circle cx="17" cy="17" r="16" fill="#ffdf6a" stroke="#c8a000"/><path d="M17 8 L17 19" stroke="#603000" stroke-width="3"/><circle cx="17" cy="25" r="2" fill="#603000"/></svg></div>' +
      '<h2>无法显示网页</h2>' +
      '<div>您正在查找的页当前不可用。网站可能遇到技术问题，或者您需要调整浏览器设置。</div>' +
      '<hr class="err-hr">' +
      '<div><b>请尝试以下操作:</b></div>' +
      '<ul>' +
      '<li>单击<a>刷新</a>按钮，或稍后重试。</li>' +
      '<li>如果您已经在地址栏中键入页面地址 <b>http://' + String(url).replace(/</g, '&lt;') + '</b>，请确认其拼写正确。</li>' +
      '<li>要检查您的网络连接，请单击<b>工具</b>菜单，然后单击<b>Internet 选项</b>。</li>' +
      '<li>要查看最近访问过的网页列表，请单击<b>查看</b>菜单，然后单击<b>历史记录</b>。</li>' +
      '</ul>' +
      '<hr class="err-hr">' +
      '<div class="err-sec">无法找到服务器或 DNS 错误<br>Internet Explorer</div>' +
      '</div>';
  }

  /* ============================================================
     浮动广告条（第8888位访客 领Q币）—— 每会话最多 2 次
     ============================================================ */
  function maybeAdBar(id, url) {
    if (adSession >= 2) return;
    if (Math.random() > 0.55) return;
    var st = states[id];
    if (!st) return;
    adSession++;
    later(st, function () {
      if (!states[id]) return;
      var old = st.el.root.querySelector('.ie-adbar');
      if (old) old.remove();
      var bar = document.createElement('div');
      bar.className = 'ie-adbar';
      bar.innerHTML = '<span>★</span><span class="blink">恭喜您成为本站第 8888 位访客，' +
        '<a>点击领取 888 个Q币</a>（仅限今日有效）！</span><span class="x">×</span>';
      st.el.root.appendChild(bar);
      bar.querySelector('a').addEventListener('click', function () { bar.remove(); openQcoinScam(); });
      bar.querySelector('.x').addEventListener('click', function () { bar.remove(); });
    }, 3500 + Math.random() * 2500);
  }

  function openQcoinScam() {
    var rec = WM.open({
      id: 'ie-qb-' + Date.now() + '-' + winSeq,
      title: '腾讯QQ十周年回馈活动 - Microsoft Internet Explorer',
      icon: ICONS.ie,
      w: 360, h: 280,
      content:
        '<style>.qb-p{min-height:100%;background:radial-gradient(#fff8d0,#ffe97a);font:12px SimSun;text-align:center;padding:18px 14px;}' +
        '.qb-p h2{color:#c00;font:bold 16px SimSun;margin:0 0 6px;}.qb-p input{width:220px;border:1px solid #a08000;padding:3px;margin:4px 0;font:12px SimSun;}' +
        '.qb-p button{padding:3px 18px;margin-top:8px;font:bold 13px SimSun;background:#ffe25e;border:2px outset #ffd040;cursor:pointer;}' +
        '.qb-r{color:#a04000;font-weight:bold;line-height:2;}</style>' +
        '<div class="qb-p" id="qb-body">' +
        '<h2>★ 腾讯QQ十周年庆典 ★</h2>' +
        '<div>恭喜您！您是今日第 <b style="color:#c00;">8888</b> 位幸运访客，<br>系统赠送您 <b style="color:#c00;font-size:16px;">888 个Q币</b>！</div>' +
        '<input type="text" placeholder="请输入您的QQ号码"><br>' +
        '<input type="password" placeholder="请输入您的QQ密码"><br>' +
        '<button type="button" id="qb-go">立 即 领 取</button>' +
        '<div style="color:#865c10;margin-top:8px;font-size:11px;">本次活动最终解释权归腾讯公司所有（大概）</div>' +
        '</div>'
    });
    var btn = rec.body.querySelector('#qb-go');
    if (btn) btn.addEventListener('click', function () {
      rec.body.querySelector('#qb-body').innerHTML =
        '<div class="qb-r">系统提示：Q币已被前面的 8887 位网友抢光！<br><br>' +
        '建议您明日凌晨 0:00 整点再来，先到先得。<br><br>' +
        '—— 本活动与腾讯公司没有任何关系（真的）</div>';
    });
  }

  /* ============================================================
     弹出窗口（IE6 时代，直接弹，没有拦截提示）
     ============================================================ */
  var POPUPS = [
    { t: '魔兽新服今日开放', h: '新开变态服今日12点开放，上线送满级送神器，散人玩家的天堂，点击进入>>' },
    { t: '同城交友', h: '同城单身用户在线聊天，已有 8 位异性正在您附近上线，点击查看>>' },
    { t: '您有一封站内信', h: '您的好友给您发来一封站内信：「还记得我吗？」点击查收>>' },
    { t: '中奖通知', h: '恭喜您的电脑IP被抽中为幸运观众！点击填写领奖地址，奖品为笔记本电脑一台>>' },
  ];
  function maybePopup(id, url) {
    if (Math.random() > 0.3) return;
    var st = states[id];
    if (!st) return;
    later(st, function () {
      if (!states[id]) return;
      var p = POPUPS[Math.floor(Math.random() * POPUPS.length)];
      WM.open({
        id: 'ie-pop-' + Date.now() + '-' + winSeq,
        title: p.t + ' - Microsoft Internet Explorer',
        icon: ICONS.ie,
        w: 330, h: 190,
        x: 60 + Math.floor(Math.random() * 260),
        y: 80 + Math.floor(Math.random() * 180),
        content:
          '<style>.pop-p{min-height:100%;background:#fff;font:12px/2 SimSun;padding:16px 18px;}' +
          '.pop-p b{color:#c00;}.pop-p .go{color:#00c;text-decoration:underline;cursor:pointer;}</style>' +
          '<div class="pop-p">' + p.h.replace(/点击/g, '<span class="go">点击</span>') + '<br><br>' +
          '<span style="color:#999;font-size:11px;">此窗口由 ' + url.split('/')[0].split('?')[0] + ' 弹出</span></div>'
      });
    }, 1800 + Math.random() * 3200);
  }

  /* ---------- 注册应用 ---------- */
  window.APPS = window.APPS || {};
  APPS.browser = {
    title: 'Internet Explorer',
    icon: ICONS.ie,
    desktop: true,
    order: 1,
    launch: launch
  };
})();
