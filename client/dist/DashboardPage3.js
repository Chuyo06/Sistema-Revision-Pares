import { u as useAuthStore, v as onMounted, c as createElementBlock, a as createBaseVNode, b as createVNode, w as withCtx, t as toDisplayString, d as unref, e as createCommentVNode, F as Fragment, r as renderList, g as resolveComponent, p as computed, o as openBlock, j as createTextVNode, n as normalizeStyle } from "./index.js";
import { u as useEditorStore } from "./index4.js";
import "./manuscritos.js";
import "./usuarios.js";
import "./revision.js";
const _hoisted_1 = { style: { "background": "linear-gradient(135deg,#bf360c 0%,#e65100 100%)", "padding": "32px 28px 24px", "position": "relative", "overflow": "hidden" } };
const _hoisted_2 = { style: { "font-size": "14px", "color": "rgba(255,255,255,0.75)" } };
const _hoisted_3 = {
  key: 0,
  style: { "margin": "16px 20px 0" }
};
const _hoisted_4 = { style: { "background": "#fff3e0", "border": "1px solid #ffcc80", "border-radius": "10px", "padding": "12px 16px", "display": "flex", "align-items": "center", "gap": "10px" } };
const _hoisted_5 = { style: { "font-size": "13px", "color": "#e65100", "flex": "1" } };
const _hoisted_6 = { style: { "display": "grid", "grid-template-columns": "1fr 300px", "gap": "20px", "padding": "20px", "max-width": "1100px" } };
const _hoisted_7 = { style: { "padding": "14px 16px", "display": "flex", "align-items": "flex-start", "gap": "12px" } };
const _hoisted_8 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_9 = { style: { "font-size": "14px", "font-weight": "600", "color": "#3e2723", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" } };
const _hoisted_10 = { style: { "font-size": "12px", "color": "#8d6e63", "margin-top": "2px" } };
const _hoisted_11 = { style: { "display": "flex", "flex-direction": "column", "align-items": "flex-end", "gap": "4px", "flex-shrink": "0" } };
const _hoisted_12 = { style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "overflow": "hidden" } };
const _hoisted_13 = { style: { "font-size": "13px", "color": "#5d4037" } };
const _hoisted_14 = { style: { "font-size": "18px", "font-weight": "700", "color": "#3e2723" } };
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const auth = useAuthStore();
    const editorStore = useEditorStore();
    onMounted(() => {
      editorStore.cargarDashboardEditor();
    });
    const stats = computed(() => [
      { label: "Total", valor: editorStore.metricas.totalManuscritos },
      { label: "En revisión", valor: editorStore.metricas.enRevision },
      { label: "Aceptados", valor: editorStore.metricas.aceptados },
      { label: "Tasa aceptación", valor: editorStore.metricas.tasaAceptacion + "%" }
    ]);
    const ESTADOS = { ENVIADO: "Enviado", EN_REVISION: "En revisión", ACEPTADO: "Aceptado", RECHAZADO: "Rechazado" };
    const COLORES = { ENVIADO: "#546e7a", EN_REVISION: "#e65100", ACEPTADO: "#558b2f", RECHAZADO: "#c62828" };
    const CHIP_COL = { ENVIADO: "info", EN_REVISION: "warning", ACEPTADO: "success", RECHAZADO: "error" };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    function colorEstado(e) {
      return COLORES[e] ?? "#9e9e9e";
    }
    function chipColor(e) {
      return CHIP_COL[e] ?? "secondary";
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
              createTextVNode(" mdi-pencil-ruler ", -1)
            ])]),
            _: 1
          }),
          _cache[2] || (_cache[2] = createBaseVNode("div", { style: { "color": "rgba(255,255,255,0.7)", "font-size": "12px", "text-transform": "uppercase", "letter-spacing": "0.08em", "margin-bottom": "4px" } }, "Editor", -1)),
          _cache[3] || (_cache[3] = createBaseVNode("div", { style: { "font-size": "22px", "font-weight": "700", "color": "#fff", "margin-bottom": "4px" } }, "Panel Editorial", -1)),
          createBaseVNode("div", _hoisted_2, "Bienvenido, " + toDisplayString((_a = unref(auth).usuario) == null ? void 0 : _a.nombre), 1),
          createVNode(_component_v_btn, {
            color: "white",
            class: "mt-4",
            style: { "color": "#bf360c" },
            "prepend-icon": "mdi-file-document-multiple-outline",
            rounded: "xl",
            elevation: "0",
            to: "/editor/manuscritos"
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" Ver manuscritos ", -1)
            ])]),
            _: 1
          })
        ]),
        unref(editorStore).metricas.alertasPendientes > 0 ? (openBlock(), createElementBlock("div", _hoisted_3, [
          createBaseVNode("div", _hoisted_4, [
            createVNode(_component_v_icon, {
              color: "warning",
              size: "20"
            }, {
              default: withCtx(() => [..._cache[4] || (_cache[4] = [
                createTextVNode("mdi-alert-outline", -1)
              ])]),
              _: 1
            }),
            createBaseVNode("span", _hoisted_5, toDisplayString(unref(editorStore).metricas.alertasPendientes) + " manuscrito(s) requieren atención ", 1),
            createVNode(_component_v_btn, {
              size: "small",
              color: "warning",
              variant: "text",
              to: "/editor/manuscritos"
            }, {
              default: withCtx(() => [..._cache[5] || (_cache[5] = [
                createTextVNode("Revisar", -1)
              ])]),
              _: 1
            })
          ])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("div", null, [
            _cache[8] || (_cache[8] = createBaseVNode("div", { style: { "font-size": "13px", "font-weight": "700", "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em", "margin-bottom": "10px" } }, " Manuscritos recientes ", -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(editorStore).manuscritos.slice(0, 6), (m) => {
              return openBlock(), createElementBlock("div", {
                key: m.id,
                style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "margin-bottom": "10px", "overflow": "hidden" }
              }, [
                createBaseVNode("div", {
                  style: normalizeStyle(`height:5px; background:${colorEstado(m.estado)}`)
                }, null, 4),
                createBaseVNode("div", _hoisted_7, [
                  createBaseVNode("div", {
                    style: normalizeStyle(`background:${colorEstado(m.estado)}22; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px`)
                  }, [
                    createVNode(_component_v_icon, {
                      color: colorEstado(m.estado),
                      size: "18"
                    }, {
                      default: withCtx(() => [..._cache[6] || (_cache[6] = [
                        createTextVNode("mdi-file-document-outline", -1)
                      ])]),
                      _: 1
                    }, 8, ["color"])
                  ], 4),
                  createBaseVNode("div", _hoisted_8, [
                    createBaseVNode("div", _hoisted_9, toDisplayString(m.titulo), 1),
                    createBaseVNode("div", _hoisted_10, toDisplayString(m.convocatoria) + " · " + toDisplayString(m.revisionesCompletadas) + "/" + toDisplayString(m.revisoresAsignados) + " revisiones ", 1)
                  ]),
                  createBaseVNode("div", _hoisted_11, [
                    createVNode(_component_v_chip, {
                      color: chipColor(m.estado),
                      label: "",
                      size: "x-small"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(estadoLabel(m.estado)), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    createVNode(_component_v_btn, {
                      size: "x-small",
                      variant: "text",
                      color: "primary",
                      to: `/editor/asignacion/${m.id}`
                    }, {
                      default: withCtx(() => [..._cache[7] || (_cache[7] = [
                        createTextVNode(" Ver ", -1)
                      ])]),
                      _: 1
                    }, 8, ["to"])
                  ])
                ])
              ]);
            }), 128))
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_12, [
              _cache[9] || (_cache[9] = createBaseVNode("div", { style: { "background": "#e65100", "padding": "10px 14px" } }, [
                createBaseVNode("span", { style: { "font-size": "13px", "font-weight": "600", "color": "#fff" } }, "Resumen editorial")
              ], -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (stat) => {
                return openBlock(), createElementBlock("div", {
                  key: stat.label,
                  style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "10px 14px", "border-top": "1px solid #f0e9df" }
                }, [
                  createBaseVNode("span", _hoisted_13, toDisplayString(stat.label), 1),
                  createBaseVNode("span", _hoisted_14, toDisplayString(stat.valor), 1)
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
