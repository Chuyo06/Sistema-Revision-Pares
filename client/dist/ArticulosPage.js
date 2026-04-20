import { u as useAutorStore } from "./index2.js";
import { v as onMounted, c as createElementBlock, a as createBaseVNode, b as createVNode, w as withCtx, F as Fragment, r as renderList, e as createCommentVNode, h as ref, g as resolveComponent, p as computed, o as openBlock, j as createTextVNode, n as normalizeStyle, t as toDisplayString, k as createBlock } from "./index.js";
import "./manuscritos.js";
const _hoisted_1 = { style: { "max-width": "800px", "padding": "20px" } };
const _hoisted_2 = { style: { "display": "flex", "align-items": "center", "gap": "10px", "margin-bottom": "16px", "flex-wrap": "wrap" } };
const _hoisted_3 = { style: { "padding": "16px" } };
const _hoisted_4 = { style: { "display": "flex", "align-items": "flex-start", "gap": "10px", "margin-bottom": "6px" } };
const _hoisted_5 = { style: { "flex": "1", "min-width": "0" } };
const _hoisted_6 = { style: { "font-size": "15px", "font-weight": "600", "color": "#3e2723", "word-break": "break-word" } };
const _hoisted_7 = { style: { "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" } };
const _hoisted_8 = { style: { "font-size": "12px", "color": "#8d6e63" } };
const _hoisted_9 = {
  key: 0,
  style: { "font-size": "12px", "color": "#bda89a" }
};
const _hoisted_10 = {
  key: 1,
  style: { "font-size": "12px", "color": "#8d6e63" }
};
const _hoisted_11 = { style: { "font-size": "13px", "color": "#5d4037", "margin-top": "8px", "margin-bottom": "0", "display": "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", "overflow": "hidden" } };
const _hoisted_12 = {
  key: 0,
  style: { "text-align": "center", "padding": "48px 0", "color": "#8d6e63" }
};
const _sfc_main = {
  __name: "ArticulosPage",
  setup(__props) {
    const autorStore = useAutorStore();
    onMounted(() => {
      autorStore.cargarMisManuscritos();
    });
    const busqueda = ref("");
    const filtroEstado = ref("TODOS");
    const filtros = [
      { label: "Todos los estados", value: "TODOS" },
      { label: "Borrador", value: "BORRADOR" },
      { label: "En revisión", value: "EN_REVISION" },
      { label: "Aceptado", value: "ACEPTADO" },
      { label: "Rechazado", value: "RECHAZADO" }
    ];
    const manuscritosFiltrados = computed(
      () => autorStore.manuscritos.filter((m) => {
        const b = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase());
        const e = filtroEstado.value === "TODOS" || m.estado === filtroEstado.value;
        return b && e;
      })
    );
    const ESTADOS = { BORRADOR: "Borrador", ENVIADO: "Enviado", EN_REVISION: "En revisión", ACEPTADO: "Aceptado", RECHAZADO: "Rechazado" };
    const HEX = { BORRADOR: "#9e9e9e", ENVIADO: "#546e7a", EN_REVISION: "#e65100", ACEPTADO: "#558b2f", RECHAZADO: "#c62828" };
    const CHIPS = { BORRADOR: "secondary", ENVIADO: "info", EN_REVISION: "warning", ACEPTADO: "success", RECHAZADO: "error" };
    function estadoLabel(e) {
      return ESTADOS[e] ?? e;
    }
    function hexEstado(e) {
      return HEX[e] ?? "#9e9e9e";
    }
    function chipEstado(e) {
      return CHIPS[e] ?? "secondary";
    }
    return (_ctx, _cache) => {
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_icon = resolveComponent("v-icon");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createVNode(_component_v_text_field, {
            modelValue: busqueda.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => busqueda.value = $event),
            placeholder: "Buscar artículo...",
            "prepend-inner-icon": "mdi-magnify",
            density: "compact",
            "hide-details": "",
            clearable: "",
            style: { "max-width": "260px", "flex": "1", "min-width": "160px" }
          }, null, 8, ["modelValue"]),
          createVNode(_component_v_select, {
            modelValue: filtroEstado.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filtroEstado.value = $event),
            items: filtros,
            "item-title": "label",
            "item-value": "value",
            density: "compact",
            "hide-details": "",
            style: { "max-width": "200px", "flex": "1", "min-width": "140px" }
          }, null, 8, ["modelValue"]),
          createVNode(_component_v_btn, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            to: "/autor/nuevo",
            style: { "flex-shrink": "0" }
          }, {
            default: withCtx(() => [..._cache[2] || (_cache[2] = [
              createTextVNode(" Nuevo ", -1)
            ])]),
            _: 1
          })
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(manuscritosFiltrados.value, (m) => {
          return openBlock(), createElementBlock("div", {
            key: m.id,
            style: { "background": "#fdfbf5", "border": "1px solid #e8ddd0", "border-radius": "12px", "margin-bottom": "10px", "overflow": "hidden" }
          }, [
            createBaseVNode("div", {
              style: normalizeStyle(`height:5px; background:${hexEstado(m.estado)}`)
            }, null, 4),
            createBaseVNode("div", _hoisted_3, [
              createBaseVNode("div", _hoisted_4, [
                createBaseVNode("div", _hoisted_5, [
                  createBaseVNode("div", _hoisted_6, toDisplayString(m.titulo), 1)
                ]),
                createVNode(_component_v_chip, {
                  color: chipEstado(m.estado),
                  label: "",
                  size: "small",
                  style: { "flex-shrink": "0", "margin-top": "1px" }
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(estadoLabel(m.estado)), 1)
                  ]),
                  _: 2
                }, 1032, ["color"])
              ]),
              createBaseVNode("div", _hoisted_7, [
                createBaseVNode("span", _hoisted_8, toDisplayString(m.convocatoria), 1),
                m.fechaEnvio ? (openBlock(), createElementBlock("span", _hoisted_9, "·")) : createCommentVNode("", true),
                m.fechaEnvio ? (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString(m.fechaEnvio), 1)) : createCommentVNode("", true),
                m.referencia ? (openBlock(), createBlock(_component_v_chip, {
                  key: 2,
                  size: "x-small",
                  variant: "tonal",
                  color: "secondary"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" REF: " + toDisplayString(m.referencia), 1)
                  ]),
                  _: 2
                }, 1024)) : createCommentVNode("", true)
              ]),
              createBaseVNode("p", _hoisted_11, toDisplayString(m.resumen), 1)
            ])
          ]);
        }), 128)),
        manuscritosFiltrados.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_12, [
          createVNode(_component_v_icon, {
            size: "44",
            color: "secondary"
          }, {
            default: withCtx(() => [..._cache[3] || (_cache[3] = [
              createTextVNode("mdi-file-search-outline", -1)
            ])]),
            _: 1
          }),
          _cache[4] || (_cache[4] = createBaseVNode("p", { style: { "font-size": "14px", "margin-top": "10px" } }, "No se encontraron artículos.", -1))
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
export {
  _sfc_main as default
};
