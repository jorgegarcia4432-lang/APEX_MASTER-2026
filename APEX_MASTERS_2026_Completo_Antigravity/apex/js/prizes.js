/* prizes.js — podio de premios y calculadora de distribución del Prize Pool */
(function (A) {
  const { h, money } = A.util;
  const { data } = A;

  const ORDINAL = { 1: "1.er lugar", 2: "2.º lugar", 3: "3.er lugar", 4: "4.º lugar" };
  const amountFor = (pool, pct) => Math.round(pool * pct) / 100;

  function podium() {
    const pool = data.event.prizePool;
    return h("div", { class: "podium" }, data.prizes.map((p) =>
      h("article", { class: `place place--${p.place}` },
        h("span", { class: "place__rank", text: ORDINAL[p.place].toUpperCase() }),
        h("span", { class: "place__amount", text: money(amountFor(pool, p.pct)) }),
        h("span", { class: "place__pct", text: `${p.pct}% de la bolsa` }),
        h("ul", {}, p.perks.map((x) => h("li", { text: x }))))));
  }

  function mvpCard() {
    return h("div", { class: "card card--hover", style: "margin-top:1rem" },
      h("p", { class: "card__eyebrow gold", text: "Premio especial · MVP de la Final" }),
      h("p", { text: data.mvp }));
  }

  /** Calculadora: redistribuye cualquier bolsa con los porcentajes oficiales. */
  function calculator() {
    const out = h("tbody");
    const total = h("td", { class: "num gold" });
    const render = (pool) => {
      out.replaceChildren(...data.prizes.map((p) =>
        h("tr", {}, h("td", { text: ORDINAL[p.place] }), h("td", { class: "num", text: `${p.pct}%` }), h("td", { class: "num gold", text: money(amountFor(pool, p.pct)) }))));
      total.textContent = money(pool);
    };
    const input = A.ui.field({
      label: "Bolsa total (USD)", type: "number", value: String(data.event.prizePool),
      attrs: { min: "0", max: "1000000", step: "50", inputmode: "decimal" },
      hint: "Prueba otra cifra para ver cómo se reparte con los porcentajes oficiales.",
      onInput: (v, control) => {
        const n = Number(v);
        if (v === "" || !Number.isFinite(n) || n < 0 || n > 1e6) { input.setError("Ingresa un monto entre 0 y 1,000,000."); return; }
        render(n);
      },
    });
    render(data.event.prizePool);
    return h("div", { class: "card calc" },
      h("div", {}, h("h3", { class: "card__title", text: "Calculadora de premios" }), input.el,
        h("button", { class: "btn btn--sm btn--ghost", type: "button", text: "Restablecer $5,000", onclick: () => { input.control.value = String(data.event.prizePool); input.setError(""); render(data.event.prizePool); } })),
      h("div", { class: "table-wrap" }, h("table", { class: "table" },
        h("thead", {}, h("tr", {}, h("th", { text: "Puesto" }), h("th", { class: "num", text: "%" }), h("th", { class: "num", text: "Premio" }))),
        out,
        h("tfoot", {}, h("tr", {}, h("td", { text: "Total" }), h("td", { class: "num", text: "100%" }), total)))));
  }

  function init(mount) {
    mount.append(podium(), mvpCard(), h("h3", { class: "subhead", text: "Calculadora" }), calculator());
  }

  A.prizes = { init };
})((window.APEX = window.APEX || {}));
