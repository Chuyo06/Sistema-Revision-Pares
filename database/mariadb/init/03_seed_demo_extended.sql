-- Extensión de Seeds para la Tarea de Revisión (Perfiles y Asignaciones y Manuscritos)

-- 1. Insertamos un perfil profesional para el Revisor (id_usuario = 2) y Autor (id_usuario = 1)
INSERT INTO perfiles_profesionales (id_usuario, nombre_completo, institucion, orcid, especialidad_academica) VALUES
(1, 'Dra. Ana García', 'Universidad de Tecnología', '0000-0001-2345-6789', 'Redes Neuronales y Salud'),
(2, 'Dr. Roberto Mendoza', 'Instituto de Ciencias de Datos', '0000-0002-9876-5432', 'Inteligencia Artificial y NLP');

-- 2. Insertamos manuscritos (ya que la entidad Manuscrito sincroniza con MariaDB)
INSERT INTO manuscritos (id, titulo, resumen, autorId, autores, estado, convocatoria, referencia) VALUES
(1, 'Aplicación de Redes Neuronales en Diagnóstico Médico', 'Este trabajo propone una arquitectura CNN para la clasificación de imágenes histológicas con una precisión del 94.3%.', 1, 'García, A. et al.', 'EN_REVISION', 'CIIA 2026', 'RPP-2026-0001'),
(2, 'Transformers para Análisis de Sentimientos en Redes Sociales', 'Evaluamos el rendimiento de BERT, RoBERTa y XLNet en datasets de Twitter y Reddit en español.', 1, 'Rodríguez, M. et al.', 'EN_REVISION', 'CIIA 2026', 'RPP-2026-0002'),
(3, 'Compresión de Modelos de IA para Dispositivos Móviles', 'Técnicas de pruning y quantization para desplegar modelos YOLO en dispositivos con menos de 2GB RAM.', 1, 'Fernández, J. et al.', 'APROBADO', 'IoTSec 2026', 'RPP-2026-0003');

-- 3. Insertamos las asignaciones de revisión vinculando manuscritos
INSERT INTO asignaciones_revision (id_revisor, id_manuscrito_mongo, estado, fecha_limite) VALUES
(2, '1', 'INVITADO', '2026-04-10'),
(2, '2', 'ACEPTADO', '2026-04-12'),
(2, '3', 'COMPLETADA', '2026-03-30');

