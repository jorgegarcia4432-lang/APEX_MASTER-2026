/* gsl.js — lógica deportiva pura (sin DOM): GSL Dual Tournament, estadísticas,
   Round Differential y cruces de playoffs. Skill 01: Director de Competencia. */
(function (A) {
  /** PRNG determinista (mulberry32) para resultados de ejemplo reproducibles. */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const STRENGTH = [1.5, 1.2, 1.0, 0.85]; // por seed 1..4
  const ROUNDS_TO_WIN = 13;

  function playMap(a, b, r) {
    const aWins = r() < a.power / (a.power + b.power);
    const loser = Math.floor(r() * 12); // 0..11 (sin prórroga en datos de ejemplo)
    const ra = aWins ? ROUNDS_TO_WIN : loser;
    const rb = aWins ? loser : ROUNDS_TO_WIN;
    // rondas ganadas como atacante: no superan las rondas del equipo ni 12 (una mitad)
    const atk = (n) => Math.min(n, 3 + Math.floor(r() * 7));
    return { a: ra, b: rb, atkA: atk(ra), atkB: atk(rb) };
  }

  /** Serie al mejor de N. Devuelve ganador/perdedor y los mapas jugados. */
  function playSeries(a, b, bestOf, r) {
    const need = Math.ceil(bestOf / 2);
    const maps = [];
    let wa = 0, wb = 0;
    while (wa < need && wb < need) {
      const m = playMap(a, b, r);
      maps.push(m);
      if (m.a > m.b) wa++; else wb++;
    }
    return { a, b, bestOf, maps, wa, wb, winner: wa > wb ? a : b, loser: wa > wb ? b : a };
  }

  /**
   * Resuelve un grupo GSL de 4 equipos.
   * Partida 1: seed1 vs seed4 · Partida 2: seed2 vs seed3 (Bo1)
   * Ganadores (Bo1) · Perdedores (Bo1) · Decider (Bo3): perdedor de Ganadores vs ganador de Perdedores.
   * Clasifican: ganador de Ganadores y ganador del Decider.
   */
  function resolveGroup(teams, r) {
    const [t1, t2, t3, t4] = teams;
    const m1 = playSeries(t1, t4, 1, r);
    const m2 = playSeries(t2, t3, 1, r);
    const winners = playSeries(m1.winner, m2.winner, 1, r);
    const losers = playSeries(m1.loser, m2.loser, 1, r);
    const decider = playSeries(winners.loser, losers.winner, 3, r);

    const matches = [
      { key: "M1", label: "Partida inicial 1", series: m1 },
      { key: "M2", label: "Partida inicial 2", series: m2 },
      { key: "W", label: "Ganadores", series: winners },
      { key: "L", label: "Perdedores", series: losers },
      { key: "D", label: "Decider", series: decider },
    ];

    const order = [winners.winner, decider.winner, decider.loser, losers.loser];
    const standings = order.map((team, i) => ({ team, rank: i + 1, qualified: i < 2, ...teamStats(team, matches) }));
    return { matches, standings };
  }

  /** Estadísticas agregadas: series G/P, Round Differential y rondas ganadas de atacante. */
  function teamStats(team, matches) {
    const s = { w: 0, l: 0, rf: 0, ra: 0, atk: 0 };
    for (const { series } of matches) {
      if (series.a !== team && series.b !== team) continue;
      const isA = series.a === team;
      if (series.winner === team) s.w++; else s.l++;
      for (const m of series.maps) {
        s.rf += isA ? m.a : m.b;
        s.ra += isA ? m.b : m.a;
        s.atk += isA ? m.atkA : m.atkB;
      }
    }
    return { ...s, rd: s.rf - s.ra };
  }

  /** Construye los 8 grupos con resultados a partir de la data y una semilla. */
  function buildTournament(groupsData, seed) {
    const r = rng(seed);
    const groups = {};
    for (const [letter, list] of Object.entries(groupsData)) {
      const teams = list.map(([name, tag], i) => ({ id: `${letter}${i + 1}`, name, tag, group: letter, seed: i + 1, power: STRENGTH[i] }));
      groups[letter] = { letter, teams, ...resolveGroup(teams, r) };
    }
    return groups;
  }

  /** Octavos: 1.º de un grupo vs 2.º del grupo "vecino" (no se repiten rivales de grupo). */
  const R16_PAIRS = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["B", "A"], ["D", "C"], ["F", "E"], ["H", "G"]];

  function buildR16(groups) {
    return R16_PAIRS.map(([g1, g2], i) => ({
      id: `OF-${i + 1}`,
      home: groups[g1].standings[0].team,
      away: groups[g2].standings[1].team,
      homeSlot: `1.º Grupo ${g1}`,
      awaySlot: `2.º Grupo ${g2}`,
    }));
  }

  /** JSON de cruces listo para importar/consumir (Start.gg / Battlefy). */
  function exportBracketJson(groups) {
    const team = (t) => ({ id: t.id, name: t.name, tag: t.tag });
    return {
      tournament: "APEX MASTERS 2026: CHALLENGER CHAMPIONSHIP",
      generatedAt: new Date().toISOString(),
      note: "Resultados de ejemplo. Reemplazar por los resultados oficiales.",
      groups: Object.values(groups).map((g) => ({
        group: g.letter,
        standings: g.standings.map((s) => ({ rank: s.rank, team: team(s.team), seriesW: s.w, seriesL: s.l, roundDiff: s.rd, atkRoundsWon: s.atk, qualified: s.qualified })),
      })),
      roundOf16: buildR16(groups).map((m) => ({ id: m.id, bestOf: 1, home: team(m.home), away: team(m.away) })),
    };
  }

  A.gsl = { rng, playSeries, resolveGroup, teamStats, buildTournament, buildR16, exportBracketJson };
})((window.APEX = window.APEX || {}));
