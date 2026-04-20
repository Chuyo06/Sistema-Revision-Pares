import { u as useAuthStore, c as createElementBlock, a as createBaseVNode, b as createVNode, w as withCtx, F as Fragment, r as renderList, d as unref, t as toDisplayString, e as createCommentVNode, f as withModifiers, g as resolveComponent, h as ref, i as useRouter, o as openBlock, j as createTextVNode } from "./index.js";
const _hoisted_1 = { style: { "min-height": "100vh", "background": "#f5f0e8", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "24px" } };
const _hoisted_2 = { style: { "display": "flex", "width": "100%", "max-width": "860px", "background": "#fdfbf5", "border-radius": "16px", "overflow": "hidden", "box-shadow": "0 4px 24px rgba(93,64,55,0.12)", "border": "1px solid #e8ddd0" } };
const _hoisted_3 = {
  style: { "flex": "1", "min-width": "0", "background": "linear-gradient(160deg,#5d4037 0%,#8d6e63 100%)", "padding": "48px 40px", "display": "flex", "flex-direction": "column", "justify-content": "center", "position": "relative", "overflow": "hidden" },
  class: "d-none d-md-flex"
};
const _hoisted_4 = { style: { "position": "relative", "z-index": "1" } };
const _hoisted_5 = { style: { "background": "rgba(255,255,255,0.15)", "border-radius": "50%", "width": "56px", "height": "56px", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "20px" } };
const _hoisted_6 = { style: { "display": "flex", "flex-wrap": "wrap", "gap": "8px", "margin-top": "28px" } };
const _hoisted_7 = { style: { "width": "360px", "flex-shrink": "0", "padding": "40px 32px", "display": "flex", "flex-direction": "column", "justify-content": "center" } };
const _hoisted_8 = { class: "d-flex d-md-none align-center justify-center mb-6" };
const _hoisted_9 = {
  key: 0,
  style: { "background": "#fce8e8", "border": "1px solid #f5c6c6", "border-radius": "8px", "padding": "10px 14px", "margin-bottom": "16px", "display": "flex", "align-items": "center", "gap": "8px" }
};
const _hoisted_10 = { style: { "font-size": "13px", "color": "#c62828", "flex": "1" } };
const _hoisted_11 = { style: { "margin-bottom": "14px" } };
const _hoisted_12 = { style: { "margin-bottom": "20px" } };
const _hoisted_13 = { style: { "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "8px" } };
const _hoisted_14 = ["disabled", "onClick"];
const _hoisted_15 = { style: { "font-size": "13px", "font-weight": "500", "color": "#3e2723" } };
const _sfc_main = {
  __name: "LoginPage",
  setup(__props) {
    const auth = useAuthStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const mostrarPass = ref(false);
    const usuariosDemo = [
      { email: "autor@demo.com", password: "1234", rol: "Autor", icon: "mdi-account-edit-outline", color: "#546e7a" },
      { email: "revisor@demo.com", password: "1234", rol: "Revisor", icon: "mdi-clipboard-check-outline", color: "#558b2f" },
      { email: "editor@demo.com", password: "1234", rol: "Editor", icon: "mdi-pencil-ruler", color: "#e65100" },
      { email: "admin@demo.com", password: "1234", rol: "Admin", icon: "mdi-shield-account-outline", color: "#7b1fa2" }
    ];
    async function iniciarSesion() {
      try {
        const usuario = await auth.login(email.value, password.value);
        router.push(`/${usuario.rolActivo}/dashboard`);
      } catch {
      }
    }
    function loginRapido(demo) {
      email.value = demo.email;
      password.value = demo.password;
      iniciarSesion();
    }
    return (_ctx, _cache) => {
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_text_field = resolveComponent("v-text-field");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createVNode(_component_v_icon, {
              size: "200",
              style: { "position": "absolute", "right": "-40px", "bottom": "-30px", "color": "rgba(255,255,255,0.06)" }
            }, {
              default: withCtx(() => [..._cache[6] || (_cache[6] = [
                createTextVNode(" mdi-book-open-page-variant ", -1)
              ])]),
              _: 1
            }),
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createVNode(_component_v_icon, {
                  color: "white",
                  size: "28"
                }, {
                  default: withCtx(() => [..._cache[7] || (_cache[7] = [
                    createTextVNode("mdi-book-open-page-variant", -1)
                  ])]),
                  _: 1
                })
              ]),
              _cache[8] || (_cache[8] = createBaseVNode("div", { style: { "font-size": "24px", "font-weight": "700", "color": "#fff", "line-height": "1.3", "margin-bottom": "10px" } }, " Sistema de Revisión por Pares ", -1)),
              _cache[9] || (_cache[9] = createBaseVNode("div", { style: { "font-size": "14px", "color": "rgba(255,255,255,0.75)", "line-height": "1.6" } }, " Plataforma académica para la gestión de congresos y revistas científicas. ", -1)),
              createBaseVNode("div", _hoisted_6, [
                (openBlock(), createElementBlock(Fragment, null, renderList(["Autor", "Revisor", "Editor", "Admin"], (r) => {
                  return createBaseVNode("span", {
                    key: r,
                    style: { "background": "rgba(255,255,255,0.15)", "color": "rgba(255,255,255,0.9)", "padding": "4px 12px", "border-radius": "20px", "font-size": "12px", "font-weight": "500" }
                  }, toDisplayString(r), 1);
                }), 64))
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createVNode(_component_v_icon, {
                color: "primary",
                size: "32"
              }, {
                default: withCtx(() => [..._cache[10] || (_cache[10] = [
                  createTextVNode("mdi-book-open-page-variant", -1)
                ])]),
                _: 1
              }),
              _cache[11] || (_cache[11] = createBaseVNode("span", { style: { "font-size": "17px", "font-weight": "700", "color": "#3e2723", "margin-left": "8px" } }, "Rev. por Pares", -1))
            ]),
            _cache[17] || (_cache[17] = createBaseVNode("div", { style: { "font-size": "22px", "font-weight": "700", "color": "#3e2723", "margin-bottom": "4px" } }, "Iniciar sesión", -1)),
            _cache[18] || (_cache[18] = createBaseVNode("div", { style: { "font-size": "13px", "color": "#8d6e63", "margin-bottom": "24px" } }, "Ingresa tus credenciales", -1)),
            unref(auth).error ? (openBlock(), createElementBlock("div", _hoisted_9, [
              createVNode(_component_v_icon, {
                color: "error",
                size: "16"
              }, {
                default: withCtx(() => [..._cache[12] || (_cache[12] = [
                  createTextVNode("mdi-alert-circle-outline", -1)
                ])]),
                _: 1
              }),
              createBaseVNode("span", _hoisted_10, toDisplayString(unref(auth).error), 1),
              createVNode(_component_v_btn, {
                icon: "",
                variant: "text",
                size: "x-small",
                onClick: _cache[0] || (_cache[0] = ($event) => unref(auth).error = null)
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_icon, { size: "14" }, {
                    default: withCtx(() => [..._cache[13] || (_cache[13] = [
                      createTextVNode("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            createBaseVNode("form", {
              onSubmit: withModifiers(iniciarSesion, ["prevent"])
            }, [
              createBaseVNode("div", _hoisted_11, [
                _cache[14] || (_cache[14] = createBaseVNode("label", { style: { "font-size": "13px", "font-weight": "600", "color": "#5d4037", "display": "block", "margin-bottom": "6px" } }, " Correo electrónico ", -1)),
                createVNode(_component_v_text_field, {
                  modelValue: email.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => email.value = $event),
                  type: "email",
                  placeholder: "tu@correo.com",
                  "prepend-inner-icon": "mdi-email-outline",
                  density: "compact",
                  "hide-details": "",
                  required: "",
                  disabled: unref(auth).cargando
                }, null, 8, ["modelValue", "disabled"])
              ]),
              createBaseVNode("div", _hoisted_12, [
                _cache[15] || (_cache[15] = createBaseVNode("label", { style: { "font-size": "13px", "font-weight": "600", "color": "#5d4037", "display": "block", "margin-bottom": "6px" } }, " Contraseña ", -1)),
                createVNode(_component_v_text_field, {
                  modelValue: password.value,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => password.value = $event),
                  type: mostrarPass.value ? "text" : "password",
                  placeholder: "••••••••",
                  "prepend-inner-icon": "mdi-lock-outline",
                  "append-inner-icon": mostrarPass.value ? "mdi-eye-off" : "mdi-eye",
                  density: "compact",
                  "hide-details": "",
                  required: "",
                  disabled: unref(auth).cargando,
                  "onClick:appendInner": _cache[3] || (_cache[3] = ($event) => mostrarPass.value = !mostrarPass.value)
                }, null, 8, ["modelValue", "type", "append-inner-icon", "disabled"])
              ]),
              createVNode(_component_v_btn, {
                type: "submit",
                color: "primary",
                block: "",
                loading: unref(auth).cargando,
                rounded: "lg",
                size: "large",
                elevation: "0"
              }, {
                default: withCtx(() => [..._cache[16] || (_cache[16] = [
                  createTextVNode(" Entrar ", -1)
                ])]),
                _: 1
              }, 8, ["loading"])
            ], 32),
            _cache[19] || (_cache[19] = createBaseVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "10px", "margin": "20px 0" } }, [
              createBaseVNode("div", { style: { "flex": "1", "height": "1px", "background": "#e8ddd0" } }),
              createBaseVNode("span", { style: { "font-size": "12px", "color": "#bda89a" } }, "Accesos demo"),
              createBaseVNode("div", { style: { "flex": "1", "height": "1px", "background": "#e8ddd0" } })
            ], -1)),
            createBaseVNode("div", _hoisted_13, [
              (openBlock(), createElementBlock(Fragment, null, renderList(usuariosDemo, (demo) => {
                return createBaseVNode("button", {
                  key: demo.email,
                  type: "button",
                  disabled: unref(auth).cargando,
                  onClick: ($event) => loginRapido(demo),
                  style: { "border": "1px solid #d7ccc8", "background": "#fdfbf5", "border-radius": "8px", "padding": "8px 10px", "cursor": "pointer", "display": "flex", "align-items": "center", "gap": "8px", "transition": "background 0.15s" },
                  onMouseenter: _cache[4] || (_cache[4] = (e) => e.currentTarget.style.background = "#f0e9df"),
                  onMouseleave: _cache[5] || (_cache[5] = (e) => e.currentTarget.style.background = "#fdfbf5")
                }, [
                  createVNode(_component_v_icon, {
                    color: demo.color,
                    size: "16"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(demo.icon), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"]),
                  createBaseVNode("span", _hoisted_15, toDisplayString(demo.rol), 1)
                ], 40, _hoisted_14);
              }), 64))
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
