// ============================================================
//  WEDDING CARD — App Logic
// ============================================================

(function () {
  "use strict";

  // ---- CSS theme vars ----
  function applyTheme(theme) {
    if (!theme) return;
    const s = document.documentElement.style;
    if (theme.primary)    s.setProperty("--primary",    theme.primary);
    if (theme.primaryDk)  s.setProperty("--primary-dk", theme.primaryDk);
    if (theme.accent)     s.setProperty("--accent",     theme.accent);
    if (theme.bg)         s.setProperty("--bg",         theme.bg);
    if (theme.bgCard)     s.setProperty("--bg-card",    theme.bgCard);
    if (theme.text)       s.setProperty("--text",       theme.text);
    if (theme.textLight)  s.setProperty("--text-light", theme.textLight);
    if (theme.textMuted)  s.setProperty("--text-muted", theme.textMuted);
  }

  // ---- Helpers ----
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.textContent = val;
  }
  function setHtml(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.innerHTML = val;
  }
  function show(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  const VI_MONTHS = ["tháng 1","tháng 2","tháng 3","tháng 4","tháng 5","tháng 6",
                     "tháng 7","tháng 8","tháng 9","tháng 10","tháng 11","tháng 12"];
  const VI_DAYS   = ["CN","T2","T3","T4","T5","T6","T7"];

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
  }

  // ---- Render ----
  function render(cfg) {
    applyTheme(cfg.theme);

    // Page title
    setText("page-title", `Thiệp Cưới — ${cfg.groom} & ${cfg.bride}`);

    // Hero
    setText("hero-groom",    cfg.groom);
    setText("hero-bride",    cfg.bride);
    setText("invite-title",  cfg.invitationTitle || "Trân Trọng Kính Mời");

    // Wedding info section
    setText("wi-groom",       cfg.groom);
    setText("wi-bride",       cfg.bride);
    setText("wi-time",        cfg.weddingTime);
    setText("wi-venue-name",  cfg.venue);
    setText("wi-venue-addr",  cfg.venueAddress);

    const wd = new Date(cfg.weddingDate);
    setText("wi-dayname", cfg.weddingDayLabel || "");
    setText("wi-day",     pad(wd.getDate()));
    setText("wi-month",   "Tháng " + pad(wd.getMonth() + 1));
    setText("wi-year",    String(wd.getFullYear()));
    if (cfg.lunarDate) setText("wi-lunar", cfg.lunarDate);

    // Family
    setText("groom-father", cfg.groomFamily && cfg.groomFamily.father);
    setText("groom-mother", cfg.groomFamily && cfg.groomFamily.mother);
    setText("bride-father", cfg.brideFamily && cfg.brideFamily.father);
    setText("bride-mother", cfg.brideFamily && cfg.brideFamily.mother);

    // Engagement
    if (cfg.engagementDate) {
      renderEngagement(cfg);
      show("engagement-section");
    }

    // Venue section
    setText("venue-name",    cfg.venue);
    setText("venue-address", cfg.venueAddress);
    setText("venue-time-note", `Tiệc cưới sẽ diễn ra vào lúc: ${cfg.weddingTime}`);
    renderVenueMap(cfg.venueMapUrl, cfg.venue, cfg.venueAddress);

    // Footer message
    setText("invite-message-footer",
      cfg.invitationMessage ||
      "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!");

    // Countdown + calendar
    startCountdown(cfg.weddingDate);
    renderCalendar(cfg.weddingDate);

    // Effects
    if (cfg.effects && cfg.effects.fallingLeaves) initLeaves(cfg.images && cfg.images.petals || []);
    if (cfg.effects && cfg.effects.floatingDust)  initParticles(cfg.effects.particleCount || 40);
  }

  function renderEngagement(cfg) {
    const el = document.getElementById("event-engagement");
    if (!el) return;
    el.innerHTML = `
      <div class="event-icon">🌸</div>
      <div class="event-title">Lễ Ăn Hỏi</div>
      <div class="event-detail">
        <strong>${formatDate(cfg.engagementDate)}</strong><br>
        ${cfg.engagementTime || ""}<br><br>
        <strong>${cfg.engagementVenue || ""}</strong><br>
        ${cfg.engagementAddress || ""}
      </div>`;
  }

  function renderVenueMap(mapUrl, venueName, venueAddress) {
    const el = document.getElementById("venue-map");
    if (!el) return;

    let embedSrc = "";
    let linkHref = "";

    if (mapUrl && mapUrl.includes("embed")) {
      // URL embed trực tiếp
      embedSrc = mapUrl;
      linkHref = mapUrl.replace("embed?", "search?");
    } else if (mapUrl && mapUrl.trim()) {
      // URL xem bình thường — chuyển sang embed
      linkHref = mapUrl;
      const q   = encodeURIComponent(mapUrl);
      embedSrc  = `https://maps.google.com/maps?q=${q}&output=embed`;
    } else {
      // Không có URL — embed theo tên + địa chỉ
      const q   = encodeURIComponent((venueName || "") + " " + (venueAddress || ""));
      embedSrc  = `https://maps.google.com/maps?q=${q}&output=embed`;
      linkHref  = `https://maps.google.com/maps?q=${q}`;
    }

    el.innerHTML = `
      <div class="map-frame">
        <iframe src="${embedSrc}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <a class="map-link" href="${linkHref}" target="_blank" rel="noopener">🗺 Xem bản đồ lớn</a>`;
  }

  // ---- Countdown ----
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

  // ---- Calendar grid ----
  function renderCalendar(dateStr) {
    const widget = document.getElementById("calendar-widget");
    if (!widget) return;

    const d     = new Date(dateStr);
    const year  = d.getFullYear();
    const month = d.getMonth();    // 0-based
    const weddingDay = d.getDate();

    const firstDay  = new Date(year, month, 1).getDay(); // 0=CN
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthLabel = `Tháng ${month + 1} / ${year}`;

    let gridHtml = VI_DAYS.map(d => `<div class="cal-day-name">${d}</div>`).join("");

    // empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      gridHtml += `<div class="cal-day empty"></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      if (day === weddingDay) {
        gridHtml += `<div class="cal-day today">${day}<span class="cal-heart">♥</span></div>`;
      } else {
        gridHtml += `<div class="cal-day">${day}</div>`;
      }
    }

    widget.innerHTML = `
      <div class="cal-header">${monthLabel}</div>
      <div class="cal-grid">${gridHtml}</div>`;
  }

  // ---- Images ----
  function applyImages(images) {
    if (!images) return;

    if (images.illustration) {
      const el = document.getElementById("hero-illustration");
      if (el) el.style.backgroundImage = `url('${images.illustration}')`;
    }
    if (images.coverFullscreen) {
      const el = document.getElementById("cover-fullscreen");
      if (el) {
        el.style.backgroundImage = `url('${images.coverFullscreen}')`;
        el.classList.add("active");
        document.body.classList.add("has-cover-fullscreen");
      }
    }
    if (images.coverBox) {
      const page = document.querySelector(".page");
      if (page) {
        page.style.backgroundImage = `url('${images.coverBox}')`;
        page.classList.add("has-cover-box");
      }
    }
    if (images.heroBg) {
      const hero = document.querySelector(".hero");
      if (hero) {
        hero.style.setProperty("--hero-bg-img", `url('${images.heroBg}')`);
        hero.classList.add("has-bg-img");
      }
    }
    if (images.album && images.album.length > 0) {
      renderAlbum(images.album);
    }
  }

  function renderAlbum(photos) {
    const section = document.getElementById("album-section");
    const grid    = document.getElementById("album-grid");
    if (!section || !grid) return;

    const n   = photos.length;
    let cls   = "count-many";
    if (n <= 6) cls = "count-" + n;

    grid.className = "album-grid " + cls;
    grid.innerHTML = photos.map((src, i) =>
      `<div class="album-item" data-index="${i}">
         <img src="${src}" alt="Ảnh cưới ${i + 1}" loading="lazy" />
       </div>`
    ).join("");

    section.style.display = "";
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
      if (lbCount) lbCount.textContent = `${current + 1} / ${photos.length}`;
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

  // ---- Falling leaves ----
  function initLeaves(petals) {
    const useImg = petals && petals.length > 0;
    const emojis = ["🍃","🌿","🍀","🌱","🍂"];
    const count  = useImg ? Math.max(60, petals.length * 4) : 12;

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
        const size = tier === 0 ? 36 + Math.random() * 8
                   : tier === 4 ? 76 + Math.random() * 8
                   :              56 + Math.random() * 8;
        leaf.style.width  = size + "px";
        leaf.style.height = size + "px";
      } else {
        leaf.className = "leaf leaf-emoji";
        leaf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        leaf.style.fontSize = (0.7 + Math.random() * 0.8) + "rem";
      }

      leaf.style.left              = (Math.random() * 100) + "vw";
      leaf.style.animationDuration = (8 + Math.random() * 12) + "s";
      leaf.style.animationDelay    = (Math.random() * -20) + "s";
      document.body.appendChild(leaf);
    }
  }

  // ---- Floating dust particles ----
  function initParticles(count) {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#47613e";

    const particles = Array.from({length: count}, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     1 + Math.random() * 1.5,
      dx:    (Math.random() - 0.5) * 0.35,
      dy:    -0.18 - Math.random() * 0.4,
      alpha: 0.15 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      particles.forEach(p => {
        p.x += p.dx + Math.sin(frame * 0.01 + p.phase) * 0.25;
        p.y += p.dy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10)              p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(frame * 0.02 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(71,97,62,${a})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ---- Intro screen ----
  function initIntro(cfg) {
    const screen = document.getElementById("intro-screen");
    const card   = document.getElementById("intro-card");
    if (!screen || !card) return;

    setText("intro-bride", cfg.bride);
    setText("intro-groom", cfg.groom);

    // Date on intro
    const d = new Date(cfg.weddingDate);
    const dateLabel = `${pad(d.getDate())} ${VI_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
    setText("intro-date-text", dateLabel);

    if (cfg.images && cfg.images.introBg) {
      screen.style.backgroundImage = `url('${cfg.images.introBg}')`;
    }

    let opened = false;
    function openCard() {
      if (opened) return;
      opened = true;
      card.classList.add("opening");
      setTimeout(() => screen.classList.add("hidden"), 620);
    }

    card.addEventListener("click", openCard);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") openCard();
    });
  }

  // ---- Music player ----
  function initMusic(tracks) {
    if (!tracks || tracks.length === 0) return;

    const player    = document.getElementById("music-player");
    const toggle    = document.getElementById("music-toggle");
    const iconPlay  = toggle && toggle.querySelector(".music-icon-play");
    const iconPause = toggle && toggle.querySelector(".music-icon-pause");
    const trackName = document.getElementById("music-track-name");
    const progress  = document.getElementById("music-progress");
    if (!player || !toggle) return;

    player.style.display = "";

    const audio    = new Audio();
    audio.preload  = "auto";
    let current    = 0;
    let playing    = false;
    let userPaused = false;

    function loadTrack(i) {
      current = (i + tracks.length) % tracks.length;
      const track = tracks[current];
      audio.src = track.src;
      if (trackName) trackName.textContent = track.name;
      if (progress)  progress.style.width  = "0%";
    }

    function setIcons(isPlaying) {
      if (iconPlay)  iconPlay.style.display  = isPlaying ? "none" : "";
      if (iconPause) iconPause.style.display = isPlaying ? ""     : "none";
    }

    function play() {
      audio.play().then(() => {
        playing    = true;
        userPaused = false;
        setIcons(true);
        player.classList.remove("collapsed");
      }).catch(() => {});
    }

    function pause() {
      audio.pause();
      playing    = false;
      userPaused = true;
      setIcons(false);
    }

    toggle.addEventListener("click", () => {
      if (playing) pause(); else play();
    });

    audio.addEventListener("ended", () => { loadTrack(current + 1); play(); });
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      if (progress) progress.style.width = (audio.currentTime / audio.duration * 100) + "%";
    });

    loadTrack(0);

    const introCard = document.getElementById("intro-card");
    if (introCard) {
      introCard.addEventListener("click", () => {
        if (!userPaused) setTimeout(play, 700);
      }, { once: true });
    } else {
      play();
    }
  }

  // ---- Boot ----
  function boot() {
    render(WEDDING_CONFIG);
    applyImages(WEDDING_CONFIG.images);
    initIntro(WEDDING_CONFIG);
    initMusic(WEDDING_CONFIG.music);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
