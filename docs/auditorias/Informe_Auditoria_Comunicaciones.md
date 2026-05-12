# Auditoría de Comunicaciones, Servicios y Componentes - Sistema de Revisión por Pares

Fecha de auditoría: 3 de Mayo de 2026

---

## 1. Resumen Ejecutivo

Este documento analiza las comunicaciones throughout del sistema (frontend-backend), los servicios API, los stores Pinia, y los componentes reutilizables. Se evalúa la correcto implementación, connectivity, y se identifican errores de comunicación, missing handlers, y problemas de integración.

---

## 2. Arquitectura de Comunicaciones

### 2.1 Mapeo de Proxy (Vite Config)

| Ruta Frontend | Servicio Backend | Puerto | Estado |
|--------------|-----------------|--------|--------|
| `/api/auth/*` | Usuarios | 3001 | ✅ CONFIGURADO |
| `/api/usuarios/*` | Usuarios | 3001 | ✅ CONFIGURADO |
| `/api/manuscritos/*` | Manuscritos | 3002 | ✅ CONFIGURADO |
| `/api/revision/*` | Revisión | 3003 | ✅ CONFIGURADO |
| `/api/matching/*` | Matching | 3004 | ✅ CONFIGURADO |
| `/api/analisis/*` | Análisis IA | 3005 | ✅ CONFIGURADO |
| `/api/notificaciones/*` | Notificaciones | 3006 | ❌ FALTANTE |

**ISSUE ENCONTRADO:**
- El proxy para `/api/notificaciones` NO está configurado en `vite.config.js`

### 2.2 Endpoints de Salud (Health Checks)

| Servicio | Endpoint | Disponibilidad |
|----------|---------|--------------|
| Usuarios | `GET /health` | ✅ Implementado |
| Manuscritos | `GET /health` | ✅ Implementado |
| Revisión | `GET /health` | ✅ Implementado |
| Matching | ⚠️ No verificado | ¿? |
| Análisis IA | ⚠️ No verificado | ¿? |
| Notificaciones | ⚠️ No verificado | ¿? |

---

## 3. Servicios API (Frontend)

### 3.1 Análisis de `auth.js`

| Función | Método | Endpoint | Manejo Error | Fallback Mock | Estado |
|---------|--------|---------|------------|-------------|--------|
| `loginApi` | POST | `/auth/login` | ✅ | ✅ (MOCK) | ✅ OK |
| `registerApi` | POST | `/auth/register` | ✅ | ❌ | ✅ OK |
| `updateAvatarApi` | PATCH | `/auth/avatar/:id` | ✅ | ❌ | ✅ OK |
| `cambiarPasswordApi` | PATCH | `/auth/password/:id` | ✅ | ❌ | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | Fallback MOCK solo en login, no en otras funciones | MEDIA |
| 2 | No hay timeout configurado | BAJA |

---

### 3.2 Análisis de `usuarios.js`

| Función | Método | Endpoint | Manejo Error | Estado |
|---------|--------|---------|------------|---------|
| `fetchUsuarios` | GET | `/usuarios` | ✅ (retorna []) | ✅ OK |
| `toggleEstadoUsuarioApi` | PATCH | `/:id/estado` | ✅ (retorna boolean) | ✅ OK |
| `crearUsuarioApi` | POST | `/usuarios` | ✅ (retorna null) | ✅ OK |
| `actualizarUsuarioApi` | PATCH | `/:id` | ✅ (retorna null) | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | No hay autenticación en fetch si token no existe | ALTA |
| 2 | Retorna arrays vacíos en caso de error sin distinguir causa | BAJA |

---

### 3.3 Análisis de `manuscritos.js`

