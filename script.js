(function () {
  "use strict";

  var doc = document;
  var header = doc.querySelector(".site-header");
  var toggle = doc.querySelector(".menu-toggle");
  var mobileNav = doc.getElementById("mobile-nav");
  var preloader = doc.getElementById("preloader");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && mobileNav) {
    var closeMenu = function () {
      mobileNav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    };
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  if (preloader) {
    var hidePreloader = function () {
      preloader.classList.add("is-done");
      window.setTimeout(function () {
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 700);
    };
    if (doc.readyState === "complete") {
      window.setTimeout(hidePreloader, 500);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(hidePreloader, 500);
      });
      window.setTimeout(hidePreloader, 3200);
    }
  }

  var h1 = doc.querySelector(".hero h1");
  if (h1 && !reduceMotion) {
    var label = h1.textContent.trim();
    h1.setAttribute("aria-label", label);
    h1.innerHTML = label.split(" ").map(function (word) {
      var chars = Array.from(word).map(function (ch) {
        return '<span class="char" aria-hidden="true">' + ch + "</span>";
      }).join("");
      return '<span class="word">' + chars + "</span>";
    }).join(" ");
  }

  var useGsap = !!(window.gsap && window.ScrollTrigger);
  if (useGsap && !reduceMotion) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    var tl = window.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-logo", { opacity: 0, y: 18, scale: 0.92, duration: 0.9 })
      .from(".hero .eyebrow", { opacity: 0, y: 12, duration: 0.7 }, "-=0.55")
      .from(h1 ? h1.querySelectorAll(".char") : [], { opacity: 0, yPercent: 70, duration: 0.85, stagger: 0.018 }, "-=0.45")
      .from(".hero-subtitle", { opacity: 0, y: 16, duration: 0.7 }, "-=0.55")
      .from(".hero-actions .btn", { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, "-=0.45")
      .from(".hero-note", { opacity: 0, duration: 0.6 }, "-=0.3");

    window.gsap.to(".hero-photo-a", {
      y: 70, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    window.gsap.to(".hero-photo-b", {
      y: -55, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  var revealSelectors = [
    ".section-head", ".product-card", ".gallery-head", ".photo-item", ".video-card",
    ".history-media", ".history-copy", ".testimonial-panel", ".faq-intro",
    ".faq-list details", ".contact-copy", ".contact-actions"
  ];
  var targets = doc.querySelectorAll(revealSelectors.join(","));

  if (useGsap && !reduceMotion) {
    targets.forEach(function (el, index) {
      window.gsap.from(el, {
        opacity: 0,
        y: 34,
        duration: 0.85,
        ease: "power3.out",
        delay: Math.min(index % 4, 3) * 0.05,
        scrollTrigger: { trigger: el, start: "top 90%", once: true }
      });
    });
  } else if ("IntersectionObserver" in window && !reduceMotion) {
    targets.forEach(function (el, index) {
      el.classList.add("reveal");
      el.style.setProperty("--delay", (Math.min(index % 4, 3) * 70) + "ms");
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { observer.observe(el); });
    window.setTimeout(function () {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4500);
  }

  var details = doc.querySelectorAll(".faq-list details");
  details.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        details.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
