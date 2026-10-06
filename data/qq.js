/* ============================================================
   data/qq.js —— QQ 模拟器数据层（QQDATA）
   时代锚点：2007-10-17（星期三）晚 21:07，QQ2007 II Beta1 时期
   断代依据：
   - 分组命名：research/qq.md §8.6（默认组「我的好友」不可删 + 自建组习惯）
   - 在线状态：§3.4（在线/离开/隐身/离线 + 2007 新增 Q我吧/忙碌/静音）
     注意：2007 年只有「全局隐身」，不存在「隐身对其可见」（§8.1，Q18）
   - 等级图标：§5.2 / §5.5 —— 4 星 = 1 月亮，4 月亮 = 1 太阳（16 级 = 1 太阳，
     32 级 = 2 太阳；「16 级 = 1 个月亮」为网络常见误写，本档案不采用）
   - 活跃天数：D = N² + 4N（2005-08-15 起的制度，2007 年全年沿用，§5.4）
   - 聊天用语：全部选自 research/slang_dictionary.json 的 core 词条，
     并参考 qq.md §13B 词汇表与对话样本的节奏（「在吗」开场、886 收尾、分句短发）
   - 头像：2007 年默认头像为系统企鹅头像系列；自定义头像需太阳等级（§7.2）
   ============================================================ */
