/* committee.js — directorio del comité y footer */
(function (A) {
  const { h } = A.util;
  const { data } = A;

  const initials = (name) => name.replace(/^Ing\.\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");

  function init({ committee, credits, links }) {
    committee.append(h("div", { class: "grid grid--2" }, data.committee.map((p) =>
      h("div", { class: "card card--hover person" },
        h("div", { class: "avatar", "aria-hidden": "true", text: initials(p.name) }),
        h("div", {}, h("h3", { style: "font-size:1.2rem", text: p.name }), h("p", { class: "person__role", text: p.role }),
          h("a", { href: `mailto:${p.email}`, text: p.email }))))));
    credits.textContent = data.credits;
    links.append(...data.links.map((l) => h("a", { href: l.href, target: "_blank", rel: "noopener noreferrer", text: l.label })));
  }

  A.committee = { init };
})((window.APEX = window.APEX || {}));
