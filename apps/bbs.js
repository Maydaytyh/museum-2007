/* ============================================================
   apps/bbs.js —— 校园BBS（水杉清源 · 北岭大学）
   2007 水木/北邮人风格 web 版：表格版面 + 今日十大 + 纯文本楼层
   ============================================================ */

(function () {
  window.APPS = window.APPS || {};

  /* ---------------- 图标（自绘：CRT + 绿字） ---------------- */
  const BBSICON = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="32" height="25" rx="3" fill="#d9d4c5" stroke="#7a7568" stroke-width="1.5"/>
    <rect x="7" y="9" width="26" height="19" rx="1.5" fill="#083108"/>
    <rect x="7" y="9" width="26" height="19" rx="1.5" fill="none" stroke="#3d5c3d" stroke-width="0.8"/>
    <text x="20" y="21.5" font-family="Courier New,monospace" font-weight="bold" font-size="9" fill="#7dff7d" text-anchor="middle">BBS</text>
    <rect x="7" y="25.2" width="26" height="0.7" fill="#7dff7d" opacity="0.25"/>
    <rect x="14" y="31" width="12" height="2.6" fill="#b8b2a0" stroke="#7a7568" stroke-width="0.8"/>
    <rect x="10" y="33.5" width="20" height="3" rx="1.4" fill="#cfc9b8" stroke="#7a7568" stroke-width="0.8"/>
  </svg>`;

  /* ---------------- 注入样式（老式 web BBS 观感） ---------------- */
  function injectStyle() {
    if (document.getElementById('bbs-style')) return;
    const st = document.createElement('style');
    st.id = 'bbs-style';
    st.textContent = `
      .bbs-root { height:100%; display:flex; flex-direction:column; background:#fff; font-size:12px; line-height:1.6; color:#000; }
      .bbs-root a { color:#0000cc; text-decoration:none; }
      .bbs-root a:hover { color:#cc0000; text-decoration:underline; }
      .bbs-head { background:#e8f0fe; border-bottom:1px solid #7f9db9; padding:6px 10px; }
      .bbs-head .site { font-family:"SimSun","宋体",serif; font-size:16px; font-weight:bold; color:#000066; letter-spacing:2px; }
      .bbs-head .sub { color:#006600; }
      .bbs-head .login { color:#666; margin-top:2px; }
      .bbs-nav { padding:4px 10px; background:#f5f5f5; border-bottom:1px solid #c0c0c0; color:#666; }
      .bbs-body { flex:1; overflow:auto; padding:8px 10px; }
      .bbs-root table.tbl { width:100%; border-collapse:collapse; margin:6px 0 14px; background:#fff; }
      .bbs-root table.tbl th { background:linear-gradient(180deg,#4a84e0,#2b62c8); color:#fff; font-weight:normal; padding:3px 6px; border:1px solid #9db9e8; }
      .bbs-root table.tbl td { border:1px solid #c8d8f0; padding:3px 6px; }
      .bbs-root table.tbl tr.zrow td { background:#dbe6f7; font-weight:bold; color:#002266; letter-spacing:1px; }
      .bbs-root table.tbl tr.trow:hover td { background:#eef5ff; }
      .bbs-root table.tbl tr.hot td { background:#fff7ee; }
      .bbs-zone { background:#dbe6f7; }
      .bbs-postlist td { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:0; }
      .bbs-postlist td.pt { white-space:normal; }
      .bbs-post { font-family:"SimSun","宋体",serif; }
      .bbs-floor { padding:6px 8px; border-bottom:1px dashed #b9c9e0; white-space:pre-wrap; word-break:break-all; }
      .bbs-floor .hdr { color:#00008b; }
      .bbs-floor .sep { color:#999; }
      .bbs-pager { padding:5px 10px; border-top:1px solid #c0c0c0; background:#f5f5f5; display:flex; align-items:center; gap:4px; color:#444; }
      .bbs-pager button.xp-btn { min-width:48px; padding:2px 8px; }
      .bbs-compose { padding:10px 12px; display:flex; flex-direction:column; gap:6px; height:100%; background:#fff; }
      .bbs-compose .row1 { display:flex; gap:8px; align-items:center; }
      .bbs-compose textarea { flex:1; resize:none; border:1px solid #7f9db9; font-family:"SimSun","宋体",serif; font-size:12px; padding:4px; }
      .bbs-compose .btns { display:flex; gap:8px; justify-content:flex-end; }
      .bbs-compose .err { color:#cc0000; min-height:16px; }
    `;
    document.head.appendChild(st);
  }

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function D() { return window.BBSDATA; }
  function board(id) { return D().boards.find(b => b.id === id); }
  function nowStamp() {
    try {
      const n = Tray.fakeNow, p = x => String(x).padStart(2, '0');
      return n.getFullYear() + '-' + p(n.getMonth() + 1) + '-' + p(n.getDate()) + ' ' + p(n.getHours()) + ':' + p(n.getMinutes());
    } catch (e) { return '2007-10-17 21:07'; }
  }

  /* ---------------- 状态 ---------------- */
  const state = { view: 'home', board: null, post: null, page: 1 };
  const PAGE = 20;
  let win = null;
  let inited = false;

  function setView(v, opt) {
    Object.assign(state, opt || {}, { view: v });
    render();
  }

  /* ---------------- 视图：首页 ---------------- */
  function homeHTML() {
    const d = D(), s = d.site;
    let h = '';
    /* 今日十大 */
    h += `<table class="tbl">
      <tr><th style="width:36px">序号</th><th style="width:90px">版面</th><th>文章标题</th><th style="width:100px">作者</th><th style="width:44px">回文</th></tr>`;
    d.top10.forEach(e => {
      h += `<tr class="trow hot"><td style="text-align:center">${e.rank}</td>
        <td style="text-align:center">[${esc(e.boardZh)}]</td>
        <td class="pt"><a href="#" data-board="${e.board}" data-t="${esc(e.title)}">${esc(e.title)}</a></td>
        <td style="text-align:center">${esc(e.author)}</td>
        <td style="text-align:center">${e.replies}</td></tr>`;
    });
    h += '</table>';

    /* 分区版面表 */
    h += `<table class="tbl">
      <tr><th style="width:150px">版面</th><th style="width:110px">版主</th><th style="width:70px">文章数</th><th>说明</th></tr>`;
    d.zones.forEach(z => {
      h += `<tr class="zrow"><td colspan="4">[ ${esc(z)} ]</td></tr>`;
      d.boards.filter(b => b.zone === z).forEach(b => {
        h += `<tr class="trow"><td><a href="#" data-board="${b.id}">${esc(b.en)}</a> ${esc(b.zh)}</td>
          <td style="text-align:center">${esc(b.bm)}</td>
          <td style="text-align:center">${b.total}</td>
          <td class="pt">${esc(b.desc)}　<span style="color:#888">（近期 ${b.posts.length} 篇）</span></td></tr>`;
      });
    });
    h += '</table>';
    h += `<div style="color:#666;padding:2px 2px 8px;">※ 本站保留 telnet 入口：<span style="color:#006600">telnet://${esc(s.telnet)}</span>　推荐使用 CTerm / NetTerm 登录。</div>`;
    return h;
  }

  /* ---------------- 视图：版面（帖子列表） ---------------- */
  function boardHTML() {
    const b = board(state.board), d = D();
    const posts = b.posts.slice().sort((x, y) => (x.d < y.d ? 1 : -1));
    const pages = Math.max(1, Math.ceil(posts.length / PAGE));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * PAGE;
    const slice = posts.slice(start, start + PAGE);
    let h = `<div style="margin:2px 0 6px;color:#002266;font-weight:bold;font-size:13px;">
      [${esc(b.zone)}] <span style="color:#000">${esc(b.en)} ${esc(b.zh)}</span>　
      <span style="color:#666;font-weight:normal">版主：${esc(b.bm)}</span></div>`;
    h += `<table class="tbl bbs-postlist">
      <tr><th style="width:52px">编号</th><th style="width:110px">作者</th><th style="width:118px">日期</th><th>标题</th><th style="width:44px">回文</th></tr>`;
    slice.forEach((p, i) => {
      const no = b.total - start - i;
      const rc = p.r ? p.r.length : 0;
      h += `<tr class="trow">
        <td style="text-align:center">${no}</td>
        <td style="text-align:center">${esc(p.a)}</td>
        <td style="text-align:center">${esc(p.d)}</td>
        <td class="pt"><a href="#" data-post="${esc(p.t)}">${esc(p.t)}</a>${rc ? ` <span style="color:#888">(${rc})</span>` : ''}</td>
        <td style="text-align:center">${rc || ''}</td></tr>`;
    });
    if (!slice.length) h += `<tr><td colspan="5" style="text-align:center;color:#888">本页无文章</td></tr>`;
    h += '</table>';
    h += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
      <button class="xp-btn" data-act="compose">发表文章</button>
      <button class="xp-btn" data-act="home">返回首页</button>
      <span style="color:#888">共 ${posts.length} 篇近期文章（本版历史累计 ${b.total} 篇）</span></div>`;
    h += pagerHTML(pages, posts.length);
    return h;
  }

  function pagerHTML(pages, total) {
    return `<div style="display:flex;align-items:center;gap:5px;color:#444;">
      <button class="xp-btn" data-page="1" ${state.page <= 1 ? 'disabled' : ''}>首页</button>
      <button class="xp-btn" data-page="${state.page - 1}" ${state.page <= 1 ? 'disabled' : ''}>上页</button>
      <button class="xp-btn" data-page="${state.page + 1}" ${state.page >= pages ? 'disabled' : ''}>下页</button>
      <button class="xp-btn" data-page="${pages}" ${state.page >= pages ? 'disabled' : ''}>末页</button>
      <span>　第 ${state.page} / ${pages} 页 · 每页 ${PAGE} 条 · 当前显示 ${total} 篇</span></div>`;
  }

  /* ---------------- 视图：帖子（纯文本楼层） ---------------- */
  function floorHTML(author, date, title, boardZh, body, floorNo) {
    return `<div class="bbs-floor"><div class="hdr">发信人: ${esc(author)} (信区: ${esc(boardZh)})
标　题: ${esc(title)}
发信站: ${esc(D().site.station)} (${esc(date)})</div>
<span class="sep">────────────────────────────────────────</span>
${esc(body)}

<span class="sep">--</span>
<span class="sep">※ 来源:·${esc(D().site.station)} ${esc(D().site.telnet)}·[FROM: ${esc(D().site.fromDomain)}]</span>
${floorNo ? `<div style="text-align:right;color:#999;font-size:11px;">〔 第 ${floorNo} 楼 〕</div>` : ''}</div>`;
  }

  function postHTML() {
    const b = board(state.board);
    const p = b.posts.find(x => x.t === state.post);
    if (!p) return '<div style="padding:20px;color:#888;">文章不存在（可能已被删除）。</div>';
    let h = `<div style="margin:2px 0 6px;color:#002266;font-weight:bold;font-size:13px;">
      [${esc(b.en)} ${esc(b.zh)}] ${esc(p.t)}</div>`;
    h += '<div class="bbs-post">';
    h += floorHTML(p.a, p.d, p.t, b.zh, p.b, 1);
    (p.r || []).forEach((r, i) => {
      h += floorHTML(r.a, r.d, 'Re: ' + p.t, b.zh, r.b, i + 2);
    });
    h += '</div>';
    h += `<div style="display:flex;gap:10px;margin:8px 0 4px;">
      <button class="xp-btn" data-act="reply" data-t="${esc(p.t)}">回文章</button>
      <button class="xp-btn" data-act="board">返回版面</button>
      <button class="xp-btn" data-act="home">返回首页</button></div>`;
    return h;
  }

  /* ---------------- 发表 / 回复 ---------------- */
  function openCompose(mode, postTitle) {
    const b = board(state.board);
    const isReply = mode === 'reply';
    const preTitle = isReply ? 'Re: ' + postTitle : '';
    const c = document.createElement('div');
    c.className = 'bbs-compose';
    c.innerHTML = `
      <div class="row1"><span>信区：</span><b>${esc(b.en)} ${esc(b.zh)}</b>
      <span style="margin-left:16px">作者：</span><b>zhangwei_ee</b><span style="color:#888">(阿伟)</span></div>
      <div class="row1"><span style="flex:none">标题：</span>
        <input class="xp-input" style="flex:1" maxlength="60" value="${esc(preTitle)}" ${isReply ? 'readonly' : ''}></div>
      <div style="display:flex;flex-direction:column;flex:1;min-height:0;">
        <div>正文：（段首请空两格，支持纯文本）</div>
        <textarea></textarea>
        <div class="err"></div>
        <div class="btns">
          <button class="xp-btn primary" data-send="1">发 表</button>
          <button class="xp-btn" data-cancel="1">取 消</button>
        </div>
      </div>`;
    const err = c.querySelector('.err');
    const tInput = c.querySelector('input');
    const ta = c.querySelector('textarea');

    c.querySelector('[data-cancel]').addEventListener('click', () => WM.close('bbs-compose'));
    c.querySelector('[data-send]').addEventListener('click', () => {
      const t = tInput.value.trim(), body = ta.value.trim();
      if (!isReply && !t) { err.textContent = '标题不能为空。'; return; }
      if (!body) { err.textContent = '正文不能为空，本站拒绝无意义灌水（灌水乐园除外，开玩笑的）。'; return; }
      if (isReply) {
        const p = b.posts.find(x => x.t === postTitle);
        p.r = p.r || [];
        p.r.push({ a: 'zhangwei_ee', d: nowStamp(), b: body });
        state.post = p.t;
      } else {
        let t2 = t;
        if (b.posts.some(x => x.t === t2)) t2 = t2 + '（' + nowStamp().slice(5) + '）';
        b.posts.unshift({ a: 'zhangwei_ee', d: nowStamp(), t: t2, b: body, r: [] });
        b.total++;
        state.page = 1;
        state.view = 'board';
      }
      WM.close('bbs-compose');
      render();
    });

    WM.open({
      id: 'bbs-compose', title: isReply ? '回文章 - 水杉清源' : '发表文章 - 水杉清源',
      icon: BBSICON, w: 520, h: 380, content: c, min: false,
    });
    setTimeout(() => (isReply ? ta : tInput).focus(), 60);
  }

  /* ---------------- 渲染 ---------------- */
  function render() {
    if (!win) return;
    const d = D();
    let title = '北岭大学BBS · 水杉清源';
    let body = '';
    if (state.view === 'board') { body = boardHTML(); title = `${board(state.board).zh} - 校园BBS`; }
    else if (state.view === 'post') { body = postHTML(); title = '阅读文章 - 校园BBS'; }
    else body = homeHTML();

    win.body.innerHTML = `
      <div class="bbs-root">
        <div class="bbs-head">
          <span class="site">${esc(d.site.zhName)} · ${esc(d.site.subName)}</span>
          <span class="sub">── telnet://${esc(d.site.telnet)}</span>
          <div class="login">您好，<b>${esc(d.site.user.id)}</b>（${esc(d.site.user.nick)}）· 第 ${d.site.user.loginCount} 次上站 · 您是自 1997 年建站以来的第 41287 位访客</div>
          <div class="login" style="color:#b03000">※ 站内公告：<a href="#" data-board="ann" data-t="[重要] 防骗提醒：QQ盗号借充话费，本周已有同学中招">[重要] 防骗提醒：QQ盗号借充话费，本周已有同学中招</a>　<a href="#" data-board="ann" data-t="[公告] 斑竹招募：诚聘各版版主，欢迎自荐">[公告] 斑竹招募</a></div>
        </div>
        <div class="bbs-nav">
          当前位置：水杉清源首页${state.view === 'board' ? ` » ${esc(board(state.board).zh)}` : ''}${state.view === 'post' ? ` » ${esc(board(state.board).zh)} » 阅读文章` : ''}
          　|　<a href="#" data-act="home">[首页]</a>${state.view !== 'home' ? `　<a href="#" data-act="board">[本版文章]</a>　<a href="#" data-act="compose">[发表文章]</a>` : ''}
        </div>
        <div class="bbs-body xp-scroll">${body}</div>
        <div class="bbs-pager">
          <span>目前在线 <b>${d.site.online}</b> 人 · 今日到访 ${d.site.todayVisitors} 人 · 今日文章 ${d.site.todayPosts} 篇</span>
          <span style="margin-left:auto">最高在线纪录 <b>${d.site.maxOnline}</b> 人（${esc(d.site.maxOnlineDate)}）</span>
        </div>
      </div>`;
    WM.setTitle('bbs', title);
    win.body.scrollTop = 0;
  }

  /* ---------------- 事件 ---------------- */
  function bindEvents() {
    if (inited || !win) return;
    win.body.addEventListener('click', (e) => {
      const a = e.target.closest('a,[data-act],[data-page]');
      if (!a) return;
      e.preventDefault();

      if (a.dataset.board && a.dataset.t) {
        /* 首页十大 / 公告直达 */
        const b = board(a.dataset.board);
        if (b && b.posts.some(p => p.t === a.dataset.t)) {
          setView('post', { board: b.id, post: a.dataset.t });
        } else { setView('board', { board: b.id, page: 1, post: null }); }
        return;
      }
      if (a.dataset.board) { setView('board', { board: a.dataset.board, page: 1, post: null }); return; }
      if (a.dataset.post) { setView('post', { post: a.dataset.post }); return; }
      if (a.dataset.page) {
        const p = parseInt(a.dataset.page, 10);
        if (p >= 1) { state.page = p; render(); }
        return;
      }
      const act = a.dataset.act;
      if (act === 'home') { setView('home', { board: null, post: null, page: 1 }); }
      else if (act === 'board') { setView('board', { post: null, page: state.page }); }
      else if (act === 'compose') {
        if (state.board) openCompose('new');
      }
      else if (act === 'reply') { openCompose('reply', a.dataset.t); }
    });
    inited = true;
  }

  /* ---------------- 注册 ---------------- */
  APPS.bbs = {
    title: '校园BBS',
    icon: BBSICON,
    desktop: true,
    order: 6,
    hint: '水杉清源BBS - 北岭大学（telnet://bbs.beiling.edu.cn）',
    launch() {
      injectStyle();
      win = WM.open({
        id: 'bbs',
        title: '北岭大学BBS · 水杉清源',
        icon: BBSICON,
        w: 880, h: 600,
        min: true, max: true,
        content: '',
      });
      bindEvents();
      render();
      return win;
    },
  };
})();
