import { u as useAdminStore } from "./index5.js";
import { v as onMounted, c as createElementBlock, a as createBaseVNode, b as createVNode, w as withCtx, F as Fragment, r as renderList, t as toDisplayString, d as unref, g as resolveComponent, p as computed, o as openBlock, j as createTextVNode, n as normalizeStyle } from "./index.js";
import "./usuarios.js";
import "./manuscritos.js";
const _hoisted_1 = { style: { "background": "linear-gradient(135deg,#7b1fa2 0%,#ab47bc 100%)", "padding": "32px 28px 24px", "position": "relative", "overflow": "hidden" } };
const _hoisted_2 = { style: { "display": "grid", "grid-template-columns": "1fr 300px", "gap": "20px", "padding": "20px", "max-width": "1100px" } };
const _hoisted_3 = { style: { "padding": "14px 16px", "display": "flex", "align-items": "center", "gap": "12px" } };
const _hoisted_4 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_5 = { style: { "font-size": "14px", "font-weight": "600", "color": "#3e2723" } };
const _hoisted_6 = { style: { "font-size": "12px", "color": "#8d6e63" } };
const _hoisted_7 = { style: { "font-size": "24px", "font-weight": "700", "color": "#3e2723" } };
const _hoisted_8 = { style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "overflow": "hidden" } };
const _hoisted_9 = { style: { "font-size": "13px", "color": "#5d4037" } };
const _hoisted_10 = { style: { "font-size": "18px", "font-weight": "700", "color": "#3e2723" } };
const _hoisted_11 = { style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "10px 14px", "border-top": "1px solid #f0e9df", "background": "#fafafa" } };
const _hoisted_12 = { style: { "font-size": "18px", "font-weight": "700", "color": "#7b1fa2" } };
const _sfc_main = {
  __name: "DashboardPage",
  setup(__props) {
    const adminStore = useAdminStore();
    onMounted(() => {
      adminStore.cargarUsuarios();
    });
    const kpis = computed(() => [
      { label: "Total usuarios", valor: adminStore.metricas.totalUsuarios },
      { label: "Activos", valor: adminStore.metricas.activos },
      { label: "Inactivos", valor: adminStore.metricas.inactivos }
    ]);
    const rolesDistribucion = computed(() => [
      { nombre: "Autores", cantidad: adminStore.metricas.autores, icon: "mdi-account-edit-outline", hex: "#546e7a" },
      { nombre: "Revisores", cantidad: adminStore.metricas.revisores, icon: "mdi-clipboard-check-outline", hex: "#558b2f" },
      { nombre: "Editores", cantidad: adminStore.metricas.editores, icon: "mdi-pencil-ruler", hex: "#e65100" }
    ]);
    return (_ctx, _cache) => {
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_btn = resolveComponent("v-btn");
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1, [
          createVNode(_component_v_icon, {
            size: "120",
            style: { "position": "absolute", "right": "-16px", "bottom": "-20px", "color": "rgba(255,255,255,0.08)" }
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" mdi-shield-account ", -1)
            ])]),
            _: 1
          }),
          _cache[2] || (_cache[2] = createBaseVNode("div", { style: { "color": "rgba(255,255,255,0.7)", "font-size": "12px", "text-transform": "uppercase", "letter-spacing": "0.08em", "margin-bottom": "4px" } }, "Administrador", -1)),
          _cache[3] || (_cache[3] = createBaseVNode("div", { style: { "font-size": "22px", "font-weight": "700", "color": "#fff", "margin-bottom": "4px" } }, "Panel de Administración", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("div", { style: { "font-size": "14px", "color": "rgba(255,255,255,0.75)" } }, "Gestión de usuarios del sistema", -1)),
          createVNode(_component_v_btn, {
            color: "white",
            class: "mt-4",
            style: { "color": "#7b1fa2" },
            "prepend-icon": "mdi-account-group-outline",
            rounded: "xl",
            elevation: "0",
            to: "/administrador/usuarios"
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" Gestionar usuarios ", -1)
            ])]),
            _: 1
          })
        ]),
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", null, [
            _cache[5] || (_cache[5] = createBaseVNode("div", { style: { "font-size": "13px", "font-weight": "700", "color": "#8d6e63", "text-transform": "uppercase", "letter-spacing": "0.05em", "margin-bottom": "10px" } }, " Distribución de roles ", -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(rolesDistribucion.value, (rol) => {
              return openBlock(), createElementBlock("div", {
                key: rol.nombre,
                style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "margin-bottom": "10px", "overflow": "hidden" }
              }, [
                createBaseVNode("div", {
                  style: normalizeStyle(`height:5px; background:${rol.hex}`)
                }, null, 4),
                createBaseVNode("div", _hoisted_3, [
                  createBaseVNode("div", {
                    style: normalizeStyle(`background:${rol.hex}22; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0`)
                  }, [
                    createVNode(_component_v_icon, {
                      color: rol.hex,
                      size: "18"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(rol.icon), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ], 4),
                  createBaseVNode("div", _hoisted_4, [
                    createBaseVNode("div", _hoisted_5, toDisplayString(rol.nombre), 1),
                    createBaseVNode("div", _hoisted_6, toDisplayString(rol.cantidad) + " usuario(s) registrado(s)", 1)
                  ]),
                  createBaseVNode("span", _hoisted_7, toDisplayString(rol.cantidad), 1)
                ])
              ]);
            }), 128))
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_8, [
              _cache[7] || (_cache[7] = createBaseVNode("div", { style: { "background": "#7b1fa2", "padding": "10px 14px" } }, [
                createBaseVNode("span", { style: { "font-size": "13px", "font-weight": "600", "color": "#fff" } }, "Usuarios del sistema")
              ], -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(kpis.value, (kpi) => {
                return openBlock(), createElementBlock("div", {
                  key: kpi.label,
                  style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "10px 14px", "border-top": "1px solid #f0e9df" }
                }, [
                  createBaseVNode("span", _hoisted_9, toDisplayString(kpi.label), 1),
                  createBaseVNode("span", _hoisted_10, toDisplayString(kpi.valor), 1)
                ]);
              }), 128)),
              createBaseVNode("div", _hoisted_11, [
                _cache[6] || (_cache[6] = createBaseVNode("span", { style: { "font-size": "13px", "color": "#5d4037" } }, "Total Manuscritos", -1)),
                createBaseVNode("span", _hoisted_12, toDisplayString(unref(adminStore).metricas.totalManuscritos), 1)
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
