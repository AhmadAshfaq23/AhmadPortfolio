(function () {
  "use strict";

  /* ---------------- PRELOADER ---------------- */
  var minDisplay = 900;
  var startTime = Date.now();
  function hideLoader() {
    var elapsed = Date.now() - startTime;
    var wait = Math.max(0, minDisplay - elapsed);
    setTimeout(function () {
      document.body.classList.remove("is-loading");
    }, wait);
  }
  if (document.readyState === "complete") hideLoader();
  else window.addEventListener("load", hideLoader);
  // Safety net in case a resource stalls
  setTimeout(function () { document.body.classList.remove("is-loading"); }, 4000);

  /* ---------------- CUSTOM CURSOR ---------------- */
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (isFinePointer) {
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (dot && ring) {
      var ringX = 0, ringY = 0, targetX = 0, targetY = 0;
      window.addEventListener("mousemove", function (e) {
        targetX = e.clientX; targetY = e.clientY;
        dot.style.transform = "translate(" + targetX + "px," + targetY + "px) translate(-50%,-50%)";
      });
      (function ringLoop() {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;
        ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
        requestAnimationFrame(ringLoop);
      })();
      document.addEventListener("mouseover", function (e) {
        if (e.target.closest && e.target.closest("a, button, .project-card-inner, input, textarea, select")) {
          ring.classList.add("is-hover");
        }
      });
      document.addEventListener("mouseout", function (e) {
        if (e.target.closest && e.target.closest("a, button, .project-card-inner, input, textarea, select")) {
          ring.classList.remove("is-hover");
        }
      });
    }
  }

  /* ---------------- BACK TO TOP ---------------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- MOBILE NAV ---------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var track = document.querySelector(".timeline-track");
  if (navToggle && track) {
    navToggle.addEventListener("click", function () {
      var isOpen = track.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    track.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        track.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- SCRUB / PROGRESS BAR + ACTIVE LINK ---------------- */
  var scrubBar = document.querySelector(".scrub-bar");
  var navEl = document.querySelector(".timeline-nav");
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".timeline-track a");

  function onScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrubBar) scrubBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";
    if (navEl) navEl.classList.toggle("scrolled", scrollTop > 24);

    var current = "";
    sections.forEach(function (sec) {
      var rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });

    if (backToTop) backToTop.classList.toggle("show", scrollTop > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- SCROLL REVEALS ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------------- 3D TILT ON CARDS ---------------- */
  function attachTilt(el, strength) {
    strength = strength || 10;
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = "rotateY(" + (x * strength) + "deg) rotateX(" + (-y * strength) + "deg)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  var heroFrame = document.querySelector(".hero-frame-inner");
  if (heroFrame) attachTilt(heroFrame, 8);

  /* ---------------- LOAD DATA ---------------- */
  function fetchJSON(path) {
    return fetch(path).then(function (r) {
      if (!r.ok) throw new Error("Failed to load " + path);
      return r.json();
    });
  }

  function renderProfile(profile) {
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var field = el.getAttribute("data-field");
      var val = profile[field];
      if (val === undefined) return;
      if (el.tagName === "IMG") el.src = val;
      else if (el.tagName === "A" && el.hasAttribute("data-href")) el.href = val;
      else el.textContent = val;
    });

    var statsWrap = document.querySelector("[data-stats]");
    if (statsWrap && profile.stats) {
      statsWrap.innerHTML = profile.stats.map(function (s) {
        return '<div class="stat-cell reveal"><div class="num">' + esc(s.value) + '</div><div class="lbl">' + esc(s.label) + '</div></div>';
      }).join("");
      statsWrap.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    }

    var heroStatsWrap = document.querySelector("[data-hero-stats]");
    if (heroStatsWrap && profile.stats) {
      heroStatsWrap.innerHTML = profile.stats.slice(0, 3).map(function (s) {
        return '<div class="hero-stat"><div class="num">' + esc(s.value) + '</div><div class="lbl">' + esc(s.label) + '</div></div>';
      }).join("");
    }

    var servicesWrap = document.querySelector("[data-services]");
    if (servicesWrap && profile.services) {
      servicesWrap.innerHTML = profile.services.map(function (s, i) {
        var code = "0" + (i + 1);
        return '<div class="service-card reveal">' +
          '<span class="code">' + code + '</span>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p>' + esc(s.description) + '</p>' +
          '<div class="service-tags">' + (s.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div>' +
          '</div>';
      }).join("");
      servicesWrap.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    }

    var testimonialWrap = document.querySelector("[data-testimonials]");
    if (testimonialWrap && profile.testimonials) {
      testimonialWrap.innerHTML = profile.testimonials.map(function (t) {
        return '<div class="testimonial-card reveal">' +
          '<div class="quote-mark">&ldquo;</div>' +
          '<p class="quote">' + esc(t.quote) + '</p>' +
          '<div class="author">' + esc(t.author) + '</div>' +
          '<div class="role">' + esc(t.role) + '</div>' +
          '</div>';
      }).join("");
      testimonialWrap.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    }

    var socialWrap = document.querySelector("[data-socials]");
    if (socialWrap && profile.socials) {
      socialWrap.innerHTML = profile.socials.map(function (s) {
        return '<a href="' + escAttr(s.url) + '" target="_blank" rel="noopener">' + esc(s.platform) + '</a>';
      }).join("");
    }

    var mailtoEls = document.querySelectorAll("[data-mailto]");
    mailtoEls.forEach(function (el) {
      if (profile.email) el.setAttribute("href", "mailto:" + profile.email);
    });
    var fiverrEls = document.querySelectorAll("[data-fiverr-href]");
    fiverrEls.forEach(function (el) {
      if (profile.fiverrUrl) el.setAttribute("href", profile.fiverrUrl);
    });
    var driveEls = document.querySelectorAll("[data-drive-href]");
    driveEls.forEach(function (el) {
      if (profile.portfolioDriveUrl) el.setAttribute("href", profile.portfolioDriveUrl);
    });
  }

  function getEmbedUrl(link) {
    if (!link) return null;
    var yt = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) return "https://www.youtube.com/embed/" + yt[1] + "?autoplay=1&rel=0";
    var vimeo = link.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return "https://player.vimeo.com/video/" + vimeo[1] + "?autoplay=1";
    return null;
  }

  var lightbox = document.querySelector(".lightbox");
  var lightboxEmbed = document.querySelector(".lightbox-embed");
  var lightboxClose = document.querySelector(".lightbox-close");

  function openLightbox(embedUrl) {
    if (!lightbox || !lightboxEmbed) return;
    lightboxEmbed.innerHTML = '<iframe src="' + embedUrl + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Project video"></iframe>';
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox || !lightboxEmbed) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxEmbed.innerHTML = "";
    document.body.style.overflow = "";
  }
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  var allProjects = [];
  function renderProjects(filter) {
    var grid = document.querySelector("[data-project-grid]");
    if (!grid) return;
    var list = filter && filter !== "All" ? allProjects.filter(function (p) { return p.category === filter; }) : allProjects;

    if (!list.length) {
      grid.innerHTML = '<div class="empty-state">No projects in this category yet — check back soon.</div>';
      return;
    }

    grid.innerHTML = list.map(function (p) {
      var embedUrl = getEmbedUrl(p.link);
      var playBadge = embedUrl
        ? '<div class="project-play"><div class="project-play-btn"></div></div>'
        : "";
      var card = '<div class="project-card"><div class="project-card-inner' + (embedUrl ? " has-video" : "") + '">' +
        '<div class="project-thumb"><span class="project-cat-tag">' + esc(p.category) + '</span>' +
        '<img src="' + escAttr(p.thumbnail) + '" alt="' + escAttr(p.title) + '" loading="lazy">' + playBadge + '</div>' +
        '<div class="project-body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.description) + '</p>' +
        '<div class="project-tags">' + (p.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div>' +
        '</div></div></div>';
      return card;
    }).join("");

    grid.querySelectorAll(".project-card-inner").forEach(function (el, i) {
      attachTilt(el, 6);
      var p = list[i];
      var embedUrl = getEmbedUrl(p.link);
      if (embedUrl) {
        el.addEventListener("click", function () { openLightbox(embedUrl); });
      } else if (p.link) {
        el.style.cursor = "pointer";
        el.addEventListener("click", function () { window.open(p.link, "_blank", "noopener"); });
      }
    });
  }

  function buildFilters(projects) {
    var filterWrap = document.querySelector("[data-filters]");
    if (!filterWrap) return;
    var cats = ["All"].concat(Array.from(new Set(projects.map(function (p) { return p.category; }))));
    filterWrap.innerHTML = cats.map(function (c, i) {
      return '<button class="filter-btn' + (i === 0 ? " active" : "") + '" data-cat="' + escAttr(c) + '">' + esc(c) + '</button>';
    }).join("");
    filterWrap.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterWrap.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        renderProjects(btn.getAttribute("data-cat"));
      });
    });
  }

  function esc(str) {
    if (str === undefined || str === null) return "";
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escAttr(str) { return esc(str); }

  Promise.all([
    fetchJSON("data/profile.json").catch(function () { return null; }),
    fetchJSON("data/projects.json").catch(function () { return null; })
  ]).then(function (results) {
    var profile = results[0];
    var projectsData = results[1];
    if (profile) renderProfile(profile);
    if (projectsData && projectsData.projects) {
      allProjects = projectsData.projects;
      buildFilters(allProjects);
      renderProjects("All");
    }
  });

  /* ---------------- CONTACT FORM ---------------- */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      }).then(function () {
        form.reset();
        var success = document.querySelector(".form-success");
        if (success) success.classList.add("show");
      }).catch(function () {
        var success = document.querySelector(".form-success");
        if (success) {
          success.textContent = "Something went wrong — please email me directly instead.";
          success.classList.add("show");
        }
      });
    });
  }

  /* ---------------- FOOTER YEAR ---------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