| Función | Método | Endpoint | Manejo Error | Estado |
|---------|--------|---------|------------|---------|
| `fetchManuscritos` | GET | `/manuscritos` | ✅ (retorna null) | ✅ OK |
| `fetchManuscritosPorAutor` | GET | `/manuscritos/autor/:autorId` | ✅ (retorna null) | ✅ OK |
| `actualizarEstadoManuscrito` | PATCH | `/:id` | ✅ | ✅ OK |
| `asignarEditorSeccionApi` | PATCH | `/:id` | ✅ | ✅ OK |
| `crearManuscrito` | POST | `/manuscritos` | ✅ (throw) | ✅ OK |
| `actualizarDatosManuscrito` | PATCH | `/:id` | ✅ | ✅ OK |
| `eliminarManuscrito` | DELETE | `/:id` | ✅ | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | No hay endpoint de `download` en el servicio frontend | CRÍTICA |
| 2 | Upload de PDF no implementado como servicio separado | ALTA |
| 3 | La función `crearManuscrito` lanza error, otras retornan boolean | INCONSISTENTE |

---

### 3.4 Análisis de `revision.js`

| Función | Método | Endpoint | Manejo Error | Estado |
|---------|--------|---------|------------|---------|
| `fetchAsignaciones` | GET | `/revision?revisorId=X` | ✅ (retorna []) | ✅ OK |
| `fetchAsignacionesGeneral` | GET | `/revision` | ✅ (retorna []) | ✅ OK |
| `crearAsignacion` | POST | `/revision` | ✅ | ✅ OK |
| `eliminarAsignacionApi` | DELETE | `/:id` | ✅ | ✅ OK |
| `enviarRevisionApi` | POST | `/:id/enviar` | ✅ (retorna null) | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | Falta endpoint para obtener comentarios por manuscrito | ALTA |
| 2 | Falta endpoint para aceptar/declinar invitación | MEDIA |
| 3 | No hay paginación en listados | BAJA |

---

## 4. Stores Pinia (Estado de la Aplicación)

### 4.1 Store: `auth.js`

| Función | Persistencia | Estado |
|---------|------------|---------|
| `usuario` | localStorage (`rpp_usuario`) | ✅ OK |
| `login()` | ✅ | ✅ OK |
| `logout()` | ✅ (limpia localStorage) | ✅ OK |
| `cambiarRol()` | ✅ | ✅ OK |
| `actualizarPerfil()` | ✅ | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | Migración de formato viejo no robusta (líneas 5-17) | MEDIA |
| 2 | No hay validación de token expirado | ALTA |
| 3 | No hay refresh token automático | MEDIA |

---

### 4.2 Store: `autor/index.js`

| Función | Persistencia | Estado |
|---------|------------|---------|
| `manuscritos` | Solo en memoria | ✅ OK |
| `cargarMisManuscritos()` | ✅ | ✅ OK |
| `enviarManuscrito()` | ✅ | ✅ OK |
| `guardarBorrador()` | ✅ | ✅ OK |
| `eliminarBorrador()` | ✅ | ✅ OK |
| `cargarComentarios()` | ✅ | ✅ OK |
| `reenviarManuscrito()` | ✅ | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | **FALLBACK HARCODEADO** - `userId = 1` si no hay usuario (línea 19) | CRÍTICA |
| 2 | No hay manejo de errores consistente con el usuario | MEDIA |
| 3 | No hay persistencia de borradores entre recargas | BAJA |

---

### 4.3 Store: `revisor/index.js`

| Función | Persistencia | Estado |
|---------|------------|---------|
| `articulosAsignados` | Solo en memoria | ✅ OK |
| `borradores` | localStorage (`rpp_borradores`) | ✅ OK |
| `cargarDashboard()` | ✅ | ✅ OK |
| `enviarRevision()` | ✅ | ✅ OK |
| `guardarBorrador()` | ✅ | ✅ OK |
| `cargarBorrador()` | ✅ | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | **FALLBACK HARCODEADO** - `userId = 2` si no hay usuario (línea 27) | CRÍTICA |
| 2 | No hay sincronización con el backend al guardar borrador | BAJA |

