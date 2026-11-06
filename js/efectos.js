/* Candeal · efectos visuales (revelados, parallax, galería, lightbox, estado de horario).
   Todo es mejora progresiva: sin este archivo el sitio se ve completo. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var vh = window.innerHeight;
  window.addEventListener("resize", function () { vh = window.innerHeight; });

  /* ---- Estado de horario (hora de Mendoza) ----------------------------- */
  function updateStatus() {
    var els = $all("[data-open-status]");
    if (!els.length || !window.Intl || !Intl.DateTimeFormat) return;
    var o = {};
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Mendoza", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false })
        .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    } catch (e) { return; }
    var day = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 }[String(o.weekday).slice(0, 3).toLowerCase()];
    if (day === undefined) return;
    var mins = (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10);
    var weekday = day <= 5;
    var weekdayOpen = weekday && ((mins >= 510 && mins < 810) || (mins >= 990 && mins < 1260));
    var sundayOpen = day === 6 && mins >= 510 && mins < 810;
    var open = weekdayOpen || sundayOpen, text;
    if (open) text = "Abierto ahora";
    else if (weekday && mins < 510) text = "Cerrado, abrimos hoy a las 8:30";
    else if (weekday && mins < 990) text = "Cerrado, abrimos hoy a las 16:30";
    else if (day === 5 || (day === 6 && mins >= 810)) text = "Cerrado, abrimos mañana a las 8:30";
    else if (day === 6 && mins < 510) text = "Cerrado, abrimos hoy a las 8:30";
    else text = "Cerrado, abrimos mañana a las 8:30";
    els.forEach(function (el) {
      el.setAttribute("data-state", open ? "open" : "closed");
      var t = $("[data-open-text]", el); if (t) t.textContent = text;
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---- Titulares por palabra ------------------------------------------- */
  if (!reduce) {
    $all("[data-split]").forEach(function (h) {
      var text = h.textContent.trim().replace(/\s+/g, " ");
      h.textContent = "";
      var sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = text; h.appendChild(sr);
      text.split(" ").forEach(function (word, i) {
        var w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
        var s = document.createElement("span"); s.textContent = word; s.style.setProperty("--i", i);
        w.appendChild(s); h.appendChild(w); h.appendChild(document.createTextNode(" "));
      });
      h.classList.add("is-split");
    });
  }

  /* ---- Revelados al entrar en pantalla --------------------------------- */
  var targets = $all("[data-reveal], .is-split");
  function reveal(el) { el.classList.remove("is-pending"); el.classList.add("is-in"); }
  if (!reduce && "IntersectionObserver" in window) {
    // Los elementos con clip-path se observan a través de su contenedor (un clip vacío no cuenta como visible).
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; io.unobserve(t);
        if (t.__clipKids) t.__clipKids.forEach(reveal); else reveal(t);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    var seen = [];
    targets.forEach(function (el) {
      if (el.hasAttribute("data-reveal")) {
        var sibs = $all("[data-reveal]", el.parentNode).filter(function (n) { return n.parentNode === el.parentNode; });
        el.style.setProperty("--d", (sibs.indexOf(el) * 0.12) + "s");
        if (el.getBoundingClientRect().top > vh * 0.92) el.classList.add("is-pending");
        if (el.getAttribute("data-reveal") === "clip") {
          var host = el.parentNode;
          if (seen.indexOf(host) === -1) { host.__clipKids = []; seen.push(host); io.observe(host); }
          host.__clipKids.push(el);
          return;
        }
      }
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Scroll: progreso, parallax, sello, ventana ---------------------- */
  var par = $all("[data-parallax]"), sello = $("[data-rotate]"), win = $all("[data-window]");
  var prog = document.documentElement, ticking = false;
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function frame() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - vh;
    prog.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    if (reduce) return;
    par.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var f = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      el.style.setProperty("--py", (-(r.top + r.height / 2 - vh / 2) * f).toFixed(1) + "px");
    });
    if (sello) sello.style.setProperty("--rot", (y * 0.18).toFixed(1) + "deg");
    win.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = clamp((vh - r.top) / (vh * 0.85), 0, 1);
      el.style.setProperty("--w", ((1 - p) * 9).toFixed(2));
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  /* ---- CTA magnético (solo con mouse) ---------------------------------- */
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $all(".btn--lg").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + "px");
        b.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", function () { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); });
    });
  }

  /* ---- Videos de momentos: pausa manual -------------------------------- */
  $all(".momento__toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var v = btn.parentNode.querySelector("video"), use = btn.querySelector("use");
      var pausing = !v.paused && v.dataset.userPaused !== "1";
      if (pausing) { v.pause(); v.dataset.userPaused = "1"; } else { delete v.dataset.userPaused; if (v.getAttribute("src")) v.play().catch(function () {}); }
      btn.setAttribute("aria-pressed", String(pausing));
      btn.setAttribute("aria-label", pausing ? "Reproducir video" : "Pausar video");
      use.setAttribute("href", pausing ? "#i-play" : "#i-pause");
    });
  });

  /* ---- Galería: contador, barra, arrastre y lightbox ------------------- */
  var strip = $("#galeriaStrip");
  if (strip) {
    var items = $all("li", strip), now = $("[data-gal-now]"), total = $("[data-gal-total]"), bar = $(".galeria");
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    if (total) total.textContent = pad(items.length);
    function updGal() {
      var step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : 1;
      var idx = clamp(Math.round(strip.scrollLeft / step), 0, items.length - 1);
      if (now) now.textContent = pad(idx + 1);
      bar.style.setProperty("--g", clamp((strip.scrollLeft + strip.clientWidth) / strip.scrollWidth * 100, 5, 100).toFixed(1) + "%");
    }
    strip.addEventListener("scroll", function () { requestAnimationFrame(updGal); }, { passive: true });
    window.addEventListener("resize", updGal);
    updGal();

    var down = false, startX = 0, startL = 0, dragged = false;
    strip.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; dragged = false; startX = e.clientX; startL = strip.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { dragged = true; strip.classList.add("is-drag"); }
      if (dragged) strip.scrollLeft = startL - dx;
    });
    window.addEventListener("pointerup", function () { down = false; strip.classList.remove("is-drag"); });

    var lb = $("#lightbox"), lbImg = $(".lb__img"), lbCap = $(".lb__cap"), cur = 0;
    var imgs = $all(".galeria__item img", strip);
    function show(i) {
      cur = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[cur].getAttribute("src"); lbImg.alt = imgs[cur].alt; lbCap.textContent = imgs[cur].alt;
    }
    if (lb && lb.showModal) {
      $all(".galeria__item", strip).forEach(function (b, i) {
        b.addEventListener("click", function (e) {
          if (dragged) { e.preventDefault(); dragged = false; return; }
          show(i); lb.showModal();
        });
      });
      $("[data-lb-close]").addEventListener("click", function () { lb.close(); });
      $("[data-lb-prev]").addEventListener("click", function () { show(cur - 1); });
      $("[data-lb-next]").addEventListener("click", function () { show(cur + 1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
      lb.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") show(cur - 1);
        if (e.key === "ArrowRight") show(cur + 1);
      });
    }
  }
})();
