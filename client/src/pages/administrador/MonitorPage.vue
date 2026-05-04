<template>
  <div style="max-width:900px; padding:20px; margin: 0 auto;">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <div style="font-size:13px; font-weight:700; color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px">
          Administración
        </div>
        <h1 style="font-size:24px; font-weight:800; color:#1B4332; letter-spacing:-0.5px">Monitor de Sistema</h1>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        :loading="verificando"
        @click="verificarServicios"
        rounded="pill"
        elevation="0"
      >
        Refrescar Estado
      </v-btn>
    </div>

    <p class="text-body-2 text-grey-darken-1 mb-6">
      Estado de conectividad en tiempo real de los microservicios que componen la arquitectura de la plataforma.
    </p>

    <!-- Grid de Microservicios -->
    <v-row>
      <v-col v-for="servicio in servicios" :key="servicio.id" cols="12" md="6" lg="4">
        <v-card 
          border 
          elevation="0" 
          rounded="xl" 
          :class="{
            'estado-card': true,
            'estado-card--ok': servicio.estado === 'ok',
            'estado-card--error': servicio.estado === 'error',
            'estado-card--checking': servicio.estado === 'verificando'
          }"
        >
          <div class="pa-5 d-flex align-center">
            <!-- Icono del servicio -->
            <div 
              class="icon-container mr-4 d-flex align-center justify-center rounded-circle"
              :class="`bg-${servicio.color}-lighten-5`"
              style="width: 48px; height: 48px;"
            >
              <v-icon :color="servicio.color" size="24">{{ servicio.icono }}</v-icon>
            </div>
            
            <div class="flex-grow-1">
              <h3 class="text-subtitle-1 font-weight-bold mb-1" style="color:#1B4332">
                {{ servicio.nombre }}
              </h3>
              
              <div class="d-flex align-center">
                <v-progress-circular
                  v-if="servicio.estado === 'verificando'"
                  indeterminate
                  size="14"
                  width="2"
                  color="primary"
                  class="mr-2"
                ></v-progress-circular>
                
                <span v-else class="status-indicator" :class="`bg-${servicio.estado === 'ok' ? 'success' : 'error'}`"></span>
                
                <span 
                  class="text-caption font-weight-medium text-uppercase"
                  :class="servicio.estado === 'ok' ? 'text-success' : (servicio.estado === 'error' ? 'text-error' : 'text-primary')"
                >
                  {{ 
                    servicio.estado === 'verificando' ? 'Comprobando...' : 
                    (servicio.estado === 'ok' ? 'Operativo' : 'Inactivo') 
                  }}
                </span>
              </div>
            </div>
          </div>
          
          <v-divider></v-divider>
          
          <div class="pa-3 text-caption text-grey-darken-1 bg-grey-lighten-4 d-flex justify-space-between align-center">
            <span>Ruta: {{ servicio.endpoint }}</span>
            <span v-if="servicio.latencia" :class="servicio.latencia > 500 ? 'text-warning' : 'text-grey'">
              {{ servicio.latencia }}ms
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resumen -->
    <v-card border elevation="0" rounded="xl" class="mt-6 pa-5 text-center" v-if="!verificando && ultimaActualizacion">
      <div class="d-flex align-center justify-center">
        <v-icon 
          :color="todosOperativos ? 'success' : 'error'" 
          size="32" 
          class="mr-3"
        >
          {{ todosOperativos ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        <div class="text-left">
          <div class="text-subtitle-1 font-weight-bold" :class="todosOperativos ? 'text-success' : 'text-error'">
            {{ todosOperativos ? 'Todos los sistemas están operativos' : 'Hay problemas de conectividad' }}
          </div>
          <div class="text-caption text-grey-darken-1">
            Última comprobación: {{ ultimaActualizacion.toLocaleTimeString() }}
          </div>
        </div>
      </div>
    </v-card>

    <!-- Registro de Errores Recientes -->
    <v-card border elevation="0" rounded="xl" class="mt-6 pa-0">
      <div class="pa-5 border-b bg-grey-lighten-4">
        <h3 class="text-h6" style="color:#1B4332">
          <v-icon class="mr-2">mdi-math-log</v-icon>
          Registro de Errores Recientes
        </h3>
        <p class="text-caption text-grey-darken-1 mt-1">Historial de incidencias, advertencias y fallos de conexión.</p>
      </div>
      
      <v-table density="comfortable" hover>
        <thead>
          <tr>
            <th class="text-left font-weight-bold">Fecha / Hora</th>
            <th class="text-left font-weight-bold">Servicio</th>
            <th class="text-left font-weight-bold">Mensaje</th>
            <th class="text-center font-weight-bold">Tipo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="err in adminStore.erroresSistema" :key="err.id">
            <td class="text-caption">{{ new Date(err.fecha).toLocaleString() }}</td>
            <td class="font-weight-medium text-capitalize">{{ err.servicio }}</td>
            <td class="text-body-2">{{ err.mensaje }}</td>
            <td class="text-center">
              <v-chip
                size="small"
                :color="err.tipo === 'error' ? 'error' : 'warning'"
                variant="tonal"
                class="text-uppercase font-weight-bold"
              >
                {{ err.tipo }}
              </v-chip>
            </td>
          </tr>
          <tr v-if="adminStore.erroresSistema.length === 0">
            <td colspan="4" class="text-center py-4 text-grey">
              No hay errores recientes registrados en el sistema.
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-snackbar v-model="alertaFallo" color="error" timeout="5000" location="top">
      <v-icon start>mdi-alert-octagon</v-icon>
      Alerta: Uno o más servicios están fallando y requieren atención inmediata.
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="alertaFallo = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/store/administrador/index.js'

const adminStore = useAdminStore()
const verificando = ref(false)
const ultimaActualizacion = ref(null)
const alertaFallo = ref(false)

const servicios = ref([
  { id: 'usuarios',     nombre: 'Módulo de Usuarios',     icono: 'mdi-account-group',      color: 'blue',   endpoint: '/api/usuarios/health',    estado: 'idle', latencia: null },
  { id: 'manuscritos',  nombre: 'Gestor de Manuscritos',  icono: 'mdi-file-document-edit', color: 'orange', endpoint: '/api/manuscritos/health', estado: 'idle', latencia: null },
  { id: 'revision',     nombre: 'Motor de Revisión',      icono: 'mdi-clipboard-check',    color: 'green',  endpoint: '/api/revision/health',    estado: 'idle', latencia: null },
  { id: 'matching',     nombre: 'Matching de Revisores',  icono: 'mdi-account-switch',     color: 'purple', endpoint: '/api/matching/health',    estado: 'idle', latencia: null },
  { id: 'analisis-ia',  nombre: 'Análisis IA (Gemini)',   icono: 'mdi-robot',              color: 'teal',   endpoint: '/api/analisis/health',    estado: 'idle', latencia: null },
])

const todosOperativos = computed(() => {
  return servicios.value.every(s => s.estado === 'ok')
})

async function verificarServicios() {
  verificando.value = true
  let huboFallo = false
  
  // Poner todos en estado "verificando"
  servicios.value.forEach(s => {
    s.estado = 'verificando'
    s.latencia = null
  })

  // Ejecutar comprobaciones concurrentes
  const promesas = servicios.value.map(async (servicio) => {
    const start = performance.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch(servicio.endpoint, { 
        signal: controller.signal,
        cache: 'no-cache'
      })
      
      clearTimeout(timeoutId)
      
      const end = performance.now()
      servicio.latencia = Math.round(end - start)
      
      if (res.ok) {
        const data = await res.json()
        servicio.estado = data.status === 'ok' ? 'ok' : 'error'
        if (servicio.estado === 'error') {
          adminStore.registrarError(servicio.id, `El healthcheck devolvió status: ${data.status}`, 'error')
          huboFallo = true
        }
      } else {
        servicio.estado = 'error'
        adminStore.registrarError(servicio.id, `HTTP Error ${res.status}: ${res.statusText}`, 'error')
        huboFallo = true
      }
    } catch (error) {
      servicio.estado = 'error'
      servicio.latencia = null
      adminStore.registrarError(servicio.id, 'Timeout o servicio no alcanzable (Conexión rechazada)', 'error')
      huboFallo = true
    }
  })

  await Promise.allSettled(promesas)
  
  if (huboFallo) {
    alertaFallo.value = true
  }
  
  ultimaActualizacion.value = new Date()
  verificando.value = false
}

// Verificar automáticamente al montar la vista
onMounted(() => {
  verificarServicios()
})
</script>

<style scoped>
.estado-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.estado-card--ok {
  border-color: #A5D6A7 !important;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.08) !important;
}

.estado-card--error {
  border-color: #EF9A9A !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.08) !important;
}

.estado-card--checking {
  border-color: #90CAF9 !important;
  opacity: 0.8;
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
}
</style>
