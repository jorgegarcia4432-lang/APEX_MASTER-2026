/* schedule.js — cronograma dual (Día 1 online / Día 2 presencial) con marcador "AHORA" en EST */
(function (A) {
  const { h, nowEst } = A.util;
  const { tabs } = A.ui;

  const toMin = (hhmm) => { const [hh, mm] = hhmm.split(":").map(Number); return hh * 60 + mm; };

  function isNow(day, item, now) {
    const [y, m, d] = day.date;
    return now.y === y && now.m === m && now.d === d && now.min >= toMin(item.s) && now.min < toMin(item.e);
  }

  function dayPanel(day) {
    const now = nowEst();
    return h("div", {},
      h("div", { class: "schedule-meta" },
        h("span", { class: `badge ${day.id === "d1" ? "badge--cyan" : "badge--red"}`, text: day.sub }),
        h("span", { class: "muted mono", style: "font-size:.75rem", text: "Horario EST (UTC-5)" })),
      h("div", { class: "timeline" }, day.items.map((it) => {
        const live = isNow(day, it, now);
        return h("article", { class: `slot-card${live ? " is-now" : ""}${it.final ? " is-final" : ""}`, ...(live && { "aria-current": "true" }) },
          h("span", { class: "slot-card__time", text: `${it.s} - ${it.e}` }),
          h("div", { class: "slot-card__title" }, it.t, it.d && h("small", { text: it.d })),
          h("span", {}, live && h("span", { class: "badge badge--red", text: "AHORA" }), it.bo && h("span", { class: `badge ${it.final ? "badge--gold" : ""}`, text: it.bo })));
      })));
  }

  function init(mount, days) {
    const now = nowEst();
    // abre automáticamente la jornada en curso
    const initial = days.findIndex((d) => d.date[0] === now.y && d.date[1] === now.m && d.date[2] === now.d);
    const t = tabs(days.map((d) => ({ label: `${d.label} — ${d.sub.split(" · ")[0]}`, render: () => dayPanel(d) })),
      { label: "Jornadas", initial: Math.max(initial, 0) });
    mount.append(t.el);
  }

  A.schedule = { init };
})((window.APEX = window.APEX || {}));
