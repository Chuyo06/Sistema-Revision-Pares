<template>
  <v-container fluid style="background:#F6F8F6; min-height: 100%; padding: 24px">
    <!-- Bot�n Volver -->
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
        <!-- Columna Izquierda: Informaci�n y Decisiones -->
        <v-col cols="12" md="8">
          <!-- Cabecera del Manuscrito -->
          <v-card class="mb-6 overflow-hidden" elevation="3" rounded="xl" border>
            <div style="height:8px; background: linear-gradient(90deg, #4CAF50, #8B5A2B)"></div>
            <v-card-item class="pa-6">
              <div class="d-flex justify-space-between align-start">
                <div style="flex: 1">
                  <div class="text-h4 font-weight-bold text-brown-darken-4 mb-2">{{ manuscrito.titulo }}</div>
                  <div class="text-h6 text-brown-lighten-1 mb-4">{{ manuscrito.autores }}</div>
                  <v-chip :color="chipColor(manuscrito.estado)" size="small" class="font-weight-bold px-4" label>
                    {{ estadoLabel(manuscrito.estado).toUpperCase() }}
                  </v-chip>
                </div>
                <div class="d-flex flex-column align-end">
                  <v-btn
                    v-if="manuscrito.referencia"
                    color="brown"
                    variant="flat"
                    prepend-icon="mdi-file-pdf-box"
                    @click="dialogoPdf = true"
                    class="ml-4"
                  >
                    Ver PDF Actual
                  </v-btn>
                  
                  <v-menu v-if="manuscrito.historialVersiones && manuscrito.historialVersiones.length > 0" location="bottom end">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="brown-darken-1"
                        variant="tonal"
                        size="small"
                        prepend-icon="mdi-history"
                        v-bind="props"
                        class="ml-4 mt-2 text-none"
                      >
                        Versiones anteriores ({{ manuscrito.historialVersiones.length }})
                      </v-btn>
                    </template>
                    <v-list class="bg-grey-lighten-4 border rounded-lg">
                      <v-list-item
                        v-for="(v, index) in manuscrito.historialVersiones"
                        :key="v.referencia"
                        :href="`/api/manuscritos/download/${v.referencia}`"
                        target="_blank"
                        class="border-bottom"
                      >
                        <template v-slot:prepend>
                          <v-icon color="brown">mdi-file-pdf-box</v-icon>
                        </template>
                        <v-list-item-title class="font-weight-bold">Versión {{ index + 1 }}</v-list-item-title>
                        <v-list-item-subtitle class="text-caption">
                          {{ new Date(v.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }) }} - REF: {{ v.referencia }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-icon size="small" color="primary">mdi-download</v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-menu>
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
              <div v-if="asignacionesPorRonda.length > 0">
                <div v-for="ronda in asignacionesPorRonda" :key="ronda.numero" class="mb-4">
                  <div class="bg-brown-lighten-4 pa-2 px-4 text-subtitle-2 font-weight-bold text-brown-darken-3 d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-numeric-{{ ronda.numero }}-circle</v-icon>
                    RONDA {{ ronda.numero }}
                  </div>
                  
                  <div
                    v-for="(asig, index) in ronda.items"
                    :key="asig.id_asignacion || index"
                    class="pa-4 border-bottom d-flex align-start"
                    style="gap: 16px;"
                  >
                    <v-avatar :color="asig.estado === 'COMPLETADA' ? 'success' : 'warning'" size="48" class="flex-shrink-0">
                      <v-icon color="white">{{ asig.estado === 'COMPLETADA' ? 'mdi-check-decagram' : 'mdi-clock-fast' }}</v-icon>
                    </v-avatar>

                    <div class="flex-grow-1" style="min-width: 0;">
                      <div class="text-h6 font-weight-bold d-flex align-center flex-wrap" style="gap: 6px;">
                        <span>{{ nombreRevisor(asig.id_revisor) }}</span>
                        <v-chip size="x-small" variant="tonal">{{ asig.estado }}</v-chip>
                      </div>

                      <div v-if="asig.puntuacion" class="mt-2">
                        <div class="d-flex align-center">
                          <span class="font-weight-bold text-brown mr-2">Global: {{ asig.puntuacion }}/5</span>
                          <v-rating :model-value="asig.puntuacion" color="amber" density="compact" size="small" readonly></v-rating>
                        </div>
                        <div v-if="asig.originalidad" class="d-flex flex-wrap gap-2 mt-1" style="font-size: 11px; color: #546e7a;">
                          <v-chip size="x-small" variant="outlined" color="primary">Originalidad: {{ asig.originalidad }}</v-chip>
                          <v-chip size="x-small" variant="outlined" color="info">Metodología: {{ asig.metodologia }}</v-chip>
                          <v-chip size="x-small" variant="outlined" color="success">Claridad: {{ asig.claridad }}</v-chip>
                          <v-chip size="x-small" variant="outlined" color="warning">Relevancia: {{ asig.relevancia }}</v-chip>
                        </div>
                      </div>

                      <div v-if="asig.comentarios" class="bg-brown-lighten-5 pa-3 rounded-lg border mt-3" style="white-space: pre-wrap; word-break: break-word; font-size: 13px; color: #1B4332; line-height: 1.5;">
                        <strong style="color: #8B5A2B">Para el Autor:</strong><br />
                        {{ asig.comentarios }}
                      </div>
                      <div v-if="asig.comentarios_editor" class="bg-red-lighten-5 pa-3 rounded-lg border mt-2" style="white-space: pre-wrap; word-break: break-word; font-size: 13px; color: #c62828; line-height: 1.5;">
                        <strong style="color: #b71c1c"><v-icon size="14" class="mr-1">mdi-lock</v-icon>Confidencial para Editor:</strong><br />
                        {{ asig.comentarios_editor }}
                      </div>
                      <div v-else-if="asig.estado !== 'COMPLETADA'" class="text-caption text-grey mt-2">Esperando respuesta del revisor...</div>
                    </div>

                    <!-- Quitar revisor: solo si NO ha enviado su revisión -->
                    <v-btn
                      v-if="asig.estado !== 'COMPLETADA'"
                      icon
                      variant="text"
                      size="small"
                      color="error"
                      title="Quitar revisor"
                      class="flex-shrink-0"
                      @click="quitar(asig.id_asignacion)"
                    >
                      <v-icon>mdi-account-remove-outline</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
              <div v-else class="pa-8 text-center text-grey-darken-1">
                <v-icon size="48" class="mb-2 opacity-20">mdi-account-question-outline</v-icon>
                <div>No hay revisores asignados todavía.</div>
              </div>
            </v-card-text>
          </v-card>

          <!-- SECCI�N: DECISI�N EDITORIAL FINAL � solo editor jefe -->
          <v-card
            v-if="editorStore.esEditorJefe && asignacionesCompletadas.length > 0"
            class="mb-6 elevation-10"
            rounded="xl"
            :color="seccionDecisionActiva ? 'brown-darken-4' : 'grey-lighten-3'"
            :theme="seccionDecisionActiva ? 'dark' : 'light'"
          >
            <v-card-item class="pa-6">
              <v-card-title class="text-h5 font-weight-bold d-flex align-center" :class="seccionDecisionActiva ? '' : 'text-grey-darken-2'">
                <v-icon class="mr-3" :color="seccionDecisionActiva ? 'amber' : 'grey'">mdi-gavel</v-icon>
                Decisi�n Editorial Final
              </v-card-title>
              <v-card-subtitle class="mt-1" :class="seccionDecisionActiva ? 'opacity-70 text-white' : 'text-grey-darken-1'">
                <span v-if="manuscrito.estado === 'LISTO_PARA_DECISION'">Todas las revisiones completadas. Listo para su decisión.</span>
                <span v-else-if="manuscrito.estado === 'ACEPTADO'">Manuscrito Aceptado</span>
                <span v-else-if="manuscrito.estado === 'RECHAZADO'">Manuscrito Rechazado</span>
                <span v-else>Esperando a que todos los revisores finalicen ({{ asignacionesCompletadasUltimaRonda.length }} de {{ asignacionesUltimaRonda.length }} completadas)</span>
              </v-card-subtitle>

              <div class="d-flex gap-4 mt-6 flex-wrap">
                <v-btn :color="seccionDecisionActiva ? 'success' : 'grey'" size="large" variant="elevated" @click="abrirDecision('ACEPTADO')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-check-circle" :disabled="!seccionDecisionActiva">
                  Aceptar
                </v-btn>
                <v-btn :color="seccionDecisionActiva ? 'warning' : 'grey'" size="large" variant="elevated" @click="abrirDecision('REQUERIDAS_REVISIONES')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-refresh" :disabled="!seccionDecisionActiva">
                  Pedir revisiones
                </v-btn>
                <v-btn :color="seccionDecisionActiva ? 'error' : 'grey'" size="large" variant="elevated" @click="abrirDecision('RECHAZADO')" class="flex-grow-1 text-none font-weight-bold" prepend-icon="mdi-close-circle" :disabled="!seccionDecisionActiva">
                  Rechazar
                </v-btn>
              </div>
            </v-card-item>
          </v-card>

          <!-- Mensaje informativo para editor de secci�n -->
          <v-card
            v-else-if="editorStore.esEditorSeccion && asignacionesCompletadas.length > 0"
            class="mb-6"
            rounded="xl"
            variant="outlined"
            color="info"
          >
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-3">
                <v-icon color="info" size="24" class="mr-3">mdi-information-outline</v-icon>
                <div class="text-h6 font-weight-bold">Revisiones Completadas</div>
              </div>
              <p class="text-body-2 mb-4">
                Has gestionado las revisiones de este manuscrito. El <strong>Editor en Jefe</strong> ha sido notificado y tomará la decisión final (aceptar, rechazar o solicitar cambios) basándose en los resultados obtenidos.
              </p>
              <v-btn color="info" variant="tonal" prepend-icon="mdi-email-outline" block class="text-none">
                Enviar nota al Editor Jefe
              </v-btn>
            </v-card-text>
          </v-card>




        </v-col>

        <!-- Columna Derecha: Seleccionar Revisores -->
        <v-col cols="12" md="4">
          <v-card title="Revisores Disponibles" border rounded="lg" elevation="1" class="sticky-card">
            <template v-slot:append>
              <v-icon color="primary">mdi-account-search</v-icon>
            </template>
            <v-card-text class="pa-3">
              <v-btn
                v-if="!sugerenciasIA || sugerenciasIA.length === 0"
                block
                color="primary"
                variant="tonal"
                class="mb-3 text-none"
                prepend-icon="mdi-robot-outline"
                :loading="cargandoMatchingIA"
                @click="sugerirRevisoresIA"
              >
                Sugerir revisores con IA
              </v-btn>

              <div v-if="sugerenciasIA && sugerenciasIA.length > 0" class="mb-4">
                <div class="text-caption font-weight-bold text-primary mb-2">Recomendaciones de IA:</div>
                <div
                  v-for="sug in sugerenciasIA"
                  :key="'ia-'+sug.id"
                  class="revisor-card mb-2 pa-3 border rounded-lg transition-swing"
                  style="border-color: #7b1fa2 !important; border-width: 2px !important;"
                >
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div class="font-weight-bold text-brown">{{ sug.revisor }}</div>
                    <v-chip size="x-small" color="purple" variant="flat">{{ sug.afinidad }}% afinidad</v-chip>
                  </div>
                  <div v-if="getRevisorCompleto(sug.id)?.especialidad" class="text-caption text-brown-darken-2 mb-1 font-weight-medium">
                    <v-icon size="12" class="mr-1">mdi-school</v-icon> {{ getRevisorCompleto(sug.id).especialidad }}
                  </div>
                  <div v-if="getRevisorCompleto(sug.id)?.palabras_clave" class="mb-2 d-flex flex-wrap">
                    <v-chip v-for="keyword in getRevisorCompleto(sug.id).palabras_clave.split(',').slice(0,3)" :key="keyword" size="x-small" variant="outlined" color="brown" class="mr-1 mb-1">
                      {{ keyword.trim() }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-1 mb-2 line-height-1">
                    <v-icon size="14" color="purple" class="mr-1">mdi-robot-outline</v-icon>
                    {{ sug.justificacion }}
                  </div>
                  <v-btn
                    block
                    size="small"
                    color="purple"
                    variant="flat"
                    @click="asignar(sug.id)"
                    :disabled="revisorAsignado(sug.id)"
                    class="text-none"
                  >
                    {{ revisorAsignado(sug.id) ? 'Ya asignado' : 'Invitar a Revisar' }}
                  </v-btn>
                </div>
                <v-divider class="my-3"></v-divider>
                <div class="text-caption font-weight-bold mb-2">Todos los revisores:</div>
              </div>

              <v-text-field
                v-model="busquedaRevisor"
                prepend-inner-icon="mdi-magnify"
                placeholder="Buscar por nombre o instituci�n"
                density="compact"
                hide-details
                variant="outlined"
                clearable
                class="mb-2"
              />
              <div v-if="revisoresFiltrados.length === 0" class="pa-4 text-center text-medium-emphasis text-caption">
                Ning�n revisor coincide con la b�squeda
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
                <div class="text-caption text-grey-darken-1 mb-1 line-height-1">
                  <v-icon size="12" class="mr-1">mdi-bank</v-icon> {{ revisor.institucion || 'Sin institución' }}
                </div>
                <div v-if="revisor.especialidad" class="text-caption text-brown-darken-2 mb-1 font-weight-medium">
                  <v-icon size="12" class="mr-1">mdi-school</v-icon> {{ revisor.especialidad }}
                </div>
                <div v-if="revisor.palabras_clave" class="mb-2 d-flex flex-wrap">
                  <v-chip v-for="keyword in revisor.palabras_clave.split(',').slice(0,5)" :key="keyword" size="x-small" variant="outlined" color="brown" class="mr-1 mb-1">
                    {{ keyword.trim() }}
                  </v-chip>
                </div>
                <div v-if="revisor.experiencia" class="text-caption text-grey-darken-1 mb-3 line-height-1 font-italic text-truncate">
                  "{{ revisor.experiencia }}"
                </div>
                <div v-else class="mb-3"></div>
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
            <span v-if="entrada.carta || entrada.comentario" class="ml-2">� Con carta al autor</span>
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

    <!-- Modal de Rechazo -->
    <v-dialog v-model="dialogoRechazo" max-width="500">
      <v-card rounded="xl" border>
        <div style="background:#c62828; height:6px; border-radius:8px 8px 0 0" />
        <v-card-title class="pa-5 pb-2 text-h5 font-weight-bold text-error">
          <v-icon start color="error">mdi-alert-circle</v-icon>
          Rechazar Manuscrito
        </v-card-title>
        <v-card-text class="px-5">
          <p class="mb-4">Por favor, escriba un comentario explicando el motivo del rechazo. Este comentario será visible para el autor.</p>
          <v-textarea
            v-model="motivoRechazo"
            label="Motivo del rechazo *"
            variant="outlined"
            rows="4"
            :rules="[v => !!v || 'Debe escribir un motivo']"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="dialogoRechazo = false">Cancelar</v-btn>
          <v-btn 
            color="error" 
            variant="flat" 
            @click="confirmarRechazo"
            :disabled="!motivoRechazo.trim()"
            :loading="cargandoRechazo"
          >
            Confirmar Rechazo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Visor PDF -->
    <PdfViewer
      v-model="dialogoPdf"
      :titulo="manuscrito?.titulo"
      :referencia="manuscrito?.referencia"
      :url-pdf="manuscrito?.referencia ? `/api/manuscritos/download/${manuscrito.referencia}` : ''"
      :contenido="manuscrito?.contenido || manuscrito?.resumen"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEditorStore } from '@/store/editor/index.js'
import { useHistorialStore } from '@/store/historial.js'
import { sugerirRevisoresApi } from '@/services/api/matching.js'
import DecisionDialog from '@/components/common/DecisionDialog.vue'
import PdfViewer from '@/components/common/PdfViewer.vue'

const route = useRoute()
const editorStore = useEditorStore()
const historialStore = useHistorialStore()
const snackbar = ref(false)
const snackbarColor = ref('success')
const snackbarMsg = ref('Operaci�n completada con �xito')
const busquedaRevisor = ref('')
const dialogoPdf = ref(false)

function notify(msg, color = 'success') {
  snackbarMsg.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

const manuscritoId = route.params.id
const manuscrito = computed(() => (editorStore.manuscritos || []).find(m => String(m.id) === String(manuscritoId)))

// Lista de revisores filtrada: excluye al autor del artculo y aplica bsqueda.
const revisoresFiltrados = computed(() => {
  const autorId = manuscrito.value?.autorId
  const term = (busquedaRevisor.value || '').toLowerCase()
  return (editorStore.revisoresDisponibles || []).filter(r => {
    if (Number(r.id) === Number(autorId)) return false // Nunca el autor
    if (!term) return true
    return (r.nombre || '').toLowerCase().includes(term) ||
           (r.institucion || '').toLowerCase().includes(term)
  })
})

const sugerenciasIA = ref(null)
const cargandoMatchingIA = ref(false)

async function sugerirRevisoresIA() {
  cargandoMatchingIA.value = true
  try {
    const data = await sugerirRevisoresApi({
      titulo: manuscrito.value?.titulo || '',
      resumen: manuscrito.value?.resumen || '',
      palabrasClave: 'Investigación, academia', // Placeholder if no keywords
    })
    sugerenciasIA.value = data?.sugerencias || []
    if (sugerenciasIA.value.length > 0) {
      notify('Revisores sugeridos por IA', 'success')
    } else {
      notify('No se encontraron sugerencias', 'warning')
    }
  } catch (e) {
    console.error('Error in sugerirRevisoresIA:', e)
    notify('Error al conectar con el matching IA', 'error')
  } finally {
    cargandoMatchingIA.value = false
  }
}

function nombreRevisor(id) {
  const r = (editorStore.revisoresDisponibles || []).find(x => Number(x.id) === Number(id))
  return r?.nombre || `Revisor #${id}`
}

function getRevisorCompleto(id) {
  return (editorStore.revisoresDisponibles || []).find(x => Number(x.id) === Number(id)) || null
}

const asignacionesDelArticulo = computed(() => {
  if (!editorStore.asignaciones) return []
  return editorStore.asignaciones.filter(a => String(a.id_manuscrito_mongo) === String(manuscritoId))
})

const asignacionesPorRonda = computed(() => {
  const grupos = {}
  asignacionesDelArticulo.value.forEach(asig => {
    const r = asig.ronda || 1
    if (!grupos[r]) grupos[r] = []
    grupos[r].push(asig)
  })
  return Object.keys(grupos).sort((a, b) => b - a).map(num => ({
    numero: num,
    items: grupos[num]
  }))
})

const ultimaRonda = computed(() => {
  if (asignacionesDelArticulo.value.length === 0) return 1
  return Math.max(...asignacionesDelArticulo.value.map(a => a.ronda || 1))
})

const asignacionesUltimaRonda = computed(() => 
  asignacionesDelArticulo.value.filter(a => (a.ronda || 1) === ultimaRonda.value)
)

const asignacionesCompletadasUltimaRonda = computed(() => 
  asignacionesUltimaRonda.value.filter(a => a.estado === 'COMPLETADA')
)

const asignacionesCompletadas = computed(() => 
  asignacionesDelArticulo.value.filter(a => a.estado === 'COMPLETADA')
)

const requiereRevisiones = computed(() => {
  return asignacionesCompletadasUltimaRonda.value.some(a => a.recomendacion === 'REVISION_MENOR' || a.recomendacion === 'REVISION_MAYOR')
})

const seccionDecisionActiva = computed(() => {
  return !['ACEPTADO', 'RECHAZADO', 'REQUERIDAS_REVISIONES'].includes(manuscrito.value?.estado)
})

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
    notify('No puedes asignar al autor del art�culo como revisor', 'error')
  } else {
    notify('No se pudo invitar al revisor', 'error')
  }
}

