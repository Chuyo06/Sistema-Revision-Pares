# 🐳 Infraestructura de Datos Unificada (Docker Stack)

Este repositorio contiene la configuración centralizada de servicios de persistencia para el proyecto. Mediante **Docker Compose**, desplegamos un ecosistema completo que incluye bases de datos Relacionales (SQL), NoSQL y sistemas de Caché.



## 🛠️ Servicios Incluidos

* **MariaDB:** Motor relacional principal para datos estructurados y transacciones.
* **MongoDB:** Almacenamiento de documentos para flexibilidad de esquemas y Big Data.
* **Redis:** Almacenamiento en memoria (Key-Value) para caché y alta velocidad.

---

## 📋 Requisitos Previos

1.  **Docker Desktop:** Debe estar instalado y en ejecución. [Descargar aquí](https://www.docker.com/products/docker-desktop/).
2.  **Extensión de VS Code:** Se recomienda **"Database Client"** para gestionar y visualizar los datos directamente en el editor.

---

## ⚙️ Instalación y Despliegue

Sigue estos pasos para levantar el entorno:

1.  Clona este repositorio en tu máquina local.
2.  Abre una terminal en la carpeta raíz del proyecto (donde está el archivo `docker-compose.yml`).
3.  Ejecuta el siguiente comando:

```bash
docker-compose up -d
```

> **Nota:** El flag `-d` (detached) permite que los contenedores corran en segundo plano, liberando tu terminal para seguir trabajando.

---

## 🔐 Credenciales y Conexiones

| Servicio | Puerto Local | Usuario | Contraseña | Base de Datos / URL |
| :--- | :--- | :--- | :--- | :--- |
| **MariaDB** | `3306` | `root` | `root_password` | `mi_base_datos` |
| **MongoDB** | `27017` | `admin` | `password` | `mongodb://admin:password@localhost:27017/` |
| **Redis** | `6379` | *N/A* | *Sin clave* | `redis://localhost:6379` |

---

## ✅ Validación del Entorno

Para verificar que los servicios están "Sanos" (Healthy) y listos para recibir conexiones de los microservicios, ejecuta:

```bash
docker ps
```

Busca que en la columna **STATUS** aparezca el texto `(healthy)`. Si solo dice `Up`, espera unos segundos a que los scripts internos de validación terminen de verificar el motor.

---

## 🖥️ Conexión con VS Code (Database Client)

1.  Abre el panel de **Database** en la barra lateral izquierda de VS Code.
2.  Haz clic en el icono **`+`** para crear una nueva conexión.
3.  **Para MariaDB:** Selecciona MySQL/MariaDB, usa `localhost`, puerto `3306`, user `root` y pass `root_password`.
4.  **Para MongoDB:** Selecciona MongoDB, activa la casilla **"Use Connection String"** y pega la URL de la tabla de arriba.
5.  **Para Redis:** Selecciona Redis, usa `localhost` y puerto `6379`.

---

## ⚠️ Solución de Problemas (Troubleshooting)

**Error: "Ports are not available (3306)"**
Este error ocurre si ya tienes instalado MySQL o MariaDB localmente en Windows (o vía XAMPP).
* **Solución:** Detén tu servicio local de MySQL (en `services.msc`) o cierra el módulo MySQL de XAMPP antes de ejecutar el Docker.

**Error: "Connection Refused"**
Asegúrate de que Docker Desktop esté abierto y que el icono del contenedor en el dashboard de Docker aparezca en verde.

---

## 🛠️ Comandos de Mantenimiento

* **Detener (conservando datos):** `docker-compose stop`
* **Reiniciar servicios:** `docker-compose start`
* **Limpiar entorno (borrar contenedores):** `docker-compose down`
* **Ver logs de un servicio:** `docker-compose logs -f [nombre_servicio]`
---
