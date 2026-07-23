/* =====================================================================
   小猪 × 小兔  ·  script.js

   目前做三件事：
     1) 让空气里飘一点点灰尘（氛围）
     2) “进入我们的家” → 推门 · 暖光 · 走进客厅（约 1.8 秒）
     3) “回门口” → 温柔地退回首页
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. 漂浮的灰尘
   --------------------------------------------------------------------- */
function makeDust() {
  const box = document.getElementById("dust");
  if (!box) return;
  const COUNT = 16;
  for (let i = 0; i < COUNT; i++) {
    const mote = document.createElement("span");
    mote.className = "dust-mote";
    const size = 2 + Math.random() * 4;
    mote.style.width  = size + "px";
    mote.style.height = size + "px";
    mote.style.left   = Math.random() * 100 + "vw";
    mote.style.top    = 60 + Math.random() * 40 + "vh";
    mote.style.animationDuration = 14 + Math.random() * 16 + "s";
    mote.style.animationDelay    = -Math.random() * 20 + "s";
    box.appendChild(mote);
  }
}


/* ---------------------------------------------------------------------
   2. 进门 / 回门口 的过场
   —— 状态全部挂在 <body> 上，CSS 负责所有动画：
        entering ：正在推门（镜头前探 + 暖光漫开）
        inside   ：已经在客厅里
   --------------------------------------------------------------------- */
function bindTransitions() {
  const body    = document.body;
  const enterBtn = document.getElementById("enterBtn");
  const backBtn  = document.getElementById("backBtn");
  const room     = document.getElementById("room");

  let busy = false;   // 过场进行中，避免重复触发

  // —— 走进客厅 ——
  function enter() {
    if (busy || body.classList.contains("inside")) return;
    busy = true;
    body.classList.add("entering");          // 推门 + 暖光漫开

    // 暖光铺满后，切到客厅
    setTimeout(function () {
      body.classList.add("inside");           // 客厅淡入 + 暖光退去
      body.classList.remove("entering");
      centerRoomView();                       // 视线落在房间正中
      if (room) room.setAttribute("aria-hidden", "false");
    }, 1150);

    // 过场结束，解锁
    setTimeout(function () { busy = false; }, 2000);
  }

  // —— 退回门口 ——
  function leave() {
    if (busy) return;
    busy = true;
    body.classList.remove("inside");          // 客厅淡出，首页淡入
    if (room) room.setAttribute("aria-hidden", "true");
    setTimeout(function () { busy = false; }, 900);
  }

  if (enterBtn) enterBtn.addEventListener("click", enter);
  if (backBtn)  backBtn.addEventListener("click", leave);
}


/* =====================================================================
   ★★★ 照片墙的内容就在这里 —— 以后你自己加照片、改文字，只动这一块 ★★★

   每张照片是一段 { src, title, date, desc }：
     src   ：图片路径。把你的照片放进  文件夹，
             再把这里的文件名改成你的，比如 "我们的海边.jpg"
     title ：标题（比如「一起去的海边」）
     date  ：日期（随便写，比如「2026.06.20」）
     desc  ：想说的一句话

   想加一张：复制一行 { ... }，粘在下面，改成你的就行。
   （现在这几张是占位小图，换成真照片后会自动铺满。）
   ===================================================================== */
const PHOTOS = [
  { src: "photo-1.jpg", title: "相遇在晚霞里", date: "2024.12.05", desc: "那道粉紫色的晚霞会永远陪你回家" },
  { src: "photo-2.jpg", title: "第一次一起旅行", date: "2024.12.16", desc: "紧张但幸福的一场梦" },
  { src: "photo-3.jpg", title: "每周都有的小小约会", date: "2025.01.25", desc: "皮衣小姐永远闪亮登场" },
  { src: "photo-4.jpg", title: "最难忘的生日呀", date: "2025.05.27", desc: "火山上的星星会实现你的心愿" },
  { src: "photo-5.jpg", title: "我的宝宝毕业啦", date: "2026.07.03", desc: "一起走向更远的未来吧" },
];

/* 图片加载失败时，温柔地显示一块“照片”占位，而不是裂图 */
function onImgError(img) {
  img.parentNode.classList.add("is-missing");
  img.remove();
}

