import { u as useAuthStore, i as createElementBlock, b as createVNode, w as withCtx, r as resolveComponent, o as openBlock, h as createBaseVNode, t as toDisplayString, e as unref, d as createTextVNode, F as Fragment, j as renderList, c as createBlock, m as computed } from "./index.js";
import { u as useAutorStore } from "./index2.js";
const _hoisted_1 = { class: "text-h6" };
const _hoisted_2 = { class: "text-h4" };
const _hoisted_3 = { class: "text-h4" };
const _hoisted_4 = { class: "text-h4" };
const _hoisted_5 = { class: "text-h4" };
const _hoisted_6 = { class: "text-caption" };
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const auth = useAuthStore();
    const autorStore = useAutorStore();
    const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter((c) => c.estado === "ABIERTA"));
    const ESTADOS = {
      BORRADOR: "Borrador",
      ENVIADO: "Enviado",
      EN_REVISION: "En revisión",
      ACEPTADO: "Aceptado",
      RECHAZADO: "Rechazado"
    };
    function estadoLabel(estado) {
      return ESTADOS[estado] ?? estado;
    }
    return (_ctx, _cache) => {
      const _component_v_col = resolveComponent("v-col");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list = resolveComponent("v-list");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_row, {
          class: "mb-4",
          align: "center"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_col, null, {
              default: withCtx(() => {
                var _a;
                return [
                  createBaseVNode("h1", _hoisted_1, "Bienvenido, " + toDisplayString((_a = unref(auth).usuario) == null ? void 0 : _a.nombre), 1),
                  _cache[0] || (_cache[0] = createBaseVNode("p", { class: "text-body-2" }, "Gestiona tus manuscritos y sigue el progreso de tus envíos.", -1))
                ];
              }),
              _: 1
            }),
            createVNode(_component_v_col, { cols: "auto" }, {
              default: withCtx(() => [
                createVNode(_component_v_btn, {
                  color: "primary",
                  to: "/autor/nuevo"
                }, {
                  default: withCtx(() => [..._cache[1] || (_cache[1] = [
                    createTextVNode("Nuevo artículo", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
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
                        createBaseVNode("div", _hoisted_2, toDisplayString(unref(autorStore).manuscritos.filter((m) => m.estado !== "BORRADOR").length), 1),
                        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "text-caption" }, "Enviados", -1))
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
                        createBaseVNode("div", _hoisted_3, toDisplayString(unref(autorStore).manuscritos.filter((m) => m.estado === "EN_REVISION").length), 1),
                        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "text-caption" }, "En revisión", -1))
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
                        createBaseVNode("div", _hoisted_4, toDisplayString(unref(autorStore).manuscritos.filter((m) => m.estado === "ACEPTADO").length), 1),
                        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "text-caption" }, "Aceptados", -1))
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
                        createBaseVNode("div", _hoisted_5, toDisplayString(unref(autorStore).manuscritos.filter((m) => m.estado === "BORRADOR").length), 1),
                        _cache[5] || (_cache[5] = createBaseVNode("div", { class: "text-caption" }, "Borradores", -1))
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
              default: withCtx(() => [..._cache[6] || (_cache[6] = [
                createTextVNode("Mis artículos recientes", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_card_text, null, {
              default: withCtx(() => [
                createVNode(_component_v_list, null, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(autorStore).manuscritos.slice(0, 4), (m) => {
                      return openBlock(), createBlock(_component_v_list_item, {
                        key: m.id,
                        title: m.titulo,
                        subtitle: m.convocatoria + (m.fechaEnvio ? " · " + m.fechaEnvio : "")
                      }, {
                        append: withCtx(() => [
                          createBaseVNode("span", _hoisted_6, toDisplayString(estadoLabel(m.estado)), 1)
                        ]),
                        _: 2
                      }, 1032, ["title", "subtitle"]);
                    }), 128))
                  ]),
                  _: 1
                }),
                createVNode(_component_v_btn, {
                  variant: "text",
                  color: "primary",
                  to: "/autor/articulos"
                }, {
                  default: withCtx(() => [..._cache[7] || (_cache[7] = [
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
              default: withCtx(() => [..._cache[8] || (_cache[8] = [
                createTextVNode("Convocatorias abiertas", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_card_text, null, {
              default: withCtx(() => [
                createVNode(_component_v_list, null, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(convocatoriasAbiertas.value, (c) => {
                      return openBlock(), createBlock(_component_v_list_item, {
                        key: c.id,
                        title: c.nombre,
                        subtitle: "Deadline: " + c.deadline
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
