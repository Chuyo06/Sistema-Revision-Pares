<template>
  <v-container fluid style="background:#F6F8F6; min-height: 100%; padding: 24px">
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
            <div style="height:8px; background: linear-gradient(90deg, #4CAF50, #8B5A2B)"></div>
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

          <!-- SECCIÃ“N: REVISORES ASIGNADOS -->
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
                    {{ nombreRevisor(asig.id_revisor) }}
                    <v-chip size="x-small" variant="tonal" class="ml-2">{{ asig.estado }}</v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle class="mt-1">
                    <div v-if="asig.puntuacion" class="d-flex align-center mb-1">
                      <v-rating :model-value="asig.puntuacion" color="amber" density="compact" size="small" readonly></v-rating>
                      <span class="ml-2 font-weight-bold text-brown">{{ asig.puntuacion }}/5</span>
                    </div>
                    <div v-if="asig.comentarios" class="bg-brown-lighten-5 pa-3 rounded-lg border text-italic mt-2" style="white-space: normal; color: #1B4332">
                       "{{ asig.comentarios }}"
                    </div>
                    <div v-else-if="asig.estado !== 'COMPLETADA'" class="text-caption text-grey">Esperando respuesta del revisor...</div>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <!-- Quitar revisor: solo si NO ha enviado su revisión -->
                    <v-btn
                      v-if="asig.estado !== 'COMPLETADA'"
                      icon
                      variant="text"
                      size="small"
                      color="error"
                      title="Quitar revisor"
                      @click="quitar(asig.id_asignacion)"
                    >
                      <v-icon>mdi-account-remove-outline</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="pa-8 text-center text-grey-darken-1">
                <v-icon size="48" class="mb-2 opacity-20">mdi-account-question-outline</v-icon>
                <div>No hay revisores asignados todavía.</div>
              </div>
            </v-card-text>
          </v-card>

          <!-- SECCIÓN: DECISIÓN EDITORIAL FINAL — solo editor jefe -->
          <v-card
            v-if="editorStore.esEditorJefe && asignacionesCompletadas.length > 0"
            class="mb-6 elevation-10"
            rounded="xl"
            color="brown-darken-4"
            theme="dark"
          >
            <v-card-item class="pa-6">
              <v-card-title class="text-h5 font-weight-bold d-flex align-center">
                <v-icon class="mr-3" color="amber">mdi-gavel</v-icon>
                Decisión Editorial Final
              </v-card-title>
              <v-card-subtitle class="mt-1 opacity-70">
                Basado en {{ asignacionesCompletadas.length }} revisiones recibidas
              </v-card-subtitle>

              <div class="d-flex gap-4 mt-6 flex-wrap">
                <v-btn color="success" size="large" variant="elevated" @click="abrirDecision('ACEPTADO')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-check-circle">
                  Aceptar
                </v-btn>
                <v-btn color="warning" size="large" variant="elevated" @click="abrirDecision('EN_REVISION')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-refresh">
                  Pedir revisiones
                </v-btn>
                <v-btn color="error" size="large" variant="elevated" @click="abrirDecision('RECHAZADO')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-close-circle">
                  Rechazar
                </v-btn>
              </div>
            </v-card-item>
          </v-card>

          <!-- Mensaje informativo para editor de sección -->
          <v-alert
            v-else-if="editorStore.esEditorSeccion && asignacionesCompletadas.length > 0"
            type="info"
            variant="tonal"
            border="start"
            class="mb-6"
            icon="mdi-information-outline"
          >
            Tu rol de editor de sección puede gestionar revisores, pero la <strong>decisión final</strong>
            (aceptar / rechazar / pedir revisiones) la toma el editor jefe.
          </v-alert>
        </v-col>

        <!-- Columna Derecha: Seleccionar Revisores -->
        <v-col cols="12" md="4">
          <v-card title="Revisores Disponibles" border rounded="lg" elevation="1" class="sticky-card">
            <template v-slot:append>
              <v-icon color="primary">mdi-account-search</v-icon>
            </template>
            <v-card-text class="pa-3">
              <v-text-field
                v-model="busquedaRevisor"
                prepend-inner-icon="mdi-magnify"
                placeholder="Buscar por nombre o institución"
                density="compact"
                hide-details
                variant="outlined"
                clearable
                class="mb-2"
              />
              <div v-if="revisoresFiltrados.length === 0" class="pa-4 text-center text-medium-emphasis text-caption">
                Ningún revisor coincide con la búsqueda
              </div>
              <div
                v-for="revisor in revisoresFiltrados"
                :key="revisor.id"
                class="revisor-card mb-2 pa-3 border rounded-lg transition-swing"
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

    <!-- Historial de decisiones editoriales -->
    <v-card v-if="historialManuscrito.length > 0" class="mt-6" border rounded="lg" elevation="1">
      <v-card-title class="pa-4 d-flex align-center">
        <v-icon color="brown" class="mr-2">mdi-history</v-icon>
        Historial de decisiones
        <v-chip size="x-small" variant="tonal" color="brown" class="ml-2">{{ historialManuscrito.length }}</v-chip>
      </v-card-title>
      <v-divider />
      <v-list lines="two" class="bg-transparent pa-0">
        <v-list-item v-for="entrada in historialManuscrito" :key="entrada.id" class="pa-4 border-bottom">
          <template #prepend>
            <v-avatar :color="entrada.decision === 'ACEPTADO' ? 'success' : entrada.decision === 'RECHAZADO' ? 'error' : 'warning'" size="40">
              <v-icon color="white" size="20">{{ entrada.decision === 'ACEPTADO' ? 'mdi-check-circle' : entrada.decision === 'RECHAZADO' ? 'mdi-close-circle' : 'mdi-refresh' }}</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold text-body-2">
            {{ decisionLabel(entrada.decision) }}
            <span class="text-caption text-medium-emphasis ml-2">por {{ entrada.editorNombre || entrada.editor || 'Editor' }}</span>
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption mt-1">
            {{ new Date(entrada.fecha).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) }}
            <span v-if="entrada.carta || entrada.comentario" class="ml-2">· Con carta al autor</span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- DecisionDialog con plantillas -->
    <DecisionDialog
      v-model="dialogDecision"
      :decision="decisionActual"
      :manuscrito-titulo="manuscrito ? manuscrito.titulo : ''"
      :referencia="manuscrito ? manuscrito.referencia : ''"
      @confirmar="confirmarDecision"
    />

    <v-snackbar v-model="snackbar" timeout="3000" :color="snackbarColor" location="top right">
      <v-icon start>{{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      {{ snackbarMsg }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEditorStore } from '@/store/editor/index.js'
import { useHistorialStore } from '@/store/historial.js'
import DecisionDialog from '@/components/common/DecisionDialog.vue'

const route = useRoute()
const editorStore = useEditorStore()
const historialStore = useHistorialStore()
const snackbar = ref(false)
const snackbarColor = ref('success')
const snackbarMsg = ref('Operación completada con éxito')
const busquedaRevisor = ref('')

function notify(msg, color = 'success') {
  snackbarMsg.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

const manuscritoId = Number(route.params.id)
const manuscrito = computed(() => (editorStore.manuscritos || []).find(m => String(m.id) === String(manuscritoId)))

// Lista de revisores filtrada: excluye al autor del artículo y aplica búsqueda.
const revisoresFiltrados = computed(() => {
  const autorId = manuscrito.value?.autorId
  const term = (busquedaRevisor.value || '').toLowerCase()
  return (editorStore.revisoresDisponibles || []).filter(r => {
    if (Number(r.id) === Number(autorId)) return false // ítem 7: nunca el autor
    if (!term) return true
    return (r.nombre || '').toLowerCase().includes(term) ||
           (r.institucion || '').toLowerCase().includes(term)
  })
})

function nombreRevisor(id) {
  const r = (editorStore.revisoresDisponibles || []).find(x => Number(x.id) === Number(id))
  return r?.nombre || `Revisor #${id}`
}

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
  const res = await editorStore.asignarRevisor(manuscritoId, revisorId)
  if (res?.ok) {
    notify('Revisor invitado correctamente', 'success')
  } else if (res?.motivo === 'AUTOR_DEL_ARTICULO') {
    notify('No puedes asignar al autor del artículo como revisor', 'error')
  } else {
    notify('No se pudo invitar al revisor', 'error')
  }
}

async function quitar(idAsignacion) {
  const res = await editorStore.quitarRevisor(idAsignacion)
  if (res?.ok) {
    notify('Revisor quitado de la asignación', 'success')
  } else if (res?.motivo === 'YA_COMPLETADA') {
    notify('No se puede quitar: el revisor ya envió su revisión', 'error')
  } else {
    notify('No se pudo quitar al revisor', 'error')
  }
}

const dialogDecision = ref(false)
const decisionActual = ref('ACEPTADO')

function abrirDecision(decision) {
  decisionActual.value = decision
  dialogDecision.value = true
}

async function confirmarDecision({ decision, plantilla, comentario }) {
  const res = await editorStore.tomarDecisionConPlantilla(manuscritoId, decision, plantilla, comentario)
  if (res?.ok) {
    notify('Decisión registrada correctamente', 'success')
  } else {
    notify('No se pudo registrar la decisión', 'error')
  }
}

const historialManuscrito = computed(() => historialStore.porManuscrito(manuscritoId))

function decisionLabel(d) {
  return { ACEPTADO: 'Aceptado', RECHAZADO: 'Rechazado', EN_REVISION: 'Revisiones solicitadas' }[d] || d
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
  border-color: #4CAF50 !important;
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
