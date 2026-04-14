<template>
  <v-container fluid style="background:#f5f0e8; min-height: 100%; padding: 24px">
    <!-- Botón Volver -->
    <v-btn variant="text" to="/editor/manuscritos" prepend-icon="mdi-arrow-left" class="mb-6 text-none">
      Volver a Manuscritos
    </v-btn>

    <v-row v-if="editorStore.cargando && !manuscrito" justify="center">
      <v-col cols="auto" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4 text-h6 text-brown-lighten-1">Cargando dashboard...</div>
      </v-col>
    </v-row>

    <template v-else-if="manuscrito">
      <v-row>
        <!-- Columna Izquierda: Información y Decisiones -->
        <v-col cols="12" md="8">
          <!-- Cabecera del Manuscrito -->
          <v-card class="mb-6 overflow-hidden" elevation="3" rounded="xl" border>
            <div style="height:8px; background: linear-gradient(90deg, #5d4037, #8d6e63)"></div>
            <v-card-item class="pa-6">
              <div class="d-flex justify-space-between align-start">
                <div>
                  <div class="text-h4 font-weight-bold text-brown-darken-4 mb-2">{{ manuscrito.titulo }}</div>
                  <div class="text-h6 text-brown-lighten-1 mb-4">{{ manuscrito.autores }}</div>
                  <v-chip :color="chipColor(manuscrito.estado)" size="small" class="font-weight-bold px-4" label>
                    {{ estadoLabel(manuscrito.estado).toUpperCase() }}
                  </v-chip>
                </div>
              </div>
            </v-card-item>
          </v-card>

          <!-- SECCIÓN: REVISORES ASIGNADOS -->
          <v-card class="mb-6" elevation="2" rounded="lg" border>
            <v-card-title class="pa-4 d-flex align-center">
              <v-icon color="brown" class="mr-2">mdi-account-check</v-icon>
              Estado de las Revisiones
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-list v-if="asignacionesDelArticulo.length > 0" lines="three" class="bg-transparent">
                <v-list-item 
                  v-for="(asig, index) in asignacionesDelArticulo" 
                  :key="asig.id_asignacion || index"
                  class="pa-4 border-bottom"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="asig.estado === 'COMPLETADA' ? 'success' : 'warning'" size="48">
                      <v-icon color="white">{{ asig.estado === 'COMPLETADA' ? 'mdi-check-decagram' : 'mdi-clock-fast' }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-h6 font-weight-bold">
                    Revisor #{{ asig.id_revisor }} 
                    <v-chip size="x-small" variant="tonal" class="ml-2">{{ asig.estado }}</v-chip>
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="mt-1">
                    <div v-if="asig.puntuacion" class="d-flex align-center mb-1">
                      <v-rating :model-value="asig.puntuacion" color="amber" density="compact" size="small" readonly></v-rating>
                      <span class="ml-2 font-weight-bold text-brown">{{ asig.puntuacion }}/5</span>
                    </div>
                    <div v-if="asig.comentarios" class="bg-brown-lighten-5 pa-3 rounded-lg border text-italic mt-2" style="white-space: normal; color: #3e2723">
                       "{{ asig.comentarios }}"
                    </div>
                    <div v-else-if="asig.estado !== 'COMPLETADA'" class="text-caption text-grey">Esperando respuesta del revisor...</div>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <div v-else class="pa-8 text-center text-grey-darken-1">
                <v-icon size="48" class="mb-2 opacity-20">mdi-account-question-outline</v-icon>
                <div>No hay revisores asignados todavía.</div>
              </div>
            </v-card-text>
          </v-card>

          <!-- SECCIÓN: DECISIÓN EDITORIAL FINAL -->
          <v-card 
            v-if="asignacionesCompletadas.length > 0" 
            class="mb-6 elevation-10" 
            rounded="xl" 
            color="brown-darken-4" 
            theme="dark"
          >
            <v-card-item class="pa-6">
              <v-card-title class="text-h5 font-weight-bold d-flex align-center">
                <v-icon class="mr-3" color="amber">mdi-gavel</v-icon>
                Decisión Editorial
              </v-card-title>
              <v-card-subtitle class="mt-1 opacity-70">
                Basado en {{ asignacionesCompletadas.length }} revisiones recibidas
              </v-card-subtitle>
              
              <div class="d-flex gap-4 mt-6">
                <v-btn color="success" size="large" variant="elevated" @click="decidir('ACEPTADO')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-check-circle">
                  Aceptar Manuscrito
                </v-btn>
                <v-btn color="error" size="large" variant="elevated" @click="decidir('RECHAZADO')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-close-circle">
                  Rechazar
                </v-btn>
              </div>
            </v-card-item>
          </v-card>
        </v-col>

        <!-- Columna Derecha: Seleccionar Revisores -->
        <v-col cols="12" md="4">
          <v-card title="Revisores Disponibles" border rounded="lg" elevation="1" class="sticky-card">
            <template v-slot:append>
              <v-icon color="primary">mdi-account-search</v-icon>
            </template>
            <v-card-text class="pa-2">
              <div 
                v-for="revisor in (editorStore.revisoresDisponibles || [])" 
                :key="revisor.id" 
                class="revisor-card ma-2 pa-4 border rounded-lg transition-swing"
                :class="revisorAsignado(revisor.id) ? 'bg-grey-lighten-4 opacity-70' : 'bg-white'"
              >
                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="font-weight-bold text-brown">{{ revisor.nombre }}</div>
                  <v-chip size="x-small" color="success" variant="flat">{{ revisor.matching }}% match</v-chip>
                </div>
                <div class="text-caption text-grey-darken-1 mb-3 line-height-1">{{ revisor.institucion }}</div>
                <v-btn 
                  block 
                  size="small" 
                  :color="revisorAsignado(revisor.id) ? 'grey' : 'primary'"
                  :variant="revisorAsignado(revisor.id) ? 'text' : 'flat'"
                  @click="asignar(revisor.id)" 
                  :disabled="revisorAsignado(revisor.id)"
                  class="text-none"
                >
                  {{ revisorAsignado(revisor.id) ? 'Ya asignado' : 'Invitar a Revisar' }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-row v-else justify="center" class="py-12">
       <v-col cols="auto" class="text-center">
         <v-icon size="64" color="error">mdi-alert</v-icon>
         <div class="text-h6 mt-4">Manuscrito {{ manuscritoId }} no encontrado</div>
         <v-btn to="/editor/manuscritos" color="primary" class="mt-4">Ir a la lista</v-btn>
       </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" timeout="3000" color="success" location="top right">
      <v-icon start>mdi-check-circle</v-icon>
      Operación completada con éxito
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEditorStore } from '@/store/editor/index.js'

const route = useRoute()
const editorStore = useEditorStore()
const snackbar = ref(false)

const manuscritoId = Number(route.params.id)
const manuscrito = computed(() => (editorStore.manuscritos || []).find(m => String(m.id) === String(manuscritoId)))

const asignacionesDelArticulo = computed(() => {
  if (!editorStore.asignaciones) return []
  return editorStore.asignaciones.filter(a => String(a.id_manuscrito_mongo) === String(manuscritoId))
})

const asignacionesCompletadas = computed(() => 
  asignacionesDelArticulo.value.filter(a => a.estado === 'COMPLETADA')
)

onMounted(() => {
  editorStore.cargarDashboardEditor()
})

function revisorAsignado(id) { 
  if (!editorStore.asignaciones) return false
  return editorStore.asignaciones.some(a => 
    String(a.id_revisor) === String(id) && 
    String(a.id_manuscrito_mongo) === String(manuscritoId)
  )
}

async function asignar(revisorId) {
  const exito = await editorStore.asignarRevisor(manuscritoId, revisorId)
  if (exito) snackbar.value = true
}

async function decidir(decision) {
  await editorStore.tomarDecision(manuscritoId, decision)
}

const ESTADOS = { 
  ENVIADO: 'Enviado', 
  EN_REVISION: 'En revisión', 
  ACEPTADO: 'Aceptado', 
  RECHAZADO: 'Rechazado' 
}
function estadoLabel(e) { return ESTADOS[e] ?? (e || 'Desconocido') }
function chipColor(e) { 
  if (e === 'ACEPTADO') return 'success'
  if (e === 'RECHAZADO') return 'error'
  if (e === 'EN_REVISION') return 'warning'
  return 'info'
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #efefef;
}
.revisor-card:hover {
  border-color: #5d4037 !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
.sticky-card {
  position: sticky;
  top: 24px;
}
.gap-4 { gap: 16px; }
.transition-swing {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>
