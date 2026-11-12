/* bracket.js — sección Formato: grupos GSL, playoffs, gran final y desempates */
(function (A) {
  const { h, download } = A.util;
  const { tabs, chipGroup } = A.ui;
  const { data, gsl } = A;

  const state = { seed: 2026, group: "A", tournament: null };
  const views = []; // callbacks de refresco ante una nueva simulación

  function simulate(seed) {
    state.seed = seed;
    state.tournament = gsl.buildTournament(data.groups, seed);
    views.forEach((refresh) => refresh());
  }

  /** Contenedor que se reconstruye cuando cambia la simulación. */
  function live(build) {
    const box = h("div");
    const refresh = () => box.replaceChildren(build());
    views.push(refresh);
    refresh();
    return box;
  }

  const phaseIntro = (p, badgeCls) =>
    h("div", { class: "card phase-intro" },
      h("div", {}, h("span", { class: `badge ${badgeCls}`, text: p.day })),
      h("h3", { class: "card__title", text: `Fase ${p.n}: ${p.title}` }),
      h("p", { class: "muted", text: p.body }));

  /* ---------- Fase 1: grupos ---------- */
  function matchCard(m) {
    const { series: s } = m;
    const bo3 = s.bestOf === 3;
    const score = (isA) => (bo3 ? (isA ? s.wa : s.wb) : (isA ? s.maps[0].a : s.maps[0].b));
    const row = (team, isA) =>
      h("div", { class: `match__row ${s.winner === team ? "is-winner" : "is-loser"}` },
        h("span", {}, h("span", { class: "match__tag", text: team.tag }), team.name),
        h("span", { class: "match__score", text: score(isA) }));
    return h("div", { class: "match" },
      h("div", { class: "match__meta" }, h("span", { text: m.label }), h("span", { text: `Bo${s.bestOf}` })),
      row(s.a, true), row(s.b, false),
      bo3 && h("p", { class: "muted mono", style: "font-size:.72rem;margin-top:.3rem", text: "Mapas: " + s.maps.map((x) => `${x.a}-${x.b}`).join(" · ") }));
  }

  function standingsTable(g) {
    const head = ["#", "Equipo", "G-P", "RD", "ATK"].map((t, i) => h("th", { class: i > 1 ? "num" : "", text: t }));
    const rows = g.standings.map((s) =>
      h("tr", { class: s.qualified ? "is-qualified" : "" },
        h("td", { class: "mono", text: s.rank }),
        h("td", {}, h("span", { class: "match__tag", text: s.team.tag }), s.team.name, " ", s.qualified && h("span", { class: "badge badge--ok", text: "Clasifica" })),
        h("td", { class: "num", text: `${s.w}-${s.l}` }),
        h("td", { class: "num", text: (s.rd > 0 ? "+" : "") + s.rd }),
        h("td", { class: "num", text: s.atk })));
    return h("div", { class: "table-wrap" },
      h("table", { class: "table" },
        h("caption", { class: "sr-only", text: `Posiciones Grupo ${g.letter}` }),
        h("thead", {}, h("tr", {}, head)), h("tbody", {}, rows)));
  }

  function groupsView() {
    const panel = h("div");
    panel.append(
      phaseIntro(data.phases[0], "badge--cyan"),
      h("div", { class: "gsl-toolbar" },
        chipGroup(Object.keys(data.groups).map((g) => ({ label: `Grupo ${g}`, value: g })), {
          label: "Seleccionar grupo", selected: state.group,
          onSelect: (g) => { state.group = g; detail.replaceChildren(groupDetail()); },
        }),
        h("div", { class: "gsl-toolbar__actions" },
          h("button", { class: "btn btn--sm btn--ghost", type: "button", text: "↻ Re-simular", onclick: () => simulate(Math.floor(Math.random() * 1e6)) }),
          h("button", { class: "btn btn--sm btn--cyan", type: "button", text: "Exportar cruces JSON", onclick: exportJson }))));
    const detail = live(groupDetail);
    panel.append(detail,
      h("p", { class: "note", text: "Equipos y resultados de ejemplo para previsualizar el formato. RD = diferencia de rondas; ATK = rondas ganadas como atacante." }));
    return panel;
  }

  function groupDetail() {
    const g = state.tournament[state.group];
    return h("div", { class: "gsl-grid" },
      h("div", { class: "match-list" }, g.matches.map(matchCard)),
      h("div", {}, h("h4", { class: "card__title", text: `Posiciones · Grupo ${g.letter}` }), standingsTable(g)));
  }

  function exportJson() {
    download("apex-masters-2026-cruces.json", JSON.stringify(gsl.exportBracketJson(state.tournament), null, 2), "application/json");
  }

  /* ---------- Fase 2: playoffs ---------- */
  const tbd = (text) => h("div", { class: "match__row is-pending" }, h("span", { class: "slot--tbd", text }));

  function playoffMatch(id, bo, a, b) {
    const side = (x) => (typeof x === "string" ? tbd(x) : h("div", { class: "match__row" }, h("span", {}, h("span", { class: "match__tag", text: x.team.tag }), x.team.name, h("small", { class: "muted mono", text: `  ${x.slot}` }))));
    return h("div", { class: "match" }, h("div", { class: "match__meta" }, h("span", { text: id }), h("span", { text: bo })), side(a), side(b));
  }

  function bracketColumn(title, sub, matches) {
    return h("div", { class: "bracket__col" }, h("div", { class: "bracket__title" }, title, h("small", { text: sub })), matches);
  }

  function playoffsView() {
    const panel = h("div");
    panel.append(phaseIntro(data.phases[1], "badge--red"));
    panel.append(live(() => {
      const r16 = gsl.buildR16(state.tournament);
      const col1 = r16.map((m) => playoffMatch(m.id, "Bo1", { team: m.home, slot: m.homeSlot }, { team: m.away, slot: m.awaySlot }));
      const qf = [0, 1, 2, 3].map((i) => playoffMatch(`CF-${i + 1}`, "Bo3", `Ganador OF-${2 * i + 1}`, `Ganador OF-${2 * i + 2}`));
      const sf = [0, 1].map((i) => playoffMatch(`SF-${i + 1}`, "Bo3", `Ganador CF-${2 * i + 1}`, `Ganador CF-${2 * i + 2}`));
      const uf = [playoffMatch("FINAL UPPER", "Bo3", "Ganador SF-1", "Ganador SF-2")];
      return h("div", {},
        h("div", { class: "bracket", role: "group", "aria-label": "Upper Bracket" },
          bracketColumn("Octavos", "Día 1 · Bo1", col1),
          bracketColumn("Cuartos", "Día 2 · Bo3", qf),
          bracketColumn("Semifinales", "Upper · Bo3", sf),
          bracketColumn("Final Upper", "Bo3", uf)),
        h("div", { class: "card", style: "margin-top:1rem" },
          h("p", { class: "card__eyebrow", text: "Lower Bracket" }),
          h("p", { class: "muted", text: "Recibe a los perdedores del Upper Bracket. Todas las rondas son Bo1 hasta la Final de Lower Bracket (Bo3), que define al segundo finalista." })));
    }));
    return panel;
  }

  /* ---------- Fase 3: gran final ---------- */
  function finalView() {
    return h("div", {},
      phaseIntro(data.phases[2], "badge--gold"),
      h("div", { class: "final-card" },
        h("p", { class: "card__eyebrow gold", text: "Domingo 15 Nov · 18:30 EST · Main Stage" }),
        h("p", { class: "vs", text: "Campeón Upper  ⚔  Campeón Lower" }),
        h("p", { class: "mono gold", text: "SERIE BO5" }),
        h("p", { class: "muted", style: "margin-top:.8rem", text: "El finalista proveniente del Upper Bracket elige primero en la fase de vetos de mapa." })));
  }

  function tiebreakAccordion() {
    return h("details", { class: "accordion", style: "margin-top:2rem" },
      h("summary", { text: "Desempates oficiales (Fase de Grupos)" }),
      h("div", { class: "accordion__body" },
        h("p", { class: "muted", style: "margin-bottom:.8rem", text: "Ante empate en puntos se aplica, en orden estricto:" }),
        h("ol", { class: "steps-list" }, data.tiebreakers.map((t) => h("li", { text: t })))));
  }

  function init(mount) {
    simulate(state.seed);
    const t = tabs([
      { label: "Grupos GSL", icon: "01", render: groupsView },
      { label: "Playoffs", icon: "02", render: playoffsView },
      { label: "Gran Final", icon: "03", render: finalView },
    ], { label: "Fases del torneo" });
    mount.append(t.el, tiebreakAccordion());
  }

  A.bracket = { init };
})((window.APEX = window.APEX || {}));