window.QQDATA = {

  /* ---------- 我（张伟） ----------
     等级取 16 级 = 1 个太阳（persona.js「16 级上下」；号 2003 年初中注册，
     经历挂机年代，出太阳合理 §5.6）。太阳特权 = 可用自定义头像（§7.2），
     故张伟的头像不是默认企鹅，而是自绘的「弹吉他企鹅」。 */
  me: {
    nick: '浪迹天涯~伟',
    remark: '张伟',
    qq: '4128735**',          // persona.js：2003 年注册的号，显示打码
    level: 16,                 // 16 级 = 1 太阳（research/qq.md §5.5）
    avatar: 'a0',
    signature: '走自己的路，让别人打车去吧……',   // persona.js 原文
  },

  /* ---------- 系统默认企鹅头像（SVG 手绘 8 款变体） ----------
     依据：2007 年非太阳用户只能在默认头像里选（qq.md §7.2 / Q15）。
     隐身/离线时由前端做置灰处理，这里只存彩色原稿。 */
  avatars: {
    /* a0：自定义头像（太阳特权）——抱电吉他的企鹅（电气工程系的自我认知） */
    a0: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="11" rx="8" ry="6.5" fill="#222"/><circle cx="17" cy="10" r="1.6" fill="#fff"/><circle cx="23" cy="10" r="1.6" fill="#fff"/><path d="M18 13 L20 15.5 L22 13 Z" fill="#f5b800"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/><path d="M8 20 L30 14 L31 17 L9 23 Z" fill="#b03030"/><circle cx="12" cy="22" r="1.5" fill="#333"/><circle cx="26" cy="18" r="1.5" fill="#333"/><rect x="9.5" y="23.5" width="2" height="7" fill="#666" transform="rotate(15 10 27)"/></svg>',
    /* a1：经典企鹅（红围巾，最接近托盘图标那只） */
    a1: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="11" rx="8" ry="6.5" fill="#222"/><circle cx="17" cy="10" r="1.6" fill="#fff"/><circle cx="23" cy="10" r="1.6" fill="#fff"/><path d="M18 13 L20 15.5 L22 13 Z" fill="#f5b800"/><path d="M12 18 Q20 14 28 18 Q28 21 20 19.5 Q12 21 12 18" fill="#d43a2f"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/></svg>',
    /* a2：戴蓝帽子的企鹅 */
    a2: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="12" rx="8" ry="6" fill="#222"/><circle cx="17" cy="11" r="1.6" fill="#fff"/><circle cx="23" cy="11" r="1.6" fill="#fff"/><path d="M18 14 L20 16.5 L22 14 Z" fill="#f5b800"/><path d="M11 9 Q20 3 29 9 L29 10 Q20 6 11 10 Z" fill="#2b6fc4"/><rect x="11.5" y="8.5" width="17" height="2" rx="1" fill="#2b6fc4"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/></svg>',
    /* a3：系粉色蝴蝶结的企鹅（女生向） */
    a3: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="11" rx="8" ry="6.5" fill="#222"/><circle cx="17" cy="10" r="1.6" fill="#fff"/><circle cx="23" cy="10" r="1.6" fill="#fff"/><path d="M18 13 L20 15.5 L22 13 Z" fill="#f5b800"/><path d="M12.5 7 L17 9 L12.5 11 Z" fill="#ef7fa8"/><path d="M27.5 7 L23 9 L27.5 11 Z" fill="#ef7fa8"/><circle cx="20" cy="9" r="2" fill="#e56a95"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/></svg>',
    /* a4：背黄色小书包的企鹅 */
    a4: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="11" rx="8" ry="6.5" fill="#222"/><circle cx="17" cy="10" r="1.6" fill="#fff"/><circle cx="23" cy="10" r="1.6" fill="#fff"/><path d="M18 13 L20 15.5 L22 13 Z" fill="#f5b800"/><path d="M9 20 L14 18 L14 30 L9 28 Z" fill="#e8b420"/><rect x="11" y="21" width="2.5" height="4" fill="#a87c10"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/></svg>',
    /* a5：戴眼镜的企鹅（斯文款） */
    a5: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="11" rx="8" ry="6.5" fill="#222"/><circle cx="17" cy="10" r="1.4" fill="#fff"/><circle cx="23" cy="10" r="1.4" fill="#fff"/><circle cx="17" cy="10" r="3" fill="none" stroke="#ddd" stroke-width="1"/><circle cx="23" cy="10" r="3" fill="none" stroke="#ddd" stroke-width="1"/><path d="M20 10 L20 10"/><line x1="20" y1="10" x2="20" y2="10" stroke="#ddd"/><path d="M18 14 L20 16.5 L22 14 Z" fill="#f5b800"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/></svg>',
    /* a6：犯困的企鹅（「离开」状态常客） */
    a6: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="11" rx="8" ry="6.5" fill="#222"/><path d="M15 10 Q17 8.5 19 10 M21 10 Q23 8.5 25 10" stroke="#fff" stroke-width="1.4" fill="none"/><path d="M18 13 L20 15.5 L22 13 Z" fill="#f5b800"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/><text x="28" y="9" font-size="6" fill="#8ab6e8" font-family="Tahoma">z</text><text x="31" y="6" font-size="7" fill="#8ab6e8" font-family="Tahoma">z</text></svg>',
    /* a7：挥着翅膀打招呼的企鹅 */
    a7: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="24" rx="11" ry="12" fill="#222"/><ellipse cx="20" cy="26" rx="7" ry="7.5" fill="#fff"/><ellipse cx="20" cy="11" rx="8" ry="6.5" fill="#222"/><circle cx="17" cy="10" r="1.6" fill="#fff"/><circle cx="23" cy="10" r="1.6" fill="#fff"/><path d="M18 13 L20 15.5 L22 13 Z" fill="#f5b800"/><path d="M9 26 Q4 20 7 16 Q11 19 12 24 Z" fill="#222" stroke="#f5b800" stroke-width="0.8"/><ellipse cx="11" cy="31" rx="3" ry="2" fill="#f5b800"/><ellipse cx="29" cy="31" rx="3" ry="2" fill="#f5b800"/></svg>',
  },

  /* ---------- 分组（§8.6：默认组「我的好友」不可删，其余为自建组） ---------- */
  groups: ['我的好友', '大学同学', '高中同学', '家人', '不认识的人'],

  /* ---------- 好友（张伟 137 个好友中今晚活跃的典型子集）
     status: online=在线 / away=离开 / qme=Q我吧（2007 正式版新状态 §3.2）
             offline=离线 / hidden=隐身（对普通好友显示与离线无异 §8.1）
     等级换算：活跃天数 D = N² + 4N（§5.4） */
  friends: [
    /* ===== 我的好友（默认组；林晓从「高中同学」挪进本组——分组是编年史，§13 场景25） ===== */
    {
      id: 'linxiao', qq: '593204717', nick: '﹏晓。', remark: '林晓', group: '我的好友',
      status: 'hidden', level: 9, avatar: 'a3',
      // 火星文签名，构词参照 §10.3 / §13B 火星文样本（「↘獨自等待」型）
      signature: '↘獨自等待',
    },
    {
      id: 'liqiang', qq: '34189056', nick: '强哥', remark: '李强(室友)', group: '我的好友',
      status: 'online', level: 21, avatar: 'a2',
      signature: 'DOTA就是信仰，浩方见',
    },
    {
      id: 'wanglei', qq: '417286509', nick: '磊哥', remark: '王磊(室友)', group: '我的好友',
      status: 'away', level: 18, avatar: 'a6',
      signature: '明天满课，哭 /大哭',
    },

    /* ===== 大学同学 ===== */
    {
      id: 'chentao', qq: '274581906', nick: '涛哥', remark: '陈涛(班长)', group: '大学同学',
      status: 'online', level: 19, avatar: 'a5',
      signature: '通知都在群里说，别单独Q我',
    },
    {
      id: 'zhaomin', qq: '496157382', nick: '敏敏', remark: '赵敏(学委)', group: '大学同学',
      status: 'qme', level: 13, avatar: 'a3',
      signature: '模电笔记已放群共享，要的自己下',
    },
    {
      id: 'sunpeng', qq: '538204916', nick: 'peng仔', remark: '孙鹏', group: '大学同学',
      status: 'online', level: 11, avatar: 'a1',
      signature: '浩方ID：peng仔，求组',
    },
    {
      id: 'zhoujie', qq: '183045927', nick: '杰哥', remark: '周杰', group: '大学同学',
      status: 'online', level: 24, avatar: 'a2',
      // 2007-09 燃烧的远征刚开（persona.js dayEvents）；「开荒」「公会」均为 slang core 词条
      signature: 'TBC每晚八点，公会开荒KLZ，掉线勿念',
    },
    {
      id: 'wuqian', qq: '615842730', nick: '小倩', remark: '吴倩', group: '大学同学',
      status: 'offline', level: 8, avatar: 'a3',
      signature: '期末求过，5555',
    },
    {
      id: 'zhengkai', qq: '459273610', nick: '凯子', remark: '郑凯', group: '大学同学',
      status: 'online', level: 10, avatar: 'a7',
      signature: '网吧包夜特价，今晚通宵',
    },
    {
      id: 'fenglei', qq: '382640175', nick: '磊少', remark: '冯磊', group: '大学同学',
      status: 'away', level: 12, avatar: 'a1',
      // 千千静听 vs QQ音乐双阵营：qq.md §11.3 / 场景 21
      signature: '千千静听党的耳朵是干净的',
    },
    {
      id: 'heli', qq: '504827361', nick: '丽丽', remark: '何丽', group: '大学同学',
      status: 'online', level: 7, avatar: 'a3',
      signature: '偶是班花，虚心接受反驳 呵呵',
    },
    {
      id: 'maxiaoshuai', qq: '583710462', nick: '小帅', remark: '马小帅', group: '大学同学',
      status: 'offline', level: 5, avatar: 'a7',
      signature: '挂机中，勿扰，帮忙点下偶的宠物',
    },
    {
      id: 'hanmei', qq: '601934758', nick: '梅梅', remark: '韩梅', group: '大学同学',
      status: 'offline', level: 9, avatar: 'a6', signature: '',
    },

    /* ===== 高中同学 ===== */
    {
      id: 'wangfang', qq: '428309165', nick: '芳芳', remark: '王芳', group: '高中同学',
      status: 'qme', level: 12, avatar: 'a3',
      // 校内网为 2007 年当期实名社区（qq.md Q25 / §11.9）
      signature: '校内网看到偶请给偶留言哦～',
    },
    {
      id: 'liuyang', qq: '251486093', nick: '洋仔', remark: '刘洋(老乡)', group: '高中同学',
      status: 'offline', level: 15, avatar: 'a1',
      signature: '大学真没意思，还是想高三',
    },
    {
      id: 'zhangqian', qq: '463091725', nick: '倩姐', remark: '张倩', group: '高中同学',
      status: 'away', level: 10, avatar: 'a3',
      signature: '在图书馆占了4个座，呵呵',
    },
    {
      id: 'guotao', qq: '390845216', nick: '涛~', remark: '郭涛', group: '高中同学',
      status: 'online', level: 14, avatar: 'a5',
      signature: '网吧视频吧，我这有摄像头',
    },
    {
      id: 'xujing', qq: '517938406', nick: '静静', remark: '徐静', group: '高中同学',
      status: 'offline', level: 6, avatar: 'a3',
      // 火星文签名（适量即可，大学生使用率低于中学生，§10.3）
      signature: '頖縭°侞婲羙眷',
    },
    {
      id: 'gaolei', qq: '172830459', nick: '老高', remark: '高磊', group: '高中同学',
      status: 'online', level: 17, avatar: 'a1',
      // 8 位号 = 2001-2003 注册（§6.1）；太阳 = 初中就上网的资历（§5.6）
      signature: '偶的号02年注册的，太阳勿念',
    },

    /* ===== 家人 ===== */
    {
      id: 'mama', qq: '684203971', nick: '妈妈', remark: '老妈', group: '家人',
      status: 'online', level: 3, avatar: 'a4',
      signature: '儿子：看到消息回电话。',
    },
    {
      id: 'baba', qq: '693104587', nick: '爸爸', remark: '老爸', group: '家人',
      status: 'offline', level: 2, avatar: 'a1', signature: '',
    },
    {
      id: 'biaojie', qq: '304827591', nick: '表姐', remark: '表姐', group: '家人',
      status: 'online', level: 20, avatar: 'a3',
      // 挂机大户：20 级 = 480 活跃天（§5.5 对照表）；QQ宠物 2005 年起（§11.2）
      signature: '出差三天，帮偶喂下宠物，谢谢',
    },
    {
      id: 'jiujiu', qq: '586240173', nick: '舅舅', remark: '舅舅', group: '家人',
      status: 'offline', level: 4, avatar: 'a5', signature: '',
    },

    /* ===== 不认识的人 ===== */
    {
      id: 'scam', qq: '882145733', nick: '↘涛_涛', remark: '', group: '不认识的人',
      status: 'online', level: 1, avatar: 'a7',
      // 1 级新注册小号 + 昵称蹭「郭涛」——盗号/冒充的典型特征（§12.1）
      signature: '',
    },
    {
      id: 'yuanfen', qq: '627384015', nick: '缘分★天空', remark: '', group: '不认识的人',
      status: 'offline', level: 2, avatar: 'a7', signature: '网络一线牵，珍惜这段缘',
    },
    {
      id: 'weimei', qq: '594820713', nick: '⺌唯羙isme', remark: '', group: '不认识的人',
      status: 'online', level: 5, avatar: 'a3',
      // 火星文样本「伱湜莪唯一の嗳」：qq.md §13B 火星文样本表
      signature: '伱湜莪唯一の嗳',
    },
    {
      id: 'tiantang', qq: '640271859', nick: '天堂之约', remark: '', group: '不认识的人',
      status: 'offline', level: 6, avatar: 'a1', signature: '',
    },
  ],

  /* ---------- 关键人物剧本 ----------
     结构：opening = 登录后主动发来的消息（d = 与上一条间隔毫秒）；
           steps   = 用户每发一条，机器人推进一组回复；
           shakeReply = 收到「窗口抖动」后的回话（QQ2007 II Beta1，§8.3）。
     节奏规范：「在吗」开场 → 分句短发 → 886 收尾（§8.5 / §8.7 / §13B 对话样本）。 */
  scripts: {

    /* 李强：室友 + DOTA 友。今晚在网吧等他上浩方。
       词汇：在吗 / 7456 / 表(不要) / 求组 / 886 —— 均为 slang core 词条 */
    liqiang: {
      opening: [
        { t: '在吗', d: 0 },
        { t: '在吗在吗', d: 2600 },
        { t: '浩方开了，3缺1，求组', d: 2400 },
        { t: '就等你了，速度 /呲牙', d: 2200 },
      ],
      steps: [
        [
          { t: '你小子从图书馆回来了吧', d: 2000 },
          { t: '快换浩方，房间密码是偶手机号', d: 3000 },
        ],
        [
          { t: '表磨蹭了，猴子都等急了', d: 2500 },
          { t: '昨天那把对面骷髅王真菜，7456 /发怒', d: 3200 },
        ],
        [
          { t: '好了好了，都进房间了', d: 2200 },
          { t: '不聊了，886', d: 2800 },
        ],
      ],
      shakeReply: '抖什么抖，速度上浩方，7456',
      after: '进了进了，别刷屏，88',
    },

    /* 林晓：暗恋的女生。登录时隐身（全局隐身，§8.1），约一分半后上线（敲门声）。
       节奏参照场景 2：她回得慢、话少；最后「困了，下了」收尾。 */
    linxiao: {
      opening: [],   // 不主动说话——今晚得你先开腔（场景 2 的节奏管理）
      steps: [
        [
          { t: '嗯 在', d: 4200 },
        ],
        [
          { t: '刚上没一会儿', d: 3200 },
          { t: '你还没睡？', d: 3800 },
        ],
        [
          { t: '在看《士兵突击》，看到第20集了', d: 3600 },
          { t: '许三多好憨 呵呵', d: 3600 },
        ],
        [
          { t: '困了，下了', d: 4200 },
          { t: '晚安', d: 2400 },
        ],
      ],
      shakeReply: '表抖啦，头都被你抖晕了 呵呵',
      after: '下了 88',
      offlineAfter: true,   // 说完晚安头像变灰（她真的下线了）
    },

    /* 王芳：高中同学，校内网重度用户。开场词参照 §13B 对话样本的「踩空间」礼仪。 */
    wangfang: {
      opening: [
        { t: '在吗在吗', d: 0 },
        { t: '帮偶个忙呗', d: 2200 },
        { t: '去校内给偶的新照片顶一下，帮偶顶到前排', d: 2800 },
      ],
      steps: [
        [
          { t: '3Q3Q /呲牙', d: 2600 },
          { t: '对了，偶刚去你QQ空间踩了，表跑堂哦，回踩秒速到', d: 3200 },
        ],
        [
          { t: '呵呵，你号挂到太阳了？偶才3个月亮，5555', d: 3000 },
          { t: '你晚上反正挂机，顺便帮偶也挂挂嘛', d: 3600 },
        ],
        [
          { t: '不聊了，明天早八，886', d: 3000 },
        ],
      ],
      shakeReply: '哎呀表抖啦，偶正给花藤浇水呢 呵呵',
      after: '下了 886',
    },

    /* 老妈：学会用QQ一年，打字慢（每条间隔很长，语句断成短句）。
       886 是跟儿子学的（§13B：886 为腾讯官方造句例）。 */
    mama: {
      opening: [
        { t: '在吗', d: 0 },
        { t: '是 妈妈呀', d: 7000 },
        { t: '儿子', d: 6000 },
        { t: '吃饭了没有', d: 8000 },
      ],
      steps: [
        [
          { t: '饭卡里的钱', d: 7000 },
          { t: '够不够', d: 6000 },
          { t: '不够就跟妈说，表省', d: 7000 },
        ],
        [
          { t: '你爸让我问你', d: 8000 },
          { t: '元旦回不回来', d: 6000 },
          { t: '回来就早点买票', d: 6000 },
        ],
        [
          { t: '那就好', d: 7000 },
          { t: '早点睡，表老熬夜', d: 7000 },
          { t: '妈妈 下了', d: 8000 },
          { t: '886', d: 5000 },
        ],
      ],
      shakeReply: '儿子，你的窗口怎么在抖，电脑是不是坏了',
      after: '妈妈下了 886',
    },

    /* 陌生号：盗号冒充骗局（2007 真实生态，§12.1 话费充值型）。
       冒充对象：高中同学郭涛（真郭涛今晚在线，可找他对质）。 */
    scam: {
      opening: [
        { t: '在吗', d: 0 },
        { t: '在吗在吗', d: 3000 },
        { t: '我是郭涛，偶号丢了，这个是偶新申请的号', d: 4000 },
      ],
      steps: [
        [
          { t: '偶现在在外地，手机昨天丢了', d: 2600 },
          { t: '能先帮偶充50块话费不', d: 3400 },
          { t: '充到 139****7751 这个号上', d: 3000 },
          { t: '回去马上还你', d: 2600 },
        ],
        [
          { t: '在吗？帮个忙呗，很急的', d: 5000 },
          { t: '去营业厅充，或者买张充值卡把卡号密码发给偶就行', d: 4200 },
        ],
        [
          { t: '你到底在不在啊', d: 6000 },
          { t: '50块也不多是吧 /呲牙', d: 5000 },
        ],
        [
          { t: '算了，偶再问问别人', d: 7000 },
        ],
      ],
      shakeReply: '在吗？看到请回，充话费那个事',
      after: '……',
    },

    /* 郭涛（彩蛋）：找他对质，戳穿盗号骗局。 */
    guotao: {
      opening: [],
      steps: [
        [
          { t: '在 咋了', d: 2400 },
        ],
        [
          { t: '靠，那个号是骗子吧', d: 2400 },
          { t: '偶号好好地挂在自己电脑上呢', d: 3000 },
          { t: '表理他，刚才班里好几个人都收到那种消息了', d: 3400 },
          { t: '盗号的，年底特别多，自己表上当', d: 3000 },
        ],
      ],
      shakeReply: '汗，你抖偶干嘛，有话快说',
      after: '不聊了，网吧按小时算钱呢 88',
    },
  },

  /* ---------- 普通好友的通用回复池（无剧本好友） ---------- */
  genericReplies: [
    '呵呵', '嗯', '9494', 'MS是这样', '汗', '倒', '这样啊',
    '偶也这么觉得 呵呵', 'RPWT，表想太多', '灰常8错 呵呵', '额 汗一个',
  ],
  genericBye: [
    '不聊了，偶下了，886',
    '闪人了，88',
    '有事再Q偶，886',
  ],

  /* ---------- QQ 群（§9.2 大学生三类群：班级 / 游戏 / 老乡） ----------
     群名带①后缀 = 100 人量级上限下「人满开二群」的民俗（§9.3）。 */
  qun: [
    {
      id: 'qclass', name: '电气062班①群', num: '412873215', notice: '请各位把群名片改成真实姓名+学号',
      // 班级群 = 辅导员/班长发通知 + 一排「收到」（§9.2 / 场景 1）
      msgs: [
        { who: '陈涛(班长)', t: '通知：四六级报名本周五截止，要报的把30块报名费交给赵敏', tm: '18:52' },
        { who: '赵敏', t: '收到', tm: '18:53' },
        { who: '周杰', t: '收到', tm: '18:53' },
        { who: '孙鹏', t: '收到 呵呵', tm: '18:54' },
        { who: '马小帅', t: 'SF', tm: '18:55' },
        { who: '冯磊', t: '群共享传了模电往年卷子，要的自己下', tm: '19:40' },
        { who: '赵敏', t: '3Q 冯磊 /微笑', tm: '19:44' },
      ],
    },
    {
      id: 'qdota', name: '3号楼DOTA群', num: '458291306', notice: '约战请自带电脑或去网吧，表蹭别人键盘',
      msgs: [
        { who: '强哥', t: '今晚浩方组一局，3缺1，求组', tm: '20:47' },
        { who: 'peng仔', t: '来了来了，等偶吃完这碗泡面', tm: '20:49' },
        { who: '磊哥', t: '偶刚下了张新地图，版本不对的赶紧升级，不然掉线', tm: '20:52' },
        { who: '强哥', t: '就差伟哥了，他一回来就开 /呲牙', tm: '21:02' },
      ],
    },
    {
      id: 'qlaoxiang', name: '一中老乡会', num: '360518274', notice: '元旦包车回家的在群里说一声',
      msgs: [
        { who: '洋仔', t: '元旦包车回家的举个手，凑满6个人就去找老王订车', tm: '19:05' },
        { who: '倩姐', t: '算偶一个', tm: '19:20' },
        { who: '涛~', t: '顶一个，加偶', tm: '19:33' },
        { who: '洋仔', t: '潜水的都出来冒个泡，表让偶一个个去问', tm: '20:15' },
      ],
    },
  ],

  /* ---------- 群里冒泡回复池（用户在群里说话后随机人接话） ---------- */
  qunReplies: ['收到', '顶', '呵呵', '9494', '+1', '沙发被抢了，板凳也行', '围观', '路过'],

  /* ---------- QQ 空间摘要（只做卡片，§10：博客+留言板+花藤，无任何社交游戏） ---------- */
  qzone: {
    todayVisits: 6,        // 今日被踩 6 次（「踩」的语义见 §10.2）
    popularity: 128,       // 人气值
    msgboard: [
      { who: '芳芳', t: '路过～回踩秒速到，表跑堂哦 呵呵', tm: '昨天 22:14' },
      { who: '⺌唯美isme', t: '踩踩不跑堂，留香在对方', tm: '今天 12:03' },
    ],
    blogs: [
      { title: '十一回家了（照片整理好放相册了）', date: '10-08', reads: 43, comments: 7 },
      { title: '转：强帖，做人要厚道——看完不顶对不起自己', date: '09-30', reads: 61, comments: 12 },
      { title: '开学一个月，相当的累', date: '09-20', reads: 35, comments: 5 },
    ],
    // 花藤四指数（§10.5：阳光/雨露/爱心/营养）
    flower: '阳光 128 / 雨露 46 / 爱心 23 / 营养 9',
  },
};
