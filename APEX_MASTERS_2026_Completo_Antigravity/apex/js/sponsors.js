/* sponsors.js — paquetes comerciales y modal de contacto B2B (Skill 09) */
(function (A) {
  const { h } = A.util;
  const { data, ui, validators } = A;
  const CONTACT = data.committee[0].email; // Dirección General

  function tierCard(t) {
    return h("article", { class: `card tier tier--${t.tier}` },
      h("p", { class: "card__eyebrow", text: t.name }),
      h("p", { class: "tier__price", text: t.price }),
      h("ul", {}, t.perks.map((p) => h("li", { text: p }))),
      h("button", { class: "btn btn--sm btn--ghost", type: "button", text: `Quiero ser ${t.name.split(" ")[0]}`, onclick: () => openContact(t.tier) }));
  }

  /** Abre el cliente de correo con la propuesta prellenada (no se simula un envío). */
  function openContact(preselected = "gold") {
    const form = { company: "", contact: "", email: "", tier: preselected, message: "" };
    const fields = {
      company: ui.field({ label: "Empresa", value: form.company, onInput: (v) => (form.company = v) }),
      contact: ui.field({ label: "Persona de contacto", value: form.contact, onInput: (v) => (form.contact = v) }),
      email: ui.field({ label: "Correo corporativo", type: "email", onInput: (v) => (form.email = v) }),
      tier: ui.field({
        label: "Nivel de interés", value: preselected, options: data.sponsors.map((s) => ({ value: s.tier, label: `${s.name} · ${s.price}` })),
        onInput: (v) => (form.tier = v),
      }),
    };
    const message = h("textarea", { class: "input", rows: "3", placeholder: "Cuéntanos qué buscas activar (opcional)", "aria-label": "Mensaje", oninput: (e) => (form.message = e.target.value) });

    const submit = () => {
      let ok = true;
      const need = (key, test, msg) => { if (!test) { fields[key].setError(msg); ok = false; } };
      need("company", form.company.trim().length >= 2, "Indica el nombre de la empresa.");
      need("contact", form.contact.trim().length >= 2, "Indica una persona de contacto.");
      need("email", validators.RE.email.test(form.email.trim()), "Correo no válido.");
      need("tier", !!form.tier, "Selecciona un nivel.");
      if (!ok) return;
      const tier = data.sponsors.find((s) => s.tier === form.tier);
      const body = `Empresa: ${form.company}\nContacto: ${form.contact}\nCorreo: ${form.email}\nNivel: ${tier.name} (${tier.price})\n\n${form.message}`;
      window.location.href = `mailto:${CONTACT}?subject=${encodeURIComponent("Patrocinio APEX MASTERS 2026 · " + tier.name)}&body=${encodeURIComponent(body)}`;
      ui.closeModal();
    };

    ui.openModal(
      h("div", {}, ui.modalHead("Contacto comercial"),
        h("div", { class: "modal__body" },
          h("p", { class: "muted", text: "Completa tus datos y abriremos tu correo con la propuesta lista para enviar a Dirección General." }),
          h("div", { class: "form-grid" }, fields.company.el, fields.contact.el, fields.email.el, fields.tier.el),
          h("div", { class: "field" }, h("span", { class: "field__label", text: "Mensaje" }), message),
          h("div", { class: "modal__foot" },
            h("button", { class: "btn btn--ghost", type: "button", text: "Cancelar", onclick: ui.closeModal }),
            h("button", { class: "btn", type: "button", text: "Enviar propuesta", onclick: submit })))),
      { label: "Contacto comercial" });
  }

  function init(mount) {
    mount.append(
      h("div", { class: "grid grid--3" }, data.sponsors.map(tierCard)),
      h("div", { class: "cta-band" },
        h("div", {}, h("h3", { class: "card__title", text: "¿Tu marca quiere jugar con nosotros?" }), h("p", { class: "muted", text: "Hablemos de paquetes a la medida, incluidas alianzas in-kind." })),
        h("button", { class: "btn", type: "button", text: "Contacto comercial", onclick: () => openContact() })));
  }

  A.sponsors = { init };
})((window.APEX = window.APEX || {}));