---

### 4.4 Store: `editor/index.js`

| Función | Persistencia | Estado |
|---------|------------|---------|
| `manuscritosRaw` | Solo en memoria | ✅ OK |
| `revisoresDisponibles` | Solo en memoria | ✅ OK |
| `filtros` | Solo en memoria | ✅ OK |
| `historialDecisiones` | localStorage | ✅ OK |
| `cargarDashboardEditor()` | ✅ | ✅ OK |
| `asignarRevisor()` | ✅ | ✅ OK |
| `quitarRevisor()` | ✅ | ✅ OK |
| `tomarDecision()` | ✅ | ✅ OK |
| `tomarDecisionConPlantilla()` | ✅ | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | `calcularMatchingReal()` es complejo pero funciona offline | BAJA |
| 2 | No hay paginación de manuscritos | MEDIA |
| 3 | Filtros de fecha no se usan completamente | BAJA |

---

### 4.5 Store: `notificaciones.js`

| Función | Persistencia | Estado |
|---------|------------|---------|
| `notificaciones` | localStorage | ✅ OK |
| `agregar()` | ✅ | ✅ OK |
| `marcarLeida()` | ✅ | ✅ OK |
| `marcarTodasLeidas()` | ✅ | ✅ OK |
| `limpiar()` | ✅ | ✅ OK |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | No hay conexión real al microservicio de notificaciones | CRÍTICA |
| 2 | Mock functions solo agregan manualmente (líneas 55-72) | ALTA |
| 3 | No hay polling para nuevas notificaciones | MEDIA |

---

## 5. Components réutilizables

### 5.1 Análisis de `AppLayout.vue`

| Característica | Estado | Notas |
|--------------|--------|-------|
| Navigation drawer | ✅ OK | Estilo X/twitter |
| RoleSwitcher | ✅ OK | Integrado |
| Notificaciones (solo editor) | ⚠️ PARCIAL | Depende de mock store |
| Responsive (smAndUp) | ✅ OK | Usa useDisplay() |
| Router key force re-render | ✅ OK | Línea 114 |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | Notificaciones solo visibles para rol 'editor' (línea 62, 95) | INCONSISTENTE |
| 2 | Nav config para 'revisor' incluye 'Mi Perfil' pero otros roles no | BAJA |
| 3 | Título no se muestra en todas las rutas | BAJA |

---

### 5.2 Análisis de `RoleSwitcher.vue`

| Característica | Estado | Notas |
|--------------|--------|-------|
| Cambio de rol | ✅ OK | Actualiza auth store |
| Persistencia | ✅ OK | Se guarda en localStorage |
| Visual feedback | ✅ OK | Muestra roles disponibles |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | No hay lógica de roles disponibles por endpoint | BAJA |

---

### 5.3 Análisis de `PdfViewer.vue`

| Característica | Estado | Notas |
|--------------|--------|-------|
| Visualización PDF | ✅ OK | iframe/download |
| Soporte URL o contenido | ✅ OK | Flexible |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | No hay loading state mientras carga | BAJA |
| 2 | Fallback si no es PDF real | BAJA |

---

### 5.4 Análisis de `PdfUploader.vue`

| Característica | Estado | Notas |
|--------------|--------|-------|
| Upload PDF | ✅ OK | Validación MIME |
| Preview | ✅ OK | Muestra nombre |
| Progreso | ⚠️ PARCIAL | Sin progreso real |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | No hay integración con endpoint `upload` del backend | CRÍTICA |
| 2 | No hay progreso real de subida | MEDIA |

---

### 5.5 Análisis de `DecisionDialog.vue`

| Característica | Estado | Notas |
|--------------|--------|-------|
| Plantillas | ✅ OK | 3 por tipo |
| Comentario custom | ✅ OK | editable |
| Preview carta | ✅ OK | muestra reemplazos |

---

