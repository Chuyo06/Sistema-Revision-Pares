-- Extensión de Seeds para la Tarea de Revisión (Perfiles y Asignaciones y Manuscritos)

-- 1. Insertamos un perfil profesional para el Revisor (id_usuario = 2) y Autor (id_usuario = 1)
INSERT INTO perfiles_profesionales (id_usuario, nombre_completo, institucion, orcid, especialidad_academica) VALUES
(1, 'Dra. Ana García', 'Universidad de Tecnología', '0000-0001-2345-6789', 'Redes Neuronales y Salud'),
(2, 'Dr. Roberto Mendoza', 'Instituto de Ciencias de Datos', '0000-0002-9876-5432', 'Inteligencia Artificial y NLP');

-- (Los manuscritos ahora están en MongoDB, no se insertan aquí)

-- 3. Insertamos las asignaciones de revisión vinculando manuscritos
INSERT INTO asignaciones_revision (id_revisor, id_manuscrito_mongo, estado, fecha_limite) VALUES
(2, '1', 'INVITADO', '2026-04-10'),
(2, '2', 'ACEPTADO', '2026-04-12'),
(2, '3', 'COMPLETADA', '2026-03-30');