/* 照片墙：一整面钉满照片的墙 */
function renderPhotoWall(inner) {
  let html =
    '<div class="pw__head">' +
    '<p class="pw__eyebrow" id="viewerTitle">Photo Wall</p>' +
    '<h2 class="pw__title">照片墙</h2>' +
    '<p class="pw__sub">轻轻点一张，看看那天的故事。</p></div>' +
    '<div class="pw__grid">';
  PHOTOS.forEach(function (p, i) {
    html +=
      '<button class="pw__item" type="button" data-i="' + i + '">' +
        '<span class="pw__thumb"><img src="' + p.src + '" alt="' + p.title +
          '" loading="lazy" onerror="onImgError(this)"></span>' +
        '<span class="pw__cap">' + p.title + '</span>' +
        '<span class="pw__date">' + p.date + '</span>' +
      '</button>';
  });
  html += '</div>';
  inner.innerHTML = html;
  inner.querySelectorAll(".pw__item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      renderPhotoDetail(inner, parseInt(btn.dataset.i, 10));
    });
  });
}

/* 单张照片展开 */
function renderPhotoDetail(inner, i) {
  const p = PHOTOS[i];
  inner.innerHTML =
    '<button class="pw-back" type="button">‹ 回照片墙</button>' +
    '<div class="pw-detail__photo"><img src="' + p.src + '" alt="' + p.title +
      '" onerror="onImgError(this)"></div>' +
    '<p class="pw-detail__date">' + p.date + '</p>' +
    '<h3 class="pw-detail__title">' + p.title + '</h3>' +
    (p.desc ? '<p class="pw-detail__desc">' + p.desc + '</p>' : '');
  inner.querySelector(".pw-back").addEventListener("click", function () {
    renderPhotoWall(inner);
  });
}


/* =====================================================================
   ★★★ 放映室的内容就在这里 —— 加电影、改文字，只动这一块 ★★★

   每部电影是一段 { poster, title, date, rating, note }：
     poster ：海报图片路径（放进 ，再改文件名）
     title  ：电影名
     date   ：你们看它的日期
     rating ：几颗心（1–5，填数字）
     note   ：关于这次一起看的一句话

   想加一部：复制一行 { ... } 粘在下面就好。
   （现在这几张是占位海报，换成真海报后会自动排好。）
   ===================================================================== */
const MOVIES = [
  { poster: "movie-1.jpg", title: "机器人之梦", date: "", rating: 5, note: "今天要去沙滩找机器人吗?" },
  { poster: "movie-2.jpg", title: "喜人奇妙夜",     date: "", rating: 5, note: "爱屋及乌的颜小葵被喜剧感动成了泪人" },
  { poster: "movie-3.jpg", title: "我可以47",         date: "", rating: 4, note: "雌鹰一般的女人绝不认输！！" },
  { poster: "movie-4.jpg", title: "这就是灌篮",       date: "", rating: 4, note: "打了一辈子篮球，姐姐精准命中我的篮筐" },
  { poster: "movie-5.jpg", title: "我许可",   date: "", rating: 5, note: "永远做最自信最自由的女孩呀" },
];

/* 把评分画成心：实心 + 空心 */
function hearts(n) {
  n = Math.max(0, Math.min(5, n | 0));
  return "♥".repeat(n) + '<span class="off">' + "♥".repeat(5 - n) + "</span>";
}

/* 放映室：一排电影海报 */
function renderScreeningRoom(inner) {
  let html =
    '<div class="sr__head">' +
    '<p class="sr__eyebrow" id="viewerTitle">Cinema</p>' +
    '<h2 class="sr__title">放映室</h2>' +
    '<p class="sr__sub">我们一起看过的电影。点一张海报看看。</p></div>' +
    '<div class="sr__strip"></div><div class="sr__grid">';
  MOVIES.forEach(function (m, i) {
    html +=
      '<button class="sr__item" type="button" data-i="' + i + '">' +
        '<span class="sr__poster"><img src="' + m.poster + '" alt="' + m.title +
          '" loading="lazy" onerror="onImgError(this)"></span>' +
        '<span class="sr__name">' + m.title + '</span>' +
        (m.date ? '<span class="sr__meta">' + m.date + '</span>' : '') +
        '<span class="sr__meta sr__hearts">' + hearts(m.rating) + '</span>' +
      '</button>';
  });
  html += '</div>';
  inner.innerHTML = html;
  inner.querySelectorAll(".sr__item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      renderMovieDetail(inner, parseInt(btn.dataset.i, 10));
    });
  });
}

