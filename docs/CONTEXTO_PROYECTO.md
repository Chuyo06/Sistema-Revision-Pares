# Contexto Actual del Proyecto: Sistema de Revisión por Pares (RPP)

Este documento resume el estado actual, la arquitectura y las instrucciones clave del sistema migrado a microservicios reales.

## 🕒 Estado de la Migración: COMPLETADO
El sistema ha sido migrado exitosamente de un entorno de datos estáticos (mock) a un entorno dinámico conectado a microservicios y bases de datos permanentes.

### 🏛️ Arquitectura Técnica
- **Frontend (Client)**: Vue 3 + Pinia + Vuetify. Ubicado en `/client`.
- **Backend (Microservicios)**:
  - `usuarios`: Gestión de auth y perfiles (Puerto 3001).
  - `manuscritos`: CRUD y estados de artículos (Puerto 3002).
  - `revision`: Asignaciones, evaluaciones y decisiones (Puerto 3003).
- **Persistencia**: MariaDB (Contenedor Docker `mi_mariadb`).

## 🔑 Credenciales y Acceso
- **URL Frontend**: http://localhost:5173
- **Contraseña universal para todos**: `1234`

### Usuarios Principales:
| Rol | Email | Institución |
| :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | Soporte Central |
| **Editor** | `editor@demo.com` | Revista Innovación Tech |
| **Autor** | `autor@demo.com` | Universidad Nacional |
| **Revisor** | `revisor@demo.com` | Instituto de IA |
| **Revisor** | `carlos.r@mit.edu` | MIT Media Lab |

## 🚀 Comandos Clave (Root)
- `npm run dev`: Inicia el sistema conservando datos actuales.
- `npm run dev:fresh`: **RECOMENDADO PARA DEMOS**. Limpia las bases de datos y carga el escenario de prueba más reciente con 12 usuarios internacionales y manuscritos variados.
- `npm run docker:logs`: Ver qué está pasando en el backend NestJS.

## 🔄 Cambios Recientes Importantes
1.  **Normalización de IDs**: El frontend ahora mapea automáticamente `id_usuario` e `id_asignacion` al campo estándar `id` para evitar errores de visualización.
2.  **Módulo Revisión Extendido**: Ahora las evaluaciones incluyen **puntuación (1-5)** y **comentarios consolidados** persistidos en la DB.
3.  **Dashboards Dinámicos**: Los contadores de los dashboards de Autor, Revisor, Editor y Admin ahora reflejan el estado real de las tablas en MariaDB.
4.  **Admin Global**: El administrador ahora tiene una opción de "Manuscritos Globales" para monitorear todo el flujo editorial.

## 🛠️ Notas para el Desarrollador
- Las bases de datos se inicializan automáticamente mediante los scripts en `/database/mariadb/init/`.
- El archivo `04_seed_useful_data.sql` contiene el escenario de prueba más completo.
- El frontend usa un Proxy de Vite para redirigir las llamadas `/api/*` a los puertos 3001-3003 según corresponda.
