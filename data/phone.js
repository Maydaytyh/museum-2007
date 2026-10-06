/* ============================================================
   data/phone.js —— 诺基亚 5300 模拟器数据
   张伟的红色 5300（行货 1450 元，见 research/hardware.md §2.2）
   日期锚点：2007-10-17（星期三）晚，熄灯后
   ============================================================ */

window.PHONE_DATA = {

  device: {
    model: 'NOKIA 5300 XpressMusic',
    os: 'Nokia OS (Series 40)',
    screen: '2.0 寸 26 万色 QVGA（240×320）',
    operator: '中国移动',
    brand: '动感地带 M-ZONE',
    package: '动感地带 10 元短信包（短信包月，各地条数档位不一）',
    balance: 11.30,       // 剩余话费（元）——彩蛋数字
    battery: 2 / 4,       // 电量格
  },

  /* ---- 短信收件箱 ---- */
  sms: [
    {
      from: '10086', time: '10-17 18:02', unread: true,
      text: '【中国移动】尊敬的客户：截至10月17日18时，您的话费余额为11.30元。本月您已使用动感地带10元短信包套餐内短信217条，剩余83条。余额偏低，请及时充值。查询话费请拨1008611。'
    },
    {
      from: '林晓', time: '10-17 23:12', unread: true, num: '135****4416',
      text: '熄灯了吗'
    },
    {
      from: '林晓', time: '10-17 23:14', unread: true, num: '135****4416',
      text: '我们宿舍刚断电 黑死了 你电脑还能用吗'
    },
    {
      from: '李强', time: '10-17 20:41', num: '138****7709',
      text: 'dota三缺一！速来！就等你了'
    },
    {
      from: '老妈', time: '10-16 19:30', num: '139****3355',
      text: '儿子，周末回来吗？你爸买了螃蟹。天冷了记得加衣服，被子够不够厚？'
    },
    {
      from: '12530', time: '10-17 12:00',
      text: '中国移动无线音乐：凤凰传奇《月亮之上》彩铃劲爆推荐！2元/首，回复1即订，首月免费体验。退订请发送0000至10086。'
    },
  ],

  /* ---- 通讯录 ---- */
  contacts: [
    { name: '林晓',  num: '135 7320 4416', note: '隔壁班' },
    { name: '老妈',  num: '139 4782 3355', note: '家里' },
    { name: '李强',  num: '138 0311 7709', note: '室友 战友' },
    { name: '王超',  num: '134 0351 2288', note: '高中同学' },
    { name: '宿管科', num: '内线 6114',   note: '报修' },
  ],

  /* ---- 手机 QQ（5300 为 S40，跑的是 Java 版手机 QQ）----
     研究注：手机 QQ 2007 Beta1（2007-01 发布）仅支持诺基亚 S60 智能机；
     5300 上跑的是 J2ME Java 版（research/hardware.md §2.2 / qq.md §13A）。 */
  qq: {
    me: { name: '一个人走走', level: '月亮' },
    buddies: [
      { name: '林晓',     status: '在线',   online: true,  face: 'f' },
      { name: '李强',     status: '离开',   online: true,  face: 'm' },
      { name: '王超',     status: '在线',   online: true,  face: 'm' },
      { name: '陈晨',     status: '离线',   online: false, face: 'm' },
      { name: '我的大学', status: '群',     online: true,  face: 'g' },
    ],
    /* 与林晓的历史聊天（23:10–00:40，见 data/persona.js 时间轴） */
    history: [
      { t: '23:10', who: '她', text: '在吗' },
      { t: '23:11', who: '我', text: '在 你怎么还没睡' },
      { t: '23:12', who: '她', text: '刚看完书 你干嘛呢' },
      { t: '23:13', who: '我', text: '挂着越狱 写实验报告' },
      { t: '23:15', who: '她', text: '那个美剧好看吗 我室友都在看' },
      { t: '23:16', who: '我', text: '好看 明天下了我传你' },
      { t: '23:18', who: '她', text: '好~' },
      { t: '23:25', who: '她', text: '今天高数课好困' },
      { t: '23:26', who: '我', text: '呵 我睡了一节' },
      { t: '23:40', who: '她', text: '你说 我们大四毕业了会是什么样' },
      { t: '23:44', who: '我', text: '想那么远干嘛' },
      { t: '23:45', who: '她', text: '随便问问嘛' },
      { t: '00:20', who: '她', text: '困了' },
      { t: '00:21', who: '我', text: '那睡吧 晚安' },
      { t: '00:22', who: '她', text: '晚安 88' },
    ],
    /* 交互回复池（打字慢，一条只有几个字） */
    myReplies: ['嗯', '在写报告', '好', '呵呵', '晚安 88', '在'],
    herReplies: ['嗯嗯', '好呀', '~', '你也是', '早点睡', '88', '呵呵', '在干嘛呢'],
  },

  /* ---- WAP：移动梦网首页（文字链+图片占位质感）---- */
  wap: {
    title: '移动梦网',
    url: 'wap.monternet.com',
    links: [
      { text: '新闻 · 十七大专题', hint: '实时播报' },
      { text: '体育 · 火箭季前赛两连胜，姚明状态火热', hint: '' },
      { text: '天气 · 明日晴 8~19℃', hint: '' },
    ],
    ringtones: [
      { text: '月亮之上', singer: '凤凰传奇', price: '2元/首' },
      { text: '该死的温柔', singer: '马天宇', price: '2元/首' },
      { text: '自由飞翔', singer: '凤凰传奇', price: '2元/首' },
    ],
    other: ['图片下载', '游戏乐园', '手机QQ', '星座运势', '天气预报'],
  },

  /* ---- 音乐播放器（存储卡里的歌，128kbps MP3）----
     曲目依据 research/music.md §3 热歌清单 + persona.js 喜好 */
  music: {
    storage: '存储卡（TF）',
    songs: [
      { title: '菊花台',       artist: '周杰伦',     size: '4.2MB' },
      { title: '夜曲',         artist: '周杰伦',     size: '4.4MB' },
      { title: 'What I\'ve Done', artist: 'Linkin Park', size: '3.9MB' },
      { title: '有没有人告诉你', artist: '陈楚生',   size: '4.1MB' },
      { title: '该死的温柔',   artist: '马天宇',     size: '3.6MB' },
      { title: '有一种爱叫做放手', artist: '阿木',   size: '3.8MB' },
      { title: '月亮之上',     artist: '凤凰传奇',   size: '4.0MB' },
      { title: '秋天不回来',   artist: '王强',       size: '3.5MB' },
      { title: '中国话',       artist: 'S.H.E',      size: '3.7MB' },
    ],
  },

  games: [
    { name: '贪吃蛇 II',      type: '内置' },
    { name: '都市赛车 3D',     type: 'Java' },
    { name: '百战天虫',       type: 'Java' },
  ],
};