/* 单部电影展开 */
function renderMovieDetail(inner, i) {
  const m = MOVIES[i];
  inner.innerHTML =
    '<button class="pw-back" type="button">‹ 回放映室</button>' +
    '<div class="sr-detail">' +
      '<div class="sr-detail__poster"><img src="' + m.poster + '" alt="' + m.title +
        '" onerror="onImgError(this)"></div>' +
      '<div class="sr-detail__info">' +
        (m.date ? '<p class="sr-detail__date">' + m.date + '</p>' : '') +
        '<h3 class="sr-detail__title">' + m.title + '</h3>' +
        '<div class="sr-detail__hearts">' + hearts(m.rating) + '</div>' +
        '<p class="sr-detail__note">' + m.note + '</p>' +
      '</div>' +
    '</div>';
  inner.querySelector(".pw-back").addEventListener("click", function () {
    renderScreeningRoom(inner);
  });
}


/* =====================================================================
   ★★★ 日记的内容就在这里 —— 以后一直往下写，只动这一块 ★★★

   每一天是一段 { date, pig, bunny }：
     date  ：这一天的日期
     pig   ：小猪那一页 { text: "想说的话", img: "图片.jpg" }
     bunny ：小兔那一页 { text: "想说的话", img: "图片.jpg" }
   img 可留空 ""，那一页就只有文字。

   想再写一天：复制一整段 { date:..., pig:{...}, bunny:{...} }，
   粘在最上面（最新的一天放最前面）。
   ===================================================================== */
const DIARY = [
  { date: "",
    pig:   { text: "今天健身很累，但一看到你就很开心！谢谢你一直陪着我。", img: "diary-1a.jpg" },
    bunny: { text: "每天都吃小猪饭饭，超级好吃！你是最棒的厨师～",     img: "diary-1b.jpg" } },
  { date: "",
    pig:   { text: "我特别喜欢听你说话，每一句都很珍贵，永远不会嫌你话多。",               img: "diary-2a.jpg" },
    bunny: { text: "和你在一起的时候感觉有种很安静的幸福。",   img: "diary-2b.jpg" } },
  { date: "",
    pig:   { text: "虽然不在一起，我也会给姐姐拍照，和小兔待在一起。",     img: "diary-3a.jpg" },
    bunny: { text: "你是我最好的朋友，最亲密的家人，也是我托付一生的恋人。",                   img: "diary-3b.jpg" } },
];

/* 两个小头像 */
const PIG_FACE =
  '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9,11 L13,4 L18,11 Z M31,11 L27,4 L22,11 Z" fill="#E39A90"/>' +
  '<circle cx="20" cy="21" r="14" fill="#EDA99F"/><ellipse cx="20" cy="24" rx="7" ry="5" fill="#F2B8AF"/>' +
  '<circle cx="17.5" cy="24" r="1.3" fill="#7A4A42"/><circle cx="22.5" cy="24" r="1.3" fill="#7A4A42"/>' +
  '<circle cx="15" cy="18" r="1.6" fill="#2E241C"/><circle cx="25" cy="18" r="1.6" fill="#2E241C"/></svg>';
const BUNNY_FACE =
  '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="13" y="1" width="5" height="16" rx="2.5" fill="#FBF7EF"/>' +
  '<rect x="22" y="1" width="5" height="16" rx="2.5" fill="#FBF7EF"/><circle cx="20" cy="23" r="13" fill="#FBF7EF"/>' +
  '<circle cx="20" cy="7" r="3" fill="#E7A79A"/><circle cx="16" cy="22" r="1.5" fill="#5A4636"/>' +
  '<circle cx="24" cy="22" r="1.5" fill="#5A4636"/><path d="M18.5,26 L21.5,26 L20,28 Z" fill="#E7A79A"/></svg>';

