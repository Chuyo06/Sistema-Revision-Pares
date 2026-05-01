# 🚀 Guía: PWA Instalable - Sistema de Revisión por Pares

## ✨ Características de la PWA

La aplicación es completamente **Progressive Web App** y puede instalarse en cualquier dispositivo:

### ✅ Funcionalidades Activadas
- **Instalación en navegador**: Instala la app en la pantalla de inicio
- **Funciona offline**: Acceso total sin conexión a internet
- **Sincronización en background**: Los cambios se sincronizan cuando vuelves online
- **Notificaciones push**: Recibe alertas de nuevas revisiones
- **Acceso rápido**: Atajos de teclado y menú de inicio rápido
- **Interfaz nativa**: Se abre como app nativa, sin barra del navegador

---

## 📱 Cómo Instalar la PWA

### En Navegadores Desktop (Windows, Mac, Linux)

#### **Chrome / Edge / Brave**
1. Abre la aplicación en el navegador
2. Busca el **ícono de instalación** (arriba a la derecha, a veces es un "+")
3. Haz clic en "Instalar Sistema de Revisión por Pares"
4. ¡Listo! La app aparecerá en tu escritorio/menú de aplicaciones

#### **Firefox**
1. Ve a menú → Más herramientas → Crear acceso directo
2. Selecciona "Ventana nueva"
3. Marca "Abrir como aplicación de escritorio"
4. ¡Listo!

#### **Safari (macOS)**
1. Menú Compartir → Agregar a Dock
2. La app se abrirá en una ventana sin elementos del navegador

### En Navegadores Mobile (iOS, Android)

#### **Android (Chrome, Firefox, Edge)**
1. Abre el navegador en la aplicación
2. Toca el **menú (⋮) o botón de instalación**
3. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"
4. ¡Listo! La app aparecerá en la pantalla de inicio

#### **iOS (Safari 16+)**
1. Abre en Safari
2. Toca el botón **Compartir** (cuadro con flecha)
3. Desplázate y selecciona **"Agregar a Pantalla de Inicio"**
4. Elige el nombre y toca "Agregar"
5. ¡Listo! Aparecerá en tu pantalla de inicio

---

## 🌐 Capacidades Offline

### ¿Qué funciona sin internet?

✅ **Totalmente funcional sin conexión:**
- Ver tus manuscritos guardados
- Leer revisiones previas
- Editar borradores (se guardan localmente)
- Navegar por la interfaz
- Consultar tus datos descargados

⏳ **Se sincroniza cuando vuelves online:**
- Los cambios se envían automáticamente
- Las nuevas evaluaciones se descarga
- Las notificaciones se procesan

❌ **Requiere conexión:**
- Enviar manuscritos nuevos (después de la primera vez)
- Descargar documentos por primera vez
- Recibir actualizaciones del servidor en tiempo real

### Cómo pre-cachear un manuscrito (modo offline)

1. Abre un manuscrito mientras tienes conexión
2. La app automáticamente lo descarga para uso offline
3. Si pierdes conexión, el manuscrito seguirá disponible

---

## 🔔 Notificaciones Push

Para recibir notificaciones de nuevas asignaciones y comentarios:

1. Cuando abras la app por primera vez, verás un aviso
2. **Haz clic en "Permitir"** para activar notificaciones
3. Recibirás alertas en:
   - Tu escritorio (si la app está cerrada)
   - Tu dispositivo móvil
   - El navegador (si tienes pestañas abiertas)

---

## 📋 Atajos de Teclado & Navegación Rápida

### Menú Contextual
Usa el **menú de inicio rápido** (atajos en el manifest):
- **Nuevo Manuscrito** - Ir directamente a crear una nueva submission
- **Mis Revisiones** - Ver todas las pendientes

### En navegadores con soporte:
- Presiona el ícono de la app + toca y mantén (mobile) para ver atajos

---

## 🛠️ Detalles Técnicos

### Service Worker
- **Ubicación**: `client/src/sw/sw.js`
- **Estrategias de caché**:
  - **Cache First**: Assets estáticos (JS, CSS, fuentes, íconos)
  - **Network First**: APIs (intenta online, cae a caché)
  - **Stale While Revalidate**: Manuscritos (usa caché, actualiza en background)

### Manifest PWA
- **Ubicación**: `client/public/manifest.json`
- **Íconos**: SVG escalables (192x192, 512x512)
- **Display**: Standalone (pantalla completa, sin barra del navegador)
- **Shortcuts**: Accesos rápidos personalizados
- **Share Target**: Compartir PDFs directamente a la app

### Almacenamiento Local
- **IndexedDB**: Manuscritos y datos complejos (sin límite práctico)
- **LocalStorage**: Configuraciones y preferencias (5-10 MB)
- **Session Storage**: Estados temporales de sesión

---

## 🐛 Solución de Problemas

### "No veo el botón de instalar"
- ✅ Asegúrate de estar en HTTPS (localhost:443 es válido en dev)
- ✅ Recarga la página (Ctrl+F5 o Cmd+Shift+R)
- ✅ Verifica que el manifest.json sea válido (abre DevTools)

### "La app se cierra al minimizar"
- Esto es normal en algunos navegadores. Es como cualquier app.
- Abre de nuevo desde la pantalla de inicio o el menú

### "No recibo notificaciones"
- Verifica los permisos en Configuración → Sitios → Notificaciones
- En móvil, revisa que las notificaciones de la app no estén mutidas
- Asegúrate de haber dado permiso al instalar

### "Los cambios no se sincronizan offline"
- Los cambios se guardan localmente automáticamente
- Cuando vuelvas online, se sincronizarán en background (puede tardar 30 segundos)
- Si no se sincronizan, abre DevTools (F12) y revisa la consola

---

## 📊 Capacidades Detectadas

Cuando abres la app, automáticamente detecta:

```javascript
// Ver en DevTools Console
navigator.connection.effectiveType      // "4g", "3g", etc
navigator.onLine                        // true/false
'serviceWorker' in navigator             // PWA soportado?
'Notification' in window                 // Notificaciones disponibles?
'storage' in navigator                   // Persistent storage disponible?
```

---

## 🚀 Activar Modo Producción

Para deployar como PWA real:

1. **Cambiar a HTTPS**
   ```bash
   # En production, SIEMPRE HTTPS
   # En desarrollo local, localhost:443 funciona
   ```

2. **Verificar Service Worker**
   ```javascript
   // DevTools → Application → Service Workers
   // Debe mostrar "activated and running"
   ```

3. **Validar manifest.json**
   ```bash
   # Usar herramientas como https://www.pwabuilder.com/
   # o https://manifest-validator.appspot.com/
   ```

4. **Actualizar descripción del servidor**
   ```bash
   npm run build
   npm run preview  # Simula producción localmente
   ```

---

## 📞 Contacto & Soporte

¿Problemas con la instalación? Revisa:
- Documentación oficial de PWA: https://web.dev/progressive-web-apps/
- Chrome DevTools → Application tab
- Console de errores (F12 → Console)

---

**¡Tu app es ahora una PWA profesional lista para instalar! 🎉**
