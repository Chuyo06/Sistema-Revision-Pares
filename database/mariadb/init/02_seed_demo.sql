-- Roles
INSERT IGNORE INTO roles (id, nombre) VALUES 
(1, 'AUTOR'), (2, 'REVISOR'), (3, 'EDITOR'), (4, 'EDITOR_JEFE'), (5, 'EDITOR_SECCION'), (6, 'ADMIN');

-- Usuarios
INSERT INTO usuarios (id_usuario, email, password_hash) VALUES
(1, 'autor@demo.com',   '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC'),
(2, 'revisor@demo.com', '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC'),
(3, 'editor@demo.com',  '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC'),
(4, 'admin@demo.com',   '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC');

-- Usuario_Roles
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 6);
