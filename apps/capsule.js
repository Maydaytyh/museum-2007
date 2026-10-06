/* ============================================================
   apps/capsule.js —— 「你正在使用 2007 年的互联网」时间胶囊
   数据：data/capsule.js（window.CAPSULE，68 条）
   ============================================================ */

(function () {

  const CSS = `
#cp-root { display:flex; flex-direction:column; height:100%; background:linear-gradient(180deg,#101623,#0b0f18 55%,#080b11); color:#cdd6e4; }
#cp-head { flex:none; padding:14px 18px 10px; border-bottom:1px solid #2a3a55; }
#cp-head .t { font-family:"SimSun",serif; font-size:16px; color:#e8ecf4; letter-spacing:1px; font-weight:bold; }
#cp-head .s { font-size:11px; color:#7a88a0; margin-top:3px; line-height:1.6; }
#cp-stage { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px 20px; overflow:auto; }
#cp-stage::-webkit-scrollbar { width:8px; } #cp-stage::-webkit-scrollbar-thumb { background:#2a3a55; border-radius:4px; }
#cp-empty { text-align:center; color:#8a97ad; line-height:2; }
#cp-empty .big { font-size:20px; color:#e8ecf4; font-family:"SimSun",serif; letter-spacing:2px; margin-bottom:8px; }
#cp-empty .hint { font-size:11px; color:#5c6a80; }
/* 胶囊票根 */
#cp-card { width:100%; max-width:460px; background:linear-gradient(180deg,#f5ecd7,#e8dcc0); color:#2a2118;
  border:1px solid #8a6f45; border-radius:5px; padding:0; box-shadow:0 4px 14px rgba(0,0,0,.5); overflow:hidden; }
#cp-card .cp-top { display:flex; align-items:center; gap:8px; padding:8px 14px; background:#3a2b1c; color:#e8d9b0; }
#cp-card .cp-cat { font-size:11px; letter-spacing:1px; }
#cp-card .cp-era { margin-left:auto; font-size:10px; color:#a08a5f; }
#cp-card .cp-body { padding:16px 18px 10px; }
#cp-card .cp-text { font-size:15px; line-height:1.8; color:#241c12; font-family:"SimSun",serif; }
#cp-card .cp-note { margin:12px 18px 0; padding:8px 10px; border-left:3px solid #b98f3e;
  background:rgba(107,74,43,.10); font-size:11.5px; color:#5c452a; line-height:1.7; }
#cp-card .cp-src { padding:8px 18px 12px; font-size:10px; color:#8a7550; text-align:right; }
#cp-card .cp-dash { height:0; border-top:1px dashed #b9a678; margin:0 12px; }
#cp-card.shake { animation:cpShake .45s; }
@keyframes cpShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px) rotate(-1deg)}
  40%{transform:translateX(5px) rotate(1deg)} 60%{transform:translateX(-4px)} 80%{transform:translateX(3px)} }
/* 按钮 */
#cp-btn { flex:none; margin:4px 0 16px; }
#cp-shake { display:flex; align-items:center; gap:9px; padding:9px 26px; border-radius:22px; cursor:default;
  background:linear-gradient(180deg,#8a6f45,#6b4a2b 60%,#553a20); border:1px solid #a58a5e;
  color:#f5ecd7; font-size:14px; font-family:"SimSun",serif; letter-spacing:2px;
  box-shadow:0 3px 10px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,235,180,.25); }
#cp-shake:hover { filter:brightness(1.12); }
#cp-shake:active { transform:translateY(1px); }
#cp-shake svg { width:20px; height:20px; }
#cp-shake.busy { opacity:.55; pointer-events:none; }
#cp-rest { margin-left:14px; font-size:11px; color:#7a88a0; letter-spacing:0; font-family:Tahoma,"SimSun",sans-serif; }`;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  const SHAKE_SVG = `<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="6" rx="5" fill="#e8d9b0"/><rect x="6" y="7" width="12" height="14" rx="3" fill="none" stroke="#e8d9b0" stroke-width="2"/><path d="M9 11 l1.5 5 M12 11 l0 5 M15 11 l-1.5 5" stroke="#e8d9b0" stroke-width="1.4"/></svg>`;

  let bag = [];      /* 未抽中的词条索引池 */

  function launch() {
    if (!document.getElementById('capsule-css')) {
      const st = document.createElement('style');
      st.id = 'capsule-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    const rec = WM.open({
      id: 'capsule',
      title: '你正在使用 2007 年的互联网',
      icon: ICONS.capsule,
      w: 560, h: 460,
    });
    if (rec.body.dataset.cpInit) { WM.focus('capsule'); return rec; }
    rec.body.dataset.cpInit = '1';
    rec.body.style.cssText = 'background:#0b0f18;border-color:#1c2736 !important;';

    rec.body.innerHTML = `
      <div id="cp-root">
        <div id="cp-head">
          <div class="t">时间胶囊 · 2007</div>
          <div class="s">从研究档案（research/*.md）与本机数据中封存的词条，随机摇出一条。每条附一句 2026 年的馆长注脚——不感慨，只对照。</div>
        </div>
        <div id="cp-stage">
          <div id="cp-empty">
            <div class="big">摇一摇，时间胶囊</div>
            <div>新闻头条 · 广告语 · 流行语 · 软件时代 · 单曲循环 · 游戏 · 论坛语录</div>
            <div class="hint">共 ${CAPSULE.length} 条，抽完自动重新装填</div>
          </div>
        </div>
        <div style="display:flex;justify-content:center;">
          <div id="cp-btn">
            <span id="cp-shake">${SHAKE_SVG}<span>摇一摇时间胶囊</span><span id="cp-rest"></span></span>
          </div>
        </div>
      </div>`;

    const stage = rec.body.querySelector('#cp-stage');
    const btn = rec.body.querySelector('#cp-shake');
    const rest = rec.body.querySelector('#cp-rest');

    function refill() { bag = CAPSULE.map((_, i) => i); }
    refill();
    updateRest();

    function updateRest() {
      rest.textContent = bag.length ? '（剩 ' + bag.length + ' 条）' : '（重新装填）';
    }

    btn.addEventListener('click', () => {
      if (!bag.length) refill();
      /* 随机抽一条 */
      const idx = bag.splice(Math.floor(Math.random() * bag.length), 1)[0];
      const e = CAPSULE[idx];
      updateRest();

      const card = document.createElement('div');
      card.id = 'cp-card';
      card.className = 'shake';
      card.innerHTML = `
        <div class="cp-top">
          <svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="6.5" fill="none" stroke="#b98f3e" stroke-width="1.5"/><path d="M8 4 v4 l2.6 1.6" fill="none" stroke="#b98f3e" stroke-width="1.5"/></svg>
          <span class="cp-cat">【${esc(e.cat)}】</span>
          <span class="cp-era">${esc(e.era)}</span>
        </div>
        <div class="cp-body"><div class="cp-text">${esc(e.text)}</div></div>
        <div class="cp-note">馆长注（2026）：${esc(e.note)}</div>
        <div class="cp-dash"></div>
        <div class="cp-src">来源：${esc(e.src)}</div>`;
      stage.innerHTML = '';
      stage.appendChild(card);
      setTimeout(() => card.classList.remove('shake'), 500);
    });

    return rec;
  }

  APPS.capsule = {
    title: '时间胶囊',
    icon: ICONS.capsule,
    desktop: true,
    order: 11,
    hint: '摇一摇：随机掉出一条 2007（共 68 条）',
    launch,
  };

})();
