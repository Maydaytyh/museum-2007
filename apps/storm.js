/* ============================================================
   apps/storm.js —— 暴风影音 2.0 窗口复原
   深色播放器 · RMVB 480×272 低清质感 · 缺解码器彩蛋 · 字幕切换
   联动：读取 window.__DLSTATE.pbPct（迅雷 S03E04 下载进度）
   ============================================================ */
(function () {

  function injectCss() {
    if (document.getElementById('storm-css')) return;
    const st = document.createElement('style');
    st.id = 'storm-css';
    st.textContent = `
      .st-win { display:flex; flex-direction:column; height:100%; overflow:hidden; background:#232327; font-size:12px; color:#d8d8dc; }
      .st-menu { display:flex; gap:2px; padding:2px 6px; flex:none; background:#191a1d; border-bottom:1px solid #000; color:#cfcfd4; }
      .st-menu span { padding:2px 8px; } .st-menu span:hover { background:#0b4f9e; color:#fff; }
      .st-toolbar { display:flex; align-items:center; gap:6px; padding:4px 10px; flex:none;
        background:linear-gradient(180deg,#3a3b40 0%,#2b2c30 50%,#1d1e21 100%); border-bottom:1px solid #0a0a0c; }
      .st-tool { width:30px; height:26px; border:1px solid #4a4b52; border-radius:3px;
        background:linear-gradient(180deg,#4a4b52,#2b2c30); display:flex; align-items:center; justify-content:center; }
      .st-tool:hover { border-color:#63c7ff; filter:brightness(1.15); }
      .st-tool svg { width:14px; height:14px; }
      .st-vol { margin-left:auto; display:flex; align-items:center; gap:6px; }
      .st-vol .bar { width:64px; height:6px; background:#101114; border:1px solid #4a4b52; position:relative; }
      .st-vol .bar i { position:absolute; left:0; top:0; bottom:0; width:72%; background:linear-gradient(90deg,#63c7ff,#1f7fd0); }
      .st-main { flex:1; display:flex; min-height:0; }
      .st-list { width:210px; flex:none; background:#1c1d20; border-right:1px solid #0a0a0c; overflow-y:auto; }
      .st-list-head { padding:5px 10px; color:#63c7ff; font-weight:bold; background:#141518; border-bottom:1px solid #0a0a0c; }
      .st-ep { padding:6px 10px; border-bottom:1px solid #141518; cursor:default; }
      .st-ep:hover { background:#24262b; }
      .st-ep .nm { color:#e6e6ea; }
      .st-ep .sub { color:#7a7c85; font-size:11px; margin-top:2px; font-family:Tahoma; }
      .st-ep.cur { background:#0b4f9e; }
      .st-ep.cur .nm, .st-ep.cur .sub { color:#fff; }
      .st-ep.off { opacity:.45; }
      .st-ep.off .nm { color:#9a9ca4; }
      .st-video { flex:1; position:relative; background:#000; overflow:hidden; }
      /* ---- 假画面：低清 RMVB 质感 ---- */
      .st-scene { position:absolute; inset:0; display:none; }
      .st-scene.on { display:block; }
      .st-sky { position:absolute; inset:0;
        background:radial-gradient(ellipse 140% 60% at 50% 20%, #43536b 0%, #20293c 45%, #0b0e16 100%); }
      .st-fig { position:absolute; bottom:18%; font-size:34px; filter:saturate(.4) brightness(.8); }
      .st-bars { position:absolute; inset:0; opacity:.5;
        background:repeating-linear-gradient(90deg, transparent 0 60px, #10131c 60px 63px); }
      .st-noise { position:absolute; inset:-50%; opacity:.16; pointer-events:none;
        background-image:repeating-conic-gradient(#fff 0% .0001%, transparent .0002% .0003%);
        animation:stnoise .35s steps(3) infinite; }
      @keyframes stnoise { 0%{transform:translate(0,0)} 33%{transform:translate(-3%,2%)} 66%{transform:translate(2%,-3%)} 100%{transform:translate(0,0)} }
      .st-scan { position:absolute; inset:0; pointer-events:none;
        background:repeating-linear-gradient(180deg, rgba(0,0,0,.25) 0 1px, transparent 1px 3px); }
      .st-badge { position:absolute; top:6px; right:8px; font-family:Tahoma; font-size:10px; color:#ffd35e;
        background:rgba(0,0,0,.55); border:1px solid #665c2e; padding:1px 6px; z-index:3; }
      .st-playing { position:absolute; top:6px; left:8px; font-size:11px; color:#bfe3ff; z-index:3;
        background:rgba(0,0,0,.55); padding:1px 6px; }
      .st-sub { position:absolute; left:0; right:0; bottom:34px; text-align:center; color:#ffe9a0;
        font-size:14px; text-shadow:1px 1px 1px #000, 0 0 4px #000; z-index:3; padding:0 20px; }
      .st-idle { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center;
        justify-content:center; gap:12px; color:#4a4b55; }
      .st-idle .logo { font-size:26px; font-weight:bold; color:#2e6fb4; font-family:Tahoma; text-shadow:0 1px 2px #000; }
      .st-ctrl { flex:none; display:flex; align-items:center; gap:10px; padding:6px 12px;
        background:linear-gradient(180deg,#32333a 0%,#232428 100%); border-top:1px solid #0a0a0c; }
      .st-ctrl .time { font-family:Tahoma; font-size:11px; color:#bfbfc6; min-width:86px; text-align:center; }
      .st-track { flex:1; height:8px; background:#101114; border:1px solid #4a4b52; position:relative; cursor:pointer; }
      .st-track i { position:absolute; left:0; top:0; bottom:0; width:0%; background:linear-gradient(90deg,#2e6fb4,#63c7ff); }
      .st-track b { position:absolute; top:-3px; width:6px; height:12px; margin-left:-3px; background:#dfe9f5; }
      .st-status { flex:none; display:flex; gap:10px; padding:3px 10px; background:#191a1d; color:#8a8c94;
        font-family:Tahoma; font-size:11px; border-top:1px solid #0a0a0c; }`;
    document.head.appendChild(st);
  }

  const SVG_PLAY = '<svg viewBox="0 0 14 14"><path d="M3 1.5 L12 7 L3 12.5 Z" fill="#dfe9f5"/></svg>';
  const SVG_PAUSE = '<svg viewBox="0 0 14 14"><rect x="2.5" y="1.5" width="3.4" height="11" fill="#dfe9f5"/><rect x="8.2" y="1.5" width="3.4" height="11" fill="#dfe9f5"/></svg>';
  const SVG_STOP = '<svg viewBox="0 0 14 14"><rect x="2.5" y="2.5" width="9" height="9" fill="#dfe9f5"/></svg>';
  const SVG_OPEN = '<svg viewBox="0 0 14 14"><path d="M1 4 L6 4 L8 6 L13 6 L13 12 L1 12 Z" fill="#f0c36a" stroke="#a3801f"/></svg>';

  const EP_TOTAL = 42 * 60;   /* 单集 42 分钟 */

  /* 假字幕（YYeTs / 伊甸园 风格通用台词，非剧集原句） */
  const SUBS = [
    ['我们只有不到两天的时间', '跟我来，别回头看'],
    ['（低沉的背景音乐）', '你在骗我，对吧？'],
    ['计划就在今晚行动', '所有人都必须就位'],
    ['如果失败，我们谁都出不去', '（脚步声渐近）']
  ];

  APPS.storm = {
    title: '暴风影音',
    icon: ICONS.storm,
    desktop: true,
    order: 8,
    hint: '暴风影音 2 —— 什么格式都能播',
    launch: function () {
      injectCss();
      if (WM.wins['storm']) { WM.focus('storm'); return; }   /* 已打开：只聚焦，避免重复绑定 */

      const EPS = [
        { ep: '第01集', name: '越狱.Prison.Break.S03E01.中字[伊甸园].rmvb', watched: true },
        { ep: '第02集', name: '越狱.Prison.Break.S03E02.中字[伊甸园].rmvb', watched: true },
        { ep: '第03集', name: '越狱.Prison.Break.S03E03.中字[伊甸园].rmvb', watched: true },
        { ep: '第04集', name: '越狱.Prison.Break.S03E04.CHS.RMVB.rmvb', watched: false }
      ];

      const st = {
        ep: 0, playing: false, t: 0, timer: null,
        sub: 1,               /* 0 无字幕 1 YYeTs 2 伊甸园 */
        codecOK: false, asked: false, shake: 0
      };

      const rec = WM.open({
        id: 'storm', title: '暴风影音 2.0 - 越狱.Prison.Break.S03', icon: ICONS.storm,
        w: 640, h: 500, x: 130, y: 60,
        content: `
          <div class="st-win">
            <div class="st-menu"><span>文件(F)</span><span>查看(V)</span><span>播放(P)</span><span>导航(N)</span><span>帮助(H)</span></div>
            <div class="st-toolbar">
              <div class="st-tool" id="st-open" title="打开文件">${SVG_OPEN}</div>
              <div class="st-tool" id="st-play" title="播放/暂停">${SVG_PLAY}</div>
              <div class="st-tool" id="st-stop" title="停止">${SVG_STOP}</div>
              <div class="st-vol" title="音量">${ICONS.volume}
                <div class="bar"><i></i></div>
              </div>
            </div>
            <div class="st-main">
              <div class="st-list xp-scroll" id="st-list">
                <div class="st-list-head">播放列表 · 越狱 S3</div>
                <div id="st-eps"></div>
<div style="padding:8px 10px;color:#5a5c64;font-size:11px;line-height:1.7;">
片源：伊甸园字幕组 S-files
</div>
              </div>
              <div class="st-video" id="st-video">
                <div class="st-idle" id="st-idle">
                  <div class="logo">暴风影音</div>
                  <div>双击左侧列表开始播放</div>
                  <div style="font-size:11px;color:#38393f;">MEE 媒体专家引擎 · 支持格式 189 种</div>
                </div>
                <div class="st-scene" id="st-scene">
                  <div class="st-sky"></div>
                  <div class="st-bars"></div>
                  <div class="st-fig" style="left:22%;">○</div>
                  <div class="st-fig" style="left:47%;font-size:40px;bottom:16%;">○</div>
                  <div class="st-fig" style="left:70%;">○</div>
                  <div class="st-noise"></div>
                  <div class="st-scan"></div>
                  <div class="st-playing" id="st-nowplaying"></div>
                  <div class="st-badge">RMVB 480×272 · 436kbps</div>
                  <div class="st-sub" id="st-subline"></div>
                </div>
              </div>
            </div>
            <div class="st-ctrl">
              <div class="st-tool" id="st-play2" style="width:36px;height:28px;" title="播放/暂停">${SVG_PLAY}</div>
              <div class="time" id="st-time">00:00:00 / 00:42:00</div>
              <div class="st-track" id="st-track"><i id="st-fill"></i><b id="st-knob"></b></div>
              <div class="st-tool" id="st-full" title="全屏" style="width:26px;height:22px;font-size:10px;color:#dfe9f5;">口</div>
            </div>
            <div class="st-status">
              <span id="st-stat">就绪</span>
              <span>当前滤镜: RealVideo 解码器</span>
              <span>声音: 正常</span>
              <span style="margin-left:auto;">暴风影音 2.0.2007.0412</span>
            </div>
          </div>`,
        onClose: function () { if (st.timer) { clearInterval(st.timer); st.timer = null; } }
      });

      const q = function (sel) { return rec.body.querySelector(sel); };

      /* ---- 播放列表（E04 进度与迅雷联动） ---- */
      function renderEps() {
        const pbPct = (window.__DLSTATE && window.__DLSTATE.pbDone) ? 100
          : (window.__DLSTATE ? Math.floor(window.__DLSTATE.pbPct) : 47);
        const epsEl = q('#st-eps');
        epsEl.innerHTML = EPS.map(function (e, i) {
          const off = (!e.watched && pbPct < 100);
          return `<div class="st-ep${i === st.ep ? ' cur' : ''}${off ? ' off' : ''}" data-i="${i}" style="${off ? 'cursor:not-allowed;' : ''}">
            <div class="nm">${e.ep}${e.watched ? ' <span style="color:#4f8f4f;">✓已看</span>' : ''}</div>
            <div class="sub">${off ? '下载中 ' + pbPct + '%（迅雷）' : e.name}</div>
          </div>`;
        }).join('');
        Array.prototype.forEach.call(epsEl.querySelectorAll('.st-ep'), function (el) {
          el.addEventListener('click', function () { tryPlay(+el.dataset.i); });
          el.addEventListener('dblclick', function () { tryPlay(+el.dataset.i); });
        });
      }

      function tryPlay(i) {
        const e = EPS[i];
        const pbPct = (window.__DLSTATE && window.__DLSTATE.pbDone) ? 100
          : (window.__DLSTATE ? window.__DLSTATE.pbPct : 100);
        if (!e.watched && pbPct < 100) {
          q('#st-stat').textContent = '无法播放：文件尚未下载完成（' + Math.floor(pbPct) + '%），等迅雷下完吧';
          WM.balloon({
            title: '暴风影音 2',
            text: '「第04集」还在迅雷的下载队列里（' + Math.floor(pbPct) + '%）。\n2007 年可没有边下边播这回事。\n〔馆注〕去迅雷右键任务行，可×60 快进演示。',
            icon: ICONS.storm, timeout: 6000
          });
          return;
        }
        st.ep = i; st.t = 0; st.playing = true;
        setPlayFlag(true);
        renderEps();
        q('#st-nowplaying').textContent = '正在播放：越狱 第三季 ' + e.ep + ' 枪版 DVDRip · RMVB 480×272';
      }

      /* ---- 播放控制 ---- */
      function setPlayFlag(on) {
        st.playing = on;
        q('#st-play').innerHTML = on ? SVG_PAUSE : SVG_PLAY;
        q('#st-play2').innerHTML = on ? SVG_PAUSE : SVG_PLAY;
        q('#st-scene').classList.toggle('on', on);
        q('#st-idle').style.display = on ? 'none' : 'flex';
        q('#st-stat').textContent = on ? '播放中：越狱 第三季 ' + EPS[st.ep].ep : '已暂停';
        if (on) {
          if (!st.timer) st.timer = setInterval(tick, 1000);
          setTimeout(checkCodec, 5000);   /* 播放 5 秒后的解码器彩蛋 */
        } else if (st.timer) { clearInterval(st.timer); st.timer = null; }
      }

      function tick() {
        st.t++;
        if (st.t > EP_TOTAL) { st.t = 0; }
        updateUI();
      }

      function updateUI() {
        const p = st.t / EP_TOTAL * 100;
        q('#st-fill').style.width = p + '%';
        q('#st-knob').style.left = p + '%';
        q('#st-time').textContent = clock(st.t) + ' / ' + clock(EP_TOTAL);
        /* 字幕轮换 */
        const g = SUBS[Math.floor(st.t / 12) % SUBS.length][Math.floor(st.t / 6) % 2];
        q('#st-subline').textContent = st.sub === 0 ? '' : g;
      }

      function clock(s) {
        const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60, p = function (n) { return ('0' + n).slice(-2); };
        return p(h) + ':' + p(m) + ':' + p(r);
      }

      /* ---- 彩蛋：缺少解码器（2007 全民计算机课） ---- */
      function checkCodec() {
        if (st.codecOK || st.asked || !st.playing) return;
        st.asked = true;
        setPlayFlag(false);
        const w2 = WM.open({
          id: 'st-codec', title: '暴风影音提示', icon: ICONS.storm, w: 360, h: 190, x: 300, y: 220,
          content: `
            <div style="padding:14px 16px;display:flex;flex-direction:column;height:100%;">
              <div style="display:flex;gap:10px;">
                <div style="font-size:28px;color:#d98a10;">⚠</div>
                <div style="line-height:1.7;">暴风影音提示：<br>播放该文件需要 <b>RealVideo 9 (RV40)</b> 解码器，当前系统中未安装。<br>是否<b style="color:#0054e6;">在线安装</b>该解码器？</div>
              </div>
              <div style="margin-top:auto;display:flex;justify-content:flex-end;gap:8px;">
                <button class="xp-btn" id="st-inst">在线安装(I)</button>
                <button class="xp-btn" id="st-skip">取消</button>
              </div>
            </div>`
        });
        WM.center(w2);
        w2.body.querySelector('#st-inst').addEventListener('click', function () {
          WM.close('st-codec');
          installProgress();
        });
        w2.body.querySelector('#st-skip').addEventListener('click', function () {
          WM.close('st-codec');
          q('#st-stat').textContent = '播放失败：缺少解码器（黑屏，连声音都没有）';
        });
      }

      function installProgress() {
        const w3 = WM.open({
          id: 'st-codec2', title: '暴风影音 - 在线安装解码器', icon: ICONS.storm, w: 380, h: 160, x: 300, y: 220,
          content: `
            <div style="padding:16px;display:flex;flex-direction:column;gap:10px;">
              <div>正在下载: rv40codec.exe（1.2MB，来自 www.baofeng.com）</div>
              <div style="border:1px solid #7f9db9;height:16px;background:#fff;position:relative;">
                <i id="st-pfill" style="position:absolute;left:1px;top:1px;bottom:1px;width:0%;background:linear-gradient(180deg,#8fd0ff,#1667c9);display:block;"></i>
              </div>
              <div id="st-ptext" style="color:#808080;">正在连接服务器...</div>
            </div>`
        });
        WM.center(w3);
        let p = 0;
        const tm = setInterval(function () {
          p += 6 + Math.random() * 9;
          w3.body.querySelector('#st-pfill').style.width = Math.min(100, p) + '%';
          w3.body.querySelector('#st-ptext').textContent = '已下载 ' + Math.min(100, Math.round(p)) + '%（速度 ' + (20 + Math.random() * 30).toFixed(1) + ' KB/s）';
          if (p >= 100) {
            clearInterval(tm);
            w3.body.querySelector('#st-ptext').textContent = '安装完成！解码器已注册（RealVideo 9 / RV40）';
            setTimeout(function () {
              WM.close('st-codec2');
              st.codecOK = true;
              setPlayFlag(true);
              q('#st-stat').textContent = '播放中：越狱 第三季 ' + EPS[st.ep].ep + '（解码器已安装）';
            }, 900);
          }
        }, 260);
      }

      /* ---- 右键：字幕切换 ---- */
      q('#st-video').addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showCtxMenu(e.clientX, e.clientY, [
          { text: (st.sub === 0 ? '● ' : '') + '无字幕', action: function () { st.sub = 0; q('#st-stat').textContent = '字幕：已关闭'; } },
          '-',
          { text: (st.sub === 1 ? '● ' : '') + '简体中文 [YYeTs]', action: function () { st.sub = 1; q('#st-stat').textContent = '字幕：简体中文 [YYeTs]（射手网下载）'; } },
          { text: (st.sub === 2 ? '● ' : '') + '简体中文 [伊甸园S-files]', action: function () { st.sub = 2; q('#st-stat').textContent = '字幕：简体中文 [伊甸园S-files]'; } },
          '-',
          { text: '字幕延迟 +0.5s', action: function () { WM.balloon({ title: '暴风影音', text: '字幕时间轴已后移 0.5 秒。', icon: ICONS.storm, timeout: 3500 }); } },
          { text: '画面比例 4:3 / 16:9', action: function () {} }
        ]);
      });

      /* ---- 控制条 ---- */
      q('#st-play').addEventListener('click', function () { setPlayFlag(!st.playing); });
      q('#st-play2').addEventListener('click', function () { setPlayFlag(!st.playing); });
      q('#st-stop').addEventListener('click', function () { setPlayFlag(false); st.t = 0; updateUI(); });
      q('#st-open').addEventListener('click', function () {
        WM.balloon({ title: '暴风影音', text: '请从左侧播放列表选择文件。D:\\电影\\ 里的 RMVB 已经关联到暴风影音了。', icon: ICONS.storm, timeout: 5000 });
      });
      q('#st-full').addEventListener('click', function () {
        WM.balloon({ title: '暴风影音', text: '全屏模式在博物馆里就别按了吧，窗口会盖住 2007 年整个桌面。', icon: ICONS.storm, timeout: 4500 });
      });
      q('#st-track').addEventListener('click', function (e) {
        const r = e.currentTarget.getBoundingClientRect();
        st.t = Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * EP_TOTAL);
        updateUI();
      });

      /* ---- 联动轮询：迅雷里 E04 的进度 ---- */
      const poll = setInterval(function () {
        if (!WM.wins['storm']) { clearInterval(poll); return; }
        const pbDone = window.__DLSTATE && window.__DLSTATE.pbDone;
        const pbPct = window.__DLSTATE ? Math.floor(window.__DLSTATE.pbPct) : 47;
        const epsEl = q('#st-eps .st-ep:last-child .sub');
        if (epsEl) {
          if (pbDone && epsEl.textContent.indexOf('下载中') >= 0) {
            renderEps();
            WM.balloon({ title: '暴风影音 2', text: '检测到《越狱》S03E04 已下载完成，可以播放了。', icon: ICONS.storm, timeout: 7000 });
          } else if (epsEl.textContent.indexOf('下载中') >= 0) {
            epsEl.textContent = '下载中 ' + pbPct + '%（迅雷）';
          }
        }
      }, 1500);

      renderEps();
      updateUI();
    }
  };
})();
