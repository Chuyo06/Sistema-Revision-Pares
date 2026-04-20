import { x as defineStore, h as ref, u as useAuthStore } from "./index.js";
import { f as fetchAsignaciones, e as enviarRevisionApi } from "./revision.js";
import { a as fetchManuscritos } from "./manuscritos.js";
const useRevisorStore = defineStore("revisor", () => {
  const articulosAsignados = ref([]);
  const cargando = ref(false);
  const borradores = ref({});
  function guardarBorrador(articuloId, datos) {
    borradores.value[articuloId] = { ...datos, guardadoEn: (/* @__PURE__ */ new Date()).toISOString() };
    localStorage.setItem("rpp_borradores", JSON.stringify(borradores.value));
  }
  function cargarBorrador(articuloId) {
    const guardados = JSON.parse(localStorage.getItem("rpp_borradores") || "{}");
    return guardados[articuloId] || null;
  }
  async function cargarDashboard() {
    var _a, _b;
    cargando.value = true;
    try {
      const authStore = useAuthStore();
      const userId = ((_a = authStore.usuario) == null ? void 0 : _a.id) || ((_b = authStore.usuario) == null ? void 0 : _b.id_usuario) || 2;
      const [asignaciones, manuscritos] = await Promise.all([
        fetchAsignaciones(userId),
        fetchManuscritos()
      ]);
      if (asignaciones && manuscritos) {
        articulosAsignados.value = asignaciones.map((asig) => {
          const manuscrito = manuscritos.find((m) => String(m.id) === String(asig.id_manuscrito_mongo)) || {};
          let estadoUI = asig.estado;
          if (estadoUI === "INVITADO") estadoUI = "PENDIENTE";
          if (estadoUI === "ACEPTADO") estadoUI = "EN_PROGRESO";
          return {
            id: asig.id_asignacion,
            // ID numérico de MariaDB
            id_manuscrito: asig.id_manuscrito_mongo,
            titulo: manuscrito.titulo || "Manuscrito Desconocido",
            autores: manuscrito.autores || "Desconocido",
            convocatoria: manuscrito.convocatoria || "General",
            deadline: asig.fecha_limite ? asig.fecha_limite.split("T")[0] : "Sin fecha",
            estado: estadoUI,
            resumen: manuscrito.resumen || "Sin resumen disponible"
          };
        });
      }
    } catch (e) {
      console.error("Error cargando dashboard revisor:", e);
    } finally {
      cargando.value = false;
    }
  }
  async function enviarRevision(articuloId, revision) {
    const res = await enviarRevisionApi(articuloId, revision);
    if (res) {
      const articulo = articulosAsignados.value.find((a) => a.id === articuloId);
      if (articulo) {
        articulo.estado = "COMPLETADA";
        articulo.revision = revision;
      }
      delete borradores.value[articuloId];
      localStorage.setItem("rpp_borradores", JSON.stringify(borradores.value));
    }
  }
  return { articulosAsignados, cargando, borradores, guardarBorrador, cargarBorrador, cargarDashboard, enviarRevision };
});
export {
  useRevisorStore as u
};
