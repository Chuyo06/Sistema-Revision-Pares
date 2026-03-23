import { u as useRevisorStore } from "./index3.js";
import { i as createElementBlock, h as createBaseVNode, b as createVNode, w as withCtx, r as resolveComponent, o as openBlock, F as Fragment, j as renderList, e as unref, c as createBlock, d as createTextVNode, t as toDisplayString } from "./index.js";
const _hoisted_1 = { class: "text-caption" };
const _hoisted_2 = { class: "text-caption" };
const _sfc_main = {
  __name: "AsignadosPage",
  setup(__props) {
    const revisorStore = useRevisorStore();
    const ESTADOS = {
      PENDIENTE: "Pendiente",
      EN_PROGRESO: "En progreso",
      COMPLETADA: "Completada"
    };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    return (_ctx, _cache) => {
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      return openBlock(), createElementBlock("div", null, [
        _cache[1] || (_cache[1] = createBaseVNode("h2", { class: "text-h6 mb-4" }, "Artículos asignados", -1)),
        createVNode(_component_v_row, null, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(revisorStore).articulosAsignados, (articulo) => {
              return openBlock(), createBlock(_component_v_col, {
                key: articulo.id,
                cols: "12",
                md: "6"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_card, { class: "mb-2" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card_title, { class: "text-body-1" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(articulo.titulo), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_v_card_subtitle, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(articulo.autores) + " — " + toDisplayString(estadoLabel(articulo.estado)), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_v_card_text, null, {
                        default: withCtx(() => [
                          createBaseVNode("p", _hoisted_1, "Convocatoria: " + toDisplayString(articulo.convocatoria), 1),
                          createBaseVNode("p", _hoisted_2, "Deadline: " + toDisplayString(articulo.deadline), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_v_card_actions, null, {
                        default: withCtx(() => [
                          articulo.estado !== "COMPLETADA" ? (openBlock(), createBlock(_component_v_btn, {
                            key: 0,
                            color: "primary",
                            to: `/revisor/revision/${articulo.id}`
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(articulo.estado === "EN_PROGRESO" ? "Continuar revisión" : "Iniciar revisión"), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])) : (openBlock(), createBlock(_component_v_btn, {
                            key: 1,
                            disabled: ""
                          }, {
                            default: withCtx(() => [..._cache[0] || (_cache[0] = [
                              createTextVNode("Revisión enviada", -1)
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
      ]);
    };
  }
};
export {
  _sfc_main as default
};
