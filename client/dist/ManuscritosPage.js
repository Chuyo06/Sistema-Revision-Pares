import { u as useEditorStore } from "./index4.js";
import { _ as _export_sfc, v as onMounted, k as createBlock, w as withCtx, g as resolveComponent, o as openBlock, b as createVNode, j as createTextVNode, a as createBaseVNode, d as unref, c as createElementBlock, F as Fragment, r as renderList, n as normalizeStyle, t as toDisplayString, e as createCommentVNode, h as ref, p as computed } from "./index.js";
import "./manuscritos.js";
import "./usuarios.js";
import "./revision.js";
const _hoisted_1 = { class: "d-flex align-start justify-space-between mb-2" };
const _hoisted_2 = { class: "text-h6 font-weight-bold text-brown-darken-4 line-height-1" };
const _hoisted_3 = { class: "text-caption text-medium-emphasis mt-1" };
const _hoisted_4 = { class: "d-flex align-center gap-4 mt-3" };
const _sfc_main = {
  __name: "ManuscritosPage",
  setup(__props) {
    const editorStore = useEditorStore();
    const busqueda = ref("");
    const filtroEstado = ref("TODOS");
    const filtros = [
      { label: "Todos los estados", value: "TODOS" },
      { label: "Enviado", value: "ENVIADO" },
      { label: "En revisión", value: "EN_REVISION" },
      { label: "Aceptado", value: "ACEPTADO" },
      { label: "Rechazado", value: "RECHAZADO" }
    ];
    const manuscritosFiltrados = computed(() => {
      if (!editorStore.manuscritos) return [];
      return editorStore.manuscritos.filter((m) => {
        const titulo = (m.titulo || "").toLowerCase();
        const autores = (m.autores || "").toLowerCase();
        const term = (busqueda.value || "").toLowerCase();
        const b = titulo.includes(term) || autores.includes(term);
        const e = filtroEstado.value === "TODOS" || m.estado === filtroEstado.value;
        return b && e;
      });
    });
    const ESTADOS = { ENVIADO: "Enviado", EN_REVISION: "En revisión", ACEPTADO: "Aceptado", RECHAZADO: "Rechazado" };
    const HEX = { ENVIADO: "#546e7a", EN_REVISION: "#e65100", ACEPTADO: "#558b2f", RECHAZADO: "#c62828" };
    const CHIPS = { ENVIADO: "info", EN_REVISION: "warning", ACEPTADO: "success", RECHAZADO: "error" };
    function estadoLabel(e) {
      return ESTADOS[e] ?? (e || "Desconocido");
    }
    function hexEstado(e) {
      return HEX[e] ?? "#9e9e9e";
    }
    function chipEstado(e) {
      return CHIPS[e] ?? "info";
    }
    onMounted(() => {
      editorStore.cargarDashboardEditor();
    });
    function decidir(id, decision) {
      editorStore.tomarDecision(id, decision);
    }
    return (_ctx, _cache) => {
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_card_item = resolveComponent("v-card-item");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_spacer = resolveComponent("v-spacer");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_container = resolveComponent("v-container");
      return openBlock(), createBlock(_component_v_container, { style: { "max-width": "900px", "padding": "20px" } }, {
        default: withCtx(() => [
          createVNode(_component_v_row, {
            align: "center",
            class: "mb-6"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_col, null, {
                default: withCtx(() => [
                  createVNode(_component_v_btn, {
                    variant: "text",
                    to: "/editor",
                    "prepend-icon": "mdi-arrow-left"
                  }, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode("Panel de Control", -1)
                    ])]),
                    _: 1
                  }),
                  _cache[3] || (_cache[3] = createBaseVNode("h1", { class: "text-h4 font-weight-bold mt-2" }, "Gestión de Manuscritos", -1))
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          unref(editorStore).cargando && (!unref(editorStore).manuscritos || unref(editorStore).manuscritos.length === 0) ? (openBlock(), createBlock(_component_v_row, {
            key: 0,
            justify: "center"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_col, {
                cols: "auto",
                class: "py-12 text-center"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_progress_circular, {
                    indeterminate: "",
                    color: "primary",
                    size: "64"
                  }),
                  _cache[4] || (_cache[4] = createBaseVNode("div", { class: "mt-4" }, "Sincronizando con microservicios...", -1))
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createVNode(_component_v_row, {
              class: "mb-4",
              align: "center"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_col, {
                  cols: "12",
                  md: "6"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_text_field, {
                      modelValue: busqueda.value,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => busqueda.value = $event),
                      "prepend-inner-icon": "mdi-magnify",
                      label: "Buscar por título o autor",
                      density: "compact",
                      "hide-details": "",
                      variant: "outlined",
                      clearable: ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_v_col, {
                  cols: "12",
                  md: "4"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_select, {
                      modelValue: filtroEstado.value,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filtroEstado.value = $event),
                      items: filtros,
                      label: "Estado",
                      "item-title": "label",
                      "item-value": "value",
                      density: "compact",
                      "hide-details": "",
                      variant: "outlined"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            manuscritosFiltrados.value.length > 0 ? (openBlock(), createBlock(_component_v_row, { key: 0 }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(manuscritosFiltrados.value, (m) => {
                  return openBlock(), createBlock(_component_v_col, {
                    key: m.id,
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card, {
                        border: "",
                        elevation: "1",
                        class: "mb-3 hover-elevation",
                        style: { "background": "#fdfbf5", "border-radius": "12px", "overflow": "hidden" }
                      }, {
                        default: withCtx(() => [
                          createBaseVNode("div", {
                            style: normalizeStyle(`height:6px; background:${hexEstado(m.estado)}`)
                          }, null, 4),
                          createVNode(_component_v_card_item, { class: "pa-4" }, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                createBaseVNode("div", _hoisted_1, [
                                  createBaseVNode("div", null, [
                                    createBaseVNode("div", _hoisted_2, toDisplayString(m.titulo || "Sin título"), 1),
                                    createBaseVNode("div", _hoisted_3, toDisplayString(m.autores || "Autor desconocido") + " · " + toDisplayString(m.convocatoria || "Sin convocatoria"), 1)
                                  ]),
                                  createVNode(_component_v_chip, {
                                    color: chipEstado(m.estado),
                                    label: "",
                                    size: "small",
                                    class: "font-weight-bold"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(estadoLabel(m.estado)), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["color"])
                                ]),
                                createBaseVNode("div", _hoisted_4, [
                                  createVNode(_component_v_chip, {
                                    size: "x-small",
                                    variant: "tonal",
                                    color: "brown",
                                    "prepend-icon": "mdi-account-multiple"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(m.revisionesCompletadas || 0) + "/" + toDisplayString(m.revisoresAsignados || 0) + " revisiones ", 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  ((_a = m.alertas) == null ? void 0 : _a.length) ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(m.alertas, (alerta, i) => {
                                    return openBlock(), createBlock(_component_v_chip, {
                                      key: i,
                                      size: "x-small",
                                      color: "error",
                                      variant: "flat",
                                      "prepend-icon": "mdi-alert-circle"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(alerta), 1)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128)) : createCommentVNode("", true)
                                ])
                              ];
                            }),
                            _: 2
                          }, 1024),
                          createVNode(_component_v_divider),
                          createVNode(_component_v_card_actions, { class: "pa-4" }, {
                            default: withCtx(() => [
                              createVNode(_component_v_btn, {
                                color: "primary",
                                variant: "flat",
                                to: `/editor/asignacion/${m.id}`,
                                "prepend-icon": "mdi-account-plus",
                                class: "text-none"
                              }, {
                                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                                  createTextVNode(" Gestionar Revisores ", -1)
                                ])]),
                                _: 1
                              }, 8, ["to"]),
                              createVNode(_component_v_spacer),
                              m.estado === "EN_REVISION" && (m.revisionesCompletadas || 0) >= 2 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                                createVNode(_component_v_btn, {
                                  size: "small",
                                  color: "success",
                                  variant: "tonal",
                                  class: "text-none mr-2",
                                  onClick: ($event) => decidir(m.id, "ACEPTADO")
                                }, {
                                  default: withCtx(() => [..._cache[6] || (_cache[6] = [
                                    createTextVNode("Aceptar", -1)
                                  ])]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(_component_v_btn, {
                                  size: "small",
                                  color: "error",
                                  variant: "tonal",
                                  class: "text-none",
                                  onClick: ($event) => decidir(m.id, "RECHAZADO")
                                }, {
                                  default: withCtx(() => [..._cache[7] || (_cache[7] = [
                                    createTextVNode("Rechazar", -1)
                                  ])]),
                                  _: 1
                                }, 8, ["onClick"])
                              ], 64)) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            })) : (openBlock(), createBlock(_component_v_row, {
              key: 1,
              justify: "center",
              class: "py-12"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_col, {
                  cols: "auto",
                  class: "text-center"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_icon, {
                      size: "64",
                      color: "brown-lighten-3",
                      class: "mb-4"
                    }, {
                      default: withCtx(() => [..._cache[8] || (_cache[8] = [
                        createTextVNode("mdi-file-search-outline", -1)
                      ])]),
                      _: 1
                    }),
                    _cache[9] || (_cache[9] = createBaseVNode("p", { class: "text-h6 text-brown-lighten-1" }, "No se encontraron manuscritos", -1)),
                    _cache[10] || (_cache[10] = createBaseVNode("p", { class: "text-body-2 text-medium-emphasis" }, "Intenta ajustar los filtros de búsqueda", -1))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          ], 64))
        ]),
        _: 1
      });
    };
  }
};
const ManuscritosPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a8add5ca"]]);
export {
  ManuscritosPage as default
};
