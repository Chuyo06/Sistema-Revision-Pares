# Instalación

## Requisitos

- Node.js 18 o superior
- npm

## Pasos

```bash
cd client
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`

## Credenciales demo

| Rol      | Email             | Contraseña |
|----------|-------------------|------------|
| Autor    | autor@demo.com    | 1234       |
| Revisor  | revisor@demo.com  | 1234       |
| Editor   | editor@demo.com   | 1234       |
| Admin    | admin@demo.com    | 1234       |

## Build para producción

```bash
cd client
npm run build
```

Genera la carpeta `client/dist/`.
