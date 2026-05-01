-- ==========================================
-- MICROSERVICIO: USUARIOS (Gestión de Identidad)
-- ==========================================

-- Tabla principal de autenticación
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de roles (relación ManyToMany con usuarios)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla intermedia para la relación N:M usuario <-> rol
CREATE TABLE usuarios_roles (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Información pública/académica (separada por seguridad y normalización)
CREATE TABLE perfiles_profesionales (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    institucion VARCHAR(200),
    orcid VARCHAR(50) UNIQUE,
    especialidad_academica VARCHAR(200),
    avatar LONGTEXT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


-- ==========================================
-- MICROSERVICIO: REVISION (Flujo Editorial)
-- ==========================================

-- id_manuscrito_mongo apunta al _id (ObjectID) del documento en MongoDB.
CREATE TABLE asignaciones_revision (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_revisor INT NOT NULL,
    id_manuscrito_mongo VARCHAR(100) NOT NULL,
    estado ENUM('INVITADO', 'ACEPTADO', 'DECLINADO', 'COMPLETADA', 'EXPIRADA') DEFAULT 'INVITADO',
    fecha_invitacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATE NOT NULL,
    puntuacion INT NULL,
    comentarios TEXT NULL,
    fecha_completada TIMESTAMP NULL,
    FOREIGN KEY (id_revisor) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);
