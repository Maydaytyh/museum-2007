/* ============================================================
   apps/qq.js —— 腾讯QQ2007 模拟器（2007 数字生活博物馆·灵魂模块）
   ------------------------------------------------------------
   断代红线（research/qq.md）：
   - 版本锚点：QQ2007 II Beta1（2007-10），有「窗口抖动」（§8.3）
   - 无「隐身对其可见」：只有全局隐身（§8.1 / Q18）
   - 无抢车位/好友买卖/情侣空间/QQ农场（§10.4 / Q13 / Q20）
   - 聊天消息为「昵称 时间 + 纯文本行」，宋体 12px 黑字白底（§8.4 / 13D.1）
   - 表情 = 经典小黄脸 + /xx 文字代码混用（§8.4）
   - 提示音（§8.2）：滴滴滴滴滴滴=新消息；咳嗽=系统消息；敲门(咚咚)=好友上线
   - 等级：4星=1月亮，16级=1太阳，活跃天数 D=N²+4N（§5.2/§5.4/§5.5）
   - 聊天记录只存本地（内存模拟），换窗口不丢（§8.4 / Q3）
   - 「对方正在输入…」指示条：研究档案无 2007 年证据（MSN 有、QQ 不确定），
     按断代纪律「不确定就不做」，本模块不实现。
   ============================================================ */
