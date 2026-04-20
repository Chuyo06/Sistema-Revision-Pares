import { u as useAuthStore, i as useRouter, g as resolveComponent, o as openBlock, c as createElementBlock, d as unref, k as createBlock, w as withCtx, b as createVNode, F as Fragment, r as renderList, l as createSlots, j as createTextVNode, t as toDisplayString, a as createBaseVNode, m as mergeProps, n as normalizeStyle, e as createCommentVNode, p as computed, _ as _export_sfc, q as useDisplay, s as useRoute, h as ref } from "./index.js";
const _hoisted_1$1 = { style: { "display": "flex", "align-items": "center", "gap": "10px", "width": "100%" } };
const _hoisted_2$1 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_3$1 = { style: { "font-size": "14px", "font-weight": "600", "color": "#3e2723", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" } };
const _hoisted_4$1 = { style: { "font-size": "12px", "color": "#8d6e63" } };
const _sfc_main$1 = {
  __name: "RoleSwitcher",
  setup(__props) {
    const auth = useAuthStore();
    const router = useRouter();
    const ROL_META = {
      autor: { label: "Autor", icon: "mdi-account-edit-outline", color: "#546e7a" },
      revisor: { label: "Revisor", icon: "mdi-clipboard-check-outline", color: "#558b2f" },
      editor: { label: "Editor", icon: "mdi-pencil-ruler", color: "#e65100" },
      administrador: { label: "Administrador", icon: "mdi-shield-account-outline", color: "#c62828" }
    };
    const rolMeta = computed(() => ROL_META[auth.rol] || { label: auth.rol, icon: "mdi-account", color: "#8d6e63" });
    function cambiarRolUi(nuevoRol) {
      auth.cambiarRol(nuevoRol);
      window.location.href = `/${nuevoRol.toLowerCase()}/dashboard`;
    }
    function cerrarSesion() {
      auth.logout();
      router.push("/login");
    }
    return (_ctx, _cache) => {
      var _a, _b, _c;
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_list_item_title = resolveComponent("v-list-item-title");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_menu = resolveComponent("v-menu");
      const _component_v_btn = resolveComponent("v-btn");
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        unref(auth).tieneMultiplesRoles ? (openBlock(), createBlock(_component_v_menu, {
          key: 0,
          location: "top start"
        }, {
          activator: withCtx(({ props }) => [
            createBaseVNode("div", mergeProps(props, {
              style: [{ "cursor": "pointer" }, `background:${rolMeta.value.color}; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0`],
              title: "Cambiar rol"
            }), [
              createVNode(_component_v_icon, {
                color: "white",
                size: "18"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(rolMeta.value.icon), 1)
                ]),
                _: 1
              })
            ], 16)
          ]),
          default: withCtx(() => [
            createVNode(_component_v_list, null, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(auth).roles, (rolOption) => {
                  return openBlock(), createBlock(_component_v_list_item, {
                    key: rolOption,
                    onClick: ($event) => cambiarRolUi(rolOption)
                  }, createSlots({
                    prepend: withCtx(() => {
                      var _a2;
                      return [
                        createVNode(_component_v_icon, {
                          color: ((_a2 = ROL_META[rolOption.toLowerCase()]) == null ? void 0 : _a2.color) || "#8d6e63"
                        }, {
                          default: withCtx(() => {
                            var _a3;
                            return [
                              createTextVNode(toDisplayString(((_a3 = ROL_META[rolOption.toLowerCase()]) == null ? void 0 : _a3.icon) || "mdi-account"), 1)
                            ];
                          }),
                          _: 2
                        }, 1032, ["color"])
                      ];
                    }),
                    default: withCtx(() => [
                      createVNode(_component_v_list_item_title, null, {
                        default: withCtx(() => {
                          var _a2;
                          return [
                            createTextVNode(toDisplayString(((_a2 = ROL_META[rolOption.toLowerCase()]) == null ? void 0 : _a2.label) || rolOption), 1)
                          ];
                        }),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, [
                    rolOption.toLowerCase() === unref(auth).rol.toLowerCase() ? {
                      name: "append",
                      fn: withCtx(() => [
                        createVNode(_component_v_icon, {
                          color: "success",
                          size: "small",
                          class: "ml-2"
                        }, {
                          default: withCtx(() => [..._cache[0] || (_cache[0] = [
                            createTextVNode("mdi-check-circle", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      key: "0"
                    } : void 0
                  ]), 1032, ["onClick"]);
                }), 128))
              ]),
              _: 1
            })
          ]),
          _: 1
        })) : (openBlock(), createElementBlock("div", {
          key: 1,
          style: normalizeStyle(`background:${rolMeta.value.color}; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0`)
        }, [
          createVNode(_component_v_icon, {
            color: "white",
            size: "18"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(rolMeta.value.icon), 1)
            ]),
            _: 1
          })
        ], 4)),
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, toDisplayString(((_a = unref(auth).usuario) == null ? void 0 : _a.nombre) || ((_c = (_b = unref(auth).usuario) == null ? void 0 : _b.email) == null ? void 0 : _c.split("@")[0])), 1),
          createBaseVNode("div", _hoisted_4$1, [
            createTextVNode(toDisplayString(rolMeta.value.label) + " ", 1),
            unref(auth).tieneMultiplesRoles ? (openBlock(), createBlock(_component_v_icon, {
              key: 0,
              size: "10",
              color: "#8d6e63"
            }, {
              default: withCtx(() => [..._cache[1] || (_cache[1] = [
                createTextVNode("mdi-chevron-up", -1)
              ])]),
              _: 1
            })) : createCommentVNode("", true)
          ])
        ]),
        createVNode(_component_v_btn, {
          icon: "",
          variant: "text",
          size: "small",
          onClick: cerrarSesion,
          title: "Cerrar sesión"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_icon, {
              size: "18",
              color: "#c62828"
            }, {
              default: withCtx(() => [..._cache[2] || (_cache[2] = [
                createTextVNode("mdi-logout", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
};
const _hoisted_1 = { class: "pa-5 pb-3" };
const _hoisted_2 = { style: { "display": "flex", "align-items": "center", "gap": "12px" } };
const _hoisted_3 = { style: { "background": "#5d4037", "border-radius": "50%", "width": "38px", "height": "38px", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" } };
const _hoisted_4 = { style: { "font-size": "15px", "font-weight": "500" } };
const _hoisted_5 = {
  class: "pa-4",
  style: { "display": "flex", "align-items": "center", "gap": "10px" }
};
const _hoisted_6 = {
  key: 0,
  style: { "background": "#fdfbf5", "border-bottom": "1px solid #e8ddd0", "display": "flex", "align-items": "center", "padding": "10px 14px", "gap": "10px" }
};
const _hoisted_7 = { style: { "font-size": "16px", "font-weight": "700", "color": "#3e2723" } };
const _sfc_main = {
  __name: "AppLayout",
  setup(__props) {
    const auth = useAuthStore();
    useRouter();
    const route = useRoute();
    const { smAndUp } = useDisplay();
    const drawer = ref(true);
    const NAV_CONFIG = {
      autor: [
        { icon: "mdi-home-outline", label: "Inicio", to: "/autor/dashboard" },
        { icon: "mdi-file-document-multiple-outline", label: "Mis artículos", to: "/autor/articulos" },
        { icon: "mdi-plus-circle-outline", label: "Enviar artículo", to: "/autor/nuevo" }
      ],
      revisor: [
        { icon: "mdi-home-outline", label: "Inicio", to: "/revisor/dashboard" },
        { icon: "mdi-clipboard-list-outline", label: "Artículos asignados", to: "/revisor/asignados" }
      ],
      editor: [
        { icon: "mdi-home-outline", label: "Inicio", to: "/editor/dashboard" },
        { icon: "mdi-file-document-multiple-outline", label: "Manuscritos", to: "/editor/manuscritos" }
      ],
      administrador: [
        { icon: "mdi-home-outline", label: "Inicio", to: "/administrador/dashboard" },
        { icon: "mdi-account-group-outline", label: "Usuarios", to: "/administrador/usuarios" },
        { icon: "mdi-file-document-outline", label: "Manuscritos", to: "/administrador/manuscritos" }
      ]
    };
    const navItems = computed(() => NAV_CONFIG[auth.rol] || []);
    const TITULOS = {
      "autor-dashboard": "Inicio",
      "autor-articulos": "Mis Artículos",
      "autor-nuevo": "Enviar Artículo",
      "revisor-dashboard": "Inicio",
      "revisor-asignados": "Artículos Asignados",
      "revisor-revision": "Revisión",
      "editor-dashboard": "Panel Editorial",
      "editor-manuscritos": "Manuscritos",
      "editor-asignacion": "Asignación",
      "admin-dashboard": "Administración",
      "admin-usuarios": "Usuarios",
      "admin-manuscritos": "Manuscritos Globales"
    };
    const titulo = computed(() => TITULOS[route.name] ?? "Rev. por Pares");
    return (_ctx, _cache) => {
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_navigation_drawer = resolveComponent("v-navigation-drawer");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_router_view = resolveComponent("router-view");
      const _component_v_main = resolveComponent("v-main");
      const _component_v_layout = resolveComponent("v-layout");
      return openBlock(), createBlock(_component_v_layout, null, {
        default: withCtx(() => [
          createVNode(_component_v_navigation_drawer, {
            modelValue: drawer.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => drawer.value = $event),
            permanent: unref(smAndUp),
            width: "260",
            color: "#fdfbf5",
            border: "end",
            elevation: "0"
          }, {
            append: withCtx(() => [
              createVNode(_component_v_divider, { class: "mx-3 mb-2" }),
              createBaseVNode("div", _hoisted_5, [
                createVNode(_sfc_main$1)
              ])
            ]),
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                createBaseVNode("div", _hoisted_2, [
                  createBaseVNode("div", _hoisted_3, [
                    createVNode(_component_v_icon, {
                      color: "white",
                      size: "20"
                    }, {
                      default: withCtx(() => [..._cache[2] || (_cache[2] = [
                        createTextVNode("mdi-book-open-page-variant", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _cache[3] || (_cache[3] = createBaseVNode("div", null, [
                    createBaseVNode("div", { style: { "font-size": "15px", "font-weight": "700", "color": "#3e2723", "line-height": "1.2" } }, " Rev. por Pares "),
                    createBaseVNode("div", { style: { "font-size": "11px", "color": "#8d6e63" } }, "Sistema académico")
                  ], -1))
                ])
              ]),
              createVNode(_component_v_divider, { class: "mb-2" }),
              createVNode(_component_v_list, {
                nav: "",
                class: "px-2"
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(navItems.value, (item) => {
                    return openBlock(), createBlock(_component_v_list_item, {
                      key: item.to,
                      to: item.to,
                      rounded: "xl",
                      "active-color": "primary",
                      class: "mb-1 nav-item",
                      "min-height": "44"
                    }, {
                      prepend: withCtx(() => [
                        createVNode(_component_v_icon, { size: "22" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.icon), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      title: withCtx(() => [
                        createBaseVNode("span", _hoisted_4, toDisplayString(item.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"]);
                  }), 128))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue", "permanent"]),
          createVNode(_component_v_main, { style: { "background": "#f5f0e8" } }, {
            default: withCtx(() => [
              !unref(smAndUp) ? (openBlock(), createElementBlock("div", _hoisted_6, [
                createVNode(_component_v_btn, {
                  icon: "",
                  variant: "text",
                  size: "small",
                  onClick: _cache[1] || (_cache[1] = ($event) => drawer.value = !drawer.value)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_icon, null, {
                      default: withCtx(() => [..._cache[4] || (_cache[4] = [
                        createTextVNode("mdi-menu", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createBaseVNode("span", _hoisted_7, toDisplayString(titulo.value), 1)
              ])) : createCommentVNode("", true),
              (openBlock(), createBlock(_component_router_view, {
                key: _ctx.$route.fullPath
              }))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
};
const AppLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dc972747"]]);
export {
  AppLayout as default
};
