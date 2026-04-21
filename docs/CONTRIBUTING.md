# CONTRIBUTING — Convenciones del equipo

Este documento resume las convenciones mínimas para contribuir al repositorio.

1) Flujo de ramas
- main: rama protegida, solo merges desde develop mediante PR aprobado.
- develop: rama de integración para features completadas.
- feature/<short>-<issue#>: ramas de trabajo, partir desde develop. Ej: feature/login-2734
- hotfix/<desc>: correcciones críticas desde main.
- release/<version>: preparaciones de release desde develop.

Regla general: trabajo en feature → PR a develop → merge a develop; al releasar, PR develop → main.

2) Nombres de commits
- Usar Conventional Commits: <type>(<scope>): <subject>
- Tipos comunes: feat, fix, docs, style, refactor, test, chore
- Ejemplo: feat(auth): agregar endpoint login JWT
- Subject máximo 72 caracteres; añadir cuerpo para más contexto.

3) Pull Requests
- Usar plantilla .github/PULL_REQUEST_TEMPLATE.md
- Incluir descripción, tests añadidos, pasos reproducibles y reviewers sugeridos.
- Marcar issues cerrados con "Closes #<n>" en la descripción.

4) Tests y CI
- Añadir tests unitarios para nueva lógica; evitar dependencias externas en tests unitarios.
- Ejecutar: cd microservices/<servicio> && npm test
- CI exige que todos los tests pasen antes de mergear.

5) Lint y formato
- Ejecutar linter y prettier antes de PR: npm run lint (si aplica) y prettier --write

6) Revisión de código
- Al menos 1 aprobación requerida (configurada en branch protection).
- No mergear si checks fallan o faltan aprobaciones.

7) Acciones administrativas
- Para cambios que requieren permisos (branch protection, secrets), usar PR y obtener aprobación de admins.

Contacto
- Para dudas, abrir una Issue con la plantilla "question".
