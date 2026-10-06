/* ============================================================
   apps/music.js —— 千千静听 5.0（TTPlayer）窗口复原
   橙色系 · 歌词秀 · 假播放（进度条 + 歌词滚动）
   数据：window.MUSICDATA（data/music.js）
   ============================================================ */
(function () {
  if (!window.MUSICDATA) return;

  /* ---- 样式（仅注入一次） ---- */
  function injectCss() {
    if (document.getElementById('ttplayer-css')) return;
    const st = document.createElement('style');
    st.id = 'ttplayer-css';
    st.textContent = `
      .tt-win { display:flex; flex-direction:column; height:100%; overflow:hidden;
        background:linear-gradient(180deg,#ffddad 0%,#ffc98a 45%,#f4a24c 100%); font-size:12px; color:#5c3a12; }
      .tt-menu { display:flex; gap:2px; padding:2px 6px; flex:none;
        background:linear-gradient(180deg,#ffe9c8,#ffd08a); border-bottom:1px solid #d98d3a; }
      .tt-menu span { padding:2px 8px; cursor:default; }
      .tt-menu span:hover { background:#e07b1f; color:#fff; }
      .tt-display { flex:none; padding:5px 12px 6px; background:linear-gradient(180deg,#8a4a10,#6b3009);
        border-top:1px solid #4d2005; border-bottom:2px solid #4d2005; color:#ffd9a0; }
      .tt-marquee { overflow:hidden; white-space:nowrap; height:18px; font-weight:bold; color:#ffe9c8;
        text-shadow:0 1px 1px #3a1a02; }
      .tt-marquee div { display:inline-block; padding-left:100%; animation:ttscroll 14s linear infinite; }
      @keyframes ttscroll { 0%{transform:translateX(0)} 100%{transform:translateX(-100%)} }
      .tt-timeline { display:flex; align-items:center; gap:8px; margin-top:4px; }
      .tt-time { font-family:Tahoma; font-size:11px; color:#ffd9a0; min-width:38px; text-align:center; }
      .tt-seek { flex:1; height:9px; background:#4d2005; border:1px solid #2e1200; border-radius:3px;
        position:relative; cursor:pointer; overflow:hidden; }
      .tt-seek .fill { position:absolute; left:0; top:0; bottom:0; width:0%;
        background:linear-gradient(180deg,#ffdf8e,#e8871a 60%,#c96a08); }
      .tt-seek .knob { position:absolute; top:-2px; width:7px; height:11px; background:#ffe9c8;
        border:1px solid #7a3d05; border-radius:2px; margin-left:-4px; }
      .tt-ctrl { display:flex; align-items:center; justify-content:center; gap:10px; padding:5px 0; flex:none; }
      .tt-btn { width:30px; height:24px; border:1px solid #a05a14; border-radius:3px;
        background:linear-gradient(180deg,#ffe9c8,#f2ab55); display:flex; align-items:center; justify-content:center; }
      .tt-btn svg { width:14px; height:14px; }
      .tt-btn.play { width:44px; height:30px; }
      .tt-btn:hover { filter:brightness(1.1); }
      .tt-btn:active { filter:brightness(.88); }
      .tt-main { flex:1; display:flex; min-height:0; border-top:1px solid #c97f33; border-bottom:1px solid #b06a22; }
      .tt-list { width:44%; background:#fff8ec; overflow-y:auto; }
      .tt-list-head { position:sticky; top:0; background:linear-gradient(180deg,#ffdda6,#f5b768);
        padding:3px 8px; font-weight:bold; border-bottom:1px solid #d98d3a; }
      .tt-row { display:flex; gap:6px; padding:3px 8px; cursor:default; border-bottom:1px dotted #ead6b8; }
      .tt-row:hover { background:#ffe3b3; }
      .tt-row.cur { background:#f3971f; color:#fff; }
      .tt-row .no { width:18px; text-align:right; color:#b08550; flex:none; font-family:Tahoma; }
      .tt-row.cur .no { color:#ffe9c8; }
      .tt-row .nm { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .tt-row .dr { flex:none; font-family:Tahoma; color:#b08550; }
      .tt-row.cur .dr { color:#ffe9c8; }
      .tt-lyric { flex:1; background:linear-gradient(180deg,#ffbf72 0%,#f0952f 100%); overflow:hidden;
        position:relative; }
      .tt-lyric-inner { position:absolute; left:0; right:0; top:0; text-align:center; }
      .tt-l { padding:7px 14px; color:#7c4a12; line-height:1.5; transition:transform .3s; }
      .tt-l.on { color:#fff; font-weight:bold; text-shadow:0 1px 2px #8a4a10; transform:scale(1.06); }
      .tt-l.on::before { content:'♪ '; } .tt-l.on::after { content:' ♪'; }
      .tt-status { flex:none; display:flex; gap:8px; align-items:center; padding:3px 8px;
        background:linear-gradient(180deg,#ffe9c8,#f7bc70); border-top:1px solid #d98d3a;
        font-family:Tahoma; font-size:11px; color:#8a5618; }
      .tt-status .dot { width:8px; height:8px; border-radius:50%; background:#9a9a9a; }
      .tt-status .dot.on { background:#27c227; box-shadow:0 0 4px #27c227; }
      .tt-info-tb td { padding:2px 10px 2px 0; }
      .tt-info-tb td:first-child { color:#888; white-space:nowrap; }`;
    document.head.appendChild(st);
  }

  const SVG_PLAY = '<svg viewBox="0 0 14 14"><path d="M3 1.5 L12 7 L3 12.5 Z" fill="#5c3a12"/></svg>';
  const SVG_PAUSE = '<svg viewBox="0 0 14 14"><rect x="2.5" y="1.5" width="3.4" height="11" fill="#5c3a12"/><rect x="8.2" y="1.5" width="3.4" height="11" fill="#5c3a12"/></svg>';
  const SVG_PREV = '<svg viewBox="0 0 14 14"><rect x="1.5" y="1.5" width="2.6" height="11" fill="#5c3a12"/><path d="M11.5 1.5 L4.5 7 L11.5 12.5 Z" fill="#5c3a12"/></svg>';
  const SVG_NEXT = '<svg viewBox="0 0 14 14"><rect x="10" y="1.5" width="2.6" height="11" fill="#5c3a12"/><path d="M2.5 1.5 L9.5 7 L2.5 12.5 Z" fill="#5c3a12"/></svg>';

  function fmt(s) { s = Math.max(0, Math.floor(s)); const m = Math.floor(s / 60), r = s % 60; return Math.floor(m / 10) + '' + (m % 10) + ':' + Math.floor(r / 10) + '' + (r % 10); }
  function fmtMB(kb) { return (kb / 1024).toFixed(2) + 'MB'; }

  let uid = 0;

  APPS.music = {
    title: '千千静听',
    icon: ICONS.ttplayer,
    desktop: true,
    order: 6,
    hint: '千千静听 5.0 —— 听歌 · 看歌词秀',
    launch: function () {
      injectCss();
      if (WM.wins['ttplayer']) { WM.focus('ttplayer'); return; }   /* 已打开：只聚焦，避免重复绑定 */
      const D = window.MUSICDATA;
      const st = {
        tracks: D.tracks.slice(),
        idx: 0, playing: false, t: 0, timer: null
      };

      const rec = WM.open({
        id: 'ttplayer', title: '千千静听 5.0 - ' + D.listName, icon: ICONS.ttplayer,
        w: 480, h: 340, x: 150, y: 60,
        content: `
          <div class="tt-win">
            <div class="tt-menu">
              <span>文件(F)</span><span>编辑(E)</span><span>播放(P)</span><span>歌词(L)</span><span>查看(V)</span><span>帮助(H)</span>
            </div>
            <div class="tt-display">
              <div class="tt-marquee"><div id="tt-marq"></div></div>
              <div class="tt-timeline">
                <div class="tt-time" id="tt-cur">00:00</div>
                <div class="tt-seek" id="tt-seek"><div class="fill" id="tt-fill"></div><div class="knob" id="tt-knob"></div></div>
                <div class="tt-time" id="tt-dur">00:00</div>
              </div>
            </div>
            <div class="tt-ctrl">
              <div class="tt-btn" id="tt-prev" title="上一首">${SVG_PREV}</div>
              <div class="tt-btn play" id="tt-play" title="播放/暂停">${SVG_PLAY}</div>
              <div class="tt-btn" id="tt-next" title="下一首">${SVG_NEXT}</div>
            </div>
            <div class="tt-main">
              <div class="tt-list xp-scroll" id="tt-list"></div>
              <div class="tt-lyric" id="tt-lyric"><div class="tt-lyric-inner" id="tt-lyric-in"></div></div>
            </div>
            <div class="tt-status">
              <div class="dot" id="tt-dot"></div>
              <span id="tt-state">停止</span> |
              <span>128kbps</span> |
              <span>44.1kHz 立体声</span> |
              <span style="margin-left:auto;">皮肤: ${D.skin}</span>
            </div>
          </div>`,
        onClose: function () { stopTimer(); }
      });

      const q = function (sel) { return rec.body.querySelector(sel); };
      const marq = q('#tt-marq'), cur = q('#tt-cur'), dur = q('#tt-dur'),
        seek = q('#tt-seek'), fill = q('#tt-fill'), knob = q('#tt-knob'),
        listEl = q('#tt-list'), lyricIn = q('#tt-lyric-in'),
        playBtn = q('#tt-play'), stateEl = q('#tt-state'), dot = q('#tt-dot');

      /* ---- 播放列表 ---- */
      function renderList() {
        let html = `<div class="tt-list-head">播放列表: ${D.listName} [${st.tracks.length}首]</div>`;
        st.tracks.forEach(function (tk, i) {
          html += `<div class="tt-row${i === st.idx ? ' cur' : ''}" data-i="${i}">
            <span class="no">${i + 1}.</span><span class="nm">${tk.artist} - ${tk.title}</span><span class="dr">${fmt(tk.dur)}</span></div>`;
        });
        listEl.innerHTML = html;
        Array.prototype.forEach.call(listEl.querySelectorAll('.tt-row'), function (r) {
          r.addEventListener('click', function () { select(+r.dataset.i, true); });
          r.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            const i = +r.dataset.i, tk = st.tracks[i];
            showCtxMenu(e.clientX, e.clientY, [
              { text: '播放', action: function () { select(i, true); } },
              { text: '查看歌曲信息', action: function () { showInfo(tk); } },
              { text: '发送到 可移动磁盘(H:)', action: function () { WM.balloon({ title: '千千静听', text: '正在复制「' + tk.file + '」到 魅族 M6 (1GB)... 已完成。记得把同名 .lrc 一起拷走。', icon: ICONS.ttplayer, timeout: 7000 }); } },
              '-',
              { text: '从列表中删除', action: function () { removeTrack(i); } }
            ]);
          });
        });
      }

      function removeTrack(i) {
        const wasCur = (i === st.idx);
        st.tracks.splice(i, 1);
        if (!st.tracks.length) { WM.close('ttplayer'); return; }
        if (wasCur) { st.idx = Math.min(i, st.tracks.length - 1); select(st.idx, st.playing); renderList(); }
        else { if (i < st.idx) st.idx--; renderList(); }
      }

      /* ---- 歌曲信息（含 ID3 乱码彩蛋） ---- */
      function showInfo(tk) {
        const id3 = tk.id3;
        const rows = id3
          ? [['标题 (ID3v1)', id3.title], ['艺术家 (ID3v1)', id3.artist], ['专辑 (ID3v1)', id3.album],
             ['备注', id3.note],
             ['提示', '港台/网络来源的 MP3 内嵌 GBK/BIG5 标签在简体系统显示为乱码，可用 千千静听 → 右键 → 批量修改标签 转换编码']]
          : [['标题', tk.title], ['艺术家', tk.artist], ['专辑', tk.album], ['年份', tk.year + '']];
        const w = WM.open({
          id: 'tt-info-' + (uid++), title: '歌曲信息', icon: ICONS.ttplayer, w: 340, h: 320, x: 260, y: 130,
          content: `
            <div style="padding:10px 14px;display:flex;flex-direction:column;height:100%;">
              <fieldset style="border:1px solid #c9a15e;padding:8px;background:#fff8ec;">
                <legend style="color:#a0611b;font-weight:bold;">${tk.artist} - ${tk.title}</legend>
                <table class="tt-info-tb">${rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td></tr>'; }).join('')}
                <tr><td>时长</td><td>${fmt(tk.dur)}</td></tr></table>
              </fieldset>
              <fieldset style="border:1px solid #c9a15e;padding:8px;margin-top:8px;background:#fff8ec;">
                <legend style="color:#a0611b;font-weight:bold;">文件</legend>
                <table class="tt-info-tb">
                  <tr><td>文件名</td><td>${tk.file}</td></tr>
                  <tr><td>路径</td><td>${D.folder}</td></tr>
                  <tr><td>大小</td><td>${fmtMB(tk.sizeKB)}（128kbps）</td></tr>
                  <tr><td>格式</td><td>MPEG Layer-3 · 128kbps · 44.1kHz</td></tr>
                </table>
              </fieldset>
              <div style="margin-top:auto;text-align:right;"><button class="xp-btn" onclick="WM.close(this.closest('.xp-win').dataset.winId)">关闭</button></div>
            </div>`
        });
        WM.center(w);
      }

      /* ---- 歌词秀 ---- */
      function renderLyricStatic() {
        lyricIn.innerHTML = st.tracks[st.idx].lrc.map(function (l, i) {
          return `<div class="tt-l" data-i="${i}">${l[1]}</div>`;
        }).join('');
        syncLyric();
      }
      function syncLyric() {
        const tk = st.tracks[st.idx];
        let onI = 0;
        tk.lrc.forEach(function (l, i) { if (tk.lrc[i][0] <= st.t) onI = i; });
        const lines = lyricIn.children;
        for (let i = 0; i < lines.length; i++) lines[i].classList.toggle('on', i === onI);
        const box = q('#tt-lyric');
        const target = lines[onI] ? lines[onI].offsetTop - box.clientHeight / 2 + lines[onI].offsetHeight / 2 : 0;
        lyricIn.style.transform = 'translateY(' + (-Math.max(0, target)) + 'px)';
      }

      /* ---- 计时 ---- */
      function tick() {
        st.t++;
        if (st.t >= st.tracks[st.idx].dur) { select((st.idx + 1) % st.tracks.length, true); return; }
        updateUI();
      }
      function startTimer() { stopTimer(); st.timer = setInterval(tick, 1000); }
      function stopTimer() { if (st.timer) { clearInterval(st.timer); st.timer = null; } }

      function updateUI() {
        const tk = st.tracks[st.idx];
        cur.textContent = fmt(st.t); dur.textContent = fmt(tk.dur);
        const p = (st.t / tk.dur) * 100;
        fill.style.width = p + '%'; knob.style.left = p + '%';
        if (st.playing) syncLyric();
      }

      function setPlayFlag(on) {
        st.playing = on;
        playBtn.innerHTML = on ? SVG_PAUSE : SVG_PLAY;
        stateEl.textContent = on ? '播放中' : '已暂停';
        dot.classList.toggle('on', on);
        if (on) startTimer(); else stopTimer();
        updateUI();
      }

      function select(i, autoplay) {
        st.idx = i; st.t = 0;
        const tk = st.tracks[i];
        marq.textContent = '';
        marq.innerHTML = (tk.artist + ' - ' + tk.title + ' 《' + tk.album + '》 ' + tk.year + '　·　千千静听 5.0　·　128kbps　').repeat(2);
        renderList(); renderLyricStatic();
        if (autoplay !== undefined) setPlayFlag(!!autoplay); else updateUI();
        if (!autoplay) updateUI();
      }

      /* ---- 事件 ---- */
      playBtn.addEventListener('click', function () { setPlayFlag(!st.playing); });
      q('#tt-prev').addEventListener('click', function () { select((st.idx - 1 + st.tracks.length) % st.tracks.length, st.playing); });
      q('#tt-next').addEventListener('click', function () { select((st.idx + 1) % st.tracks.length, st.playing); });
      seek.addEventListener('click', function (e) {
        const r = seek.getBoundingClientRect();
        st.t = Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * st.tracks[st.idx].dur);
        updateUI();
      });

      /* 开机即默认显示第一首（暂停状态），等访客点播放 */
      select(0, false);
    }
  };
})();
