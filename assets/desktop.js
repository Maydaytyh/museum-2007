/* ============================================================
   desktop.js —— 桌面图标、桌面右键菜单、启动初始化
   ============================================================ */

(function () {
  /* 桌面图标布局 */
  function layoutDesktopIcons() {
    const desktop = document.getElementById('desktop');
    const icons = Array.from(desktop.querySelectorAll('.desk-icon'));
    const colH = 92, margin = 10;
    const availH = desktop.clientHeight - 40; /* 预留任务栏空间 */
    const perCol = Math.max(3, Math.floor(availH / colH));
    icons.forEach((ic, i) => {
      ic.style.left = margin + Math.floor(i / perCol) * 84 + 'px';
      ic.style.top = margin + (i % perCol) * colH + 'px';
    });
  }

  function makeDeskIcon(app) {
    const d = document.createElement('div');
    d.className = 'desk-icon';
    d.innerHTML = `<div class="icon-gfx">${app.icon}</div><div class="icon-label">${app.title.replace('腾讯', '腾讯<br>')}</div>`;
    d.title = app.hint || app.title;
    d.addEventListener('dblclick', () => app.launch());
    d.addEventListener('click', () => {
      document.querySelectorAll('.desk-icon').forEach(x => x.classList.remove('selected'));
      d.classList.add('selected');
      if (!window.__dblHintShown) {
        window.__dblHintShown = true;
        try {
          WM.balloon({ title: '2007 年的电脑', text: '提示：那个年代的图标要双击才能打开。', icon: app.icon, timeout: 5000 });
        } catch (e) { /* 气泡失败不影响选中 */ }
      }
    });
    d.addEventListener('dblclick', () => d.classList.remove('selected'));
    return d;
  }

  /* 桌面右键菜单 */
  function desktopCtx() {
    const desk = document.getElementById('desktop');
    desk.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.xp-win')) return;
      e.preventDefault();
      showCtxMenu(e.clientX, e.clientY, [
        { text: '排列图标(I)', disabled: true },
        { text: '刷新(E)', action: () => layoutDesktopIcons() },
        '-',
        { text: '新建(W)', disabled: true },
        '-',
        { text: '属性(R)', action: () => displayProps() },
      ]);
    });
    desk.addEventListener('click', (e) => {
      if (e.target === desk) document.querySelectorAll('.desk-icon').forEach(x => x.classList.remove('selected'));
    });
  }

  /* 显示属性（彩蛋式还原） */
  function displayProps() {
    WM.open({
      id: 'display-props', title: '显示 属性', icon: ICONS.mycomputer, w: 400, h: 430,
      content: `
        <div style="padding:10px 14px;display:flex;flex-direction:column;gap:10px;height:100%;">
          <div style="display:flex;justify-content:center;">
            <div style="width:200px;height:150px;background:#3a6ea5;border:6px solid #d8d4c4;border-radius:4px;padding:4px;">
              <div style="width:100%;height:100%;background:url(assets/bliss.svg) center/cover;"></div>
            </div>
          </div>
          <fieldset style="border:1px solid #a0a0a0;padding:8px;">
            <legend>主题</legend>
            <select class="xp-select" style="width:100%;">
              <option>Windows XP 蓝色（当前）</option><option>Windows XP 经典样式</option>
            </select>
            <div class="helper-hint" style="margin-top:6px;">主题是背景加一组声音、图标以及只需单击即可帮您个性化设置计算机的元素。</div>
          </fieldset>
          <fieldset style="border:1px solid #a0a0a0;padding:8px;">
            <legend>壁纸说明</legend>
            <div style="line-height:1.7;">当前壁纸为 Windows XP 默认「Bliss」（蓝天草地）。2007 年中国高校宿舍里，这块桌面通常还叠着一张系学生会招新海报或女友照片，或者干脆被 Ghost 系统换成了番茄花园版自带壁纸。<span class="helper-hint">（本馆注：此窗口为博物馆式重建，非真实 XP 组件。）</span></div>
          </fieldset>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:auto;">
            <button class="xp-btn">确定</button><button class="xp-btn">取消</button><button class="xp-btn">应用(A)</button>
          </div>
        </div>`
    });
  }

  window.initDesktop = function () {
    const desk = document.getElementById('desktop');
    const ordered = Object.entries(APPS).filter(([k, a]) => a && a.desktop).sort((a, b) => ((a[1] && a[1].order) || 99) - ((b[1] && b[1].order) || 99));
    ordered.forEach(([key, app]) => desk.appendChild(makeDeskIcon(app)));
    layoutDesktopIcons();
    desktopCtx();
    StartMenu.init();
    Tray.init();

    /* 桌面下方的博物馆导览提示条（可关闭）——帮助 2026 年的访客 */
    const hint = document.createElement('div');
    hint.style.cssText = `position:absolute;right:14px;bottom:44px;width:300px;background:#ffffe1;border:1px solid #8c8c8c;border-radius:6px;box-shadow:2px 3px 8px rgba(0,0,0,.35);padding:10px 12px;z-index:500;color:#333;`;
    hint.innerHTML = `
      <div style="font-weight:bold;color:#0054e6;margin-bottom:5px;">欢迎来到 2007 年 10 月 17 日（星期三）晚</div>
      <div style="line-height:1.65;">这是 <b>张伟</b>（某省属重点大学电气工程大二学生）宿舍里的那台电脑。双击桌面图标打开程序；点「开始」菜单可以逛 <b>数字博物馆</b>、<b>时间胶囊</b> 和 2007→2026 对比页。<span style="color:#808080;">QQ 上有几个头像正在闪动。</span></div>
      <div style="text-align:right;margin-top:6px;"><span style="color:#316ac5;cursor:pointer;text-decoration:underline;">知道了，别再显示</span></div>`;
    hint.querySelector('span:last-child') || hint;
    const closeBtn = hint.querySelectorAll('span')[hint.querySelectorAll('span').length - 1];
    closeBtn.addEventListener('click', () => hint.remove());
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 45000);
  };
})();
