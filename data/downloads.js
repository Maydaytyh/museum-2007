/* ============================================================
   data/downloads.js —— 迅雷 5 任务数据（window.DOWNLOADDATA）
   时点：2007-10-17（星期三）晚。
   速度依据：research/internet.md —— 宿舍 2M ADSL，晚高峰 HTTP 20–50KB/s，
   BT 好资源 60–110KB/s；700MB 电影约 1–4 小时（本文件只存数据，速度模拟在 apps/thunder.js）。
   跨模块契约：浏览器模拟器调用 window.__DOWNLOADEVENT(key)，key 映射表见 keymap。
   ============================================================ */
(function () {

  window.DOWNLOADDATA = {
    version: '迅雷5  (v5.7.6.425) 简体中文版',
    defaultDir: 'D:\\电影\\',
    /* 「新建任务」弹窗默认填的链接（VeryCD 页面复制的 ed2k） */
    demoURL: 'ed2k://|file|越狱.Prison.Break.S03E04.CHS.RMVB.rmvb|367001600|A4F2C8D1E9B7654300AB12CD34EF5678|h=7Y3U6LRK2DXPJW4CQMFA73OB2TUGVZNE|/',

    /* ---- 跨模块任务 key 映射表（浏览器模拟器调用）---- */
    keymap: {
      prison_break_s03e04: {
        name: '越狱.Prison.Break.S03E04.CHS.RMVB.rmvb',
        sizeMB: 350,
        src: 'BT下载',
        cat: '影视',
        resources: '4/23',
        note: '伊甸园字幕组 S-files · 内嵌中字 · VeryCD 页面添加'
      }
    },

    /* ---- 初始任务状态 ---- */
    initial: {
      /* 进行中（速度由 thunder.js 实时模拟） */
      downloading: [
        {
          name: '越狱.Prison.Break.S03E04.CHS.RMVB.rmvb',
          sizeMB: 350,
          progress: 47,          /* 与暴风影音「下载中 47%」联动 */
          src: 'BT下载',
          cat: '影视',
          resources: '4/23',
          added: '2007-10-17'
        },
        {
          name: '王力宏-改变自己(完整版MV).avi',
          sizeMB: 68,
          progress: 12,
          src: 'HTTP下载',
          cat: '音乐',
          resources: '2/8',
          added: '2007-10-17'
        }
      ],

      /* 已完成（迅雷 5「已完成」分类） */
      done: [
        { name: '[全集]武林外传80集.rmvb', sizeMB: 7168, src: 'BT下载', cat: '影视', date: '2007-09-30' },
        { name: '仙剑奇侠传四.硬盘完整版+免CD补丁.rar', sizeMB: 1560, src: 'BT下载', cat: '游戏', date: '2007-08-19' },
        { name: '魔兽争霸3冰封王座1.20E.硬盘版.rar', sizeMB: 1150, src: 'HTTP下载', cat: '游戏', date: '2007-05-16' },
        { name: '变形金刚.Transformers.TS抢版中字.rmvb', sizeMB: 512, src: 'BT下载', cat: '影视', date: '2007-07-30' },
        { name: '跑跑卡丁车_2007国庆版_官方安装包.exe', sizeMB: 238, src: 'HTTP下载', cat: '软件', date: '2007-10-01' },
        { name: 'Linkin Park - Minutes To Midnight(2007专辑).rar', sizeMB: 71, src: 'HTTP下载', cat: '音乐', date: '2007-05-16' },
        { name: '凤凰传奇-月亮之上_自由飞翔[MV合集].avi', sizeMB: 96, src: 'HTTP下载', cat: '音乐', date: '2007-07-08' },
        { name: '周杰伦-依然范特西[MP3_192k].rar', sizeMB: 58, src: 'ed2k下载', cat: '音乐', date: '2007-03-11' },
        { name: '越狱.Prison.Break.S03E01.中字[伊甸园].rmvb', sizeMB: 348, src: 'BT下载', cat: '影视', date: '2007-09-18' },
        { name: '越狱.Prison.Break.S03E02.中字[伊甸园].rmvb', sizeMB: 344, src: 'BT下载', cat: '影视', date: '2007-09-25' },
        { name: '越狱.Prison.Break.S03E03.中字[伊甸园].rmvb', sizeMB: 351, src: 'BT下载', cat: '影视', date: '2007-10-09' },
        { name: '陈楚生-有没有人告诉你(快男现场版).mp3', sizeMB: 4, src: 'HTTP下载', cat: '音乐', date: '2007-07-22' }
      ],

      /* 失败任务（死链，0KB） */
      failed: [
        {
          name: '满城尽带黄金甲.HD高清收藏版.rmvb',
          sizeMB: 0,
          progress: 0,
          src: 'HTTP下载',
          cat: '影视',
          msg: '任务失败：连接超时，资源不存在（死链，换条链接重试）',
          date: '2007-10-12'
        }
      ],

      /* 垃圾箱（已删除任务，2007 年迅雷经典分类） */
      trash: [
        { name: '传奇世界私服登陆器.exe', sizeMB: 1, date: '2007-10-03', msg: '已删除（瑞星检测到病毒，建议查杀）' }
      ]
    }
  };
})();
