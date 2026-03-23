import { i as createElementBlock, b as createVNode, w as withCtx, e as unref, l as useRoute, r as resolveComponent, k as ref, a as useRouter, o as openBlock, d as createTextVNode, t as toDisplayString, h as createBaseVNode, g as withModifiers, F as Fragment, j as renderList, p as reactive } from "./index.js";
import { u as useRevisorStore } from "./index3.js";
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { class: "text-body-2" };
const _hoisted_3 = { class: "text-body-2 mb-1" };
const _hoisted_4 = { class: "d-flex justify-end" };
const _hoisted_5 = {
  key: 1,
  class: "text-body-2"
};
const _sfc_main = {
  __name: "RevisionPage",
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const revisorStore = useRevisorStore();
    const articuloId = Number(route.params.id);
    const articulo = revisorStore.articulosAsignados.find((a) => a.id === articuloId);
    const valido = ref(false);
    const enviando = ref(false);
    const dialogoConfirmacion = ref(false);
    const revision = reactive({
      originalidad: 0,
      metodologia: 0,
      claridad: 0,
      relevancia: 0,
      recomendacion: "",
      comentariosAutor: "",
      comentariosEditor: ""
    });
    const dimensiones = [
      { campo: "originalidad", label: "Originalidad" },
      { campo: "metodologia", label: "Metodología" },
      { campo: "claridad", label: "Claridad" },
      { campo: "relevancia", label: "Relevancia" }
    ];
    const recomendaciones = [
      { value: "ACEPTAR", label: "Aceptar" },
      { value: "REVISION_MENOR", label: "Revisiones menores" },
      { value: "REVISION_MAYOR", label: "Revisiones mayores" },
      { value: "RECHAZAR", label: "Rechazar" }
    ];
    async function enviarRevision() {
      enviando.value = true;
      await new Promise((r) => setTimeout(r, 800));
      revisorStore.enviarRevision(articuloId, { ...revision });
      enviando.value = false;
      dialogoConfirmacion.value = true;
    }
    function irAsignados() {
      dialogoConfirmacion.value = false;
      router.push("/revisor/asignados");
    }
    return (_ctx, _cache) => {
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_rating = resolveComponent("v-rating");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_textarea = resolveComponent("v-textarea");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_spacer = resolveComponent("v-spacer");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_dialog = resolveComponent("v-dialog");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_btn, {
          variant: "text",
          to: "/revisor/asignados",
          class: "mb-4"
        }, {
          default: withCtx(() => [..._cache[5] || (_cache[5] = [
            createTextVNode("← Volver", -1)
          ])]),
          _: 1
        }),
        unref(articulo) ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(_component_v_card, { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(articulo).titulo), 1)
                ]),
                _: 1
              }),
              createVNode(_component_v_card_subtitle, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(articulo).autores) + " · " + toDisplayString(unref(articulo).convocatoria), 1)
                ]),
                _: 1
              }),
              createVNode(_component_v_card_text, null, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_2, toDisplayString(unref(articulo).resumen), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(_component_v_card, null, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, null, {
                default: withCtx(() => [..._cache[6] || (_cache[6] = [
                  createTextVNode("Formulario de revisión", -1)
                ])]),
                _: 1
              }),
              createVNode(_component_v_card_text, null, {
                default: withCtx(() => [
                  createVNode(_component_v_form, {
                    ref: "form",
                    modelValue: valido.value,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => valido.value = $event),
                    onSubmit: withModifiers(enviarRevision, ["prevent"])
                  }, {
                    default: withCtx(() => [
                      _cache[8] || (_cache[8] = createBaseVNode("p", { class: "text-subtitle-2 mb-2" }, "Evaluación general", -1)),
                      createVNode(_component_v_row, { class: "mb-3" }, {
                        default: withCtx(() => [
                          (openBlock(), createElementBlock(Fragment, null, renderList(dimensiones, (dim) => {
                            return createVNode(_component_v_col, {
                              key: dim.campo,
                              cols: "12",
                              sm: "6"
                            }, {
                              default: withCtx(() => [
                                createBaseVNode("div", _hoisted_3, toDisplayString(dim.label), 1),
                                createVNode(_component_v_rating, {
                                  modelValue: revision[dim.campo],
                                  "onUpdate:modelValue": ($event) => revision[dim.campo] = $event,
                                  length: 5,
                                  density: "compact"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 64))
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_divider, { class: "my-3" }),
                      createVNode(_component_v_select, {
                        modelValue: revision.recomendacion,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => revision.recomendacion = $event),
                        items: recomendaciones,
                        "item-title": "label",
                        "item-value": "value",
                        label: "Recomendación *",
                        rules: [(r) => !!r || "Seleccione una recomendación"],
                        class: "mb-3"
                      }, null, 8, ["modelValue", "rules"]),
                      createVNode(_component_v_textarea, {
                        modelValue: revision.comentariosAutor,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => revision.comentariosAutor = $event),
                        label: "Comentarios para el autor *",
                        rules: [(r) => !!r || "Los comentarios son requeridos", (r) => r.length >= 50 || "Mínimo 50 caracteres"],
                        rows: "6",
                        class: "mb-3"
                      }, null, 8, ["modelValue", "rules"]),
                      createVNode(_component_v_textarea, {
                        modelValue: revision.comentariosEditor,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => revision.comentariosEditor = $event),
                        label: "Comentarios confidenciales para el editor",
                        rows: "3",
                        class: "mb-3"
                      }, null, 8, ["modelValue"]),
                      createVNode(_component_v_divider, { class: "my-3" }),
                      createBaseVNode("div", _hoisted_4, [
                        createVNode(_component_v_btn, {
                          type: "submit",
                          color: "primary",
                          loading: enviando.value,
                          disabled: !valido.value
                        }, {
                          default: withCtx(() => [..._cache[7] || (_cache[7] = [
                            createTextVNode("Enviar revisión", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading", "disabled"])
                      ])
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(_component_v_dialog, {
            modelValue: dialogoConfirmacion.value,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => dialogoConfirmacion.value = $event),
            "max-width": "400"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_card, null, {
                default: withCtx(() => [
                  createVNode(_component_v_card_title, null, {
                    default: withCtx(() => [..._cache[9] || (_cache[9] = [
                      createTextVNode("Revisión enviada", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(_component_v_card_text, null, {
                    default: withCtx(() => [..._cache[10] || (_cache[10] = [
                      createTextVNode("Tu revisión ha sido enviada correctamente.", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(_component_v_card_actions, null, {
                    default: withCtx(() => [
                      createVNode(_component_v_spacer),
                      createVNode(_component_v_btn, {
                        color: "primary",
                        onClick: irAsignados
                      }, {
                        default: withCtx(() => [..._cache[11] || (_cache[11] = [
                          createTextVNode("Ver mis artículos", -1)
                        ])]),
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
          }, 8, ["modelValue"])
        ])) : (openBlock(), createElementBlock("p", _hoisted_5, "Artículo no encontrado."))
      ]);
    };
  }
};
export {
  _sfc_main as default
};
