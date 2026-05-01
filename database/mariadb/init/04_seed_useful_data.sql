-- ==========================================================
-- SEED DE DATOS VARIADOS Y RICOS PARA DEMOSTRACIÓN FINAL
-- ==========================================================

-- Limpiar datos previos (orden importante por FKs)
DELETE FROM asignaciones_revision;
DELETE FROM perfiles_profesionales;
DELETE FROM usuarios_roles;
DELETE FROM roles;
DELETE FROM usuarios;

-- ==========================================================
-- 1. CATÁLOGO DE ROLES
-- ==========================================================
INSERT INTO roles (id, nombre) VALUES
(1, 'AUTOR'),
(2, 'REVISOR'),
(3, 'EDITOR'),
(4, 'ADMIN');

-- ==========================================================
-- 2. USUARIOS (Password universal: 1234)
-- Hashes generados con bcrypt salt 10
-- ==========================================================
INSERT INTO usuarios (id_usuario, email, password_hash, estado) VALUES
(1,  'autor@demo.com',           '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(2,  'revisor@demo.com',         '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(3,  'editor@demo.com',          '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(4,  'admin@demo.com',           '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(5,  'carlos.r@mit.edu',         '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(6,  'elena.v@stanford.edu',     '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(7,  'chen.wei@tsinghua.cn',     '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(8,  's.kawasaki@u-tokyo.jp',    '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(9,  'l.martinez@unam.mx',       '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(10, 'h.mueller@tu-berlin.de',   '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(11, 'j.doe@oxford.ac.uk',       '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(12, 'm.patel@iit.ac.in',        '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO'),
(13, 'super@demo.com',           '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ACTIVO');

-- ==========================================================
-- 3. ASIGNACIÓN DE ROLES (relación N:M)
-- IDs de rol: 1=AUTOR, 2=REVISOR, 3=EDITOR, 4=ADMIN
-- ==========================================================
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES
-- Demo principales
(1,  1),                   -- autor@demo.com  → AUTOR
(2,  1), (2,  2),          -- revisor@demo.com → AUTOR + REVISOR
(3,  2), (3,  3),          -- editor@demo.com  → REVISOR + EDITOR
(4,  1), (4,  2), (4, 3), (4, 4),  -- admin@demo.com  → todos
-- Usuarios extendidos
(5,  2),                   -- carlos.r        → REVISOR
(6,  1),                   -- elena.v         → AUTOR
(7,  2),                   -- chen.wei        → REVISOR
(8,  2),                   -- s.kawasaki      → REVISOR
(9,  1),                   -- l.martinez      → AUTOR
(10, 2),                   -- h.mueller       → REVISOR
(11, 3),                   -- j.doe           → EDITOR
(12, 2),                   -- m.patel         → REVISOR
(13, 1), (13, 2), (13, 3), (13, 4);  -- super@demo.com → todos

-- ==========================================================
-- 4. PERFILES PROFESIONALES
-- ==========================================================
INSERT INTO perfiles_profesionales (id_usuario, nombre_completo, institucion, orcid, especialidad_academica) VALUES
(1,  'Dra. Ana García',         'Universidad Nacional',      '0000-0001-1111-1111', 'Redes Neuronales y Procesamiento de Imágenes'),
(2,  'Dr. Roberto Mendoza',     'Instituto de IA',           '0000-0002-2222-2222', 'Procesamiento de Lenguaje Natural (NLP)'),
(3,  'Dr. Sergio Martínez',     'Revista Innovación Tech',   '0000-0003-3333-3333', 'Gestión Editorial y Ciencia Abierta'),
(4,  'Lic. Admin Sistema',      'Soporte Central',           NULL,                  'Administración de Sistemas'),
(5,  'Carlos Rodríguez',        'MIT Media Lab',             '0000-0005-5555-5555', 'Interacción Humano-Computadora (HCI)'),
(6,  'Elena Vasquez',           'Stanford University',       '0000-0006-6666-6666', 'Bioinformática y Genómica'),
(7,  'Chen Wei',                'Tsinghua University',       '0000-0007-7777-7777', 'Computación Cuántica y Criptografía'),
(8,  'Satoshi Kawasaki',        'University of Tokyo',       '0000-0008-8888-8888', 'Robótica Cognitiva y Control'),
(9,  'Lucía Martínez',          'UNAM / IIMAS',              '0000-0009-9999-9999', 'Sistemas Distribuidos y Tolerancia a Fallos'),
(10, 'Hans Müller',             'TU Berlin',                 '0000-0010-1010-1010', 'Ciberseguridad y Privacidad'),
(11, 'John Doe',                'University of Oxford',      '0000-0011-1111-1111', 'Lógica Computacional y Ética'),
(12, 'Meera Patel',             'IIT Bombay',                '0000-0012-1212-1212', 'Visión por Computadora y Deep Learning'),
(13, 'Super Usuario Multi-Rol', 'Universidad Global',        NULL,                  'Todas las Áreas');

-- ==========================================================
-- 5. ASIGNACIONES DE REVISIÓN
-- NOTA: id_manuscrito_mongo apunta a documentos de MongoDB.
-- Aquí se usan placeholders ('201', '202') que pueden enlazarse a los _id reales
-- una vez creados los manuscritos vía POST /manuscripts.
-- ==========================================================
INSERT INTO asignaciones_revision (id_revisor, id_manuscrito_mongo, estado, fecha_limite) VALUES
(2,  '201', 'ACEPTADO',   '2026-04-15'),
(12, '201', 'INVITADO',   '2026-04-20'),
(10, '202', 'COMPLETADA', '2026-03-25'),
(7,  '202', 'ACEPTADO',   '2026-04-10');

-- 6. Detalles de la revisión completada
UPDATE asignaciones_revision
SET puntuacion = 4,
    comentarios = 'Excelente propuesta de seguridad, aunque faltan pruebas de latencia.',
    fecha_completada = '2026-03-25 10:00:00'
WHERE id_revisor = 10 AND id_manuscrito_mongo = '202';
