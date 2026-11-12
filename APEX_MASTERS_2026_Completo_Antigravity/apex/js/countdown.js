/* countdown.js — cuenta regresiva y estado del torneo (REGISTRO ABIERTO / EN VIVO / FINALIZADO) */
(function (A) {
  const { h, pad } = A.util;
  const ev = A.data.event;

  const phase = (now = Date.now()) => (now < ev.startUtc ? "before" : now <= ev.endUtc ? "live" : "ended");

  const PILL = {
    before: { text: "REGISTRO ABIERTO", cls: "badge--cyan" },
    live: { text: "EN VIVO", cls: "badge--red" },
    ended: { text: "FINALIZADO", cls: "" },
  };

  function init(mount, pill) {
    const units = ["Días", "Horas", "Min", "Seg"].map((label) => {
      const num = h("span", { class: "countdown__num", text: "00" });
      return { num, el: h("div", { class: "countdown__unit" }, num, h("span", { class: "countdown__label", text: label })) };
    });
    const banner = h("p", { class: "countdown__state" });
    let mode = null;

    function tick() {
      const now = Date.now();
      const p = phase(now);
      pill.textContent = PILL[p].text;
      pill.className = `badge status-pill ${PILL[p].cls}`;

      if (p !== mode) {
        mode = p;
        if (p === "before") mount.replaceChildren(...units.map((u) => u.el));
        else {
          banner.textContent = p === "live" ? "● EN VIVO — EL TORNEO ESTÁ EN CURSO" : "TORNEO FINALIZADO — GRACIAS POR JUGAR";
          mount.replaceChildren(banner);
        }
      }
      if (p === "before") {
        const s = Math.floor((ev.startUtc - now) / 1000);
        [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60]
          .forEach((v, i) => { units[i].num.textContent = pad(v); });
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  A.countdown = { init, phase };
})((window.APEX = window.APEX || {}));
