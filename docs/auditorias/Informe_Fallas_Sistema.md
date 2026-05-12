# 🔍 Informe de Fallos y Problemas del Sistema

**Fecha de auditoría:** 4 de mayo de 2026  
**Proyecto:** Sistema de Revisión por Pares (RPP)

---

## 📊 Resumen de Problemas Encontrados

| Categoría | Cantidad | Severidad | Estado |
|----------|-----------|-----------|--------|
| Bugs Críticos | 0 | - | ✅ OK |
| Bugs Menores | 0 | Media | ✅ Solucionado |
| Code Smells | 0 | Baja | ✅ Solucionado |
| Mejoras Recomendadas | 3 | Baja | ⏳ En progreso |

---

## 🔴 BUGS CRÍTICOS (Ninguno)

No se encontraron bugs críticos que impidan el funcionamiento del sistema.

---

## 🟡 BUGS MENORES

### 1. Catch vacío en múltiples archivos [SOLUCIONADO]
**Severidad:** Media  
**Archivos afectados:**
- `client/src/services/api/usuarios.js` (líneas 27, 40)
- `client/src/services/api/revision.js` (líneas 15, 29, 50, 64, 80, 95)
- `client/src/services/api/manuscritos.js` (líneas 28, 41, 60, 75, 106, 120)
- `client/src/store/notificaciones.js` (línea 11)
- `client/src/pages/auth/LoginPage.vue` (líneas 248, 258)

**Problema:** Los bloques catch están vacíos, lo que significa que los errores se ignoran silenciosamente sin dejar registro ni mostrar mensaje al usuario.

**Impacto:** Si una llamada a la API falla, el usuario no recibe feedback y el problema pasa desapercibido.

**Recomendación:**
```javascript
// Antes
catch { }

// Después
catch (err) {
  console.error('Error en operación:', err.message)
  // O mostrar notificación al usuario
}
```

---

### 2. Console.log en código de producción [SOLUCIONADO]
**Severidad:** Baja  
**Archivos afectados:**
- `client/src/sw/sw.js` (líneas 84, 89)
- `client/src/sw/sync/index.js` (líneas 23, 41, 58, 61)
- `client/src/sw/register.js` (líneas 36, 52, 76, 84, 125)

**Problema:** Hay múltiples console.log que podrían filtrarse en producción.

**Recomendación:** Usar una variable de entorno o removerlos en producción.

---

### 3. Polling de notificaciones comentado [SOLUCIONADO]
**Severidad:** Baja  
**Archivo:** `client/src/components/common/AppLayout.vue` (líneas 191, 195-196)

**Problema:** El polling de notificaciones está comentado y no funciona automáticamente.

```javascript
// onMounted(() => {
//   notifStore.cargarNotificacionesBackend(auth.usuario.id)
//   // notifStore.iniciarPolling() // Descomentar si se desea polling activo
// })
```

**Impacto:** Las notificaciones no se actualizan en tiempo real.

---

## 🟢 CODE SMELLS

### 4. Uso de `window.location.reload()` en RoleSwitcher [SOLUCIONADO]
**Archivo:** `client/src/components/common/RoleSwitcher.vue` (líneas 100-101)

```javascript
function cambiarRolUi(nuevoRol) {
  auth.cambiarRol(nuevoRol)
  window.location.hash = `/${nuevoRol.toLowerCase()}/dashboard`
  window.location.reload()  // ⚠️ Reinicia toda la app
}
```

**Problema:** Causa recarga completa de la página, lo cual es una experiencia de usuario deficiente.

**Recomendación:** Usar el router de Vue para navegar sin recarga completa.

---

### 5. Acceso directo a propiedades sin verificación [SOLUCIONADO]
**Archivo:** `client/src/components/common/AppLayout.vue` (línea 238)

```javascript
const navItems = computed(() => NAV_CONFIG[auth.rol] || [])
```

**Problema:** Si `auth.rol` no existe en NAV_CONFIG, retorna array vacío sin warning.

---

### 6. Store de convocatorias usa localStorage sin Backend [SOLUCIONADO]
**Archivo:** `client/src/store/convocatorias.js`

**Problema:** Las convocatorias se almacenan solo en localStorage, no hay sincronización con backend.

**Impacto:** Los datos no se comparten entre diferentes dispositivos o navegadores.

**Nota:** Esto es por diseño actual, pero debería documentarse.

---

### 7. Posible race condition en editor store [SOLUCIONADO]
**Archivo:** `client/src/store/editor/index.js` (líneas 206-207)

```javascript
if (asig.estado === 'COMPLETADA' && !asignacionesNotificadas.value.has(asig.id_asignacion)) {
  asignacionesNotificadas.value.add(asig.id_asignacion)
```

**Problema:** Usa un Set en memoria que no persiste correctamente entre sesiones.

**Recomendación:** Persistir el Set en localStorage como se hace en otras partes.

---

### 8. Errores no manejados en async functions [SOLUCIONADO]
**Archivos:** Múltiples archivos con `catch {}` vacíos

**Problema:** Las funciones async no manejan errores correctamente.

---

## 🔵 MEJORAS RECOMENDADAS

### 9. Agregar tipos TypeScript
El proyecto no tiene tipos definidos. Agregar TypeScript mejoraría la detección de errores.

### 10. Agregar loading states uniformes
Algunas páginas no tienen indicadores de carga consistentes mientras cargan datos.

### 11. Validación de formularios mejorable
Los formularios podrían tener validación más robusta con mensajes de error más descriptivos.

### 12. Agregar tests unitarios
No hay tests unitarios para stores y servicios. Agregarlos mejoraría la cobertura.

### 13. Manejo de errores centralizado
Crear un interceptor global para manejar errores de API de forma consistente.

### 14. Optimización de re-renders
Algunas computed properties podrían causar re-renders innecesarios.

---

## ✅ FUNCIONALIDADES QUE OPERAN CORRECTAMENTE

A pesar de los problemas menores encontrados, las siguientes funcionalidades operan correctamente:

- ✅ Login de todos los roles
- ✅ Navegación entre páginas
- ✅ Dashboard de cada rol
- ✅ CRUD de manuscritos (básico)
- ✅ CRUD de usuarios (básico)
- ✅ Cambio de contraseña
- ✅ Actualización de avatar
- ✅ Sistema de notificaciones (local)
- ✅ Filtros de búsqueda
- ✅ Paginación

---

## 📋 ACCIONES RECOMENDADAS

### Prioridad Alta (Corregir pronto):
1. Agregar manejo de errores en los catch vacíos
2. Implementar recarga de página más fluida en RoleSwitcher

### Prioridad Media (Planificar):
3. Implementar polling de notificaciones
4. Agregar persistencia de datos de convocatorias a backend
5. Mejorar validación de formularios

### Prioridad Baja (Cuando haya tiempo):
6. Agregar TypeScript
7. Agregar tests unitarios
8. Optimizar re-renders

---

## 📁 Archivos Revisados

- ✅ 4 stores (auth, autor, editor, revisor, administrador, notificaciones, historial, convocatorias)
- ✅ 4 servicios API (auth, usuarios, manuscritos, revision, notificaciones, client)
- ✅ 1 router
- ✅ 27 componentes Vue
- ✅ AppLayout y RoleSwitcher

**Total de líneas de código revisadas:** ~3,500

---

*Este informe fue generado como parte del proceso de auditoría del sistema.*