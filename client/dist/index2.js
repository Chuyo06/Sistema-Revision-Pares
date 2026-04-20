import { x as defineStore, h as ref, u as useAuthStore } from "./index.js";
import { f as fetchManuscritosPorAutor, c as crearManuscrito } from "./manuscritos.js";
const useAutorStore = defineStore("autor", () => {
  const manuscritos = ref([]);
  const cargando = ref(false);
  const convocatorias = ref([
    { id: 1, nombre: "CIIA 2026 — Congreso Internacional de IA", deadline: "2026-04-30", estado: "ABIERTA" },
    { id: 2, nombre: "IoTSec 2026 — Seguridad en IoT", deadline: "2026-05-15", estado: "ABIERTA" },
    { id: 3, nombre: "ISE 2025 — Ingeniería de Software", deadline: "2025-12-01", estado: "CERRADA" }
  ]);
  async function cargarMisManuscritos() {
    var _a, _b;
    cargando.value = true;
    try {
      const authStore = useAuthStore();
      const userId = ((_a = authStore.usuario) == null ? void 0 : _a.id) || ((_b = authStore.usuario) == null ? void 0 : _b.id_usuario) || 1;
      const data = await fetchManuscritosPorAutor(userId);
      if (data) {
        manuscritos.value = data.map((m) => ({
          id: m.id,
          titulo: m.titulo,
          resumen: m.resumen,
          estado: m.estado,
          fechaEnvio: m.fechaEnvio ? m.fechaEnvio.split("T")[0] : null,
          convocatoria: m.convocatoria || "General",
          revisores: 0,
          // Esto requeriría otro join si quisiéramos mostrarlo real
          revisionesPendientes: 0
        }));
      }
    } catch (e) {
      console.error("Error cargando manuscritos del autor:", e);
    } finally {
      cargando.value = false;
    }
  }
  async function enviarManuscrito(datos) {
    var _a, _b, _c;
    const authStore = useAuthStore();
    const userId = ((_a = authStore.usuario) == null ? void 0 : _a.id) || ((_b = authStore.usuario) == null ? void 0 : _b.id_usuario) || 1;
    const payload = {
      ...datos,
      autorId: userId,
      autores: ((_c = authStore.usuario) == null ? void 0 : _c.nombre) || "Autor Demo",
      referencia: "PENDIENTE",
      estado: "ENVIADO"
    };
    const nuevo = await crearManuscrito(payload);
    if (nuevo) {
      await cargarMisManuscritos();
      return nuevo;
    }
    return null;
  }
  return { manuscritos, convocatorias, cargando, cargarMisManuscritos, enviarManuscrito };
});
export {
  useAutorStore as u
};
