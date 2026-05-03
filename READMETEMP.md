# READMETEMP

**¡Importante!**

Si tienes errores relacionados con `vite-plugin-pwa` o `workbox-cli` al levantar el proyecto, sigue estos pasos para instalar correctamente las dependencias:

## Pasos para instalar dependencias del cliente

1. Abre una terminal en la raíz del proyecto.
2. Ejecuta:
   ```
   npm install
   ```
   Esto instalará las dependencias principales del proyecto.
3. Cambia a la carpeta del cliente:
   ```
   cd client
   ```
4. Instala las dependencias del cliente (incluyendo los plugins de Vite):
   ```
   npm install --legacy-peer-deps
   ```

Esto instalará los plugins necesarios para el soporte PWA en Vite.

> Este archivo es temporal y puede eliminarse después de que todos hayan actualizado sus dependencias.
