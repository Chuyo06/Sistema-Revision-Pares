# Sistema de Revisión por Pares (RPP)

Plataforma integral para la gestión del proceso editorial de revisión por pares, basada en una arquitectura de microservicios (NestJS) y un frontend moderno (Vue 3).

---

## Para Nuevos Compañeros: Empezar de Cero

> **Requisitos**: Node.js 20+ y Docker Desktop iniciado.

```bash
# 1. Clonar el repositorio y entrar al proyecto
cd Sistema-Revision-Pares

# 2. Instalar TODO (cliente, microservicios y Playwright)
npm install

# 3. [Solo primera vez] Instalar navegador para tests
npm run test:install

# 4. Arrancar el sistema completo con datos frescos
npm run dev:fresh
```

El sistema estará disponible en **http://localhost:5173**.

---

## Mantener Todo al Día

Cuando otro compañero haga cambios al repositorio:

```bash
# 1. Traer los últimos cambios
git pull

# 2. Actualizar todas las dependencias (se ejecuta automáticamente si alguien modifyó package.json)
npm install

# 3. Si hay nuevos contenedores o cambios en Docker, reconstruir
npm run docker:down
npm run dev:fresh
```

> [!TIP]
> Si alguien modifica algo en las carpetas `client/` o `microservices/`, solo necesitas `npm install` dentro de esa carpeta, no todo el proyecto.

```bash
# Actualizar solo el frontend
cd client && npm install && cd ..

# Actualizar solo un microservicio
cd microservices/manuscritos && npm install && cd ../..
```

---

## Comandos Disponibles

### Primeros Pasos
| Comando | Descripción |
|:---|:---|
| `npm install` | Instala todo (cliente + microservicios + Playwright). |
| `npm run dev:fresh` | Limpia volúmenes y arranca con datos frescos. |
| `npm run test:install` | Instala el navegador Chromium para tests E2E. |

### Desarrollo Diario
| Comando | Descripción |
|:---|:---|
| `npm run dev` | Inicia el entorno completo (conserva datos existentes). |
| `npm run dev:client` | Solo el frontend (Vite, puerto 5173). |
| `npm run build` | Compila el frontend para producción. |

### Docker
| Comando | Descripción |
|:---|:---|
| `npm run docker:up` | Levanta todos los contenedores. |
| `npm run docker:down` | Detiene los contenedores. |
| `npm run docker:logs` | Logs en tiempo real de los contenedores. |
| `npm run docker:ps` | Ver estado de los contenedores. |

### Tests E2E
| Comando | Descripción |
|:---|:---|
| `npm run test` | Ejecuta tests E2E (headless, sin navegador). |
| `npm run test:headed` | Ejecuta tests con navegador visible. |
| `npm run test:ui` | Abre la interfaz gráfica de Playwright. |
| `npm run test:report` | Muestra el reporte HTML del último test. |

---

## Credenciales de Prueba

| Rol | Email | Contraseña |
|:---|:---|:---|
| **Administrador** | `admin@demo.com` | `1234` |
| **Editor Jefe** | `editor@demo.com` | `1234` |
| **Editor Sección** | `editor.seccion@demo.com` | `1234` |
| **Autor** | `autor@demo.com` | `1234` |
| **Autor** | `elena.v@stanford.edu` | `1234` |
| **Revisor** | `revisor@demo.com` | `1234` |
| **Revisor** | `carlos.r@mit.edu` | `1234` |

---

## Arquitectura del Proyecto

```
Sistema-Revision-Pares/
├── client/                    # Frontend Vue 3 + Vuetify + Pinia
├── microservices/             # Backend NestJS
│   ├── usuarios/        (3001)  # Auth y perfiles
│   ├── manuscritos/     (3002)  # CRUD de artículos y PDF
│   ├── revision/        (3003)  # Asignaciones y evaluaciones
│   ├── matching/        (3004)  # Algoritmo de emparejamiento
│   └── analisis-ia/     (3005)  # Análisis con IA
├── docs/                      # Documentación del proyecto
│   └── auditorias/            # Informes de auditoría
├── tests/                     # Tests E2E (Playwright)
└── docker-compose.yml         # Orquestación de servicios
```

### Puertos de los Servicios
| Puerto | Servicio |
|:---|:---|
| 5173 | Frontend (Vite) |
| 3001 | Usuarios API |
| 3002 | Manuscritos API |
| 3003 | Revisión API |
| 3004 | Matching API |
| 3005 | Análisis IA API |

### Bases de Datos (Docker)
- **MariaDB** - Datos relacionales
- **MongoDB** - Metadatos y logs
- **Redis** - Caché y sesiones

---

## Diferenciación de Roles Editoriales

Se ha implementado una jerarquía clara dentro del equipo editorial:

### 👑 Editor en Jefe (Color: Azul Profundo)
- **Privilegios**: Gestión total del sistema.
- **Acciones**: Crear/Editar convocatorias, asignar editores de sección, toma de decisión final (Aceptar/Rechazar).
- **Visibilidad**: Ve todos los manuscritos del sistema.

### 📗 Editor de Sección (Color: Verde Bosque)
- **Privilegios**: Operativo y enfocado.
- **Acciones**: Gestionar revisores para los artículos asignados, enviar recomendaciones al Jefe.
- **Visibilidad**: Limitada únicamente a los manuscritos donde ha sido asignado como responsable.
- **Restricciones**: No puede crear convocatorias ni tomar la decisión final sobre el estado del artículo.

---

## Solución de Problemas Comunes

### Error: "Ports are not available (3306/6379)"
> Significa que MariaDB o Redis ya están corriendo en tu máquina.
> **Solución**: Detén esos servicios desde `services.msc` o cierra XAMPP/WAMP.

### Error: "Cannot find module 'xxxxx'"
> Faltan dependencias.
> **Solución**: `npm install` desde la carpeta raíz.

### Error: "Connection refused" al acceder a los microservicios
> Los contenedores de Docker no están corriendo.
> **Solución**: `npm run docker:up`

### Los tests E2E fallan
> Primero verifica que el sistema corre bien manualmente en el navegador.
> Si el frontend no carga, los tests tampoco funcionarán.

### Cambios en el código no se reflejan
> Detén el servidor (Ctrl+C) y vuelve a `npm run dev`.

---

## Documentación de APIs (Swagger)

Cada microservicio tiene su propia documentación:
- http://localhost:3001/docs (Usuarios)
- http://localhost:3002/docs (Manuscritos)
- http://localhost:3003/docs (Revisión)
- http://localhost:3004/docs (Matching)
- http://localhost:3005/docs (Análisis IA)

---

## Guía de Contribución

1. **Antes de trabajar**: `git pull` para tener la última versión.
2. **Trabaja en tu propia rama**: `git checkout -b mi-rama-trabajo`.
3. **Haz tus cambios** y pruébalos con `npm run dev`.
4. **Ejecuta tests** con `npm run test` antes de commitear.
5. **Commit y push**: `git commit -m "descripción"` y `git push`.
6. **Crea un Pull Request** para que el equipo revise tus cambios.

> [!NOTE]
> Para cambios en `client/` o `microservices/`, prueba manualmente que el sistema sigue funcionando antes de hacer PR.

---

## Documentación Adicional

Revisa la carpeta `/docs` para:
- `CONTEXTO_PROYECTO.md` - Estado actual y arquitectura del sistema.
- `CONTRIBUTING.md` - Guía de contribución detallada.
- `requisitos_pendientes.md` - Requisitos por implementar.
- `auditorias/` - Informes de auditoría del sistema.

---

© 2026 - Proyecto de Ingeniería de Software - RPP