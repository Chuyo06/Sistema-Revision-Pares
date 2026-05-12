# Auditoría de Vistas por Rol - Sistema de Revisión por Pares

Fecha de auditoría: 3 de Mayo de 2026

---

## 1. Resumen Ejecutivo

Este documento analiza cada una de las vistas (pages) del sistema por rol de usuario. Se evalúa parity (paridad) de funcionalidades generales entre todos los roles, identificando errores, inconsistencias y áreas de mejora. El análisis se centra en **características generales** que deberían ser comunes entre roles similares, no en funcionalidades específicas de cada rol.

---

## 2. Matriz de Vistas por Rol

| Rol | Dashboard | Lista/Feed | Detalle/Acción | Gestión |
|-----|-----------|-----------|----------------|--------|
| **Autor** | ✅ DashboardPage | ✅ ArticulosPage, BorradoresPage | ✅ NuevoArticuloPage, EditarBorradorPage | ❌ PerfilPage (compartido) |
| **Revisor** | ✅ DashboardPage | ✅ AsignadosPage | ✅ RevisionPage | ❌ PerfilPage (compartido) |
| **Editor** | ✅ DashboardPage | ✅ ManuscritosPage | ✅ AsignacionPage | ✅ ConvocatoriasPage |
| **Administrador** | ✅ DashboardPage | ✅ UsuariosPage | ⚠️ AreasPage, MonitorPage | ✅ ConfiguracionIAPage |

---

## 3. Análisis por Rol

### 3.1 Rol: AUTOR

#### Vistas analizadas:
- `DashboardPage.vue` - Panel principal
- `ArticulosPage.vue` - Lista de artículos enviados
- `BorradoresPage.vue` - Lista de borradores
- `NuevoArticuloPage.vue` - Crear nuevo artículo
- `EditarBorradorPage.vue` - Editar borrador
- `ReenviarArticuloPage.vue` - Reenviar versión corregida

#### Estado general: 🟡 **FUNCIONAL CON ERRORES MENORES**

| Vista | Funcionalidad | Estado | Issues |
|-------|---------------|--------|--------|
| DashboardPage | Stats, feed recientes, convocatorias | ✅ OK | Ninguno |
| ArticulosPage | Lista con filtros, búsqueda, historial | ✅ OK | Sin paginación real |
| BorradoresPage | Lista, edición, eliminación | ✅ OK | Confirmación básica (window.confirm) |
| NuevoArticuloPage | Formulario completo | ✅ OK | Sin validación robusta de PDF |
| EditarBorradorPage | Edición de borrador | ✅ OK | - |
| ReenviarArticuloPage | Reenvío con respuestas | ✅ OK | - |

#### Problemas identificados:

| # | Problema | Archivo | Severidad |
|---|----------|---------|-----------|
| 1 | **Sin paginación real** - El slice(0,5) en dashboard limita la visualización pero no hay paginación | DashboardPage.vue:52 | MEDIA |
| 2 | **Fallback de userId hardcodeado** - `useAutorStore` tiene fallback a ID 1 si no hay usuario | store/autor/index.js:19 | ALTA |
| 3 | **Sin manejo de errores de red** - Las funciones no muestran errores específicos al usuario | store/autor | MEDIA |
| 4 | **Confirmación de eliminación insegura** - Usa window.confirm en lugar de un diálogo Vuetify | BorradoresPage.vue:96 | BAJA |

---

### 3.2 Rol: REVISOR

#### Vistas analizadas:
- `DashboardPage.vue` - Panel principal con pendientes
- `AsignadosPage.vue` - Lista de asignaciones
- `RevisionPage.vue` - Formulario de revisión

#### Estado general: 🟢 **FUNCIONAL**

| Vista | Funcionalidad | Estado | Issues |
|-------|---------------|--------|--------|
| DashboardPage | Stats, feed de pendientes/completadas | ✅ OK | Ninguno |
| AsignadosPage | Lista de asignaciones | ✅ OK | Ninguno |
| RevisionPage | Formulario con ratings, recomendaciones, feedback IA | ✅ OK | El endpoint de feedback IA puede no estar conectado |

#### Problemas identificados:

| # | Problema | Archivo | Severidad |
|---|----------|---------|-----------|
| 1 | **Fallback de userId hardcodeado** - Same issue que autor | store/revisor/index.js:27 | ALTA |
| 2 | **Feedback IA sin verificar conexión** - Puede fallar silenciosamente | RevisionPage.vue:219-237 | MEDIA |
| 3 | **Sin estados intermedios guardados** - No persiste borradores entre sesiones | RevisionPage | BAJA |

---

### 3.3 Rol: EDITOR

