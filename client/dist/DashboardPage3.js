import { u as useAuthStore, i as createElementBlock, h as createBaseVNode, t as toDisplayString, e as unref, c as createBlock, w as withCtx, f as createCommentVNode, b as createVNode, r as resolveComponent, o as openBlock, d as createTextVNode } from "./index.js";
import { u as useEditorStore } from "./index4.js";
const _hoisted_1 = { class: "text-body-2 mb-4" };
const _hoisted_2 = { class: "text-h4" };
const _hoisted_3 = { class: "text-h4" };
const _hoisted_4 = { class: "text-h4" };
const _hoisted_5 = { class: "text-h4" };
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const auth = useAuthStore();
    const editorStore = useEditorStore();
    const headers = [
      { title: "Título", key: "titulo", sortable: true },
      { title: "Convocatoria", key: "convocatoria", sortable: true },
      { title: "Estado", key: "estado", sortable: true },
      { title: "Progreso", key: "progreso", sortable: false },
      { title: "", key: "acciones", sortable: false, align: "end" }
    ];
    const ESTADOS = {
      ENVIADO: "Enviado",
      EN_REVISION: "En revisión",
      ACEPTADO: "Aceptado",
      RECHAZADO: "Rechazado"
    };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    return (_ctx, _cache) => {
      var _a;
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_data_table = resolveComponent("v-data-table");
      return openBlock(), createElementBlock("div", null, [
        _cache[7] || (_cache[7] = createBaseVNode("h1", { class: "text-h6 mb-1" }, "Panel Editorial", -1)),
        createBaseVNode("p", _hoisted_1, "Bienvenido, " + toDisplayString((_a = unref(auth).usuario) == null ? void 0 : _a.nombre) + ".", 1),
        unref(editorStore).metricas.alertasPendientes > 0 ? (openBlock(), createBlock(_component_v_alert, {
          key: 0,
          type: "warning",
          class: "mb-4"
        }, {
          default: withCtx(() => [
            createTextVNode(" Tienes " + toDisplayString(unref(editorStore).metricas.alertasPendientes) + " alerta(s) pendientes. ", 1),
            createVNode(_component_v_btn, {
              variant: "text",
              size: "small",
              to: "/editor/manuscritos"
            }, {
              default: withCtx(() => [..._cache[0] || (_cache[0] = [
                createTextVNode("Ver manuscritos", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : createCommentVNode("", true),
        createVNode(_component_v_row, { class: "mb-4" }, {
          default: withCtx(() => [
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_2, toDisplayString(unref(editorStore).metricas.totalManuscritos), 1),
                        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "text-caption" }, "Total", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_3, toDisplayString(unref(editorStore).metricas.enRevision), 1),
                        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "text-caption" }, "En revisión", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_4, toDisplayString(unref(editorStore).metricas.aceptados), 1),
                        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "text-caption" }, "Aceptados", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_5, toDisplayString(unref(editorStore).metricas.tasaAceptacion) + "%", 1),
                        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "text-caption" }, "Tasa aceptación", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        createVNode(_component_v_card, null, {
          default: withCtx(() => [
            createVNode(_component_v_card_title, null, {
              default: withCtx(() => [..._cache[5] || (_cache[5] = [
                createTextVNode("Manuscritos recientes", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_data_table, {
              headers,
              items: unref(editorStore).manuscritos,
              "items-per-page": 5
            }, {
              "item.estado": withCtx(({ item }) => [
                createTextVNode(toDisplayString(estadoLabel(item.estado)), 1)
              ]),
              "item.progreso": withCtx(({ item }) => [
                createTextVNode(toDisplayString(item.revisionesCompletadas) + "/" + toDisplayString(item.revisoresAsignados), 1)
              ]),
              "item.acciones": withCtx(({ item }) => [
                createVNode(_component_v_btn, {
                  size: "small",
                  variant: "text",
                  to: `/editor/asignacion/${item.id}`
                }, {
                  default: withCtx(() => [..._cache[6] || (_cache[6] = [
                    createTextVNode("Ver", -1)
                  ])]),
                  _: 1
                }, 8, ["to"])
              ]),
              _: 1
            }, 8, ["items"])
          ]),
          _: 1
        })
      ]);
    };
  }
};
export {
  _sfc_main as default
};
