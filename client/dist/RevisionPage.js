import { v as onMounted, c as createElementBlock, b as createVNode, w as withCtx, s as useRoute, g as resolveComponent, p as computed, h as ref, i as useRouter, o as openBlock, j as createTextVNode, a as createBaseVNode, t as toDisplayString, f as withModifiers, F as Fragment, r as renderList, y as reactive } from "./index.js";
import { u as useRevisorStore } from "./index3.js";
import "./revision.js";
import "./manuscritos.js";
const _hoisted_1 = { key: 0 };
const _hoisted_2 = {
  class: "text-h6 font-weight-bold mb-1",
  style: { "color": "#3e2723" }
};
const _hoisted_3 = {
  class: "text-caption mb-3",
  style: { "color": "#8d6e63" }
};
const _hoisted_4 = {
  class: "text-body-2",
  style: { "color": "#5d4037" }
};
const _hoisted_5 = {
  class: "text-body-2 mb-1",
  style: { "color": "#3e2723" }
};
const _hoisted_6 = { class: "d-flex justify-end" };
const _hoisted_7 = {
  key: 1,
  class: "text-body-2",
  style: { "color": "#8d6e63" }
};
const _sfc_main = {
  __name: "RevisionPage",
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const revisorStore = useRevisorStore();
    const articuloId = Number(route.params.id);
    const articulo = computed(() => revisorStore.articulosAsignados.find((a) => a.id === articuloId));
    onMounted(() => {
      if (revisorStore.articulosAsignados.length === 0) {
        revisorStore.cargarDashboard();
      }
    });
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
      const puntuacion = Math.round(
        (revision.originalidad + revision.metodologia + revision.claridad + revision.relevancia) / 4
      );
      const comentarios = `PARA EL AUTOR: ${revision.comentariosAutor}

PARA EL EDITOR: ${revision.comentariosEditor}`;
      const dataParaBackend = {
        puntuacion,
        comentarios,
        recomendacion: revision.recomendacion
      };
      await revisorStore.enviarRevision(articuloId, dataParaBackend);
      enviando.value = false;
      dialogoConfirmacion.value = true;
    }
    function irAsignados() {
      dialogoConfirmacion.value = false;
      router.push("/revisor/asignados");
    }
    return (_ctx, _cache) => {
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_rating = resolveComponent("v-rating");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_textarea = resolveComponent("v-textarea");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_dialog = resolveComponent("v-dialog");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_btn, {
          variant: "text",
          color: "primary",
          "prepend-icon": "mdi-arrow-left",
          to: "/revisor/asignados",
          class: "mb-4"
        }, {
          default: withCtx(() => [..._cache[5] || (_cache[5] = [
            createTextVNode(" Volver a asignados ", -1)
          ])]),
          _: 1
        }),
        articulo.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(_component_v_card, {
            class: "mb-4",
            color: "surface",
            border: ""
          }, {
            default: withCtx(() => [
              _cache[6] || (_cache[6] = createBaseVNode("div", { style: { "background": "#546e7a", "height": "6px", "border-radius": "8px 8px 0 0" } }, null, -1)),
              createVNode(_component_v_card_text, { class: "pa-4" }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_2, toDisplayString(articulo.value.titulo), 1),
                  createBaseVNode("div", _hoisted_3, toDisplayString(articulo.value.autores) + " · " + toDisplayString(articulo.value.convocatoria), 1),
                  createBaseVNode("p", _hoisted_4, toDisplayString(articulo.value.resumen), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(_component_v_card, {
            color: "surface",
            border: ""
          }, {
            default: withCtx(() => [
              _cache[12] || (_cache[12] = createBaseVNode("div", { style: { "background": "#5d4037", "height": "6px", "border-radius": "8px 8px 0 0" } }, null, -1)),
              createVNode(_component_v_card_title, {
                class: "pa-4 pb-2",
                style: { "color": "#3e2723" }
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_icon, {
                    start: "",
                    color: "primary"
                  }, {
                    default: withCtx(() => [..._cache[7] || (_cache[7] = [
                      createTextVNode("mdi-clipboard-edit-outline", -1)
                    ])]),
                    _: 1
                  }),
                  _cache[8] || (_cache[8] = createTextVNode(" Formulario de revisión ", -1))
                ]),
                _: 1
              }),
              createVNode(_component_v_divider),
              createVNode(_component_v_card_text, { class: "pa-5" }, {
                default: withCtx(() => [
                  createVNode(_component_v_form, {
                    ref: "form",
                    modelValue: valido.value,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => valido.value = $event),
                    onSubmit: withModifiers(enviarRevision, ["prevent"])
                  }, {
                    default: withCtx(() => [
                      _cache[10] || (_cache[10] = createBaseVNode("p", {
                        class: "text-caption font-weight-bold mb-3",
                        style: { "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em" }
                      }, " Evaluación general ", -1)),
                      createVNode(_component_v_row, { class: "mb-3" }, {
                        default: withCtx(() => [
                          (openBlock(), createElementBlock(Fragment, null, renderList(dimensiones, (dim) => {
                            return createVNode(_component_v_col, {
                              key: dim.campo,
                              cols: "12",
                              sm: "6"
                            }, {
                              default: withCtx(() => [
                                createBaseVNode("div", _hoisted_5, toDisplayString(dim.label), 1),
                                createVNode(_component_v_rating, {
                                  modelValue: revision[dim.campo],
                                  "onUpdate:modelValue": ($event) => revision[dim.campo] = $event,
                                  length: 5,
                                  density: "compact",
                                  color: "warning",
                                  "active-color": "warning"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 64))
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_divider, { class: "my-4" }),
                      _cache[11] || (_cache[11] = createBaseVNode("p", {
                        class: "text-caption font-weight-bold mb-3",
                        style: { "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em" }
                      }, " Dictamen ", -1)),
                      createVNode(_component_v_select, {
                        modelValue: revision.recomendacion,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => revision.recomendacion = $event),
                        items: recomendaciones,
                        "item-title": "label",
                        "item-value": "value",
                        label: "Recomendación *",
                        "prepend-inner-icon": "mdi-gavel",
                        rules: [(r) => !!r || "Seleccione una recomendación"],
                        class: "mb-3"
                      }, null, 8, ["modelValue", "rules"]),
                      createVNode(_component_v_textarea, {
                        modelValue: revision.comentariosAutor,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => revision.comentariosAutor = $event),
                        label: "Comentarios para el autor *",
                        "prepend-inner-icon": "mdi-comment-text-outline",
                        rules: [(r) => !!r || "Los comentarios son requeridos", (r) => r.length >= 50 || "Mínimo 50 caracteres"],
                        rows: "5",
                        class: "mb-3"
                      }, null, 8, ["modelValue", "rules"]),
                      createVNode(_component_v_textarea, {
                        modelValue: revision.comentariosEditor,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => revision.comentariosEditor = $event),
                        label: "Comentarios confidenciales para el editor",
                        "prepend-inner-icon": "mdi-comment-lock-outline",
                        rows: "3",
                        class: "mb-4"
                      }, null, 8, ["modelValue"]),
                      createBaseVNode("div", _hoisted_6, [
                        createVNode(_component_v_btn, {
                          type: "submit",
                          color: "primary",
                          loading: enviando.value,
                          disabled: !valido.value,
                          "prepend-icon": "mdi-send"
                        }, {
                          default: withCtx(() => [..._cache[9] || (_cache[9] = [
                            createTextVNode(" Enviar revisión ", -1)
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
            "max-width": "380"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_card, { color: "surface" }, {
                default: withCtx(() => [
                  _cache[17] || (_cache[17] = createBaseVNode("div", { style: { "background": "#558b2f", "height": "6px", "border-radius": "8px 8px 0 0" } }, null, -1)),
                  createVNode(_component_v_card_text, { class: "pa-5 text-center" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_icon, {
                        size: "40",
                        color: "success",
                        class: "mb-2"
                      }, {
                        default: withCtx(() => [..._cache[13] || (_cache[13] = [
                          createTextVNode("mdi-check-circle", -1)
                        ])]),
                        _: 1
                      }),
                      _cache[14] || (_cache[14] = createBaseVNode("div", {
                        class: "text-h6",
                        style: { "color": "#3e2723" }
                      }, "Revisión enviada", -1)),
                      _cache[15] || (_cache[15] = createBaseVNode("p", {
                        class: "text-body-2 mt-1",
                        style: { "color": "#8d6e63" }
                      }, "Tu revisión fue registrada correctamente.", -1))
                    ]),
                    _: 1
                  }),
                  createVNode(_component_v_card_actions, { class: "justify-center pb-4" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_btn, {
                        color: "primary",
                        onClick: irAsignados
                      }, {
                        default: withCtx(() => [..._cache[16] || (_cache[16] = [
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
        ])) : (openBlock(), createElementBlock("p", _hoisted_7, "Artículo no encontrado."))
      ]);
    };
  }
};
export {
  _sfc_main as default
};