/* 一页（小猪 或 小兔） */
function diaryPage(side, who, date, data) {
  const face = who === "pig" ? PIG_FACE : BUNNY_FACE;
  const name = who === "pig" ? "小猪说" : "小兔说";
  const img  = data.img
    ? '<div class="dy__img"><img src="' + data.img + '" alt="" onerror="onImgError(this)"></div>' : '';
  return '<div class="dy__page dy__page--' + side + '">' +
    '<div class="dy__who">' + face + '<span class="dy__whoname">' + name + '</span></div>' +
    (date ? '<p class="dy__date">' + date + '</p>' : '') +
    '<p class="dy__text">' + data.text + '</p>' + img + '</div>';
}

/* 日记：左右两页 + 一天天翻 */
function renderDiary(inner, i) {
  const day = DIARY[i];
  inner.innerHTML =
    '<div class="dy__head"><p class="dy__eyebrow" id="viewerTitle">Diary</p><h2 class="dy__title">日记</h2></div>' +
    '<div class="dy"><div class="dy__book">' +
      diaryPage("left",  "pig",   day.date, day.pig) +
      diaryPage("right", "bunny", day.date, day.bunny) +
    '</div><div class="dy__nav">' +
      '<button class="dy__btn" type="button" data-nav="-1"' + (i === 0 ? " disabled" : "") + '>‹ 前一天</button>' +
      '<span class="dy__count">第 ' + (i + 1) + ' / ' + DIARY.length + ' 天</span>' +
      '<button class="dy__btn" type="button" data-nav="1"' + (i === DIARY.length - 1 ? " disabled" : "") + '>后一天 ›</button>' +
    '</div></div>';
  inner.querySelectorAll(".dy__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const ni = i + parseInt(btn.dataset.nav, 10);
      if (ni >= 0 && ni < DIARY.length) renderDiary(inner, ni);
    });
  });
}


/* ---------------------------------------------------------------------
   3. 客厅里的物件 → 翻开卡片
   点墙上的照片墙 / 桌上的日记本 / 柜上的小电视，翻开一张卡片。
   （第 5–7 步会把卡片里的占位换成真正的照片墙 / 放映室 / 日记。）
   --------------------------------------------------------------------- */
const CARDS = {
  photos: {
    eyebrow: "Photo Wall",
    title:   "照片墙",
    line:    "这面墙，以后会挂满你们一起拍的照片。",
    soon:    "下一步，就在这里把照片一张张挂上来 ✎",
  },
  movies: {
    eyebrow: "Cinema",
    title:   "放映室",
    line:    "我们一起看过的每一部电影，会一张张排在这里。",
    soon:    "下一步，海报就要亮灯了 ✎",
  },
  diary: {
    eyebrow: "Diary",
    title:   "日记",
    line:    "一本一直写不完的日记，翻开就是我们的每一天。",
    soon:    "下一步，日记会展开成左右两页 ✎",
  },
};

function bindRoom() {
  const viewer  = document.getElementById("viewer");
  const inner   = document.getElementById("viewerInner");
  const card    = viewer ? viewer.querySelector(".viewer__card") : null;
  const closeBtn = document.getElementById("viewerClose");
  if (!viewer || !inner) return;

  let lastFocused = null;

  function open(key) {
    if (key === "photos") {
      if (card) card.classList.add("viewer__card--wide");
      renderPhotoWall(inner);
    } else if (key === "movies") {
      if (card) card.classList.add("viewer__card--wide");
      renderScreeningRoom(inner);
    } else if (key === "diary") {
      if (card) card.classList.add("viewer__card--wide");
      renderDiary(inner, 0);
    } else {
      const data = CARDS[key];
      if (!data) return;
      if (card) card.classList.remove("viewer__card--wide");
      inner.innerHTML =
        '<p class="vc__eyebrow" id="viewerTitle">' + data.eyebrow + '</p>' +
        '<h2 class="vc__title">' + data.title + '</h2>' +
        '<p class="vc__line">' + data.line + '</p>' +
        '<p class="vc__soon">' + data.soon + '</p>';
    }
    lastFocused = document.activeElement;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // 每个发光物件：点击 / 回车 / 空格 都能翻开
  document.querySelectorAll(".hotspot").forEach(function (el) {
    const key = el.getAttribute("data-open");
    el.addEventListener("click", function () { open(key); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(key); }
    });
  });

  // 合上：按钮 / 点背景 / Esc
  if (closeBtn) closeBtn.addEventListener("click", close);
  viewer.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && viewer.classList.contains("is-open")) close();
  });
}


