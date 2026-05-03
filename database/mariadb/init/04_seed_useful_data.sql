-- ==========================================================
-- SEED DE DATOS VARIADOS Y RICOS PARA DEMOSTRACIÓN FINAL
-- ==========================================================

-- Limpiar datos previos
DELETE FROM asignaciones_revision;
DELETE FROM perfiles_profesionales;
DELETE FROM manuscritos;
DELETE FROM usuarios;

-- 1. USUARIOS (Password universal: 1234)
-- Hashes generados previamente para '1234'
INSERT INTO usuarios (id_usuario, email, password_hash, roles, estado) VALUES
(1, 'autor@demo.com',      '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'AUTOR', 'ACTIVO'),
(2, 'revisor@demo.com',    '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'REVISOR', 'ACTIVO'),
(3, 'editor@demo.com',     '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'EDITOR,EDITOR_JEFE', 'ACTIVO'),
(4, 'admin@demo.com',      '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ADMIN', 'ACTIVO'),
(5, 'carlos.r@mit.edu',    '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'REVISOR', 'ACTIVO'),
(6, 'elena.v@stanford.edu','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'AUTOR', 'ACTIVO'),
(7, 'chen.wei@tsinghua.cn','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'REVISOR', 'ACTIVO'),
(8, 's.kawasaki@u-tokyo.jp','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'REVISOR', 'ACTIVO'),
(9, 'l.martinez@unam.mx',  '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'AUTOR', 'ACTIVO'),
(10, 'h.mueller@tu-berlin.de','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'REVISOR', 'ACTIVO'),
(11, 'j.doe@oxford.ac.uk',  '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'EDITOR,EDITOR_SECCION', 'ACTIVO'),
(12, 'm.patel@iit.ac.in',   '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'REVISOR', 'ACTIVO'),
(13, 'super@demo.com',      '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'AUTOR,REVISOR,EDITOR,EDITOR_JEFE,ADMIN', 'ACTIVO'),
(14, 'editor.seccion@demo.com', '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'EDITOR,EDITOR_SECCION', 'ACTIVO');

-- 2. PERFILES PROFESIONALES (los 13 originales + editor de sección id 14)
INSERT INTO perfiles_profesionales (id_usuario, nombre_completo, institucion, orcid, especialidad_academica) VALUES
(1,  'Dra. Ana García',         'Universidad Nacional',      '0000-0001-1111-1111', 'Redes Neuronales y Procesamiento de Imágenes'),
(2,  'Dr. Roberto Mendoza',     'Instituto de IA',           '0000-0002-2222-2222', 'Procesamiento de Lenguaje Natural (NLP)'),
(3,  'Dr. Sergio Martínez',     'Revista Innovación Tech',   '0000-0003-3333-3333', 'Gestión Editorial y Ciencia Abierta'),
(4,  'Lic. Admin Sistema',      'Soporte Central',           NULL,                 'Administración de Sistemas'),
(5,  'Carlos Rodríguez',        'MIT Media Lab',             '0000-0005-5555-5555', 'Interacción Humano-Computadora (HCI)'),
(6,  'Elena Vasquez',           'Stanford University',       '0000-0006-6666-6666', 'Bioinformática y Genómica'),
(7,  'Chen Wei',                'Tsinghua University',       '0000-0007-7777-7777', 'Computación Cuántica y Criptografía'),
(8,  'Satoshi Kawasaki',        'University of Tokyo',       '0000-0008-8888-8888', 'Robótica Cognitiva y Control'),
(9,  'Lucía Martínez',          'UNAM / IIMAS',              '0000-0009-9999-9999', 'Sistemas Distribuidos y Tolerancia a Fallos'),
(10, 'Hans Müller',             'TU Berlin',                 '0000-0010-1010-1010', 'Ciberseguridad y Privacidad'),
(11, 'John Doe',                'University of Oxford',      '0000-0011-1111-1111', 'Lógica Computacional y Ética'),
(12, 'Meera Patel',             'IIT Bombay',                '0000-0012-1212-1212', 'Visión por Computadora y Deep Learning'),
(13, 'Super Usuario Multi-Rol', 'Universidad Global',        NULL,                  'Todas las Áreas'),
(14, 'Dra. Editora Sección',    'Revista Innovación Tech',   '0000-0014-1414-1414', 'Editor de Sección de Ingeniería');

-- 3. MANUSCRITOS
INSERT INTO manuscritos (id, titulo, resumen, autorId, autores, estado, convocatoria, referencia, fechaEnvio) VALUES
(201, 'Detección Temprana de Alzheimer usando Transformers', 'Uso de modelos de atención para el análisis de resonancias magnéticas estructurales.', 1, 'García, A., Roberts, J.', 'EN_REVISION', 'HealthAI 2026', 'RPP-2026-0201', '2026-03-01'),
(202, 'Privacy-Preserving Deep Learning in Cloud', 'Protocolos criptográficos para el entrenamiento de modelos sin acceder a datos en bruto.', 9, 'Martínez, L., Schmidt, H.', 'EN_REVISION', 'SecConf 2026', 'RPP-2026-0202', '2026-03-05'),
(203, 'Aceleración de Algoritmos Genéticos con GPU', 'Optimización de procesos de selección natural mediante núcleos CUDA.', 6, 'Vasquez, E.', 'ACEPTADO', 'BioInf 2026', 'RPP-2026-0203', '2026-02-15'),
(204, 'Análisis de Sesgos en Modelos de Lenguaje Grandes', 'Estudio sobre la discriminación algorítmica en GPT-4 para el español regional.', 1, 'García, A.', 'RECHAZADO', 'EthicAI 2026', 'RPP-2026-0204', '2026-02-20'),
(205, 'Navegación Autónoma en Entornos Interiores Densos', 'Algoritmos de SLAM para drones de bajo coste en almacenes logísticos.', 9, 'Martínez, L., Kawasaki, S.', 'ENVIADO', 'RoboNet 2026', 'RPP-2026-0205', '2026-03-10');

-- 4. ASIGNACIONES DE REVISIÓN (Capa de cruce)
-- MS 201: Revisor 2 y 12
-- MS 202: Revisor 7 y 10
INSERT INTO asignaciones_revision (id_revisor, id_manuscrito_mongo, estado, fecha_limite) VALUES
(2,  '201', 'ACEPTADO',   '2026-04-15'),
(12, '201', 'INVITADO',   '2026-04-20'),
(10, '202', 'COMPLETADA', '2026-03-25'),
(7,  '202', 'ACEPTADO',   '2026-04-10');

-- 5. REVISIONES COMPLETADAS (Simular una revisión ya hecha en el MS 202)
UPDATE asignaciones_revision 
SET puntuacion = 4, comentarios = 'Excelente propuesta de seguridad, aunque faltan pruebas de latencia.', fecha_completada = '2026-03-25 10:00:00'
WHERE id_revisor = 10 AND id_manuscrito_mongo = '202';

-- 6. ACTUALIZAR CONTADORES DE MANUSCRITOS
UPDATE manuscritos SET revisoresAsignados = 2, revisionesCompletadas = 0 WHERE id = 201;
UPDATE manuscritos SET revisoresAsignados = 2, revisionesCompletadas = 1 WHERE id = 202;
UPDATE manuscritos SET revisoresAsignados = 1, revisionesCompletadas = 1 WHERE id = 203; -- Ya aceptado

-- 7. ASIGNAR EDITOR DE SECCIÓN A ALGUNOS MANUSCRITOS (id 11 = j.doe, id 14 = editor.seccion@demo)
UPDATE manuscritos SET editor_seccion_id = 11 WHERE id = 201;
UPDATE manuscritos SET editor_seccion_id = 14 WHERE id IN (202, 203);
-- 204 y 205 quedan sin asignar (visibles al editor jefe para que los asigne)
