# Informe de Auditoría y Revisión del Proyecto - Sistema de Revisión por Pares

Fecha de auditoría: 3 de Mayo de 2026  
Proyecto: Sistema de Revisión por Pares (RPP)  
Versión: 1.0.0

---

## 1. Resumen Ejecutivo

Se realizó una auditoría minuciosa del proyecto completo, incluyendo la estructura de microservicios NestJS, el frontend Vue.js, la base de datos MariaDB/MongoDB, la configuración de Docker, y los servicios de API. Se identificaron múltiples áreas que requieren atención inmediata, incluyendo problemas de comunicación entre microservicios, errores de configuración, fallos en el guardado de datos, y cuestiones de rendimiento.

---

## 2. Errores CríticosEncontrados

### 2.1. Errores de Configuración de Docker

| # | Problema | Ubicación | Severidad |
|---|---------|-----------|----------|
| 2.1.1 | **Falta de configuración ENV en microservicios** | `docker-compose.yml` líneas 59-65, 74-79, 88-91, 100-105, 115-121, 130-134 | CRÍTICA |
| 2.1.2 | **No hay configuración de variables de entorno para DB** | Ningún microservicio tiene `environment:` completo para conexiones a MariaDB/MongoDB/Redis | CRÍTICA |
| 2.1.3 | **Puerto incorrecto en manuscritos microservice** | En `app.module.ts` de manuscritos: usa puerto incorrecto (debería ser el nombre del contenedor Docker, no puerto directo) | ALTA |
| 2.1.4 | **Health checks incompletos** | Algunos servicios no tienen `depends_on` con condiciones de salud | MEDIA |

```yaml
# Problema 2.1.1 - Los microservicios no tienen vars de entorno definidas
# INCORRECTO (actual):
usuarios:
  build: ./microservices/usuarios
  environment:
    - NODE_ENV=development

# CORRECTO (sugerido):
usuarios:
  build: ./microservices/usuarios
  environment:
    - NODE_ENV=development
    - DB_HOST=mariadb
    - DB_PORT=3306
    - DB_USER=root
    - DB_PASSWORD=root_password
    - DB_NAME=mi_base_datos
    - REDIS_HOST=redis
    - REDIS_PORT=6379
    - JWT_SECRET=super_secret_jwt_key_cambiar_en_produccion
```

### 2.2. Errores en Microservicio de Manuscritos

| # | Problema | Ubicación | Severidad |
|---|---------|-----------|----------|
| 2.2.1 | **Conexión DB hardcodeada incorrectamente** | `microservices/manuscritos/src/app.module.ts` | CRÍTICA |
| 2.2.2 | **No verifica si MongoDB está disponible** | ManuscritosService | ALTA |
| 2.2.3 | **Carpeta uploads no persistida en volumen** | `manuscritos.service.ts` línea 18 | ALTA |
| 2.2.4 | **No hay límite de tamaño de archivo** | Servicio de upload sin validación | MEDIA |

```typescript
// Problema 2.2.1 - La conexión usa localhost en lugar del contenedor Docker
// INCORRECTO:
MongooseModule.forRoot('mongodb://localhost:27017/manuscritos')

// CORRECTO:
MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongodb:27017/manuscritos')
```

### 2.3. Errores en Microservicio de Revisión

| # | Problema | Ubicación | Severidad |
|---|---------|-----------|----------|
| 2.3.1 | **Fetch a URLs internas sin manejo de errores** | `revision.service.ts` líneas 64-85 | CRÍTICA |
| 2.3.2 | **URLs hardcodeadas “manuscritos:3000”** | Línea 64, 68, 75 - Funciona solo dentro de Docker network | MEDIA |
| 2.3.3 | **No hay retry logic** | Las llamadas HTTP no tienen reintentos | MEDIA |

### 2.4. Errores de Seguridad

| # | Problema | Ubicación | Severidad |
|---|---------|-----------|----------|
| 2.4.1 | **JWT Secret hardcoded o vacío** | Varios servicios | CRÍTICA |
| 2.4.2 | **CORS excesivamente permisivo** | `app.enableCors()` sin configuración específica | MEDIA |
| 2.4.3 | **Sin rate limiting** | Endpoints de login/register | ALTA |
| 2.4.4 | **Passwords sin validación robusta** | `auth.service.ts` línea 25 - salt 10 es débil para producción | BAJA |

```typescript
// Problema 2.4.2 - CORS demasiado abierto
// ACTUAL (línea 9 de main.ts en cada microservicio):
app.enableCors()

// MEJOR:
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
})
```

