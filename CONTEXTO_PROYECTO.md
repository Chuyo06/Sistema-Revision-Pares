# Contexto y Resumen de Cambios: Sistema Revisión Pares

Este documento recopila el contexto actual del proyecto y sirve para reanudar el trabajo o dar seguimiento a las tareas ya completadas. Refleja las mejoras implementadas a lo largo de las sesiones recientes tanto en el backend, la base de datos como en el cliente frontend.

## 1. Exploración e Indexación Inicial
- Se realizó una revisión exhaustiva de toda la estructura de carpetas (cliente `vue/vite`, `microservicios`, capa `database`, e infraestructura Docker) para tener claridad sobre la arquitectura general del sistema.

## 2. Bases de Datos y Contenedores (MariaDB)
- **Soporte para Avatares y Múltiples Roles**: Se actualizaron los esquemas de inicialización (`01_esquema.sql`) y los scripts de datos o semillas (`02_seed_demo.sql`, `04_seed_useful_data.sql`). Esto preparó a la BD para guardar la ruta o URL de la imagen de perfil de cada usuario y estableció la capacidad de mapear un usuario a varios roles en lugar de a uno solo.
- **Arreglo del Contenedor de Base de Datos**: Se solucionaron los fallos de despliegue en el contenedor de MariaDB para que inicialice limpio y sea accesible por los microservicios sin errores de autenticación.

## 3. Backend, Autenticación y Microservicios (NestJS)
- **Control de Acceso Basado en Roles (RBAC)**: Se modificó la lógica en el `RolesGuard` y el modelo de Usuario. Ahora, en lugar de validar un solo rol de manera explícita y estricta, el guardia de seguridad puede validar si el usuario autenticado cuenta con *al menos uno* de los roles autorizados pasados como un array en los endpoints requeridos.
- **Inicio de Sesión (Log In)**: Se mejoró la integración entre TypeORM y el módulo de Autenticación, habilitando un inicio de sesión funcional con JWT operando correctamente la extracción del *payload* mediante `JwtStrategy`.

## 4. Frontend y Experiencia de Usuario (Vue.js)
- **Refinamiento de Interfaz y Tema**: Se llevó a cabo un rediseño de la apariencia de la plataforma. Ahora, el sistema implementa una paleta de colores armónica de tonos verde claro, café, naranja claro y blanco, logrando que el producto se vea y sienta de manera profesional (Premium y Dinámico).
- **Gestión del Perfil (`PerfilPage.vue`)**: Se estabilizó y mejoró la página de administración de cuentas, enfocándose fuertemente en que la carga o actualización de **imágenes de perfil (Avatar)** funcionen de manera robusta y reflejen los cambios visualmente de inmediato.
- **Correcciones de Codificación de Caracteres**: Había errores de visualización en el código donde los acentos y símbolos especiales ("ñ", acentos, etc.) no se mostraban debidamente en los componentes Vue. Esto fue solventado para mostrar en pantalla las tipografías correctamente.
- **RoleSwitcher**: Adaptaciones visuales y lógicas de los componentes subyacentes (`RoleSwitcher.vue`) para alternar las vistas que correspondan si un usuario tiene varios roles.
