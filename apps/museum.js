/* ============================================================
   apps/museum.js —— 数字博物馆主展厅
   2026 馆长视角：深色木质展墙 + 玻璃展柜，刻意避开现代 SaaS 风。
   藏品数据在 data/museum.js（window.MUSEUM）。
   ============================================================ */

(function () {

  /* ---------------- 藏品小图（inline SVG，展柜风） ---------------- */
  const ART = {
    qq:   `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="30" rx="15" ry="14" fill="#cfd8dc" stroke="#78909c" stroke-width="1.5"/><ellipse cx="24" cy="31" rx="9" ry="9" fill="#fff"/><ellipse cx="24" cy="16" rx="11" ry="10" fill="#cfd8dc" stroke="#78909c" stroke-width="1.5"/><circle cx="20" cy="14" r="2" fill="#37474f"/><circle cx="28" cy="14" r="2" fill="#37474f"/><path d="M11 24 Q24 14 37 24 Q36 28 24 26 Q12 28 11 24 Z" fill="#e53935"/><path d="M14 36 Q19 44 29 43 L27 40 Q20 41 16 35 Z" fill="#ff7043"/><path d="M34 36 Q29 44 19 43 L21 40 Q28 41 32 35 Z" fill="#ff7043"/><rect x="15" y="26" width="4" height="3" rx="1" fill="#546e7a"/><rect x="29" y="26" width="4" height="3" rx="1" fill="#546e7a"/></svg>`,
    phone: `<svg viewBox="0 0 48 48"><rect x="12" y="4" width="24" height="40" rx="5" fill="#d32f2f" stroke="#8e1b1b" stroke-width="1.5"/><rect x="15" y="8" width="18" height="22" rx="2" fill="#1c2632"/><rect x="18" y="11" width="12" height="3" fill="#8bc34a"/><rect x="15" y="33" width="18" height="6" rx="1" fill="#8e1b1b"/><circle cx="31" cy="36" r="1.6" fill="#fff"/><path d="M8 18 L12 20 M40 18 L36 20 M8 44 L12 42 M40 44 L36 42" stroke="#eceff1" stroke-width="2.5"/></svg>`,
    sim:  `<svg viewBox="0 0 48 48"><path d="M10 4 L30 4 L38 12 L38 44 L10 44 Z" fill="#1565c0" stroke="#0d3c7a" stroke-width="1.5"/><rect x="16" y="16" width="16" height="14" rx="1.5" fill="#ffd54f" stroke="#c49000"/><path d="M16 23 h4 M28 23 h4 M16 27 h4 M28 27 h4" stroke="#c49000" stroke-width="1"/><text x="24" y="41" font-size="7" fill="#fff" text-anchor="middle" font-family="Tahoma">M-Zone</text></svg>`,
    shirt: `<svg viewBox="0 0 48 48"><path d="M14 8 L24 4 L34 8 L42 14 L38 20 L34 18 L34 42 L14 42 L14 18 L10 20 L6 14 Z" fill="#ec407a" stroke="#a02750" stroke-width="1.5"/><path d="M20 8 Q24 12 28 8" fill="none" stroke="#a02750" stroke-width="1.5"/><rect x="24" y="4" width="2" height="0" fill="none"/></svg>`,
    web:  `<svg viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="34" rx="3" fill="#fff" stroke="#7a8ba8" stroke-width="1.5"/><rect x="5" y="7" width="38" height="7" rx="3" fill="#3b6ea5"/><circle cx="10" cy="10.5" r="1.3" fill="#ffd54f"/><circle cx="15" cy="10.5" r="1.3" fill="#8bc34a"/><rect x="9" y="19" width="14" height="9" fill="#cfd8dc"/><path d="M26 20 h13 M26 24 h13 M26 28 h9 M9 33 h30 M9 37 h20" stroke="#90a4ae" stroke-width="1.6"/></svg>`,
    coin: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="#f9a825" stroke="#8d5b00" stroke-width="2"/><circle cx="24" cy="24" r="12.5" fill="none" stroke="#8d5b00" stroke-width="1" stroke-dasharray="2 2"/><text x="24" y="29" font-size="13" font-weight="bold" fill="#8d5b00" text-anchor="middle" font-family="Tahoma">Q</text></svg>`,
    card: `<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" rx="3" fill="#0288d1" stroke="#015179" stroke-width="1.5"/><rect x="6" y="10" width="36" height="8" rx="3" fill="#01579b"/><text x="10" y="34" font-size="7" fill="#fff" font-family="Tahoma">充值卡</text><path d="M28 16 L38 26 M31 16 L38 23 M25 16 L38 29" stroke="#4fc3f7" stroke-width="1.6"/></svg>`,
    phonecard: `<svg viewBox="0 0 48 48"><rect x="8" y="12" width="32" height="24" rx="3" fill="#ffb300" stroke="#8d5b00" stroke-width="1.5"/><rect x="12" y="26" width="24" height="6" fill="#ffe082"/><path d="M12 17 h16" stroke="#8d5b00" stroke-width="2"/><text x="24" y="36" font-size="7" fill="#8d5b00" text-anchor="middle" font-family="Tahoma">201</text><path d="M30 8 Q34 4 38 8" fill="none" stroke="#8d5b00" stroke-width="1.5"/></svg>`,
    mp3:  `<svg viewBox="0 0 48 48"><rect x="8" y="12" width="32" height="26" rx="4" fill="#37474f" stroke="#1c262b" stroke-width="1.5"/><rect x="11" y="15" width="26" height="15" fill="#263238"/><rect x="14" y="18" width="20" height="2" fill="#4dd0e1"/><rect x="14" y="22" width="12" height="2" fill="#4dd0e1"/><circle cx="24" cy="34" r="2.5" fill="#eceff1"/><path d="M16 34 h4 M28 34 h4" stroke="#eceff1" stroke-width="1.4"/></svg>`,
    film: `<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" rx="2" fill="#2e7d32" stroke="#1a4d1c" stroke-width="1.5"/><g fill="#1a4d1c"><rect x="8" y="12" width="4" height="4"/><rect x="8" y="20" width="4" height="4"/><rect x="8" y="28" width="4" height="4"/><rect x="36" y="12" width="4" height="4"/><rect x="36" y="20" width="4" height="4"/><rect x="36" y="28" width="4" height="4"/></g><text x="24" y="28" font-size="7" fill="#c8e6c9" text-anchor="middle" font-family="Tahoma">RMVB</text></svg>`,
    sub:  `<svg viewBox="0 0 48 48"><rect x="8" y="6" width="32" height="36" rx="2" fill="#fff8e1" stroke="#8d8466" stroke-width="1.5"/><path d="M13 14 h22 M13 19 h22 M13 24 h14" stroke="#bcaaa4" stroke-width="1.4"/><rect x="13" y="29" width="22" height="8" rx="1.5" fill="#37474f"/><text x="24" y="35" font-size="6" fill="#ffd54f" text-anchor="middle" font-family="Tahoma">中文字幕</text></svg>`,
    torrent: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" fill="none" stroke="#455a64" stroke-width="2" stroke-dasharray="5 4"/><path d="M20 10 L28 10 L24 18 L30 18 L19 34 L23 24 L17 24 Z" fill="#ff8f00" stroke="#8d5b00"/></svg>`,
    lyric: `<svg viewBox="0 0 48 48"><path d="M10 8 L34 4 L34 32 Q34 38 28 38 Q23 38 23 33 Q23 28 28 28 Q31 28 34 30" fill="none" stroke="#6a4fa3" stroke-width="2.5"/><path d="M34 6 L38 7 L38 35 Q38 41 32 41 Q27 41 27 36" fill="none" stroke="#9c86d8" stroke-width="2"/></svg>`,
    game: `<svg viewBox="0 0 48 48"><rect x="6" y="14" width="36" height="22" rx="3" fill="#c62828" stroke="#7f1d1d" stroke-width="1.5"/><circle cx="14" cy="25" r="3" fill="#ffe082"/><circle cx="24" cy="25" r="3" fill="#ffe082"/><circle cx="19" cy="32" r="3" fill="#ffe082"/><path d="M32 22 v8 M28 26 h8" stroke="#ffe082" stroke-width="2.5"/></svg>`,
    battle: `<svg viewBox="0 0 48 48"><path d="M24 4 L28 14 L38 12 L32 20 L42 26 L31 28 L34 38 L24 32 L14 38 L17 28 L6 26 L16 20 L10 12 L20 14 Z" fill="#ef6c00" stroke="#8d3d00" stroke-width="1.5"/><circle cx="24" cy="23" r="5" fill="#fff3e0" stroke="#8d3d00"/></svg>`,
    pointcard: `<svg viewBox="0 0 48 48"><rect x="6" y="14" width="36" height="22" rx="2" fill="#6d4c41" stroke="#3e2723" stroke-width="1.5"/><rect x="10" y="18" width="28" height="8" fill="#d7ccc8"/><text x="24" y="38" font-size="7" fill="#d7ccc8" text-anchor="middle" font-family="Tahoma">30元·4000分</text><path d="M10 30 h6" stroke="#ffb300" stroke-width="2"/></svg>`,
    modem: `<svg viewBox="0 0 48 48"><rect x="8" y="26" width="32" height="14" rx="3" fill="#546e7a" stroke="#263238" stroke-width="1.5"/><circle cx="14" cy="33" r="1.8" fill="#8bc34a"/><circle cx="20" cy="33" r="1.8" fill="#ffd54f"/><path d="M24 20 Q28 12 36 12 M24 14 Q28 6 36 6 M16 20 Q12 12 4 12" fill="none" stroke="#90a4ae" stroke-width="2"/></svg>`,
    router:`<svg viewBox="0 0 48 48"><rect x="8" y="28" width="32" height="12" rx="3" fill="#37474f" stroke="#1c262b" stroke-width="1.5"/><path d="M14 28 V14 M24 28 V10 M34 28 V16" stroke="#78909c" stroke-width="2"/><circle cx="14" cy="12" r="2" fill="#8bc34a"/><circle cx="24" cy="8" r="2" fill="#8bc34a"/><circle cx="34" cy="14" r="2" fill="#ffd54f"/></svg>`,
    thunder:`<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/><path d="M26 8 L16 26 L23 26 L20 40 L33 20 L25 20 Z" fill="#1e88e5" stroke="#0d47a1" stroke-width="1.2"/></svg>`,
    ime:  `<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" rx="3" fill="#fff" stroke="#7a8ba8" stroke-width="1.5"/><text x="16" y="28" font-size="12" fill="#d32f2f" font-family="SimSun" font-weight="bold">搜</text><text x="30" y="28" font-size="12" fill="#1565c0" font-family="SimSun" font-weight="bold">狗</text><path d="M6 34 h36" stroke="#7a8ba8" stroke-width="1"/><rect x="9" y="35" width="30" height="1.5" fill="#ffd54f"/></svg>`,
    floppy:`<svg viewBox="0 0 48 48"><rect x="8" y="6" width="32" height="36" rx="2" fill="#37474f" stroke="#1c262b" stroke-width="1.5"/><rect x="16" y="6" width="16" height="12" fill="#cfd8dc"/><rect x="20" y="7" width="8" height="10" fill="#78909c"/><rect x="13" y="24" width="22" height="16" fill="#eceff1"/><path d="M16 28 h16 M16 32 h16 M16 36 h10" stroke="#90a4ae" stroke-width="1.4"/></svg>`,
    monitor:`<svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="26" rx="3" fill="#eceff1" stroke="#546e7a" stroke-width="1.5"/><rect x="9" y="11" width="30" height="20" fill="#4a7ba6"/><rect x="18" y="34" width="12" height="6" fill="#78909c"/><rect x="12" y="40" width="24" height="4" rx="1" fill="#546e7a"/><path d="M12 26 L19 18 L24 23 L33 13" fill="none" stroke="#8bc34a" stroke-width="2"/></svg>`,
    bios: `<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="2" fill="#0a0a12" stroke="#37474f" stroke-width="1.5"/><text x="8" y="18" font-size="6" fill="#8bc34a" font-family="monospace">Award Modular</text><text x="8" y="26" font-size="6" fill="#8bc34a" font-family="monospace">Memory Test :</text><text x="8" y="34" font-size="6" fill="#ffd54f" font-family="monospace">512K OK</text></svg>`,
    cd:   `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="#ff7043" stroke="#bf360c" stroke-width="1.5"/><circle cx="24" cy="24" r="12" fill="#ffccbc"/><circle cx="24" cy="24" r="4" fill="#fff" stroke="#bf360c"/><path d="M13 17 Q24 10 35 17" fill="none" stroke="#a5d6a7" stroke-width="3"/><path d="M13 31 Q24 38 35 31" fill="none" stroke="#c5e1a5" stroke-width="3"/><text x="24" y="46" font-size="0" fill="none">t</text></svg>`,
    virus:`<svg viewBox="0 0 48 48"><rect x="10" y="10" width="28" height="28" rx="3" fill="#4e342e" stroke="#231710" stroke-width="1.5"/><path d="M24 14 Q27 18 24 21 Q21 18 24 14 Z" fill="#fbc02d"/><path d="M18 17 L21 21 M30 17 L27 21" stroke="#fbc02d" stroke-width="2.2"/><rect x="15" y="24" width="18" height="3" fill="#fbc02d" opacity="0.85"/><circle cx="19" cy="31" r="2" fill="#fbc02d"/><circle cx="24" cy="32" r="2" fill="#fbc02d"/><circle cx="29" cy="31" r="2" fill="#fbc02d"/></svg>`,
    shield:`<svg viewBox="0 0 48 48"><path d="M24 4 L40 10 L40 24 Q40 38 24 44 Q8 38 8 24 L8 10 Z" fill="#ffb300" stroke="#8d5b00" stroke-width="2"/><path d="M24 14 L35 18 L35 25 Q35 33 24 37 Q13 33 13 25 L13 18 Z" fill="#fff8e1"/><path d="M18 24 L22 28 L30 20" fill="none" stroke="#e65100" stroke-width="2.5"/></svg>`,
    coral:`<svg viewBox="0 0 48 48"><path d="M24 44 V20 M24 30 L14 22 M24 34 L36 24 M14 22 V14 M36 24 V16" fill="none" stroke="#d84315" stroke-width="3" stroke-linecap="round"/><circle cx="14" cy="11" r="3" fill="#ff8a65"/><circle cx="36" cy="13" r="3" fill="#ff8a65"/><circle cx="24" cy="16" r="3.5" fill="#ff7043"/><path d="M24 44 Q20 46 16 44" fill="none" stroke="#a2321f" stroke-width="2"/></svg>`,
    key:  `<svg viewBox="0 0 48 48"><circle cx="16" cy="24" r="9" fill="none" stroke="#6d4c41" stroke-width="4"/><path d="M25 24 L42 24 M36 24 V32 M42 24 V30" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="24" r="2.5" fill="#8d6e63"/></svg>`,
    wangba:`<svg viewBox="0 0 48 48"><rect x="5" y="12" width="38" height="24" rx="2" fill="#37474f" stroke="#1c262b" stroke-width="1.5"/><g fill="#26c6da"><rect x="9" y="16" width="6" height="4.5"/><rect x="17" y="16" width="6" height="4.5"/><rect x="25" y="16" width="6" height="4.5"/><rect x="33" y="16" width="6" height="4.5"/><rect x="9" y="23" width="6" height="4.5"/><rect x="17" y="23" width="6" height="4.5"/><rect x="25" y="23" width="6" height="4.5"/><rect x="33" y="23" width="6" height="4.5"/></g><rect x="9" y="30" width="30" height="4" fill="#546e7a"/></svg>`,
    print:`<svg viewBox="0 0 48 48"><rect x="10" y="6" width="28" height="12" fill="#eceff1" stroke="#78909c" stroke-width="1.5"/><path d="M14 10 h20 M14 14 h12" stroke="#90a4ae" stroke-width="1.2"/><rect x="6" y="18" width="36" height="14" rx="2" fill="#546e7a" stroke="#263238" stroke-width="1.5"/><circle cx="36" cy="25" r="2" fill="#8bc34a"/><rect x="12" y="32" width="24" height="10" fill="#fff" stroke="#78909c" stroke-width="1.5"/><path d="M16 36 h16 M16 39 h10" stroke="#bcaaa4" stroke-width="1.2"/></svg>`,
    cert: `<svg viewBox="0 0 48 48"><rect x="8" y="6" width="32" height="30" rx="2" fill="#fff" stroke="#7a8ba8" stroke-width="1.5"/><path d="M13 14 h22 M13 20 h22 M13 26 h14" stroke="#90a4ae" stroke-width="1.6"/><circle cx="31" cy="33" r="4" fill="#c62828"/><path d="M29 33 h4 M31 31 v4" stroke="#fff" stroke-width="1.4"/><circle cx="36" cy="40" r="4" fill="#ef5350" opacity="0.7"/><circle cx="30" cy="41" r="4" fill="#ef5350" opacity="0.7"/></svg>`,
    bbs:  `<svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="32" rx="2" fill="#fff" stroke="#7a8ba8" stroke-width="1.5"/><rect x="6" y="8" width="10" height="32" fill="#37474f"/><g fill="#90a4ae"><rect x="19" y="13" width="10" height="2"/><rect x="19" y="18" width="18" height="2"/><rect x="19" y="23" width="14" height="2"/><rect x="19" y="28" width="18" height="2"/><rect x="19" y="33" width="8" height="2"/></g><rect x="8" y="13" width="6" height="2" fill="#ffd54f"/><rect x="8" y="18" width="6" height="2" fill="#ffd54f"/><rect x="8" y="23" width="6" height="2" fill="#ffd54f"/></svg>`,
    bulb: `<svg viewBox="0 0 48 48"><path d="M24 6 Q33 6 33 16 Q33 22 28 25 L28 30 L20 30 L20 25 Q15 22 15 16 Q15 6 24 6 Z" fill="#fff59d" stroke="#c49000" stroke-width="1.8"/><rect x="20" y="32" width="8" height="4" fill="#78909c"/><rect x="21" y="38" width="6" height="3" fill="#546e7a"/><path d="M24 12 V24 M19 16 Q24 12 29 16" fill="none" stroke="#ffb300" stroke-width="1.6"/></svg>`,
    usb:  `<svg viewBox="0 0 48 48"><rect x="16" y="6" width="16" height="24" rx="3" fill="#546e7a" stroke="#263238" stroke-width="1.5"/><rect x="19" y="10" width="4" height="4" fill="#cfd8dc"/><rect x="25" y="10" width="4" height="4" fill="#cfd8dc"/><path d="M24 30 V40 M18 36 L24 42 L30 36" stroke="#78909c" stroke-width="2.5" fill="none"/></svg>`,
    pc:   `<svg viewBox="0 0 48 48"><rect x="6" y="8" width="26" height="18" rx="2" fill="#eceff1" stroke="#546e7a" stroke-width="1.5"/><rect x="9" y="11" width="20" height="12" fill="#3b6ea5"/><rect x="34" y="12" width="9" height="10" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.2"/><rect x="10" y="26" width="18" height="3" fill="#78909c"/><rect x="36" y="22" width="5" height="18" fill="#eceff1" stroke="#546e7a" stroke-width="1.2"/><rect x="8" y="40" width="26" height="3.5" rx="1.5" fill="#546e7a"/></svg>`,
    ring: `<svg viewBox="0 0 48 48"><path d="M8 24 Q8 10 24 10 Q40 10 40 24 Q40 38 24 38 Q8 38 8 24 Z" fill="#ff7043" stroke="#bf360c" stroke-width="1.5"/><path d="M14 20 Q18 14 26 15 Q33 16 34 22" fill="none" stroke="#ffccbc" stroke-width="2.5"/><path d="M12 30 Q18 36 30 34 Q36 32 36 27" fill="none" stroke="#ffccbc" stroke-width="2"/><text x="24" y="27" font-size="8" fill="#bf360c" text-anchor="middle" font-family="SimSun" font-weight="bold">彩铃</text></svg>`,
    ad:   `<svg viewBox="0 0 48 48"><rect x="5" y="10" width="38" height="28" rx="2" fill="#1565c0" stroke="#0d3c7a" stroke-width="1.5"/><text x="24" y="24" font-size="9" fill="#ffd54f" text-anchor="middle" font-family="SimSun" font-weight="bold">我的地盘</text><text x="24" y="34" font-size="8" fill="#fff" text-anchor="middle" font-family="SimSun">听我的</text><path d="M5 14 h38" stroke="#ffd54f" stroke-width="1.5"/></svg>`,
    bliss:`<svg viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="2" fill="#4a90d9" stroke="#2c6092" stroke-width="1.5"/><ellipse cx="24" cy="42" rx="30" ry="16" fill="#5aa844"/><ellipse cx="10" cy="40" rx="16" ry="10" fill="#6cbf55"/><path d="M24 30 Q27 36 24 42" fill="none" stroke="#4a8a38" stroke-width="1.4"/><circle cx="38" cy="12" r="4.5" fill="#fff" opacity="0.9"/></svg>`,
    chart:`<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="2" fill="#fff" stroke="#7a8ba8" stroke-width="1.5"/><path d="M12 36 V28 M20 36 V22 M28 36 V14 M36 36 V8" stroke="#1565c0" stroke-width="5" stroke-linecap="round"/><path d="M10 30 L18 24 L26 16 L34 10" fill="none" stroke="#e65100" stroke-width="1.8" stroke-dasharray="3 2"/><text x="24" y="45" font-size="0" fill="none">t</text></svg>`,
  };
  ART.disk = ART.floppy;

  /* ---------------- 样式 ---------------- */
  const CSS = `
#mu-root { display:flex; flex-direction:column; height:100%; background:linear-gradient(180deg,#2a1d12,#231610 60%,#1a100a); }
#mu-head { flex:none; display:flex; align-items:center; gap:12px; padding:10px 16px 8px;
  background:linear-gradient(180deg,#3d2b1a,#2a1d12); border-bottom:3px double #6b4a2b; }
#mu-head .mu-title { color:#e8d9b0; font-family:"SimSun",serif; font-size:17px; font-weight:bold; letter-spacing:2px; }
#mu-head .mu-sub { color:#a08a5f; font-size:11px; margin-top:2px; }
#mu-head .mu-search { flex:1; max-width:220px; margin-left:auto; }
#mu-head .mu-search input { width:100%; background:#f5ecd7; border:1px solid #6b4a2b; border-radius:3px;
  padding:4px 8px; font-size:12px; color:#2a1d12; outline:none; }
#mu-body { flex:1; display:flex; overflow:hidden; }
#mu-main { flex:1; display:flex; overflow:hidden; }
#mu-side { flex:none; width:150px; padding:10px 6px; overflow:auto; background:rgba(0,0,0,.25); border-right:1px solid #4a3520; }
#mu-side .mu-hall { padding:7px 10px; margin-bottom:4px; color:#c9b586; font-size:12.5px; border-radius:3px;
  border-left:3px solid transparent; cursor:default; }
#mu-side .mu-hall:hover { background:rgba(230,200,140,.12); color:#f0e2b6; }
#mu-side .mu-hall.on { background:rgba(230,200,140,.18); border-left-color:#c9a24b; color:#f5e9c3; font-weight:bold; }
#mu-side .mu-count { font-size:10px; color:#8a7550; float:right; margin-top:1px; }
#mu-side .mu-note { margin-top:14px; padding:8px 6px; color:#8a7550; font-size:10.5px; line-height:1.7; border-top:1px solid #4a3520; }
#mu-halls { flex:1; overflow:auto; padding:14px 16px; }
#mu-halls::-webkit-scrollbar, #mu-side::-webkit-scrollbar { width:9px; }
#mu-halls::-webkit-scrollbar-thumb { background:#4a3520; border-radius:4px; }
#mu-side::-webkit-scrollbar-thumb { background:#4a3520; border-radius:4px; }
.mu-sec-title { color:#d9c48f; font-family:"SimSun",serif; font-size:14px; margin:2px 0 10px; letter-spacing:1px; }
.mu-sec-desc { color:#9b8358; font-size:11px; margin:-6px 0 12px; line-height:1.6; }
.mu-grid { display:flex; flex-wrap:wrap; gap:12px; }
.mu-case { width:152px; background:linear-gradient(180deg,#3a2b1c,#2c2013); border:1px solid #5c452a;
  border-radius:4px; padding:8px 8px 7px; cursor:default; box-shadow:inset 0 1px 0 rgba(255,235,180,.08), 0 2px 5px rgba(0,0,0,.4); }
.mu-case:hover { border-color:#c9a24b; background:linear-gradient(180deg,#453324,#33261a); }
.mu-case .mu-glass { height:78px; display:flex; align-items:center; justify-content:center;
  background:radial-gradient(ellipse at 50% 30%, rgba(255,240,200,.10), rgba(0,0,0,.28));
  border:1px solid #4a3520; border-radius:3px; margin-bottom:6px; }
.mu-case .mu-glass svg { width:58px; height:58px; filter:drop-shadow(0 3px 4px rgba(0,0,0,.5)); }
.mu-case .mu-n { color:#eadfc0; font-size:12px; line-height:1.4; min-height:32px; }
.mu-case .mu-e { color:#8a7550; font-size:10px; margin-top:3px; }
.mu-case .mu-t { color:#b98f3e; font-size:10px; margin-top:4px; border-top:1px dashed #4a3520; padding-top:4px; line-height:1.5; }
/* 详情卡 */
#mu-detail { flex:1; overflow:auto; padding:18px 22px; }
#mu-detail::-webkit-scrollbar { width:9px; } #mu-detail::-webkit-scrollbar-thumb { background:#4a3520; border-radius:4px; }
.mu-back { display:inline-block; color:#d9c48f; font-size:12px; padding:4px 10px; border:1px solid #6b4a2b;
  border-radius:3px; margin-bottom:12px; }
.mu-back:hover { background:rgba(230,200,140,.15); }
.mu-dcard { background:linear-gradient(180deg,#f5ecd7,#e8dcc0); border:1px solid #6b4a2b; border-radius:4px;
  padding:16px 20px; box-shadow:0 3px 10px rgba(0,0,0,.5); color:#3a2b1c; }
.mu-dcard h2 { font-family:"SimSun",serif; font-size:18px; color:#2a1d12; letter-spacing:1px; }
.mu-dcard .mu-de { color:#7a6540; font-size:11px; margin:2px 0 0; }
.mu-dhero { display:flex; gap:16px; margin:12px 0; }
.mu-dhero .pic { flex:none; width:120px; height:120px; display:flex; align-items:center; justify-content:center;
  background:radial-gradient(ellipse at 50% 35%, #fff8e6, #d9c9a5); border:2px solid #6b4a2b; border-radius:4px; }
.mu-dhero .pic svg { width:92px; height:92px; }
.mu-dhero .tag { color:#6b4a2b; font-size:13px; font-weight:bold; line-height:1.5; padding-top:6px; }
.mu-sec { margin:10px 0 14px; }
.mu-sec .h { color:#6b4a2b; font-weight:bold; font-size:12px; border-left:3px solid #b98f3e; padding-left:7px; margin-bottom:4px; }
.mu-sec .b { font-size:12.5px; line-height:1.85; }
.mu-facts { width:100%; border-collapse:collapse; margin:6px 0; }
.mu-facts td { border:1px solid #b9a678; padding:5px 8px; font-size:11.5px; line-height:1.6; vertical-align:top; }
.mu-facts td.k { background:#e8dcc0; width:96px; color:#4a3520; font-weight:bold; white-space:nowrap; }
.mu-facts td.src { color:#7a6540; font-size:10px; white-space:nowrap; }
.mu-curator { margin-top:12px; padding:8px 10px; background:rgba(107,74,43,.10); border-left:3px solid #b98f3e;
  color:#5c452a; font-size:11.5px; line-height:1.7; }
.mu-empty { color:#9b8358; padding:30px; text-align:center; font-size:12px; }`;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------------- 主控 ---------------- */
  let view = { hall: 'all', q: '', detail: null };

  function render() {
    const root = document.getElementById('mu-root');
    const side = root.querySelector('#mu-side');
    const main = root.querySelector('#mu-main');

    /* 侧栏 */
    const total = MUSEUM.artifacts.length;
    side.innerHTML = `
      <div class="mu-hall ${view.hall === 'all' ? 'on' : ''}" data-h="all">全部展厅<span class="mu-count">${total}</span></div>
      ${MUSEUM.halls.map(h => {
        const n = MUSEUM.artifacts.filter(a => a.hall === h.id).length;
        return `<div class="mu-hall ${view.hall === h.id ? 'on' : ''}" data-h="${h.id}">${h.name}<span class="mu-count">${n}</span></div>`;
      }).join('')}
      <div class="mu-note">本馆藏品 ${total} 件。<br>年代基准：2007-10-17。<br>所有数字均注明研究档案来源。</div>`;
    side.querySelectorAll('.mu-hall').forEach(el =>
      el.addEventListener('click', () => { view.hall = el.dataset.h; view.detail = null; render(); }));

    /* 主区 */
    if (view.detail) { renderDetail(main); return; }

    let list = MUSEUM.artifacts;
    if (view.hall !== 'all') list = list.filter(a => a.hall === view.hall);
    if (view.q) {
      const q = view.q.toLowerCase();
      list = list.filter(a =>
        (a.name + a.tagline + a.purpose + a.significance + a.change +
         a.facts.map(f => f.k + f.v).join('')).toLowerCase().indexOf(q) >= 0);
    }

    main.innerHTML = `<div id="mu-halls" class="xp-scroll"></div>`;
    const hallsEl = main.querySelector('#mu-halls');
    if (!list.length) {
      hallsEl.innerHTML = `<div class="mu-empty">没有找到相关藏品。</div>`;
      return;
    }

    if (view.hall === 'all' && !view.q) {
      /* 按展厅分节陈列 */
      MUSEUM.halls.forEach(h => {
        const items = list.filter(a => a.hall === h.id);
        if (!items.length) return;
        hallsEl.insertAdjacentHTML('beforeend', `
          <div class="mu-sec-title">· ${h.name} ·</div>
          <div class="mu-sec-desc">${esc(h.desc)}</div>
          <div class="mu-grid">${items.map(cardHTML).join('')}</div>
          <div style="height:16px;"></div>`);
      });
    } else {
      const h = MUSEUM.halls.find(x => x.id === view.hall);
      hallsEl.innerHTML = `
        <div class="mu-sec-title">· ${view.q ? '检索结果（' + list.length + ' 件）' : esc(h.name)} ·</div>
        ${view.q ? '' : `<div class="mu-sec-desc">${esc(h.desc)}</div>`}
        <div class="mu-grid">${list.map(cardHTML).join('')}</div>`;
    }
    bindCards(hallsEl);
  }

  function cardHTML(a) {
    return `
      <div class="mu-case" data-id="${a.id}">
        <div class="mu-glass">${ART[a.icon] || ART.chart}</div>
        <div class="mu-n">${esc(a.name)}</div>
        <div class="mu-e">${esc(a.era)}</div>
        <div class="mu-t">${esc(a.tagline)}</div>
      </div>`;
  }

  function bindCards(scope) {
    scope.querySelectorAll('.mu-case').forEach(el =>
      el.addEventListener('click', () => {
        view.detail = MUSEUM.artifacts.find(a => a.id === el.dataset.id);
        render();
      }));
  }

  function renderDetail(main) {
    const a = view.detail;
    const hall = MUSEUM.halls.find(h => h.id === a.hall);
    main.innerHTML = `
      <div id="mu-detail" class="xp-scroll">
        <span class="mu-back">← 返回展厅（${esc(hall ? hall.name : '')}）</span>
        <div class="mu-dcard">
          <h2>${esc(a.name)}</h2>
          <div class="mu-de">${esc(a.era)} ／ ${esc(hall ? hall.name : '')}</div>
          <div class="mu-dhero">
            <div class="pic">${ART[a.icon] || ART.chart}</div>
            <div class="tag">${esc(a.tagline)}</div>
          </div>
          <div class="mu-sec"><div class="h">当年用途</div><div class="b">${esc(a.purpose)}</div></div>
          <div class="mu-sec"><div class="h">它意味着什么</div><div class="b">${esc(a.significance)}</div></div>
          <div class="mu-sec"><div class="h">今天呢</div><div class="b">${esc(a.change)}</div></div>
          <div class="mu-sec"><div class="h">相关数据</div>
            <table class="mu-facts">
              ${a.facts.map(f => `<tr><td class="k">${esc(f.k)}</td><td>${esc(f.v)}</td><td class="src">${esc(f.src)}</td></tr>`).join('')}
            </table>
          </div>
          <div class="mu-curator">馆长注（2026）：以上条目均可在大模拟器中找到对应实物——桌面、手机、我的电脑或下载列表里。</div>
        </div>
      </div>`;
    main.querySelector('.mu-back').addEventListener('click', () => { view.detail = null; render(); });
  }

  /* ---------------- 注册 ---------------- */
  APPS.museum = {
    title: '数字博物馆',
    icon: ICONS.museum,
    desktop: true,
    order: 10,
    hint: '2007 数字生活博物馆：39 件藏品、6 大展厅',
    launch() {
      if (!document.getElementById('museum-css')) {
        const st = document.createElement('style');
        st.id = 'museum-css';
        st.textContent = CSS;
        document.head.appendChild(st);
      }
      const rec = WM.open({
        id: 'museum',
        title: '2007 数字生活博物馆 · 常设展',
        icon: ICONS.museum,
        w: 860, h: 620, max: true,
      });
      if (rec.body.dataset.muInit) { WM.focus('museum'); return rec; }
      rec.body.dataset.muInit = '1';
      rec.body.style.cssText = 'background:#231610;border-color:#3a2b1c !important;';
      rec.body.innerHTML = `
        <div id="mu-root">
          <div id="mu-head">
            <div>
              <div class="mu-title">2007 数字生活博物馆</div>
              <div class="mu-sub">常设展 · 馆长导览视角：2026 年回望 2007</div>
            </div>
            <div class="mu-search"><input type="text" placeholder="检索藏品（如：熊猫、QQ、软盘）"></div>
          </div>
          <div id="mu-body">
            <div id="mu-side"></div>
            <div id="mu-main">
              <div id="mu-halls" class="xp-scroll"></div>
            </div>
          </div>
        </div>`;
      const input = rec.body.querySelector('.mu-search input');
      input.addEventListener('input', () => {
        view.q = input.value.trim();
        view.detail = null;
        render();
      });
      render();
      return rec;
    },
  };

})();
