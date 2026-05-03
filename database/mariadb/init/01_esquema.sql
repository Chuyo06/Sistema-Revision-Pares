-- MICROSERVICIO: USUARIOS (Gestión de Identidad)
-- ==========================================

-- Tabla principal de autenticación y roles
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    roles VARCHAR(255) DEFAULT 'AUTOR',
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de manuscritos
CREATE TABLE manuscritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT,
    contenido TEXT,
    autorId INT NOT NULL,
    editorId INT NULL,
    autores VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'BORRADOR',
    convocatoria VARCHAR(255),
    referencia VARCHAR(255),
    respuestasRevisores TEXT NULL,
    revisoresAsignados INT DEFAULT 0,
    revisionesCompletadas INT DEFAULT 0,
    motivoRechazo TEXT NULL,
    fechaEnvio DATE,
    fechaDecision TIMESTAMP NULL,
    fechaSubida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de información pública/académica (Separada por seguridad y normalización)
CREATE TABLE perfiles_profesionales (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    institucion VARCHAR(200),
    orcid VARCHAR(50) UNIQUE, -- Identificador estándar para investigadores
    especialidad_academica VARCHAR(200),
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
    puntuacion INT NULL,
    comentarios TEXT NULL,
    recomendacion VARCHAR(50) NULL,
    fecha_completada TIMESTAMP NULL,
    FOREIGN KEY (id_revisor) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);