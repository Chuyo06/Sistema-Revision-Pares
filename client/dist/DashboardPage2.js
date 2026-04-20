import { u as useAuthStore, v as onMounted, c as createElementBlock, a as createBaseVNode, b as createVNode, w as withCtx, t as toDisplayString, d as unref, j as createTextVNode, F as Fragment, r as renderList, e as createCommentVNode, g as resolveComponent, p as computed, o as openBlock } from "./index.js";
import { u as useRevisorStore } from "./index3.js";
import "./revision.js";
import "./manuscritos.js";
const _hoisted_1 = { style: { "background": "linear-gradient(135deg,#33691e 0%,#558b2f 100%)", "padding": "32px 28px 24px", "position": "relative", "overflow": "hidden" } };
const _hoisted_2 = { style: { "font-size": "22px", "font-weight": "700", "color": "#fff", "margin-bottom": "4px" } };
const _hoisted_3 = { style: { "font-size": "14px", "color": "rgba(255,255,255,0.75)" } };
const _hoisted_4 = { key: 0 };
const _hoisted_5 = { key: 1 };
const _hoisted_6 = { style: { "display": "grid", "grid-template-columns": "1fr 300px", "gap": "20px", "padding": "20px", "max-width": "1100px" } };
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { style: { "padding": "14px 16px", "display": "flex", "align-items": "flex-start", "gap": "12px" } };
const _hoisted_9 = { style: { "background": "#e6510022", "border-radius": "50%", "width": "36px", "height": "36px", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0", "margin-top": "2px" } };
const _hoisted_10 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_11 = { style: { "font-size": "14px", "font-weight": "600", "color": "#3e2723", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" } };
const _hoisted_12 = { style: { "font-size": "12px", "color": "#8d6e63", "margin-top": "2px" } };
const _hoisted_13 = { style: { "font-size": "11px", "color": "#c62828", "margin-top": "2px" } };
const _hoisted_14 = {
  key: 0,
  style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "padding": "20px 16px", "text-align": "center", "margin-bottom": "14px" }
};
const _hoisted_15 = { style: { "padding": "12px 16px", "display": "flex", "align-items": "center", "gap": "12px" } };
const _hoisted_16 = { style: { "background": "#558b2f22", "border-radius": "50%", "width": "32px", "height": "32px", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" } };
const _hoisted_17 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_18 = { style: { "font-size": "13px", "font-weight": "600", "color": "#3e2723", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" } };
const _hoisted_19 = { style: { "font-size": "12px", "color": "#8d6e63" } };
const _hoisted_20 = {
  key: 1,
  style: { "font-size": "13px", "color": "#8d6e63", "padding": "8px 0" }
};
const _hoisted_21 = { style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "overflow": "hidden" } };
const _hoisted_22 = { style: { "font-size": "13px", "color": "#5d4037" } };
const _hoisted_23 = { style: { "font-size": "18px", "font-weight": "700", "color": "#3e2723" } };
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const auth = useAuthStore();
    const revisorStore = useRevisorStore();
    onMounted(() => {
      revisorStore.cargarDashboard();
    });
    const pendientes = computed(() => revisorStore.articulosAsignados.filter((a) => a.estado !== "COMPLETADA").length);
    const pendientesLista = computed(() => revisorStore.articulosAsignados.filter((a) => a.estado === "PENDIENTE"));
    const completadas = computed(() => revisorStore.articulosAsignados.filter((a) => a.estado === "COMPLETADA"));
    const stats = computed(() => [
      { label: "Asignados", valor: revisorStore.articulosAsignados.length },
      { label: "Pendientes", valor: pendientes.value },
      { label: "En progreso", valor: revisorStore.articulosAsignados.filter((a) => a.estado === "EN_PROGRESO").length },
      { label: "Completadas", valor: completadas.value.length }
    ]);
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
              createTextVNode(" mdi-clipboard-check ", -1)
            ])]),
            _: 1
          }),
          _cache[4] || (_cache[4] = createBaseVNode("div", { style: { "color": "rgba(255,255,255,0.7)", "font-size": "12px", "text-transform": "uppercase", "letter-spacing": "0.08em", "margin-bottom": "4px" } }, "Revisor", -1)),
          createBaseVNode("div", _hoisted_2, " Bienvenido, " + toDisplayString((_a = unref(auth).usuario) == null ? void 0 : _a.nombre), 1),
          createBaseVNode("div", _hoisted_3, [
            pendientes.value > 0 ? (openBlock(), createElementBlock("span", _hoisted_4, [
              _cache[1] || (_cache[1] = createTextVNode("Tienes ", -1)),
              createBaseVNode("strong", null, toDisplayString(pendientes.value), 1),
              _cache[2] || (_cache[2] = createTextVNode(" revisión(es) pendiente(s)", -1))
            ])) : (openBlock(), createElementBlock("span", _hoisted_5, "Estás al día con tus revisiones"))
          ]),
          createVNode(_component_v_btn, {
            color: "white",
            class: "mt-4",
            style: { "color": "#33691e" },
            "prepend-icon": "mdi-clipboard-list-outline",
            rounded: "xl",
            elevation: "0",
            to: "/revisor/asignados"
          }, {
            default: withCtx(() => [..._cache[3] || (_cache[3] = [
              createTextVNode(" Ver asignados ", -1)
            ])]),
            _: 1
          })
        ]),
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("div", null, [
            _cache[14] || (_cache[14] = createBaseVNode("div", { style: { "font-size": "13px", "font-weight": "700", "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em", "margin-bottom": "10px" } }, " Pendientes de revisión ", -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(pendientesLista.value, (a) => {
              return openBlock(), createElementBlock("div", {
                key: a.id,
                style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "margin-bottom": "10px", "overflow": "hidden", "cursor": "pointer" },
                onClick: ($event) => _ctx.$router.push(`/revisor/revision/${a.id}`)
              }, [
                _cache[8] || (_cache[8] = createBaseVNode("div", { style: { "height": "5px", "background": "#e65100" } }, null, -1)),
                createBaseVNode("div", _hoisted_8, [
                  createBaseVNode("div", _hoisted_9, [
                    createVNode(_component_v_icon, {
                      color: "#e65100",
                      size: "18"
                    }, {
                      default: withCtx(() => [..._cache[5] || (_cache[5] = [
                        createTextVNode("mdi-clock-outline", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  createBaseVNode("div", _hoisted_10, [
                    createBaseVNode("div", _hoisted_11, toDisplayString(a.titulo), 1),
                    createBaseVNode("div", _hoisted_12, toDisplayString(a.convocatoria), 1),
                    createBaseVNode("div", _hoisted_13, [
                      createVNode(_component_v_icon, { size: "11" }, {
                        default: withCtx(() => [..._cache[6] || (_cache[6] = [
                          createTextVNode("mdi-calendar-clock", -1)
                        ])]),
                        _: 1
                      }),
                      createTextVNode(" Deadline: " + toDisplayString(a.deadline), 1)
                    ])
                  ]),
                  createVNode(_component_v_btn, {
                    size: "small",
                    color: "primary",
                    rounded: "lg",
                    elevation: "0"
                  }, {
                    default: withCtx(() => [..._cache[7] || (_cache[7] = [
                      createTextVNode(" Revisar ", -1)
                    ])]),
                    _: 1
                  })
                ])
              ], 8, _hoisted_7);
            }), 128)),
            pendientesLista.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_14, [
              createVNode(_component_v_icon, {
                color: "success",
                size: "28"
              }, {
                default: withCtx(() => [..._cache[9] || (_cache[9] = [
                  createTextVNode("mdi-check-circle", -1)
                ])]),
                _: 1
              }),
              _cache[10] || (_cache[10] = createBaseVNode("p", { style: { "font-size": "13px", "color": "#558b2f", "margin-top": "6px" } }, "Sin revisiones pendientes", -1))
            ])) : createCommentVNode("", true),
            _cache[15] || (_cache[15] = createBaseVNode("div", { style: { "font-size": "13px", "font-weight": "700", "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em", "margin": "16px 0 10px" } }, " Revisiones completadas ", -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(completadas.value, (a) => {
              return openBlock(), createElementBlock("div", {
                key: a.id,
                style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "margin-bottom": "10px", "overflow": "hidden" }
              }, [
                _cache[13] || (_cache[13] = createBaseVNode("div", { style: { "height": "5px", "background": "#558b2f" } }, null, -1)),
                createBaseVNode("div", _hoisted_15, [
                  createBaseVNode("div", _hoisted_16, [
                    createVNode(_component_v_icon, {
                      color: "#558b2f",
                      size: "16"
                    }, {
                      default: withCtx(() => [..._cache[11] || (_cache[11] = [
                        createTextVNode("mdi-check", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  createBaseVNode("div", _hoisted_17, [
                    createBaseVNode("div", _hoisted_18, toDisplayString(a.titulo), 1),
                    createBaseVNode("div", _hoisted_19, toDisplayString(a.convocatoria), 1)
                  ]),
                  createVNode(_component_v_chip, {
                    color: "success",
                    label: "",
                    size: "x-small"
                  }, {
                    default: withCtx(() => [..._cache[12] || (_cache[12] = [
                      createTextVNode("Enviada", -1)
                    ])]),
                    _: 1
                  })
                ])
              ]);
            }), 128)),
            completadas.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_20, " Ninguna completada aún. ")) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_21, [
              _cache[16] || (_cache[16] = createBaseVNode("div", { style: { "background": "#558b2f", "padding": "10px 14px" } }, [
                createBaseVNode("span", { style: { "font-size": "13px", "font-weight": "600", "color": "#fff" } }, "Mis estadísticas")
              ], -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (stat) => {
                return openBlock(), createElementBlock("div", {
                  key: stat.label,
                  style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "10px 14px", "border-top": "1px solid #f0e9df" }
                }, [
                  createBaseVNode("span", _hoisted_22, toDisplayString(stat.label), 1),
                  createBaseVNode("span", _hoisted_23, toDisplayString(stat.valor), 1)
                ]);
              }), 128))
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