---

## 3. Problemas de Comunicación

### 3.1. Comunicación Entre Microservicios

| # | Problema | Servicios Involucrados | Severidad |
|---|---------|---------------------|----------|
| 3.1.1 | **No hay API Gateway unificado** | Todos | ALTA |
| 3.1.2 | **nginx.conf incompleto** | `gateway/nginx.conf` no está conectado en docker-compose | ALTA |
| 3.1.3 | **Sin service discovery** | URLs hardcodeadas entre servicios | MEDIA |
| 3.1.4 | **Falta de Health Checks cruzados** | Un servicio no verifica si otro está disponible | MEDIA |

### 3.2. Frontend a Backend

| # | Problema | Severidad |
|---|---------|
| 3.2.1 | **Proxy mappings incompletos** en `vite.config.js`: faltan `/api/notificaciones` y `/api/notificaciones` | ALTA |
| 3.2.2 | **Retry automático desconectado**: el login tiene fallback a mock pero otras APIs no | MEDIA |
| 3.2.3 | **Timeout de requests no configurado**: sin timeout para llamadas fetch | BAJA |
| 3.2.4 | **Sin interceptor de errores global**: cada llamada maneja errores independientemente | BAJA |

```javascript
// Problema 3.2.1 - Faltan mapeos de proxy en vite.config.js
// FALTAN:
'/api/notificaciones': { target: 'http://localhost:3006', ... }
```

---

## 4. Problemas de Guardado (Persistencia)

### 4.1. Base de Datos - MariaDB

| # | Problema | Ubicación | Severidad |
|---|---------|-----------|----------|
| 4.1.1 | **synchronize: false sin migraciones** | `app.module.ts` de usuarios | CRÍTICA |
| 4.1.2 | **Schema no versionado** | `01_esquema.sql` no tiene controle de versiones | ALTA |
| 4.1.3 | **Seed incompleto** | No todos los roles se crean correctamente | MEDIA |
| 4.1.4 | **No hay índices para búsquedas frecuentes** | Queries lentas en `obtenerTodos()` | MEDIA |

```sql
-- Problema 4.1.4 - Faltan índices para queries comunes
-- AGREGAR:
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_perfiles_usuario ON perfiles_profesionales(id_usuario);
CREATE INDEX idx_asignaciones_revisor ON asignaciones_revision(id_revisor);
CREATE INDEX idx_asignaciones_manuscrito ON asignaciones_revision(id_manuscrito_mongo);
```

### 4.2. MongoDB

| # | Problema | Severidad |
|---|---------|----------|
| 4.2.1 | **Sin seed inicial de manuscritos** | MEDIA |
| 4.2.2 | **Schemas desactualizados** | El schema en código no refleja la DB | MEDIA |

### 4.3. Redis

| # | Problema | Severidad |
|---|---------|----------|
| 4.3.1 | **Redis configurado pero no utilizado** | El cache de Redis está registrado pero no se usa activamente | BAJA |
| 4.3.2 | **No se inicializa con datos útiles** | Solo tiene archivo de seed vacío | BAJA |

---

## 5. Tiempos de Carga y Rendimiento

### 5.1. Tiempos de Inicio ( boot time )

| Componente | Tiempo Estimado | Problema |
|------------|----------------|----------|
| MariaDB | 5-15 seg | Health check 10s + init scripts |
| MongoDB | 3-8 seg | Health check |
| Redis | 1-3 seg | Health check |
| Usuarios (NestJS) | 2-5 seg | +2 seg por Redis Cache |
| Manuscritos (NestJS) | 3-6 seg | Carga de esquemas Mongoose |
| Revisión (NestJS) | 2-4 seg | TipoORM |
| Matching (NestJS) | 3-8 seg | Carga de embeddings |
| Análisis IA (NestJS) | 2-5 seg | Gemini inicialización |
| Notificaciones (NestJS) | 2-4 seg | |
| Frontend Vue | 1-3 seg | Vite dev server |
| **TOTAL ESTIMADO** | **25-60 seg** | Sin optimizar |

### 5.2. Problemas de Rendimiento Identificados

