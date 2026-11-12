/* main.js — punto de entrada: monta cada sección y conecta navegación y acciones globales */
(function (A) {
  const { $, $$, h } = A.util;
  const { data } = A;

  function mountHero() {
    $("#kpis").append(...data.kpis.map((k) =>
      h("div", { class: "kpi" }, h("span", { class: `kpi__value ${k.cls || ""}`, text: k.value }), h("span", { class: "kpi__label", text: k.label }))));
    A.countdown.init($("#countdown"), $("#status-pill"));
  }

  function mountSections() {
    A.bracket.init($("#format-mount"));
    A.schedule.init($("#schedule-mount"), data.schedule);
    A.rules.init($("#rules-mount"));
    A.arena.init($("#arena-mount"));
    A.prizes.init($("#prizes-mount"));
    A.sponsors.init($("#sponsors-mount"));
    A.committee.init({ committee: $("#committee-mount"), credits: $("#credits"), links: $("#footer-links") });
  }

  /** Acciones declarativas: <button data-action="register"> */
  function bindActions() {
    const actions = { register: A.registration.open, "download-rules": A.rules.download };
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-action]");
      if (el && actions[el.dataset.action]) actions[el.dataset.action]();
    });
  }

  function bindNavigation() {
    const nav = $("#navbar");
    const toggle = $("#nav-toggle");
    const setOpen = (open) => { nav.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", String(open)); };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    $$("#nav-links a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

    // scrollspy
    const links = new Map($$("#nav-links a").map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting || !links.has(en.target.id)) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        links.get(en.target.id).setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  function init() {
    mountHero();
    mountSections();
    bindActions();
    bindNavigation();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})((window.APEX = window.APEX || {}));
