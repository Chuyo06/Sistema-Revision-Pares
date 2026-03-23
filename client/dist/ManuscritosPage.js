import { u as useEditorStore } from "./index4.js";
import { i as createElementBlock, b as createVNode, w as withCtx, F as Fragment, j as renderList, f as createCommentVNode, r as resolveComponent, m as computed, o as openBlock, h as createBaseVNode, c as createBlock, d as createTextVNode, t as toDisplayString, k as ref } from "./index.js";
const _hoisted_1 = { class: "text-body-2" };
const _hoisted_2 = {
  key: 0,
  class: "text-body-2 text-center mt-4"
};
const _sfc_main = {
  __name: "ManuscritosPage",
  setup(__props) {
    const editorStore = useEditorStore();
    const busqueda = ref("");
    const filtroEstado = ref("TODOS");
    const manuscritosFiltrados = computed(
      () => editorStore.manuscritos.filter((m) => {
        const b = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase());
        const e = filtroEstado.value === "TODOS" || m.estado === filtroEstado.value;
        return b && e;
      })
    );
    const ESTADOS = {
      ENVIADO: "Enviado",
      EN_REVISION: "En revisión",
      ACEPTADO: "Aceptado",
      RECHAZADO: "Rechazado"
    };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    function decidir(id, decision) {
      editorStore.tomarDecision(id, decision);
    }
    return (_ctx, _cache) => {
      const _component_v_col = resolveComponent("v-col");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_card = resolveComponent("v-card");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_row, {
          class: "mb-4",
          align: "center"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_col, null, {
              default: withCtx(() => [..._cache[2] || (_cache[2] = [
                createBaseVNode("h2", { class: "text-h6" }, "Gestión de manuscritos", -1)
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
              default: withCtx(() => [..._cache[3] || (_cache[3] = [
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
                  items: ["TODOS", "ENVIADO", "EN_REVISION", "ACEPTADO", "RECHAZADO"],
                  density: "compact",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        (openBlock(true), createElementBlock(Fragment, null, renderList(manuscritosFiltrados.value, (m) => {
          return openBlock(), createBlock(_component_v_card, {
            key: m.id,
            class: "mb-3"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_card_title, { class: "text-body-1" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(m.titulo), 1)
                ]),
                _: 2
              }, 1024),
              createVNode(_component_v_card_subtitle, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(m.autores) + " · " + toDisplayString(m.convocatoria) + " · " + toDisplayString(m.fechaEnvio) + " — " + toDisplayString(estadoLabel(m.estado)), 1)
                ]),
                _: 2
              }, 1024),
              createVNode(_component_v_card_text, null, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(m.alertas, (alerta, i) => {
                    return openBlock(), createElementBlock("p", {
                      key: i,
                      class: "text-caption text-warning"
                    }, "⚠ " + toDisplayString(alerta), 1);
                  }), 128)),
                  createBaseVNode("p", _hoisted_1, "Revisores: " + toDisplayString(m.revisionesCompletadas) + "/" + toDisplayString(m.revisoresAsignados) + " completadas", 1)
                ]),
                _: 2
              }, 1024),
              createVNode(_component_v_card_actions, null, {
                default: withCtx(() => [
                  createVNode(_component_v_btn, {
                    variant: "text",
                    color: "primary",
                    to: `/editor/asignacion/${m.id}`
                  }, {
                    default: withCtx(() => [..._cache[4] || (_cache[4] = [
                      createTextVNode("Gestionar revisores", -1)
                    ])]),
                    _: 1
                  }, 8, ["to"]),
                  m.estado === "EN_REVISION" && m.revisionesCompletadas >= 2 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createVNode(_component_v_btn, {
                      size: "small",
                      color: "success",
                      onClick: ($event) => decidir(m.id, "ACEPTADO")
                    }, {
                      default: withCtx(() => [..._cache[5] || (_cache[5] = [
                        createTextVNode("Aceptar", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_v_btn, {
                      size: "small",
                      color: "error",
                      onClick: ($event) => decidir(m.id, "RECHAZADO")
                    }, {
                      default: withCtx(() => [..._cache[6] || (_cache[6] = [
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
          }, 1024);
        }), 128)),
        manuscritosFiltrados.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_2, "Sin resultados.")) : createCommentVNode("", true)
      ]);
    };
  }
};
export {
  _sfc_main as default
};
