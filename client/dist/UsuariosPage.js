import { v as onMounted, c as createElementBlock, b as createVNode, w as withCtx, g as resolveComponent, h as ref, o as openBlock, a as createBaseVNode, j as createTextVNode, d as unref, t as toDisplayString, f as withModifiers, p as computed } from "./index.js";
import { u as useAdminStore } from "./index5.js";
import "./usuarios.js";
import "./manuscritos.js";
const _sfc_main = {
  __name: "UsuariosPage",
  setup(__props) {
    const adminStore = useAdminStore();
    const busqueda = ref("");
    const filtroRol = ref("TODOS");
    const dialogoNuevo = ref(false);
    const valido = ref(false);
    const snackbar = ref(false);
    const mensajeSnackbar = ref("");
    const nuevoUsuario = ref({ nombre: "", email: "", rol: "" });
    onMounted(() => {
      adminStore.cargarUsuarios();
    });
    const usuariosFiltrados = computed(
      () => adminStore.usuarios.filter(
        (u) => (filtroRol.value === "TODOS" || u.rol === filtroRol.value) && (u.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) || u.email.toLowerCase().includes(busqueda.value.toLowerCase()))
      )
    );
    const headers = [
      { title: "Nombre", key: "nombre", sortable: true },
      { title: "Email", key: "email", sortable: true },
      { title: "Rol", key: "rol", sortable: true },
      { title: "Registro", key: "fechaRegistro", sortable: true },
      { title: "Estado", key: "estado", sortable: true },
      { title: "", key: "acciones", sortable: false, align: "end" }
    ];
    async function crearUsuario() {
      await adminStore.agregarUsuario({ ...nuevoUsuario.value });
      dialogoNuevo.value = false;
      nuevoUsuario.value = { nombre: "", email: "", rol: "" };
      mensajeSnackbar.value = "Usuario creado/actualizado correctamente";
      snackbar.value = true;
    }
    return (_ctx, _cache) => {
      const _component_v_col = resolveComponent("v-col");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_data_table = resolveComponent("v-data-table");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_spacer = resolveComponent("v-spacer");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_dialog = resolveComponent("v-dialog");
      const _component_v_snackbar = resolveComponent("v-snackbar");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_v_row, {
          class: "mb-4",
          align: "center"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_col, null, {
              default: withCtx(() => [..._cache[10] || (_cache[10] = [
                createBaseVNode("h2", { class: "text-h6" }, "Gestión de usuarios", -1)
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
                  placeholder: "Buscar usuario...",
                  density: "compact",
                  "hide-details": "",
                  style: { "min-width": "200px" }
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_v_col, { cols: "auto" }, {
              default: withCtx(() => [
                createVNode(_component_v_btn, {
                  color: "primary",
                  onClick: _cache[1] || (_cache[1] = ($event) => dialogoNuevo.value = true)
                }, {
                  default: withCtx(() => [..._cache[11] || (_cache[11] = [
                    createTextVNode("Nuevo usuario", -1)
                  ])]),
                  _: 1
                })
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
              default: withCtx(() => [..._cache[12] || (_cache[12] = [
                createBaseVNode("span", { class: "text-body-2 mr-2" }, "Filtrar por rol:", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_v_col, {
              cols: "12",
              sm: "4"
            }, {
              default: withCtx(() => [
                createVNode(_component_v_select, {
                  modelValue: filtroRol.value,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filtroRol.value = $event),
                  items: ["TODOS", "autor", "revisor", "editor", "administrador"],
                  density: "compact",
                  "hide-details": ""
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        createVNode(_component_v_card, null, {
          default: withCtx(() => [
            createVNode(_component_v_data_table, {
              headers,
              items: usuariosFiltrados.value,
              search: busqueda.value,
              "items-per-page": 8
            }, {
              "item.acciones": withCtx(({ item }) => [
                createVNode(_component_v_btn, {
                  size: "small",
                  variant: "text",
                  color: item.estado === "activo" ? "error" : "success",
                  onClick: ($event) => unref(adminStore).toggleEstadoUsuario(item.id)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item.estado === "activo" ? "Desactivar" : "Activar"), 1)
                  ]),
                  _: 2
                }, 1032, ["color", "onClick"])
              ]),
              _: 1
            }, 8, ["items", "search"])
          ]),
          _: 1
        }),
        createVNode(_component_v_dialog, {
          modelValue: dialogoNuevo.value,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => dialogoNuevo.value = $event),
          "max-width": "500"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_card, null, {
              default: withCtx(() => [
                createVNode(_component_v_card_title, null, {
                  default: withCtx(() => [..._cache[13] || (_cache[13] = [
                    createTextVNode("Nuevo usuario", -1)
                  ])]),
                  _: 1
                }),
                createVNode(_component_v_card_text, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_form, {
                      ref: "formRef",
                      modelValue: valido.value,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => valido.value = $event),
                      onSubmit: withModifiers(crearUsuario, ["prevent"])
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_text_field, {
                          modelValue: nuevoUsuario.value.nombre,
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => nuevoUsuario.value.nombre = $event),
                          label: "Nombre completo *",
                          rules: [(r) => !!r || "Requerido"],
                          class: "mb-2"
                        }, null, 8, ["modelValue", "rules"]),
                        createVNode(_component_v_text_field, {
                          modelValue: nuevoUsuario.value.email,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => nuevoUsuario.value.email = $event),
                          label: "Email *",
                          type: "email",
                          rules: [(r) => !!r || "Requerido"],
                          class: "mb-2"
                        }, null, 8, ["modelValue", "rules"]),
                        createVNode(_component_v_select, {
                          modelValue: nuevoUsuario.value.rol,
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => nuevoUsuario.value.rol = $event),
                          items: ["autor", "revisor", "editor", "administrador"],
                          label: "Rol *",
                          rules: [(r) => !!r || "Requerido"]
                        }, null, 8, ["modelValue", "rules"])
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_v_card_actions, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_spacer),
                    createVNode(_component_v_btn, {
                      onClick: _cache[7] || (_cache[7] = ($event) => dialogoNuevo.value = false)
                    }, {
                      default: withCtx(() => [..._cache[14] || (_cache[14] = [
                        createTextVNode("Cancelar", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(_component_v_btn, {
                      color: "primary",
                      disabled: !valido.value,
                      onClick: crearUsuario
                    }, {
                      default: withCtx(() => [..._cache[15] || (_cache[15] = [
                        createTextVNode("Crear", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(_component_v_snackbar, {
          modelValue: snackbar.value,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => snackbar.value = $event),
          timeout: "3000"
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(mensajeSnackbar.value), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
