/* arena.js — Arena & Tech: hardware, red/VLAN, layout del recinto y broadcast (estilo blueprint) */
(function (A) {
  const { h } = A.util;
  const { tabs } = A.ui;
  const { data } = A;

  const specGrid = (items) =>
    h("div", { class: "grid grid--3" }, items.map((s) =>
      h("div", { class: "card card--hover spec" }, h("span", { class: "spec__k", text: s.k }), h("span", { class: "spec__v", text: s.v }))));

  const hardwarePanel = () => specGrid(data.hardware);
  const broadcastPanel = () => specGrid(data.broadcast);

  /** Lista de botones seleccionables + panel de detalle (usada por VLANs y layout). */
  function selector({ items, renderItem, renderDetail, className }) {
    const detail = h("div", { class: "detail-panel", "aria-live": "polite" });
    const nodes = items.map((it, i) =>
      renderItem(it, () => {
        nodes.forEach((n) => n.setAttribute("aria-pressed", "false"));
        nodes[i].setAttribute("aria-pressed", "true");
        detail.replaceChildren(...renderDetail(it));
      }));
    nodes[0].click();
    return { list: h("div", { class: className }, nodes), detail };
  }

  function networkPanel() {
    const { list, detail } = selector({
      items: data.vlans,
      className: "vlan-list",
      renderItem: (v, select) => h("button", { class: "vlan", type: "button", "aria-pressed": "false", onclick: select },
        h("span", { class: "vlan__id", text: v.id }), h("span", { class: "vlan__name", text: v.name }), h("span", { class: "vlan__metric", text: v.metric })),
      renderDetail: (v) => [h("h4", { text: `${v.id} · ${v.name}` }), h("p", { class: "muted", text: v.d })],
    });
    const diagram = h("div", { class: "net-diagram", "aria-label": "Topología de red" },
      h("div", { class: "net-node", text: "WAN · Fibra 1 Gbps simétrica  +  4G/5G Failover" }),
      h("div", { class: "net-node", text: "Switches administrables L3 · QoS · UPS Online 30 min" }),
      h("div", { class: "net-node", text: "VLAN 10 · 20 · 30 · 40" }));
    return h("div", { class: "grid grid--2" },
      h("div", {}, h("h3", { class: "card__title", text: "Conectividad WAN" }), specGrid(data.wan), h("div", { style: "margin-top:1rem" }, diagram)),
      h("div", {}, h("h3", { class: "card__title", text: "Segmentación L3 (selecciona una VLAN)" }), list, detail));
  }

  function layoutPanel() {
    const { list, detail } = selector({
      items: data.zones,
      className: "layout-map blueprint",
      renderItem: (z, select) => h("button", { class: `zone zone--${z.id}`, type: "button", "aria-pressed": "false", onclick: select },
        z.key, h("small", { text: z.sub })),
      renderDetail: (z) => [h("h4", { text: z.key }), h("p", { class: "muted", text: z.d })],
    });
    return h("div", {}, list, detail);
  }

  function init(mount) {
    mount.append(tabs([
      { label: "Hardware Stage", icon: "10 PCs", render: hardwarePanel },
      { label: "Red & VLANs", icon: "1 Gbps", render: networkPanel },
      { label: "Layout del recinto", icon: "4 zonas", render: layoutPanel },
      { label: "Broadcast", icon: "1080p60", render: broadcastPanel },
    ], { label: "Ecosistema tecnológico" }).el);
  }

  A.arena = { init };
})((window.APEX = window.APEX || {}));
