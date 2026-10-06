/* ============================================================
   apps/phone.js —— 诺基亚 5300 模拟器（XP 桌面上浮起手机机身）
   造型依据 research/hardware.md §2.2：红色滑盖、2 寸 QVGA、
   音乐快捷键 + 数字键盘。S40 界面：待机 → 九宫格主菜单。
   ============================================================ */

(function () {

  /* ---- 手机机身与屏幕样式（一次性注入） ---- */
  const CSS = `
  .ph-wrap { width:100%; height:100%; display:flex; align-items:center; justify-content:center;
             background:linear-gradient(180deg,#8b8378,#6f6a61); padding:6px 0; }
  .ph-body { width:242px; height:436px; position:relative; flex:none;
             background:linear-gradient(160deg,#d4342a 0%,#b3271e 45%,#8e1d15 100%);
             border-radius:18px 18px 26px 26px;
             box-shadow:inset 0 1px 2px rgba(255,255,255,.35), 0 4px 10px rgba(0,0,0,.5);
             border:2px solid #6d130c; }
  .ph-nokia { position:absolute; top:7px; left:0; right:0; text-align:center;
              font:bold 11px Tahoma,sans-serif; color:#f5e6d8; letter-spacing:2px;
              text-shadow:0 1px 1px rgba(0,0,0,.6); }
  .ph-xpress { position:absolute; top:22px; left:0; right:0; text-align:center;
               font:italic 8px Tahoma,sans-serif; color:#e8b7a8; }
  .ph-screen { position:absolute; top:33px; left:11px; width:218px; height:180px;
               background:#0a1c12; border-radius:3px; overflow:hidden;
               border:3px solid #1a1a1a; box-shadow:inset 0 0 8px rgba(0,0,0,.9);
               font-family:"SimSun","宋体",Tahoma,sans-serif; color:#e8f4e8; cursor:default; }
  .ph-scr { position:absolute; inset:0; display:flex; flex-direction:column; }
  .ph-status { flex:none; height:16px; display:flex; align-items:center; gap:4px;
               padding:0 5px; background:#123a1f; font-size:9px; }
  .ph-status .op { flex:1; text-align:center; letter-spacing:1px; }
  .ph-main { flex:1; overflow:hidden; position:relative; }
  .ph-soft { flex:none; height:16px; display:flex; align-items:center;
             background:#123a1f; font-size:9px; }
  .ph-soft span { flex:1; padding:0 6px; cursor:default; }
  .ph-soft span.r { text-align:right; }
  .ph-soft span:hover { color:#fff; }
  .ph-title { background:#1e5c8a; color:#fff; font-size:10px; padding:2px 5px; flex:none; }
  .ph-list { flex:1; overflow:auto; font-size:11px; }
  .ph-list::-webkit-scrollbar { width:6px; } .ph-list::-webkit-scrollbar-thumb { background:#2c6e2c; }
  .ph-item { padding:3px 6px; border-bottom:1px solid #1d3a24; white-space:nowrap; overflow:hidden;
             text-overflow:ellipsis; }
  .ph-item:hover, .ph-item.sel { background:#2a7a3a; color:#fff; }
  .ph-item .sm { color:#8fbf95; font-size:9px; float:right; }
  .ph-body .ph-menu { position:absolute; inset:0; padding:8px 6px 4px;
                      display:grid; grid-template-columns:1fr 1fr 1fr; grid-auto-rows:1fr; gap:2px; }
  .ph-app { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;
            font-size:10px; border-radius:4px; padding:2px; color:#dff0df; cursor:default; }
  .ph-app svg { width:26px; height:26px; }
  .ph-app.sel { background:#2a7a3a; outline:1px solid #6fd07f; }
  .ph-app .lbl { white-space:nowrap; }
  .ph-idle { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center;
             padding-top:14px; background:radial-gradient(circle at 50% 30%,#123a1f,#081c0e); }
  .ph-clock { font:bold 30px "Courier New",monospace; letter-spacing:2px; }
  .ph-date { font-size:10px; color:#9fd8a8; margin-top:2px; }
  .ph-brand { margin-top:14px; font-size:10px; color:#cfe9d2; letter-spacing:1px; }
  .ph-hint { margin-top:auto; margin-bottom:6px; font-size:9px; color:#79a87e; }
  .ph-pad { position:absolute; top:222px; left:12px; right:12px; height:64px; }
  .ph-musickeys { position:absolute; top:220px; left:40px; right:40px; display:flex; gap:8px; }
  .ph-mk { width:24px; height:12px; border-radius:6px; background:linear-gradient(180deg,#e8e2d2,#a9a190);
           border:1px solid #6d130c; cursor:default; }
  .ph-mk:hover { filter:brightness(1.15); }
  .ph-nav { position:absolute; top:224px; left:14px; width:64px; height:56px; }
  .ph-nav .ring { position:absolute; left:8px; top:8px; width:48px; height:40px; border-radius:50%;
                  background:linear-gradient(180deg,#d8d2c2,#8f887a); border:1px solid #5a4a3a;
                  box-shadow:inset 0 1px 3px rgba(255,255,255,.6); }
  .ph-nav .nup,.ph-nav .ndown { position:absolute; width:22px; height:12px; background:#c9c2b2; }
  .ph-nav .nup { left:21px; top:0; clip-path:polygon(50% 0,100% 100%,0 100%); }
  .ph-nav .ndown { left:21px; bottom:0; clip-path:polygon(0 0,100% 0,50% 100%); }
  .ph-nav .nleft { position:absolute; left:0; top:17px; width:12px; height:22px;
                   clip-path:polygon(0 50%,100% 0,100% 100%); background:#c9c2b2; }
  .ph-nav .nright { position:absolute; right:0; top:17px; width:12px; height:22px;
                    clip-path:polygon(0 0,100% 50%,0 100%); background:#c9c2b2; }
  .ph-nav .nkey { cursor:default; } .ph-nav .nkey:active { filter:brightness(.85); }
  .ph-softarea { position:absolute; top:288px; left:12px; right:12px; height:44px; display:flex;
                 align-items:center; justify-content:space-between; gap:10px; }
  .ph-sbtn { width:70px; height:26px; border-radius:8px; cursor:default;
             background:linear-gradient(180deg,#e8e2d2,#a9a190); border:1px solid #6d130c;
             font-size:10px; text-align:center; line-height:24px; color:#4a3b2a; }
  .ph-sbtn:active { filter:brightness(.85); }
  .ph-callkeys { position:absolute; top:288px; right:14px; display:flex; gap:6px; }
  .ph-keypad { position:absolute; top:332px; left:14px; right:14px; display:grid;
               grid-template-columns:1fr 1fr 1fr; gap:4px 6px; }
  .ph-key { height:23px; border-radius:5px; background:linear-gradient(180deg,#3a3a3a,#1c1c1c);
            color:#eee; font-size:10px; display:flex; align-items:center; justify-content:center;
            border:1px solid #000; cursor:default; text-shadow:0 1px 1px #000; }
  .ph-key small { color:#9a9a9a; margin-left:3px; font-size:8px; }
  .ph-key:active { background:linear-gradient(180deg,#1c1c1c,#3a3a3a); }
  .ph-key.side { width:100%; background:linear-gradient(180deg,#5a5a5a,#2c2c2c); }
  .ph-dial-strip { position:absolute; top:306px; left:16px; right:16px; height:18px;
                   font:bold 14px "Courier New",monospace; color:#ffd9a8; text-align:right;
                   letter-spacing:2px; text-shadow:0 0 4px rgba(255,150,50,.4); }
  .ph-wap { position:absolute; inset:0; overflow:auto; background:#fff; color:#1a3a8a;
            font-size:11px; padding:0 0 8px; }
  .ph-wap::-webkit-scrollbar { width:6px; } .ph-wap::-webkit-scrollbar-thumb { background:#3a6ea5; }
  .ph-wap .w-head { background:linear-gradient(180deg,#2a6bd6,#1a4a9e); color:#fff; padding:3px 6px;
                    font-size:10px; display:flex; justify-content:space-between; }
  .ph-wap .w-banner { margin:6px; height:34px; background:repeating-linear-gradient(45deg,#e8eef8,#d8e2f4 8px);
                      display:flex; align-items:center; justify-content:center; color:#8898b8;
                      font-size:10px; border:1px solid #c0cce0; }
  .ph-wap .w-sec { margin:4px 6px; padding:3px 6px; background:#eef3fc; border:1px solid #cdd9ee; }
  .ph-wap .w-sec b { font-size:10px; color:#c04a00; }
  .ph-wap a { color:#1a3a8a; text-decoration:underline; cursor:default; display:block; padding:1px 0; }
  .ph-wap a:hover { color:#c04a00; }
  .ph-qq { position:absolute; inset:0; display:flex; flex-direction:column; background:#eef4f0; color:#222; }
  .ph-qq .q-head { background:linear-gradient(180deg,#3a8ade,#1a5a9e); color:#fff; padding:3px 6px;
                   font-size:10px; flex:none; }
  .ph-qq .q-body { flex:1; overflow:auto; font-size:11px; }
  .ph-qq .q-msg { padding:2px 8px; margin:2px 4px; border-radius:4px; max-width:78%; font-size:11px; }
  .ph-qq .q-msg.me { background:#bfe0a8; margin-left:auto; }
  .ph-qq .q-msg.her { background:#fff; border:1px solid #ccc; }
  .ph-qq .q-msg .mt { display:block; font-size:8px; color:#888; }
  .ph-qq .q-typing { font-size:9px; color:#888; padding:0 10px; height:14px; }
  .ph-qq .q-replies { display:flex; flex-wrap:wrap; gap:3px; padding:3px 6px; flex:none;
                      background:#dde7e0; }
  .ph-qq .q-replies span { border:1px solid #9ab8a8; background:#fff; border-radius:8px;
                            padding:1px 7px; font-size:10px; cursor:default; }
  .ph-qq .q-replies span:hover { background:#bfe0a8; }
  .ph-now { position:absolute; inset:0; background:linear-gradient(180deg,#0e2416,#081c0e);
            color:#cfe9d2; padding:10px 8px; font-size:11px; }
  .ph-now .nm { font-size:13px; color:#fff; }
  .ph-prog { height:6px; background:#123a1f; border:1px solid #2c6e2c; margin:8px 0; }
  .ph-prog i { display:block; height:100%; background:linear-gradient(90deg,#3a9a4a,#7fd98a); }
  .ph-dialog { position:absolute; inset:0; background:rgba(6,20,12,.92); display:flex;
               flex-direction:column; align-items:center; justify-content:center; gap:8px;
               font-size:11px; text-align:center; padding:10px; }
  .ph-dialog .ph-btn { padding:2px 14px; background:linear-gradient(180deg,#3a8ade,#1a5a9e);
                       color:#fff; border-radius:4px; font-size:11px; cursor:default; }
  `;

  /* ---- 小图标（SVG，S40 风格像素感） ---- */
  const MI = {
    sms: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="1" fill="#f4e6b8" stroke="#8a763a"/><path d="M3 6 L12 13 L21 6" fill="none" stroke="#8a763a" stroke-width="1.4"/></svg>',
    contacts: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="17" rx="2" fill="#d8e8f8" stroke="#4a6a9e"/><circle cx="12" cy="10" r="3" fill="#4a86c8"/><path d="M6 19 Q7 14.5 12 14.5 Q17 14.5 18 19 Z" fill="#4a86c8"/></svg>',
    music: '<svg viewBox="0 0 24 24"><path d="M9 17 V6 L18 4 V15" fill="none" stroke="#f2c14e" stroke-width="2"/><circle cx="7" cy="17.5" r="2.6" fill="#f2c14e"/><circle cx="16" cy="15.5" r="2.6" fill="#f2c14e"/></svg>',
    camera: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="2" fill="#9aa6b2" stroke="#4a5560"/><circle cx="12" cy="13" r="4" fill="#22303c"/><rect x="9" y="4" width="6" height="3" rx="1" fill="#4a5560"/></svg>',
    game: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="11" rx="3" fill="#c86a6a" stroke="#6e2a2a"/><path d="M7 10 v5 M4.5 12.5 h5" stroke="#fff" stroke-width="1.6"/><circle cx="16" cy="11" r="1.4" fill="#fff"/><circle cx="18.5" cy="14" r="1.4" fill="#fff"/></svg>',
    net: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#2a6bd6"/><ellipse cx="12" cy="12" rx="3.6" ry="8.5" fill="none" stroke="#fff" stroke-width="1.2"/><path d="M4 12 h16 M6 7.5 Q12 10.5 18 7.5 M6 16.5 Q12 13.5 18 16.5" stroke="#fff" stroke-width="1" fill="none"/></svg>',
    qq: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="14" rx="7" ry="8" fill="#1a1a1a"/><ellipse cx="12" cy="16" rx="4.4" ry="5" fill="#fff"/><ellipse cx="12" cy="6.5" rx="5.4" ry="4.6" fill="#1a1a1a"/><circle cx="10" cy="6" r="1.1" fill="#fff"/><circle cx="14" cy="6" r="1.1" fill="#fff"/><path d="M6 9.5 Q12 6.5 18 9.5 Q18 11.5 12 10.6 Q6 11.5 6 9.5" fill="#e03a3a"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.4" fill="#cfd8dc" stroke="#5a6a74"/><g stroke="#5a6a74" stroke-width="2"><path d="M12 2 v3.5 M12 18.5 V22 M2 12 h3.5 M18.5 12 H22 M5 5 l2.4 2.4 M16.6 16.6 L19 19 M19 5 l-2.4 2.4 M7.4 16.6 L5 19"/></g></svg>',
    calls: '<svg viewBox="0 0 24 24"><path d="M6 3 Q4 3 4 6 Q4 14 10 19.5 Q14 23 18 20 L20 18 L16 14 L13.5 16 Q10.5 14.5 9 11.5 L11 9 L7 5 Z" fill="#4a9a5a" stroke="#1e5a2a"/></svg>',
  };

  const MENU = [
    { k: 'sms',      label: '信息' },
    { k: 'contacts', label: '通讯录' },
    { k: 'music',    label: '音乐' },
    { k: 'qq',       label: '手机QQ' },
    { k: 'net',      label: '移动梦网' },
    { k: 'camera',   label: '照相机' },
    { k: 'game',     label: '游戏' },
    { k: 'calls',    label: '通话记录' },
    { k: 'settings', label: '设置' },
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---- 主控制器 ---- */
  function Phone(rec) {
    this.rec = rec;
    this.screen = rec.body.querySelector('.ph-screen');
    this.dial = '';
    this.menuIdx = 0;
    this.smsIdx = -1;
    this.contactIdx = -1;
    this.songIdx = 0;
    this.playing = false;
    this.playT = 0;
    this.qqView = 'login';
    this.typingTimer = null;
    this.clockTimer = null;
    rec.el.addEventListener('mousedown', (e) => e.stopPropagation());
    this.bindKeys();
    this.go('idle');
  }

  Phone.prototype = {

    /* ============ 状态栏 / 软键（所有屏共用） ============ */
    chrome(softL, softR, mainHTML, title) {
      const p = (n) => String(n).padStart(2, '0');
      const d = (window.Tray && Tray.fakeNow) ? Tray.fakeNow : new Date(2007, 9, 17, 23, 10);
      this.screen.innerHTML = `
        <div class="ph-scr">
          ${title ? `<div class="ph-title">${title}</div>` : ''}
          <div class="ph-status">
            <svg width="14" height="10" viewBox="0 0 14 10"><g fill="#7fd98a"><rect x="0" y="6" width="2.5" height="4"/><rect x="3.5" y="4" width="2.5" height="6"/><rect x="7" y="2" width="2.5" height="8"/><rect x="10.5" y="0" width="2.5" height="10"/></g></svg>
            <span class="op">${PHONE_DATA.device.operator}</span>
            <svg width="16" height="9" viewBox="0 0 16 9"><rect x="0.5" y="0.5" width="13" height="8" rx="1" fill="none" stroke="#7fd98a"/><rect x="2" y="2" width="8" height="5" fill="#7fd98a"/><rect x="14" y="2.5" width="1.5" height="4" fill="#7fd98a"/></svg>
          </div>
          <div class="ph-main">${mainHTML}</div>
          <div class="ph-soft">
            <span class="l">${softL || ''}</span><span class="r">${softR || ''}</span>
          </div>
        </div>`;
      const sl = this.screen.querySelector('.ph-soft .l');
      const sr = this.screen.querySelector('.ph-soft .r');
      if (softL && this.softL) sl.addEventListener('click', () => this.softL());
      if (softR && this.softR) sr.addEventListener('click', () => this.softR());
      if (this.onRender) this.onRender();
    },

    /* ============ 各屏幕 ============ */
    go(view, arg) {
      clearInterval(this.clockTimer);
      this.view = view;
      this.onRender = null;
      this.softL = null; this.softR = null;
      this['v_' + view] && this['v_' + view](arg);
    },

    /* ---- 待机 ---- */
    v_idle() {
      const p = (n) => String(n).padStart(2, '0');
      const self = this;
      this.softL = () => this.go('menu');
      this.softR = () => this.go('contacts');
      this.chrome('功能表', '电话本', `
        <div class="ph-idle">
          <div class="ph-clock" id="ph-clock"></div>
          <div class="ph-date" id="ph-date"></div>
          <div class="ph-brand">动感地带 M-ZONE</div>
          <div class="ph-hint">按功能表键进入主菜单</div>
        </div>`);
      const tick = () => {
        const d = (window.Tray && Tray.fakeNow) ? Tray.fakeNow : new Date(2007, 9, 17, 23, 10);
        const c = this.screen.querySelector('#ph-clock');
        if (c) c.textContent = p(d.getHours()) + ':' + p(d.getMinutes());
        const dt = this.screen.querySelector('#ph-date');
        if (dt) dt.textContent = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} 星期${'日一二三四五六'[d.getDay()]}`;
      };
      tick();
      this.clockTimer = setInterval(tick, 3000);
    },

    /* ---- 主菜单（九宫格） ---- */
    v_menu() {
      this.softL = () => this.go('idle');
      this.softR = () => this.go('idle');
      this.chrome('选择', '退出', `<div class="ph-menu" id="ph-menu"></div>`);
      const box = this.screen.querySelector('#ph-menu');
      MENU.forEach((m, i) => {
        const d = document.createElement('div');
        d.className = 'ph-app' + (i === this.menuIdx ? ' sel' : '');
        d.innerHTML = MI[m.k === 'net' ? 'net' : m.k] + `<span class="lbl">${m.label}</span>`;
        d.addEventListener('click', () => { this.menuIdx = i; this.openApp(m.k); });
        box.appendChild(d);
      });
    },

    openApp(k) {
      const map = { sms: 'sms', contacts: 'contacts', music: 'music', qq: 'qq',
        net: 'wap', camera: 'camera', game: 'games', calls: 'calls', settings: 'settings' };
      this.go(map[k] || 'menu');
    },

    /* ---- 短信 ---- */
    v_sms() {
      this.softL = () => this.go('menu');
      this.softR = () => this.go('sms', );
      const rows = PHONE_DATA.sms.map((s, i) =>
        `<div class="ph-item" data-i="${i}" style="${s.unread ? 'font-weight:bold' : ''}">
          ${s.unread ? '✉ ' : ''}${esc(s.from)}<span class="sm">${s.time}</span></div>`).join('');
      this.chrome('返回', '查看', `<div class="ph-list">${rows || '<div class="ph-item">（空）</div>'}</div>`, '信息 ‖ 收件箱');
      this.screen.querySelectorAll('.ph-item[data-i]').forEach(el => {
        el.addEventListener('click', () => this.go('smsread', +el.dataset.i));
      });
    },

    v_smsread(i) {
      const s = PHONE_DATA.sms[i];
      s.unread = false;
      this.softL = () => this.go('sms');
      this.softR = () => this.go('sms');
      this.chrome(s.from === '12530' ? '回复' : '回复', '返回', `
        <div style="position:absolute;inset:0;overflow:auto;padding:6px;font-size:11px;line-height:1.6;">
          <div style="text-align:center;color:#8fbf95;font-size:9px;">${esc(s.time)}</div>
          <div style="color:#cfe9d2;margin:4px 0;">发件人：${esc(s.from)}${s.num ? '（' + esc(s.num) + '）' : ''}</div>
          <div style="background:#12281a;padding:6px;border-radius:4px;color:#e8f4e8;">${esc(s.text)}</div>
          ${s.from === '12530' ? '<div style="color:#7a9a7f;font-size:9px;margin-top:4px;">回复 1 订购彩铃，2 元/首</div>' : ''}
        </div>`, '信息 ‖ 阅读');
      /* 回复 1 → 订购彩铃彩蛋 */
      if (s.from === '12530') {
        const rs = this.screen.querySelector('.ph-soft .l');
        const clone = rs.cloneNode(true);
        rs.replaceWith(clone);
        clone.addEventListener('click', () => this.orderRingtone());
      }
    },

    orderRingtone() {
      if (PHONE_DATA.device.balance < 2) {
        this.dialog('话费余额不足，无法订购彩铃。请充值后再试。');
        return;
      }
      PHONE_DATA.device.balance = Math.round((PHONE_DATA.device.balance - 2) * 100) / 100;
      PHONE_DATA.sms.unshift({
        from: '12530', time: '10-17 23:30',
        text: '您已成功订购彩铃《月亮之上》凤凰传奇，信息费2.00元，本月话费余额' +
          PHONE_DATA.device.balance.toFixed(2) + '元。感谢使用中国移动无线音乐服务。'
      });
      this.dialog('订购成功！已扣费 2.00 元。<br>当前余额 ' + PHONE_DATA.device.balance.toFixed(2) + ' 元。');
    },

    /* ---- 通讯录 ---- */
    v_contacts() {
      this.softL = () => this.go('idle');
      const rows = PHONE_DATA.contacts.map((c, i) =>
        `<div class="ph-item" data-i="${i}">○ ${esc(c.name)}<span class="sm">${esc(c.note)}</span></div>`).join('');
      this.chrome('返回', '详情', `<div class="ph-list">${rows}</div>`, '通讯录');
      this.screen.querySelectorAll('.ph-item[data-i]').forEach(el => {
        el.addEventListener('click', () => this.go('contact', +el.dataset.i));
      });
    },

    v_contact(i) {
      const c = PHONE_DATA.contacts[i];
      const self = this;
      this.softL = () => this.go('contacts');
      this.softR = () => this.dialNumber(c.num.replace(/\s/g, ''));
      this.chrome('返回', '呼叫', `
        <div style="position:absolute;inset:0;padding:10px;font-size:11px;line-height:2;">
          <div style="text-align:center;font-size:14px;color:#fff;">${esc(c.name)}</div>
          <div>号码：${esc(c.num)}</div>
          <div>备注：${esc(c.note)}</div>
          <div style="color:#8fbf95;font-size:9px;margin-top:6px;">左右软键：呼叫 / 返回</div>
        </div>`, '联系人');
    },

    v_calls() {
      this.softL = () => this.go('menu');
      this.chrome('返回', '', `
        <div class="ph-list">
          <div class="ph-item">拨出：1008611<span class="sm">10-17 18:02</span></div>
          <div class="ph-item">未接：林晓<span class="sm">10-17 21:47</span></div>
          <div class="ph-item">已接：老妈<span class="sm">10-14 20:11</span></div>
        </div>`, '通讯记录');
    },

    /* ---- 音乐播放器 ---- */
    v_music() {
      const s = PHONE_DATA.music.songs[this.songIdx];
      this.softL = () => this.go('menu');
      this.chrome('返回', '播放', `
        <div class="ph-now">
          <div style="font-size:9px;color:#7a9a7f;">${PHONE_DATA.music.storage} ‖ ${PHONE_DATA.music.songs.length} 首</div>
          <div class="nm" id="ph-song" style="margin-top:8px;">${esc(s.title)}</div>
          <div style="color:#9fd8a8;">${esc(s.artist)} ‖ 128kbps ‖ ${s.size}</div>
          <div class="ph-prog"><i id="ph-progbar" style="width:0%"></i></div>
          <div id="ph-pcount" style="font-family:'Courier New',monospace;">00:00</div>
          <div style="margin-top:10px;font-size:9px;color:#7a9a7f;">按播放键开始 ‖ 上/下换曲</div>
        </div>`, '音乐播放器');
      this.listSongs();
      if (this.playing) this.startPlay();
    },

    listSongs() {
      /* 主区叠加歌曲列表入口：点击歌名切歌 */
      const self = this;
      const main = this.screen.querySelector('.ph-main .ph-now');
      const list = document.createElement('div');
      list.style.cssText = 'position:absolute;bottom:6px;left:6px;right:6px;max-height:74px;overflow:auto;background:rgba(6,26,14,.7);border-radius:4px;font-size:10px;';
      list.innerHTML = PHONE_DATA.music.songs.map((s, i) =>
        `<div class="ph-item" data-i="${i}" style="${i === this.songIdx ? 'color:#7fd98a;font-weight:bold;' : ''}border-bottom-color:#1d3a24;">${esc(s.title)}<span class="sm">${esc(s.artist)}</span></div>`).join('');
      list.querySelectorAll('.ph-item').forEach(el => {
        el.addEventListener('click', () => {
          self.songIdx = +el.dataset.i;
          self.playT = 0;
          self.go('music');
          self.playing = true;
          self.startPlay();
        });
      });
      main.appendChild(list);
    },

    startPlay() {
      clearInterval(this.playTimer);
      const self = this;
      this.playTimer = setInterval(() => {
        self.playT += 1;
        const bar = self.screen.querySelector('#ph-progbar');
        const cnt = self.screen.querySelector('#ph-pcount');
        if (!bar) { clearInterval(self.playTimer); return; }
        bar.style.width = ((self.playT % 240) / 240 * 100) + '%';
        const m = String(Math.floor(self.playT / 60)).padStart(2, '0');
        const s2 = String(self.playT % 60).padStart(2, '0');
        cnt.textContent = m + ':' + s2;
      }, 1000);
    },

    togglePlay() {
      this.playing = !this.playing;
      if (this.view === 'music') {
        if (this.playing) this.startPlay();
        else clearInterval(this.playTimer);
      }
    },

    /* ---- 手机 QQ（Java 版） ---- */
    v_qq() {
      if (this.qqView === 'login') {
        this.softL = null; this.softR = null;
        this.chrome('', '', `
          <div class="ph-dialog">
            <div style="width:42px;height:42px;">${MI.qq}</div>
            <div style="font-size:12px;color:#fff;">手机QQ 2007</div>
            <div style="font-size:9px;color:#7a9a7f;">Java 版 ‖ GPRS 连接中…</div>
            <div class="ph-btn" id="ph-qqlogin">登录 (4128735**)</div>
            <div style="font-size:8px;color:#556a58;">GPRS 流量费由运营商收取</div>
          </div>`);
        this.screen.querySelector('#ph-qqlogin').addEventListener('click', () => {
          this.qqView = 'buddies';
          this.go('qq');
        });
      } else if (this.qqView === 'buddies') {
        this.softL = () => { this.qqView = 'login'; this.go('qq'); };
        this.softR = () => { this.qqView = 'chat'; this.go('qq'); };
        const q = PHONE_DATA.qq;
        const rows = q.buddies.map((b, i) => `
          <div class="ph-item" data-i="${i}" style="${b.online ? '' : 'color:#6a8a6e;'}">
            ${b.face === 'f' ? '♀' : b.face === 'g' ? '♀♀' : '♂'} ${esc(b.name)}
            <span class="sm">[${esc(b.status)}]</span></div>`).join('');
        this.chrome('注销', '聊天', `
          <div class="ph-qq">
            <div class="q-head">手机QQ ‖ ${esc(q.me.name)}（${esc(q.me.level)}）</div>
            <div class="q-body">${rows}</div>
          </div>`, '');
        this.screen.querySelectorAll('.ph-item[data-i]').forEach(el => {
          el.addEventListener('click', () => { this.qqView = 'chat'; this.go('qq'); });
        });
      } else {
        this.renderChat();
      }
    },

    renderChat() {
      const q = PHONE_DATA.qq;
      const self = this;
      this.softL = () => { this.qqView = 'buddies'; this.go('qq'); };
      this.chrome('返回', '', `
        <div class="ph-qq">
          <div class="q-head">与 林晓 聊天中</div>
          <div class="q-body" id="ph-chatbody"></div>
          <div class="q-typing" id="ph-typing"></div>
          <div class="q-replies" id="ph-replies"></div>
        </div>`);
      const body = this.screen.querySelector('#ph-chatbody');
      q.history.forEach(m => {
        const d = document.createElement('div');
        d.className = 'q-msg ' + (m.who === '我' ? 'me' : 'her');
        d.innerHTML = `<span class="mt">${m.t} ${m.who === '我' ? '我' : '林晓'}</span>${esc(m.text)}`;
        body.appendChild(d);
      });
      body.scrollTop = body.scrollHeight;
      const rep = this.screen.querySelector('#ph-replies');
      q.myReplies.forEach(txt => {
        const s = document.createElement('span');
        s.textContent = txt;
        s.addEventListener('click', () => {
          if (self.typingTimer) return;
          const now = new Date((window.Tray && Tray.fakeNow) || new Date(2007, 9, 18, 0, 40));
          const p = (n) => String(n).padStart(2, '0');
          const ts = p(now.getHours()) + ':' + p(now.getMinutes());
          q.history.push({ t: ts, who: '我', text: txt });
          self.renderChat();
          const typing = self.screen.querySelector('#ph-typing');
          if (typing) typing.textContent = '对方正在输入…';
          self.typingTimer = setTimeout(() => {
            self.typingTimer = null;
            const reply = q.herReplies[Math.floor(Math.random() * q.herReplies.length)];
            q.history.push({ t: ts, who: '她', text: reply });
            if (self.view === 'qq' && self.qqView === 'chat') self.renderChat();
          }, 1600 + Math.random() * 1400);
        });
        rep.appendChild(s);
      });
    },

    /* ---- WAP：移动梦网 ---- */
    v_wap() {
      const w = PHONE_DATA.wap;
      this.softL = () => this.go('menu');
      this.chrome('返回', '主页', `
        <div class="ph-wap">
          <div class="w-head"><span>${w.title}</span><span style="color:#a8c8f0;">GPRS</span></div>
          <div class="w-banner">［图片］</div>
          <div class="w-sec"><b>‣ 新闻</b>
            ${w.links.map(l => `<a>${l.text}${l.hint ? ' <small style="color:#c04a00;">' + l.hint + '</small>' : ''}</a>`).join('')}
          </div>
          <div class="w-sec"><b>‣ 精彩彩铃</b>
            ${w.ringtones.map((r, i) => `<a data-rt="${i}">♪ ${r.text} - ${r.singer} <small style="color:#c04a00;">${r.price}</small></a>`).join('')}
            <a>更多彩铃&gt;&gt;</a>
          </div>
          <div class="w-sec"><b>‣ 门户服务</b>
            ${w.other.map(o => `<a>${o}</a>`).join('')}
          </div>
          <div style="text-align:center;color:#8898b8;font-size:9px;padding:6px;">${w.url} ‖ 中国移动通信</div>
        </div>`);
      this.screen.querySelectorAll('a[data-rt]').forEach(a => {
        a.addEventListener('click', () => this.orderRingtone());
      });
    },

    /* ---- 照相机 ---- */
    v_camera() {
      this.softL = () => this.go('menu');
      this.chrome('返回', '拍照', `
        <div style="position:absolute;inset:0;background:
          repeating-linear-gradient(0deg,#1a2a20 0 2px,#223528 2px 4px);display:flex;
          align-items:center;justify-content:center;color:#7a9a7f;font-size:11px;">
          <div style="text-align:center;line-height:2;">
            <div style="border:1px dashed #4a6a52;padding:16px 22px;">取景框<br>130 万像素</div>
          </div>
        </div>`, '照相机');
      const rs = this.screen.querySelector('.ph-soft .r');
      rs.addEventListener('click', () => {
        this.dialog('存储卡空间不足，<br>无法保存照片。<br>请删除部分音乐后重试。');
      });
    },

    /* ---- 游戏 ---- */
    v_games() {
      this.softL = () => this.go('menu');
      const rows = PHONE_DATA.games.map(g =>
        `<div class="ph-item">▶ ${esc(g.name)}<span class="sm">${g.type}</span></div>`).join('');
      this.chrome('返回', '', `<div class="ph-list">${rows}
        <div style="padding:6px;font-size:9px;color:#7a9a7f;">更多游戏：发短信到 8616，2 元/条下载 Java 游戏</div></div>`, '游戏');
    },

    /* ---- 设置（话费彩蛋） ---- */
    v_settings() {
      this.softL = () => this.go('menu');
      this.chrome('返回', '', `
        <div style="position:absolute;inset:0;overflow:auto;padding:8px;font-size:11px;line-height:2;">
          <div style="border-bottom:1px solid #1d3a24;">情景模式：标准</div>
          <div style="border-bottom:1px solid #1d3a24;">铃声：开（和弦）</div>
          <div style="border-bottom:1px solid #1d3a24;">套餐：${esc(PHONE_DATA.device.package)}</div>
          <div style="border-bottom:1px solid #1d3a24;color:#ffd9a8;">话费余额：${PHONE_DATA.device.balance.toFixed(2)} 元</div>
          <div style="border-bottom:1px solid #1d3a24;">本月剩余短信：83 条</div>
          <div style="color:#7a9a7f;font-size:9px;">余额查询请拨 1008611</div>
        </div>`, '设置');
    },

    /* ---- 拨号 ---- */
    v_dialer() {
      const self = this;
      this.softL = () => { this.dial = ''; this.go('dialer'); };
      this.softR = () => this.dialNumber(this.dial);
      this.chrome('清除', '呼叫', `
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-end;
                    justify-content:center;padding:10px;">
          <div style="font:bold 18px 'Courier New',monospace;color:#fff;">${esc(this.dial) || '<span style="color:#4a6a52">输入号码…</span>'}</div>
          <div style="font-size:9px;color:#7a9a7f;margin-top:6px;">数字键输入 ‖ * 键切换符号</div>
        </div>`, '拨号');
    },

    dialNumber(num) {
      if (!num) return;
      const self = this;
      this.chrome('', '', `
        <div class="ph-dialog">
          <div style="font-size:22px;color:#7fd98a;">✆</div>
          <div style="font-size:13px;color:#fff;">${esc(num)}</div>
          <div id="ph-callst" style="font-size:10px;color:#8fbf95;">正在呼叫…</div>
        </div>`);
      setTimeout(() => {
        const st = self.screen.querySelector('#ph-callst');
        if (!st) return;
        if (num.replace(/\D/g, '') === '1008611') {
          st.innerHTML = '您的余额为 ' + PHONE_DATA.device.balance.toFixed(2) + ' 元<br>动感地带套餐剩 83 条短信';
        } else if (num.replace(/\D/g, '').indexOf('135') === 0) {
          st.innerHTML = '对方已接听…<br><span style="font-size:9px;color:#556a58;">（通话记录见「通讯记录」）</span>';
        } else {
          st.innerHTML = '对方无人接听';
        }
      }, 1400);
    },

    /* ---- 通用弹窗 ---- */
    dialog(html) {
      const self = this;
      const d = document.createElement('div');
      d.className = 'ph-dialog';
      d.style.zIndex = 5;
      d.innerHTML = `<div>${html}</div><div class="ph-btn">确定</div>`;
      d.querySelector('.ph-btn').addEventListener('click', () => d.remove());
      this.screen.appendChild(d);
    },

    /* ============ 键盘与导航 ============ */
    bindKeys() {
      const el = this.rec.body;

      el.querySelectorAll('.ph-key[data-d]').forEach(k => {
        k.addEventListener('click', () => {
          if (this.view !== 'dialer') this.go('dialer');
          if (this.dial.length < 11) this.dial += k.dataset.d;
          this.v_dialer();
        });
      });
      const star = el.querySelector('.ph-key[data-star]');
      if (star) star.addEventListener('click', () => {
        if (this.view !== 'dialer') this.go('dialer');
        if (this.dial.length < 11) this.dial += this.symb ? '+' : '*';
        this.symb = !this.symb;
        this.v_dialer();
      });

      /* 导航键 */
      const nav = (dir) => this.navigate(dir);
      const bind = (sel, fn) => {
        const n = el.querySelector(sel);
        if (n) n.addEventListener('click', fn);
      };
      bind('.ph-nav .nup', () => nav('up'));
      bind('.ph-nav .ndown', () => nav('down'));
      bind('.ph-nav .nleft', () => nav('left'));
      bind('.ph-nav .nright', () => nav('right'));
      bind('.ph-nav .ring', () => {
        if (this.view === 'idle') this.go('menu');
        else if (this.view === 'menu') this.openApp(MENU[this.menuIdx].k);
        else if (this.view === 'sms') this.go('smsread', 0);
        else if (this.view === 'music') this.togglePlay();
      });

      /* 左右软键 */
      bind('.ph-sbtn.l', () => { if (this.softL) this.softL(); });
      bind('.ph-sbtn.r', () => { if (this.softR) this.softR(); });

      /* 呼叫/挂断键 */
      const call = el.querySelector('.ph-callkeys .green');
      if (call) call.addEventListener('click', () => this.dialNumber(this.dial));
      const hang = el.querySelector('.ph-callkeys .red');
      if (hang) hang.addEventListener('click', () => { this.dial = ''; this.go('idle'); });
    },

    navigate(dir) {
      if (this.view === 'idle') { this.go('menu'); return; }
      if (this.view === 'menu') {
        let i = this.menuIdx;
        if (dir === 'up') i -= 3; if (dir === 'down') i += 3;
        if (dir === 'left') i -= 1; if (dir === 'right') i += 1;
        i = Math.max(0, Math.min(MENU.length - 1, i));
        this.menuIdx = i;
        this.v_menu();
      } else if (this.view === 'music') {
        if (dir === 'down') this.songIdx = (this.songIdx + 1) % PHONE_DATA.music.songs.length;
        if (dir === 'up') this.songIdx = (this.songIdx - 1 + PHONE_DATA.music.songs.length) % PHONE_DATA.music.songs.length;
        this.playT = 0;
        this.go('music');
      } else if (this.view === 'sms') {
        this.go('menu');
      } else if (this.view === 'dialer') {
        this.go('idle');
      }
    },
  };

  /* ---- 注册应用 ---- */
  APPS.phone = {
    title: '诺基亚 5300',
    icon: ICONS.phone,
    desktop: true,
    order: 30,
    hint: '张伟的手机：诺基亚 5300（红色滑盖）',
    launch() {
      if (!document.getElementById('phone-css')) {
        const st = document.createElement('style');
        st.id = 'phone-css';
        st.textContent = CSS;
        document.head.appendChild(st);
      }
      const rec = WM.open({
        id: 'phone',
        title: '诺基亚 5300 XpressMusic（红色）',
        icon: ICONS.phone,
        w: 268, h: 520,
        content: `
          <div class="ph-wrap">
            <div class="ph-body">
              <div class="ph-nokia">NOKIA</div>
              <div class="ph-xpress">XpressMusic</div>
              <div class="ph-screen"></div>
              <div class="ph-nav">
                <div class="nkey nup"></div><div class="nkey ndown"></div>
                <div class="nkey nleft"></div><div class="nkey nright"></div>
                <div class="nkey ring"></div>
              </div>
              <div class="ph-musickeys">
                <div class="ph-mk" title="上一曲"></div>
                <div class="ph-mk" title="播放/暂停"></div>
                <div class="ph-mk" title="下一曲"></div>
              </div>
              <div class="ph-softarea">
                <div class="ph-sbtn l">选择</div>
                <div class="ph-callkeys">
                  <div class="ph-sbtn green" style="background:linear-gradient(180deg,#7ac97a,#3a8a3a);color:#fff;">☎</div>
                  <div class="ph-sbtn red" style="background:linear-gradient(180deg,#e07a6a,#a03a2a);color:#fff;">⏻</div>
                </div>
                <div class="ph-sbtn r">返回</div>
              </div>
              <div class="ph-keypad">
                <div class="ph-key" data-d="1">1<small>○</small></div>
                <div class="ph-key" data-d="2">2<small>abc</small></div>
                <div class="ph-key" data-d="3">3<small>def</small></div>
                <div class="ph-key" data-d="4">4<small>ghi</small></div>
                <div class="ph-key" data-d="5">5<small>jkl</small></div>
                <div class="ph-key" data-d="6">6<small>mno</small></div>
                <div class="ph-key" data-d="7">7<small>pqrs</small></div>
                <div class="ph-key" data-d="8">8<small>tuv</small></div>
                <div class="ph-key" data-d="9">9<small>wxyz</small></div>
                <div class="ph-key" data-star="1">*</div>
                <div class="ph-key" data-d="0">0<small>␣</small></div>
                <div class="ph-key">#</div>
              </div>
            </div>
          </div>`,
        onOpen(rec) { new Phone(rec); },
      });
      return rec;
    },
  };

})();
