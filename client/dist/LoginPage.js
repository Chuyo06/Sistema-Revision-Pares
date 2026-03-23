import { u as useAuthStore, c as createBlock, w as withCtx, r as resolveComponent, a as useRouter, o as openBlock, b as createVNode, d as createTextVNode, e as unref, t as toDisplayString, f as createCommentVNode, g as withModifiers, h as createBaseVNode, i as createElementBlock, F as Fragment, j as renderList, k as ref } from "./index.js";
const _sfc_main = {
  __name: "LoginPage",
  setup(__props) {
    const auth = useAuthStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const mostrarPass = ref(false);
    const usuariosDemo = [
      { email: "autor@demo.com", password: "1234", rol: "Autor" },
      { email: "revisor@demo.com", password: "1234", rol: "Revisor" },
      { email: "editor@demo.com", password: "1234", rol: "Editor" },
      { email: "admin@demo.com", password: "1234", rol: "Admin" }
    ];
    async function iniciarSesion() {
      try {
        const usuario = await auth.login(email.value, password.value);
        router.push(`/${usuario.rol}/dashboard`);
      } catch {
      }
    }
    function loginRapido(demo) {
      email.value = demo.email;
      password.value = demo.password;
      iniciarSesion();
    }
    return (_ctx, _cache) => {
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_container = resolveComponent("v-container");
      return openBlock(), createBlock(_component_v_container, {
        fluid: "",
        class: "fill-height"
      }, {
        default: withCtx(() => [
          createVNode(_component_v_row, {
            justify: "center",
            align: "center",
            class: "fill-height"
          }, {
            default: withCtx(() => [
              createVNode(_component_v_col, {
                cols: "12",
                sm: "6",
                md: "4"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_card, { class: "pa-4" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card_title, { class: "text-center" }, {
                        default: withCtx(() => [..._cache[3] || (_cache[3] = [
                          createTextVNode("Sistema de Revisión por Pares", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(_component_v_card_subtitle, { class: "text-center mb-2" }, {
                        default: withCtx(() => [..._cache[4] || (_cache[4] = [
                          createTextVNode("Ingrese sus credenciales", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(_component_v_card_text, null, {
                        default: withCtx(() => [
                          unref(auth).error ? (openBlock(), createBlock(_component_v_alert, {
                            key: 0,
                            type: "error",
                            class: "mb-4",
                            closable: "",
                            "onClick:close": _cache[0] || (_cache[0] = ($event) => unref(auth).error = null)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(auth).error), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_v_form, {
                            onSubmit: withModifiers(iniciarSesion, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_text_field, {
                                modelValue: email.value,
                                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => email.value = $event),
                                label: "Correo electrónico",
                                type: "email",
                                required: "",
                                disabled: unref(auth).cargando,
                                class: "mb-2"
                              }, null, 8, ["modelValue", "disabled"]),
                              createVNode(_component_v_text_field, {
                                modelValue: password.value,
                                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => password.value = $event),
                                label: "Contraseña",
                                type: mostrarPass.value ? "text" : "password",
                                required: "",
                                disabled: unref(auth).cargando,
                                class: "mb-4"
                              }, null, 8, ["modelValue", "type", "disabled"]),
                              createVNode(_component_v_btn, {
                                type: "submit",
                                color: "primary",
                                block: "",
                                loading: unref(auth).cargando
                              }, {
                                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                                  createTextVNode(" Iniciar sesión ", -1)
                                ])]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_divider),
                      createVNode(_component_v_card_text, null, {
                        default: withCtx(() => [
                          _cache[6] || (_cache[6] = createBaseVNode("p", { class: "text-caption text-center mb-2" }, "Accesos demo", -1)),
                          createVNode(_component_v_row, { dense: "" }, {
                            default: withCtx(() => [
                              (openBlock(), createElementBlock(Fragment, null, renderList(usuariosDemo, (demo) => {
                                return createVNode(_component_v_col, {
                                  key: demo.email,
                                  cols: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_btn, {
                                      variant: "outlined",
                                      block: "",
                                      size: "small",
                                      onClick: ($event) => loginRapido(demo),
                                      disabled: unref(auth).cargando
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(demo.rol), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick", "disabled"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
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