| # | Problema | Impacto |
|---|---------|----------|
| 5.2.1 | **Carga de mock reviewers en cada inicio** - `matching.service.ts` líneas 20-42 - regenera embeddings cada reinicio | ALTO |
| 5.2.2 | **Sin paginación en listados** - `obtenerTodos()` devuelve todos los registros sin límite | ALTO |
| 5.2.3 | **N+1 queries potenciales** - Relaciones sin eager loading optimizado | MEDIO |
| 5.2.4 | **Sin caching de resultados frecuentes** - Redis no se usa para cachear queries | MEDIO |
| 5.2.5 | **Sin compression** - Responses sin gzip | BAJO |
| 5.2.6 | **build.minify: false** en producción - `vite.config.js` línea 89 | BAJO |

### 5.3. Recomendaciones de Optimización

```typescript
// 5.2.2 - Agregar paginación
async obtenerTodos(take = 20, skip = 0) {
  return this.asignacionRepo.find({
    order: { fecha_invitacion: 'DESC' },
    take,
    skip,
  });
}

// 5.2.4 - Usar cache con Redis
@Cacheable('usuarios::all')
async obtenerTodos() { ... }

// 5.2.3 - Optimizar relaciones
const usuarios = await this.usuarioRepo.find({
  relations: { perfil: true, roles: true },
  // O usar queryBuilder para control total
});
```

---

## 6. Problemas de UI/UX (Frontend)

### 6.1. Errores Visuales y de Codificación

| # | Problema | Archivo | Línea | Severidad |
|---|---------|---------|-------|----------|
| 6.1.1 | **Errores de encoding no propagados** | Potencialmente en textos de BD | MEDIA |
| 6.1.2 | **Fallback de avatar incorrecto** | `PerfilPage.vue` línea 23 - evalúa.length cuando debería ser string | MEDIA |
| 6.1.3 | **Snackbar sin referencia reactive** | `PerfilPage.vue` línea 156 - usa .value pero no está definido como ref | CRÍTICA |
| 6.1.4 | **Store de auth con migratory de datos** - `auth.js` líneas 5-17 - código de migración viejo | MEDIA |

```vue
<!-- Problema 6.1.3 - Snackbar no es un ref -->
<script>
// INCORRECTO:
const snackbar = ref({
  show: false,
  ...
})

// CORRECTO:
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})
// Y se define al inicio así, o se usa .value al modificar
```

### 6.2. State Management

| # | Problema | Severidad |
|---|---------|----------|
| 6.2.1 | **Datos mock duplicados** - en `auth.js` y `auth.service.ts` (mock users) | MEDIA |
| 6.2.2 | **Inconsistencia de roles** - some places use `ADMIN`, others `administrador` | ALTA |
| 6.2.3 | **Perfil no se recarga después de update** - после de cambiar avatar, no hay refresh | MEDIA |

### 6.3. PWA y Offline

| # | Problema | Severidad |
|---|---------|----------|
| 6.3.1 | **Service Worker registration async no manejado** - `main.js` línea 17 | BAJA |
| 6.3.2 | **Sync strategy no implementada completamente** - El sync de offline está vacío | ALTA |

---

## 7. Falta de Funcionalidad

### 7.1. Features Incompletos

| # | Feature | Estado | Prioridad |
|---|---------|--------|----------|
| 7.1.1 | **Convocatorias/Call for Papers** | Página existe pero funcionalidad incompleta | ALTA |
| 7.1.2 | **Edición de perfil de revisor (especialidades)** | UI existe pero no persiste correctamente | ALTA |
| 7.1.3 | **Sistema de matching IA** | Solo hace seed de datos quemados, no conecta con usuarios reales | CRÍTICA |
| 7.1.4 | **Análisis IA** | Microservicio existe pero sin conexión real | ALTA |
| 7.1.5 | **Notificaciones push** | No están totalmente implementadas | MEDIA |
| 7.1.6 | **Historial de revisiones** | Page exists but no real data | MEDIA |
| 7.1.7 | **Dashboard real-time** - No hay WebSockets | BAJA |

### 7.2. Endpoints Faltantes

| Endpoint | Estado | Notas |
|----------|--------|-------|
| `GET /usuarios/:id/perfil` | NO IMPLEMENTADO | Needed for profile editing |
| `PATCH /usuarios/:id/roles` | INCOMPLETO | No bulk role update |
| `GET /manuscritos/autor/:id` | FALTA | Listados por autor |
| `POST /manuscritos/:id/submit` | FALTA | Envío formal |
| `POST /revision/:id/aceptar` | FALTA | Aceptar invitación |
| `POST /revision/:id/declinar` | FALTA | Declinar invitación |
| `GET /matching/revisores` | FALTA | Lista de revisores disponibles |
| `GET /notificaciones` | FALTA | Obtener notificaciones |

