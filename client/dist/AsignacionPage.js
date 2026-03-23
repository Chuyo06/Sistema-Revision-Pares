import { i as createElementBlock, b as createVNode, w as withCtx, e as unref, c as createBlock, f as createCommentVNode, l as useRoute, r as resolveComponent, k as ref, o as openBlock, d as createTextVNode, t as toDisplayString, F as Fragment, j as renderList, h as createBaseVNode } from "./index.js";
import { u as useEditorStore } from "./index4.js";
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { class: "d-flex gap-3" };
const _hoisted_3 = {
  key: 1,
  class: "text-body-2"
};
const _sfc_main = {
  __name: "AsignacionPage",
  setup(__props) {
    const route = useRoute();
    const editorStore = useEditorStore();
    const snackbar = ref(false);
    const manuscritoId = Number(route.params.id);
    const manuscrito = editorStore.manuscritos.find((m) => m.id === manuscritoId);
    const asignados = ref([]);
    function revisorAsignado(id) {
      return asignados.value.includes(id);
    }
    function asignar(revisorId) {
      asignados.value.push(revisorId);
      editorStore.asignarRevisor(manuscritoId, revisorId);
      snackbar.value = true;
    }
    function decidir(decision) {
      editorStore.tomarDecision(manuscritoId, decision === "REVISION_MENOR" ? "EN_REVISION" : decision);
    }
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
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_snackbar = resolveComponent("v-snackbar");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_btn, {
          variant: "text",
          to: "/editor/manuscritos",
          class: "mb-4"
        }, {
          default: withCtx(() => [..._cache[4] || (_cache[4] = [
            createTextVNode("← Volver", -1)
          ])]),
          _: 1
        }),
        unref(manuscrito) ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(_component_v_card, { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(manuscrito).titulo), 1)
                ]),
                _: 1
              }),
              createVNode(_component_v_card_subtitle, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(manuscrito).autores) + " · " + toDisplayString(unref(manuscrito).convocatoria) + " — " + toDisplayString(estadoLabel(unref(manuscrito).estado)), 1)
                ]),
                _: 1
              }),
              unref(manuscrito).alertas.length ? (openBlock(), createBlock(_component_v_card_text, { key: 0 }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(manuscrito).alertas, (a, i) => {
                    return openBlock(), createElementBlock("p", {
                      key: i,
                      class: "text-caption"
                    }, "⚠ " + toDisplayString(a), 1);
                  }), 128))
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createVNode(_component_v_card, { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, null, {
                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                  createTextVNode("Revisores disponibles", -1)
                ])]),
                _: 1
              }),
              createVNode(_component_v_card_text, null, {
                default: withCtx(() => [
                  createVNode(_component_v_row, null, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(editorStore).revisoresDisponibles, (revisor) => {
                        return openBlock(), createBlock(_component_v_col, {
                          key: revisor.id,
                          cols: "12",
                          md: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card, {
                              variant: "outlined",
                              class: "mb-2"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_card_title, { class: "text-body-2" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(revisor.nombre), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_v_card_subtitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Matching: " + toDisplayString(revisor.matching) + "% — " + toDisplayString(revisor.disponible ? "Disponible" : "No disponible"), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_v_card_text, { class: "pt-0" }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createElementBlock(Fragment, null, renderList(revisor.especialidades, (esp) => {
                                      return openBlock(), createElementBlock("span", {
                                        key: esp,
                                        class: "text-caption mr-2"
                                      }, toDisplayString(esp), 1);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_v_card_actions, null, {
                                  default: withCtx(() => [
                                    !revisorAsignado(revisor.id) ? (openBlock(), createBlock(_component_v_btn, {
                                      key: 0,
                                      disabled: !revisor.disponible,
                                      color: "primary",
                                      size: "small",
                                      onClick: ($event) => asignar(revisor.id)
                                    }, {
                                      default: withCtx(() => [..._cache[6] || (_cache[6] = [
                                        createTextVNode(" Asignar ", -1)
                                      ])]),
                                      _: 1
                                    }, 8, ["disabled", "onClick"])) : (openBlock(), createBlock(_component_v_btn, {
                                      key: 1,
                                      size: "small",
                                      disabled: ""
                                    }, {
                                      default: withCtx(() => [..._cache[7] || (_cache[7] = [
                                        createTextVNode("Asignado", -1)
                                      ])]),
                                      _: 1
                                    }))
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
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          unref(manuscrito).revisionesCompletadas >= 2 ? (openBlock(), createBlock(_component_v_card, { key: 0 }, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, null, {
                default: withCtx(() => [..._cache[8] || (_cache[8] = [
                  createTextVNode("Decisión editorial", -1)
                ])]),
                _: 1
              }),
              createVNode(_component_v_card_text, null, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_2, [
                    createVNode(_component_v_btn, {
                      color: "success",
                      onClick: _cache[0] || (_cache[0] = ($event) => decidir("ACEPTADO"))
                    }, {
                      default: withCtx(() => [..._cache[9] || (_cache[9] = [
                        createTextVNode("Aceptar", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(_component_v_btn, {
                      color: "warning",
                      onClick: _cache[1] || (_cache[1] = ($event) => decidir("REVISION_MENOR"))
                    }, {
                      default: withCtx(() => [..._cache[10] || (_cache[10] = [
                        createTextVNode("Revisiones menores", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(_component_v_btn, {
                      color: "error",
                      onClick: _cache[2] || (_cache[2] = ($event) => decidir("RECHAZADO"))
                    }, {
                      default: withCtx(() => [..._cache[11] || (_cache[11] = [
                        createTextVNode("Rechazar", -1)
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
        ])) : (openBlock(), createElementBlock("p", _hoisted_3, "Manuscrito no encontrado.")),
        createVNode(_component_v_snackbar, {
          modelValue: snackbar.value,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => snackbar.value = $event),
          timeout: "3000"
        }, {
          default: withCtx(() => [..._cache[12] || (_cache[12] = [
            createTextVNode("Revisor asignado correctamente", -1)
          ])]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