#### Vistas analizadas:
- `DashboardPage.vue` - Panel editorial
- `ManuscritosPage.vue` - Gestión de manuscritos
- `AsignacionPage.vue` - Asignación de revisores
- `ConvocatoriasPage.vue` - Gestión de convocatorias

#### Estado general: 🟡 **FUNCIONAL CON INCONSISTENCIAS**

| Vista | Funcionalidad | Estado | Issues |
|-------|---------------|--------|--------|
| DashboardPage | Métricas, revisores activos, alertas | ✅ OK | Ninguno |
| ManuscritosPage | Filtros avanzados, CSV export, grouping | ✅ OK | Sin paginación real |
| AsignacionPage | Matching IA, asignación de revisores | ⚠️ PARCIAL | El matching usa datos mock, no usuarios reales |
| ConvocatoriasPage | CRUD de convocatorias | ✅ OK | - |

#### Problemas identificados:

| # | Problema | Archivo | Severidad |
|---|----------|---------|-----------|
| 1 | **Matching IA no conecta con usuarios reales** - Solo usa seed hardcodeado | matching.service.ts | CRÍTICA |
| 2 | **Sin verificación de revisores disponibles** - Puede asignar revisores sin verificar estado | AsignacionPage.vue | MEDIA |
| 3 | **CSV export tiene encoding issue** - El BOM ('﻿') puede causar problemas en某些 viewers | ManuscritosPage.vue:375 | BAJA |
| 4 | **Filtros de fecha no se usan** - Los campos 'desde' y 'hasta' se definen pero no se aplican | ManuscritosPage.vue:60-82 | MEDIA |

---

### 3.4 Rol: ADMINISTRADOR

#### Vistas analizadas:
- `DashboardPage.vue` - Panel de admin
- `UsuariosPage.vue` - Gestión de usuarios
- `AreasPage.vue` - Áreas temáticas
- `MonitorPage.vue` - Monitor del sistema
- `ConfiguracionIAPage.vue` - Config de IA
- `ManuscritosPage.vue` - Gestión de manuscritos (admin)

#### Estado general: 🟡 **FUNCIONAL CON FALTANTES**

| Vista | Funcionalidad | Estado | Issues |
|-------|---------------|--------|--------|
| DashboardPage | Distribución de roles, KPIs | ✅ OK | Ninguno |
| UsuariosPage | CRUD de usuarios | ✅ OK | Sin paginación |
| AreasPage | Gestión de áreas | ⚠️ PARCIAL | UI existe pero no conecta completamente |
| MonitorPage | Monitor de servicios | ⚠️ PARCIAL | UI existe pero datos mock |
| ConfiguracionIAPage | Config de IA | ⚠️ PARCIAL | UI existe pero funcionalidad incompleta |
| ManuscritosPage | Gestión de manuscritos | ✅ OK | - |

#### Problemas identificados:

| # | Problema | Archivo | Severidad |
|---|----------|---------|-----------|
| 1 | **AreasPage sin funcionalidad completa** - La página existe pero no persisten datos | client/pages/administrador/AreasPage.vue | ALTA |
| 2 | **MonitorPage con datos mock** - No hay conexión real a health checks | client/pages/administrador/MonitorPage.vue | MEDIA |
| 3 | **ConfiguracionIAPage incompleta** - La página de config de IA no está terminada | client/pages/administrador/ConfiguracionIAPage.vue | ALTA |
| 4 | **Edición de rol limitada** - Solo permite un rol, no múltiples | UsuariosPage.vue:83-87 | MEDIA |

---

## 4. Análisis de Paridad (Comparación entre Roles)

Esta sección evalúa si las vistas de roles similares tienen características generales consistentes.

### 4.1 Dashboard - Análisis Comparativo

| Característica | Autor | Revisor | Editor | Administrador | Paridad |
|--------------|-------|--------|--------|----------|-----------|
| Banner con gradiente | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Título personalizado | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Botón acción principal | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Stats-panel derecho | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Sección de feed/pendientes | ✅ | ✅ | ✅ | ❌ | ⚠️ INCONSISTENTE |

### 4.2 Listas/Listados - Análisis Comparativo

| Característica | Autor (Articulos) | Revisor (Asignados) | Editor (Manuscritos) | Administrador (Usuarios) | Paridad |
|---------------|------------------|--------------------|---------------------|------------------------|---------|
| Búsqueda text | ✅ | ❌ | ✅ | ✅ | ⚠️ ASIMÉTRICO |
| Filtro por estado | ✅ | ❌ | ✅ | ✅ (rol) | ⚠️ ASIMÉTRICO |
| Filtro por fecha | ❌ | ❌ | ✅ (sin usar) | ❌ | ⚠️ ASIMÉTRICO |
| Vacío state | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Click a detalle | ✅ | ✅ | ✅ | ✅ | ✅ OK |