---

## 8. Testing y Calidad de Código

### 8.1. Test Coverage

| Microservicio | Tests Unitarios | Tests E2E | Cobertura Estimada |
|--------------|----------------|-----------|-------------|------------------|
| Usuarios | ✅ Presentes | ✅ Presentes | >60% |
| Manuscritos | ⚠️ Incomplete | ✅ Presentes | 30% |
| Revisión | ⚠️ Incomplete | ✅ Presentes | 25% |
| Matching | ❌ No hay | ❌ No hay | 0% |
| Análisis IA | ❌ No hay | ❌ No hay | 0% |
| Notificaciones | ❌ No hay | ❌ No hay | 0% |

### 8.2. Code Quality Issues

| # | Problema | Severidad |
|---|---------|----------|
| 8.2.1 | **Sin ESLint/Prettier configured** en cliente | MEDIA |
| 8.2.2 | **Sin linting en NestJS** | MEDIA |
| 8.2.3 | **console.log presente en código** - `matching.service.ts`, `usuarios.service.ts` | BAJA |
| 8.2.4 | **Sin manejo de excepciones centralizado** | ALTA |

---

## 9. Documentación

### 9.1. Documentación Faltante

| Documento | Estado |
|-----------|--------|
| API Documentation (OpenAPI) | ✅ Swagger disponible en cada servicio |
| Diagrama de Arquitectura | ⚠️ Solo parcialmente en README |
| Diagrama de Base de Datos | ⚠️ Existe pero incompleto |
| Guía de Contribución | ✅ Presente |
| CHANGELOG | ❌ No existe |
| Deployment Guide | ❌ No existe |
| Security Policy | ❌ No existe |

---

## 10. Matriz de Priorización

### Alta Prioridad (Crítico - Arreglar Inmediatamente)

| # | Issue | Categoría |
|-----|-------|-----------|
| 1 | Variables de entorno no configuradas en Docker | Configuración |
| 2 | Snackbar no reactivo en PerfilPage | Frontend |
| 3 | synchronize:false sin migraciones | Base de Datos |
| 4 | URLs hardcodeadas entre servicios | Comunicación |
| 5 | Sistema de matching no usa datos reales | Funcionalidad |

### Media Prioridad (Importante - Arreglar en Sprint)

| # | Issue | Categoría |
|-----|-------|-----------|
| 1 | Fallback de login a mock pero otras APIs no | Comunicación |
| 2 | Sin paginación en listados | Rendimiento |
| 3 | JWT Secret hardcoded/vacío | Seguridad |
| 4 | Seed regenera embeddings cada inicio | Rendimiento |
| 5 | CORS demasiado permisivo | Seguridad |
| 6 | Sin rate limiting | Seguridad |
| 7 | Inconsistencia de nombres de roles | Frontend |
| 8 | Nginx no conectado en docker-compose | Infraestructura |

### Baja Prioridad (Nice to Have - Backlog)

| # | Issue | Categoría |
|-----|-------|-----------|
| 1 | console.log en código de producción | Calidad |
| 2 | minify:false en build | Rendimiento |
| 3 | Sin CHANGELOG | Documentación |
| 4 | Tests faltantes en matching/analisis | Testing |
| 5 | Sin compression de respuestas | Rendimiento |

---

## 11. Recomendaciones de Acción Inmediata

1. **Configurar variables de entorno en docker-compose.yml** para todos los microservicios
2. **Crear archivo `.env`** basado en `.env.example` y completar todas las variables
3. **Arreglar el bug del snackbar** en `PerfilPage.vue` línea 156
4. **Habilitar TypeORM migrations** o cambiar a `synchronize: true` para desarrollo
5. **Completar el sistema de matching** conectando con la tabla de revisores reales
6. **Implementar paginación** en todos los endpoints de lista
7. **Configurar JWT_SECRET** válido para todos los servicios
8. **Agregar rate limiting** en endpoints de autenticación

---

## 12. Notas Adicionales

- El proyecto tiene una estructura sólida de microservices bien organizada
- La separación de responsabilidades entre servicios es correcta
- El frontend Vue tiene una buena arquitectura de stores con Pinia
- El sistema de roles múltiples está bien implementado
- La arquitectura de Docker es correcta, solo falta configuración de entorno

---

*Informe generado el 3 de Mayo de 2026*  
*Proyecto: Sistema de Revisión por Pares (RPP)*