async function quitar(idAsignacion) {
  const res = await editorStore.quitarRevisor(idAsignacion)
  if (res?.ok) {
    notify('Revisor quitado de la asignaci�n', 'success')
  } else if (res?.motivo === 'YA_COMPLETADA') {
    notify('No se puede quitar: el revisor ya envi� su revisi�n', 'error')
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
    notify('Decisi�n registrada correctamente', 'success')
  } else {
    notify('No se pudo registrar la decisi�n', 'error')
  }
}

const historialManuscrito = computed(() => historialStore.porManuscrito(manuscritoId))

function decisionLabel(d) {
  return { ACEPTADO: 'Aceptado', RECHAZADO: 'Rechazado', EN_REVISION: 'Revisiones solicitadas' }[d] || d
}

const ESTADOS = { 
  ENVIADO: 'Enviado', 
  EN_REVISION: 'En revisi�n', 
  ACEPTADO: 'Aceptado', 
  RECHAZADO: 'Rechazado' 
}
function estadoLabel(e) { return ESTADOS[e] ?? (e || 'Desconocido') }
function chipColor(e) { 
  if (e === 'ACEPTADO') return 'success'
  if (e === 'RECHAZADO') return 'error'
  if (e === 'EN_REVISION') return 'warning'
  if (e === 'LISTO_PARA_DECISION') return 'info'
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
