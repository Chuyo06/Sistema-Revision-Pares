-- ==========================================================
-- SEED DE DATOS VARIADOS Y RICOS PARA DEMOSTRACIÓN FINAL
-- ==========================================================

-- Limpiar datos previos
DELETE FROM asignaciones_revision;
DELETE FROM perfiles_profesionales;
DELETE FROM usuarios;

-- 1. USUARIOS (Password universal: 1234)
-- Hashes generados previamente para '1234'
INSERT IGNORE INTO roles (id, nombre) VALUES 
(1, 'AUTOR'), (2, 'REVISOR'), (3, 'EDITOR'), (4, 'EDITOR_JEFE'), (5, 'EDITOR_SECCION'), (6, 'ADMIN');

INSERT INTO usuarios (id_usuario, email, password_hash, estado) VALUES
(1, 'autor@demo.com',      '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(2, 'revisor@demo.com',    '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(3, 'editor@demo.com',     '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(4, 'admin@demo.com',      '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(5, 'carlos.r@mit.edu',    '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(6, 'elena.v@stanford.edu','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(7, 'chen.wei@tsinghua.cn','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(8, 's.kawasaki@u-tokyo.jp','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(9, 'l.martinez@unam.mx',  '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(10, 'h.mueller@tu-berlin.de','$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(11, 'j.doe@oxford.ac.uk',  '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(12, 'm.patel@iit.ac.in',   '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(13, 'super@demo.com',      '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(14, 'editor.seccion@demo.com', '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO');

-- Usuario_Roles
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES
(1, 1),
(2, 2),
(3, 3), (3, 4),
(4, 6),
(5, 2),
(6, 1),
(7, 2),
(8, 2),
(9, 1),
(10, 2),
(11, 3), (11, 5),
(12, 2),
(13, 1), (13, 2), (13, 3), (13, 4), (13, 6),
(14, 3), (14, 5);

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
