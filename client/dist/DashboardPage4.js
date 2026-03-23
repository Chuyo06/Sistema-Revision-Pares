import { u as useAdminStore } from "./index5.js";
import { i as createElementBlock, h as createBaseVNode, b as createVNode, w as withCtx, r as resolveComponent, o as openBlock, F as Fragment, j as renderList, c as createBlock, t as toDisplayString, d as createTextVNode, m as computed } from "./index.js";
const _hoisted_1 = { class: "text-h4" };
const _hoisted_2 = { class: "text-caption" };
const _hoisted_3 = { class: "font-weight-bold" };
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const adminStore = useAdminStore();
    const kpis = computed(() => [
      { label: "Total", valor: adminStore.metricas.totalUsuarios },
      { label: "Autores", valor: adminStore.metricas.autores },
      { label: "Revisores", valor: adminStore.metricas.revisores },
      { label: "Editores", valor: adminStore.metricas.editores },
      { label: "Activos", valor: adminStore.metricas.activos },
      { label: "Inactivos", valor: adminStore.metricas.inactivos }
    ]);
    const rolesDistribucion = [
      { nombre: "Autores", cantidad: adminStore.metricas.autores },
      { nombre: "Revisores", cantidad: adminStore.metricas.revisores },
      { nombre: "Editores", cantidad: adminStore.metricas.editores }
    ];
    return (_ctx, _cache) => {
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_btn = resolveComponent("v-btn");
      return openBlock(), createElementBlock("div", null, [
        _cache[2] || (_cache[2] = createBaseVNode("h1", { class: "text-h6 mb-1" }, "Panel de Administración", -1)),
        _cache[3] || (_cache[3] = createBaseVNode("p", { class: "text-body-2 mb-4" }, "Gestión del sistema.", -1)),
        createVNode(_component_v_row, { class: "mb-4" }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(kpis.value, (kpi) => {
              return openBlock(), createBlock(_component_v_col, {
                cols: "6",
                sm: "4",
                md: "2",
                key: kpi.label
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_card, null, {
                    default: withCtx(() => [
                      createVNode(_component_v_card_text, { class: "text-center" }, {
                        default: withCtx(() => [
                          createBaseVNode("div", _hoisted_1, toDisplayString(kpi.valor), 1),
                          createBaseVNode("div", _hoisted_2, toDisplayString(kpi.label), 1)
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
        createVNode(_component_v_card, null, {
          default: withCtx(() => [
            createVNode(_component_v_card_title, null, {
              default: withCtx(() => [..._cache[0] || (_cache[0] = [
                createTextVNode("Distribución de usuarios", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_card_text, null, {
              default: withCtx(() => [
                createVNode(_component_v_list, { density: "compact" }, {
                  default: withCtx(() => [
                    (openBlock(), createElementBlock(Fragment, null, renderList(rolesDistribucion, (rol) => {
                      return createVNode(_component_v_list_item, {
                        key: rol.nombre,
                        title: rol.nombre
                      }, {
                        append: withCtx(() => [
                          createBaseVNode("span", _hoisted_3, toDisplayString(rol.cantidad), 1)
                        ]),
                        _: 2
                      }, 1032, ["title"]);
                    }), 64))
                  ]),
                  _: 1
                }),
                createVNode(_component_v_btn, {
                  color: "primary",
                  variant: "text",
                  to: "/administrador/usuarios",
                  class: "mt-2"
                }, {
                  default: withCtx(() => [..._cache[1] || (_cache[1] = [
                    createTextVNode("Gestionar usuarios", -1)
                  ])]),
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
