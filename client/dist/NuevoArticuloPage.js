import { u as useAutorStore } from "./index2.js";
import { _ as _export_sfc, g as resolveComponent, o as openBlock, k as createBlock, w as withCtx, b as createVNode, j as createTextVNode, f as withModifiers, c as createElementBlock, a as createBaseVNode, t as toDisplayString, h as ref, p as computed, e as createCommentVNode } from "./index.js";
import "./manuscritos.js";
const _hoisted_1$1 = {
  key: 1,
  class: "text-center py-6"
};
const _hoisted_2 = { class: "text-h5 font-weight-black mb-1 letter-spacing-1" };
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const _sfc_main$1 = {
  __name: "PdfUploader",
  emits: ["uploaded", "reset"],
  setup(__props, { emit: __emit }) {
    const selectedFile = ref(null);
    const errorMessage = ref("");
    const isUploading = ref(false);
    const uploadSuccess = ref(false);
    const referenceNumber = ref("");
    const isValidForUpload = computed(() => {
      const file = getFileToProcess();
      return file && !errorMessage.value;
    });
    const getFileToProcess = () => {
      if (!selectedFile.value) return null;
      return Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value;
    };
    const validateFile = () => {
      errorMessage.value = "";
      const file = getFileToProcess();
      if (!file) return false;
      if (file.type !== "application/pdf") {
        errorMessage.value = "Error: El archivo debe ser un documento en formato PDF.";
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
        errorMessage.value = `Error: El archivo supera el tamaño máximo de 50MB (Actual: ${sizeInMB}MB).`;
        return false;
      }
      return true;
    };
    const emit = __emit;
    const uploadFile = async () => {
      if (!validateFile()) return;
      isUploading.value = true;
      try {
        const file = getFileToProcess();
        const formData = new FormData();
        formData.append("archivo", file);
        const res = await fetch("/api/manuscritos/upload", {
          method: "POST",
          body: formData
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Error al subir el archivo");
        }
        const data = await res.json();
        referenceNumber.value = data.referencia;
        uploadSuccess.value = true;
        emit("uploaded", {
          file,
          reference: data.referencia
        });
      } catch (error) {
        errorMessage.value = error.message || "Ocurrió un error de red o de servidor al subir el archivo.";
        console.error("Error al subir:", error);
      } finally {
        isUploading.value = false;
      }
    };
    const resetForm = () => {
      selectedFile.value = null;
      errorMessage.value = "";
      uploadSuccess.value = false;
      referenceNumber.value = "";
      emit("reset");
    };
    return (_ctx, _cache) => {
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_file_input = resolveComponent("v-file-input");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      return openBlock(), createBlock(_component_v_card, {
        class: "mx-auto",
        "max-width": "600",
        elevation: "2"
      }, {
        default: withCtx(() => [
          createVNode(_component_v_card_title, { class: "text-h5 font-weight-bold d-flex align-center" }, {
            default: withCtx(() => [
              createVNode(_component_v_icon, {
                color: "primary",
                class: "mr-2"
              }, {
                default: withCtx(() => [..._cache[1] || (_cache[1] = [
                  createTextVNode("mdi-cloud-upload", -1)
                ])]),
                _: 1
              }),
              _cache[2] || (_cache[2] = createTextVNode(" Subir Documento (PDF) ", -1))
            ]),
            _: 1
          }),
          createVNode(_component_v_card_text, { class: "pt-4" }, {
            default: withCtx(() => [
              !uploadSuccess.value ? (openBlock(), createBlock(_component_v_form, {
                key: 0,
                onSubmit: withModifiers(uploadFile, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_file_input, {
                    modelValue: selectedFile.value,
                    "onUpdate:modelValue": [
                      _cache[0] || (_cache[0] = ($event) => selectedFile.value = $event),
                      validateFile
                    ],
                    label: "Seleccione el archivo",
                    accept: "application/pdf",
                    "prepend-icon": "",
                    "prepend-inner-icon": "mdi-file-pdf-box",
                    "error-messages": errorMessage.value,
                    onChange: validateFile,
                    "show-size": "",
                    variant: "outlined",
                    color: "primary",
                    hint: "Requisitos: Formato PDF. Tamaño máximo 50MB.",
                    "persistent-hint": "",
                    class: "mb-6"
                  }, null, 8, ["modelValue", "error-messages"]),
                  createVNode(_component_v_btn, {
                    type: "submit",
                    color: "primary",
                    size: "large",
                    block: "",
                    elevation: "2",
                    loading: isUploading.value,
                    disabled: !isValidForUpload.value
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_icon, {
                        left: "",
                        class: "mr-2"
                      }, {
                        default: withCtx(() => [..._cache[3] || (_cache[3] = [
                          createTextVNode("mdi-upload", -1)
                        ])]),
                        _: 1
                      }),
                      _cache[4] || (_cache[4] = createTextVNode(" Subir Archivo ", -1))
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ]),
                _: 1
              })) : (openBlock(), createElementBlock("div", _hoisted_1$1, [
                createVNode(_component_v_icon, {
                  color: "success",
                  size: "80",
                  class: "mb-4"
                }, {
                  default: withCtx(() => [..._cache[5] || (_cache[5] = [
                    createTextVNode("mdi-check-circle-outline", -1)
                  ])]),
                  _: 1
                }),
                _cache[9] || (_cache[9] = createBaseVNode("h3", { class: "text-h5 text-success font-weight-bold mb-2" }, "¡Carga Completada!", -1)),
                _cache[10] || (_cache[10] = createBaseVNode("p", { class: "text-body-1 mb-6 text-medium-emphasis" }, " El documento se ha subido y validado correctamente. ", -1)),
                createVNode(_component_v_alert, {
                  type: "info",
                  variant: "tonal",
                  border: "start",
                  class: "mb-6 text-left"
                }, {
                  default: withCtx(() => [
                    _cache[6] || (_cache[6] = createBaseVNode("div", { class: "text-subtitle-2 font-weight-regular text-uppercase mb-1" }, " Número de Referencia Único ", -1)),
                    createBaseVNode("div", _hoisted_2, toDisplayString(referenceNumber.value), 1),
                    _cache[7] || (_cache[7] = createBaseVNode("div", { class: "text-caption" }, " * Por favor, guarda este código para dar seguimiento a tu manuscrito. ", -1))
                  ]),
                  _: 1
                }),
                createVNode(_component_v_btn, {
                  color: "primary",
                  variant: "outlined",
                  onClick: resetForm,
                  "prepend-icon": "mdi-refresh"
                }, {
                  default: withCtx(() => [..._cache[8] || (_cache[8] = [
                    createTextVNode(" Subir otro documento ", -1)
                  ])]),
                  _: 1
                })
              ]))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
};
const PdfUploader = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3d7a340c"]]);
const _hoisted_1 = { key: 1 };
const _sfc_main = {
  __name: "NuevoArticuloPage",
  setup(__props) {
    const autorStore = useAutorStore();
    const valido = ref(false);
    const enviado = ref(false);
    const form = ref({ titulo: "", convocatoria: "", resumen: "" });
    const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter((c) => c.estado === "ABIERTA"));
    function onPdfUploaded({ reference }) {
      autorStore.enviarManuscrito({
        titulo: form.value.titulo,
        resumen: form.value.resumen,
        convocatoria: form.value.convocatoria,
        referencia: reference
      });
      enviado.value = true;
    }
    function onReset() {
      enviado.value = false;
      form.value = { titulo: "", convocatoria: "", resumen: "" };
    }
    return (_ctx, _cache) => {
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_textarea = resolveComponent("v-textarea");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_btn, {
          variant: "text",
          color: "primary",
          "prepend-icon": "mdi-arrow-left",
          to: "/autor/articulos",
          class: "mb-4"
        }, {
          default: withCtx(() => [..._cache[4] || (_cache[4] = [
            createTextVNode(" Volver a mis artículos ", -1)
          ])]),
          _: 1
        }),
        createVNode(_component_v_card, {
          "max-width": "750",
          class: "mx-auto",
          color: "surface",
          border: ""
        }, {
          default: withCtx(() => [
            _cache[11] || (_cache[11] = createBaseVNode("div", { style: { "background": "#5d4037", "height": "6px", "border-radius": "8px 8px 0 0" } }, null, -1)),
            createVNode(_component_v_card_title, {
              class: "pa-5 pb-2",
              style: { "color": "#3e2723" }
            }, {
              default: withCtx(() => [
                createVNode(_component_v_icon, {
                  start: "",
                  color: "primary"
                }, {
                  default: withCtx(() => [..._cache[5] || (_cache[5] = [
                    createTextVNode("mdi-file-plus-outline", -1)
                  ])]),
                  _: 1
                }),
                _cache[6] || (_cache[6] = createTextVNode(" Enviar nuevo artículo ", -1))
              ]),
              _: 1
            }),
            createVNode(_component_v_divider),
            createVNode(_component_v_card_text, { class: "pa-5" }, {
              default: withCtx(() => [
                enviado.value ? (openBlock(), createBlock(_component_v_alert, {
                  key: 0,
                  type: "success",
                  variant: "tonal",
                  class: "mb-4",
                  rounded: "lg"
                }, {
                  default: withCtx(() => [..._cache[7] || (_cache[7] = [
                    createTextVNode(' Artículo enviado. Puede seguir su estado en "Mis artículos". ', -1)
                  ])]),
                  _: 1
                })) : createCommentVNode("", true),
                createVNode(_component_v_form, {
                  ref: "formulario",
                  modelValue: valido.value,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => valido.value = $event)
                }, {
                  default: withCtx(() => [
                    _cache[8] || (_cache[8] = createBaseVNode("p", {
                      class: "text-caption font-weight-bold mb-3",
                      style: { "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em" }
                    }, " Información del manuscrito ", -1)),
                    createVNode(_component_v_text_field, {
                      modelValue: form.value.titulo,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.titulo = $event),
                      label: "Título del artículo *",
                      "prepend-inner-icon": "mdi-format-title",
                      rules: [(r) => !!r || "El título es requerido"],
                      class: "mb-3",
                      disabled: enviado.value
                    }, null, 8, ["modelValue", "rules", "disabled"]),
                    createVNode(_component_v_select, {
                      modelValue: form.value.convocatoria,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.convocatoria = $event),
                      items: convocatoriasAbiertas.value,
                      "item-title": "nombre",
                      "item-value": "nombre",
                      label: "Convocatoria *",
                      "prepend-inner-icon": "mdi-calendar-star",
                      rules: [(r) => !!r || "Seleccione una convocatoria"],
                      class: "mb-3",
                      disabled: enviado.value
                    }, null, 8, ["modelValue", "items", "rules", "disabled"]),
                    createVNode(_component_v_textarea, {
                      modelValue: form.value.resumen,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.resumen = $event),
                      label: "Resumen *",
                      "prepend-inner-icon": "mdi-text",
                      rules: [(r) => !!r || "El resumen es requerido", (r) => r.length >= 100 || "Mínimo 100 caracteres"],
                      rows: "5",
                      class: "mb-2",
                      disabled: enviado.value
                    }, null, 8, ["modelValue", "rules", "disabled"])
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                createVNode(_component_v_divider, { class: "my-4" }),
                _cache[10] || (_cache[10] = createBaseVNode("p", {
                  class: "text-caption font-weight-bold mb-3",
                  style: { "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em" }
                }, " Archivo PDF ", -1)),
                valido.value || enviado.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
                  createVNode(PdfUploader, {
                    onUploaded: onPdfUploaded,
                    onReset
                  })
                ])) : (openBlock(), createBlock(_component_v_alert, {
                  key: 2,
                  type: "info",
                  variant: "tonal",
                  density: "compact",
                  rounded: "lg"
                }, {
                  default: withCtx(() => [..._cache[9] || (_cache[9] = [
                    createTextVNode(" Complete la información de arriba para habilitar la carga del PDF. ", -1)
                  ])]),
                  _: 1
                }))
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