/* ---------------------------------------------------------------------
   4. 竖屏时的“环视房间”
   手机竖着看时，房间比屏幕宽。这里把视线先放在正中间，
   再让人可以左右滑动，看看角落里的东西。
   --------------------------------------------------------------------- */
let ignoreScrollUntil = 0;   // 自动居中会触发 scroll，别把提示误关掉

function centerRoomView() {
  const scene = document.querySelector(".room__scene");
  if (!scene) return;
  ignoreScrollUntil = Date.now() + 800;
  scene.scrollLeft = (scene.scrollWidth - scene.clientWidth) / 2;
}

function setupLookAround() {
  const scene = document.querySelector(".room__scene");
  const hint  = document.getElementById("roomHint");
  if (!scene) return;

  centerRoomView();
  window.addEventListener("resize", centerRoomView);

  // 滑动过一次，提示就退下
  scene.addEventListener("scroll", function () {
    if (Date.now() < ignoreScrollUntil) return;   // 是自动居中，不是人在滑
    if (hint) hint.classList.add("is-gone");
  }, { passive: true });

  // 没滑也没关系，几秒后自己消失
  if (hint) setTimeout(function () { hint.classList.add("is-gone"); }, 6000);
}


/* =====================================================================
   ★★★ 留声机的歌单 —— 想放几首就放几首 ★★★

   把歌曲文件放进  文件夹，
   再把文件名照下面的格式写进来，一行一首：

     "theme.mp3",
     "我们的歌.mp3",

   每次点亮留声机，会随机挑一首；这首放完，自己接上下一首。
   只写一首也没问题，它会一直循环。
   文件名建议用简单的英文或中文，别带空格；mp3 / m4a / wav 都能放。
   （现在这首还不存在也没关系，动画照常，放进去就会响。）
   ===================================================================== */
const MUSIC = [
  "大雨.mp3",
  "这条小鱼在乎.mp3",
  "滥俗的歌.mp3",
  "思念.mp3",
  "这世界那么多人.mp3",
  "寂寞烟火.mp3",
  "星空.mp3",
  "约会在星期天晚上.mp3",
];


/* =====================================================================
   ★★★ 留声机的纸条 —— 想加想改，动这一块就好 ★★★
   每次点击，随机浮现其中一句。
   ===================================================================== */
const MUSIC_NOTES = [
  "今天也一起生活吧。",
  "欢迎回家。",
  "今天也是幸福的一天。",
  "有你在真好。",
  "今天辛苦啦。",
  "早点休息。",
  "小兔今天也很可爱。",
  "小猪一直都在。",
  "慢慢来，不着急。",
  "记得喝水呀。",
  "今天想吃什么？",
  "一起把灯打开吧。",
  "你回来了，真好。",
  "外面冷，进来坐。",
  "我们又一起过了一天。",
  "今天也想抱抱你。",
  "窗外的风很舒服。",
  "一起把这首歌听完。",
  "明天也会是好天气。",
  "你笑起来最好看。",
  "家里一直给你留着灯。",
  "谢谢你今天也在。",
];


/* ---------------------------------------------------------------------
   5. 留声机
   点一下：唱针缓缓落下 → 唱片慢慢转起来（约 2 秒到稳定，8 秒一圈）
           → 音乐响起 → 墙上浮出一张纸条 → 屋子暖一点点
   再点一下：唱针抬起，唱片慢慢停下（约 2 秒），一切归于安静。
   动画全部交给 requestAnimationFrame，转速自己缓缓加减，不会突然启停。
   --------------------------------------------------------------------- */
