import { _ as _export_sfc, v as onMounted, k as createBlock, w as withCtx, s as useRoute, g as resolveComponent, o as openBlock, b as createVNode, j as createTextVNode, d as unref, a as createBaseVNode, t as toDisplayString, c as createElementBlock, F as Fragment, r as renderList, e as createCommentVNode, z as normalizeClass, p as computed, h as ref } from "./index.js";
import { u as useEditorStore } from "./index4.js";
import "./manuscritos.js";
import "./usuarios.js";
import "./revision.js";
const _hoisted_1 = { class: "d-flex justify-space-between align-start" };
const _hoisted_2 = { class: "text-h4 font-weight-bold text-brown-darken-4 mb-2" };
const _hoisted_3 = { class: "text-h6 text-brown-lighten-1 mb-4" };
const _hoisted_4 = {
  key: 0,
  class: "d-flex align-center mb-1"
};
const _hoisted_5 = { class: "ml-2 font-weight-bold text-brown" };
const _hoisted_6 = {
  key: 1,
  class: "bg-brown-lighten-5 pa-3 rounded-lg border text-italic mt-2",
  style: { "white-space": "normal", "color": "#3e2723" }
};
const _hoisted_7 = {
  key: 2,
  class: "text-caption text-grey"
};
const _hoisted_8 = {
  key: 1,
  class: "pa-8 text-center text-grey-darken-1"
};
const _hoisted_9 = { class: "d-flex gap-4 mt-6" };
const _hoisted_10 = { class: "d-flex justify-space-between align-center mb-2" };
const _hoisted_11 = { class: "font-weight-bold text-brown" };
const _hoisted_12 = { class: "text-caption text-grey-darken-1 mb-3 line-height-1" };
const _hoisted_13 = { class: "text-h6 mt-4" };
const _sfc_main = {
  __name: "AsignacionPage",
  setup(__props) {
    const route = useRoute();
    const editorStore = useEditorStore();
    const snackbar = ref(false);
    const manuscritoId = Number(route.params.id);
    const manuscrito = computed(() => (editorStore.manuscritos || []).find((m) => String(m.id) === String(manuscritoId)));
    const asignacionesDelArticulo = computed(() => {
      if (!editorStore.asignaciones) return [];
      return editorStore.asignaciones.filter((a) => String(a.id_manuscrito_mongo) === String(manuscritoId));
    });
    const asignacionesCompletadas = computed(
      () => asignacionesDelArticulo.value.filter((a) => a.estado === "COMPLETADA")
    );
    onMounted(() => {
      editorStore.cargarDashboardEditor();
    });
    function revisorAsignado(id) {
      if (!editorStore.asignaciones) return false;
      return editorStore.asignaciones.some(
        (a) => String(a.id_revisor) === String(id) && String(a.id_manuscrito_mongo) === String(manuscritoId)
      );
    }
    async function asignar(revisorId) {
      const exito = await editorStore.asignarRevisor(manuscritoId, revisorId);
      if (exito) snackbar.value = true;
    }
    async function decidir(decision) {
      await editorStore.tomarDecision(manuscritoId, decision);
    }
    const ESTADOS = {
      ENVIADO: "Enviado",
      EN_REVISION: "En revisión",
      ACEPTADO: "Aceptado",
      RECHAZADO: "Rechazado"
    };
    function estadoLabel(e) {
      return ESTADOS[e] ?? (e || "Desconocido");
    }
    function chipColor(e) {
      if (e === "ACEPTADO") return "success";
      if (e === "RECHAZADO") return "error";
      if (e === "EN_REVISION") return "warning";
      return "info";
    }
    return (_ctx, _cache) => {
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_card_item = resolveComponent("v-card-item");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_avatar = resolveComponent("v-avatar");
      const _component_v_list_item_title = resolveComponent("v-list-item-title");
      const _component_v_rating = resolveComponent("v-rating");
      const _component_v_list_item_subtitle = resolveComponent("v-list-item-subtitle");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_snackbar = resolveComponent("v-snackbar");
      const _component_v_container = resolveComponent("v-container");
      return openBlock(), createBlock(_component_v_container, {
        fluid: "",
        style: { "background": "#f5f0e8", "min-height": "100%", "padding": "24px" }
      }, {
        default: withCtx(() => [
          createVNode(_component_v_btn, {
            variant: "text",
            to: "/editor/manuscritos",
            "prepend-icon": "mdi-arrow-left",
            class: "mb-6 text-none"
          }, {
            default: withCtx(() => [..._cache[3] || (_cache[3] = [
              createTextVNode(" Volver a Manuscritos ", -1)
            ])]),
            _: 1
          }),
          unref(editorStore).cargando && !manuscrito.value ? (openBlock(), createBlock(_component_v_row, {
            key: 0,
            justify: "center"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_col, {
                cols: "auto",
                class: "text-center py-12"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_progress_circular, {
                    indeterminate: "",
                    color: "primary",
                    size: "64"
                  }),
                  _cache[4] || (_cache[4] = createBaseVNode("div", { class: "mt-4 text-h6 text-brown-lighten-1" }, "Cargando dashboard...", -1))
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : manuscrito.value ? (openBlock(), createBlock(_component_v_row, { key: 1 }, {
            default: withCtx(() => [
              createVNode(_component_v_col, {
                cols: "12",
                md: "8"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_card, {
                    class: "mb-6 overflow-hidden",
                    elevation: "3",
                    rounded: "xl",
                    border: ""
                  }, {
                    default: withCtx(() => [
                      _cache[5] || (_cache[5] = createBaseVNode("div", { style: { "height": "8px", "background": "linear-gradient(90deg, #5d4037, #8d6e63)" } }, null, -1)),
                      createVNode(_component_v_card_item, { class: "pa-6" }, {
                        default: withCtx(() => [
                          createBaseVNode("div", _hoisted_1, [
                            createBaseVNode("div", null, [
                              createBaseVNode("div", _hoisted_2, toDisplayString(manuscrito.value.titulo), 1),
                              createBaseVNode("div", _hoisted_3, toDisplayString(manuscrito.value.autores), 1),
                              createVNode(_component_v_chip, {
                                color: chipColor(manuscrito.value.estado),
                                size: "small",
                                class: "font-weight-bold px-4",
                                label: ""
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(estadoLabel(manuscrito.value.estado).toUpperCase()), 1)
                                ]),
                                _: 1
                              }, 8, ["color"])
                            ])
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_v_card, {
                    class: "mb-6",
                    elevation: "2",
                    rounded: "lg",
                    border: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card_title, { class: "pa-4 d-flex align-center" }, {
                        default: withCtx(() => [
                          createVNode(_component_v_icon, {
                            color: "brown",
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [..._cache[6] || (_cache[6] = [
                              createTextVNode("mdi-account-check", -1)
                            ])]),
                            _: 1
                          }),
                          _cache[7] || (_cache[7] = createTextVNode(" Estado de las Revisiones ", -1))
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_divider),
                      createVNode(_component_v_card_text, { class: "pa-0" }, {
                        default: withCtx(() => [
                          asignacionesDelArticulo.value.length > 0 ? (openBlock(), createBlock(_component_v_list, {
                            key: 0,
                            lines: "three",
                            class: "bg-transparent"
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createElementBlock(Fragment, null, renderList(asignacionesDelArticulo.value, (asig, index) => {
                                return openBlock(), createBlock(_component_v_list_item, {
                                  key: asig.id_asignacion || index,
                                  class: "pa-4 border-bottom"
                                }, {
                                  prepend: withCtx(() => [
                                    createVNode(_component_v_avatar, {
                                      color: asig.estado === "COMPLETADA" ? "success" : "warning",
                                      size: "48"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_icon, { color: "white" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(asig.estado === "COMPLETADA" ? "mdi-check-decagram" : "mdi-clock-fast"), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["color"])
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(_component_v_list_item_title, { class: "text-h6 font-weight-bold" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Revisor #" + toDisplayString(asig.id_revisor) + " ", 1),
                                        createVNode(_component_v_chip, {
                                          size: "x-small",
                                          variant: "tonal",
                                          class: "ml-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(asig.estado), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_v_list_item_subtitle, { class: "mt-1" }, {
                                      default: withCtx(() => [
                                        asig.puntuacion ? (openBlock(), createElementBlock("div", _hoisted_4, [
                                          createVNode(_component_v_rating, {
                                            "model-value": asig.puntuacion,
                                            color: "amber",
                                            density: "compact",
                                            size: "small",
                                            readonly: ""
                                          }, null, 8, ["model-value"]),
                                          createBaseVNode("span", _hoisted_5, toDisplayString(asig.puntuacion) + "/5", 1)
                                        ])) : createCommentVNode("", true),
                                        asig.comentarios ? (openBlock(), createElementBlock("div", _hoisted_6, ' "' + toDisplayString(asig.comentarios) + '" ', 1)) : asig.estado !== "COMPLETADA" ? (openBlock(), createElementBlock("div", _hoisted_7, "Esperando respuesta del revisor...")) : createCommentVNode("", true)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          })) : (openBlock(), createElementBlock("div", _hoisted_8, [
                            createVNode(_component_v_icon, {
                              size: "48",
                              class: "mb-2 opacity-20"
                            }, {
                              default: withCtx(() => [..._cache[8] || (_cache[8] = [
                                createTextVNode("mdi-account-question-outline", -1)
                              ])]),
                              _: 1
                            }),
                            _cache[9] || (_cache[9] = createBaseVNode("div", null, "No hay revisores asignados todavía.", -1))
                          ]))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  asignacionesCompletadas.value.length > 0 ? (openBlock(), createBlock(_component_v_card, {
                    key: 0,
                    class: "mb-6 elevation-10",
                    rounded: "xl",
                    color: "brown-darken-4",
                    theme: "dark"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card_item, { class: "pa-6" }, {
                        default: withCtx(() => [
                          createVNode(_component_v_card_title, { class: "text-h5 font-weight-bold d-flex align-center" }, {
                            default: withCtx(() => [
                              createVNode(_component_v_icon, {
                                class: "mr-3",
                                color: "amber"
                              }, {
                                default: withCtx(() => [..._cache[10] || (_cache[10] = [
                                  createTextVNode("mdi-gavel", -1)
                                ])]),
                                _: 1
                              }),
                              _cache[11] || (_cache[11] = createTextVNode(" Decisión Editorial ", -1))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_card_subtitle, { class: "mt-1 opacity-70" }, {
                            default: withCtx(() => [
                              createTextVNode(" Basado en " + toDisplayString(asignacionesCompletadas.value.length) + " revisiones recibidas ", 1)
                            ]),
                            _: 1
                          }),
                          createBaseVNode("div", _hoisted_9, [
                            createVNode(_component_v_btn, {
                              color: "success",
                              size: "large",
                              variant: "elevated",
                              onClick: _cache[0] || (_cache[0] = ($event) => decidir("ACEPTADO")),
                              class: "flex-grow-1 text-none font-weight-bold",
                              "prepend-icon": "mdi-check-circle"
                            }, {
                              default: withCtx(() => [..._cache[12] || (_cache[12] = [
                                createTextVNode(" Aceptar Manuscrito ", -1)
                              ])]),
                              _: 1
                            }),
                            createVNode(_component_v_btn, {
                              color: "error",
                              size: "large",
                              variant: "elevated",
                              onClick: _cache[1] || (_cache[1] = ($event) => decidir("RECHAZADO")),
                              class: "flex-grow-1 text-none font-weight-bold",
                              "prepend-icon": "mdi-close-circle"
                            }, {
                              default: withCtx(() => [..._cache[13] || (_cache[13] = [
                                createTextVNode(" Rechazar ", -1)
                              ])]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(_component_v_col, {
                cols: "12",
                md: "4"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_card, {
                    title: "Revisores Disponibles",
                    border: "",
                    rounded: "lg",
                    elevation: "1",
                    class: "sticky-card"
                  }, {
                    append: withCtx(() => [
                      createVNode(_component_v_icon, { color: "primary" }, {
                        default: withCtx(() => [..._cache[14] || (_cache[14] = [
                          createTextVNode("mdi-account-search", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(_component_v_card_text, { class: "pa-2" }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(editorStore).revisoresDisponibles || [], (revisor) => {
                            return openBlock(), createElementBlock("div", {
                              key: revisor.id,
                              class: normalizeClass(["revisor-card ma-2 pa-4 border rounded-lg transition-swing", revisorAsignado(revisor.id) ? "bg-grey-lighten-4 opacity-70" : "bg-white"])
                            }, [
                              createBaseVNode("div", _hoisted_10, [
                                createBaseVNode("div", _hoisted_11, toDisplayString(revisor.nombre), 1),
                                createVNode(_component_v_chip, {
                                  size: "x-small",
                                  color: "success",
                                  variant: "flat"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(revisor.matching) + "% match", 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              createBaseVNode("div", _hoisted_12, toDisplayString(revisor.institucion), 1),
                              createVNode(_component_v_btn, {
                                block: "",
                                size: "small",
                                color: revisorAsignado(revisor.id) ? "grey" : "primary",
                                variant: revisorAsignado(revisor.id) ? "text" : "flat",
                                onClick: ($event) => asignar(revisor.id),
                                disabled: revisorAsignado(revisor.id),
                                class: "text-none"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(revisorAsignado(revisor.id) ? "Ya asignado" : "Invitar a Revisar"), 1)
                                ]),
                                _: 2
                              }, 1032, ["color", "variant", "onClick", "disabled"])
                            ], 2);
                          }), 128))
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
          })) : (openBlock(), createBlock(_component_v_row, {
            key: 2,
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
                    color: "error"
                  }, {
                    default: withCtx(() => [..._cache[15] || (_cache[15] = [
                      createTextVNode("mdi-alert", -1)
                    ])]),
                    _: 1
                  }),
                  createBaseVNode("div", _hoisted_13, "Manuscrito " + toDisplayString(unref(manuscritoId)) + " no encontrado", 1),
                  createVNode(_component_v_btn, {
                    to: "/editor/manuscritos",
                    color: "primary",
                    class: "mt-4"
                  }, {
                    default: withCtx(() => [..._cache[16] || (_cache[16] = [
                      createTextVNode("Ir a la lista", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })),
          createVNode(_component_v_snackbar, {
            modelValue: snackbar.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => snackbar.value = $event),
            timeout: "3000",
            color: "success",
            location: "top right"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_icon, { start: "" }, {
                default: withCtx(() => [..._cache[17] || (_cache[17] = [
                  createTextVNode("mdi-check-circle", -1)
                ])]),
                _: 1
              }),
              _cache[18] || (_cache[18] = createTextVNode(" Operación completada con éxito ", -1))
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        _: 1
      });
    };
  }
};
const AsignacionPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8f71c787"]]);
export {
  AsignacionPage as default
};