### 4.3 Stores - Análisis Comparativo

| Componente | Autor | Revisor | Editor | Administrador | Paridad |
|-----------|-------|--------|--------|--------------|---------|
| Fallback userId | ✅ (1) | ✅ (2) | N/A | N/A | ⚠️ INCONSISTENTE |
| Manejo errores | ⚠️ básico | ⚠️ básico | ✅ mejor | ✅ mejor | ⚠️ INCONSISTENTE |
| Persistencia | ❌ | ⚠️ localStorage | ❌ | ❌ | ✅ OK (AUSENTE) |

---

## 5. Errores Comunes Encontrados

### 5.1 Errores de Código Reutilizables

| # | Error | Afecta | Severidad |
|------|-------|-------|-----------|
| 1 | **Fallback userId hardcodeado** en stores | Autor, Revisor | ALTA |
| 2 | **Sin paginación** en todas las listas | Todos | MEDIA |
| 3 | **Confirmación básica** (window.confirm) | Autor | BAJA |
| 4 | **Sin manejo de errores de red** | Autor, Revisor | MEDIA |
| 5 | **Variables no usadas** - filtros de fecha | Editor | BAJA |

### 5.2 Inconsistencias de UI/UX

| # | Inconsistencia | Detalle |
|---|--------------|---------|
| 1 | Búsqueda en listas: Autor y Admin la tienen, Revisor no |
| 2 | Stats en dashboards: Todos la tienen consistente |
| 3 | Filtros de estado: Autor/Editor/Admin la tienen, Revisor no |

---

## 6. Recomendaciones por Prioridad

### Alta Prioridad (CRITICAL)

1. **Eliminar fallbacks hardcodeados de userId** en stores:
   - `store/autor/index.js:19`
   - `store/revisor/index.js:27`
   
2. **Completar funcionalidad de Admin**:
   - AreasPage: Conectar con API real
   - MonitorPage: Implementar health checks reales
   - ConfiguracionIAPage: Completar configuración

3. **Corregir Matching IA** para usar usuarios reales de la DB

### Media Prioridad

1. **Implementar paginación** en todas las vistas de lista
2. **Agregar búsqueda en AsignadosPage.vue** del revisor
3. **Mejorar manejo de errores** en stores de Autor y Revisor
4. **Usar diálogos Vuetify** en lugar de window.confirm

### Baja Prioridad

1. **Conectar filtros de fecha** enManuscritosPage.vue
2. **Mejorar CSV export** encoding
3. **Agregar tooltips** explicativos en vistas
4. **Implementar estados de carga consistentes**

---

## 7. Estado de Funcionalidad por Vista

| Rol | Vista | Score | Notas |
|-----|-------|-------|-------|
| Autor | DashboardPage | 90% | Funcional, sans paginación |
| Autor | ArticulosPage | 85% | Sin paginación real |
| Autor | BorradoresPage | 90% | Confirmación básica |
| Autor | NuevoArticuloPage | 95% | Funcional |
| Revisor | DashboardPage | 95% | Bien implementado |
| Revisor | AsignadosPage | 85% | Sin búsqueda |
| Revisor | RevisionPage | 90% | Feedback IA puede fallar |
| Editor | DashboardPage | 95% | Bien implementado |
| Editor | ManuscritosPage | 85% | Filtros sin usar |
| Editor | AsignacionPage | 75% | Matching no conecta |
| Editor | ConvocatoriasPage | 80% | Parcialmente funcional |
| Admin | DashboardPage | 95% | Bien implementado |
| Admin | UsuariosPage | 85% | Sin paginación |
| Admin | AreasPage | 30% | No funcional |
| Admin | MonitorPage | 40% | Datos mock |
| Admin | ConfiguracionIAPage | 40% | No funcional |

---

## 8. Conclusiones

### Fortalezas del Sistema

1. UI consistente entre roles con tema visual unificado
2. Estructura de stores bien organizada en Pinia
3. Componentes reutilizables (PdfViewer, DecisionDialog)
4. Flujo de navegación lógica entre vistas

### Áreas de Mejora

1. **Paridad de funcionalidades**: Revisor tiene menos filtros que Autor/Editor
2. **Admin incompleto**: 3 de 5 vistas principales no funcionales
3. **Fallbacks peligrosos**: userId hardcodeado puede causar confusión de datos
4. **Sin paginación**: Listas pueden degradar performance

---

*Informe generado el 3 de Mayo de 2026*
*Sistema de Revisión por Pares - Auditoría de Vistas por Rol*