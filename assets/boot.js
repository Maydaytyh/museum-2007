/* ============================================================
   boot.js —— 开机流程：BIOS POST → XP 启动画面 → 欢迎登录 → 桌面
   ============================================================ */

(function () {
  const BIOS_LINES = [
    ['Award Modular BIOS v6.00PG, An Energy Star Ally', 0],
    ['Copyright (C) 1984-2006, Award Software, Inc.', 0],
    ['', 0],
    ['Main Processor : Intel(R) Pentium(R) Dual E2140 @ 1.60GHz', 0],
    ['Memory Testing : 1039360K OK', 0],
    ['', 0],
    ['Primary Master  : ST3160815AS 160GB', 0],
    ['Primary Slave   : None', 0],
    ['Secondary Master: TSSTcorp CD/DVDW TS-H652M', 0],
    ['Secondary Slave : None', 0],
    ['', 0],
    ['Press DEL to enter SETUP, F12 for Network Boot, ESC for boot menu', 0],
  ];

  function runBios(done) {
    const boot = document.getElementById('boot');
    const pre = boot.querySelector('.bios');
    pre.textContent = '';
    let i = 0;
    let fired = false;
    const go = () => { if (fired) return; fired = true; done(); };
    const t = setInterval(() => {
      if (i >= BIOS_LINES.length) {
        clearInterval(t);
        setTimeout(go, 500);
        return;
      }
      pre.textContent += BIOS_LINES[i][0] + '\n';
      i++;
    }, 130);
    boot.addEventListener('click', () => { clearInterval(t); go(); }, { once: true });
  }

  function runXpLogo(done) {
    document.getElementById('boot').style.display = 'none';
    const lg = document.getElementById('xp-bootlogo');
    lg.style.display = 'flex';
    const segs = lg.querySelectorAll('.seg');
    let i = 0;
    let fired = false;
    const go = () => { if (fired) return; fired = true; done(); };
    const t = setInterval(() => {
      segs.forEach((s, k) => s.style.opacity = (k === i % segs.length) ? 1 : (k === (i - 1 + segs.length) % segs.length ? 0.4 : 0.08));
      i++;
    }, 180);
    setTimeout(() => { clearInterval(t); go(); }, 2800);
    lg.addEventListener('click', () => { clearInterval(t); go(); }, { once: true });
  }

  function runLogin(done) {
    document.getElementById('xp-bootlogo').style.display = 'none';
    const ls = document.getElementById('login-screen');
    ls.style.display = 'flex';
    ls.querySelector('.ls-user').addEventListener('click', () => {
      if (ls.dataset.logging) return;
      ls.dataset.logging = '1';
      ls.querySelector('.ls-tip').textContent = '正在加载个人设置...';
      setTimeout(() => { ls.style.display = 'none'; done(); }, 1100);
    }, { once: true });
  }

  window.runBoot = function (onDesktopReady) {
    runBios(() => runXpLogo(() => runLogin(onDesktopReady)));
  };
})();
