// ============================================================
//  WEDDING CARD — App Logic
//  Đọc WEDDING_CONFIG từ config.js và render thiệp
// ============================================================

(function () {
  "use strict";

  // ---- Apply CSS variables from config theme ----
  function applyTheme(theme) {
    const root = document.documentElement.style;
    root.setProperty("--cfg-primary",    theme.primary);
    root.setProperty("--cfg-secondary",  theme.secondary);
    root.setProperty("--cfg-accent",     theme.accent);
    root.setProperty("--cfg-bg",         theme.bg);
    root.setProperty("--cfg-bg-dark",    theme.bgDark);
    root.setProperty("--cfg-text",       theme.text);
    root.setProperty("--cfg-text-light", theme.textLight);
    root.setProperty("--cfg-petal",      theme.petal);
  }

  // ---- Render all dynamic content ----
  function render(cfg) {
    applyTheme(cfg.theme);

    // Names
    setText("hero-bride",  cfg.bride);
    setText("hero-groom",  cfg.groom);
    setText("page-title",  `Thiệp Cưới — ${cfg.bride} & ${cfg.groom}`);

    // Date badge
    const d = new Date(cfg.weddingDate);
    const dateStr = `${cfg.weddingDayLabel}, ${pad(d.getDate())} tháng ${pad(d.getMonth()+1)} năm ${d.getFullYear()}`;
    setText("hero-date", dateStr);

    // Invitation label & message
    setText("invite-title",   cfg.invitationTitle);
    setText("invite-message", cfg.invitationMessage);

    // Quote
    setText("quote-text",   cfg.quote);
    setText("quote-author", cfg.quoteAuthor);

    // Events
    renderEvent("event-wedding", {
      icon:    "🌿",
      title:   "Lễ Thành Hôn",
      date:    cfg.weddingDate,
      time:    cfg.weddingTime,
      venue:   cfg.venue,
      address: cfg.venueAddress,
      mapUrl:  cfg.venueMapUrl,
    });

    if (cfg.engagementDate) {
      renderEvent("event-engagement", {
        icon:    "🌸",
        title:   "Lễ Ăn Hỏi",
        date:    cfg.engagementDate,
        time:    cfg.engagementTime,
        venue:   cfg.engagementVenue,
        address: cfg.engagementAddress,
        mapUrl:  "",
      });
      show("engagement-section");
    }

    // Family
    setText("groom-father", cfg.groomFamily.father);
    setText("groom-mother", cfg.groomFamily.mother);
    setText("bride-father", cfg.brideFamily.father);
    setText("bride-mother", cfg.brideFamily.mother);

    // Countdown
    startCountdown(cfg.weddingDate);

    // Effects
    if (cfg.effects.fallingLeaves)  initLeaves(cfg.images && cfg.images.petals || []);
    if (cfg.effects.floatingDust)   initParticles(cfg.effects.particleCount, cfg.theme);
  }

  // ---- Helpers ----
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function show(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
  }

  function renderEvent(id, ev) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `
      <div class="event-icon">${ev.icon}</div>
      <div class="event-title">${ev.title}</div>
      <div class="event-detail">
        <strong>${formatDate(ev.date)}</strong><br>
        ${ev.time}<br><br>
        <strong>${ev.venue}</strong><br>
        ${ev.address}
        ${ev.mapUrl ? `<br><a class="map-link" href="${ev.mapUrl}" target="_blank" rel="noopener">🗺 Xem bản đồ</a>` : ""}
      </div>
    `;
  }

  // ---- Countdown timer ----
  function startCountdown(dateStr) {
    function update() {
      const now    = Date.now();
      const target = new Date(dateStr).getTime();
      let diff     = Math.max(0, target - now);

      const days  = Math.floor(diff / 86400000); diff -= days  * 86400000;
      const hours = Math.floor(diff /  3600000); diff -= hours *  3600000;
      const mins  = Math.floor(diff /    60000); diff -= mins  *    60000;
      const secs  = Math.floor(diff /     1000);

      setNum("cd-days",  days);
      setNum("cd-hours", hours);
      setNum("cd-mins",  mins);
      setNum("cd-secs",  secs);

      if (diff > 0) setTimeout(update, 1000);
    }
    update();
  }
  function setNum(id, n) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(n).padStart(2, "0");
  }

  // ---- Falling leaves ----
  function initLeaves(petals) {
    const useImg   = petals && petals.length > 0;
    const emojis   = ["🍃","🌿","🍀","🌱","🍂"];
    const count    = useImg ? Math.max(60, petals.length * 4) : 12;

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");

      if (useImg) {
        const src = petals[i % petals.length];
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        leaf.className = "leaf";
        leaf.appendChild(img);
        const tier = i % 5;
        const size = (tier === 0)           ? 36 + Math.random() * 8    // nhỏ  ~40px, 1/5
                   : (tier === 4)           ? 76 + Math.random() * 8    // lớn  ~80px, 1/5
                   :                         56 + Math.random() * 8;    // vừa  ~60px, 3/5
        leaf.style.width  = size + "px";
        leaf.style.height = size + "px";
      } else {
        leaf.className = "leaf leaf-emoji";
        leaf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const size = 0.7 + Math.random() * 0.8;
        leaf.style.fontSize = size + "rem";
      }

      const left  = Math.random() * 100;
      const dur   = 8 + Math.random() * 12;
      const delay = Math.random() * -20;
      leaf.style.left              = left + "vw";
      leaf.style.animationDuration = dur + "s";
      leaf.style.animationDelay    = delay + "s";

      document.body.appendChild(leaf);
    }
  }

  // ---- Floating dust particles (canvas) ----
  function initParticles(count, theme) {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Parse hex to rgb
    function hexRgb(hex) {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return [r,g,b];
    }
    const [pr,pg,pb] = hexRgb(theme.primary);
    const [ar,ag,ab] = hexRgb(theme.accent);

    const particles = Array.from({length: count}, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     1 + Math.random() * 2,
      dx:    (Math.random() - 0.5) * 0.4,
      dy:    -0.2 - Math.random() * 0.5,
      alpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5
        ? `rgba(${pr},${pg},${pb},`
        : `rgba(${ar},${ag},${ab},`,
    }));

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      particles.forEach(p => {
        p.x += p.dx + Math.sin(frame * 0.01 + p.phase) * 0.3;
        p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(frame * 0.02 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + a + ")";
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ---- Apply images ----
  function applyImages(images) {
    if (!images) return;

    // Ảnh minh hoạ giữa hero
    if (images.illustration) {
      const el = document.getElementById("hero-illustration");
      if (el) el.style.backgroundImage = `url('${images.illustration}')`;
    }

    // Cover fullscreen — phủ toàn màn hình
    if (images.coverFullscreen) {
      const el = document.getElementById("cover-fullscreen");
      if (el) {
        el.style.backgroundImage = `url('${images.coverFullscreen}')`;
        el.classList.add("active");
        document.body.classList.add("has-cover-fullscreen");
      }
    }

    // Cover box — nền của box thiệp (.page)
    if (images.coverBox) {
      const page = document.querySelector(".page");
      if (page) {
        page.style.backgroundImage = `url('${images.coverBox}')`;
        page.classList.add("has-cover-box");
      }
    }

    // Hero background
    if (images.heroBg) {
      const hero = document.querySelector(".hero");
      if (hero) {
        hero.style.setProperty("--hero-bg-img", `url('${images.heroBg}')`);
        hero.classList.add("has-bg-img");
      }
    }

    // Album
    if (images.album && images.album.length > 0) {
      renderAlbum(images.album);
    }
  }

  function renderAlbum(photos) {
    const section = document.getElementById("album-section");
    const grid    = document.getElementById("album-grid");
    if (!section || !grid) return;

    const n = photos.length;
    let cls = "count-many";
    if (n <= 6) cls = "count-" + n;

    grid.className = "album-grid " + cls;
    grid.innerHTML = photos.map((src, i) =>
      `<div class="album-item" data-index="${i}">
         <img src="${src}" alt="Ảnh cưới ${i + 1}" loading="lazy" />
       </div>`
    ).join("");

    section.style.display = "";

    // Lightbox
    initLightbox(photos);
  }

  function initLightbox(photos) {
    const lb      = document.getElementById("album-lightbox");
    const lbImg   = document.getElementById("lb-img");
    const lbClose = document.getElementById("lb-close");
    const lbPrev  = document.getElementById("lb-prev");
    const lbNext  = document.getElementById("lb-next");
    const lbCount = document.getElementById("lb-counter");
    if (!lb || !lbImg) return;

    let current = 0;

    function open(i) {
      current = (i + photos.length) % photos.length;
      lbImg.src = photos[current];
      lbCount.textContent = `${current + 1} / ${photos.length}`;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }

    document.getElementById("album-grid").addEventListener("click", e => {
      const item = e.target.closest(".album-item");
      if (item) open(Number(item.dataset.index));
    });

    lbClose.addEventListener("click", close);
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    lbPrev.addEventListener("click", () => open(current - 1));
    lbNext.addEventListener("click", () => open(current + 1));

    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "ArrowLeft")  open(current - 1);
      if (e.key === "ArrowRight") open(current + 1);
      if (e.key === "Escape")     close();
    });
  }

  // ---- Intro screen ----
  function initIntro(cfg) {
    const screen = document.getElementById("intro-screen");
    const card   = document.getElementById("intro-card");
    if (!screen || !card) return;

    setText("intro-bride", cfg.bride);
    setText("intro-groom", cfg.groom);

    if (cfg.images && cfg.images.introBg) {
      screen.style.backgroundImage = `url('${cfg.images.introBg}')`;
    }

    let opened = false;
    function open() {
      if (opened) return;
      opened = true;
      card.classList.add("opening");
      setTimeout(() => screen.classList.add("hidden"), 600);
    }

    card.addEventListener("click", open);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") open();
    });
  }

  // ---- Boot ----
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      render(WEDDING_CONFIG);
      applyImages(WEDDING_CONFIG.images);
      initIntro(WEDDING_CONFIG);
    });
  } else {
    render(WEDDING_CONFIG);
    applyImages(WEDDING_CONFIG.images);
    initIntro(WEDDING_CONFIG);
  }
})();
