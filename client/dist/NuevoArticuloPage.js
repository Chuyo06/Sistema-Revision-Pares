import { i as createElementBlock, b as createVNode, w as withCtx, r as resolveComponent, o as openBlock, d as createTextVNode, c as createBlock, f as createCommentVNode, g as withModifiers, h as createBaseVNode, k as ref, m as computed } from "./index.js";
import { u as useAutorStore } from "./index2.js";
const _hoisted_1 = { class: "d-flex justify-end" };
const _sfc_main = {
  __name: "NuevoArticuloPage",
  setup(__props) {
    const autorStore = useAutorStore();
    const valido = ref(false);
    const cargando = ref(false);
    const enviado = ref(false);
    const form = ref({
      titulo: "",
      convocatoria: "",
      resumen: "",
      archivo: null
    });
    const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter((c) => c.estado === "ABIERTA"));
    async function enviar() {
      cargando.value = true;
      await new Promise((r) => setTimeout(r, 1e3));
      autorStore.enviarManuscrito({
        titulo: form.value.titulo,
        resumen: form.value.resumen,
        convocatoria: form.value.convocatoria
      });
      cargando.value = false;
      enviado.value = true;
      form.value = { titulo: "", convocatoria: "", resumen: "", archivo: null };
    }
    return (_ctx, _cache) => {
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_textarea = resolveComponent("v-textarea");
      const _component_v_file_input = resolveComponent("v-file-input");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_btn, {
          variant: "text",
          to: "/autor/articulos",
          class: "mb-4"
        }, {
          default: withCtx(() => [..._cache[5] || (_cache[5] = [
            createTextVNode("← Volver", -1)
          ])]),
          _: 1
        }),
        createVNode(_component_v_card, {
          "max-width": "800",
          class: "mx-auto"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_card_title, null, {
              default: withCtx(() => [..._cache[6] || (_cache[6] = [
                createTextVNode("Enviar nuevo artículo", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_card_text, null, {
              default: withCtx(() => [
                enviado.value ? (openBlock(), createBlock(_component_v_alert, {
                  key: 0,
                  type: "success",
                  class: "mb-4"
                }, {
                  default: withCtx(() => [..._cache[7] || (_cache[7] = [
                    createTextVNode(' Artículo enviado correctamente. Puede seguir su progreso en "Mis artículos". ', -1)
                  ])]),
                  _: 1
                })) : createCommentVNode("", true),
                createVNode(_component_v_form, {
                  ref: "formulario",
                  modelValue: valido.value,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => valido.value = $event),
                  onSubmit: withModifiers(enviar, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_text_field, {
                      modelValue: form.value.titulo,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.titulo = $event),
                      label: "Título del artículo *",
                      rules: [(r) => !!r || "El título es requerido"],
                      class: "mb-3"
                    }, null, 8, ["modelValue", "rules"]),
                    createVNode(_component_v_select, {
                      modelValue: form.value.convocatoria,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.convocatoria = $event),
                      items: convocatoriasAbiertas.value,
                      "item-title": "nombre",
                      "item-value": "nombre",
                      label: "Convocatoria *",
                      rules: [(r) => !!r || "Seleccione una convocatoria"],
                      class: "mb-3"
                    }, null, 8, ["modelValue", "items", "rules"]),
                    createVNode(_component_v_textarea, {
                      modelValue: form.value.resumen,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.resumen = $event),
                      label: "Resumen *",
                      rules: [(r) => !!r || "El resumen es requerido", (r) => r.length >= 100 || "Mínimo 100 caracteres"],
                      rows: "5",
                      class: "mb-3"
                    }, null, 8, ["modelValue", "rules"]),
                    createVNode(_component_v_file_input, {
                      modelValue: form.value.archivo,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.archivo = $event),
                      label: "Archivo PDF *",
                      accept: ".pdf",
                      rules: [(r) => !!(r == null ? void 0 : r.length) || "El archivo es requerido"],
                      class: "mb-3"
                    }, null, 8, ["modelValue", "rules"]),
                    createVNode(_component_v_divider, { class: "my-4" }),
                    createBaseVNode("div", _hoisted_1, [
                      createVNode(_component_v_btn, {
                        type: "submit",
                        color: "primary",
                        loading: cargando.value,
                        disabled: !valido.value
                      }, {
                        default: withCtx(() => [..._cache[8] || (_cache[8] = [
                          createTextVNode("Enviar artículo", -1)
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
        })
      ]);
    };
  }
};
export {
  _sfc_main as default
};
