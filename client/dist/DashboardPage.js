import { u as useAuthStore, v as onMounted, c as createElementBlock, a as createBaseVNode, b as createVNode, w as withCtx, t as toDisplayString, d as unref, F as Fragment, r as renderList, e as createCommentVNode, g as resolveComponent, p as computed, o as openBlock, j as createTextVNode, n as normalizeStyle } from "./index.js";
import { u as useAutorStore } from "./index2.js";
import "./manuscritos.js";
const _hoisted_1 = { style: { "background": "linear-gradient(135deg,#5d4037 0%,#8d6e63 100%)", "padding": "32px 28px 24px", "position": "relative", "overflow": "hidden" } };
const _hoisted_2 = { style: { "font-size": "22px", "font-weight": "700", "color": "#fff", "margin-bottom": "4px" } };
const _hoisted_3 = { style: { "display": "grid", "grid-template-columns": "1fr 300px", "gap": "20px", "padding": "20px 20px", "max-width": "1100px" } };
const _hoisted_4 = { style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "padding": "14px 16px", "margin-bottom": "14px", "display": "flex", "align-items": "center", "gap": "12px" } };
const _hoisted_5 = { style: { "padding": "14px 16px", "display": "flex", "align-items": "flex-start", "gap": "12px" } };
const _hoisted_6 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_7 = { style: { "font-size": "14px", "font-weight": "600", "color": "#3e2723", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" } };
const _hoisted_8 = { style: { "font-size": "12px", "color": "#8d6e63", "margin-top": "2px" } };
const _hoisted_9 = { key: 0 };
const _hoisted_10 = {
  key: 0,
  style: { "text-align": "center", "padding": "40px 0", "color": "#8d6e63" }
};
const _hoisted_11 = { style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "overflow": "hidden", "margin-bottom": "14px" } };
const _hoisted_12 = { style: { "font-size": "13px", "color": "#5d4037" } };
const _hoisted_13 = { style: { "font-size": "18px", "font-weight": "700", "color": "#3e2723" } };
const _hoisted_14 = { style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "overflow": "hidden" } };
const _hoisted_15 = { style: { "font-size": "13px", "font-weight": "600", "color": "#3e2723" } };
const _hoisted_16 = { style: { "font-size": "11px", "color": "#c62828", "margin-top": "2px" } };
const _hoisted_17 = {
  key: 0,
  style: { "padding": "12px 14px", "font-size": "13px", "color": "#8d6e63" }
};
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const auth = useAuthStore();
    const autorStore = useAutorStore();
    onMounted(() => {
      autorStore.cargarMisManuscritos();
    });
    const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter((c) => c.estado === "ABIERTA"));
    const stats = computed(() => [
      { label: "Enviados", valor: autorStore.manuscritos.filter((m) => m.estado !== "BORRADOR").length },
      { label: "En revisión", valor: autorStore.manuscritos.filter((m) => m.estado === "EN_REVISION").length },
      { label: "Aceptados", valor: autorStore.manuscritos.filter((m) => m.estado === "ACEPTADO").length },
      { label: "Borradores", valor: autorStore.manuscritos.filter((m) => m.estado === "BORRADOR").length }
    ]);
    const ESTADOS = { BORRADOR: "Borrador", ENVIADO: "Enviado", EN_REVISION: "En revisión", ACEPTADO: "Aceptado", RECHAZADO: "Rechazado" };
    const COLORES = { BORRADOR: "#9e9e9e", ENVIADO: "#546e7a", EN_REVISION: "#e65100", ACEPTADO: "#558b2f", RECHAZADO: "#c62828" };
    const CHIPS = { BORRADOR: "secondary", ENVIADO: "info", EN_REVISION: "warning", ACEPTADO: "success", RECHAZADO: "error" };
    const ICONOS = { BORRADOR: "mdi-pencil-outline", ENVIADO: "mdi-send", EN_REVISION: "mdi-clock-outline", ACEPTADO: "mdi-check-circle-outline", RECHAZADO: "mdi-close-circle-outline" };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    function colorEstado(e) {
      return COLORES[e] ?? "#9e9e9e";
    }
    function chipColor(e) {
      return CHIPS[e] ?? "secondary";
    }
    function iconEstado(e) {
      return ICONOS[e] ?? "mdi-file-outline";
    }
    return (_ctx, _cache) => {
      var _a;
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_chip = resolveComponent("v-chip");
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1, [
          createVNode(_component_v_icon, {
            size: "120",
            style: { "position": "absolute", "right": "-16px", "bottom": "-20px", "color": "rgba(255,255,255,0.08)" }
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode("mdi-account-edit", -1)
            ])]),
            _: 1
          }),
          _cache[2] || (_cache[2] = createBaseVNode("div", { style: { "color": "rgba(255,255,255,0.7)", "font-size": "12px", "text-transform": "uppercase", "letter-spacing": "0.08em", "margin-bottom": "4px" } }, " Autor ", -1)),
          createBaseVNode("div", _hoisted_2, " Bienvenido, " + toDisplayString((_a = unref(auth).usuario) == null ? void 0 : _a.nombre), 1),
          _cache[3] || (_cache[3] = createBaseVNode("div", { style: { "font-size": "14px", "color": "rgba(255,255,255,0.75)" } }, " Gestiona tus manuscritos y sigue el estado de tus envíos ", -1)),
          createVNode(_component_v_btn, {
            color: "white",
            class: "mt-4",
            style: { "color": "#5d4037" },
            "prepend-icon": "mdi-plus",
            rounded: "xl",
            elevation: "0",
            to: "/autor/nuevo"
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" Enviar artículo ", -1)
            ])]),
            _: 1
          })
        ]),
        createBaseVNode("div", _hoisted_3, [
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_4, [
              createVNode(_component_v_icon, {
                color: "secondary",
                size: "20"
              }, {
                default: withCtx(() => [..._cache[4] || (_cache[4] = [
                  createTextVNode("mdi-file-document-outline", -1)
                ])]),
                _: 1
              }),
              _cache[6] || (_cache[6] = createBaseVNode("span", { style: { "font-size": "14px", "color": "#8d6e63", "flex": "1" } }, "Artículos recientes", -1)),
              createVNode(_component_v_btn, {
                size: "small",
                variant: "text",
                color: "primary",
                to: "/autor/articulos"
              }, {
                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                  createTextVNode("Ver todos", -1)
                ])]),
                _: 1
              })
            ]),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(autorStore).manuscritos.slice(0, 5), (m) => {
              return openBlock(), createElementBlock("div", {
                key: m.id,
                style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "margin-bottom": "10px", "overflow": "hidden" }
              }, [
                createBaseVNode("div", {
                  style: normalizeStyle(`height:5px; background:${colorEstado(m.estado)}`)
                }, null, 4),
                createBaseVNode("div", _hoisted_5, [
                  createBaseVNode("div", {
                    style: normalizeStyle(`background:${colorEstado(m.estado)}22; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px`)
                  }, [
                    createVNode(_component_v_icon, {
                      color: colorEstado(m.estado),
                      size: "18"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(iconEstado(m.estado)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ], 4),
                  createBaseVNode("div", _hoisted_6, [
                    createBaseVNode("div", _hoisted_7, toDisplayString(m.titulo), 1),
                    createBaseVNode("div", _hoisted_8, [
                      createTextVNode(toDisplayString(m.convocatoria), 1),
                      m.fechaEnvio ? (openBlock(), createElementBlock("span", _hoisted_9, " · " + toDisplayString(m.fechaEnvio), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode(_component_v_chip, {
                    color: chipColor(m.estado),
                    label: "",
                    size: "x-small",
                    style: { "flex-shrink": "0", "margin-top": "2px" }
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(estadoLabel(m.estado)), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ])
              ]);
            }), 128)),
            unref(autorStore).manuscritos.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_10, [
              createVNode(_component_v_icon, {
                size: "40",
                color: "secondary"
              }, {
                default: withCtx(() => [..._cache[7] || (_cache[7] = [
                  createTextVNode("mdi-file-outline", -1)
                ])]),
                _: 1
              }),
              _cache[9] || (_cache[9] = createBaseVNode("p", { style: { "font-size": "14px", "margin-top": "8px" } }, "Aún no has enviado ningún artículo.", -1)),
              createVNode(_component_v_btn, {
                color: "primary",
                to: "/autor/nuevo",
                class: "mt-2"
              }, {
                default: withCtx(() => [..._cache[8] || (_cache[8] = [
                  createTextVNode("Enviar primer artículo", -1)
                ])]),
                _: 1
              })
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_11, [
              _cache[10] || (_cache[10] = createBaseVNode("div", { style: { "background": "#5d4037", "padding": "10px 14px" } }, [
                createBaseVNode("span", { style: { "font-size": "13px", "font-weight": "600", "color": "#fff" } }, "Mis estadísticas")
              ], -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (stat) => {
                return openBlock(), createElementBlock("div", {
                  key: stat.label,
                  style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "10px 14px", "border-top": "1px solid #f0e9df" }
                }, [
                  createBaseVNode("span", _hoisted_12, toDisplayString(stat.label), 1),
                  createBaseVNode("span", _hoisted_13, toDisplayString(stat.valor), 1)
                ]);
              }), 128))
            ]),
            createBaseVNode("div", _hoisted_14, [
              _cache[12] || (_cache[12] = createBaseVNode("div", { style: { "background": "#8d6e63", "padding": "10px 14px" } }, [
                createBaseVNode("span", { style: { "font-size": "13px", "font-weight": "600", "color": "#fff" } }, "Convocatorias abiertas")
              ], -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(convocatoriasAbiertas.value, (c) => {
                return openBlock(), createElementBlock("div", {
                  key: c.id,
                  style: { "padding": "10px 14px", "border-top": "1px solid #f0e9df" }
                }, [
                  createBaseVNode("div", _hoisted_15, toDisplayString(c.nombre), 1),
                  createBaseVNode("div", _hoisted_16, [
                    createVNode(_component_v_icon, { size: "11" }, {
                      default: withCtx(() => [..._cache[11] || (_cache[11] = [
                        createTextVNode("mdi-calendar-clock", -1)
                      ])]),
                      _: 1
                    }),
                    createTextVNode(" " + toDisplayString(c.deadline), 1)
                  ])
                ]);
              }), 128)),
              convocatoriasAbiertas.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_17, " Sin convocatorias abiertas ")) : createCommentVNode("", true)
            ])
          ])
        ])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
