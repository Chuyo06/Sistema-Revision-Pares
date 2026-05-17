/**
 * scripts/boot.js
 * Iniciador estético del Sistema de Revisión por Pares.
 * Ahora incluye verificaciones reales de los endpoints de la API.
 */
const { spawn, execSync } = require('child_process');
const http = require('http');

// Colores ANSI básicos
const reset = "\x1b[0m";
const bold = "\x1b[1m";
const green = "\x1b[32m";
const blue = "\x1b[34m";
const cyan = "\x1b[36m";
const yellow = "\x1b[33m";
const magenta = "\x1b[35m";
const red = "\x1b[31m";
const white = "\x1b[37m";

const clear = () => process.stdout.write('\x1Bc');

const banner = `
${blue}${bold}╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║  ${cyan}SISTEMA DE REVISIÓN POR PARES${blue}                                     ║
║  ${white}Entorno de Desarrollo Unificado${blue}                                   ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝${reset}
`;

function log(msg, color = reset) {
  console.log(`${color}${msg}${reset}`);
}

async function runStep(name, command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    process.stdout.write(`${bold}●${reset} ${name}... `);
    const child = spawn(command, { shell: true, cwd, stdio: 'ignore' });
    
    child.on('close', (code) => {
      if (code === 0) {
        process.stdout.write(`${green}✓ Listo${reset}\n`);
        resolve();
      } else {
        process.stdout.write(`${red}✗ Falló${reset}\n`);
        reject(new Error(`Paso ${name} falló con código ${code}`));
      }
    });
  });
}

function checkApi(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function main() {
  clear();
  console.log(banner);

  try {
    // 1. Verificar Docker
    log("\n[1/3] Levantando Infraestructura", magenta);
    try {
      execSync('docker info', { stdio: 'ignore' });
    } catch (e) {
      log("ERROR: Docker no está corriendo. Por favor inicia Docker Desktop.", red);
      process.exit(1);
    }

    await runStep("Docker Compose Up", "docker compose up -d --build");

    // Esperar un poco para que los contenedores NestJS comiencen a compilar TypeScript
    log("Esperando a que los servicios compilen...", cyan);
    await new Promise(r => setTimeout(r, 5000));

    // 2. Esperar a los servicios
    log("\n[2/3] Verificando Salud de Servicios y APIs", magenta);
    
    const services = [
      { name: "Usuarios API ", id: "ms_usuarios", api: "/api/usuarios/health" },
      { name: "Auth Service ", id: "ms_usuarios", api: "/api/usuarios/health" }, // Comparte contenedor
      { name: "Manuscritos  ", id: "ms_manuscritos", api: "/api/manuscritos/health" },
      { name: "Revisión     ", id: "ms_revision", api: "/api/revision/health" },
      { name: "Notificac.   ", id: "ms_notificaciones", api: "/api/notificaciones/health" },
      { name: "Matching     ", id: "ms_matching", api: "/api/matching/health" },
      { name: "Analisis IA  ", id: "ms_analisis_ia", api: "/api/analisis/health" },
      { name: "Gateway (Nginx)", id: "ms_gateway", api: "/" }
    ];

    for (const service of services) {
      process.stdout.write(`${bold}●${reset} ${service.name}... `);
      let healthy = false;
      let apiUp = false;
      let retries = 0;
      
      while ((!healthy || !apiUp) && retries < 90) {
        try {
          // Check Container
          const status = execSync(`docker inspect --format="{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" ${service.id}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
          if (status === "healthy" || status === "running") {
            healthy = true;
          }
          
          // Check API
          if (healthy) {
            apiUp = await checkApi(service.api);
          }
        } catch (e) {}

        if (!healthy || !apiUp) {
          retries++;
          process.stdout.write(`${yellow}.${reset}`);
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (healthy && apiUp) {
        process.stdout.write(` ${green}✓ Operativo${reset}\n`);
      } else if (healthy) {
        process.stdout.write(` ${yellow}⚠ Contenedor OK, API no responde${reset}\n`);
      } else {
        process.stdout.write(` ${red}✗ No disponible${reset}\n`);
      }
    }

    // Reiniciar el gateway para asegurar resolución DNS fresca
    log("\nRefrescando Gateway (Nginx)...", cyan);
    try {
      execSync('docker compose restart gateway', { stdio: 'ignore' });
      // Esperar a que Nginx reinicie
      await new Promise(r => setTimeout(r, 3000));
      log("Gateway refrescado correctamente.", green);
    } catch (e) {
      log("⚠ No se pudo reiniciar el gateway.", yellow);
    }

    // 3. Iniciar Cliente
    log("\n[3/3] Iniciando Interfaz de Usuario", magenta);
    log("El frontend se abrirá en http://localhost:5173", blue);
    log("Presiona Ctrl+C para detener todo el sistema.\n", yellow);

    const client = spawn("npm run dev:client", { 
      shell: true, 
      stdio: 'inherit' 
    });

    client.on('close', () => {
      log("\nDeteniendo sistema...", yellow);
      execSync('docker compose stop', { stdio: 'ignore' });
      log("¡Hasta luego!", green);
      process.exit(0);
    });

  } catch (error) {
    log(`\nFATAL ERROR: ${error.message}`, red);
    process.exit(1);
  }
}

main();
