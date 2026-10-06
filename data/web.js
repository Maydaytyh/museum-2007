/* ============================================================
   web.js —— window.WEBDATA 历史站点集合（2007-10-17 断代）
   依据：research/social.md（新浪首页实测快照/贴吧/天涯/校内网章节）
        research/music.md（百度 2007 十大 MP3 锚点 §3.1）
   说明：所有站点样式均以 .bd- .xn- .sn- .tb- .ty- .vc- 前缀隔离
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 公共小工具 ---------- */
  function L(url, text, cls) {
    return '<a data-href="' + url + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + text + '</a>';
  }
  function st(id, css) { return '<style id="' + id + '">' + css + '</style>'; }

  /* ============================================================
     一、百度首页（www.baidu.com）
     ============================================================ */
  const BD_CSS = st('bd-css', `
    .bd-wrap { background:#fff; min-height:100%; font:12px/1.7 SimSun,宋体,serif; color:#000; text-align:center; padding:46px 0 30px; }
    .bd-logo svg { width:260px; height:70px; }
    .bd-tabs { margin:14px 0 6px; font-size:13px; }
    .bd-tabs a { color:#00c; margin:0 7px; text-decoration:underline; }
    .bd-tabs .on { color:#c00; font-weight:bold; text-decoration:none; }
    .bd-box { margin:6px auto 4px; }
    .bd-box input[type=text] { width:340px; border:1px solid #7f9db9; padding:3px 4px; font:14px SimSun,宋体; ime-mode:active; }
    .bd-box button { padding:3px 12px; font:13px SimSun,宋体; background:#d6e8f7; border:1px solid #7f9db9; cursor:pointer; }
    .bd-hot { margin:22px 0 0; }
    .bd-hot a { color:#00c; margin:0 6px; text-decoration:underline; }
    .bd-foot { position:absolute; left:0; right:0; bottom:0; padding:8px 0; border-top:1px solid #eee; color:#777; background:#f9f9f9; }
    .bd-foot a { color:#777; text-decoration:underline; }
  `);

  function baiduHome(c) {
    const S = function (q) { return 'www.baidu.com/s?wd=' + encodeURIComponent(q); };
    c.innerHTML = BD_CSS + `
    <div class="bd-wrap">
      <div class="bd-logo"><svg viewBox="0 0 300 78" xmlns="http://www.w3.org/2000/svg">
        <text x="150" y="44" text-anchor="middle" font-size="44" font-weight="bold" fill="#2932e1" font-family="Georgia, Arial">Bai</text>
        <text x="150" y="44" text-anchor="middle" font-size="44" font-weight="bold" fill="#c00" font-family="Georgia, Arial" dx="86">d</text>
        <text x="150" y="44" text-anchor="middle" font-size="44" font-weight="bold" fill="#2932e1" font-family="Georgia, Arial" dx="110">u</text>
        <text x="150" y="70" text-anchor="middle" font-size="19" fill="#2932e1" font-family="SimSun,宋体">百　度</text>
      </svg></div>
      <div class="bd-tabs">新闻　<span class="on">网页</span>　${L('tieba.baidu.com', '贴吧')}　知道　${L('mp3.baidu.com', 'MP3')}　图片　视频</div>
      <form class="bd-box" data-search="www.baidu.com/s?wd={q}">
        <input type="text" name="q" value="">
        <button type="submit">百度一下</button>
      </form>
      <div style="margin-top:4px;color:#666;font-size:12px;">输入关键词，搜索全网网页</div>
      <div class="bd-hot">
        热门搜索：${L(S('十七大'), '十七大')} 　${L(S('嫦娥一号'), '嫦娥一号')} 　${L(S('周杰伦 很忙'), '周杰伦新专辑')} 　${L(S('越狱 第三季'), '越狱第三季')} 　${L(S('魔兽世界 燃烧的远征'), '燃烧的远征')}
      </div>
      <div class="bd-foot">
        ${L('www.baidu.com', '把百度设为首页')} ｜ 加入百度推广 ｜ 搜索风云榜 ｜ 关于百度 About Baidu ｜ ©2007 Baidu　使用百度前必读　京ICP证030173号
      </div>
    </div>`;
  }

  /* ============================================================
     二、百度搜索结果页（www.baidu.com/s?wd=xxx）
     ============================================================ */
  const BD_R_CSS = st('bd-r-css', `
    .bd-r { background:#fff; min-height:100%; font:12px/1.7 SimSun,宋体,serif; }
    .bd-r-top { border-bottom:1px solid #e0e0e0; padding:6px 0 5px; }
    .bd-r-bar { margin:0 auto; width:640px; }
    .bd-r-bar table { width:100%; }
    .bd-r-bar input[type=text] { width:300px; border:1px solid #7f9db9; padding:2px 3px; font:13px SimSun,宋体; }
    .bd-r-bar button { padding:2px 8px; font:12px SimSun,宋体; background:#d6e8f7; border:1px solid #7f9db9; }
    .bd-r-body { width:640px; margin:0 auto; text-align:left; padding:8px 0 20px; }
    .bd-r-body .stats { color:#666; margin-bottom:8px; }
    .bd-r-res { margin-bottom:14px; }
    .bd-r-res .rt { font-size:14px; }
    .bd-r-res .rt a { color:#00c; text-decoration:underline; }
    .bd-r-res .ru { color:#008000; }
    .bd-r-res .snap { color:#666; font-size:12px; }
    .bd-r-res .snap a { color:#666; }
    .bd-r-rel { border-top:1px solid #e0e0e0; padding-top:10px; margin-top:16px; }
    .bd-r-rel a { color:#00c; text-decoration:underline; margin-right:12px; }
    .bd-r-page { text-align:center; margin-top:14px; }
    .bd-r-page a { color:#00c; }
    .bd-r-foot { border-top:1px solid #e0e0e0; text-align:center; color:#777; padding:8px 0 4px; }
  `);

  function bdResult(linkUrl, title, urlShow, snippet) {
    return '<div class="bd-r-res"><div class="rt">' + L(linkUrl, title) + '</div>' +
      '<div class="ru">' + urlShow + ' ' + L(linkUrl, '百度快照') + ' 转载</div>' +
      '<div class="snap">' + snippet + '</div></div>';
  }

  function baiduSearch(q) {
    return function (c) {
      const S = function (x) { return 'www.baidu.com/s?wd=' + encodeURIComponent(x); };
      let res = '';
      if (q.indexOf('周杰伦') > -1 || q.indexOf('很忙') > -1) {
        res =
          bdResult(S('周杰伦 很忙'), '<b>周杰伦</b>第八张专辑《<b>我很忙</b>》11月2日发行 10月22日预售', 'www.sina.com.cn/ent 2007-10-15',
            '…继《依然范特西》之后，周杰伦2007年全新专辑《我很忙》将于<b>11月2日</b>全亚洲同步发行，预售版10月22日推出。专辑收录《牛仔很忙》《彩虹》《青花瓷》等十首作品…') +
          bdResult('tieba.baidu.com/f?kw=周杰伦', '<b>周杰伦</b>吧_百度贴吧', 'tieba.baidu.com',
            '周杰伦粉丝聚集地，最新动态、歌词讨论、演唱会交流。今日话题：新专辑《我很忙》大家最期待哪首歌？') +
          bdResult(S('菊花台'), '《<b>菊花台</b>》- 周杰伦 - 专辑《依然范特西》 - 百度MP3试听', 'mp3.baidu.com',
            '电影《满城尽带黄金甲》片尾曲，2006年发行至今仍是K歌热门曲目…') +
          bdResult(S('周杰伦 演唱会'), '周杰伦2007世界巡回演唱会上海站歌单曝光(图)', 'ent.sina.com.cn 2007-10-11',
            '…周董将献唱《以父之名》《夜曲》等经典曲目，上海站门票销售火爆…') +
          bdResult(S('依然范特西'), '周杰伦 专辑《依然范特西》 全碟歌词', 'www.xiaoge.com',
            '《千里之外》《听妈妈的话》《菊花台》…2006年发行，与费玉清合作曲目《千里之外》传唱大街小巷…');
      } else if (q.indexOf('越狱') > -1 || q.toLowerCase().indexOf('prison') > -1) {
        res =
          bdResult('tieba.baidu.com/f?kw=越狱', '<b>越狱</b>吧_百度贴吧', 'tieba.baidu.com',
            '美剧《越狱》粉丝大本营。本周话题：<b>越狱第三季</b>第4集剧情讨论，Michael能否救出Sara…') +
            bdResult('www.verycd.com/topics/2738461', '<b>越狱 第三季</b> Prison Break S03E04 [HDTV-Rip][中文字幕] - VeryCD分享互联网', 'www.verycd.com',
            '驴友评分4.4/5。YDY字幕组出品，内嵌中文，10月16日发布。资源大小349MB，rmvb格式，ed2k下载…') +
          bdResult(S('越狱 第三季 下载'), '迅雷下载_美剧<b>越狱第三季</b>全集 美剧中文字幕', 'www.xunlei.biz',
            '…越狱 Prison Break 第三季全集下载地址，每周三更新，配合迅雷5使用，资源健康度越高速度越快…') +
          bdResult(S('越狱 剧情'), '美剧《<b>越狱</b>》第三季分集剧情介绍(1-5集)', 'www.meiju.cn',
            '…第三季故事转移到巴拿马索纳监狱，Michael被诬杀人入狱，Lincoln在狱外营救…主演温特沃斯·米勒…') +
          bdResult(S('越狱 米勒'), '温特沃斯·米勒：从模特到"<b>越狱</b>"男一号', 'ent.sina.com.cn',
            '…因主演《越狱》中Michael Scofield一角走红全球，女粉丝称其为"米帅"…');
      } else {
        const qe = q;
        res =
          bdResult(S(qe), '<b>' + qe + '</b>_百度百科', 'baike.baidu.com',
            '百度百科是由网友共同编辑的开放式百科全书，本词条由' + (qe.length * 137) + '位网友参与编辑…') +
          bdResult('tieba.baidu.com/f?kw=' + encodeURIComponent(qe), '<b>' + qe + '</b>吧_百度贴吧', 'tieba.baidu.com',
            '欢迎大家来到' + qe + '吧，请先阅读吧规再发帖。本吧现有会员' + (qe.length * 431) + '人，今日发帖' + (qe.length * 57) + '篇…') +
          bdResult(S(qe + ' 下载'), '<b>' + qe + '</b>相关软件/资源下载 - 天空软件站', 'www.skycn.com',
            '…本站提供' + qe + '相关的绿色软件、汉化补丁下载，所有软件均经过卡巴斯基杀毒检查…') +
          bdResult(S(qe + ' 图片'), '<b>' + qe + '</b>图片_百度图片搜索', 'image.baidu.com',
            '为您找到' + qe + '相关图片约' + (qe.length * 1099) + '张，点击查看大图…') +
          bdResult(S(qe + ' 论坛'), '关于<b>' + qe + '</b>的最新讨论 - 天涯社区', 'www.tianya.cn',
            '…网友在社区内关于' + qe + '的热门讨论帖，已有上千网友参与回复…');
      }
      c.innerHTML = BD_R_CSS + `
      <div class="bd-r">
        <div class="bd-r-top"><div class="bd-r-bar"><table><tr>
          <td width="90"><svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><text x="60" y="26" text-anchor="middle" font-size="24" font-weight="bold" fill="#2932e1" font-family="Georgia">Baidu</text><text x="60" y="38" text-anchor="middle" font-size="11" fill="#2932e1" font-family="SimSun">百度</text></svg></td>
          <td><form data-search="www.baidu.com/s?wd={q}"><input type="text" name="q" value="${q.replace(/"/g, '&quot;')}"><button type="submit">百度一下</button></form></td>
        </tr></table></div></div>
        <div class="bd-r-body">
          <div class="stats">百度为您找到相关网页约${(q.length * 371829).toLocaleString('en-US')}篇，用时0.0${(q.length % 9) + 1}秒</div>
          ${res}
          <div class="bd-r-rel">相关搜索：${L(S(q + ' 下载'), q + ' 下载')} 　${L(S(q + ' 图片'), q + ' 图片')} 　${L(S(q + 'mp3'), q + ' mp3')} 　${L(S(q + ' 视频'), q + ' 视频')} 　${L(S(q + ' 简介'), q + ' 简介')}</div>
          <div class="bd-r-page">${L(S(q), '1')} 2 3 4 5 6 7 8 9 10 下一页&gt;</div>
        </div>
        <div class="bd-r-foot">©2007 Baidu　使用百度前必读</div>
      </div>`;
    };
  }

  /* ============================================================
     三、百度MP3（mp3.baidu.com）
     曲目依据：research/music.md §3.1 百度2007十大MP3（一手）
     注意断代：《彩虹》《青花瓷》收录于 11.2 发行之《我很忙》，
     10.17 尚未发行，故只出现在「新专辑预告」横幅里
     ============================================================ */
  const BD_MP3_CSS = st('bd-mp3-css', `
    .mp3-p { background:#fff; min-height:100%; font:12px/1.8 SimSun,宋体,serif; }
    .mp3-top { background:#e5ecf9; border-bottom:1px solid #9cb0d8; padding:6px 14px; }
    .mp3-top a { color:#00c; text-decoration:underline; margin:0 4px; }
    .mp3-top .on { color:#c00; font-weight:bold; text-decoration:none; }
    .mp3-head { padding:8px 14px; border-bottom:2px solid #c00; }
    .mp3-head h1 { font:bold 20px SimSun; margin:0 0 2px; }
    .mp3-banner { margin:10px 14px; border:1px solid #f0c000; background:#fffbe2; padding:6px 10px; }
    .mp3-banner b { color:#c00; }
    .mp3-list { margin:6px 14px; }
    .mp3-list table { width:100%; border-collapse:collapse; }
    .mp3-list th { background:#e5ecf9; border:1px solid #c5d5ee; padding:4px 6px; text-align:left; }
    .mp3-list td { border:1px solid #e0e8f5; padding:4px 6px; }
    .mp3-list .num { color:#c00; font-weight:bold; }
    .mp3-list a { color:#00c; text-decoration:underline; }
    .mp3-foot { border-top:1px solid #eee; color:#777; text-align:center; padding:8px 0; }
  `);

  const MP3_SONGS = [
    { n: '爱情转移', s: '陈奕迅', a: '认了吧' },
    { n: '菊花台', s: '周杰伦', a: '依然范特西' },
    { n: '该死的温柔', s: '马天宇', a: '宇光十色' },
    { n: '不能说的秘密', s: '周杰伦', a: '不能说的秘密 电影原声' },
    { n: '有一种爱叫做放手', s: '阿木', a: '有一种爱叫做放手' },
    { n: '爱转角', s: '罗志祥', a: 'Speshow' },
    { n: '中国话', s: 'S.H.E', a: 'Play' },
    { n: '杀手', s: '林俊杰', a: '西界' },
    { n: '有没有人告诉你', s: '陈楚生', a: '快乐男声 现场收录' },
    { n: '月亮之上', s: '凤凰传奇', a: '月亮之上' },
    { n: '千里之外', s: '周杰伦', a: '依然范特西' },
    { n: '该死的温柔', s: '马天宇', a: '宇光十色' },
  ];

  function baiduMp3(c) {
    let rows = '';
    MP3_SONGS.forEach(function (s, i) {
      rows += '<tr><td class="num">' + (i + 1) + '</td><td>' + s.n + '</td><td>' + s.s +
        '</td><td>' + s.a + '</td><td>' + L('mp3.baidu.com', '试听', 'm-ln') + '</td><td>' + L('mp3.baidu.com', '歌词') + '</td><td>' + L('mp3.baidu.com', '铃声') + '</td><td>' + L('mp3.baidu.com', '添加到列表') + '</td></tr>';
    });
    c.innerHTML = BD_MP3_CSS + `
    <div class="mp3-p">
      <div class="mp3-top">MP3首页　歌曲排行榜　<span class="on">新歌TOP100</span>　歌词　全部歌曲　歌手分类　影视原声　榜单家族</div>
      <div class="mp3-head"><h1>新歌TOP100</h1>更新时间：2007-10-17　来源：百度MP3每日搜索数据</div>
      <div class="mp3-banner">【新碟预告】周杰伦第八张专辑<b>《我很忙》</b>将于<b>10月22日预售</b>、11月2日全亚洲发行，收录《牛仔很忙》《彩虹》《青花瓷》等十首新歌，敬请期待！</div>
      <div class="mp3-list">
        <table>
          <tr><th width="36">排名</th><th width="150">歌曲名</th><th width="110">歌手</th><th>专辑</th><th width="46">试听</th><th width="46">歌词</th><th width="46">铃声</th><th width="80">操作</th></tr>
          ${rows}
        </table>
        <div style="padding:6px 2px;color:#666;">1–12　${L('mp3.baidu.com', '下一页')} 　${L('mp3.baidu.com', '尾页')}</div>
      </div>
      <div class="mp3-foot">©2007 Baidu　免责声明：本站所有歌曲搜索结果均由搜索引擎自动抓取，仅供试听，请于24小时内删除。</div>
    </div>`;
  }

  /* ============================================================
     四、校内网（www.xiaonei.com）
     依据：research/social.md 校内网章节（蓝白配色/实名/脚印/新鲜事）
     红线：不出现「人人网」（2009才改名）、无开心农场
     ============================================================ */
  const XN_CSS = st('xn-css', `
    .xn-p { background:#fff; min-height:100%; font:12px/1.8 SimSun,宋体,serif; color:#333; }
    .xn-hd { background:#3B7DBF; border-bottom:3px solid #2B5F9E; padding:5px 14px; color:#fff; }
    .xn-hd .lg { font:bold 20px "Microsoft YaHei",SimSun; letter-spacing:2px; }
    .xn-hd .lg em { font-style:normal; color:#ffde8a; }
    .xn-hd a { color:#e8f2ff; text-decoration:none; margin:0 8px; }
    .xn-hd .who { float:right; padding-top:6px; }
    .xn-main { display:table; width:100%; }
    .xn-l, .xn-r { display:table-cell; vertical-align:top; padding:10px 12px; }
    .xn-l { width:190px; background:#f4f8fc; border-right:1px solid #dce6f2; }
    .xn-r { }
    .xn-box { border:1px solid #cdddf0; margin-bottom:10px; background:#fff; }
    .xn-box .bt { background:#dceaf8; border-bottom:1px solid #cdddf0; padding:3px 8px; font-weight:bold; color:#2b5f9e; }
    .xn-box .bc { padding:6px 9px; }
    .xn-ava { text-align:center; }
    .xn-ava svg { width:110px; height:110px; border:1px solid #cdddf0; }
    .xn-ava .nm { font-weight:bold; font-size:14px; color:#2b5f9e; margin-top:4px; }
    .xn-ava .sc { color:#666; }
    .xn-status { background:#fdf6e2; border:1px dashed #e0b25a; padding:5px 8px; margin-bottom:10px; }
    .xn-feed li { list-style:none; border-bottom:1px dotted #e2e8f0; padding:5px 2px; }
    .xn-feed ul { margin:0; padding:0; }
    .xn-feed .t { color:#888; }
    .xn-feed a { color:#2b5f9e; text-decoration:none; }
    .xn-feed a:hover { text-decoration:underline; }
    .xn-pub { border:1px solid #cdddf0; background:#f7fafd; padding:6px; margin-bottom:10px; }
    .xn-pub input[type=text] { width:96%; border:1px solid #9cb0d8; font:12px SimSun; padding:2px; }
    .xn-pub button { margin-top:4px; padding:2px 10px; background:#dceaf8; border:1px solid #9cb0d8; }
    .xn-prof .bt2 { font-weight:bold; color:#2b5f9e; border-left:4px solid #2b5f9e; padding-left:6px; margin:8px 0 4px; }
    .xn-blog li { list-style:none; border-bottom:1px dotted #ddd; padding:3px 2px; }
    .xn-blog ul { margin:0; padding:0; }
    .xn-blog .d { color:#999; }
    .xn-alb { }
    .xn-alb .ph { display:inline-block; width:70px; height:52px; border:1px solid #cdddf0; margin:3px 4px; position:relative; }
    .xn-alb .cap { font-size:11px; color:#555; text-align:center; }
    .xn-foot { border-top:1px solid #dce6f2; text-align:center; color:#889; padding:8px 0; }
    .xn-foot a { color:#889; }
    .xn-prints { }
    .xn-prints .pp { display:inline-block; width:46px; text-align:center; margin:2px 3px; font-size:11px; }
    .xn-prints svg { width:40px; height:40px; border:1px solid #cdddf0; }
    .xn-msg li { list-style:none; border-bottom:1px dotted #ddd; padding:4px 2px; }
    .xn-msg ul { margin:0; padding:0; }
  `);

  const XN_PROF = 'www.xiaonei.com/profile/10001';

  function xnAvatarSvg(bg, hair) {
    return '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="' + bg + '"/><circle cx="30" cy="24" r="10" fill="#f5d7b0" stroke="#d8b184" stroke-width="1"/><path d="M20 22 Q30 8 40 22 L40 16 Q30 6 20 16 Z" fill="' + hair + '"/><path d="M12 60 Q14 40 30 40 Q46 40 48 60 Z" fill="' + (bg === '#f4d7e0' ? '#a04a6a' : '#5a7fae') + '"/></svg>';
  }

  function xnHome(c) {
    c.innerHTML = XN_CSS + `
    <div class="xn-p">
      <div class="xn-hd">
        <span class="lg">校内<em>网</em> Xiaonei.com</span>
        <span class="who">${L('www.xiaonei.com', '张伟')} | 电子信息学院 电气0602班 | ${L('www.xiaonei.com', '退出')}</span>
        <div style="clear:both;"></div>
      </div>
      <div class="xn-main">
        <div class="xn-l">
          <div class="xn-ava">
            ${xnAvatarSvg('#dfe9f6', '#222')}
            <div class="nm">张伟</div>
            <div class="sc">北岭大学 · 大二</div>
            <div class="sc" style="color:#2b5f9e;">${L(XN_PROF, '去我的主页')}</div>
          </div>
          <div class="xn-box" style="margin-top:10px;">
            <div class="bt">我的状态</div>
            <div class="bc">越狱S03E04出了，谁有能用的地址？在线等……</div>
          </div>
          <div class="xn-box">
            <div class="bt">好友（86）</div>
            <div class="bc">${L(XN_PROF, '林晓')}<br>王磊<br>刘洋<br>赵倩<br>陈晨<br>${L('www.xiaonei.com', '更多&gt;&gt;')}</div>
          </div>
        </div>
        <div class="xn-r xn-prof">
          <div class="xn-pub">
            <input type="text" value="张伟，说点什么吧……" readonly>
            <button type="button">发布</button>
          </div>
          <div class="xn-box">
            <div class="bt">好友新鲜事</div>
            <div class="bc xn-feed"><ul>
              <li>${L(XN_PROF, '林晓')} 更新了日志《秋天，银杏黄了》 <span class="t">21:40</span></li>
              <li>王磊 上传了相册《DOTA五连坐战况实录》（10张新照片） <span class="t">20:15</span></li>
              <li>刘洋 的状态：迅雷挂着下越狱，全宿舍网速都归我，哈哈 <span class="t">19:02</span></li>
              <li>${L(XN_PROF, '林晓')} 的状态：自习回来的路上，月亮好圆 <span class="t">18:47</span></li>
              <li>赵倩 上传了相册《运动会方阵训练》（3张新照片） <span class="t">16:20</span></li>
              <li>陈晨 分享了文章《大学四年到底该怎么过？》 <span class="t">14:05</span></li>
              <li>王磊 参加了投票「DOTA里最强的后期是谁」 <span class="t">12:44</span></li>
            </ul></div>
          </div>
          <div class="xn-box">
            <div class="bt">推荐日志</div>
            <div class="bc xn-feed"><ul>
              <li>《图书馆占座攻略：一条胶带锁定的地盘》 <span class="t">来自：校园热榜</span></li>
              <li>《食堂二楼新出的糖醋里脊实测报告》 <span class="t">来自：吃货联盟</span></li>
            </ul></div>
          </div>
        </div>
      </div>
      <div class="xn-foot">校内网 ©2007　${L('www.xiaonei.com', '关于我们')} | ${L('www.xiaonei.com', '意见反馈')} | ${L('www.xiaonei.com', '帮助')} | 严禁发表违法违规言论</div>
    </div>`;
  }

  function xnProfile(c) {
    c.innerHTML = XN_CSS + `
    <div class="xn-p">
      <div class="xn-hd">
        <span class="lg">校内<em>网</em> Xiaonei.com</span>
        <span class="who">${L('www.xiaonei.com', '返回首页')} | ${L('www.xiaonei.com', '退出')}</span>
        <div style="clear:both;"></div>
      </div>
      <div class="xn-main">
        <div class="xn-l">
          <div class="xn-ava">
            ${xnAvatarSvg('#f4d7e0', '#3a2a1a')}
            <div class="nm">林晓</div>
            <div class="sc">北岭大学 · 外国语学院 英语0601</div>
            <div class="sc">和她是好友</div>
          </div>
          <div class="xn-box" style="margin-top:10px;">
            <div class="bt">最近来访</div>
            <div class="bc xn-prints">
              <span class="pp">${xnAvatarSvg('#dfe9f6', '#222')}张伟</span>
              <span class="pp">${xnAvatarSvg('#dfe9f6', '#333')}王磊</span>
              <span class="pp">${xnAvatarSvg('#e8e0f0', '#222')}陈晨</span>
              <span class="pp">${xnAvatarSvg('#e0f0e4', '#222')}赵倩</span>
            </div>
          </div>
          <div class="xn-box">
            <div class="bt">她的好友</div>
            <div class="bc">赵倩<br>陈晨<br>苏小蕊<br>${L('www.xiaonei.com', '更多&gt;&gt;')}</div>
          </div>
        </div>
        <div class="xn-r xn-prof">
          <div class="xn-status">林晓的状态：自习回来的路上，月亮好圆　<span style="color:#999;">18:47</span></div>
          <div class="bt2">她的日志</div>
          <div class="xn-blog"><ul>
            <li>《秋天，银杏黄了》 <span class="d">10-17 21:40 | 浏览(31) | 评论(6)</span></li>
            <li>《图书馆占座记：六点半的闹钟值不值》 <span class="d">10-14 22:03 | 浏览(58) | 评论(11)</span></li>
            <li>《宿舍楼下的小猫有名字了》 <span class="d">10-09 20:46 | 浏览(44) | 评论(9)</span></li>
            <li>《开学的第一个月：忙但是充实》 <span class="d">09-30 21:12 | 浏览(37) | 评论(4)</span></li>
          </ul></div>
          <div class="bt2">她的相册</div>
          <div class="xn-alb">
            <span class="ph" style="background:linear-gradient(180deg,#f8e3b0,#e8c070);"></span>
            <span class="ph" style="background:linear-gradient(180deg,#cfe4f6,#a8c8e8);"></span>
            <span class="ph" style="background:linear-gradient(180deg,#e4f0d0,#b8d490);"></span>
            <span class="ph" style="background:linear-gradient(180deg,#f0d0d8,#e0a0b0);"></span>
            <div class="cap">秋天，银杏黄了（新） 　校园随手拍 　小猫 　军训留念</div>
          </div>
          <div class="bt2">留言板</div>
          <div class="xn-msg"><ul>
            <li><b>王磊</b>：借英语笔记，明天早自习前给你还回去。 <span class="d">10-17 20:58</span></li>
            <li><b>赵倩</b>：银杏那张拍得真好，用什么相机拍的？ <span class="d">10-17 21:52</span></li>
          </ul></div>
        </div>
      </div>
      <div class="xn-foot">校内网 ©2007　${L('www.xiaonei.com', '帮助')} | ${L('www.xiaonei.com', '隐私设置')}</div>
    </div>`;
  }

  /* ============================================================
     五、新浪新闻首页（www.sina.com.cn / news.sina.com.cn）
     头条原文转写自官方历史快照 www20071017am.shtml（一手，GBK）：
     「十七大报告:让更多人拥有财产性收入」「嫦娥一号备数百预案避风险」
     「北京地铁下调票价后运量增30%」等标题均为快照原文；
     「嫦娥一号 10.24 发射」为 10.17 时点之「即将」状态
     ============================================================ */
  const SN_CSS = st('sn-css', `
    .sn-p { background:#fff; min-height:100%; font:12px/1.7 SimSun,宋体,serif; color:#000; }
    .sn-top { border-bottom:1px solid #c00; padding:4px 12px; background:#fff7ee; }
    .sn-top a { color:#00c; text-decoration:underline; margin:0 5px; }
    .sn-top .lg { font:bold 22px "Microsoft YaHei",SimSun; color:#c00; margin-right:10px; }
    .sn-date { background:#f5f5f5; border-bottom:1px solid #ddd; padding:3px 12px; color:#666; }
    .sn-focus { margin:8px 12px; border:1px solid #e8b4b4; background:#fffafa; }
    .sn-focus .fh { background:#c00; color:#fff; font:bold 14px SimSun; padding:3px 10px; letter-spacing:1px; }
    .sn-focus .fb { padding:6px 10px; }
    .sn-focus .fb a { color:#00c; text-decoration:underline; }
    .sn-focus .big { font:bold 16px SimSun; }
    .sn-focus .big a { color:#c00; }
    .sn-focus .sub a { margin-right:10px; }
    .sn-cols { display:table; width:100%; }
    .sn-col { display:table-cell; vertical-align:top; padding:6px 10px; border-right:1px dotted #ddd; }
    .sn-col h3 { font:bold 13px SimSun; color:#c00; border-bottom:1px solid #c00; margin:2px 0 4px; padding-bottom:2px; }
    .sn-col li { list-style:none; padding:2px 0; border-bottom:1px dotted #eee; }
    .sn-col ul { margin:0; padding:0; }
    .sn-col a { color:#00c; text-decoration:none; }
    .sn-col a:hover { text-decoration:underline; }
    .sn-ads { margin:6px 12px; border:1px dashed #d0a030; background:#fffdf0; padding:4px 8px; color:#865c10; }
    .sn-ads a { color:#865c10; text-decoration:underline; margin-right:10px; }
    .sn-foot { border-top:1px solid #ddd; text-align:center; color:#777; padding:8px 0; }
    .sn-17 { color:#c00; font-weight:bold; }
  `);

  function sinaNews(c) {
    const S = function (q) { return 'www.baidu.com/s?wd=' + encodeURIComponent(q); };
    c.innerHTML = SN_CSS + `
    <div class="sn-p">
      <div class="sn-top">
        <span class="lg">新浪新闻</span>
        新闻 体育 娱乐 财经 科技 军事 图片 视频 专题 博客
        <span style="float:right;">${L('www.sina.com.cn', '新浪首页')} | 设为首页 | 网站地图</span>
      </div>
      <div class="sn-date">2007年10月17日 星期三 农历九月初七　|　新闻中心　滚动新闻：十七大今日举行代表团开放日活动</div>
      <div class="sn-focus">
        <div class="fh">中国共产党第十七次全国代表大会专题</div>
        <div class="fb">
          <div class="big">${L(S('十七大'), '<span class="sn-17">十七大报告：让更多人拥有财产性收入</span>')}</div>
          <div class="sub">
            ${L(S('十七大 报告'), '报告全文')} | 新提法 | 视频集 | 图集 | 16日简报 | 电子书 |
            代表热议10大关键词 | 财产性收入提升是大趋势 | 财政支持转变经济方式 | 央行坚持货币政策稳定
          </div>
          <div>胡锦涛、温家宝、贾庆林、吴官正等分别参加代表团讨论　台湾舆论称报告体现大陆对台政策务实灵活　教育部科技部介绍教育科技发展情况</div>
        </div>
      </div>
      <div style="margin:6px 12px; border:1px solid #c5d5ee; background:#f5f9ff; padding:4px 10px;">
        <b style="color:#039;">嫦娥探月工程专题：</b>${L(S('嫦娥一号'), '<b>嫦娥一号备数百预案避风险 计划本月下旬择机发射</b>')}　我画嫦娥 | 诗会 | 灯谜 | <span style="color:#039;">发射倒计时</span>
      </div>
      <div class="sn-cols">
        <div class="sn-col">
          <h3>国内</h3><ul>
            <li>${L(S('北京地铁 票价'), '北京地铁下调票价后运量增30% 明年缩短间隔')}</li>
            <li>${L(S('跨行通存通兑'), '武汉有望实现跨行通存通兑 缓解排长队问题')}</li>
            <li>${L(S('中医术语 国际标准'), '世卫组织首次颁布中医术语国际标准')}</li>
            <li>${L(S('燃油税'), '财政部部长谢旭人称将适时推出燃油税')}</li>
            <li>${L(S('西湖十景'), '杭州评选新西湖十景')}</li>
            <li>${L(S('血液检测 老年痴呆'), '血液检测预测老年痴呆')}</li>
          </ul>
        </div>
        <div class="sn-col">
          <h3>财经</h3><ul>
            <li>工行将对列入区域限批企业暂停贷款</li>
            <li>交通银行第二套房以个人为认定单位</li>
            <li>QFII将增至300亿美元</li>
            <li>封基价值洼地效应显现 折价率超30%成金矿</li>
            <li>国资委否认2010年前30家央企整体上市名单</li>
            <li>跳空缺口有待回补 热点转换悄悄进行</li>
          </ul>
        </div>
        <div class="sn-col">
          <h3>娱乐</h3><ul>
            <li>${L(S('投名状'), '《投名状》博客征文悬赏万元')}</li>
            <li>TVB两大台庆剧狂遭观众投诉</li>
            <li>${L(S('奋斗'), '佟大为马伊琍朱雨辰王珞丹做客聊《奋斗》实录')}</li>
            <li>金紫荆颁奖礼面临停办</li>
            <li>三宝手术成功将留在医院休养</li>
            <li>${L(S('色戒'), '《色戒》内地过审未定档，只闻楼梯响')}</li>
          </ul>
        </div>
        <div class="sn-col">
          <h3>体育</h3><ul>
            <li>中国女足1-0韩国</li>
            <li>霍华德上海首秀</li>
            <li>NBA中国赛上海站门票基本售罄</li>
            <li>国米双雄的中国矛盾</li>
            <li>中超联赛进入收官阶段</li>
            <li>刘翔备战明年室内世锦赛</li>
          </ul>
        </div>
        <div class="sn-col">
          <h3>科技·军事</h3><ul>
            <li>${L(S('Leopard'), '苹果新一代操作系统Leopard将10月26日上市')}</li>
            <li>联通称不会放弃香港3G牌照</li>
            <li>液晶面板吃紧价格走高 42英寸电视成主流</li>
            <li>国产手机电视直销再栽跟斗</li>
            <li>美专家集体渲染中国潜在威胁</li>
            <li>印媒妄称解放军“入侵”边境</li>
          </ul>
        </div>
      </div>
      <div class="sn-ads">
        <b>房产·车市：</b>第二套房确立三原则 | 时代造就房产商转型 | 亚奥精装纯板大宅 | CBD核心 天津公馆 | 东三环精装大宅 | 老款雅阁降5万 | 10万公里是最佳换车时机吗 | 汽车有没有气质完全取决于司机
      </div>
      <div class="sn-foot">新浪网站介绍 | ${L('www.sina.com.cn', '新浪首页')} | 广告服务 | 招聘信息 | 中文阅读 | 网站律师 | 通行证 | 产品答疑<br>新浪网版权所有 © 1996-2007　京ICP证0000076号</div>
    </div>`;
  }

  /* ============================================================
     六、百度贴吧（tieba.baidu.com）
     依据：research/social.md 贴吧章节（1L/沙发/前排/楼主/MARK 文化）
     TBC（燃烧的远征）2007-09-06 开服，10月正是开荒期
     ============================================================ */
  const TB_CSS = st('tb-css', `
    .tb-p { background:#fff; min-height:100%; font:12px/1.8 SimSun,宋体,serif; }
    .tb-top { background:#0c5fb0; padding:5px 14px; color:#fff; }
    .tb-top .lg { font:bold 18px SimSun; letter-spacing:1px; }
    .tb-top a { color:#cde6ff; margin:0 6px; text-decoration:none; }
    .tb-top .who { float:right; padding-top:3px; }
    .tb-barhd { background:#e8f0fa; border-bottom:1px solid #b6cde8; padding:4px 14px; }
    .tb-barhd h1 { font:bold 16px SimSun; color:#0c5fb0; margin:0; display:inline; }
    .tb-barhd .m { color:#666; margin-left:10px; }
    .tb-new { float:right; padding:2px 10px; background:#fff; border:1px solid #9cb0d8; margin-top:2px; }
    .tb-list { padding:6px 14px; }
    .tb-list table { width:100%; border-collapse:collapse; }
    .tb-list th { background:#e8f0fa; border:1px solid #cddcf0; padding:3px 6px; text-align:left; }
    .tb-list td { border:1px solid #e2ebf6; padding:3px 6px; }
    .tb-list a { color:#00c; text-decoration:underline; }
    .tb-pages { padding:2px 14px 10px; color:#666; }
    .tb-post { padding:8px 14px; }
    .tb-post .ph { border-bottom:1px solid #cddcf0; padding-bottom:4px; margin-bottom:6px; }
    .tb-post .ph .tt { font:bold 15px SimSun; color:#0c5fb0; }
    .tb-floor { display:table; width:100%; border:1px solid #e2ebf6; margin-bottom:4px; }
    .tb-floor .fu { display:table-cell; width:130px; vertical-align:top; background:#f0f6fc; border-right:1px solid #e2ebf6; padding:6px; text-align:center; }
    .tb-floor .fc { display:table-cell; vertical-align:top; padding:6px 10px; }
    .tb-floor .fr { color:#888; }
    .tb-floor .lz { color:#c00; font-weight:bold; }
    .tb-floor svg { width:48px; height:48px; border:1px solid #cddcf0; }
    .tb-reply { margin:8px 14px; border:1px solid #cddcf0; }
    .tb-reply .rh { background:#e8f0fa; padding:3px 8px; font-weight:bold; color:#0c5fb0; }
    .tb-reply .rc { padding:6px; }
    .tb-foot { border-top:1px solid #ddd; color:#777; text-align:center; padding:8px 0; }
    .tb-home .hot a { color:#00c; text-decoration:underline; margin:0 5px; }
    .tb-home .cats li { list-style:none; padding:3px 2px; border-bottom:1px dotted #eee; }
    .tb-home .cats ul { margin:0; padding:0; }
    .tb-home h3 { font:bold 13px SimSun; color:#0c5fb0; border-bottom:1px solid #b6cde8; margin:10px 0 4px; }
  `);

  const TB_WOW = 'tieba.baidu.com/f?kw=' + encodeURIComponent('魔兽世界');
  const TB_LY = 'tieba.baidu.com/f?kw=' + encodeURIComponent('李毅');

  function tbFace(color) {
    return '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="' + color + '"/><circle cx="30" cy="30" r="14" fill="#f5e0c0" stroke="#c8a068" stroke-width="1"/><circle cx="25" cy="27" r="2" fill="#333"/><circle cx="35" cy="27" r="2" fill="#333"/><path d="M24 35 Q30 40 36 35" stroke="#333" stroke-width="1.5" fill="none"/></svg>';
  }

  function tbPostHtml(barName, barUrl, title, floors) {
    let fl = '';
    floors.forEach(function (f) {
      fl += '<div class="tb-floor"><div class="fu">' + tbFace(f.c) + '<div><b>' + f.u + '</b></div>' +
        (f.lz ? '<div class="lz">楼主</div>' : '') + '<div class="fr">' + f.t + '</div></div>' +
        '<div class="fc">' + f.x + '<div class="fr" style="text-align:right;">' + f.n + '楼</div></div></div>';
    });
    return function (c) {
      c.innerHTML = TB_CSS + `
      <div class="tb-p">
        <div class="tb-top"><span class="lg">百度贴吧</span>
          <span class="who">欢迎你，张伟 | 退出</span>
          <div>${L('www.baidu.com', '首页')} | ${L('www.baidu.com/s?wd=贴吧', '全吧搜索')}</div>
        </div>
        <div class="tb-barhd"><button class="tb-new" type="button">发表新帖</button>
          <h1>${L(barUrl, barName)}</h1><span class="m">会员：${floors.length * 1317}　今日发帖：${floors.length * 233}</span>
        </div>
        <div class="tb-post">
          <div class="ph"><span class="tt">${title}</span>　<span style="color:#888;">点击：${floors.length * 331}　回复：${floors.length}</span></div>
          ${fl}
          <div class="tb-reply"><div class="rh">回复</div><div class="rc">
            <textarea rows="4" style="width:98%; border:1px solid #9cb0d8; font:12px SimSun;"></textarea><br>
            <button type="button" style="padding:2px 12px; margin-top:4px; background:#e8f0fa; border:1px solid #9cb0d8;">发表回复</button>
          </div></div>
        </div>
        <div class="tb-foot">©2007 Baidu　贴吧协议 | 吧主招募 | 意见反馈</div>
      </div>`;
    };
  }

  function tbBarHtml(barName, rows) {
    let tr = '';
    rows.forEach(function (r) {
      tr += '<tr><td>' + (r.u ? L(r.u, r.t) : r.t) + '</td><td>' + r.a + '</td><td>' + r.n + '</td><td>' + r.d + '</td></tr>';
    });
    return function (c) {
      c.innerHTML = TB_CSS + `
      <div class="tb-p">
        <div class="tb-top"><span class="lg">百度贴吧</span>
          <span class="who">欢迎你，张伟 | 退出</span>
          <div>${L('www.baidu.com', '首页')} | 全吧搜索 | ${L('tieba.baidu.com', '贴吧分类')}</div>
        </div>
        <div class="tb-barhd"><button class="tb-new" type="button">发表新帖</button>
          <h1>${barName}</h1><span class="m">会员：${rows.length * 907}　今日发帖：${rows.length * 61}</span>
        </div>
        <div class="tb-list">
          <table><tr><th width="55%">主题</th><th width="15%">作者</th><th width="12%">回复</th><th width="18%">最后回复</th></tr>${tr}</table>
        </div>
        <div class="tb-pages">共 ${Math.max(2, rows.length)} 页　1 2 3 下一页　尾页　跳至 __ 页</div>
        <div class="tb-foot">©2007 Baidu　贴吧协议 | 吧主招募</div>
      </div>`;
    };
  }

  function tiebaHome(c) {
    c.innerHTML = TB_CSS + `
    <div class="tb-p tb-home">
      <div class="tb-top"><span class="lg">百度贴吧</span>
        <span class="who">欢迎你，张伟 | 退出</span>
        <div>${L('www.baidu.com', '首页')} | 全吧搜索 | 贴吧分类</div>
      </div>
      <div style="padding:10px 16px;">
        <form data-search="tieba.baidu.com/f?kw={q}">
          <input type="text" name="q" placeholder="进入某个吧，如：魔兽世界" style="width:260px; border:1px solid #9cb0d8; padding:2px 4px; font:12px SimSun;">
          <button type="submit" style="padding:2px 10px; background:#e8f0fa; border:1px solid #9cb0d8;">进入吧</button>
        </form>
        <h3>热门贴吧</h3>
        <div class="hot">
          ${L(TB_WOW, '魔兽世界吧')} | ${L(TB_LY, '李毅吧')} | ${L('tieba.baidu.com/f?kw=' + encodeURIComponent('周杰伦'), '周杰伦吧')} | ${L('tieba.baidu.com/f?kw=' + encodeURIComponent('越狱'), '越狱吧')} | 李宇春吧 | 快乐男声吧 | 跑跑卡丁车吧 | 火影忍者吧
        </div>
        <h3>贴吧分类</h3>
        <div class="cats"><ul>
          <li>游戏：魔兽世界吧 传奇吧 劲舞团吧 跑跑卡丁车吧</li>
          <li>体育：中国足球吧 山东鲁能吧 AC米兰吧</li>
          <li>娱乐：周杰伦吧 李宇春吧 好男儿吧</li>
          <li>校园：大学生活吧 四六级吧 考研吧</li>
          <li>地区：北京吧 上海吧 广州吧</li>
        </ul></div>
      </div>
      <div class="tb-foot">©2007 Baidu　贴吧协议 | 吧主招募 | 意见反馈</div>
    </div>`;
  }

  const WOW_POSTS = [
    { t: '【讨论】TBC开了一个月，你们服的金价涨了多少？', u: 'tieba.baidu.com/f?kz=wow1', a: '兽人小萨满', n: '86', d: '10-17 21:02' },
    { t: '求个稳定的FWQ，联盟兄弟进来报个到', a: '暴风城卫兵', n: '23', d: '10-17 20:44' },
    { t: '今晚开荒卡拉赞，灭了四个小时，指挥嗓子都哑了', a: '会长假死了', n: '57', d: '10-17 20:15' },
    { t: '【求助】幽暗城到底怎么走，我已经迷路半小时了', a: '新来的亡灵', n: '31', d: '10-17 19:50' },
    { t: '猎人误导加假死，拉怪神技，不服来辩', a: '铁炉堡猎人', n: '41', d: '10-17 18:33' },
    { t: '谁有燃烧的远征客户端的下载地址，网盘的就别发了', a: '宿舍党路过', n: '34', d: '10-17 17:21' },
    { t: '我们宿舍四个人同时上线，路由器直接罢工', a: '网络都归我', n: '29', d: '10-17 16:08' },
    { t: '外域的任务真多，做不完，根本做不完', a: '地狱火半岛常驻', n: '18', d: '10-17 15:42' },
  ];
  const WOW_FLOORS = [
    { u: '兽人小萨满', c: '#a8d08a', lz: 1, t: '10-17 20:55', n: 1, x: '9月6号TBC一开，我们服的金价从1:30涨到1:15了，点卡也跟着涨。打金的都说外域日常任务给钱多，咱这平民玩家只能看着各位老板消费……大家服里什么行情？' },
    { u: '暴风城卫兵', c: '#d6e8f7', t: '10-17 20:57', n: 2, x: '沙发！金价涨了跟我没关系，反正我只有3金。' },
    { u: '会长假死了', c: '#f4d7e0', t: '10-17 20:58', n: 3, x: '板凳。楼上的兄弟别哭，我们会在卡拉赞门口集体修装备的时候更穷。' },
    { u: '铁炉堡猎人', c: '#f0e0c8', t: '10-17 21:00', n: 4, x: '前排出售强力螺栓和魔铁子弹，看帖的老板们照顾下生意。' },
    { u: '新来的亡灵', c: '#dfe9d0', t: '10-17 21:01', n: 5, x: 'MARK，晚上回宿舍细看，顺便问一句金价是什么？' },
    { u: '网络都归我', c: '#e0d0f0', t: '10-17 21:03', n: 6, x: '楼主好人。我们服1:18，点卡3300金，已经下不起了。' },
    { u: '地狱火半岛常驻', c: '#e8e8d0', t: '10-17 21:06', n: 7, x: '路过留名，等开学换了食堂饭钱再回坑。' },
    { u: '兽人小萨满', c: '#a8d08a', lz: 1, t: '10-17 21:09', n: 8, x: '楼上几位说得都在理。看来行情差不多，多谢捧场，帖子不沉了。' },
  ];

  const LY_POSTS = [
    { t: '【大帝语录】今天状态不错，感觉能进一个', u: 'tieba.baidu.com/f?kz=ly1', a: '天亮了啊', n: '102', d: '10-17 20:31' },
    { t: '护球像亨利的那位又进球了，这球真亮', a: '毅丝不挂', n: '66', d: '10-17 19:47' },
    { t: '毅丝们来集合，天涯何处无芳草', a: '蚌埠回旋', n: '45', d: '10-17 18:20' },
    { t: '谁还记得大帝当年在曼联试训的传说', a: '老球迷了', n: '23', d: '10-17 16:55' },
  ];
  const LY_FLOORS = [
    { u: '天亮了啊', c: '#f4d7e0', lz: 1, t: '10-17 20:28', n: 1, x: '今天状态不错，感觉能进一个。——大帝语录新增一条，毅丝们前来瞻仰。护球像亨利，射门像贝利。' },
    { u: '毅丝不挂', c: '#dfe9f6', t: '10-17 20:29', n: 2, x: '沙发！大帝威武，天亮了！' },
    { u: '蚌埠回旋', c: '#f0e0c8', t: '10-17 20:30', n: 3, x: '亮了亮了，这句必须收进语录合集。' },
    { u: '老球迷了', c: '#e8e8d0', t: '10-17 20:33', n: 4, x: '先MARK后看，顺便问句今天的语录第几条了？' },
    { u: '天亮了啊', c: '#f4d7e0', lz: 1, t: '10-17 20:36', n: 5, x: '回楼上：第一百零八条。毅丝不挂，诸君共勉。' },
  ];

  /* ============================================================
     七、天涯社区（www.tianya.cn）
     依据：research/social.md 天涯章节；华南虎照 2007-10 正值全民论战
     ============================================================ */
  const TY_CSS = st('ty-css', `
    .ty-p { background:#fff; min-height:100%; font:12px/1.8 SimSun,宋体,serif; }
    .ty-top { background:#2b4f81; padding:5px 14px; color:#fff; }
    .ty-top .lg { font:bold 20px SimSun; letter-spacing:2px; }
    .ty-top .lg em { font-style:normal; color:#f0d060; }
    .ty-top a { color:#cde0f5; margin:0 5px; text-decoration:none; }
    .ty-loc { background:#eef2f7; border-bottom:1px solid #c4cfdd; padding:3px 14px; color:#556; }
    .ty-loc b { color:#2b4f81; }
    .ty-blist { padding:8px 14px; }
    .ty-blist table { width:100%; border-collapse:collapse; }
    .ty-blist th { background:#e7edf5; border:1px solid #c4cfdd; padding:3px 6px; text-align:left; }
    .ty-blist td { border:1px solid #dfe6ee; padding:3px 6px; }
    .ty-blist a { color:#2b4f81; text-decoration:none; }
    .ty-blist a:hover { text-decoration:underline; }
    .ty-blist .hit { color:#c00; }
    .ty-post { padding:8px 14px; }
    .ty-post .tt { font:bold 16px SimSun; color:#2b4f81; border-bottom:2px solid #c4cfdd; padding-bottom:4px; margin-bottom:6px; }
    .ty-fl { border:1px solid #dfe6ee; margin-bottom:5px; display:table; width:100%; }
    .ty-fl .fu { display:table-cell; width:120px; vertical-align:top; background:#f2f5f9; border-right:1px solid #dfe6ee; padding:6px; text-align:center; }
    .ty-fl .fc { display:table-cell; vertical-align:top; padding:6px 10px; }
    .ty-fl .fr { color:#888; }
    .ty-fl .lz { color:#2b4f81; font-weight:bold; }
    .ty-foot { border-top:1px solid #c4cfdd; text-align:center; color:#889; padding:8px 0; }
    .ty-foot a { color:#889; }
    .ty-home h3 { font:bold 13px SimSun; color:#2b4f81; border-left:4px solid #2b4f81; padding-left:6px; margin:10px 0 4px; }
    .ty-home li { list-style:none; padding:2px 0; border-bottom:1px dotted #eee; }
    .ty-home ul { margin:0; padding:0; }
    .ty-home a { color:#2b4f81; }
  `);

  const TY_ENT = 'www.tianya.cn/publicforum/ent';
  const TY_TIGER = 'www.tianya.cn/publicforum/ent/1/888888';

  function tianyaHome(c) {
    c.innerHTML = TY_CSS + `
    <div class="ty-p ty-home">
      <div class="ty-top"><span class="lg">天涯<em>社区</em></span>
        <span style="float:right;">欢迎你，游客 | 注册 | 登录</span>
        <div style="clear:both;">论坛 博客 相册 城市 天涯百科 排行榜</div>
      </div>
      <div style="padding:10px 16px;">
        <h3>热门版面</h3>
        <ul>
          <li>${L(TY_ENT, '娱乐八卦')} —— 华南虎照直播帖今夜盖楼中（回复 1200+）</li>
          <li>情感天地 —— 【直播】异地恋第三年，坚持还是放手</li>
          <li>贴图专区 —— 国庆黄金周归来，晒晒你拍的游客照</li>
          <li>关天茶舍 —— 从十七大报告看财产性收入</li>
          <li>煮酒论史 —— 史书里那些被冤枉的名将</li>
          <li>国际观察 —— 嫦娥一号月底发射，航天强国之路</li>
          <li>体育聚焦 —— 欧洲杯预选赛形势分析</li>
        </ul>
        <h3>社区公告</h3>
        <ul>
          <li>关于规范版面秩序、抵制标题党的通知（10-12）</li>
          <li>天涯十五周年征文集活动启事</li>
        </ul>
      </div>
      <div class="ty-foot">天涯社区 © 1999-2007　${L('www.tianya.cn', '社区地图')} | 服务条款 | 隐私政策</div>
    </div>`;
  }

  function tianyaEnt(c) {
    const rows = [
      { t: '【直播】陕西镇坪华南虎照片，越看越不对劲', u: TY_TIGER, a: '胶片时代的残党', n: '1238', d: '12分钟前' },
      { t: '傅德志和周正龙，一个教授一个农民，你信谁？', a: '看热闹的椒', n: '806', d: '1小时前' },
      { t: '八一下《奋斗》里那帮演员，现实中都什么样', a: '陆涛同款沙发', n: '432', d: '2小时前' },
      { t: '有人去看了《色戒》吗，出来说说（不许剧透）', a: '电影原声控', n: '654', d: '3小时前' },
      { t: '徐静蕾的博客点击都过亿了，名人博客时代来临？', a: '隔壁老徐', n: '389', d: '5小时前' },
      { t: '湖南卫视十月放歌晚会，你觉得哪首歌最好听', a: '芒果台的台', n: '275', d: '6小时前' },
      { t: '金紫荆颁奖礼面临停办，香港电影怎么了', a: '港片不死', n: '198', d: '8小时前' },
      { t: 'TVB台庆剧越来越难看，观众集体投诉', a: '翡翠台忠实观众', n: '511', d: '昨天' },
    ];
    let tr = '';
    rows.forEach(function (r) {
      tr += '<tr><td>' + (r.u ? L(r.u, r.t) : r.t) + '</td><td>' + r.a + '</td><td class="hit">' + r.n + '</td><td>' + r.d + '</td></tr>';
    });
    c.innerHTML = TY_CSS + `
    <div class="ty-p">
      <div class="ty-top"><span class="lg">天涯<em>社区</em></span>
        <span style="float:right;">游客 | 注册 | 登录</span>
        <div style="clear:both;">${L('www.tianya.cn', '论坛首页')} 博客 相册 城市</div>
      </div>
      <div class="ty-loc">当前位置：天涯社区 › 娱乐频道 › <b>娱乐八卦</b>　版主：大脸猫爱吃鱼</div>
      <div class="ty-blist">
        <table><tr><th width="58%">主题</th><th width="16%">作者</th><th width="10%">回复</th><th width="16%">最后回复</th></tr>${tr}</table>
        <div style="padding:6px 2px;color:#666;">发帖须知：本版谢绝人身攻击与不实八卦，标题党一律锁帖。</div>
      </div>
      <div class="ty-foot">天涯社区 © 1999-2007</div>
    </div>`;
  }

  function tianyaTiger(c) {
    const floors = [
      { u: '胶片时代的残党', lz: 1, t: '楼主 2007-10-15 23:41', x: '这两天大家都看到新闻了吧，陕西镇坪拍到野生华南虎，还发了照片庆功。我把照片放大看了半天，怎么越看越不对劲：第一，叶子那么小，老虎身上的纹路那么清楚；第二，几张金相册里的姿势几乎没变过。有没有懂摄影的进来聊聊？' },
      { u: '看热闹的椒', t: '2楼 10-15 23:58', x: '沙发！楼主这帖子要火，先占个位置。' },
      { u: '暗房老师傅', t: '3楼 10-16 00:12', x: '搞摄影的插一句：那个叶子和老虎的比例确实可疑，纵深感不对，像两张片叠出来的。' },
      { u: '植物所扫地僧', t: '4楼 10-16 09:47', x: '我是学植物的。那片叶子是壳斗科的，就那个季节那个大小，跟一只成年华南虎的体型放一起，诸位自己掂量。' },
      { u: '等结果再说', t: '5楼 10-16 11:20', x: '马克一个，等林业部门给说法。反正我现在是半信半疑。' },
      { u: '胶片时代的残党', lz: 1, t: '6楼 10-16 14:02', x: '谢谢楼上各位专业人士。补一句：傅德志教授都敢拿职位担保说照片有假，这场大戏有的看了。' },
      { u: '路人甲乙丙', t: '7楼 10-17 10:15', x: '前排围观，瓜子花生矿泉水已就位。虎照这事，年内必有下文。' },
    ];
    let fl = '';
    floors.forEach(function (f) {
      fl += '<div class="ty-fl"><div class="fu"><b>' + f.u + '</b>' + (f.lz ? '<div class="lz">楼主</div>' : '') + '<div class="fr">' + f.t.split(' ')[0] + '</div></div><div class="fc">' + f.x + '<div class="fr" style="text-align:right;">' + f.t + '</div></div></div>';
    });
    c.innerHTML = TY_CSS + `
    <div class="ty-p">
      <div class="ty-top"><span class="lg">天涯<em>社区</em></span>
        <span style="float:right;">游客 | 注册 | 登录</span>
        <div style="clear:both;">${L('www.tianya.cn', '论坛首页')} › ${L(TY_ENT, '娱乐八卦')}</div>
      </div>
      <div class="ty-loc">当前位置：天涯社区 › 娱乐频道 › 娱乐频道 › <b>【直播】陕西镇坪华南虎照片，越看越不对劲</b></div>
      <div class="ty-post">
        <div class="tt">【直播】陕西镇坪华南虎照片，越看越不对劲　<span style="font-weight:normal;color:#888;">点击 31688 | 回复 1238</span></div>
        ${fl}
        <div style="border:1px solid #dfe6ee; margin-top:6px;">
          <div style="background:#eef2f7; padding:3px 8px;">快速回复</div>
          <div style="padding:6px;"><textarea rows="4" style="width:98%; border:1px solid #9cb0d8; font:12px SimSun;"></textarea><br>
          <button type="button" style="padding:2px 12px; margin-top:4px; background:#eef2f7; border:1px solid #9cb0d8;">发表回复</button></div>
        </div>
      </div>
      <div class="ty-foot">天涯社区 © 1999-2007　${L('www.tianya.cn', '返回首页')}</div>
    </div>`;
  }

  /* ============================================================
     八、VeryCD·分享互联网（www.verycd.com）
     S03E04 下载按钮 → window.__DOWNLOADEVENT?.('prison_break_s03e04')
     ============================================================ */
  const VC_CSS = st('vc-css', `
    .vc-p { background:#fff; min-height:100%; font:12px/1.8 SimSun,宋体,serif; color:#333; }
    .vc-top { background:#f4f4f4; border-bottom:2px solid #d84c1f; padding:6px 14px; }
    .vc-top .lg { font:bold 22px "Microsoft YaHei",SimSun; color:#d84c1f; }
    .vc-top .lg em { font-style:normal; color:#555; font-size:14px; margin-left:4px; }
    .vc-top a { color:#d84c1f; margin:0 5px; text-decoration:none; }
    .vc-top .who { float:right; color:#666; }
    .vc-nav { background:#fafafa; border-bottom:1px solid #e0e0e0; padding:3px 14px; color:#888; }
    .vc-nav a { color:#00c; text-decoration:none; margin:0 4px; }
    .vc-list { padding:8px 14px; }
    .vc-list table { width:100%; border-collapse:collapse; }
    .vc-list th { background:#f0f0f0; border:1px solid #e6e6e6; padding:3px 6px; text-align:left; }
    .vc-list td { border:1px solid #eee; padding:3px 6px; }
    .vc-list a { color:#d84c1f; text-decoration:underline; }
    .vc-topc { padding:10px 16px; }
    .vc-topc .tt { font:bold 17px SimSun; color:#d84c1f; margin-bottom:4px; }
    .vc-meta { border:1px solid #e6e6e6; background:#fafafa; padding:6px 10px; margin:8px 0; }
    .vc-meta table { width:100%; border-collapse:collapse; }
    .vc-meta td { border:1px solid #eee; padding:3px 8px; }
    .vc-meta .k { background:#f5f5f5; width:110px; color:#666; }
    .vc-stars { color:#e8a000; letter-spacing:1px; }
    .vc-desc { margin:8px 0; line-height:1.9; }
    .vc-desc b { color:#d84c1f; }
    .vc-ed2k { background:#f6f6f6; border:1px dashed #bbb; padding:6px 8px; font:12px "Courier New",monospace; color:#555; word-break:break-all; }
    .vc-dl { display:block; margin:10px 0 4px; padding:6px 0; width:160px; text-align:center; font:bold 14px SimSun; color:#fff; background:linear-gradient(180deg,#f0703a,#d84c1f); border:1px solid #b53a12; cursor:pointer; }
    .vc-dl:hover { filter:brightness(1.1); }
    .vc-cmt { margin:10px 0; }
    .vc-cmt .ch { font-weight:bold; border-left:4px solid #d84c1f; padding-left:6px; margin-bottom:4px; }
    .vc-cmt li { list-style:none; border-bottom:1px dotted #eee; padding:4px 2px; }
    .vc-cmt ul { margin:0; padding:0; }
    .vc-foot { border-top:1px solid #e0e0e0; text-align:center; color:#999; padding:8px 0; }
  `);

  const VC_PB = 'www.verycd.com/topics/2738461';

  function verycdHome(c) {
    const rows = [
      { t: '越狱 第三季 Prison Break Season 3 更新至第4集[HDTV-Rip][中文字幕]', u: VC_PB, s: '4.4', d: '2007-10-16', z: '349MB' },
      { t: '奋斗 全32集 国产电视剧 [TVRip-RMVB]', s: '4.1', d: '2007-10-12', z: '6.8GB' },
      { t: '色戒 Lust, Caution 李安作品 [DVDScr]', s: '3.9', d: '2007-10-08', z: '1.4GB' },
      { t: '周杰伦 依然范特西 专辑 [MP3 192kbps]', s: '4.6', d: '2007-09-30', z: '78MB' },
      { t: '魔兽争霸3：冰封王座 完整硬盘版+CDKey', s: '4.5', d: '2007-09-22', z: '1.1GB' },
      { t: '魔兽世界：燃烧的远征 客户端 2.1.x', s: '4.2', d: '2007-09-10', z: '3.2GB' },
      { t: 'Linkin Park 分 Minutes to Midnight 专辑', s: '4.3', d: '2007-08-28', z: '96MB' },
    ];
    let tr = '';
    rows.forEach(function (r) {
      tr += '<tr><td>' + (r.u ? L(r.u, r.t) : r.t) + '</td><td>' + r.s + '</td><td>' + r.d + '</td><td>' + r.z + '</td></tr>';
    });
    c.innerHTML = VC_CSS + `
    <div class="vc-p">
      <div class="vc-top">
        <span class="lg">VeryCD<em>分享互联网</em></span>
        <span class="who">游客 | 登录 | 注册</span>
        <div style="clear:both;"></div>
      </div>
      <div class="vc-nav">电影 | 电视剧 | ${L(VC_PB, '热门资源')} | 音乐 | 游戏 | 软件 | 动漫 | 最新更新 | 驴友排行</div>
      <div class="vc-list">
        <table><tr><th width="62%">资源标题</th><th width="10%">评分</th><th width="14%">发布日期</th><th width="14%">大小</th></tr>${tr}</table>
        <div style="color:#999;padding:6px 2px;">提示：请使用 eMule 电骡或迅雷下载 ed2k 链接，资源由全球驴友共享，下载人数越多速度越快。</div>
      </div>
      <div class="vc-foot">VeryCD.com 分享互联网　©2003-2007　沪ICP备05001086号　本站所有资源均来自网友分享，仅供交流学习</div>
    </div>`;
  }

  function verycdPrisonBreak(c) {
    c.innerHTML = VC_CSS + `
    <div class="vc-p">
      <div class="vc-top">
        <span class="lg">VeryCD<em>分享互联网</em></span>
        <span class="who">游客 | 登录</span>
        <div style="clear:both;"></div>
      </div>
      <div class="vc-nav">${L('www.verycd.com', '首页')} &gt; 电视剧 &gt; 美剧 &gt; 越狱 Prison Break</div>
      <div class="vc-topc">
        <div class="tt">越狱 第三季 第4集 Prison Break S03E04 [HDTV-Rip][中文字幕]</div>
        <div>驴友评分：<span class="vc-stars">★★★★☆</span>　4.4 / 5　（312人评价）　热度：▂▃▅▆█ 98%</div>
        <div class="vc-meta">
          <table>
            <tr><td class="k">发布者</td><td>YDY@HR字幕组</td><td class="k">发布日期</td><td>2007-10-16</td></tr>
            <tr><td class="k">资源格式</td><td>HDTV-Rip / RMVB</td><td class="k">文件大小</td><td>349.37 MB</td></tr>
            <tr><td class="k">字幕</td><td>内嵌中文（双语）</td><td class="k">视频编码</td><td>RealVideo 9 / 512×384</td></tr>
            <tr><td class="k">完成数</td><td>41,086</td><td class="k">下载中</td><td>2,397</td></tr>
          </table>
        </div>
        <div class="vc-desc">
          <b>剧情介绍：</b>Michael 被困于巴拿马最黑暗的索纳监狱，这里没有守卫、没有规则，只有囚犯自己的秩序。Lincoln 在狱外想方设法营救，而神秘组织“公司”的手已经伸向了他们每一个人。本集为第三季第4集，YDY字幕组出品，内嵌中英双语字幕，适合收藏。
        </div>
        <div class="vc-ed2k">ed2k://|file|Prison.Break.S03E04.HDTV.RMVB.YDY.rmvb|366343168|A9F3C1D8E04B07921EFA39B8|h=QW4N3JZ7BTUHXOK2F5DDV6GJQ|/</div>
        <button class="vc-dl" type="button" id="vc-dl-btn">点击下载</button>
        <div style="color:#999;">下载前请确认已安装 eMule 或迅雷5。下载即代表同意本站免责声明。</div>
        <div class="vc-cmt">
          <div class="ch">驴友评论（6）</div>
          <ul>
            <li><b>沙发专业户</b>：沙发！字幕组辛苦了，凌晨三点就出片，神速。　<span style="color:#999;">10-16 09:12</span></li>
            <li><b>迅雷党路过</b>：用迅雷下的，早上挂上下午看完，66KB/s，稳。　<span style="color:#999;">10-16 14:40</span></li>
            <li><b>宿舍路由器</b>：我们全宿舍一起下，路由器已经在冒烟了。　<span style="color:#999;">10-16 18:05</span></li>
            <li><b>追剧八年</b>：一晚上没睡等字幕，值了。Sara到底怎么样了，不剧透，自己看。　<span style="color:#999;">10-16 21:33</span></li>
            <li><b>新人求带</b>：第一次用电骡，为什么我的速度只有10KB……　<span style="color:#999;">10-17 10:02</span></li>
            <li><b>楼主好人</b>：资源没问题，音画同步，顶一个。　<span style="color:#999;">10-17 12:47</span></li>
          </ul>
        </div>
      </div>
      <div class="vc-foot">VeryCD.com 分享互联网　©2003-2007　本页面资源由网友发布，不代表本站观点</div>
    </div>`;
    const btn = c.querySelector('#vc-dl-btn');
    if (btn) btn.addEventListener('click', function () {
      if (typeof window.__DOWNLOADEVENT === 'function') window.__DOWNLOADEVENT('prison_break_s03e04');
    });
  }

  /* ============================================================
     九、导出 WEBDATA：resolve(url) → {url,title,render} | null
     ============================================================ */
  function norm(u) {
    u = String(u || '').trim();
    u = u.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    return u;
  }
  function dec(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }

  function resolve(url) {
    const u = norm(url);
    if (u === 'www.baidu.com' || u === 'baidu.com' || u === 'www.baidu.com/index.html') {
      return { url: 'www.baidu.com', title: '百度一下，你就知道', render: baiduHome };
    }
    if (/^(www\.)?baidu\.com\/s\?wd=.+/.test(u)) {
      const q = dec(u.replace(/^.*[?&]wd=/, ''));
      return { url: 'www.baidu.com/s?wd=' + encodeURIComponent(q), title: q + '_百度搜索', render: baiduSearch(q) };
    }
    if (u === 'mp3.baidu.com' || u === 'mp3.baidu.com/m') {
      return { url: 'mp3.baidu.com', title: '百度MP3——全球最大中文MP3搜索引擎', render: baiduMp3 };
    }
    if (u === 'www.xiaonei.com' || u === 'xiaonei.com' || u === 'www.xiaonei.com/Home.do') {
      return { url: 'www.xiaonei.com', title: '校内网 - 因为真实，所以精彩', render: xnHome };
    }
    if (u === XN_PROF) {
      return { url: XN_PROF, title: '林晓的主页 - 校内网', render: xnProfile };
    }
    if (u === 'www.sina.com.cn' || u === 'news.sina.com.cn' || u === 'www.sina.com.cn/index.html') {
      return { url: 'www.sina.com.cn', title: '新浪新闻中心', render: sinaNews };
    }
    if (u === 'tieba.baidu.com' || u === 'www.tieba.baidu.com') {
      return { url: 'tieba.baidu.com', title: '百度贴吧——全球最大中文社区', render: tiebaHome };
    }
    let m = u.match(/^(?:www\.)?tieba\.baidu\.com\/f\?kw=(.+)$/);
    if (m) {
      const kw = dec(m[1]);
      if (kw === '魔兽世界') return { url: TB_WOW, title: '魔兽世界吧_百度贴吧', render: tbBarHtml('魔兽世界吧', WOW_POSTS) };
      if (kw === '李毅') return { url: TB_LY, title: '李毅吧_百度贴吧', render: tbBarHtml('李毅吧', LY_POSTS) };
      return { url: 'tieba.baidu.com/f?kw=' + encodeURIComponent(kw), title: kw + '吧_百度贴吧', render: tbBarHtml(kw + '吧', [
        { t: '【集中讨论】' + kw + '的最新动态，都进来说两句', a: '吧务小助手', n: '127', d: '10-17 21:10' },
        { t: '新人报道帖，老规矩先交保护费', a: '刚找到组织', n: '64', d: '10-17 20:02' },
        { t: '关于' + kw + '的十个冷知识，你知道几个', a: '知识就是力量', n: '88', d: '10-17 18:44' },
        { t: '求助！' + kw + '相关问题，在线等', a: '小白一个', n: '35', d: '10-17 16:30' },
        { t: '晒一晒我和' + kw + '的故事（多图杀猫警告）', a: '图吧资深用户', n: '56', d: '10-17 14:15' },
      ]) };
    }
    if (u === 'tieba.baidu.com/f?kz=wow1') {
      return { url: 'tieba.baidu.com/f?kz=wow1', title: '【讨论】TBC开了一个月…_魔兽世界吧', render: tbPostHtml('魔兽世界吧', TB_WOW, '【讨论】TBC开了一个月，你们服的金价涨了多少？', WOW_FLOORS) };
    }
    if (u === 'tieba.baidu.com/f?kz=ly1') {
      return { url: 'tieba.baidu.com/f?kz=ly1', title: '【大帝语录】今天状态不错…_李毅吧', render: tbPostHtml('李毅吧', TB_LY, '【大帝语录】今天状态不错，感觉能进一个', LY_FLOORS) };
    }
    if (u === 'www.tianya.cn' || u === 'tianya.cn' || u === 'www.tianya.cn/index.htm') {
      return { url: 'www.tianya.cn', title: '天涯社区_全球华人网上家园', render: tianyaHome };
    }
    if (u === TY_ENT || u === 'www.tianya.cn/publicforum/ent/list.jsp') {
      return { url: TY_ENT, title: '娱乐八卦_天涯社区', render: tianyaEnt };
    }
    if (u === TY_TIGER) {
      return { url: TY_TIGER, title: '【直播】华南虎照片…_娱乐八卦_天涯社区', render: tianyaTiger };
    }
    if (u === 'www.verycd.com' || u === 'verycd.com' || u === 'www.verycd.com/index.html') {
      return { url: 'www.verycd.com', title: 'VeryCD · 分享互联网', render: verycdHome };
    }
    if (u === VC_PB) {
      return { url: VC_PB, title: '越狱 第三季 第4集 - VeryCD·分享互联网', render: verycdPrisonBreak };
    }
    return null;
  }

  window.WEBDATA = {
    resolve: resolve,
    FAVORITES: [
      { url: 'www.baidu.com', name: '百度' },
      { url: 'mp3.baidu.com', name: '百度MP3' },
      { url: 'www.xiaonei.com', name: '校内网' },
      { url: 'www.sina.com.cn', name: '新浪新闻' },
      { url: TB_WOW, name: '魔兽世界吧' },
      { url: 'www.tianya.cn', name: '天涯社区' },
      { url: 'www.verycd.com', name: 'VeryCD·分享互联网' },
    ],
  };
})();
