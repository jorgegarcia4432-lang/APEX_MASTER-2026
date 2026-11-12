/* validators.js — reglas de validación puras (sin DOM). Skill 03: elegibilidad y anti-smurf. */
(function (A) {
  const { minAge, minRankIndex, ranks } = { ...A.data.event, ranks: A.data.ranks };

  const RE = {
    tag: /^[A-Za-z0-9]{3,4}$/,
    discord: /^(?:[a-z0-9_.]{2,32}|\d{17,20})$/i, // usuario o ID numérico (snowflake)
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    riotId: /^[^#]{3,16}#[A-Za-z0-9]{3,5}$/, // Usuario#TAG
  };

  function validateTeam(t) {
    const e = {};
    const name = t.name.trim();
    if (name.length < 3 || name.length > 32) e.name = "Entre 3 y 32 caracteres.";
    if (!RE.tag.test(t.tag.trim())) e.tag = "Tag de 3 a 4 letras o números.";
    if (!RE.discord.test(t.discord.trim())) e.discord = "Usuario o ID de Discord válido (ej. capitan_apex).";
    if (!RE.email.test(t.email.trim())) e.email = "Correo electrónico no válido.";
    return e;
  }

  /** Valida un jugador. Los suplentes completamente vacíos son válidos (opcionales). */
  function validatePlayer(p, optional) {
    const e = {};
    if (optional && !p.riot.trim() && p.age === "" && p.rank === "") return e;
    if (!RE.riotId.test(p.riot.trim())) e.riot = "Formato Usuario#TAG (ej. Viper#LATAM).";
    const age = Number(p.age);
    if (p.age === "" || !Number.isInteger(age) || age < minAge || age > 99) e.age = `Mínimo ${minAge} años.`;
    if (p.rank === "") e.rank = "Selecciona tu rango actual.";
    else if (Number(p.rank) < minRankIndex) e.rank = `Rango mínimo: ${ranks[minRankIndex]} (anti-smurf).`;
    if (!e.age && age < 18 && !p.guardian) e.guardian = "Confirma la autorización firmada del tutor.";
    return e;
  }

  /** Devuelve { errors: { [i]: {...} }, duplicates, ok } para toda la plantilla. */
  function validateRoster(players) {
    const errors = {};
    const seen = new Map();
    players.forEach((p, i) => {
      const e = validatePlayer(p, i >= 5);
      const key = p.riot.trim().toLowerCase();
      if (key && !e.riot) {
        if (seen.has(key)) e.riot = `Riot ID repetido (también en jugador ${seen.get(key) + 1}).`;
        else seen.set(key, i);
      }
      if (Object.keys(e).length) errors[i] = e;
    });
    return { errors, ok: Object.keys(errors).length === 0 };
  }

  A.validators = { RE, validateTeam, validatePlayer, validateRoster };
})((window.APEX = window.APEX || {}));
