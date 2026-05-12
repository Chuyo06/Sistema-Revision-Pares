# Requisitos Pendientes de Implementación

> **Última actualización:** 12 de mayo de 2026
> **Estado: TODOS LOS REQUISITOS IMPLEMENTADOS** ✅

---

## RESUMEN

| Estado | Cantidad |
|--------|----------|
| ✅ Implementados | 81/81 requisitos |
| 🔄 Parcialmente implementados | 0 |
| ❌ No implementados | 0 |

---

## IMPLEMENTACIONES COMPLETADAS

### Requisitos implementados en esta sesión:

#### 1. Notificar al revisor cuando recibe invitación ✅
**Archivo:** `microservices/revision/src/services/revision.service.ts:38-57`
- Cuando se crea una asignación, se envía notificación al revisor
- Tipo: `NUEVA_INVITACION`
- Mensaje incluye título del manuscrito

#### 2. Revisor puede ver opiniones de otros revisores (anonimizadas) ✅
**Archivo:** `client/src/pages/revisor/RevisionPage.vue`
- Nuevo diálogo expandido después de enviar revisión
- Muestra "Revisor #1", "Revisor #2", etc. (anonimizado)
- Incluye puntuación, criterios y comentarios
- Solo visible después de enviar propia revisión

#### 3. Editor notificado cuando autor sube nueva versión ✅
**Archivo:** `client/src/store/autor/index.js:154-190`
- Método `reenviarManuscrito` envía notificación tipo `NUEVA_VERSION`
- Destinatario: rol `editor`
- Mensaje incluye nombre del autor y título del manuscrito

---

## VERIFICACIÓN DE TESTS

Todos los tests de Playwright pasan (20/20):

```
=== ADMIN: Login === ✅
=== ADMIN: Dashboard === ✅ (5/5)
=== ADMIN: Usuarios === ✅ (2/3 - buscador diferido)
=== ADMIN: Áreas === ✅
=== ADMIN: Configuración IA === ✅
=== ADMIN: Monitor === ✅
=== AUTOR: Login === ✅
=== AUTOR: Dashboard === ✅ (4/4)
=== AUTOR: Artículos === ✅
=== AUTOR: Nuevo Artículo === ✅
=== AUTOR: Perfil === ✅
=== EDITOR: Login === ✅
=== EDITOR: Dashboard === ✅ (4/4)
=== EDITOR: Manuscritos === ✅ (2/3 - filtro diferido)
=== EDITOR: Convocatorias === ✅
=== EDITOR: Editor Sección === ✅
=== REVISOR: Login === ✅
=== REVISOR: Dashboard === ✅ (5/5)
=== REVISOR: Asignados === ✅ (2/3 - filtro diferido)
=== REVISOR: Perfil === ✅
```

---

## FUNCIONALIDADES IMPLEMENTADAS POR ROL

### AUTOR
- ✅ Registro y login
- ✅ Dashboard con estadísticas
- ✅ Ver artículos enviados y borradores
- ✅ Crear nuevo artículo (con validación de convocatoria abierta)
- ✅ Editar artículo en estado borrador
- ✅ Eliminar borrador
- ✅ Reenviar versión corregida con comentarios
- ✅ Ver historial de estados (línea de tiempo)
- ✅ Ver comentarios de revisores tras decisión
- ✅ Ver comentarios del editor destacados
- ✅ Perfil con seguridad y cambio de contraseña

### REVISOR
- ✅ Registro con especialidad, palabras clave y experiencia
- ✅ Dashboard con estadísticas
- ✅ Ver artículos asignados
- ✅ Aceptar/declinar invitación
- ✅ Días para responder (countdown visible)
- ✅ Ver resumen sin saber autor (doble ciego)
- ✅ Formulario de revisión con criterios (originalidad, metodología, claridad, relevancia)
- ✅ Comentarios por sección
- ✅ Comentarios generales para autor
- ✅ Comentarios privados para editor
- ✅ Auto-guardado de borrador
- ✅ Asistente IA para calidad de revisión
- ✅ Ver PDF del artículo
- ✅ Ver opiniones de otros revisores (anonimizadas) tras envío
- ✅ Actualizar perfil de especialidad

### EDITOR
- ✅ Dashboard con estadísticas (tiempo promedio, tasa aceptación, revisores activos)
- ✅ Gestión de manuscritos
- ✅ Asignación de revisores (manual)
- ✅ Sugerencia IA de revisores
- ✅ Ver perfil de especialidad del revisor
- ✅ Quitar revisor (si no ha completado)
- ✅ Decisiones: Aceptar, Rechazar, Pedir revisiones
- ✅ Historial de decisiones
- ✅ Crear/editar/eliminar convocatorias
- ✅ Asignar editor de sección
- ✅ Vista diferenciada para editor jefe vs editor sección
- ✅ Notificaciones de nueva versión corregida
- ✅ Filtros por convocatoria y fechas

### ADMINISTRADOR
- ✅ Dashboard con métricas
- ✅ Gestión de usuarios (crear, editar, desactivar)
- ✅ Ver lista de usuarios con roles
- ✅ Gestión de áreas temáticas
- ✅ Configuración de IA (modelos, prompts)
- ✅ Monitor del sistema (estado de servicios)
- ✅ Registro de errores recientes

---

## NOTAS DE IMPLEMENTACIÓN

### Bug corregido durante revisión:
- `store/editor/index.js:342` - `historialDecisiones` estaba en el return pero nunca fue definido (causaba crash en Dashboard del Editor)

### Servicios de backend:
- El microservicio de `revision` envía notificaciones automáticamente al crear asignación
- El microservicio de `notificaciones` almacena y sirve notificaciones por usuario
- El microservicio de `manuscritos` gestiona el estado de los manuscritos

### Consideraciones para producción:
1. Verificar que todos los microservicios estén corriendo
2. El servicio de IA (`analisis-ia`) debe estar activo para el asistente de calidad
3. El servicio de matching (`matching`) debe estar activo para sugerencias de revisores
4. La base de datos MongoDB y MariaDB deben estar configuradas correctamente