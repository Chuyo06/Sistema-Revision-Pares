# ⚡ Estructura de Caché y Colas en Redis

Este documento define la estructura en memoria (Redis) utilizada por el **Sistema de Revisión por Pares**. Redis es la pieza clave para garantizar que la Progressive Web App (PWA) funcione con ultra baja latencia y para gestionar las tareas asíncronas de sincronización offline.

---

## 1. 🔐 Caché de Sesiones y Autenticación
Evita consultas repetitivas a la base de datos relacional (MariaDB) para verificar la identidad y permisos de un usuario en cada petición HTTP.

* **Estructura de Datos:** Clave-Valor (Key-Value)
* **Patrón de Llave:** `session:user:{id_usuario}` 
  * *Ejemplo:* `session:user:105`
* **Formato del Valor:** Cadena JSON.
  * *Ejemplo:* `{"id": 105, "rol": "EDITOR", "nombre": "Juan Pérez"}`
* **Tiempo de Vida (TTL):** 24 horas (exira automáticamente para forzar un re-login por seguridad).

---

## 2. 🧠 Caché de Respuestas de Inteligencia Artificial (LLM)
Reduce drásticamente los costos de API y los tiempos de espera al evitar preguntarle al modelo de lenguaje (LLM) lo mismo dos veces (por ejemplo, si dos editores evalúan el mismo texto).

* **Estructura de Datos:** Clave-Valor (Key-Value)
* **Patrón de Llave:** `llm:cache:{hash_del_texto_evaluado}`
  * *Ejemplo:* `llm:cache:a1b2c3d4e5f6...`
* **Formato del Valor:** Objeto JSON exacto devuelto por la IA en la primera consulta.
* **Tiempo de Vida (TTL):** 7 a 30 días (configurable según las necesidades del congreso/revista).

---

## 3. 🔄 Colas de Sincronización (Background Sync) y Eventos
Maneja las operaciones en segundo plano. Es la columna vertebral del enfoque "Offline-First" de la PWA, asegurando que el servidor procese los datos en cuanto el usuario recupere la conexión.

* **Estructura de Datos:** Listas (Lists) o Streams (FIFO - First In, First Out).
* **Colas Principales:**
  * `queue:sync_offline`: Recibe los comandos encolados desde IndexedDB cuando un revisor recupera la señal de internet (ej. enviar una revisión guardada localmente).
  * `queue:notificaciones_push`: Almacena los eventos disparados por el sistema (ej. "Manuscrito Aprobado") para que un Worker envíe las notificaciones Push a los dispositivos móviles correspondientes.
* **Procesamiento:** Los workers de Node.js (microservicios) consumirán estas listas mediante comandos como `LPOP` o `BLPOP` y procesarán las tareas una por una sin bloquear la interfaz del usuario.

---

## 🛠️ Comandos Útiles para el Entorno Local (Docker)

Si necesitas hacer pruebas o purgar la caché mientras desarrollas, puedes entrar a la consola de Redis en tu contenedor ejecutando:

```bash
docker exec -it mi_redis redis-cli