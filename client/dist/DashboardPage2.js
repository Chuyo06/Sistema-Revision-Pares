import { u as useAuthStore, i as createElementBlock, h as createBaseVNode, t as toDisplayString, e as unref, b as createVNode, w as withCtx, m as computed, r as resolveComponent, o as openBlock, d as createTextVNode, F as Fragment, j as renderList, c as createBlock } from "./index.js";
import { u as useRevisorStore } from "./index3.js";
const _hoisted_1 = { class: "text-body-2 mb-4" };
const _hoisted_2 = { class: "text-h4" };
const _hoisted_3 = { class: "text-h4" };
const _hoisted_4 = { class: "text-h4" };
const _hoisted_5 = { class: "text-h4" };
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const auth = useAuthStore();
    const revisorStore = useRevisorStore();
    const pendientes = computed(() => revisorStore.articulosAsignados.filter((a) => a.estado !== "COMPLETADA").length);
    const pendientesLista = computed(() => revisorStore.articulosAsignados.filter((a) => a.estado === "PENDIENTE"));
    const completadas = computed(() => revisorStore.articulosAsignados.filter((a) => a.estado === "COMPLETADA"));
    return (_ctx, _cache) => {
      var _a;
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_btn = resolveComponent("v-btn");
      return openBlock(), createElementBlock("div", null, [
        _cache[7] || (_cache[7] = createBaseVNode("h1", { class: "text-h6 mb-1" }, "Dashboard del Revisor", -1)),
        createBaseVNode("p", _hoisted_1, "Bienvenido, " + toDisplayString((_a = unref(auth).usuario) == null ? void 0 : _a.nombre) + ". Tienes " + toDisplayString(pendientes.value) + " revisiones pendientes.", 1),
        createVNode(_component_v_row, { class: "mb-4" }, {
          default: withCtx(() => [
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_2, toDisplayString(unref(revisorStore).articulosAsignados.length), 1),
                        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "text-caption" }, "Asignados", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_3, toDisplayString(pendientes.value), 1),
                        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "text-caption" }, "Pendientes", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_4, toDisplayString(unref(revisorStore).articulosAsignados.filter((a) => a.estado === "EN_PROGRESO").length), 1),
                        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "text-caption" }, "En progreso", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "6",
              sm: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_card, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_text, { class: "text-center" }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_5, toDisplayString(completadas.value.length), 1),
                        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "text-caption" }, "Completadas", -1))
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
        }),
        createVNode(_component_v_card, { class: "mb-4" }, {
          default: withCtx(() => [
            createVNode(_component_v_card_title, null, {
              default: withCtx(() => [..._cache[4] || (_cache[4] = [
                createTextVNode("Revisiones pendientes", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_card_text, null, {
              default: withCtx(() => [
                createVNode(_component_v_list, null, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(pendientesLista.value, (a) => {
                      return openBlock(), createBlock(_component_v_list_item, {
                        key: a.id,
                        title: a.titulo,
                        subtitle: a.convocatoria + " · Deadline: " + a.deadline,
                        to: `/revisor/revision/${a.id}`
                      }, null, 8, ["title", "subtitle", "to"]);
                    }), 128))
                  ]),
                  _: 1
                }),
                createVNode(_component_v_btn, {
                  variant: "text",
                  color: "primary",
                  to: "/revisor/asignados"
                }, {
                  default: withCtx(() => [..._cache[5] || (_cache[5] = [
                    createTextVNode("Ver todos", -1)
                  ])]),
                  _: 1
                })
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
                createTextVNode("Revisiones completadas", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_card_text, null, {
              default: withCtx(() => [
                createVNode(_component_v_list, null, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(completadas.value, (a) => {
                      return openBlock(), createBlock(_component_v_list_item, {
                        key: a.id,
                        title: a.titulo,
                        subtitle: a.convocatoria
                      }, null, 8, ["title", "subtitle"]);
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
      ]);
    };
  }
};
export {
  _sfc_main as default
};