function setupGramophone() {
  const gramo = document.getElementById("gramophone");
  const spin  = document.getElementById("gramoSpin");
  const arm   = document.getElementById("gramoArm");
  const noteText = document.getElementById("gramoNoteText");
  const hintText = document.getElementById("gramoHintText");
  if (!gramo || !spin || !arm) return;

  const TURN     = 360 / 8000;   // 稳定转速：8 秒一圈（度 / 毫秒）
  const SPIN_UP  = 2000;         // 加速 / 减速各约 2 秒
  const ARM_UP   = -15;          // 唱针抬起的角度
  const VOLUME   = 0.55;
  const FADE     = 2500;         // 音量渐入渐出

  let playing = false;
  let angle = 0, speed = 0, armAngle = ARM_UP;
  let last = null, raf = null;
  let audio = null;

  let track = -1;   // 当前放到第几首

  function getAudio() {
    if (!audio) {
      audio = new Audio();
      audio.volume = 0;
      // 一首放完，安安静静地接上下一首
      audio.addEventListener("ended", function () {
        if (!playing || MUSIC.length === 0) return;
        track = (track + 1) % MUSIC.length;
        audio.src = MUSIC[track];
        const p = audio.play();
        if (p && p.catch) p.catch(function () {});
      });
    }
    return audio;
  }

  // 随机挑一首，尽量不要和刚才那首重复
  function pickTrack() {
    if (MUSIC.length === 0) return -1;
    if (MUSIC.length === 1) return 0;
    let i = track;
    while (i === track) i = Math.floor(Math.random() * MUSIC.length);
    return i;
  }

  function frame(now) {
    if (last === null) last = now;
    const dt = Math.min(now - last, 60);
    last = now;

    // 转速：慢慢加上去，慢慢落下来
    const targetSpeed = playing ? TURN : 0;
    const step = TURN * dt / SPIN_UP;
    if (speed < targetSpeed)      speed = Math.min(targetSpeed, speed + step);
    else if (speed > targetSpeed) speed = Math.max(targetSpeed, speed - step);
    angle = (angle + speed * dt) % 360;
    spin.setAttribute("transform", "rotate(" + angle.toFixed(2) + ")");

    // 唱针：约 400ms 缓缓落下 / 抬起
    const armTarget = playing ? 0 : ARM_UP;
    armAngle += (armTarget - armAngle) * (1 - Math.exp(-dt / 140));
    arm.setAttribute("transform", "rotate(" + armAngle.toFixed(2) + ")");

    // 音量跟着一起进退
    if (audio) {
      const vTarget = playing ? VOLUME : 0;
      const vStep = VOLUME * dt / FADE;
      if (audio.volume < vTarget)      audio.volume = Math.min(vTarget, audio.volume + vStep);
      else if (audio.volume > vTarget) audio.volume = Math.max(vTarget, audio.volume - vStep);
      if (!playing && audio.volume === 0 && !audio.paused) audio.pause();
    }

    const settled = !playing && speed === 0 && Math.abs(armAngle - armTarget) < 0.05;
    if (settled) { raf = null; last = null; }
    else raf = requestAnimationFrame(frame);
  }

  function wake() { if (raf === null) raf = requestAnimationFrame(frame); }

  function toggle() {
    playing = !playing;

    if (playing) {
      // 换一张今天的纸条
      if (noteText) {
        noteText.textContent = MUSIC_NOTES[Math.floor(Math.random() * MUSIC_NOTES.length)];
      }
      document.body.classList.add("music-on");
      if (MUSIC.length > 0) {
        const a = getAudio();
        track = pickTrack();
        a.src = MUSIC[track];
        const p = a.play();
        if (p && p.catch) p.catch(function () { /* 还没放音乐文件，安静地转就好 */ });
      }
    } else {
      document.body.classList.remove("music-on");
    }

    if (hintText) {
      hintText.textContent = playing ? "点一下，让它慢慢停下" : "点击播放今天的音乐";
    }
    wake();
  }

  gramo.addEventListener("click", toggle);
  gramo.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });

  // 回门口时，让它自己安静下来
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.addEventListener("click", function () {
    if (playing) toggle();
  });

  // 一开始：唱针是抬着的，唱片不转
  arm.setAttribute("transform", "rotate(" + ARM_UP + ")");
}


/* ---------------------------------------------------------------------
   启动
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  makeDust();
  bindTransitions();
  bindRoom();
  setupLookAround();
  setupGramophone();
});
