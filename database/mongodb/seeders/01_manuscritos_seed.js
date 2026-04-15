db = db.getSiblingDB('mi_base_datos');

db.manuscritos.insertMany([
  {
    "_id": ObjectId("60d5ecb8b392d70000000001"),
    "numero_referencia": "REF-2026-001",
    "titulo": "Aplicación de Redes Neuronales en Diagnóstico Médico",
    "resumen": "Este trabajo propone una arquitectura CNN para la clasificación de imágenes histológicas con una precisión del 94.3%.",
    "autores_texto": "García, A. et al.",
    "convocatoria": "CIIA 2026",
    "palabras_clave": ["pwa", "llm", "offline", "service-workers", "cnn", "medicina"],
    "id_autor_principal": 1,
    "estado_actual": "EN_REVISION",
    "archivo_minio_url": "http://localhost:9000/articulos-revision/ref-2026-001.pdf",
    "fecha_subida": new Date(),
    "analisis_ia": {
      "score_calidad_inicial": 8.5,
      "alertas_eticas": false,
      "sugerencia_revisores_ids": [2]
    },
    "historial_revisiones": [],
    "meta_sincronizacion": {
      "ultima_actualizacion": new Date(),
      "version_documento": 1
    }
  },
  {
    "_id": ObjectId("60d5ecb8b392d70000000002"),
    "numero_referencia": "REF-2026-002",
    "titulo": "Transformers para Análisis de Sentimientos en Redes Sociales",
    "resumen": "Evaluamos el rendimiento de BERT, RoBERTa y XLNet en datasets de Twitter y Reddit en español.",
    "autores_texto": "Rodríguez, M. et al.",
    "convocatoria": "CIIA 2026",
    "palabras_clave": ["nlp", "transformers", "sentiment-analysis"],
    "id_autor_principal": 1,
    "estado_actual": "EN_REVISION",
    "archivo_minio_url": "http://localhost:9000/articulos-revision/ref-2026-002.pdf",
    "fecha_subida": new Date(),
    "analisis_ia": {
      "score_calidad_inicial": 9.0,
      "alertas_eticas": false,
      "sugerencia_revisores_ids": [2]
    },
    "historial_revisiones": [],
    "meta_sincronizacion": {
      "ultima_actualizacion": new Date(),
      "version_documento": 1
    }
  },
  {
    "_id": ObjectId("60d5ecb8b392d70000000003"),
    "numero_referencia": "REF-2026-003",
    "titulo": "Compresión de Modelos de IA para Dispositivos Móviles",
    "resumen": "Técnicas de pruning y quantization para desplegar modelos YOLO en dispositivos con menos de 2GB RAM.",
    "autores_texto": "Fernández, J. et al.",
    "convocatoria": "IoTSec 2026",
    "palabras_clave": ["iot", "mobile", "yolo", "compression"],
    "id_autor_principal": 1,
    "estado_actual": "APROBADO",
    "archivo_minio_url": "http://localhost:9000/articulos-revision/ref-2026-003.pdf",
    "fecha_subida": new Date(),
    "analisis_ia": {
      "score_calidad_inicial": 8.0,
      "alertas_eticas": false,
      "sugerencia_revisores_ids": [2]
    },
    "historial_revisiones": [],
    "meta_sincronizacion": {
      "ultima_actualizacion": new Date(),
      "version_documento": 1
    }
  }
]);

print("Colección de manuscritos creada exitosamente.");