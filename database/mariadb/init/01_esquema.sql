-- MICROSERVICIO: USUARIOS (Gestión de Identidad)
-- ==========================================

-- Tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL
);

-- Tabla principal de autenticación y roles
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pivote para relación ManyToMany entre usuarios y roles
CREATE TABLE usuario_roles (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- (La tabla de manuscritos ha sido migrada a MongoDB)

-- Tabla de información pública/académica (Separada por seguridad y normalización)
CREATE TABLE perfiles_profesionales (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    institucion VARCHAR(200),
    orcid VARCHAR(50) UNIQUE, -- Identificador estándar para investigadores
    especialidad_academica VARCHAR(200),
    palabras_clave VARCHAR(255),
    experiencia TEXT,
    avatar LONGTEXT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


-- MICROSERVICIO: REVISION (Flujo Editorial)
-- ==========================================

-- Tabla transaccional para evitar colisiones en las asignaciones
CREATE TABLE asignaciones_revision (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_revisor INT NOT NULL,
    id_manuscrito_mongo VARCHAR(100) NOT NULL, -- Referencia al _id del documento en MongoDB
    estado ENUM('INVITADO', 'ACEPTADO', 'DECLINADO', 'COMPLETADA', 'EXPIRADA') DEFAULT 'INVITADO',
    fecha_invitacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATE NOT NULL,
    originalidad INT NULL,
    metodologia INT NULL,
    claridad INT NULL,
    relevancia INT NULL,
    puntuacion INT NULL,
    comentarios TEXT NULL,
    comentarios_editor TEXT NULL,
    recomendacion VARCHAR(50) NULL,
    fecha_completada TIMESTAMP NULL,
    FOREIGN KEY (id_revisor) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);