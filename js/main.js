/* Candeal Panificación · comportamiento del sitio
   Sin dependencias externas. Configuración al comienzo del archivo. */
(function () {
  "use strict";

  /* ---- Configuración ---------------------------------------------------- */
  var GA_ID = "__GA4_ID__";               // ID de medición de Google Analytics 4 (formato G-XXXXXXXXXX)
  var CONSENT_KEY = "candeal-consent-v1"; // clave donde se guarda la elección de cookies
  var CONSENT_DAYS = 365;                 // a los 12 meses se vuelve a preguntar

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var conn = navigator.connection || {};
  var saveData = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || "");

  /* ---- Utilidades ------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---- Año del pie ------------------------------------------------------ */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Correo protegido contra bots de spam ----------------------------- */
  $all(".js-email").forEach(function (el) {
    var addr = el.getAttribute("data-user") + "@" + el.getAttribute("data-domain");
    var a = document.createElement("a");
    a.href = "mailto:" + addr;
    a.textContent = addr;
    if (el.getAttribute("data-class")) a.className = el.getAttribute("data-class");
    el.parentNode.replaceChild(a, el);
  });

  /* ---- Navegación ------------------------------------------------------- */
  var nav = $("#nav");
  var toggle = $("#navToggle");
  var menu = $("#navMenu");

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target)) setMenu(false);
    });
  }

  /* ---- Videos: carga diferida, pausa fuera de pantalla ------------------ */
  function initVideos() {
    var videos = $all("video[data-src]");
    if (!videos.length || reduceMotion || saveData) return; // queda el póster
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (!v.getAttribute("src")) v.setAttribute("src", v.getAttribute("data-src"));
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: "200px 0px" }) : null;

    videos.forEach(function (v) {
      v.addEventListener("playing", function () { v.classList.add("is-playing"); });
      if (io) io.observe(v);
      else { v.setAttribute("src", v.getAttribute("data-src")); v.play().catch(function () {}); }
    });
  }
  if (document.readyState === "complete") initVideos();
  else window.addEventListener("load", initVideos);

  /* ---- Galería: botones anterior / siguiente ---------------------------- */
  var strip = $("#galeriaStrip");
  $all("[data-gallery]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!strip) return;
      var dir = btn.getAttribute("data-gallery") === "next" ? 1 : -1;
      strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---- Analítica (Google Analytics 4) solo con consentimiento ----------- */
  var gaLoaded = false;
  function validGaId() { return /^G-[A-Z0-9]{6,}$/.test(GA_ID); }

  function loadAnalytics() {
    if (gaLoaded || !validGaId()) return;
    gaLoaded = true;
    window["ga-disable-" + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function clearAnalytics() {
    if (validGaId()) window["ga-disable-" + GA_ID] = true;
    var host = location.hostname;
    var domains = ["", host, "." + host, "." + host.split(".").slice(-2).join(".")];
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid") {
        domains.forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track='whatsapp']");
    if (!el) return;
    if (el.getAttribute("href").indexOf("__WHATSAPP__") !== -1) console.warn("Candeal: falta reemplazar __WHATSAPP__ por el número real.");
    if (window.gtag && gaLoaded) window.gtag("event", "whatsapp_click", { place: el.getAttribute("data-place") || "" });
  });

  /* ---- Aviso de cookies ------------------------------------------------- */
  var banner = null;

  function readConsent() {
    try {
      var v = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (v && typeof v.a === "boolean" && Date.now() - v.t < CONSENT_DAYS * 864e5) return v.a;
    } catch (err) { /* sin almacenamiento disponible */ }
    return null;
  }
  function saveConsent(accepted) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ a: accepted, t: Date.now() })); } catch (err) { /* ignorar */ }
  }

  function hideBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
    document.body.classList.remove("has-cookie-banner");
  }

  function decide(accepted) {
    saveConsent(accepted);
    if (accepted) loadAnalytics(); else clearAnalytics();
    hideBanner();
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement("div");
    banner.className = "cookie";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.innerHTML =
      '<div class="cookie__inner">' +
      '<p>Usamos cookies de analítica (Google Analytics) solo si las aceptás. Más información en la <a href="politica-de-cookies.html">política de cookies</a>.</p>' +
      '<div class="cookie__actions">' +
      '<button type="button" class="cookie__btn" data-consent="yes">Aceptar</button>' +
      '<button type="button" class="cookie__btn cookie__btn--alt" data-consent="no">Rechazar</button>' +
      "</div></div>";
    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (b) decide(b.getAttribute("data-consent") === "yes");
    });
    document.body.appendChild(banner);
    document.body.style.setProperty("--cookie-h", banner.offsetHeight + "px");
    document.body.classList.add("has-cookie-banner");
  }

  $all("[data-cookie-settings]").forEach(function (b) {
    b.addEventListener("click", showBanner);
  });
  window.addEventListener("resize", function () {
    if (banner) document.body.style.setProperty("--cookie-h", banner.offsetHeight + "px");
  });

  var consent = readConsent();
  if (consent === true) loadAnalytics();
  else if (consent === null) showBanner();
})();
