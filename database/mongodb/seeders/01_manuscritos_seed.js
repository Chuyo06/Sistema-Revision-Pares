db = db.getSiblingDB('mi_base_datos');

db.manuscritos.insertMany([
  {
    "numero_referencia": "REF-2026-001",
    "titulo": "Implementación de LLMs en PWA Offline-First",
    "resumen": "Este artículo describe la arquitectura necesaria para...",
    "palabras_clave": ["pwa", "llm", "offline", "service-workers"],
    "id_autor_principal": 1, // Referencia al ID en MariaDB
    
    // Estado del ciclo de vida del documento
    "estado_actual": "EN_REVISION", // Opciones: BORRADOR, PENDIENTE, EN_REVISION, APROBADO, RECHAZADO
    "archivo_minio_url": "http://localhost:9000/articulos-revision/ref-2026-001.pdf",
    "fecha_subida": new Date(),

    // Datos del microservicio de Análisis IA
    "analisis_ia": {
      "score_calidad_inicial": 8.5,
      "alertas_eticas": false,
      "sugerencia_revisores_ids": [3, 4, 7] // IDs de MariaDB devueltos por el motor de Matching
    },

    // Subdocumentos: Historial completo sin necesidad de hacer JOINs
    "historial_revisiones": [
      {
        "id_revisor": 3,
        "fase_revision": 1,
        "fecha_asignacion": new Date("2026-04-01T10:00:00Z"),
        "estado": "COMPLETADA",
        "veredicto": "APROBADO_CON_CAMBIOS_MENORES",
        "comentarios_al_autor": "Excelente metodología, pero sugiero ampliar la sección de Service Workers.",
        "comentarios_privados_editor": "El artículo es sólido, el autor conoce del tema."
      }
    ],

    // Control para la PWA (Sincronización Offline)
    "meta_sincronizacion": {
      "ultima_actualizacion": new Date(),
      "version_documento": 2
    }
  }
]);

print("Colección de manuscritos creada exitosamente.");