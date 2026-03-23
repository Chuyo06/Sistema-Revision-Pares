import { n as defineStore, k as ref } from "./index.js";
const useAutorStore = defineStore("autor", () => {
  const manuscritos = ref([
    {
      id: 1,
      titulo: "Aplicación de Redes Neuronales en Diagnóstico Médico",
      resumen: "Este trabajo propone una arquitectura CNN para la clasificación de imágenes histológicas con una precisión del 94.3%.",
      estado: "EN_REVISION",
      fechaEnvio: "2026-01-15",
      convocatoria: "CIIA 2026",
      revisores: 3,
      revisionesPendientes: 1
    },
    {
      id: 2,
      titulo: "Framework para Pruebas de Microservicios con IA",
      resumen: "Presentamos un framework que automatiza las pruebas de integración en arquitecturas de microservicios usando LLMs.",
      estado: "ACEPTADO",
      fechaEnvio: "2025-11-20",
      convocatoria: "ISE 2025",
      revisores: 2,
      revisionesPendientes: 0
    },
    {
      id: 3,
      titulo: "Optimización de Consultas SQL mediante Algoritmos Genéticos",
      resumen: "Proponemos un optimizador de consultas basado en algoritmos evolutivos que mejora el rendimiento en un 67%.",
      estado: "RECHAZADO",
      fechaEnvio: "2025-09-05",
      convocatoria: "BDIS 2025",
      revisores: 2,
      revisionesPendientes: 0
    },
    {
      id: 4,
      titulo: "Detección de Anomalías en Redes IoT con Aprendizaje Federado",
      resumen: "Sistema de detección de intrusiones que preserva la privacidad usando federated learning en dispositivos IoT.",
      estado: "BORRADOR",
      fechaEnvio: null,
      convocatoria: "IoTSec 2026",
      revisores: 0,
      revisionesPendientes: 0
    }
  ]);
  const convocatorias = ref([
    { id: 1, nombre: "CIIA 2026 — Congreso Internacional de IA", deadline: "2026-04-30", estado: "ABIERTA" },
    { id: 2, nombre: "IoTSec 2026 — Seguridad en IoT", deadline: "2026-05-15", estado: "ABIERTA" },
    { id: 3, nombre: "ISE 2025 — Ingeniería de Software", deadline: "2025-12-01", estado: "CERRADA" }
  ]);
  function enviarManuscrito(manuscrito) {
    const nuevo = {
      id: manuscritos.value.length + 1,
      ...manuscrito,
      estado: "ENVIADO",
      fechaEnvio: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      revisores: 0,
      revisionesPendientes: 0
    };
    manuscritos.value.unshift(nuevo);
    return nuevo;
  }
  return { manuscritos, convocatorias, enviarManuscrito };
});
export {
  useAutorStore as u
};
