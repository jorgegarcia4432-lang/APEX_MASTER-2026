/* ui.js — componentes de interfaz reutilizables: tabs accesibles y modal */
(function (A) {
  const { h } = A.util;

  /**
   * Tabs con roles ARIA, navegación por teclado y render perezoso.
   * items: [{ label, icon?, render: () => Node }]
   */
  function tabs(items, { label = "Secciones", initial = 0, onChange } = {}) {
    const uid = "t" + Math.random().toString(36).slice(2, 7);
    const list = h("div", { class: "tabs", role: "tablist", "aria-label": label });
    const wrap = h("div", { class: "tab-panels" });
    const buttons = [];
    const panels = [];

    items.forEach((item, i) => {
      const btn = h("button", {
        class: "tab", type: "button", role: "tab",
        id: `${uid}-t${i}`, "aria-controls": `${uid}-p${i}`,
        onclick: () => select(i),
      }, item.icon && h("span", { class: "tab__k", text: item.icon }), h("span", { text: item.label }));
      const panel = h("div", {
        class: "tab-panel", role: "tabpanel", tabindex: "0",
        id: `${uid}-p${i}`, "aria-labelledby": `${uid}-t${i}`, hidden: true,
      });
      buttons.push(btn); panels.push(panel);
      list.append(btn); wrap.append(panel);
    });

    function select(i, focus = false) {
      buttons.forEach((b, j) => {
        const on = i === j;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (!panels[i].dataset.ready) {
        panels[i].append(items[i].render());
        panels[i].dataset.ready = "1";
      }
      if (focus) buttons[i].focus();
      if (onChange) onChange(i);
    }

    list.addEventListener("keydown", (e) => {
      const cur = buttons.indexOf(document.activeElement);
      if (cur < 0) return;
      const last = buttons.length - 1;
      const next = { ArrowRight: cur === last ? 0 : cur + 1, ArrowLeft: cur === 0 ? last : cur - 1, Home: 0, End: last }[e.key];
      if (next == null) return;
      e.preventDefault();
      select(next, true);
    });

    select(initial);
    return { el: h("div", { class: "tabs-wrap" }, list, wrap), select };
  }

  /** Grupo de chips tipo toggle (selección única). */
  function chipGroup(options, { label, selected, onSelect, cls = "" }) {
    const group = h("div", { class: "chips", role: "group", "aria-label": label });
    const chips = options.map((opt) => {
      const chip = h("button", {
        class: `chip ${cls}`, type: "button", text: opt.label,
        "aria-pressed": String(opt.value === selected),
        onclick: () => {
          chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
          chip.setAttribute("aria-pressed", "true");
          onSelect(opt.value);
        },
      });
      return chip;
    });
    group.append(...chips);
    return group;
  }

  /* ---------- Modal con focus-trap, Esc y retorno de foco ---------- */
  let active = null;

  function openModal(content, { label, dismissOnBackdrop = true } = {}) {
    closeModal();
    const previous = document.activeElement;
    const dialog = h("div", { class: "modal__dialog", role: "dialog", "aria-modal": "true", "aria-label": label, tabindex: "-1" }, content);
    const overlay = h("div", { class: "modal" }, dialog);

    if (dismissOnBackdrop) overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) closeModal(); });

    const onKey = (e) => {
      if (e.key === "Escape") return closeModal();
      if (e.key !== "Tab") return;
      const focusables = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea')].filter((x) => x.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", onKey);
    document.body.append(overlay);
    document.body.classList.add("no-scroll");
    dialog.focus();
    active = { overlay, onKey, previous };
    return dialog;
  }

  function closeModal() {
    if (!active) return;
    const { overlay, onKey, previous } = active;
    document.removeEventListener("keydown", onKey);
    overlay.remove();
    document.body.classList.remove("no-scroll");
    active = null;
    if (previous && previous.focus) previous.focus();
  }

  /** Cabecera estándar de modal. */
  function modalHead(title) {
    return h("div", { class: "modal__head" },
      h("h2", { class: "modal__title", text: title }),
      h("button", { class: "modal__close", type: "button", "aria-label": "Cerrar", text: "✕", onclick: closeModal }));
  }

  /* ---------- Campos de formulario con error inline ---------- */
  let fieldSeq = 0;
  function field({ label, type = "text", value = "", placeholder = "", hint, attrs = {}, onInput, options }) {
    const id = `f${++fieldSeq}`;
    const errId = `${id}-err`;
    const control = options
      ? h("select", { class: "select", id, "aria-describedby": errId, ...attrs },
          h("option", { value: "", text: "Selecciona…" }),
          options.map((o) => h("option", { value: o.value, text: o.label })))
      : h("input", { class: "input", id, type, placeholder, "aria-describedby": errId, ...attrs });
    control.value = value;
    const error = h("span", { class: "field__error", id: errId, role: "alert" });
    const el = h("div", { class: "field" }, h("label", { for: id, text: label }), control, hint && h("span", { class: "field__hint", text: hint }), error);
    const setError = (msg) => {
      error.textContent = msg || "";
      if (msg) control.setAttribute("aria-invalid", "true"); else control.removeAttribute("aria-invalid");
    };
    const evt = options ? "change" : "input";
    control.addEventListener(evt, () => { setError(""); if (onInput) onInput(control.value, control); });
    return { el, control, setError };
  }

  A.ui = { tabs, chipGroup, openModal, closeModal, modalHead, field };
})((window.APEX = window.APEX || {}));
