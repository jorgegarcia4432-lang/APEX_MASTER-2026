/* rules.js — reglamento: requisitos, buscador con filtros, sanciones y descarga del reglamento */
(function (A) {
  const { h, download } = A.util;
  const { data } = A;

  const CATS = ["Todas", ...new Set(data.rules.map((r) => r.cat))];

  /** Resalta coincidencias sin usar innerHTML. */
  function highlight(text, query) {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i < 0) return text;
    return [text.slice(0, i), h("mark", { text: text.slice(i, i + query.length) }), text.slice(i + query.length)];
  }

  function searchPanel() {
    const state = { q: "", cat: "Todas" };
    const list = h("div", { class: "rule-list", "aria-live": "polite" });
    const count = h("p", { class: "muted mono", style: "font-size:.78rem" });

    const render = () => {
      const q = state.q.trim().toLowerCase();
      const hits = data.rules.filter((r) =>
        (state.cat === "Todas" || r.cat === state.cat) && (!q || `${r.t} ${r.d} ${r.cat}`.toLowerCase().includes(q)));
      count.textContent = `${hits.length} ${hits.length === 1 ? "resultado" : "resultados"}`;
      list.replaceChildren(...(hits.length
        ? hits.map((r) => h("article", { class: "rule" },
            h("span", { class: "badge", text: r.cat }),
            h("h4", {}, highlight(r.t, state.q.trim())),
            h("p", {}, highlight(r.d, state.q.trim()))))
        : [h("p", { class: "muted", text: "Sin resultados. Prueba con otra palabra clave (ej. «ping», «auriculares», «edad»)." })]));
    };

    const search = A.ui.field({ label: "Buscar en el reglamento", type: "search", placeholder: "Ej. desconexión, rango, macros…", onInput: (v) => { state.q = v; render(); } });
    const chips = A.ui.chipGroup(CATS.map((c) => ({ label: c, value: c })), {
      label: "Filtrar por categoría", selected: state.cat, cls: "chip--cyan", onSelect: (c) => { state.cat = c; render(); },
    });
    render();
    return h("div", {}, h("div", { class: "rule-search" }, search.el, chips, count), list);
  }

  function sanctionsTable() {
    return h("div", { class: "sanctions" }, data.sanctions.map((s) =>
      h("div", { class: "sanction", "data-level": s.n },
        h("div", { class: "sanction__lvl" }, h("small", { text: `NIVEL ${s.n}` }), s.name),
        h("p", { text: s.when }))));
  }

  /** Reglamento en texto plano descargable, generado desde la misma data. */
  function buildRulebook() {
    const e = data.event;
    const lines = [
      `${e.name}: ${e.subtitle} — REGLAMENTO OFICIAL`,
      "VALORANT 5v5 · 14 y 15 de noviembre de 2026 · Horario EST (UTC-5)",
      "=".repeat(70), "",
      "REQUISITOS", ...data.requirements.map((r) => `- ${r.k}: ${r.v}`), "",
      ...[...new Set(data.rules.map((r) => r.cat))].flatMap((cat) => [
        cat.toUpperCase(), ...data.rules.filter((r) => r.cat === cat).map((r) => `- ${r.t}: ${r.d}`), ""]),
      "DESEMPATES (orden estricto)", ...data.tiebreakers.map((t, i) => `${i + 1}. ${t}`), "",
      "ESCALA DE SANCIONES", ...data.sanctions.map((s) => `- Nivel ${s.n} (${s.name}): ${s.when}`), "",
      `Contacto de arbitraje: ${data.committee[1].email}`,
    ];
    return lines.join("\n");
  }

  const downloadRulebook = () => download("reglamento-apex-masters-2026.txt", buildRulebook(), "text/plain;charset=utf-8");

  function init(mount) {
    mount.append(
      h("div", { class: "grid grid--4" }, data.requirements.map((r) =>
        h("div", { class: "card card--hover" }, h("p", { class: "card__eyebrow", text: r.k }), h("p", { text: r.v })))),
      h("h3", { class: "subhead", text: "Escala de sanciones" }), sanctionsTable(),
      h("h3", { class: "subhead", text: "Buscador del reglamento" }), searchPanel(),
      h("div", { style: "margin-top:1.5rem" }, h("button", { class: "btn btn--ghost", type: "button", text: "Descargar Reglamento Oficial", onclick: downloadRulebook })));
  }

  A.rules = { init, download: downloadRulebook };
})((window.APEX = window.APEX || {}));
