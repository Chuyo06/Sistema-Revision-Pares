import { u as useRevisorStore } from "./index3.js";
import { v as onMounted, c as createElementBlock, a as createBaseVNode, F as Fragment, r as renderList, d as unref, b as createVNode, w as withCtx, e as createCommentVNode, g as resolveComponent, o as openBlock, n as normalizeStyle, t as toDisplayString, j as createTextVNode, k as createBlock } from "./index.js";
import "./revision.js";
import "./manuscritos.js";
const _hoisted_1 = { style: { "max-width": "800px", "padding": "20px" } };
const _hoisted_2 = { style: { "padding": "16px" } };
const _hoisted_3 = { style: { "display": "flex", "align-items": "flex-start", "gap": "10px", "margin-bottom": "8px" } };
const _hoisted_4 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_5 = { style: { "font-size": "15px", "font-weight": "600", "color": "#3e2723", "word-break": "break-word" } };
const _hoisted_6 = { style: { "display": "flex", "flex-wrap": "wrap", "gap": "12px", "margin-bottom": "10px" } };
const _hoisted_7 = { style: { "font-size": "12px", "color": "#8d6e63", "display": "flex", "align-items": "center", "gap": "4px" } };
const _hoisted_8 = { style: { "font-size": "12px", "color": "#5d4037", "display": "flex", "align-items": "center", "gap": "4px" } };
const _hoisted_9 = { style: { "font-size": "12px", "color": "#c62828", "display": "flex", "align-items": "center", "gap": "4px" } };
const _hoisted_10 = { style: { "border-top": "1px solid #f0e9df", "padding-top": "10px" } };
const _hoisted_11 = {
  key: 1,
  style: { "display": "flex", "align-items": "center", "gap": "6px" }
};
const _hoisted_12 = {
  key: 0,
  style: { "text-align": "center", "padding": "48px 0", "color": "#8d6e63" }
};
const _sfc_main = {
  __name: "AsignadosPage",
  setup(__props) {
    const revisorStore = useRevisorStore();
    onMounted(() => {
      revisorStore.cargarDashboard();
    });
    const ESTADOS = { PENDIENTE: "Pendiente", EN_PROGRESO: "En progreso", COMPLETADA: "Completada" };
    const HEX = { PENDIENTE: "#e65100", EN_PROGRESO: "#546e7a", COMPLETADA: "#558b2f" };
    const CHIPS = { PENDIENTE: "warning", EN_PROGRESO: "info", COMPLETADA: "success" };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    function hexEstado(e) {
      return HEX[e] ?? "#9e9e9e";
    }
    function chipEstado(e) {
      return CHIPS[e] ?? "secondary";
    }
    return (_ctx, _cache) => {
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_btn = resolveComponent("v-btn");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[7] || (_cache[7] = createBaseVNode("div", { style: { "font-size": "13px", "font-weight": "700", "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em", "margin-bottom": "14px" } }, " Artículos asignados para revisión ", -1)),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(revisorStore).articulosAsignados, (a) => {
          return openBlock(), createElementBlock("div", {
            key: a.id,
            style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "margin-bottom": "12px", "overflow": "hidden" }
          }, [
            createBaseVNode("div", {
              style: normalizeStyle(`height:6px; background:${hexEstado(a.estado)}`)
            }, null, 4),
            createBaseVNode("div", _hoisted_2, [
              createBaseVNode("div", _hoisted_3, [
                createBaseVNode("div", _hoisted_4, [
                  createBaseVNode("div", _hoisted_5, toDisplayString(a.titulo), 1)
                ]),
                createVNode(_component_v_chip, {
                  color: chipEstado(a.estado),
                  label: "",
                  size: "small",
                  style: { "flex-shrink": "0" }
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(estadoLabel(a.estado)), 1)
                  ]),
                  _: 2
                }, 1032, ["color"])
              ]),
              createBaseVNode("div", _hoisted_6, [
                createBaseVNode("span", _hoisted_7, [
                  createVNode(_component_v_icon, { size: "13" }, {
                    default: withCtx(() => [..._cache[0] || (_cache[0] = [
                      createTextVNode("mdi-account-outline", -1)
                    ])]),
                    _: 1
                  }),
                  createTextVNode(toDisplayString(a.autores), 1)
                ]),
                createBaseVNode("span", _hoisted_8, [
                  createVNode(_component_v_icon, { size: "13" }, {
                    default: withCtx(() => [..._cache[1] || (_cache[1] = [
                      createTextVNode("mdi-tag-outline", -1)
                    ])]),
                    _: 1
                  }),
                  createTextVNode(toDisplayString(a.convocatoria), 1)
                ]),
                createBaseVNode("span", _hoisted_9, [
                  createVNode(_component_v_icon, { size: "13" }, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode("mdi-calendar-clock", -1)
                    ])]),
                    _: 1
                  }),
                  createTextVNode("Deadline: " + toDisplayString(a.deadline), 1)
                ])
              ]),
              createBaseVNode("div", _hoisted_10, [
                a.estado !== "COMPLETADA" ? (openBlock(), createBlock(_component_v_btn, {
                  key: 0,
                  color: "primary",
                  size: "small",
                  rounded: "lg",
                  elevation: "0",
                  to: `/revisor/revision/${a.id}`,
                  "prepend-icon": "mdi-pencil-outline"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(a.estado === "EN_PROGRESO" ? "Continuar revisión" : "Iniciar revisión"), 1)
                  ]),
                  _: 2
                }, 1032, ["to"])) : (openBlock(), createElementBlock("div", _hoisted_11, [
                  createVNode(_component_v_icon, {
                    color: "success",
                    size: "16"
                  }, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createTextVNode("mdi-check-circle", -1)
                    ])]),
                    _: 1
                  }),
                  _cache[4] || (_cache[4] = createBaseVNode("span", { style: { "font-size": "13px", "color": "#558b2f" } }, "Revisión enviada", -1))
                ]))
              ])
            ])
          ]);
        }), 128)),
        unref(revisorStore).articulosAsignados.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_12, [
          createVNode(_component_v_icon, {
            size: "44",
            color: "secondary"
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createTextVNode("mdi-clipboard-text-off-outline", -1)
            ])]),
            _: 1
          }),
          _cache[6] || (_cache[6] = createBaseVNode("p", { style: { "font-size": "14px", "margin-top": "10px" } }, "No tienes artículos asignados.", -1))
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
export {
  _sfc_main as default
};
