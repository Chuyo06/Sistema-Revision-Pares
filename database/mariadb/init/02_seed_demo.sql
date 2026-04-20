-- Usuarios demo para desarrollo
-- Contraseña: 1234 (hash bcrypt con salt 10)
-- Generado con: bcrypt.hash('1234', 10)

INSERT INTO usuarios (email, password_hash, roles) VALUES
('autor@demo.com',   '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'AUTOR'),
('revisor@demo.com', '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'REVISOR'),
('editor@demo.com',  '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'EDITOR'),
('admin@demo.com',   '$2b$10$YgyopBwXlY4AZEr/S2psaeJtjHQb7b6ic5OUqiehAWXK.SxsJ.DJC', 'ADMIN');
