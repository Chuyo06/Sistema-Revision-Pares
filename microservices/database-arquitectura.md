# 🏛️ Arquitectura de Bases de Datos por Microservicio

Este documento define la estrategia de **Persistencia Políglota** aplicada al Sistema de Revisión por Pares. Cada microservicio utiliza el motor de base de datos que mejor resuelve sus necesidades de estructura, velocidad y almacenamiento.

---

## 📌 Asignación por Módulo

### 1. `usuarios` (Gestión de Identidad y Seguridad)
* **MariaDB (Principal):** Almacena datos transaccionales estrictos como credenciales, perfiles y la jerarquía de roles (Autores, Revisores, Editores, Administradores). Garantiza la integridad referencial.
* **Redis (Caché):** Maneja las sesiones activas y los tokens JWT para asegurar tiempos de respuesta ultrarrápidos sin saturar la base de datos relacional.

### 2. `manuscritos` (Core Editorial y Archivos)
* **MongoDB (Principal):** Almacena la metadata flexible de los artículos, el historial de cambios, arrays de palabras clave y el estado de sincronización para los clientes PWA offline.
* **MinIO (Almacenamiento):** Servidor de almacenamiento de objetos (compatible con S3) dedicado exclusivamente a guardar los archivos binarios (PDFs de los artículos).

### 3. `revision` (Flujo de Trabajo y Asignaciones)
* **MariaDB (Principal):** Gestiona las asignaciones de revisores a artículos, control de tiempos (deadlines) y métricas de revisión. Requiere transacciones ACID para evitar que dos revisores modifiquen el mismo estado de forma conflictiva.

### 4. `matching` (Motor de Emparejamiento Semántico)
* **MongoDB (Principal):** Almacena y consulta los *embeddings* semánticos. Es el entorno ideal para guardar y comparar los vectores generados a partir de los perfiles de los revisores y los resúmenes de los artículos.

### 5. `analisis-ia` (Integración con LLMs)
* **MongoDB (Principal):** Guarda el historial, auditoría y logs detallados de todas las interacciones, prompts y resultados devueltos por el modelo de lenguaje.
* **Redis (Caché):** Actúa como capa intermedia para cachear respuestas idénticas del LLM, evitando peticiones repetitivas a la API de Inteligencia Artificial para ahorrar tiempo y costos de procesamiento.

---

## ⚙️ Resumen de Tecnologías

| Tecnología | Tipo | Propósito en el Sistema |
| :--- | :--- | :--- |
| **MariaDB** | SQL / Relacional | Integridad de datos, usuarios, roles y asignaciones críticas. |
| **MongoDB** | NoSQL / Documental | Flexibilidad, metadatos variables, embeddings y auditoría de IA. |
| **Redis** | In-Memory / Key-Value | Caché de sesiones, colas de notificaciones y caché de IA. |
| **MinIO** | Object Storage | Almacenamiento físico de archivos (PDFs). |