(function () {
  'use strict';

  const D = window.QQDATA;
  const ME = D.me;

  /* ============ QQ 专属样式（QQ2007 窄面板 / 蓝渐变 / 宋体） ============ */
  const CSS = `
    .qq-panel{display:flex;flex-direction:column;height:100%;font-family:SimSun,'宋体',serif;font-size:12px;color:#000;background:#eef3fa;overflow:hidden}
    .qq-head{background:linear-gradient(180deg,#2f5fc2 0%,#5f8fd8 55%,#a9c6ee 100%);padding:8px 9px 7px;color:#fff;flex:none}
    .qq-me{display:flex;gap:8px;align-items:center}
    .qq-ava{width:40px;height:40px;flex:none;border:1px solid #fff;background:#fff;border-radius:3px;overflow:hidden}
    .qq-ava svg,.qq-fava svg{width:100%;height:100%;display:block}
    .qq-nick{font-weight:bold;font-size:13px;text-shadow:0 1px 1px rgba(0,0,0,.35)}
    .qq-myst{font-size:11px;opacity:.9}
    .qq-lv svg{width:13px;height:13px;vertical-align:-2px;margin-right:1px}
    .qq-sig{font-size:11px;color:#e9f1ff;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .qq-search{padding:5px 7px;background:#dde7f4;border-bottom:1px solid #b6c8e4;flex:none}
    .qq-search input{width:100%;box-sizing:border-box;font-family:SimSun,'宋体',serif;font-size:12px}
    .qq-tabs{display:flex;background:#e4ecf7;border-bottom:1px solid #b6c8e4;flex:none}
    .qq-tab{flex:1;text-align:center;padding:4px 0;cursor:pointer;color:#33517e;border-right:1px solid #c5d5ec;user-select:none}
    .qq-tab:last-child{border-right:none}
    .qq-tab.on{background:#fff;color:#0f50d9;font-weight:bold}
    .qq-list{flex:1;overflow:auto;background:#f8fbfe;min-height:0}
    .qq-grp{padding:3px 8px;background:#dfe9f5;color:#274e8d;font-weight:bold;cursor:pointer;user-select:none;display:flex;justify-content:space-between;position:sticky;top:0}
    .qq-grp:hover{background:#d2e0f2}
    .qq-friend{display:flex;align-items:center;gap:7px;padding:3px 8px;cursor:default}
    .qq-friend:hover{background:#dceafa}
    .qq-fava{width:32px;height:32px;flex:none;border:1px solid #cfd8e6;background:#fff;overflow:hidden}
    .qq-fnick{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#182338}
    .qq-badge{font-size:10px;color:#fff;border-radius:2px;padding:0 3px;flex:none;font-family:Tahoma}
    .qq-badge.b-on{background:#3fa63f}.qq-badge.b-away{background:#c9a134}.qq-badge.b-qme{background:#2b6fc4}
    .qq-friend.off .qq-fava{filter:grayscale(1);opacity:.45}
    .qq-friend.off .qq-fnick{color:#8a94a3}
    .qq-friend.away .qq-fava{filter:grayscale(.55) opacity(.75)}
    .qq-friend.unread .qq-fava{animation:qqflash .5s steps(2,end) infinite}
    @keyframes qqflash{0%{opacity:1}50%{opacity:.1}100%{opacity:1}}
    .qq-foot{display:flex;gap:4px;padding:5px 7px;background:#dde7f4;border-top:1px solid #b6c8e4;flex:none;align-items:center}
    .qf-btn{width:28px;height:28px;border:1px solid #b6c8e4;background:linear-gradient(180deg,#fff,#e2eaf6);border-radius:3px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative}
    .qf-btn:hover{border-color:#e59700}
    .qf-btn svg{width:18px;height:18px}
    .qf-lab{font-size:10px;color:#33517e;margin-left:2px}
    /* ---- 聊天窗口（QQ2007：白底黑字宋体，无现代气泡） ---- */
    .qqchat{display:flex;flex-direction:column;height:100%;font-family:SimSun,'宋体',serif;font-size:12px;background:#fff}
    .qc-top{display:flex;gap:8px;align-items:center;padding:6px 10px;background:linear-gradient(180deg,#f4f8fc,#dbe6f3);border-bottom:1px solid #b6c8e4;flex:none}
    .qc-top .qq-ava{width:36px;height:36px}
    .qc-nick{font-weight:bold;color:#0f3a8c}
    .qc-sig{font-size:11px;color:#777;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:300px}
    .qc-main{flex:1;display:flex;min-height:0}
    .qc-show{width:66px;flex:none;background:linear-gradient(180deg,#eef4fb,#ccdcee);border-right:1px solid #b6c8e4;display:flex;flex-direction:column;align-items:center;padding-top:10px;gap:8px}
    .qc-doll svg{width:52px;height:118px;display:block}
    .qc-right{flex:1;display:flex;flex-direction:column;min-width:0}
    .qc-msgs{flex:1;overflow-y:auto;padding:6px 10px;background:#fff;min-height:0}
    .qc-lname{font-weight:bold}
    .qc-lname.me{color:#3163b7}
    .qc-lname.them{color:#000}
    .qc-ltime{color:#999;font-weight:normal;font-size:11px;margin-left:7px;font-family:Tahoma}
    .qc-ltext{margin:1px 0 9px 0;line-height:1.6;word-break:break-word;white-space:pre-wrap;color:#000}
    .qc-sys{text-align:center;color:#888;margin:7px 0;font-size:11px}
    .qq-emo{display:inline-block;width:20px;height:20px;vertical-align:-5px}
    .qq-emo svg{width:20px;height:20px;display:block}
    .qc-toolbar{display:flex;gap:4px;padding:3px 7px;background:#f3f6fa;border-top:1px solid #c9d6e8;flex:none;align-items:center;position:relative}
    .qc-tool{padding:2px 9px;border:1px solid #b6c8e4;background:linear-gradient(180deg,#fff,#e4ecf7);cursor:pointer;font-size:12px;font-family:SimSun,'宋体',serif}
    .qc-tool:hover{border-color:#e59700}
    .qc-tool.warn{border-color:#c33;color:#a00}
    .qc-input{height:62px;resize:none;border:none;outline:none;padding:6px 9px;font-family:SimSun,'宋体',serif;font-size:12px;width:100%;box-sizing:border-box;background:#fff}
    .qc-sendrow{display:flex;justify-content:flex-end;align-items:center;gap:10px;padding:4px 9px 6px;background:#f3f6fa;border-top:1px solid #c9d6e8;flex:none}
    .qc-hint{color:#999;font-size:11px;flex:1}
    .qc-emoji{position:absolute;top:100%;left:6px;z-index:60;background:#fff;border:1px solid #8ba6cf;box-shadow:2px 2px 7px rgba(0,0,0,.3);padding:4px;width:230px;display:flex;flex-wrap:wrap;gap:1px}
    .qc-emoji div{width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .qc-emoji div:hover{background:#ffe9b0}
    .qc-emoji svg{width:20px;height:20px}
    .qq-shake{animation:qqshake .1s linear 4}
    @keyframes qqshake{0%{transform:translate(0,0)}25%{transform:translate(-7px,4px)}50%{transform:translate(6px,-5px)}75%{transform:translate(-5px,-3px)}100%{transform:translate(0,0)}}
    /* ---- 登录小窗 ---- */
    .qq-login{height:100%;background:linear-gradient(180deg,#1d4fa8 0%,#3a75cd 45%,#8fb4e6 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:Tahoma,SimSun,'宋体',serif;gap:9px}
    .qq-login .lgp{width:64px;height:64px}
    .qq-login .lgp svg{width:64px;height:64px}
    .qq-lgbar{width:220px;height:12px;border:1px solid #fff;border-radius:6px;overflow:hidden;background:rgba(0,0,0,.25)}
    .qq-lgbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#9fe08a,#4fae3a);transition:width .5s}
    .qq-lgst{font-size:12px;text-shadow:0 1px 2px rgba(0,0,0,.4)}
    /* ---- Qzone 卡片 ---- */
    .qqzone{padding:12px 14px;font-family:SimSun,'宋体',serif;font-size:12px;line-height:1.8}
    .qqzone h4{margin:0 0 6px;font-size:13px;color:#0f50d9}
    .qqzone .zz-sec{border:1px solid #c9d6e8;background:#f6f9fd;padding:6px 9px;margin-bottom:9px}
    .qqzone .zz-t{color:#c60;font-weight:bold}
  `;
  (function injectStyle() {
    if (!document.getElementById('qq-style')) {
      const s = document.createElement('style');
      s.id = 'qq-style';
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  })();

  /* ============ 运行时状态（聊天记录存内存：重开窗口不丢） ============ */
  const S = {
    muted: false,          // 提示音开关（托盘右键可静音）
    myst: 'online',        // 我的全局状态：online / hidden（2007 只有全局隐身 §8.1）
    recs: {},              // id -> [{who:'me'|'them'|'sys', name, text, tm}]
    steps: {},             // 剧本好友：已推进到的对话组下标
    afterSaid: {},         // 剧本走完后是否说过 after 收尾句
    genCnt: {},            // 普通好友：用户发话计数（用于通用回复→886 收尾）
    stopped: {},           // 剧本好友：是否已 886 收尾（之后不再自动回话）
    unread: {},            // 未读消息计数（头像闪动）
    fold: {},              // 分组折叠状态
    tab: 'contacts',       // 主面板当前 Tab：contacts / groups / recent
    scamReported: false,   // 盗号举报后，骗子不再回话
    linxiaoOnlined: false, // 林晓是否已「上线」
    inited: false,         // autoLogin 只跑一次
  };

  /* ============ WebAudio 合成提示音（§8.2 三段音效） ============
     浏览器策略：需用户交互后才能发声——首次 pointerdown/keydown 时初始化；
     （本馆开机流程本来就要点一次「张伟」用户名，天然满足） */
  let AC = null;
  function ensureAC() {
    if (!AC) {
      try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; }
    }
    if (AC && AC.state === 'suspended') AC.resume().catch(function () {});
  }
  document.addEventListener('pointerdown', ensureAC, { capture: true });
  document.addEventListener('keydown', ensureAC, { capture: true });

  /* 「滴滴滴滴滴滴」= 新消息（§8.2：六声量级的连续短促音） */
  function sndMsg() {
    if (S.muted || !AC) return;
    const t0 = AC.currentTime;
    for (let i = 0; i < 6; i++) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'square'; o.frequency.value = 1080;
      const t = t0 + i * 0.115;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      o.connect(g); g.connect(AC.destination);
      o.start(t); o.stop(t + 0.09);
    }
  }
  /* 「咚咚」= 好友上线（敲门声，两下低频闷响） */
  function sndKnock() {
    if (S.muted || !AC) return;
    const t0 = AC.currentTime;
    [0, 0.17].forEach(function (off) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine';
      const t = t0 + off;
      o.frequency.setValueAtTime(170, t);
      o.frequency.exponentialRampToValueAtTime(85, t + 0.12);
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(g); g.connect(AC.destination);
      o.start(t); o.stop(t + 0.16);
    });
  }
  /* 「咳咳」= 系统消息（近似中年男声咳嗽：两段带通噪声脉冲） */
  function sndCough() {
    if (S.muted || !AC) return;
    const t0 = AC.currentTime;
    [0, 0.22].forEach(function (off) {
      const len = 0.11, buf = AC.createBuffer(1, AC.sampleRate * len, AC.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 1.6);
      const src = AC.createBufferSource(); src.buffer = buf;
      const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 1.1;
      const g = AC.createGain();
      const t = t0 + off;
      g.gain.setValueAtTime(0.55, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      src.connect(bp); bp.connect(g); g.connect(AC.destination);
      src.start(t);
    });
  }

  /* ============ 等级图标（§5.2/§5.5：4星=1月亮，4月亮=1太阳，16级=1太阳） ============ */
  const SVG_SUN = '<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><g stroke="#e8a200" stroke-width="1.5"><line x1="7" y1="0.4" x2="7" y2="2.4"/><line x1="7" y1="11.6" x2="7" y2="13.6"/><line x1="0.4" y1="7" x2="2.4" y2="7"/><line x1="11.6" y1="7" x2="13.6" y2="7"/><line x1="2.3" y1="2.3" x2="3.7" y2="3.7"/><line x1="10.3" y1="10.3" x2="11.7" y2="11.7"/><line x1="2.3" y1="11.7" x2="3.7" y2="10.3"/><line x1="10.3" y1="3.7" x2="11.7" y2="2.3"/></g><circle cx="7" cy="7" r="3.4" fill="#ffc61e" stroke="#b8860b" stroke-width="0.8"/></svg>';
  const SVG_MOON = '<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M8.8 1.6 A5.6 5.6 0 1 0 8.8 12.4 A4.5 4.5 0 1 1 8.8 1.6 Z" fill="#ffd34d" stroke="#b8860b" stroke-width="0.7"/></svg>';
  const SVG_STAR = '<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><polygon points="7,1.6 8.7,5.2 12.6,5.5 9.6,8 10.5,11.8 7,9.8 3.5,11.8 4.4,8 1.4,5.5 5.3,5.2" fill="#ffd34d" stroke="#b8860b" stroke-width="0.6"/></svg>';
  function levelIcons(lv) {
    if (!lv || lv < 1) lv = 1;
    let out = '', n;
    n = Math.floor(lv / 16); for (let i = 0; i < n; i++) out += SVG_SUN;
    const rem = lv % 16;
    n = Math.floor(rem / 4); for (let i = 0; i < n; i++) out += SVG_MOON;
    n = rem % 4; for (let i = 0; i < n; i++) out += SVG_STAR;
    return out;
  }
  /* 活跃天数 D = N² + 4N（§5.4，2005-08-15 制度，2007 全年沿用） */
  function activeDays(lv) { return lv * lv + 4 * lv; }

  /* ============ 小黄脸表情（经典黄脸阶段，§8.4；/xx 文字代码真实存在） ============ */
  function faceSVG(eyes, mouth, extra) {
    let inner = '';
    if (eyes === 'dot') inner += '<circle cx="8.2" cy="9.5" r="1.4" fill="#4a2c00"/><circle cx="15.8" cy="9.5" r="1.4" fill="#4a2c00"/>';
    else if (eyes === 'arc') inner += '<path d="M6.8 9.6 Q8.2 7.8 9.6 9.6 M14.8 9.6 Q16.2 7.8 17.6 9.6" stroke="#4a2c00" stroke-width="1.3" fill="none"/>';
    else if (eyes === 'arcInv') inner += '<path d="M6.8 8.6 Q8.2 10.4 9.6 8.6 M14.8 8.6 Q16.2 10.4 17.6 8.6" stroke="#4a2c00" stroke-width="1.3" fill="none"/>';
    else if (eyes === 'line') inner += '<line x1="6.9" y1="9.5" x2="9.5" y2="9.5" stroke="#4a2c00" stroke-width="1.3"/><line x1="14.5" y1="9.5" x2="17.1" y2="9.5" stroke="#4a2c00" stroke-width="1.3"/>';
    else if (eyes === 'angry') inner += '<line x1="6.2" y1="6.8" x2="9.6" y2="8.4" stroke="#4a2c00" stroke-width="1.2"/><line x1="17.8" y1="6.8" x2="14.4" y2="8.4" stroke="#4a2c00" stroke-width="1.2"/><circle cx="8.2" cy="10" r="1.4" fill="#4a2c00"/><circle cx="15.8" cy="10" r="1.4" fill="#4a2c00"/>';
    else if (eyes === 'wink') inner += '<path d="M6.8 9.5 Q8.2 7.9 9.6 9.5" stroke="#4a2c00" stroke-width="1.3" fill="none"/><circle cx="15.8" cy="9.5" r="1.4" fill="#4a2c00"/>';
    else if (eyes === 'wide') inner += '<circle cx="8.2" cy="9.5" r="2.3" fill="#fff" stroke="#4a2c00" stroke-width="0.8"/><circle cx="15.8" cy="9.5" r="2.3" fill="#fff" stroke="#4a2c00" stroke-width="0.8"/><circle cx="8.2" cy="9.5" r="1" fill="#4a2c00"/><circle cx="15.8" cy="9.5" r="1" fill="#4a2c00"/>';
    else if (eyes === 'cool') inner += '<path d="M4.5 8.2 L11.5 8.2 L11.5 10.6 L4.5 10.6 Z M12.5 8.2 L19.5 8.2 L19.5 10.6 L12.5 10.6 Z" fill="#222"/><line x1="11.5" y1="8.8" x2="12.5" y2="8.8" stroke="#222" stroke-width="1.6"/>';
    if (mouth === 'smile') inner += '<path d="M7.5 14.5 Q12 18.5 16.5 14.5" stroke="#4a2c00" stroke-width="1.4" fill="none"/>';
    else if (mouth === 'grin') inner += '<path d="M6.8 14 Q12 20 17.2 14 Z" fill="#4a2c00"/><path d="M7.5 14.6 L16.5 14.6" stroke="#fff" stroke-width="1"/>';
    else if (mouth === 'frown') inner += '<path d="M7.5 17 Q12 13.5 16.5 17" stroke="#4a2c00" stroke-width="1.4" fill="none"/>';
    else if (mouth === 'open') inner += '<ellipse cx="12" cy="15.5" rx="3.4" ry="2.8" fill="#4a2c00"/>';
    else if (mouth === 'o') inner += '<ellipse cx="12" cy="15.5" rx="2.1" ry="2.6" fill="#4a2c00"/>';
    else if (mouth === 'flat') inner += '<line x1="9" y1="15.6" x2="15" y2="15.6" stroke="#4a2c00" stroke-width="1.4"/>';
    else if (mouth === 'wavy') inner += '<path d="M8 15.5 Q9.5 14 11 15.5 Q12.5 17 14 15.5 Q15.5 14 17 15.5" stroke="#4a2c00" stroke-width="1.2" fill="none"/>';
    else if (mouth === 'tongue') inner += '<path d="M7.5 14 Q12 18 16.5 14" stroke="#4a2c00" stroke-width="1.3" fill="none"/><path d="M10.2 16.2 Q12 19.2 13.8 16.2 Z" fill="#e56a95"/>';
    if (extra === 'tears') inner += '<path d="M6 11.5 q-1.6 2.4 0 3.4 q1.6 -1 0 -3.4Z M18 11.5 q-1.6 2.4 0 3.4 q1.6 -1 0 -3.4Z" fill="#4aa3e8"/>';
    else if (extra === 'sweat') inner += '<path d="M19.5 5 q-2 2.8 0 4 q2 -1.2 0 -4Z" fill="#4aa3e8"/>';
    else if (extra === 'blush') inner += '<ellipse cx="5.5" cy="13" rx="1.9" ry="1.2" fill="#f5a8a8"/><ellipse cx="18.5" cy="13" rx="1.9" ry="1.2" fill="#f5a8a8"/>';
    else if (extra === 'zzz') inner += '<text x="19" y="6" font-size="5.5" fill="#7a9fd0" font-family="Tahoma">z</text>';
    else if (extra === 'fist') inner += '<g><rect x="1.5" y="3.5" width="7" height="4" rx="1.2" fill="#c9882a"/><path d="M1.5 7.5 L1.5 12.5" stroke="#8a5a10" stroke-width="2"/></g>';
    else if (extra === 'hand') inner += '<g><rect x="1.2" y="8" width="4.5" height="5.5" rx="1.4" fill="#f0d0a0" stroke="#c9a15e" stroke-width="0.7"/></g>';
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10.4" fill="#ffce43" stroke="#b8860b" stroke-width="0.9"/>' + inner + '</svg>';
  }
  /* 经典小黄脸子集（名称沿用 QQ 默认表情命名，/代码调用为 2007 真实玩法 §8.4） */
  const EMOJI = [
    { c: '/微笑', s: faceSVG('dot', 'smile') },
    { c: '/撇嘴', s: faceSVG('dot', 'frown') },
    { c: '/呲牙', s: faceSVG('arc', 'grin') },
    { c: '/调皮', s: faceSVG('wink', 'tongue') },
    { c: '/大哭', s: faceSVG('arcInv', 'open', 'tears') },
    { c: '/害羞', s: faceSVG('dot', 'smile', 'blush') },
    { c: '/闭嘴', s: faceSVG('line', 'flat') },
    { c: '/睡', s: faceSVG('line', 'wavy', 'zzz') },
    { c: '/尴尬', s: faceSVG('line', 'wavy', 'sweat') },
    { c: '/发怒', s: faceSVG('angry', 'frown') },
    { c: '/惊讶', s: faceSVG('wide', 'o') },
    { c: '/难过', s: faceSVG('dot', 'frown') },
    { c: '/酷', s: faceSVG('cool', 'flat') },
    { c: '/冷汗', s: faceSVG('arcInv', 'wavy', 'sweat') },
    { c: '/敲打', s: faceSVG('angry', 'flat', 'fist') },
    { c: '/再见', s: faceSVG('line', 'flat', 'hand') },
  ];

  /* ============ 工具函数 ============ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  /* 消息文本渲染：HTML 转义 + /表情代码 → 小黄脸（§8.4 表情体系） */
  function renderText(t) {
    let h = esc(t);
    EMOJI.forEach(function (e) { h = h.split(e.c).join('<span class="qq-emo">' + e.s + '</span>'); });
    return h;
  }
  /* 时间戳走托盘假时钟（win.js Tray.fakeNow，2007-10-17 晚） */
  function fmtTime() {
    let d = null;
    try { if (typeof Tray !== 'undefined' && Tray.fakeNow) d = new Date(Tray.fakeNow.getTime()); } catch (e) {}
    if (!d) d = new Date();
    const p = function (n) { return String(n).padStart(2, '0'); };
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  function friendById(id) { return D.friends.find(function (f) { return f.id === id; }); }
  function displayName(f) { return (f.remark ? f.remark : f.nick); }
  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ============ 聊天记录（内存保存，重开窗口不丢——本地记录时代 §8.4/Q3） ============ */
  function addRec(id, who, name, text) {
    if (!S.recs[id]) S.recs[id] = [];
    const r = { who: who, name: name, text: text, tm: fmtTime() };
    S.recs[id].push(r);
    const win = WM.wins['qqchat-' + id] || WM.wins['qqgrp-' + id];
    if (win) {
      const box = win.body.querySelector('.qc-msgs');
      if (box) {
        box.insertAdjacentHTML('beforeend', lineHTML(r));
        box.scrollTop = box.scrollHeight;
      }
    }
    return r;
  }
  function lineHTML(r) {
    if (r.who === 'sys') return '<div class="qc-sys">' + renderText(r.text) + '</div>';
    return '<div><span class="qc-lname ' + (r.who === 'me' ? 'me' : 'them') + '">' + esc(r.name) +
      '</span><span class="qc-ltime">' + esc(r.tm) + '</span></div>' +
      '<div class="qc-ltext">' + renderText(r.text) + '</div>';
  }

  /* 机器人来话：入记录 + 播「滴滴」+ 未读闪头像（若聊天窗未开） */
  function incoming(id, text) {
    const f = friendById(id);
    addRec(id, 'them', f ? displayName(f) : id, text);
    sndMsg();
    if (!WM.wins['qqchat-' + id]) {
      S.unread[id] = (S.unread[id] || 0) + 1;
      renderList();
    }
  }

  /* ============ QQ 秀小像（聊天窗左侧双方形象，§8.4/13D.1 标准布局） ============ */
  const DOLL_BOY = '<svg viewBox="0 0 52 118" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="16" r="12" fill="#f6d7ab"/><path d="M14 14 Q26 2 38 14 L38 10 Q26 -1 14 10 Z" fill="#2b2b2b"/><circle cx="21.5" cy="16" r="1.3" fill="#333"/><circle cx="30.5" cy="16" r="1.3" fill="#333"/><path d="M23 21 Q26 23.5 29 21" stroke="#a05a2c" stroke-width="1.1" fill="none"/><rect x="14" y="28" width="24" height="34" rx="4" fill="#3f6fb5"/><path d="M14 34 L6 52 L11 54 L18 40 Z" fill="#3f6fb5"/><path d="M38 34 L46 52 L41 54 L34 40 Z" fill="#3f6fb5"/><rect x="18" y="60" width="16" height="8" fill="#7f5a3a"/><rect x="18" y="66" width="7" height="26" rx="2.5" fill="#2b3a55"/><rect x="27" y="66" width="7" height="26" rx="2.5" fill="#2b3a55"/><ellipse cx="21.5" cy="94" rx="5" ry="3" fill="#222"/><ellipse cx="30.5" cy="94" rx="5" ry="3" fill="#222"/></svg>';
  const DOLL_GIRL = '<svg viewBox="0 0 52 118" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="16" r="12" fill="#f9dfc0"/><path d="M13 16 Q11 2 26 3 Q41 2 39 16 L39 24 Q41 6 26 6 Q11 6 13 24 Z" fill="#3a2a1a"/><circle cx="21.5" cy="16" r="1.3" fill="#333"/><circle cx="30.5" cy="16" r="1.3" fill="#333"/><path d="M23 21 Q26 23.5 29 21" stroke="#c0392b" stroke-width="1.1" fill="none"/><path d="M18 30 Q26 26 34 30 L36 62 Q26 66 16 62 Z" fill="#e884b0"/><path d="M18 30 L12 48 L17 50 L22 36 Z M34 30 L40 48 L35 50 L30 36 Z" fill="#e884b0"/><rect x="20" y="60" width="12" height="7" fill="#f2c9a0"/><rect x="19" y="65" width="6.5" height="27" rx="2.5" fill="#f2c9a0" stroke="#d8a87e" stroke-width="0.6"/><rect x="26.5" y="65" width="6.5" height="27" rx="2.5" fill="#f2c9a0" stroke="#d8a87e" stroke-width="0.6"/><ellipse cx="22.5" cy="94" rx="5" ry="3" fill="#c9557e"/><ellipse cx="29.5" cy="94" rx="5" ry="3" fill="#c9557e"/></svg>';
  const FEMALE = ['linxiao', 'wangfang', 'zhaomin', 'wuqian', 'heli', 'zhangqian', 'xujing', 'hanmei', 'biaojie', 'mama', 'weimei'];

  /* ============ 主面板（QQ2007 窄长竖版：§3.3/13D.1，约 240 宽量级） ============ */
  function panelHTML() {
    return `
      <div class="qq-panel">
        <div class="qq-head">
          <div class="qq-me">
            <div class="qq-ava">${D.avatars[ME.avatar]}</div>
            <div>
              <div class="qq-nick">${esc(ME.nick)} <span class="qq-lv">${levelIcons(ME.level)}</span></div>
              <div class="qq-myst" id="qq-myst">［${S.myst === 'hidden' ? '隐身' : '在线'}］</div>
            </div>
          </div>
          <div class="qq-sig" title="${esc(ME.signature)}">${esc(ME.signature)}</div>
        </div>
        <div class="qq-search"><input class="xp-input" id="qq-search" placeholder="查找联系人..."></div>
        <div class="qq-tabs" id="qq-tabs">
          <div class="qq-tab on" data-tab="contacts">联系人</div>
          <div class="qq-tab" data-tab="groups">群/讨论组</div>
          <div class="qq-tab" data-tab="recent">最近联系人</div>
        </div>
        <div class="qq-list xp-scroll" id="qq-list"></div>
        <div class="qq-foot">
          <div class="qf-btn" id="qf-qzone" title="QQ空间">${'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.5 L12.4 7.2 L18.5 7.6 L13.8 11.5 L15.4 17.5 L10 14.2 L4.6 17.5 L6.2 11.5 L1.5 7.6 L7.6 7.2 Z" fill="#f5b800" stroke="#b8860b" stroke-width="0.8"/></svg>'}</div>
          <div class="qf-btn" title="QQ邮箱（本馆未开放）"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="4" width="17" height="12" rx="1.5" fill="#fff" stroke="#7a8ba8"/><path d="M2 5 L10 12 L18 5" fill="none" stroke="#7a8ba8" stroke-width="1.4"/></svg></div>
          <div class="qf-btn" title="QQ游戏大厅（本馆未开放）"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 3 Q10 2 10 5 Q10 2 14 3 Q16 7 11 8 L11 12 M11 15 L11 16" stroke="#7a8ba8" stroke-width="1.6" fill="none"/><circle cx="11" cy="17.4" r="1.2" fill="#7a8ba8"/></svg></div>
          <div class="qf-btn" title="查找（本馆未开放）"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="#7a8ba8" stroke-width="1.7"/><line x1="12.8" y1="12.8" x2="17.5" y2="17.5" stroke="#7a8ba8" stroke-width="1.9"/></svg></div>
          <span class="qf-lab">QQ2007</span>
        </div>
      </div>`;
  }

  /* 好友行（含状态徽标 + 悬停等级 Tips——「查等级」是加好友后的标准动作 §5.6） */
  function friendRowHTML(f) {
    const st = f.status === 'hidden' ? '离线' : (f.status === 'online' ? '在线' : (f.status === 'away' ? '离开' : (f.status === 'qme' ? 'Q我吧' : '离线')));
    const badge = f.status === 'online' ? '<span class="qq-badge b-on">在</span>' :
      f.status === 'away' ? '<span class="qq-badge b-away">离</span>' :
      f.status === 'qme' ? '<span class="qq-badge b-qme">Q</span>' : '';
    const cls = (f.status === 'offline' || f.status === 'hidden') ? ' off' : (f.status === 'away' ? ' away' : '');
    const unread = S.unread[f.id] ? ' unread' : '';
    const tip = displayName(f) + '(' + f.qq + ')\n等级：' + f.level + '级  活跃天数 ' + activeDays(f.level) +
      '\n状态：' + st + (f.signature ? '\n签名：' + f.signature : '');
    return `<div class="qq-friend${cls}${unread}" data-fid="${f.id}" title="${esc(tip)}">
      <div class="qq-fava">${D.avatars[f.avatar] || D.avatars.a1}</div>
      <div class="qq-fnick">${esc(displayName(f))}</div>${badge}</div>`;
  }

  function renderList() {
    const el = document.getElementById('qq-list');
    if (!el) return;
    const kw = (document.getElementById('qq-search') || {}).value || '';
    const kwLow = kw.trim().toLowerCase();
    let html = '';
    if (S.tab === 'contacts') {
      D.groups.forEach(function (g) {
        const list = D.friends.filter(function (f) { return f.group === g; });
        const onCnt = list.filter(function (f) { return f.status === 'online' || f.status === 'away' || f.status === 'qme'; }).length;
        const vis = list.filter(function (f) {
          if (!kwLow) return true;
          return (f.nick + f.remark).toLowerCase().indexOf(kwLow) >= 0;
        });
        const folded = S.fold[g];
        html += `<div class="qq-grp" data-grp="${esc(g)}"><span>${folded ? '▶' : '▼'} ${esc(g)}</span><span>[${onCnt}/${list.length}]</span></div>`;
        if (!folded) vis.forEach(function (f) { html += friendRowHTML(f); });
      });
    } else if (S.tab === 'groups') {
      D.qun.forEach(function (q) {
        html += `<div class="qq-friend" data-qid="${q.id}" title="${esc(q.name)}(${q.num})&#10;公告：${esc(q.notice)}">
          <div class="qq-fava"><svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="32" height="24" rx="3" fill="#7ba2e7" stroke="#3a6ea5"/><circle cx="14" cy="18" r="4" fill="#ffe9c9"/><circle cx="26" cy="18" r="4" fill="#ffe9c9"/><circle cx="14" cy="26" r="4" fill="#ffe9c9"/><circle cx="26" cy="26" r="4" fill="#ffe9c9"/><circle cx="20" cy="22" r="5" fill="#fff" stroke="#3a6ea5"/></svg></div>
          <div class="qq-fnick">${esc(q.name)}</div></div>`;
      });
      html += '<div class="qc-sys" style="padding:8px">群上限 100 人（2007 年当期普通群量级）<br>带①后缀 = 人满开二群</div>';
    } else {
      /* 最近联系人 Tab（§8.6：2007 已有；「昨晚和谁聊过」可被室友速查） */
      const ids = Object.keys(S.recs);
      if (!ids.length) html += '<div class="qc-sys" style="padding:10px">今晚还没跟谁聊过</div>';
      ids.forEach(function (id) {
        const f = friendById(id);
        if (f) html += friendRowHTML(f);
        else {
          const q = D.qun.find(function (x) { return x.id === id; });
          if (q) html += `<div class="qq-friend" data-qid="${q.id}"><div class="qq-fava"><svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="32" height="24" rx="3" fill="#7ba2e7" stroke="#3a6ea5"/><circle cx="14" cy="18" r="4" fill="#ffe9c9"/><circle cx="26" cy="18" r="4" fill="#ffe9c9"/><circle cx="14" cy="26" r="4" fill="#ffe9c9"/><circle cx="26" cy="26" r="4" fill="#ffe9c9"/><circle cx="20" cy="22" r="5" fill="#fff" stroke="#3a6ea5"/></svg></div><div class="qq-fnick">${esc(q.name)}</div></div>`;
        }
      });
    }
    el.innerHTML = html;
  }

  function launch() {
    if (WM.wins['qq-main']) { WM.focus('qq-main'); return; }
    const desk = document.getElementById('desktop');
    const w = Math.min(228, desk.clientWidth - 20);
    WM.open({
      id: 'qq-main',
      title: '腾讯QQ2007 - ' + ME.remark + (S.myst === 'hidden' ? ' [隐身]' : ' [在线]'),
      icon: ICONS.qq,
      w: w, h: Math.min(560, desk.clientHeight - 46),
      x: Math.max(4, desk.clientWidth - w - 10), y: 4,
      content: panelHTML(),
      onOpen: function () {
        renderList();
        bindPanel();
      },
    });
  }

  function bindPanel() {
    const list = document.getElementById('qq-list');
    /* 事件委托：分组折叠 / 双击好友开聊天窗 / 双击群开群聊 */
    list.addEventListener('click', function (e) {
      const grp = e.target.closest('.qq-grp');
      if (grp) {
        const g = grp.dataset.grp;
        S.fold[g] = !S.fold[g];
        renderList();
      }
    });
    list.addEventListener('dblclick', function (e) {
      const fr = e.target.closest('.qq-friend[data-fid]');
      if (fr) { openChat(friendById(fr.dataset.fid)); return; }
      const qr = e.target.closest('.qq-friend[data-qid]');
      if (qr) {
        const q = D.qun.find(function (x) { return x.id === qr.dataset.qid; });
        if (q) openGroup(q);
      }
    });
    const tabs = document.getElementById('qq-tabs');
    tabs.addEventListener('click', function (e) {
      const t = e.target.closest('.qq-tab');
      if (!t) return;
      S.tab = t.dataset.tab;
      tabs.querySelectorAll('.qq-tab').forEach(function (x) { x.classList.toggle('on', x === t); });
      renderList();
    });
    const search = document.getElementById('qq-search');
    search.addEventListener('input', renderList);
    document.getElementById('qf-qzone').addEventListener('click', openQzone);
  }

  function clearUnread(id) {
    if (S.unread[id]) { delete S.unread[id]; renderList(); }
  }

  /* ============ 聊天窗口（QQ2007：无气泡，「昵称 时间」文本行） ============ */
  function chatHTML(f) {
    const doll = FEMALE.indexOf(f.id) >= 0 ? DOLL_GIRL : DOLL_BOY;
    const reportBtn = f.id === 'scam' ? '<button class="qc-tool warn" data-act="report">举报</button>' : '';
    return `
      <div class="qqchat">
        <div class="qc-top">
          <div class="qq-ava">${D.avatars[f.avatar] || D.avatars.a1}</div>
          <div>
            <div><span class="qc-nick">${esc(displayName(f))}</span> <span class="qq-lv">${levelIcons(f.level)}</span>
              <span style="color:#888;font-size:11px">(${esc(f.qq)})</span></div>
            <div class="qc-sig">${esc(f.signature || '（这个人很懒，什么都没有留下）')}</div>
          </div>
        </div>
        <div class="qc-main">
          <div class="qc-show"><div class="qc-doll">${DOLL_BOY}</div><div class="qc-doll">${doll}</div></div>
          <div class="qc-right">
            <div class="qc-msgs xp-scroll"></div>
            <div class="qc-toolbar">
              <button class="qc-tool" data-act="emoji">表情</button>
              <button class="qc-tool" data-act="font" title="彩色字体要会员，你还没舍得开">字体</button>
              <button class="qc-tool" data-act="shake" title="窗口抖动（QQ2007 II Beta1 新功能）">抖动</button>
              ${reportBtn}
            </div>
            <textarea class="qc-input" placeholder=""></textarea>
            <div class="qc-sendrow">
              <span class="qc-hint">按 Enter 发送 · 输入 /微笑 试试表情代码</span>
              <button class="xp-btn qc-send">发送(S)</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function openChat(f) {
    if (!f) return;
    const id = 'qqchat-' + f.id;
    if (WM.wins[id]) { WM.focus(id); return; }
    WM.open({
      id: id,
      title: displayName(f) + ' - 腾讯QQ2007',
      icon: ICONS.qq, w: 500, h: 420,
      content: chatHTML(f),
      onOpen: function (rec) { bindChat(rec, f); renderRecs(f.id); clearUnread(f.id); },
    });
  }

  function renderRecs(id) {
    const win = WM.wins['qqchat-' + id] || WM.wins['qqgrp-' + id];
    if (!win) return;
    const box = win.body.querySelector('.qc-msgs');
    box.innerHTML = (S.recs[id] || []).map(lineHTML).join('');
    box.scrollTop = box.scrollHeight;
  }

  function bindChat(rec, f) {
    const input = rec.body.querySelector('.qc-input');
    const send = rec.body.querySelector('.qc-send');
    const toolbar = rec.body.querySelector('.qc-toolbar');

    function doSend() {
      const t = input.value.replace(/\s+$/, '');
      if (!t) return;
      input.value = '';
      addRec(f.id, 'me', ME.nick, t);
      clearUnread(f.id);
      advanceBot(f.id);
    }
    send.addEventListener('click', doSend);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
    });

    /* 工具栏：表情面板 / 抖动 / 举报 */
    toolbar.addEventListener('click', function (e) {
      const btn = e.target.closest('.qc-tool');
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'emoji') toggleEmoji(rec, input);
      else if (act === 'shake') doShake(rec, f);
      else if (act === 'report') reportScam(rec, f);
    });
  }

  /* 表情面板（小黄脸默认表情，§8.4：2007 处于「经典黄脸」阶段） */
  function toggleEmoji(rec, input) {
    let pal = rec.body.querySelector('.qc-emoji');
    if (pal) { pal.remove(); return; }
    pal = document.createElement('div');
    pal.className = 'qc-emoji';
    EMOJI.forEach(function (em) {
      const d = document.createElement('div');
      d.title = em.c;
      d.innerHTML = em.s;
      d.addEventListener('click', function () {
        input.value += em.c;
        input.focus();
        pal.remove();
      });
      pal.appendChild(d);
    });
    rec.body.querySelector('.qc-toolbar').appendChild(pal);
  }

  /* 窗口抖动（QQ2007 II Beta1，2007-10 引入 §8.3）：窗口 shake + 对方回一句 */
  function doShake(rec, f) {
    rec.el.classList.remove('qq-shake');
    void rec.el.offsetWidth; /* 重启动画 */
    rec.el.classList.add('qq-shake');
    setTimeout(function () { rec.el.classList.remove('qq-shake'); }, 700);
    addRec(f.id, 'sys', '', '您向对方发送了一个窗口抖动。');
    /* 对方已经下线（如林晓说完晚安就下了）：只留离线消息，不再回话
       ——2007 年离线消息由服务器转发，上线后才看得到 */
    const sc = D.scripts[f.id];
    if (f.status === 'offline' && sc && sc.offlineAfter && S.afterSaid[f.id]) {
      addRec(f.id, 'sys', '', '对方不在线，抖动将在对方下次登录时送达。');
      return;
    }
    if (f.id === 'scam' && S.scamReported) return; /* 被举报的骗子不再回话 */
    const reply = (sc && sc.shakeReply) || rnd(['抖虾米抖啦 呵呵', '干嘛抖偶，7456', '汗，被你抖晕了', '抖偶干嘛，有话快说']);
    scheduleIncoming(f.id, reply, 2000 + Math.random() * 2000);
  }

  /* 盗号举报（§12：2007 年盗号生态；举报后骗子闭嘴跑路） */
  function reportScam(rec, f) {
    if (S.scamReported) {
      addRec(f.id, 'sys', '', '您已举报过该号码。');
      return;
    }
    S.scamReported = true;
    sndCough(); /* 系统消息音（§8.2） */
    addRec(f.id, 'sys', '', '您已对该号码发起举报。若核实存在欺诈行为，腾讯公司将另行处理。');
    f.status = 'offline';
    renderList();
    WM.balloon({ title: 'QQ2007', text: '举报已提交。遇到「帮忙充话费」一律先打电话确认——声音不可伪装。', icon: ICONS.qq, timeout: 7000 });
  }

  /* ============ 自动回复引擎 ============ */
  function scheduleIncoming(id, text, delay) {
    setTimeout(function () { incoming(id, text); }, delay);
  }
  /* 一组剧本行按间隔依次发出（打字慢/分句短发是 2007 节奏规范 §8.7） */
  function playLines(id, lines) {
    let t = 1200 + Math.random() * 1500; /* 首条延迟 1.5–4s 量级 */
    lines.forEach(function (ln) {
      t += ln.d;
      scheduleIncoming(id, ln.t, t);
    });
  }

  function advanceBot(id) {
    const sc = D.scripts[id];
    if (id === 'scam' && S.scamReported) return;      /* 被举报的骗子不再回话 */
    if (sc) {
      if (S.stopped[id]) return;                       /* 886 之后不再纠缠 */
      const pos = S.steps[id] || 0;
      if (pos < sc.steps.length) {
        S.steps[id] = pos + 1;
        playLines(id, sc.steps[pos]);
        /* 林晓：剧本最后一组说完就下线（头像变灰——她真的下了） */
        if (pos === sc.steps.length - 1 && sc.offlineAfter) {
          setTimeout(function () {
            const f = friendById(id);
            if (f && f.status !== 'offline') { f.status = 'offline'; renderList(); }
          }, 14000);
        }
      } else if (sc.after && !S.afterSaid[id]) {
        S.afterSaid[id] = true;
        scheduleIncoming(id, sc.after, 2500);
        if (sc.offlineAfter || id === 'liqiang') S.stopped[id] = true;
      } else {
        scheduleIncoming(id, rnd(D.genericBye), 2500);
      }
      return;
    }
    /* 普通好友：通用回复池，两三个来回后 886（slang core 词条） */
    const n = (S.genCnt[id] = (S.genCnt[id] || 0) + 1);
    if (n <= 2) scheduleIncoming(id, rnd(D.genericReplies), 1500 + Math.random() * 2500);
    else if (n === 3) scheduleIncoming(id, rnd(D.genericBye), 2000 + Math.random() * 2000);
    /* n>3 之后：沉默（人家真的下了） */
  }

  /* ============ 群聊窗口（§9：班级/DOTA/老乡三类群） ============ */
  function groupHTML(q) {
    return `
      <div class="qqchat">
        <div class="qc-top">
          <div class="qq-ava"><svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="32" height="24" rx="3" fill="#7ba2e7" stroke="#3a6ea5"/><circle cx="14" cy="18" r="4" fill="#ffe9c9"/><circle cx="26" cy="18" r="4" fill="#ffe9c9"/><circle cx="14" cy="26" r="4" fill="#ffe9c9"/><circle cx="26" cy="26" r="4" fill="#ffe9c9"/><circle cx="20" cy="22" r="5" fill="#fff" stroke="#3a6ea5"/></svg></div>
          <div>
            <div><span class="qc-nick">${esc(q.name)}</span> <span style="color:#888;font-size:11px">(${esc(q.num)})</span></div>
            <div class="qc-sig">公告：${esc(q.notice)}</div>
          </div>
        </div>
        <div class="qc-main">
          <div class="qc-right" style="width:100%">
            <div class="qc-msgs xp-scroll"></div>
            <div class="qc-toolbar"><button class="qc-tool" data-act="emoji">表情</button></div>
            <textarea class="qc-input" placeholder=""></textarea>
            <div class="qc-sendrow">
              <span class="qc-hint">群里说话 · 潜水是默认礼仪</span>
              <button class="xp-btn qc-send">发送(S)</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function openGroup(q) {
    const id = 'qqgrp-' + q.id;
    if (WM.wins[id]) { WM.focus(id); return; }
    if (!S.recs[q.id]) {
      /* 群消息历史：开场先来一条系统行 + 既有消息 */
      S.recs[q.id] = [];
      addRec(q.id, 'sys', '', '—— 已加载 ' + q.msgs.length + ' 条群消息 ——');
      q.msgs.forEach(function (m) {
        S.recs[q.id].push({ who: 'them', name: m.who, text: m.t, tm: m.tm });
      });
    }
    WM.open({
      id: id, title: q.name + ' - 腾讯QQ2007', icon: ICONS.qq, w: 470, h: 400,
      content: groupHTML(q),
      onOpen: function (rec) {
        renderRecs(q.id);
        const input = rec.body.querySelector('.qc-input');
        const send = rec.body.querySelector('.qc-send');
        const doSend = function () {
          const t = input.value.replace(/\s+$/, '');
          if (!t) return;
          input.value = '';
          addRec(q.id, 'me', ME.nick, t);
          /* 群里冒泡：随机一位常说话的群友接一句（无 @ 功能——2007 还没有 §9.2） */
          const speakers = q.msgs.map(function (m) { return m.who; });
          const who = rnd(speakers);
          const reply = rnd(D.qunReplies);
          setTimeout(function () {
            addRec(q.id, 'them', who, reply);
            sndMsg();
          }, 1500 + Math.random() * 2500);
        };
        send.addEventListener('click', doSend);
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
        });
        rec.body.querySelector('.qc-toolbar').addEventListener('click', function (e) {
          if (e.target.closest('.qc-tool')) toggleEmoji(rec, input);
        });
      },
    });
  }

  /* ============ QQ 空间摘要卡片（§10：博客+留言板+花藤，无社交游戏） ============ */
  function openQzone() {
    if (WM.wins['qq-qzone']) { WM.focus('qq-qzone'); return; }
    const z = D.qzone;
    const blogs = z.blogs.map(function (b) {
      return '· <span class="zz-t">' + esc(b.title) + '</span>（' + b.date + '，阅读 ' + b.reads + ' / 评论 ' + b.comments + '）';
    }).join('<br>');
    const board = z.msgboard.map(function (m) {
      return '<b>' + esc(m.who) + '</b>：' + esc(m.t) + ' <span style="color:#999">' + esc(m.tm) + '</span>';
    }).join('<br>');
    WM.open({
      id: 'qq-qzone', title: ME.nick + ' 的QQ空间 - 腾讯QQ2007', icon: ICONS.qq, w: 330, h: 400,
      content: `
        <div class="qqzone">
          <h4>${esc(ME.nick)} 的空间　<span style="font-size:11px;color:#999">小窝模式</span></h4>
          <div class="zz-sec">今日被踩 <b class="zz-t">${z.todayVisits}</b> 次　人气值 <b class="zz-t">${z.popularity}</b><br>
          花藤：${esc(z.flower)}<br><span style="color:#999;font-size:11px">（给花藤浇浇水，指数才会涨）</span></div>
          <div class="zz-sec"><b>留言板（${z.msgboard.length}）</b><br>${board}</div>
          <div class="zz-sec"><b>日志（${z.blogs.length}）</b><br>${blogs}</div>
          <div style="color:#999;font-size:11px;line-height:1.6">跑堂可耻，回踩光荣。访客脚印公开可查，「谁看过我」是社交侦查利器。</div>
        </div>`,
    });
  }

  /* ============ 托盘交互（左键唤出面板 / 右键静音） ============ */
  function bindTray() {
    const t = document.getElementById('tray-qq');
    if (!t) return;
    t.addEventListener('click', function () {
      if (WM.wins['qq-main']) WM.focus('qq-main');
      else launch();
    });
    t.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      showCtxMenu(e.clientX, e.clientY, [
        { text: S.muted ? '开启提示音' : '关闭提示音', action: function () { S.muted = !S.muted; } },
        { text: S.myst === 'hidden' ? '上线' : '隐身', action: function () { toggleMyStatus(); } },
        '-',
        { text: '退出(Q)', disabled: true },
      ]);
    });
  }
  function toggleMyStatus() {
    S.myst = S.myst === 'hidden' ? 'online' : 'hidden';
    const el = document.getElementById('qq-myst');
    if (el) el.textContent = '［' + (S.myst === 'hidden' ? '隐身' : '在线') + '］';
    const win = WM.wins['qq-main'];
    if (win) WM.setTitle('qq-main', '腾讯QQ2007 - ' + ME.remark + (S.myst === 'hidden' ? ' [隐身]' : ' [在线]'));
    const t = document.getElementById('tray-qq');
    if (t) t.title = '腾讯QQ2007 - 张伟 [' + (S.myst === 'hidden' ? '隐身' : '在线') + ']';
  }

  /* ============ 自动登录（开机 = 上线，§3.5） ============ */
  function autoLogin() {
    if (S.inited) return;
    S.inited = true;
    ensureAC();
    bindTray();

    const loginHTML = `
      <div class="qq-login">
        <div class="lgp">${ICONS.qq}</div>
        <div style="font-size:15px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,.4)">QQ2007</div>
        <div style="font-size:12px">${esc(ME.qq)}　${esc(ME.nick)}</div>
        <div class="qq-lgbar"><i id="qq-lgfill"></i></div>
        <div class="qq-lgst" id="qq-lgst">正在连接服务器...</div>
        <div style="font-size:11px;opacity:.8">√ 记住密码　√ 隐身登录</div>
      </div>`;
    WM.open({
      id: 'qq-login', title: '用户登录', icon: ICONS.qq, w: 340, h: 210,
      content: loginHTML,
      onOpen: function () {
        const st = document.getElementById('qq-lgst');
        const fill = document.getElementById('qq-lgfill');
        setTimeout(function () { fill.style.width = '35%'; }, 100);
        setTimeout(function () { st.textContent = '正在验证密码...'; fill.style.width = '65%'; }, 900);
        setTimeout(function () { st.textContent = '登录成功，正在加载好友列表...'; fill.style.width = '96%'; }, 1800);
        setTimeout(function () {
          WM.close('qq-login');
          launch();
          /* 上线提示音：滴滴滴滴滴滴（persona.js DAY_TIMELINE「21:07 …滴滴滴滴滴滴」）
             音效语义全表见 research/qq.md §8.2：滴=新消息 / 咳嗽=系统消息 / 敲门=好友上线 */
          sndMsg();
          WM.balloon({ title: 'QQ2007', text: '您已成功登录，2 位好友正在找你。', icon: ICONS.qq, timeout: 6000 });
          scheduleNight();
        }, 2700);
      },
    });
  }

  /* ============ 今晚的剧本时间线（2007-10-17 21:07 之后） ============ */
  function scheduleNight() {
    /* 李强：网吧等开黑，最先跳出来 */
    setTimeout(function () { playOpening('liqiang'); }, 14000);
    /* 王芳：校内网互助请求 */
    setTimeout(function () { playOpening('wangfang'); }, 34000);
    /* 陌生号：盗号骗局先「咳嗽」一声（系统消息感），再上钩子（§12.1） */
    setTimeout(function () { sndCough(); playOpening('scam'); }, 52000);
    /* 老妈：打字很慢，消息断断续续 */
    setTimeout(function () { playOpening('mama'); }, 74000);
    /* 林晓：一分半后从隐身转上线——敲门声 + 头像闪 + 托盘气泡（场景 2 的心跳时刻） */
    setTimeout(function () {
      if (S.linxiaoOnlined) return;
      S.linxiaoOnlined = true;
      const f = friendById('linxiao');
      if (!f) return;
      f.status = 'online';
      sndKnock();
      renderList();
      /* 上线闪几秒（无消息不常亮，只提示「她来了」） */
      S.unread['linxiao'] = 0;
      const row = document.querySelector('.qq-friend[data-fid="linxiao"]');
      if (row) {
        row.classList.add('unread');
        setTimeout(function () { row.classList.remove('unread'); }, 4200);
      }
      WM.balloon({ title: 'QQ2007', text: '您的好友「林晓」上线了。', icon: ICONS.qq, timeout: 5000 });
    }, 95000);
  }
  function playOpening(id) {
    const sc = D.scripts[id];
    if (!sc || !sc.opening.length) return;
    let t = 300;
    sc.opening.forEach(function (ln) {
      t += ln.d;
      scheduleIncoming(id, ln.t, t);
    });
  }

  /* ============ 应用注册 ============ */
  window.APPS = window.APPS || {};
  APPS.qq = {
    title: '腾讯QQ',
    icon: ICONS.qq,
    desktop: true,
    startMenu: true,
    order: 2,
    launch: launch,
    autoLogin: autoLogin,
  };
})();
