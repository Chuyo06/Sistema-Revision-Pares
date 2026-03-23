import { u as useAutorStore } from "./index2.js";
import { i as createElementBlock, b as createVNode, w as withCtx, f as createCommentVNode, r as resolveComponent, m as computed, o as openBlock, h as createBaseVNode, d as createTextVNode, F as Fragment, j as renderList, c as createBlock, t as toDisplayString, k as ref } from "./index.js";
const _hoisted_1 = {
  class: "text-body-2 mb-2",
  style: { "display": "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", "overflow": "hidden" }
};
const _hoisted_2 = { class: "text-caption" };
const _hoisted_3 = {
  key: 0,
  class: "text-caption ml-3"
};
const _hoisted_4 = {
  key: 0,
  class: "text-body-2 text-center mt-4"
};
const _sfc_main = {
  __name: "ArticulosPage",
  setup(__props) {
    const autorStore = useAutorStore();
    const busqueda = ref("");
    const filtroEstado = ref("TODOS");
    const manuscritosFiltrados = computed(() => {
      return autorStore.manuscritos.filter((m) => {
        const coincideBusqueda = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase());
        const coincideEstado = filtroEstado.value === "TODOS" || m.estado === filtroEstado.value;
        return coincideBusqueda && coincideEstado;
      });
    });
    const ESTADOS = {
      BORRADOR: "Borrador",
      ENVIADO: "Enviado",
      EN_REVISION: "En revisión",
      ACEPTADO: "Aceptado",
      RECHAZADO: "Rechazado"
    };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    return (_ctx, _cache) => {
      const _component_v_col = resolveComponent("v-col");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_row, {
          class: "mb-4",
          align: "center"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_col, null, {
              default: withCtx(() => [..._cache[2] || (_cache[2] = [
                createBaseVNode("h2", { class: "text-h6" }, "Mis artículos", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "12",
              sm: "auto"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_text_field, {
                  modelValue: busqueda.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => busqueda.value = $event),
                  placeholder: "Buscar...",
                  density: "compact",
                  "hide-details": "",
                  style: { "min-width": "200px" }
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_v_col, { cols: "auto" }, {
              default: withCtx(() => [
                createVNode(_component_v_btn, {
                  color: "primary",
                  to: "/autor/nuevo"
                }, {
                  default: withCtx(() => [..._cache[3] || (_cache[3] = [
                    createTextVNode("Nuevo", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        createVNode(_component_v_row, {
          class: "mb-4",
          align: "center"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_col, { cols: "auto" }, {
              default: withCtx(() => [..._cache[4] || (_cache[4] = [
                createBaseVNode("span", { class: "text-body-2 mr-2" }, "Filtrar:", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "12",
              sm: "4"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_select, {
                  modelValue: filtroEstado.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filtroEstado.value = $event),
                  items: ["TODOS", "BORRADOR", "EN_REVISION", "ACEPTADO", "RECHAZADO"],
                  density: "compact",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        createVNode(_component_v_row, null, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(manuscritosFiltrados.value, (m) => {
              return openBlock(), createBlock(_component_v_col, {
                key: m.id,
                cols: "12",
                md: "6"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_card, { class: "mb-2" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card_title, { class: "text-body-1" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(m.titulo), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_v_card_subtitle, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(m.convocatoria) + " — " + toDisplayString(estadoLabel(m.estado)), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_v_card_text, null, {
                        default: withCtx(() => [
                          createBaseVNode("p", _hoisted_1, toDisplayString(m.resumen), 1),
                          createBaseVNode("span", _hoisted_2, toDisplayString(m.revisores) + " revisores", 1),
                          m.fechaEnvio ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(m.fechaEnvio), 1)) : createCommentVNode("", true)
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
        }),
        manuscritosFiltrados.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_4, " No se encontraron artículos. ")) : createCommentVNode("", true)
      ]);
    };
  }
};
export {
  _sfc_main as default
};
