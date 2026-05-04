# Sistema de Revisión por Pares (RPP) 🚀

Plataforma integral para la gestión del proceso editorial de revisión por pares, basada en una arquitectura de microservicios (NestJS) y un frontend moderno (Vue 3).

---

## 📋 Guía de Inicio Rápido

Este proyecto está diseñado para ejecutarse con el menor número de comandos posible, orquestando bases de datos y servicios mediante Docker.

### 1. Requisitos Previos 
- **Node.js 20+**
- **Docker Desktop** (Debes tenerlo iniciado)

### 2. Instalación y Ejecución
Desde la carpeta raíz del proyecto:
```bash
# Instalar dependencias (instala raíz y cliente automáticamente)
npm install

# Lanzar el entorno completo con datos de prueba limpios (Recomendado)
npm run dev:fresh
```

## 🔑 Credenciales de Acceso para Pruebas 

Para facilitar el testing de los diferentes flujos, utiliza la siguiente tabla de usuarios preconfigurados. Todos los servicios comparten el mismo sistema de autenticación centralizado.

| Rol | Correo Electrónico | Contraseña | Institución / Propósito |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@demo.com` | `1234` | Control total del sistema. |
| **Editor** | `editor@demo.com` | `1234` | Gestión editorial principal. |
| **Editor** | `j.doe@oxford.ac.uk` | `1234` | Oxford University. |
| **Autor** | `autor@demo.com` | `1234` | Flujo de envíos básico. |
| **Autor** | `elena.v@stanford.edu` | `1234` | Stanford University. |
| **Autor** | `l.martinez@unam.mx` | `1234` | UNAM. |
| **Revisor** | `revisor@demo.com` | `1234` | Revisor de prueba rápido. |
| **Revisor** | `carlos.r@mit.edu` | `1234` | MIT Media Lab. |
| **Revisor** | `chen.wei@tsinghua.cn` | `1234` | Tsinghua University. |
| **Revisor** | `s.kawasaki@u-tokyo.jp` | `1234` | University of Tokyo. |
| **Revisor** | `h.mueller@tu-berlin.de` | `1234` | TU Berlin. |
| **Revisor** | `m.patel@iit.ac.in` | `1234` | IIT Bombay. |

> [!TIP]
> Si deseas limpiar todos los datos y reiniciar los usuarios a este estado inicial, ejecuta: `npm run dev:fresh`.

---

## 🛠️ Stack Tecnológico y Arquitectura

### Frontend
- **Framework**: Vue 3 (Composition API) + Vuetify 3 (Material Design).
- **Estado**: Pinia (Stores modulares para Autor, Editor, Revisor).
- **Herramientas**: Vite (Servidor de desarrollo y Proxy).

### Backend (Microservicios)
Cada servicio corre de forma independiente en su propio puerto:
- **Usuarios API** (Puerto 3001): Autenticación JWT y perfiles.
- **Manuscritos API** (Puerto 3002): CRUD de artículos y archivos.
- **Revisión API** (Puerto 3003): Gestión de asignaciones y formularios de evaluación.

### Infraestructura (Docker)
| Servicio | Tipo | Propósito |
| :--- | :--- | :--- |
| **MariaDB** | Relacional | Datos críticos (Usuarios, Manuscritos, Revisiones). |
| **MongoDB** | NoSQL | Metadatos extendidos y logs. |
| **Redis** | Key-Value | Caché de sesiones y colas de tareas asíncronas. |

---

## 📂 Estructura del Repositorio
```text
Sistema-Revision-Pares/
├── client/                 # Frontend Vue 3
├── microservices/          # Microservicios NestJS
│   ├── usuarios/
│   ├── manuscritos/
│   └── revision/
├── database/               # Scripts de inicialización SQL/NoSQL
├── docker/                 # Configuraciones adicionales de contenedores
└── docker-compose.yml       # Orquestación global
```

---

## 📘 Comandos de Utilidad

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Inicia el entorno de desarrollo. |
| `npm run dev:fresh` | **Limpieza Total**: Borra volúmenes previos y carga datos nuevos. |
| `npm run docker:logs` | Muestra los logs de los microservicios en tiempo real. |
| `npm run docker:down` | Apaga y remueve los contenedores. |

---

## 📚 Documentación de APIs (OpenAPI)

Cada microservicio cuenta con su propia documentación interactiva autogenerada mediante Swagger. Puedes probar los endpoints directamente desde el navegador:

- **Usuarios API**: [http://localhost:3001/docs](http://localhost:3001/docs)
- **Manuscritos API**: [http://localhost:3002/docs](http://localhost:3002/docs)
- **Revisión API**: [http://localhost:3003/docs](http://localhost:3003/docs)
- **Matching API**: [http://localhost:3004/docs](http://localhost:3004/docs)
- **Análisis IA API**: [http://localhost:3005/docs](http://localhost:3005/docs)

---

## ⚠️ Solución de Problemas Comunes

### Error: "Ports are not available (3306/6379)"
Esto ocurre si ya tienes MariaDB o Redis instalado localmente en tu Windows.
- **Solución**: Detén tus servicios locales desde `services.msc` o cierra XAMPP antes de lanzar Docker.

### Error de Conexión (CORS)
Asegúrate de acceder siempre a través del puerto del frontend (**5173**). El Proxy de Vite se encarga de redirigir las llamadas `/api/*` a los puertos correctos de los microservicios.

---
© 2026 - Proyecto de Ingeniería de Software - RPP