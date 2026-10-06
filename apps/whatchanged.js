/* ============================================================
   apps/whatchanged.js —— 「2007 → 2026：七个维度的对照」
   2026 馆长视角。左列 2007（做旧泛黄），右列 2026（冷白）。
   数字与事实来自 research/internet.md §8.3 等研究档案。
   ============================================================ */

(function () {

  const DIMS = [
    {
      id: 'info', name: '信息获取', icon: 'search',
      y07: [
        '「百度一下，你就知道」——但搜到的是十条网页，答案要自己拼。',
        '问一个问题，去贴吧发帖、知道提问，等待回复以小时甚至天计。',
        '新闻由门户首页编辑手工排版：新浪搜狐的头条就是全国的头条。',
      ],
      y26: [
        '问题直接问 AI，得到一段综合好的答案——「找信息」这个动作消失了。',
        '搜索入口被推荐流分流：很多用户一天没有主动搜过任何东西。',
        '头条由算法分发，每人一份：已经没有「全国的头条」这种东西。',
      ],
    },
    {
      id: 'social', name: '社交', icon: 'chat',
      y07: [
        'QQ 好友几百人已算多，分组管理、上线隐身是必修课。',
        '短信一毛一条：每条都要斟酌，月初数着条数过日子（动感地带 10 元 300 条是 2003–2005 年定价）。',
        '校园 BBS 按版面实名（校内 IP）讨论，「灌水」是日常动词。',
      ],
      y26: [
        '微信好友以千计，但「常联系」的仍然只有那几个。',
        '消息无限量、随时已读已回——斟酌的成本从资费转移到了注意力。',
        '公共讨论散落在评论区与弹幕，没有固定广场：来得快，散得更快。',
      ],
    },
    {
      id: 'identity', name: '身份', icon: 'id',
      y07: [
        'QQ 号是第二身份：等级（太阳）、Q 币余额、QQ 秀构成一个人的「资产」。',
        '网名是另一个人格：论坛 ID 与实名并存，没人觉得割裂。',
        '校内网第一次要求「真名真学校」，当时被视作新鲜事。',
      ],
      y26: [
        '手机号+实名制贯穿一切账号；「匿名上网」成了需要解释的概念。',
        '等级与虚拟装扮换成了会员体系与数字藏品，逻辑没变，规模变了百倍。',
        '社交档案与本人合一：线上形象就是形象本身，没有「下线」。',
      ],
    },
    {
      id: 'privacy', name: '隐私', icon: 'lock',
      y07: [
        '最大威胁是病毒与盗号：熊猫烧香式的入侵让 QQ 号、Q 币一夜易主。',
        '「隐身」是对熟人开的；对陌生人，网络天然匿名。',
        '杀毒软件、防火墙是装机必买项——威胁是「外来的」。',
      ],
      y26: [
        '数据被默认收集：便利与隐私的交换在注册协议里一次性完成。',
        '「隐身」选项没有了：不在线这件事本身也是信息。',
        '威胁从「外来的病毒」变成「内嵌的推荐」——防御对象从木马变成注意力。',
      ],
    },
    {
      id: 'speed', name: '速度', icon: 'bolt',
      y07: [
        '一部 700MB 电影下载 1–4 小时（2M ADSL），挂迅雷是睡前的固定动作。',
        '一首 MP3 下载约 50–100 秒；打开一个网页 3–8 秒。',
        'P2P 在线视频起播前要缓冲约 30 秒——「卡」是生活质感的一部分。',
      ],
      y26: [
        '按下播放即开播，「下载」对多数用户不再是可感知的步骤。',
        '千兆入户、5G 随身：带宽价格跌去两个数量级，四人分摊网费成为历史名词。',
        '等待消失后，「缓冲」变成了一个需要向年轻人解释的旧词。',
      ],
    },
    {
      id: 'algo', name: '算法与社区', icon: 'flow',
      y07: [
        '内容分发靠人工：斑竹置顶、贴吧吧主、门户编辑——权力看得见、骂得着。',
        '帖子靠「顶」上浮，一个版面的热帖全站共享同一时间线。',
        '社区有边界（校园网、版面、房间号），越界需要主动注册。',
      ],
      y26: [
        '分发交给推荐算法：效率极高，但没人能说清某条内容为什么出现在自己面前。',
        '信息流千人千面：不再有全站共享的热帖，共识的形成变难了。',
        '社区边界溶解，圈子靠兴趣实时聚合、实时解散。',
      ],
    },
    {
      id: 'creation', name: '内容生产', icon: 'mic',
      y07: [
        '普通人的创作= 论坛发帖、QQ 空间日志；器材门槛（DV、相机）挡住了大多数人。',
        '最专业的那批业余者在做字幕组：10 小时出片的志愿流水线，不署真名、不收钱。',
        '「红」靠转载与顶帖，没有平台分成，创作不为变现。',
      ],
      y26: [
        '手机即创作工具：短视频、直播把表达门槛降到零。',
        '字幕组式协作进化为 MCN 流水线：速度不变，署名与收入都变了。',
        '创作直接挂接变现——为爱发电和为算法发电并存，后者产能碾压前者。',
      ],
    },
  ];

  const HARDEST = [
    { t: '「下载」按钮去哪了',
      b: '想给同学拷一部电影，发现没有文件可拷——内容不再以「占有」的形式存在，按播放即开播。2007 年那 1–4 小时的等待，换来的是一份可以反复看、可以传下去的 700MB 资产。' },
    { t: '短信不要钱了，但没人发短信',
      b: '一毛一条、按条计费的年代，每条短信都是被斟酌过的。无限量的消息到来后，斟酌没有变便宜——只是换成了「秒回」的压力。' },
    { t: '照片留在手机里，不再变成纸',
      b: '2007 年照片要去打印店变成实体（0.1–0.3 元一张），准考证、简历都要过这一关。今天打印店成了特意寻找的场所——数字文件默认永不落纸。' },
  ];

  const ICON = {
    search: `<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15 L21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    chat:   `<svg viewBox="0 0 24 24"><path d="M3 4 h18 v13 h-10 l-5 4 v-4 h-3 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 9 h10 M7 13 h6" stroke="currentColor" stroke-width="1.6"/></svg>`,
    id:     `<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14.5" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="11" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.8 17 Q8 13.5 11.2 17" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M14 9.5 h6 M14 13 h4.5" stroke="currentColor" stroke-width="1.6"/></svg>`,
    lock:   `<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10 V7 Q8 3.5 12 3.5 Q16 3.5 16 7 V10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="15" r="1.6" fill="currentColor"/></svg>`,
    bolt:   `<svg viewBox="0 0 24 24"><path d="M13 2 L5 13 h6 L10 22 L19 10 h-6 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    flow:   `<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 6 Q13 6 15.5 12 M8.5 18 Q13 18 15.5 12 M6 8.5 v7" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>`,
    mic:    `<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.5 11 Q5.5 17 12 17 Q18.5 17 18.5 11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 17 v4 M8.5 21 h7" stroke="currentColor" stroke-width="2"/></svg>`,
  };

  const CSS = `
#wc-root { display:flex; flex-direction:column; height:100%; overflow:auto; background:#f2f0ea; }
#wc-root::-webkit-scrollbar { width:9px; } #wc-root::-webkit-scrollbar-thumb { background:#b8b2a4; border-radius:4px; }
#wc-head { flex:none; padding:14px 20px 10px; background:linear-gradient(180deg,#3a2b1c,#2a1d12); color:#e8d9b0;
  border-bottom:3px double #6b4a2b; }
#wc-head .t { font-family:"SimSun",serif; font-size:16px; letter-spacing:2px; font-weight:bold; }
#wc-head .s { font-size:11px; color:#a08a5f; margin-top:4px; line-height:1.7; }
#wc-body { padding:14px 20px 6px; }
.wc-dim { margin-bottom:16px; }
.wc-dim .wc-dt { display:flex; align-items:center; gap:8px; color:#4a3520; font-family:"SimSun",serif;
  font-size:14.5px; font-weight:bold; letter-spacing:1px; margin-bottom:7px; }
.wc-dim .wc-dt svg { width:19px; height:19px; color:#6b4a2b; }
.wc-cols { display:flex; gap:0; border:1px solid #b8b2a4; border-radius:4px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.12); }
.wc-col { width:50%; padding:10px 14px 12px; }
.wc-col.y07 { background:linear-gradient(180deg,#efe6cd,#e6dbbd); border-right:1px dashed #a89a72; }
.wc-col.y07 .yl { color:#8a6f45; font-size:10.5px; letter-spacing:1px; font-weight:bold; margin-bottom:6px; }
.wc-col.y07 li { color:#4a3b22; }
.wc-col.y26 { background:linear-gradient(180deg,#ffffff,#f5f7fa); }
.wc-col.y26 .yl { color:#5a6b80; font-size:10.5px; letter-spacing:1px; font-weight:bold; margin-bottom:6px; }
.wc-col.y26 li { color:#2a3440; }
.wc-col ul { list-style:none; }
.wc-col li { font-size:12px; line-height:1.8; padding-left:14px; position:relative; margin-bottom:3px; }
.wc-col li::before { content:''; position:absolute; left:2px; top:9px; width:5px; height:5px; border-radius:1px; }
.wc-col.y07 li::before { background:#a89a72; }
.wc-col.y26 li::before { background:#7a8ea6; }
/* 最难理解 */
#wc-hard { margin:8px 20px 18px; padding:14px 16px 6px; background:linear-gradient(180deg,#f5ecd7,#e8dcc0);
  border:1px solid #8a6f45; border-radius:4px; }
#wc-hard .h { font-family:"SimSun",serif; font-size:14px; color:#4a3520; font-weight:bold; letter-spacing:1px; margin-bottom:10px; }
#wc-hard .h span { font-weight:normal; font-size:11px; color:#8a6f45; margin-left:8px; letter-spacing:0; }
.wc-hi { display:flex; gap:12px; margin-bottom:12px; }
.wc-hi .n { flex:none; width:26px; height:26px; border-radius:50%; background:#6b4a2b; color:#f5ecd7;
  display:flex; align-items:center; justify-content:center; font-size:13px; font-family:Tahoma; margin-top:2px; }
.wc-hi .t { font-weight:bold; font-size:12.5px; color:#3a2b1c; margin-bottom:3px; }
.wc-hi .b { font-size:11.5px; color:#5c452a; line-height:1.75; }
#wc-foot { padding:8px 20px 14px; color:#8a8474; font-size:10.5px; line-height:1.7; }`;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  APPS.whatchanged = {
    title: '2007→2026 对照',
    icon: ICONS.museum,
    desktop: false,
    order: 12,
    hint: '七个维度的 2007 / 2026 对照',
    launch() {
      if (!document.getElementById('whatchanged-css')) {
        const st = document.createElement('style');
        st.id = 'whatchanged-css';
        st.textContent = CSS;
        document.head.appendChild(st);
      }
      const rec = WM.open({
        id: 'whatchanged',
        title: '2007 → 2026：七个维度',
        icon: ICONS.museum,
        w: 860, h: 620, max: true,
      });
      if (rec.body.dataset.wcInit) { WM.focus('whatchanged'); return rec; }
      rec.body.dataset.wcInit = '1';

      rec.body.innerHTML = `
        <div id="wc-root">
          <div id="wc-head">
            <div class="t">2007 → 2026：七个维度的对照</div>
            <div class="s">左列泛黄的一侧是 2007。所有数字（下载时长、缓冲、资费口径）均来自研究档案 internet.md §8.3、campus.md 等；2026 一侧只做现象对照，不堆砌数字。</div>
          </div>
          <div id="wc-body">
            ${DIMS.map(d => `
              <div class="wc-dim">
                <div class="wc-dt">${ICON[d.icon] || ''}${esc(d.name)}</div>
                <div class="wc-cols">
                  <div class="wc-col y07">
                    <div class="yl">2007</div>
                    <ul>${d.y07.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
                  </div>
                  <div class="wc-col y26">
                    <div class="yl">2026</div>
                    <ul>${d.y26.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
                  </div>
                </div>
              </div>`).join('')}
          </div>
          <div id="wc-hard">
            <div class="h">最后三件小事<span>——2007 年的学生最难理解的，不是技术，是习惯</span></div>
            ${HARDEST.map((h, i) => `
              <div class="wc-hi">
                <div class="n">${i + 1}</div>
                <div><div class="t">${esc(h.t)}</div><div class="b">${esc(h.b)}</div></div>
              </div>`).join('')}
          </div>
          <div id="wc-foot">注：本页 2007 侧的量化事实（700MB=1–4 小时、MP3=50–100 秒、网页 3–8 秒、P2P 缓冲 30 秒）来自 research/internet.md §8.3；动感地带套餐口径来自 research/campus.md §1.5（2003–2005 年定价，需限定）。</div>
        </div>`;
      return rec;
    },
  };

})();
