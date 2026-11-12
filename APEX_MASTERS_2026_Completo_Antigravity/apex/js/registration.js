/* registration.js — modal de inscripción en 4 pasos con validación en cliente (Skill 03) */
(function (A) {
  const { h, store, money, download } = A.util;
  const { data, ui, validators: V } = A;
  const { field } = ui;

  const STORE_KEY = "apex.registrations";
  const STEPS = ["Equipo", "Plantilla", "Pago", "Acreditación"];
  const PAYMENTS = [
    { id: "stripe", name: "Stripe", d: "Tarjeta de crédito o débito" },
    { id: "paypal", name: "PayPal", d: "Saldo o tarjeta vinculada" },
    { id: "transfer", name: "Transferencia corporativa", d: "Se verifica el comprobante antes de emitir credenciales" },
  ];

  const newState = () => ({
    step: 0,
    team: { name: "", tag: "", discord: "", email: "" },
    players: Array.from({ length: 7 }, () => ({ riot: "", age: "", rank: "", guardian: false })),
    payment: "stripe",
    accept: false,
    result: null,
  });

  const isNameTaken = (name) => {
    const n = name.trim().toLowerCase();
    const sample = Object.values(data.groups).flat().map(([teamName]) => teamName.toLowerCase());
    const saved = store.get(STORE_KEY, []).map((r) => r.name.toLowerCase());
    return sample.includes(n) || saved.includes(n);
  };

  const makeCode = (tag) => {
    const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
    return `APEX-${tag.toUpperCase()}-${rand}`;
  };

  /* ---------- Paso 1: equipo y capitán ---------- */
  function teamStep(state) {
    const t = state.team;
    const f = {
      name: field({ label: "Nombre del equipo", value: t.name, attrs: { maxlength: "32", autocomplete: "off" }, onInput: (v) => (t.name = v) }),
      tag: field({ label: "Tag (3-4 letras)", value: t.tag, attrs: { maxlength: "4", autocomplete: "off" }, onInput: (v, c) => { c.value = v.toUpperCase(); t.tag = c.value; } }),
      discord: field({ label: "Discord ID del capitán", value: t.discord, placeholder: "capitan_apex", attrs: { autocomplete: "off" }, onInput: (v) => (t.discord = v) }),
      email: field({ label: "Correo electrónico", type: "email", value: t.email, placeholder: "capitan@equipo.com", attrs: { autocomplete: "email" }, onInput: (v) => (t.email = v) }),
    };
    return {
      el: h("div", { class: "form-grid" }, f.name.el, f.tag.el, f.discord.el, f.email.el),
      validate() {
        const e = V.validateTeam(t);
        if (!e.name && isNameTaken(t.name)) e.name = "Ya existe un equipo inscrito con ese nombre.";
        const keys = Object.keys(f);
        keys.forEach((k) => f[k].setError(e[k]));
        const first = keys.find((k) => e[k]);
        if (first) f[first].control.focus();
        return !first;
      },
    };
  }

  /* ---------- Paso 2: plantilla ---------- */
  function playerRow(state, i) {
    const p = state.players[i];
    const optional = i >= 5;
    const rankOptions = data.ranks.map((label, idx) => ({ value: String(idx), label }));
    const live = (key) => () => f[key].setError(V.validatePlayer(p, optional)[key]);

    const f = {
      riot: field({ label: "Riot ID", value: p.riot, placeholder: "Usuario#TAG", attrs: { autocomplete: "off", maxlength: "22" }, onInput: (v) => (p.riot = v) }),
      age: field({ label: "Edad", type: "number", value: p.age, attrs: { min: "16", max: "99", inputmode: "numeric" }, onInput: (v) => { p.age = v; syncGuardian(); } }),
      rank: field({ label: "Rango actual", value: p.rank, options: rankOptions, onInput: (v) => { p.rank = v; live("rank")(); } }),
    };
    f.age.control.addEventListener("blur", live("age"));
    f.riot.control.addEventListener("blur", () => { if (p.riot.trim()) live("riot")(); });

    const guardianErr = h("span", { class: "field__error", role: "alert" });
    const guardianBox = h("input", { type: "checkbox", onchange: (e) => { p.guardian = e.target.checked; guardianErr.textContent = ""; } });
    guardianBox.checked = p.guardian;
    const guardian = h("div", { hidden: true },
      h("label", { class: "check" }, guardianBox, h("span", { text: "Menor de 18: confirmo que cuento con la autorización firmada de mi tutor legal (se solicitará por correo al capitán)." })),
      guardianErr);
    const syncGuardian = () => { const a = Number(p.age); guardian.hidden = !(p.age !== "" && a >= data.event.minAge && a < 18); };
    syncGuardian();

    return {
      el: h("div", { class: "player" },
        h("div", { class: "player__title" }, optional ? `Suplente ${i - 4}` : `Titular ${i + 1}`, h("span", { class: `badge ${optional ? "" : "badge--cyan"}`, text: optional ? "Opcional" : "Requerido" })),
        h("div", { class: "player__fields" }, f.riot.el, f.age.el, f.rank.el), guardian),
      apply(errors = {}) {
        ["riot", "age", "rank"].forEach((k) => f[k].setError(errors[k]));
        guardianErr.textContent = errors.guardian || "";
        return ["riot", "age", "rank"].find((k) => errors[k]);
      },
      focus: (k) => f[k].control.focus(),
    };
  }

  function rosterStep(state) {
    const rows = state.players.map((_, i) => playerRow(state, i));
    const notice = h("div", { class: "form-error", hidden: true, role: "alert" });
    return {
      el: h("div", { class: "modal__body", style: "padding:0" },
        h("p", { class: "muted", text: `5 titulares obligatorios y hasta 2 suplentes. Edad mínima ${data.event.minAge} años y rango mínimo ${data.ranks[data.event.minRankIndex]} (anti-smurf).` }),
        rows.map((r) => r.el), notice),
      validate() {
        const { errors, ok } = V.validateRoster(state.players);
        rows.forEach((r, i) => r.apply(errors[i]));
        notice.hidden = ok;
        notice.textContent = ok ? "" : "Revisa los campos marcados en la plantilla.";
        if (!ok) { const i = Number(Object.keys(errors)[0]); const k = rows[i].apply(errors[i]); if (k) rows[i].focus(k); }
        return ok;
      },
    };
  }

  /* ---------- Paso 3: resumen y pago ---------- */
  function paymentStep(state) {
    const filled = state.players.filter((p) => p.riot.trim()).length;
    const row = (k, v, cls = "") => h("div", { class: `summary__row ${cls}` }, h("span", { class: "muted", text: k }), h("span", { text: v }));
    const err = h("p", { class: "field__error", role: "alert" });
    const accept = h("input", { type: "checkbox", onchange: (e) => { state.accept = e.target.checked; err.textContent = ""; } });
    accept.checked = state.accept;
    return {
      el: h("div", { class: "modal__body", style: "padding:0" },
        h("div", { class: "summary" },
          row("Equipo", `${state.team.name.trim()} [${state.team.tag.trim().toUpperCase()}]`),
          row("Capitán (Discord)", state.team.discord.trim()),
          row("Jugadores", `${filled} (${Math.min(filled, 5)} titulares + ${Math.max(filled - 5, 0)} suplentes)`),
          row("Cuota de inscripción", money(data.event.fee), "summary__row--total")),
        h("fieldset", { style: "border:0;padding:0;margin:0" },
          h("legend", { class: "field__label", style: "margin-bottom:.5rem", text: "Método de pago" }),
          h("div", { class: "pay-options" }, PAYMENTS.map((m) => {
            const radio = h("input", { type: "radio", name: "pay", value: m.id, onchange: () => (state.payment = m.id) });
            radio.checked = state.payment === m.id;
            return h("label", { class: "pay-option" }, radio, h("span", {}, m.name, h("small", { text: m.d })));
          }))),
        h("label", { class: "check" }, accept, h("span", { text: "Acepto el Reglamento Oficial y las normas de Fair Play, y declaro que todos los datos son verídicos." })),
        err,
        h("p", { class: "note", text: "Demo: el pago es simulado, no se realiza ningún cobro." })),
      validate() {
        if (!state.accept) { err.textContent = "Debes aceptar el Reglamento y Fair Play para continuar."; accept.focus(); return false; }
        return true;
      },
    };
  }

  /* ---------- Paso 4: confirmación y QR ---------- */
  function successStep(state) {
    if (!state.result) {
      const tag = state.team.tag.trim().toUpperCase();
      const code = makeCode(tag);
      state.result = { code, payload: `APEX2026|${code}|${tag}` };
      store.set(STORE_KEY, [...store.get(STORE_KEY, []), { code, name: state.team.name.trim(), tag, at: new Date().toISOString() }]);
    }
    const qr = qrcode(0, "M");
    qr.addData(state.result.payload);
    qr.make();
    const svg = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    const box = h("div", { class: "qr", role: "img", "aria-label": `Código QR de acreditación ${state.result.code}` });
    box.innerHTML = svg; // SVG generado por la librería a partir de un payload alfanumérico propio

    return {
      el: h("div", { class: "success" },
        h("span", { class: "badge badge--ok", text: "Inscripción registrada (simulada)" }),
        h("h3", { class: "card__title", text: `¡Bienvenido, ${state.team.name.trim()}!` }),
        h("p", { class: "muted", text: "Tu código de registro:" }),
        h("div", { class: "reg-code", text: state.result.code }),
        box,
        h("p", { class: "muted", text: "Guarda este QR: será tu acreditación de check-in en Arena eSports Nexus. Recibirás el rol de capitán en Discord tras la auditoría de rangos." }),
        h("button", { class: "btn btn--sm btn--ghost", type: "button", text: "Descargar QR", onclick: () => download(`${state.result.code}.svg`, svg, "image/svg+xml") })),
      validate: () => true,
    };
  }

  const BUILDERS = [teamStep, rosterStep, paymentStep, successStep];

  /* ---------- Orquestación del modal ---------- */
  function open() {
    if (A.countdown.phase() !== "before") {
      ui.openModal(h("div", {}, ui.modalHead("Inscripciones cerradas"),
        h("div", { class: "modal__body" }, h("p", { class: "muted", text: "El torneo ya comenzó, por lo que el período de inscripción finalizó." }),
          h("button", { class: "btn", type: "button", text: "Entendido", onclick: ui.closeModal }))), { label: "Inscripciones cerradas" });
      return;
    }

    const state = newState();
    const stepper = h("ol", { class: "stepper", style: "list-style:none;margin:0" });
    const content = h("div", { class: "modal__body" });
    const foot = h("div", { class: "modal__foot" });
    let current;

    function render() {
      current = BUILDERS[state.step](state);
      stepper.replaceChildren(...STEPS.map((label, i) =>
        h("li", { class: `stepper__item${i < state.step ? " is-done" : ""}${i === state.step ? " is-current" : ""}`, ...(i === state.step && { "aria-current": "step" }) },
          `${i + 1}`, h("span", { text: ` · ${label}` }))));
      content.replaceChildren(h("h3", { class: "card__title", text: `Paso ${state.step + 1}: ${["Datos del equipo y capitán", "Plantilla de jugadores", "Resumen de pago", "Confirmación"][state.step]}` }), current.el);

      const last = state.step === STEPS.length - 1;
      foot.replaceChildren(
        last ? h("span") : h("button", { class: "btn btn--ghost", type: "button", text: state.step === 0 ? "Cancelar" : "Atrás", onclick: state.step === 0 ? ui.closeModal : () => go(-1) }),
        h("button", { class: "btn", type: "button", text: last ? "Cerrar" : state.step === 2 ? `Confirmar y pagar ${money(data.event.fee)}` : "Siguiente", onclick: last ? ui.closeModal : next }));
      const dialog = content.closest(".modal__dialog");
      if (dialog) dialog.scrollTop = 0;
    }

    const go = (d) => { state.step += d; render(); };
    const next = () => { if (current.validate()) go(1); };

    render();
    ui.openModal(h("div", {}, ui.modalHead("Inscribir equipo · $50 USD"), stepper, content, h("div", { class: "modal__body", style: "padding-top:0" }, foot)),
      { label: "Inscripción de equipo", dismissOnBackdrop: false });
  }

  A.registration = { open };
})((window.APEX = window.APEX || {}));