## 6. Controladores Backend (NestJS)

### 6.1 Usuarios Controller (`usuarios.controller.ts`)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `/health` | GET | ✅ OK | |
| `/` | GET | ✅ OK | Lista todos |
| `/:id` | GET | ✅ OK | Por ID |
| `/:id` | PATCH | ✅ OK | Actualizar usuario |
| `/:id/estado` | PATCH | ✅ OK | Toggle estado |
| `/:id/rol` | PATCH | ✅ OK | Actualizar rol |
| `/` | POST | ✅ OK | Crear usuario |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | Falta endpoint para actualizar roles múltiples (array) | ALTA |
| 2 | Falta endpoint de perfil de usuario GET | MEDIA |
| 3 | No hay validación de email único | BAJA |

---

### 6.2 Manuscritos Controller (`manuscritos.controller.ts`)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `/health` | GET | ✅ OK | |
| `/upload` | POST | ✅ OK | multer |
| `/download/:referencia` | GET | ✅ OK | Sirve archivo |
| `/` | POST | ✅ OK | Crear |
| `/` | GET | ✅ OK | Lista todos |
| `/autor/:autorId` | GET | ✅ OK | Por autor |
| `/:id` | GET | ✅ OK | Por ID |
| `/:id` | PATCH | ✅ OK | Actualizar |
| `/:id` | DELETE | ✅ OK | Eliminar |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | Upload guarda en cwd() no en volumen Docker | CRÍTICA |
| 2 | No valida tamaño máximo en descarga | BAJA |
| 3 | Falta endpoint para actualizar referencias | MEDIA |

---

### 6.3 Revisión Controller (`revision.controller.ts`)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `/health` | GET | ✅ OK | |
| `/` | GET | ✅ OK | Lista con query |
| `/:id` | GET | ✅ OK | Por ID |
| `/manuscrito/:id` | GET | ✅ OK | Por manuscrito |
| `/` | POST | ✅ OK | Crear asign |
| `/:id/enviar` | POST | ✅ OK | Enviar revisión |
| `/:id` | DELETE | ✅ OK | Eliminar |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | Falta endpoint para aceptar/declinar invitación | ALTA |
| 2 | No hay validación de duplicados | MEDIA |
| 3 | No hay fecha_limite validation | BAJA |

---

## 7. Servicios Backend

### 7.1 Auth Service (`auth.service.ts`)

| Función | Estado | Notas |
|---------|--------|-------|
| `login()` | ✅ OK | JWT generation |
| `register()` | ✅ OK | Hash bcrypt |
| `updateAvatar()` | ✅ OK | Base64 |
| `cambiarPassword()` | ✅ OK | Verify old |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | No hay email verification | MEDIA |
| 2 | Salt rounds = 10 (debil para producción) | BAJA |
| 3 | No hay logout/invalidation de token | BAJA |

---

### 7.2 Usuarios Service (`usuarios.service.ts`)

| Función | Estado | Notas |
|---------|--------|-------|
| Seed users | ✅ OK | Auto-crea demo users |
| `obtenerTodos()` | ✅ OK | |
| `obtenerPorId()` | ✅ OK | |
| `crearUsuario()` | ✅ OK | |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | `synchronize:false` pero usa seed | ⚠️ INCONSISTENTE |
| 2 | Seed siempre intenta crear (no verifica existencia robusta) | BAJA |

---

### 7.3 Revision Service (`revision.service.ts`)

| Función | Estado | Notas |
|---------|--------|-------|
| `enviarRevision()` | ✅ OK | Actualiza estado |
| Flujo post-revisión | ⚠️ PARCIAL | Fetch interno puede fallar |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | URLs internas hardcodeadas (líneas 64, 68, 75) | CRÍTICA |
| 2 | No hay manejo de error del fetch a otros servicios | ALTA |
| 3 | No hay retry logic | MEDIA |

---

