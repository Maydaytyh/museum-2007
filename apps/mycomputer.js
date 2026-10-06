/* ============================================================
   apps/mycomputer.js —— XP「我的电脑 / 我的文档 / 回收站」
   依据 research/software.md §1.6（C 盘 10–20GB、软件装 D 盘是标准习惯）、
   campus.md §2.1/§2.2（打印 0.1–0.3 元/张、软盘已死 U 盘当立）
   ============================================================ */

(function () {

  /* ---------------- 文件系统数据 ---------------- */
  const FS = {
    'mycomputer': {
      title: '我的电脑',
      tasks: ['查看系统信息', '添加/删除程序', '更改设置', '控制面板'],
      places: ['我的文档', '网上邻居'],
      items: [
        { name: '3.5 软盘 (A:)',       type: '3½ 英寸软盘',    size: '',            free: '',        icon: 'floppy',  msg: '请将磁盘插入驱动器 A:。' },
        { name: '本地磁盘 (C:)',        type: '本地磁盘',        size: '12.8GB',      free: '4.20GB',  icon: 'diskC', drive: 'C:' },
        { name: '本地磁盘 (D:)',        type: '本地磁盘（资料/电影）', size: '160GB', free: '89.0GB', icon: 'diskD', drive: 'D:' },
        { name: 'CD 驱动器 (E:)',       type: 'CD 驱动器',       size: '',            free: '',        icon: 'cd',      msg: '请将光盘插入驱动器 E:。' },
        { name: '可移动磁盘 (H:)',      type: '可移动存储设备（1GB U 盘）', size: '982MB', free: '612MB', icon: 'usb', drive: 'H:' },
      ],
    },

    /* C 盘（浅层浏览：系统盘，软件都装 D 盘是当年习惯） */
    'C:': [
      { name: 'Documents and Settings', icon: 'folder', type: '文件文件夹', list: [
        { name: '张伟', icon: 'folder', type: '文件文件夹', list: [
          { name: '「开始」菜单', icon: 'folder', type: '文件文件夹', list: [] },
        ]},
      ]},
      { name: 'Program Files', icon: 'folder', type: '文件文件夹', list: [
        { name: '装机必备', icon: 'folder', type: '文件文件夹', list: [] },
      ]},
      { name: 'WINDOWS', icon: 'folder', type: '文件文件夹', list: [
        { name: 'system32', icon: 'folder', type: '文件文件夹', list: [] },
      ]},
    ],

    /* D 盘内容（含两层深度） */
    'D:': [
      { name: '电影', icon: 'folder', list: [
        { name: '变形金刚[DVDRip].rmvb',        type: 'RMVB 文件', size: '699MB', icon: 'film', msg: '2007-07 内地上映，年度票房冠军（2.81 亿）——research/video.md §5' },
        { name: '越狱.S03E04[伊甸园出品].rmvb',  type: 'RMVB 文件', size: '349MB', icon: 'film',  msg: '周二凌晨字幕组出片，挂迅雷下的——research/video.md §3.5' },
        { name: '疯狂的石头.DVDRip.rmvb',        type: 'RMVB 文件', size: '698MB', icon: 'film',  msg: '2006-06-30 上映，百度 2006 电影榜第 2——research/video.md §7' },
        { name: '字幕',                          icon: 'folder',    type: '文件文件夹', list: [
          { name: 'Prison.Break.S03E04.srt',    type: 'SRT 字幕',  size: '62KB',  icon: 'srt', msg: '与影片同名放同目录，暴风影音自动加载——research/video.md §3.2' },
        ]},
      ]},
      { name: '游戏', icon: 'folder', list: [
        { name: '魔兽争霸III', icon: 'folder', type: '文件文件夹', list: [
          { name: 'War3.exe',                      type: '应用程序', size: '1.9MB',  icon: 'exe', msg: '宿舍局域网 DOTA（6.48b）的主战场——research/games.md §4' },
          { name: 'DotA Allstars v6.48b.w3x',     type: '地图文件', size: '4.7MB',  icon: 'map', msg: '2007 年 DOTA 处于 6.48/6.48b 统治期——research/games.md §11' },
        ]},
        { name: 'CS1.6', icon: 'folder', type: '文件文件夹', list: [
          { name: 'cstrike.exe',                   type: '应用程序', size: '1.2MB',  icon: 'exe', msg: '白天浩方混战、断外网后转宿舍内战——research/games.md §4.1' },
        ]},
        { name: '仙剑奇侠传四', icon: 'folder', type: '文件文件夹', list: [
          { name: '启动游戏.exe',                  type: '应用程序', size: '8.4MB',  icon: 'exe', msg: '2007-08-01 上市，三周销售 30 万套——research/games.md §11' },
          { name: '免CD补丁.exe',                  type: '应用程序', size: '96KB',   icon: 'exe', msg: '免 CD 补丁是当年单机的标配附件——research/internet.md §10.3' },
        ]},
      ]},
      { name: '音乐', icon: 'folder', list: [
        { name: '周杰伦', icon: 'folder', type: '文件文件夹', list: [
          { name: '菊花台.mp3',                    type: 'MP3 文件', size: '4.2MB', icon: 'mp3', msg: '128kbps 是百度 MP3 主流码率——research/music.md §5.1' },
          { name: '夜曲.lrc',                      type: 'LRC 歌词', size: '2KB',   icon: 'srt', msg: '千千静听自动下载的滚动歌词——research/music.md §1.1' },
        ]},
        { name: 'Linkin Park', icon: 'folder', type: '文件文件夹', list: [
          { name: 'What I\'ve Done.mp3',           type: 'MP3 文件', size: '3.9MB', icon: 'mp3', msg: '《变形金刚》主题曲，2007-04-02 单曲发布——research/music.md §8' },
        ]},
        { name: '陈楚生', icon: 'folder', type: '文件文件夹', list: [
          { name: '有没有人告诉你.mp3',             type: 'MP3 文件', size: '4.1MB', icon: 'mp3', msg: '快男 2007 冠军曲，比赛期间即唱红全国——research/music.md §3.4' },
        ]},
      ]},
      { name: '学习', icon: 'folder', list: [
        { name: '高等数学(上)作业.doc',             type: 'Word 文档', size: '38KB',  icon: 'doc', msg: 'Office 2003（.doc）是宿舍装机精简版标配——research/campus.md §6.5' },
        { name: '电路实验报告.doc',                 type: 'Word 文档', size: '156KB', icon: 'doc', msg: '今晚 22:30 的任务——data/persona.js 时间轴' },
        { name: '四六级准考证.jpg',                 type: 'JPEG 图像', size: '210KB', icon: 'img',  msg: '2007 年四六级已是 710 分制时代——research/campus.md §6.3' },
      ]},
      { name: '学习资料.exe',                      type: '应用程序', size: '316KB',  icon: 'exe',  danger: true },
      { name: '新建文件夹',                        icon: 'folder',   type: '文件文件夹', list: [] },
    ],

    'H:': [
      { name: '课件', icon: 'folder', type: '文件文件夹', list: [
        { name: '电路原理_第5章.ppt',              type: 'PowerPoint 演示文稿', size: '2.1MB', icon: 'ppt', msg: '拷课件去打印店，0.1–0.3 元/张——research/campus.md §2.1' },
        { name: '模拟电子技术_重点.doc',            type: 'Word 文档', size: '88KB',  icon: 'doc',  msg: '期末打印高峰：一门课几十页×全班——research/campus.md §2.1' },
      ]},
      { name: '作业', icon: 'folder', type: '文件文件夹', list: [
        { name: '大物实验报告.doc',                 type: 'Word 文档', size: '120KB', icon: 'doc', msg: 'U 盘交作业是 2007 年的标准动作——research/campus.md §2.2' },
      ]},
    ],

    'mydoc': {
      title: '我的文档',
      tasks: ['共享此文件夹', '发布到 Web'],
      places: ['我的电脑', '网上邻居'],
      items: [
        { name: '我的音乐',  icon: 'folder', type: '文件文件夹', list: [] },
        { name: '我的视频',  icon: 'folder', type: '文件文件夹', list: [
          { name: 'WMP 播放列表.wpl', type: '播放列表', size: '1KB', icon: 'srt', msg: 'Windows Media Player 11 与千千静听并存的时代——research/music.md §1.6' },
        ]},
        { name: '我的图片',  icon: 'folder', type: '文件文件夹', list: [
          { name: '图片收藏', icon: 'folder', type: '文件文件夹', list: [] },
          { name: 'Bliss.bmp', type: 'BMP 图像', size: '1.4MB', icon: 'img', msg: 'XP 默认壁纸「Bliss」——全球最知名的桌面背景（research/software.md §2）' },
        ]},
        { name: '实验报告(电路).doc', type: 'Word 文档', size: '156KB', icon: 'doc', msg: 'Office 2003 的 .doc 格式——research/campus.md §6.5' },
        { name: 'QQ离线文件', icon: 'folder', type: '文件文件夹', list: [
          { name: '李强_高数笔记.rar', type: 'RAR 压缩文件', size: '3.4MB', icon: 'rar', msg: 'WinRAR 3.70 中文版 2007-01 发布——research/software.md §7' },
        ]},
      ],
    },
  };

  /* 回收站（彩蛋：可还原） */
  const RECYCLE = [
    { name: '前女友照片.rar',     type: 'RAR 压缩文件', size: '38.6MB', icon: 'rar',  from: 'D:\\图片', deleted: '2007-10-11 02:47' },
    { name: '高数补考重点.doc',  type: 'Word 文档',    size: '52KB',   icon: 'doc',  from: 'D:\\学习', deleted: '2007-09-28 21:15' },
  ];

  /* ---------------- 图标 ---------------- */
  function icon(kind) {
    const S = {
      floppy: `<svg viewBox="0 0 32 32"><rect x="5" y="4" width="22" height="24" rx="1" fill="#2a2a5a"/><rect x="10" y="4" width="12" height="9" fill="#c8c8d8"/><rect x="13" y="5" width="6" height="7" fill="#8888a0"/><rect x="8" y="17" width="16" height="11" fill="#e8e8f0"/><rect x="10" y="19" width="12" height="1.6" fill="#999"/><rect x="10" y="22" width="12" height="1.6" fill="#999"/><rect x="10" y="25" width="8" height="1.6" fill="#999"/></svg>`,
      diskC: `<svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="2" fill="#8ab0e0" stroke="#4a6a9e"/><rect x="6" y="9" width="20" height="8" rx="1" fill="#dce8f8"/><text x="16" y="15.5" font-size="8" font-family="Tahoma" font-weight="bold" fill="#2a4a8a" text-anchor="middle">C</text><rect x="6" y="19" width="20" height="5" rx="1" fill="#4a6a9e" opacity="0.35"/></svg>`,
      diskD: `<svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="2" fill="#c8d89a" stroke="#7a8a4e"/><rect x="6" y="9" width="20" height="8" rx="1" fill="#eef4dc"/><text x="16" y="15.5" font-size="8" font-family="Tahoma" font-weight="bold" fill="#4a6a1a" text-anchor="middle">D</text><rect x="6" y="19" width="20" height="5" rx="1" fill="#7a8a4e" opacity="0.35"/></svg>`,
      cd: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#d8d8e8" stroke="#888"/><circle cx="16" cy="16" r="12" fill="none" stroke="#a8c8f0" stroke-width="3" stroke-dasharray="4 8"/><circle cx="16" cy="16" r="3.5" fill="#f8f8ff" stroke="#888"/></svg>`,
      usb: `<svg viewBox="0 0 32 32"><rect x="11" y="4" width="10" height="16" rx="2" fill="#4a5a7a"/><rect x="12" y="20" width="8" height="9" rx="2" fill="#6a7a9a"/><rect x="13" y="6" width="2.6" height="3" fill="#d8d8d8"/><rect x="17" y="6" width="2.6" height="3" fill="#d8d8d8"/><path d="M15 22 l2 0 0 4 -2 0 z" fill="#d8d8d8"/></svg>`,
      folder: `<svg viewBox="0 0 32 32"><path d="M3 8 L12 8 L15 12 L29 12 L29 27 L3 27 Z" fill="#f0c36a" stroke="#a3801f"/><rect x="5" y="15" width="22" height="10" fill="#f8dfa0" opacity="0.7"/></svg>`,
      film: `<svg viewBox="0 0 32 32"><rect x="5" y="7" width="22" height="18" rx="1" fill="#3a7a4a" stroke="#1e5a2a"/><rect x="7" y="9" width="18" height="10" fill="#8ac89a"/><g fill="#1e5a2a"><rect x="7" y="9" width="3" height="2"/><rect x="7" y="13" width="3" height="2"/><rect x="7" y="17" width="3" height="2"/><rect x="22" y="9" width="3" height="2"/><rect x="22" y="13" width="3" height="2"/><rect x="22" y="17" width="3" height="2"/></g></svg>`,
      exe: `<svg viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="2" fill="#e8e8f0" stroke="#7a7a8a"/><rect x="6" y="19" width="20" height="7" rx="2" fill="#2a6bd6"/><text x="16" y="24.5" font-size="6" font-family="Tahoma" fill="#fff" text-anchor="middle">exe</text></svg>`,
      doc: `<svg viewBox="0 0 32 32"><path d="M7 3 L21 3 L26 8 L26 29 L7 29 Z" fill="#fff" stroke="#7a7a8a"/><path d="M21 3 L21 8 L26 8 Z" fill="#d8e8f8" stroke="#7a7a8a"/><path d="M10 14 h12 M10 17 h12 M10 20 h8" stroke="#2a6bd6" stroke-width="1.4"/></svg>`,
      mp3: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#e8e8f0" stroke="#7a7a8a"/><path d="M13 21 V9 L22 7 V19" fill="none" stroke="#e07a2a" stroke-width="2"/><circle cx="11.5" cy="21.5" r="2.6" fill="#e07a2a"/><circle cx="20.5" cy="19.5" r="2.6" fill="#e07a2a"/></svg>`,
      srt: `<svg viewBox="0 0 32 32"><path d="M7 3 L21 3 L26 8 L26 29 L7 29 Z" fill="#fffdf0" stroke="#7a7a8a"/><path d="M21 3 L21 8 L26 8 Z" fill="#f0e8c8" stroke="#7a7a8a"/><rect x="9" y="14" width="14" height="7" rx="1.5" fill="#2a2a2a"/><text x="16" y="19.5" font-size="5" font-family="Tahoma" fill="#ffd24a" text-anchor="middle">对话</text></svg>`,
      img: `<svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="1" fill="#fff" stroke="#7a7a8a"/><circle cx="11" cy="12" r="2.4" fill="#f0c030"/><path d="M6 24 L13 16 L18 21 L23 14 L27 24 Z" fill="#7ab06a"/></svg>`,
      rar: `<svg viewBox="0 0 32 32"><path d="M8 3 L24 3 L24 29 L16 25 L8 29 Z" fill="#e8b8b8" stroke="#9a5a5a"/><path d="M16 6 v6 M16 10 h5 M16 13 h5" stroke="#9a5a5a" stroke-width="1.6"/></svg>`,
      ppt: `<svg viewBox="0 0 32 32"><path d="M7 3 L21 3 L26 8 L26 29 L7 29 Z" fill="#fff" stroke="#7a7a8a"/><path d="M21 3 L21 8 L26 8 Z" fill="#f0d8d8" stroke="#7a7a8a"/><rect x="10" y="13" width="9" height="10" rx="1" fill="#c04040"/><path d="M19 15 h3 v3 h-3" fill="#c04040"/></svg>`,
      map: `<svg viewBox="0 0 32 32"><path d="M5 8 L12 5 L20 8 L27 5 L27 25 L20 28 L12 25 L5 28 Z" fill="#c8e0b8" stroke="#6a8a5a"/><path d="M12 5 L12 25 M20 8 L20 28" stroke="#6a8a5a" stroke-dasharray="2 3"/></svg>`,
    };
    return S[kind] || S.folder;
  }

  /* ---------------- XP 消息框 ---------------- */
  function xpMsg(title, text, opts) {
    opts = opts || {};
    WM.open({
      id: 'xpmsg-' + Math.random().toString(36).slice(2, 7),
      title: title, icon: opts.icon || ICONS.mycomputer,
      w: 380, h: 160, min: false,
      content: `
        <div style="display:flex;flex-direction:column;height:100%;padding:12px 14px;">
          <div style="display:flex;gap:12px;flex:1;align-items:flex-start;">
            <div style="width:32px;height:32px;flex:none;">
              ${opts.warn
                ? '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#f5c0c0" stroke="#a02020"/><path d="M15 8 h2 v12 h-2 Z" fill="#a02020"/><circle cx="16" cy="24" r="1.8" fill="#a02020"/></svg>'
                : '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#c0d8f8" stroke="#2a5aaa"/><path d="M15 8 h2 v12 h-2 Z" fill="#2a5aaa"/><circle cx="16" cy="24" r="1.8" fill="#2a5aaa"/></svg>'}
            </div>
            <div style="line-height:1.7;font-size:12px;">${text}</div>
          </div>
          <div style="display:flex;justify-content:center;gap:10px;flex:none;">
            <button class="xp-btn primary" style="min-width:80px;">确定</button>
            ${opts.cancel ? '<button class="xp-btn" style="min-width:80px;">取消</button>' : ''}
          </div>
        </div>`,
      onOpen(rec) {
        const btns = rec.body.querySelectorAll('.xp-btn');
        btns[0].addEventListener('click', () => {
          if (opts.onOk) opts.onOk(rec);
          WM.close(rec.id);
        });
        if (btns[1]) btns[1].addEventListener('click', () => WM.close(rec.id));
      },
    });
  }

  /* ---------------- 文件管理器主控 ---------------- */
  let mgr = null;

  function MyComputer(rec, initialView) {
    this.rec = rec;
    this.body = rec.body;
    this.path = initialView || 'mycomputer';
    this.stack = [];
    this.recycle = RECYCLE.map(r => Object.assign({}, r));
    this.render();
  }

  MyComputer.prototype = {

    /* ---- 渲染窗口骨架（XP 资源管理器风） ---- */
    render() {
      const isRecycle = this.path === 'recycle';
      this.body.innerHTML = `
        <div class="xp-menubar">
          <div class="m-item">文件(F)</div><div class="m-item">编辑(E)</div>
          <div class="m-item">查看(V)</div><div class="m-item">收藏(A)</div>
          <div class="m-item">工具(T)</div><div class="m-item">帮助(H)</div>
        </div>
        <div class="xp-toolbar">
          <button class="xp-btn" id="mc-back" style="min-width:52px;">⬅ 后退</button>
          <button class="xp-btn" id="mc-up" style="min-width:52px;">⬆ 向上</button>
          <span style="width:10px;"></span>
          <span style="color:#444;">地址(D)</span>
          <div class="xp-input" id="mc-addr" style="flex:1;background:#fff;display:flex;align-items:center;gap:6px;overflow:hidden;">
            <span style="width:16px;height:16px;flex:none;">${icon(isRecycle ? 'floppy' : 'folder')}</span>
            <span id="mc-addr-text" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></span>
          </div>
          <button class="xp-btn" id="mc-go" style="min-width:40px;">转到</button>
        </div>
        <div style="flex:1;display:flex;overflow:hidden;">
          <div style="width:190px;flex:none;background:linear-gradient(180deg,#7ba4e8,#6a94dd 30%,#5a86d4);overflow:auto;padding:6px 0;" class="xp-scroll" id="mc-left"></div>
          <div style="flex:1;overflow:auto;background:#fff;padding:8px;" class="xp-scroll" id="mc-right"></div>
        </div>
        <div class="xp-statusbar">
          <div class="sb-block" id="mc-count" style="flex:1;">&nbsp;</div>
          <div class="sb-block" style="flex:none;">我的电脑</div>
        </div>`;

      this.body.querySelector('#mc-back').addEventListener('click', () => this.back());
      this.body.querySelector('#mc-up').addEventListener('click', () => this.up());
      this.body.querySelector('#mc-go').addEventListener('click', () => {
        WM.balloon({ title: '本馆注', text: '地址栏是装饰：这台机器的世界只有 A:~E: 和 H:。', timeout: 5000 });
      });
      this.paint();
    },

    /* ---- 左侧蓝带 ---- */
    leftPane() {
      const isRecycle = this.path === 'recycle';
      const isMyDoc = this.path === 'mydoc';
      const el = this.body.querySelector('#mc-left');
      let sys = isRecycle
        ? ['清空回收站', '还原所有项目']
        : ['查看系统信息', '添加/删除程序', '更改一个设置'];
      let other = ['我的文档', '我的电脑', '网上邻居'];
      const group = (title, items, id) => `
        <div style="background:#5a86d4;color:#fff;font-weight:bold;padding:3px 10px;margin-top:6px;">${title}</div>
        ${items.map((t, i) => `<div class="mc-task" data-g="${id}" data-i="${i}">${t}</div>`).join('')}`;
      el.innerHTML = `
        <div style="color:#fff;text-align:center;font-weight:bold;margin-bottom:2px;">
          ${isRecycle ? '回收站任务' : '系统任务'}
        </div>
        ${group(isRecycle ? '回收站任务' : '系统任务', sys, 'sys')}
        ${group('其他位置', other, 'other')}
        <div style="margin-top:14px;padding:6px 10px;color:#dbe6f8;font-size:11px;line-height:1.6;">
          本馆注：左侧任务窗格是 XP「我的电脑」的招牌界面元素。
        </div>`;
      el.querySelectorAll('.mc-task').forEach(t => {
        t.addEventListener('click', () => this.task(t.dataset.g, +t.dataset.i));
      });
    },

    task(g, i) {
      if (g === 'sys') {
        if (this.path === 'recycle') {
          if (i === 0) this.emptyRecycle();
          else this.restoreAll();
          return;
        }
        if (i === 0) xpMsg('系统属性', 'Windows XP Professional SP2<br>注册到: 张伟<br>Intel(R) Pentium(R) Dual-Core E2140 @1.60GHz<br>1.00GB RAM<br>（依据 data/persona.js 硬件配置）');
        else if (i === 1) xpMsg('添加或删除程序', '当前安装程序：<br>腾讯QQ2007 ‖ 迅雷5 ‖ 暴风影音 ‖ 千千静听<br>瑞星杀毒 ‖ WinRAR ‖ Office 2003 精简版<br>（research/software.md §3 装机必备清单）');
        else xpMsg('显示属性', '主题: Windows XP 蓝色<br>壁纸: Bliss（蓝天草地）');
      } else {
        if (i === 0) this.open('mydoc');
        else if (i === 1) this.open('mycomputer');
        else xpMsg('网上邻居', '工作组 MSHOME 里暂时没有其他计算机。<br>（宿舍局域网的其他机器还没开机）');
      }
    },

    /* ---- 右侧内容 ---- */
    paint() {
      this.leftPane();
      const right = this.body.querySelector('#mc-right');
      const addr = this.body.querySelector('#mc-addr-text');
      const count = this.body.querySelector('#mc-count');

      if (this.path === 'recycle') { this.paintRecycle(); return; }

      const isRoot = this.path === 'mycomputer' || this.path === 'mydoc';
      const node = isRoot ? FS[this.path] : this.currentList();

      if (isRoot) {
        addr.textContent = this.path === 'mycomputer' ? '我的电脑' : '我的文档';
        right.innerHTML = node.items.map((it, i) => `
          <div class="mc-item" data-i="${i}">
            <span class="mc-ico">${icon(it.icon)}</span>
            <span class="mc-name">${it.name}</span>
            <span class="mc-type">${it.type || ''}</span>
            <span class="mc-size">${it.size || ''}</span>
            <span class="mc-free">${it.free ? '可用 ' + it.free : ''}</span>
          </div>`).join('');
        count.textContent = node.items.length + ' 个对象';
        right.querySelectorAll('.mc-item').forEach(el => {
          el.addEventListener('dblclick', () => this.openItem(node.items[+el.dataset.i]));
          el.addEventListener('click', () => {
            right.querySelectorAll('.mc-item').forEach(x => x.classList.remove('sel'));
            el.classList.add('sel');
            const it = node.items[+el.dataset.i];
            count.textContent = it.free ? `${it.name} ‖ 可用 ${it.free}` : it.type;
          });
        });
      } else {
      const parts = this.path.split('/');
      const root = parts[0];
      let addrText = '我的电脑';
      if (root === 'C:') addrText = 'C:\\' + parts.slice(1).join('\\');
      if (root === 'D:') addrText = 'D:\\' + parts.slice(1).join('\\');
      if (root === 'H:') addrText = 'H:\\' + parts.slice(1).join('\\');
      if (this.path.indexOf('mydoc/') === 0) addrText = '我的文档\\' + parts.slice(1).join('\\');
      addr.textContent = addrText;
        const items = node || [];
        right.innerHTML = items.length ? items.map((it, i) => `
          <div class="mc-item" data-i="${i}">
            <span class="mc-ico">${icon(it.icon)}</span>
            <span class="mc-name">${it.name}</span>
            <span class="mc-type">${it.type || '文件文件夹'}</span>
            <span class="mc-size">${it.size || ''}</span>
          </div>`).join('') :
          '<div style="color:#888;padding:20px;text-align:center;">该文件夹为空。</div>';
        count.textContent = items.length + ' 个对象';
        right.querySelectorAll('.mc-item').forEach(el => {
          el.addEventListener('dblclick', () => this.openItem(items[+el.dataset.i]));
          el.addEventListener('click', () => {
            right.querySelectorAll('.mc-item').forEach(x => x.classList.remove('sel'));
            el.classList.add('sel');
          });
        });
      }
    },

    currentList() {
      const parts = this.path.split('/');
      let list;
      if (parts[0] === 'C:') list = FS['C:'];
      else if (parts[0] === 'D:') list = FS['D:'];
      else if (parts[0] === 'H:') list = FS['H:'];
      else if (parts[0] === 'mydoc') list = FS['mydoc'].items;
      else return [];
      for (let i = 1; i < parts.length; i++) {
        const found = (list || []).find(it => it.name === parts[i]);
        list = found ? found.list : [];
      }
      return list;
    },

    /* ---- 打开条目 ---- */
    openItem(it) {
      if (it.danger) {
        /* 学习资料.exe 警告彩蛋 */
        WM.balloon({
          title: '瑞星杀毒软件',
          icon: ICONS.rising,
          text: '发现病毒！Trojan.PSW.QQPass（QQ 盗号木马）<br>建议：立即删除。请不要随手双击来路不明的 exe。',
          timeout: 9000,
        });
        xpMsg('瑞星杀毒软件 - 发现病毒',
          '<b>文件：D:\\学习资料.exe</b><br>病毒名：Trojan.PSW.QQPass（QQ 盗号木马）<br><br>2007 年 QQ 盗号木马与「信封」产业链正盛（research/software.md §4.3）。此文件建议删除。',
          { warn: true });
        return;
      }
      if (it.msg && !it.list && !it.folders) {
        xpMsg(it.name, esc(it.msg).replace(/\n/g, '<br>'));
        return;
      }
      if (it.msg) { xpMsg(it.name, esc(it.msg).replace(/\n/g, '<br>')); }
      if (it.list || it.drive) {
        /* 双击驱动器或文件夹：进入浏览 */
        this.stack.push(this.path);
        const child = (this.path === 'mycomputer')
          ? (it.drive || this.path)
          : (this.path === 'mydoc' ? 'mydoc/' + it.name : this.path + '/' + it.name);
        this.path = child;
        this.paint();
      } else if (!it.msg) {
        xpMsg(it.name, '文件点击提示：' + esc(it.name) + '<br>类型: ' + (it.type || '文件') + (it.size ? '<br>大小: ' + it.size : ''));
      }
    },

    open(view) {
      this.stack.push(this.path);
      this.path = view;
      this.paint();
    },

    back() {
      if (this.stack.length) { this.path = this.stack.pop(); this.paint(); }
    },

    up() {
      if (this.path === 'recycle' || this.path === 'mycomputer') return;
      const parts = this.path.split('/');
      if (this.path === 'mydoc') { this.path = 'mycomputer'; this.paint(); return; }
      if (parts.length === 1) { this.path = 'mycomputer'; this.paint(); return; }
      parts.pop();
      this.path = parts.join('/');
      this.paint();
    },

    /* ---- 回收站 ---- */
    paintRecycle() {
      const right = this.body.querySelector('#mc-right');
      const addr = this.body.querySelector('#mc-addr-text');
      const count = this.body.querySelector('#mc-count');
      addr.textContent = '回收站';
      if (!this.recycle.length) {
        right.innerHTML = '<div style="color:#888;padding:40px;text-align:center;font-size:14px;">回收站是空的。<br><span style="font-size:11px;">（刚清空过？被误删的文件就找不回来了——2007 年没有云端回收站）</span></div>';
        count.textContent = '0 个对象';
        return;
      }
      right.innerHTML = this.recycle.map((f, i) => `
        <div class="mc-item" data-i="${i}">
          <span class="mc-ico">${icon(f.icon)}</span>
          <span class="mc-name">${f.name}</span>
          <span class="mc-type">原位置 ${f.from}</span>
          <span class="mc-size">${f.size}</span>
          <span class="mc-free">删除于 ${f.deleted}</span>
        </div>`).join('');
      count.textContent = this.recycle.length + ' 个对象';
      right.querySelectorAll('.mc-item').forEach(el => {
        el.addEventListener('click', () => {
          right.querySelectorAll('.mc-item').forEach(x => x.classList.remove('sel'));
          el.classList.add('sel');
        });
        el.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const f = this.recycle[+el.dataset.i];
          showCtxMenu(e.clientX, e.clientY, [
            { text: '还原(E)', action: () => this.restore(f) },
            { text: '删除(D)', action: () => this.destroy(f) },
            '-',
            { text: '属性(R)', disabled: true },
          ]);
        });
        el.addEventListener('dblclick', () => {
          xpMsg('回收站', '该文件位于回收站中。<br>右键可以「还原」或「删除」。');
        });
      });
    },

    restore(f) {
      this.recycle = this.recycle.filter(x => x !== f);
      if (f.from.indexOf('学习') >= 0) {
        const study = FS['D:'].find(it => it.name === '学习');
        if (study) study.list.push({ name: f.name, type: f.type, size: f.size, icon: 'doc', msg: '从回收站还原的文件——高数补考还有救。' });
      }
      WM.balloon({ title: '回收站', text: `已将「${f.name}」还原到 ${f.from}。`, timeout: 6000 });
      this.paintRecycle();
    },

    restoreAll() {
      if (!this.recycle.length) return;
      this.recycle.forEach(f => {
        if (f.from.indexOf('学习') >= 0) {
          const study = FS['D:'].find(it => it.name === '学习');
          if (study) study.list.push({ name: f.name, type: f.type, size: f.size, icon: 'doc', msg: '从回收站还原的文件。' });
        }
      });
      const n = this.recycle.length;
      this.recycle = [];
      WM.balloon({ title: '回收站', text: `已还原 ${n} 个对象到原位置。`, timeout: 6000 });
      this.paintRecycle();
    },

    destroy(f) {
      this.recycle = this.recycle.filter(x => x !== f);
      this.paintRecycle();
    },

    emptyRecycle() {
      if (!this.recycle.length) { this.paintRecycle(); return; }
      xpMsg('确认删除多个文件',
        '确实要删除这 ' + this.recycle.length + ' 个项目吗？<br><span style="color:#666;">（这一删就真没了——2007 年没有云端回收站）</span>',
        { warn: true, cancel: true, onOk: () => { this.recycle = []; this.paintRecycle(); } });
    },
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------------- 样式 ---------------- */
  const CSS = `
  #mc-right .mc-item { display:flex; align-items:center; gap:8px; padding:4px 6px; border-bottom:1px solid #eee;
    font-size:12px; }
  #mc-right .mc-item:hover { background:#f0f6ff; }
  #mc-right .mc-item.sel { background:#316ac5; color:#fff; }
  #mc-right .mc-item.sel .mc-type, #mc-right .mc-item.sel .mc-size, #mc-right .mc-item.sel .mc-free { color:#dbe6f8; }
  #mc-right .mc-ico { width:30px; height:30px; flex:none; display:flex; align-items:center; }
  #mc-right .mc-ico svg { width:28px; height:28px; }
  #mc-right .mc-name { width:220px; flex:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #mc-right .mc-type { flex:1; color:#666; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #mc-right .mc-size { width:70px; flex:none; text-align:right; color:#444; }
  #mc-right .mc-free { width:90px; flex:none; text-align:right; color:#444; }
  .mc-task { color:#fff; padding:4px 10px 4px 18px; font-size:12px; cursor:default; }
  .mc-task:hover { text-decoration:underline; color:#fff; background:rgba(255,255,255,.12); }
  #mc-left::-webkit-scrollbar { width:10px; }`;

  /* ---------------- 注册 ---------------- */
  function ensureCss() {
    if (!document.getElementById('mycomputer-css')) {
      const st = document.createElement('style');
      st.id = 'mycomputer-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
  }

  APPS.mycomputer = {
    title: '我的电脑',
    icon: ICONS.mycomputer,
    desktop: true,
    order: 5,
    hint: '张伟的硬盘：D 盘装着电影、游戏和 1450 元手机之外的全部生活',
    launch(view) {
      ensureCss();
      const v = view || 'mycomputer';
      const rec = WM.open({
        id: 'mycomputer-' + v,
        title: v === 'mydoc' ? '我的文档' : v === 'recycle' ? '回收站' : '我的电脑',
        icon: v === 'recycle' ? ICONS.recycle : ICONS.mycomputer,
        w: 640, h: 480, max: true,
      });
      if (!rec._mc) rec._mc = new MyComputer(rec, v);
      return rec;
    },
  };

  APPS.recycle = {
    title: '回收站',
    icon: ICONS.recycle,
    desktop: true,
    order: 9,
    hint: '里面躺着两个不该删的文件',
    launch() { return APPS.mycomputer.launch('recycle'); },
  };

})();
