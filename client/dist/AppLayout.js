import { u as useAuthStore, c as createBlock, w as withCtx, r as resolveComponent, a as useRouter, l as useRoute, o as openBlock, b as createVNode, i as createElementBlock, F as Fragment, j as renderList, d as createTextVNode, t as toDisplayString, h as createBaseVNode, e as unref, k as ref, m as computed } from "./index.js";
const _hoisted_1 = { class: "text-caption mr-4" };
const _sfc_main = {
  __name: "AppLayout",
  setup(__props) {
    const auth = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const drawer = ref(true);
    const NAV_CONFIG = {
      autor: [
        { icon: "mdi-view-dashboard", label: "Dashboard", to: "/autor/dashboard" },
        { icon: "mdi-file-document-multiple", label: "Mis artículos", to: "/autor/articulos" },
        { icon: "mdi-plus-circle", label: "Enviar artículo", to: "/autor/nuevo" }
      ],
      revisor: [
        { icon: "mdi-view-dashboard", label: "Dashboard", to: "/revisor/dashboard" },
        { icon: "mdi-clipboard-list", label: "Artículos asignados", to: "/revisor/asignados" }
      ],
      editor: [
        { icon: "mdi-view-dashboard", label: "Dashboard", to: "/editor/dashboard" },
        { icon: "mdi-file-document-multiple", label: "Manuscritos", to: "/editor/manuscritos" }
      ],
      administrador: [
        { icon: "mdi-view-dashboard", label: "Dashboard", to: "/administrador/dashboard" },
        { icon: "mdi-account-group", label: "Usuarios", to: "/administrador/usuarios" }
      ]
    };
    const navItems = computed(() => NAV_CONFIG[auth.rol] || []);
    const TITULOS = {
      "autor-dashboard": "Dashboard",
      "autor-articulos": "Mis Artículos",
      "autor-nuevo": "Enviar Artículo",
      "revisor-dashboard": "Dashboard",
      "revisor-asignados": "Artículos Asignados",
      "revisor-revision": "Formulario de Revisión",
      "editor-dashboard": "Panel Editorial",
      "editor-manuscritos": "Gestión de Manuscritos",
      "editor-asignacion": "Asignación de Revisores",
      "admin-dashboard": "Administración",
      "admin-usuarios": "Gestión de Usuarios"
    };
    const titulo = computed(() => TITULOS[route.name] || "Sistema de Revisión por Pares");
    function cerrarSesion() {
      auth.logout();
      router.push("/login");
    }
    return (_ctx, _cache) => {
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_navigation_drawer = resolveComponent("v-navigation-drawer");
      const _component_v_app_bar_title = resolveComponent("v-app-bar-title");
      const _component_v_app_bar = resolveComponent("v-app-bar");
      const _component_router_view = resolveComponent("router-view");
      const _component_v_container = resolveComponent("v-container");
      const _component_v_main = resolveComponent("v-main");
      const _component_v_layout = resolveComponent("v-layout");
      return openBlock(), createBlock(_component_v_layout, null, {
        default: withCtx(() => [
          createVNode(_component_v_navigation_drawer, {
            modelValue: drawer.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => drawer.value = $event),
            permanent: ""
          }, {
            append: withCtx(() => [
              createVNode(_component_v_divider),
              createVNode(_component_v_list, {
                density: "compact",
                nav: ""
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_list_item, {
                    "prepend-icon": "mdi-logout",
                    title: "Cerrar sesión",
                    onClick: cerrarSesion
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(_component_v_list_item, {
                title: "Rev. Pares",
                nav: "",
                class: "py-3"
              }),
              createVNode(_component_v_divider),
              createVNode(_component_v_list, {
                density: "compact",
                nav: "",
                class: "mt-2"
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(navItems.value, (item) => {
                    return openBlock(), createBlock(_component_v_list_item, {
                      key: item.to,
                      "prepend-icon": item.icon,
                      title: item.label,
                      to: item.to
                    }, null, 8, ["prepend-icon", "title", "to"]);
                  }), 128))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"]),
          createVNode(_component_v_main, null, {
            default: withCtx(() => [
              createVNode(_component_v_app_bar, { elevation: "1" }, {
                append: withCtx(() => {
                  var _a;
                  return [
                    createBaseVNode("span", _hoisted_1, toDisplayString((_a = unref(auth).usuario) == null ? void 0 : _a.nombre), 1)
                  ];
                }),
                default: withCtx(() => [
                  createVNode(_component_v_app_bar_title, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(titulo.value), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_v_container, {
                fluid: "",
                class: "pa-4"
              }, {
                default: withCtx(() => [
                  createVNode(_component_router_view)
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
};
export {
  _sfc_main as default
};