### 7.4 Matching Service (`matching.service.ts`)

| Función | Estado | Notas |
|---------|--------|-------|
| Seed mock reviewers | ✅ OK | Solo en memoria |
| `suggestReviewers()` | ✅ OK | Con Gemini |
| `checkConflicts()` | ✅ OK | Con Gemini |

**Problemas identificados:**

| # | Problema | Severidad |
|---|---------|-----------|
| 1 | **NO USA USUARIOS REALES DE DB** - solo seed mock | CRÍTICA |
| 2 | Regenera embeddings cada inicio | MEDIA |
| 3 | Sin cache de embeddings | BAJA |

---

## 8. Problemas de Comunicación Críticos

### 8.1 Problemas de Red/Backend

| # | Problema | Impacto | Severidad |
|------|--------|--------|--------|
| 1 | Proxy `/api/notificaciones` no configurado | No se puede comunicar con servicio 3006 | CRÍTICA |
| 2 | Fallback userId hardcodeado en stores | Datos incorrectos si no hay auth | CRÍTICA |
| 3 | Matching usa seed mock, no usuarios reales | Sugerencias incorrectas | CRÍTICA |
| 4 | Upload guardado en cwd() no volumen | PDFs perdidos al reiniciar | ALTA |
| 5 | URLs internas hardcodeadas en revision.service | Fallan fuera de Docker network | ALTA |

### 8.2 Problemas de handlers

| # | Problema | Impacto | Severidad |
|------|--------|--------|
| 1 | Sin manejo de red en Auth más allá de login | No hay fallback robneo | MEDIA |
| 2 | pdfUploader no llama endpoint real | No funciona upload | CRÍTICA |
| 3 | Notificaciones store es todo mock | No hay notificaciones push/real time | ALTA |
| 4 | Fallback mock inconsistente | Otros endpoints no tienen fallback | MEDIA |

### 8.3 Problemas de Persistencia

| # | Problema | Impacto | Severidad |
|------|--------|--------|
| 1 | Manuscritos no persiste entre recargas del store | Si no se recarga, se pierde | BAJA |
| 2 | Borradores solo en localStorage revisor | Solo un rol tiene persistencia | BAJA |
| 3 | Sin sync automático de stores | Puede haber inconsistency de datos | MEDIA |

---

## 9. Recomendaciones por Prioridad

### Alta Prioridad (Crítico)

1. **Configurar proxy para notificaciones en vite.config.js**
2. **Eliminar fallbacks userId hardcodeados** en stores
3. **Implementar matching con usuarios reales** o marcar feature como "beta"
4. **Corregir upload path** para persistir en volumen Docker
5. **Reemplazar URLs hardcodeadas** con configuración de entorno

### Media Prioridad

1. **Implementar paginación** en todos los endpoints de lista
2. **Conectar PdfUploader** con endpoint `/upload`
3. **Implementar handling de errores** consistente en todos los servicios
4. **Agregar timeouts** a llamadas fetch
5. **Mejorar validation** en controladores

### Baja Prioridad

1. Agregar tooltips y ayuda contextual
2. Implementar retry logic en comunicaciones críticas
3. Agregar estado de loading consistente
4. Implementar auto-refresh de token

---

## 10. Estado Final de Funcionalidad

| Bereich | Estado Promedio | Notas |
|---------|-----------------|-------|
| Auth | 85% | Funcional, fallback ok |
| Usuarios API | 75% | Faltan endpoints |
| Manuscritos API | 80% | Upload needs fix |
| Revisión API | 75% | Faltan endpoints |
| Matching | 40% | Mock no usa datos reales |
| Stores | 70% | Fallbacks problemáticos |
| Components | 85% | Reutilizables |
| Comunicaciones | 60% | Varios issues críticos |

---

*Informe generado el 3 de Mayo de 2026*
*Sistema de Revisión por Pares - Auditoría de Comunicaciones y Servicios*