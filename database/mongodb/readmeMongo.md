# 📝 Documentación de Infraestructura - Sprint 1
**Proyecto:** Sistema de Revisión por Pares (PWA Editorial)  
**Estado:** ✅ Configurado y Funcional  

Este documento resume la configuración del stack tecnológico, los comandos críticos de uso y la solución a los problemas de rutas y permisos encontrados durante el desarrollo.

---

## 🛠️ Stack Tecnológico (Docker)
El entorno corre sobre 4 servicios principales:
1.  **MariaDB:** Base de datos relacional para gestión de usuarios y roles.
2.  **MongoDB:** Almacenamiento NoSQL para metadatos de manuscritos (`mi_base_datos`).
3.  **Redis:** Sistema de caché para sesiones y rapidez de respuesta.
4.  **MinIO:** Servidor de objetos (S3) para el almacenamiento físico de los PDFs.

---

## 🚀 Comandos Rápidos de Uso

### Levantar el entorno
Desde la carpeta `/docker`, ejecuta:
```bash
docker-compose up -d
```

### Apagar el entorno (Sin perder datos)
**IMPORTANTE:** Usa este comando para mantener tus archivos en MinIO y tus datos en las bases.
```bash
docker-compose down
```

### Limpieza profunda (Reinicio de fábrica)
Usa esto **solo si quieres borrar todo** (incluyendo PDFs subidos y datos insertados) para probar los scripts iniciales (`seeders`).
```bash
docker-compose down -v
```

---

## 📂 Estructura de Datos (MongoDB)
La colección `documentos_metadata` ya está preparada con los campos que requiere el flujo de trabajo:

```json
{
  "numero_referencia": "REF-2026-001",
  "titulo": "Título del artículo",
  "palabras_clave": ["tag1", "tag2"],
  "fecha_creacion": "2026-04-04T...",
  "estado": "BORRADOR", 
  "archivo_url": "http://localhost:9000/articulos-revision/archivo.pdf",
  "autor_id": 1
}
```

---

## ⚠️ Problemas Encontrados y Soluciones

### 1. Error de Rutas en Windows (`ENOENT: no such file`)
* **Problema:** Docker no encontraba los archivos `.js` de carga inicial porque la ruta `./database` fallaba al ejecutar el comando desde la carpeta `/docker`.
* **Solución:** Se implementó el uso de rutas absolutas automáticas con **`${PWD}`** y el salto de carpeta padre **`../`** en el `docker-compose.yml`.
* **Fix aplicado:**
    `- ${PWD}/../database/mongodb/seeders:/docker-entrypoint-initdb.d`

### 2. Error de Acceso Denied en MinIO (`Access Denied / XML`)
* **Problema:** Al intentar ver el PDF desde el navegador, MinIO bloqueaba la petición por ser un Bucket privado por defecto.
* **Solución:** Cambiar la política del bucket a **Public**. Como la interfaz web a veces se bloqueaba, se usó el cliente de consola de MinIO (`mc`).
* **Comandos de reparación (PowerShell):**
```powershell
docker exec mi_minio mc alias set local http://localhost:9000 admin password
docker exec mi_minio mc anonymous set download local/articulos-revision
```

### 3. Error de Símbolos en PowerShell (`&&`)
* **Problema:** El uso de `&&` para encadenar comandos fallaba en PowerShell.
* **Solución:** Ejecutar los comandos de Docker uno por uno de forma secuencial.

---

## 📋 Checklist para el Validador (Prueba de Concepto)
Para verificar que el sistema de archivos funciona para el equipo de backend:
1.  Subir un archivo a MinIO en el bucket `articulos-revision`.
2.  Asegurarse de que el nombre coincida con el link en MongoDB.
3.  Acceder vía URL: `http://localhost:9000/articulos-revision/tu_archivo.pdf`.
4.  Si el PDF carga, el flujo de "Almacenamiento en Servidor" (Tarea 2404) está validado.

---
**Notas adicionales:** - El puerto **9001** es exclusivo para la consola de administración (humano).
- El puerto **9000** es el que debe usar el código de Backend (API).