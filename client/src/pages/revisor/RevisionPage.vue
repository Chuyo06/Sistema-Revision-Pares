<template>
  <div style="max-width: 1400px; margin: 0 auto; padding: 20px;">
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/revisor/asignados" class="mb-4">
      Volver a asignados
    </v-btn>

    <div v-if="articulo">
      <v-row>
        <!-- Visor del PDF -->
        <v-col cols="12" md="7" lg="8">
          <v-card class="fill-height d-flex flex-column" color="surface" border>
            <div style="background:#546e7a; height:6px; border-radius:8px 8px 0 0" />
            
            <div class="pa-4 bg-grey-lighten-4 border-b">
              <div class="text-h6 font-weight-bold mb-1" style="color:#1B4332">{{ articulo.titulo }}</div>
              <div class="text-caption mb-2" style="color:#8B5A2B">
                {{ articulo.convocatoria }}
              </div>
              <p class="text-caption" style="color:#4CAF50; line-height:1.4">{{ articulo.resumen }}</p>
            </div>

            <div class="flex-grow-1" style="min-height: 800px; display:flex; flex-direction:column">
              <iframe
                v-if="articulo.referencia && articulo.estado !== 'COMPLETADA'"
                :src="`/api/manuscritos/download/${articulo.referencia}#toolbar=1&navpanes=0&scrollbar=1`"
                style="width:100%; height:100%; border:none; flex-grow:1"
                title="Visor PDF del Manuscrito"
              ></iframe>
              <div v-else class="pa-8 text-center text-medium-emphasis flex-grow-1 d-flex flex-column justify-center align-center">
                <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-file-hidden</v-icon>
                <div>No hay documento PDF disponible para visualizar.</div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Formulario de revisión -->
        <v-col cols="12" md="5" lg="4">
          <v-card color="surface" border class="fill-height">
            <div style="background:#4CAF50; height:6px; border-radius:8px 8px 0 0" />
            <v-card-title class="pa-4 pb-2" style="color:#1B4332; font-size:16px;">
              Formulario de Evaluación
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-4">
              <v-form v-model="valido" @submit.prevent="enviarRevision">
                
                <div v-for="dim in dimensiones" :key="dim.campo" class="mb-4">
                  <div class="text-subtitle-2 mb-1" style="color:#558b2f">{{ dim.label }}</div>
                  <v-rating
                    v-model="revision[dim.campo]"
                    color="amber-darken-2"
                    active-color="amber-darken-2"
                    density="compact"
                    hover
                    required
                  ></v-rating>
                </div>

                <v-select
                  v-model="revision.recomendacion"
                  :items="recomendaciones"
                  item-title="label"
                  item-value="value"
                  label="Recomendación final"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  required
                  class="mb-2"
                ></v-select>

                <div class="d-flex align-center justify-space-between mb-2 mt-4">
                  <div class="text-subtitle-2" style="color:#1B4332">Comentarios por sección</div>
                  <v-btn size="x-small" color="secondary" variant="text" prepend-icon="mdi-plus" @click="agregarSeccion">
                    Añadir sección
                  </v-btn>
                </div>

                <div v-for="(item, idx) in comentariosPorSeccion" :key="idx" class="mb-3 pa-3 bg-grey-lighten-5 border rounded">
                  <div class="d-flex gap-2 mb-2">
                    <v-text-field
                      v-model="item.seccion"
                      label="Título de sección / Página"
                      placeholder="Ej: Metodología, Pág 4"
                      variant="underlined"
                      density="compact"
                      hide-details
                    ></v-text-field>
                    <v-btn icon="mdi-delete-outline" variant="text" color="error" size="x-small" @click="eliminarSeccion(idx)"></v-btn>
                  </div>
                  <v-textarea
                    v-model="item.comentario"
                    label="Comentario específico"
                    variant="outlined"
                    density="compact"
                    rows="2"
                    auto-grow
                    hide-details
                  ></v-textarea>
                </div>

                <v-textarea
                  v-model="revision.comentariosAutor"
                  label="Comentarios generales para el Autor"
                  variant="outlined"
                  color="primary"
                  rows="4"
                  required
                  :rules="[v => !!v || 'Campo requerido', v => v.length >= 50 || 'Mínimo 50 caracteres']"
                  class="mb-4"
                ></v-textarea>

                <div class="d-flex mb-6">
                  <v-btn
                    variant="tonal"
                    color="secondary"
                    block
                    prepend-icon="mdi-robot"
                    :loading="cargandoIA"
                    :disabled="!cumpleMinimoComentariosIA()"
                    @click="solicitarFeedbackIA"
                  >
                    Asistente de Calidad (IA)
                  </v-btn>
                </div>

                <v-divider class="my-4" />

                <v-textarea
                  v-model="revision.comentariosEditor"
                  label="Comentarios PRIVADOS para el Editor"
                  placeholder="(Opcional)"
                  variant="outlined"
                  color="secondary"
                  rows="2"
                  auto-grow
                ></v-textarea>

                <div class="d-flex align-center mt-6">
                  <div class="flex-grow-1">
                    <span v-if="autoGuardando" class="text-caption text-grey ml-3 d-flex align-center">
                      <v-progress-circular indeterminate size="12" width="2" color="grey" class="mr-1"/> Guardando borrador...
                    </span>
                    <span v-else-if="ultimoGuardado" class="text-caption text-grey ml-3 d-flex align-center">
                      <v-icon size="14" color="success" class="mr-1">mdi-cloud-check</v-icon> Borrador guardado a las {{ ultimoGuardado }}
                    </span>
                  </div>
                  <v-btn
                    type="submit"
                    color="primary"
                    size="small"
                    :loading="enviando"
                    :disabled="!valido"
                    prepend-icon="mdi-send"
                  >
                    Enviar revisión
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Confirmación y mostrar opiniones de otros revisores -->
      <v-dialog v-model="dialogoConfirmacion" max-width="700">
        <v-card color="surface">
          <div style="background:#558b2f; height:6px; border-radius:8px 8px 0 0" />
          <v-card-text class="pa-5 text-center">
            <v-icon size="40" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h6" style="color:#1B4332">Revisión enviada</div>
            <p class="text-body-2 mt-1" style="color:#8B5A2B">Tu revisión fue registrada correctamente.</p>

            <!-- Ver opiniones de otros revisores (solo si todas las revisiones están completas) -->
            <div v-if="todasLasRevisionesCompletadas && otrasOpiniones.length > 0" class="mt-6 text-left">
              <v-divider class="mb-4" />
              <div class="text-subtitle-1 font-weight-bold mb-3" style="color:#1B4332">
                <v-icon size="20" class="mr-1">mdi-account-group</v-icon>
                Opiniones de otros revisores
              </div>
              <p class="text-caption text-medium-emphasis mb-4">
                Aquí puedes ver las evaluaciones de tus colegas (anonimizadas) para contextualizar tu trabajo.
              </p>
              <div
                v-for="(op, idx) in otrasOpiniones"
                :key="idx"
                class="pa-3 mb-3 rounded-lg"
                :style="{ background: op.color + '15', border: '1px solid ' + op.color + '40' }"
              >
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-weight-bold" :style="{ color: op.color }">
                    {{ op.label }}
                  </span>
                  <v-chip v-if="op.puntuacion" size="x-small" :color="op.color" variant="tonal">
                    {{ op.puntuacion }}/5
                  </v-chip>
                </div>
                <div class="text-body-2" style="color:#1B4332; white-space: pre-wrap;">
                  {{ op.comentarios }}
                </div>
                <div class="d-flex flex-wrap gap-1 mt-2" v-if="op.originalidad">
                  <v-chip size="x-small" variant="outlined" color="primary">Org: {{ op.originalidad }}</v-chip>
                  <v-chip size="x-small" variant="outlined" color="info">Met: {{ op.metodologia }}</v-chip>
                  <v-chip size="x-small" variant="outlined" color="success">Cla: {{ op.claridad }}</v-chip>
                  <v-chip size="x-small" variant="outlined" color="warning">Rel: {{ op.relevancia }}</v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center pb-4">
            <v-btn color="primary" @click="irAsignados">Ver mis artículos</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Feedback IA -->
      <v-dialog v-model="dialogoFeedbackIA" max-width="500">
        <v-card color="surface" border>
          <div style="background:#7b1fa2; height:6px; border-radius:8px 8px 0 0" />
          <v-card-title class="pa-4 pb-2" style="color:#1B4332">
            <v-icon start color="primary">mdi-robot</v-icon>
            Asistente de Calidad
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <div class="mb-4">
              <strong>Score estimado de la revisión:</strong> 
              <span :class="feedbackIA.score > 70 ? 'text-success font-weight-bold' : 'text-error font-weight-bold'">
                {{ feedbackIA.score }}/100
              </span>
            </div>
            <div class="mb-4">
              <strong>Constructividad:</strong> {{ feedbackIA.constructividad }}<br/>
              <strong>Tono:</strong> {{ feedbackIA.tono }}
            </div>
            <div>
              <strong>Sugerencias de mejora:</strong>
              <ul class="mt-2 pl-4">
                <li v-for="(sug, i) in feedbackIA.sugerencias" :key="i" class="text-body-2 mb-1" style="color:#8B5A2B">
                  {{ sug }}
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 justify-end">
            <v-btn color="primary" variant="tonal" @click="dialogoFeedbackIA = false">Entendido</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <p v-else class="text-body-2" style="color:#8B5A2B">Artículo no encontrado.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRevisorStore } from '@/store/revisor/index.js'
import { evaluarRevisionApi } from '@/services/api/analisis.js'
import { fetchAsignacionesPorManuscrito } from '@/services/api/revision.js'

const route = useRoute()
const router = useRouter()
const revisorStore = useRevisorStore()

const articuloId = computed(() => route.params.id)
const articulo = computed(() => revisorStore.articulosAsignados.find(a => String(a.id) === String(articuloId.value)))

watch(articuloId, async (newId) => {
  if (!newId) return;

  // Resetear el formulario para evitar cruces al cambiar de artículo
  Object.assign(revision, {
    originalidad: 0, metodologia: 0, claridad: 0, relevancia: 0,
    recomendacion: '', comentariosAutor: '', comentariosEditor: '',
  })
  comentariosPorSeccion.value = []
  otrasOpiniones.value = []
  todasLasRevisionesCompletadas.value = false

  if (revisorStore.articulosAsignados.length === 0) {
    await revisorStore.cargarDashboard()
  }

  // Cargar borrador local si existe (asíncrono desde IndexedDB)
  const borrador = await revisorStore.cargarBorrador(newId)
  if (borrador) {
    if (borrador.revision) Object.assign(revision, borrador.revision)
    if (borrador.comentariosPorSeccion) comentariosPorSeccion.value = borrador.comentariosPorSeccion
  }
}, { immediate: true })

const valido = ref(false)
const enviando = ref(false)
const dialogoConfirmacion = ref(false)

const cargandoIA = ref(false)
const dialogoFeedbackIA = ref(false)
const feedbackIA = ref({ score: 0, constructividad: '', tono: '', sugerencias: [] })
const otrasOpiniones = ref([])
const todasLasRevisionesCompletadas = ref(false)

const revision = reactive({
  originalidad: 0, metodologia: 0, claridad: 0, relevancia: 0,
  recomendacion: '', comentariosAutor: '', comentariosEditor: '',
})

const comentariosPorSeccion = ref([])

const autoGuardando = ref(false)
const ultimoGuardado = ref(null)
let timeoutBorrador = null

watch(
  [revision, comentariosPorSeccion],
  () => {
    autoGuardando.value = true
    if (timeoutBorrador) clearTimeout(timeoutBorrador)
    
    timeoutBorrador = setTimeout(() => {
      revisorStore.guardarBorrador(articuloId.value, {
        revision: { ...revision },
        comentariosPorSeccion: [...comentariosPorSeccion.value]
      })
      autoGuardando.value = false
      ultimoGuardado.value = new Date().toLocaleTimeString()
    }, 1500)
  },
  { deep: true }
)

function agregarSeccion() {
  comentariosPorSeccion.value.push({ seccion: '', comentario: '' })
}
function eliminarSeccion(index) {
  comentariosPorSeccion.value.splice(index, 1)
}

const textoCombinadoAutor = computed(() => {
  let texto = ''
  comentariosPorSeccion.value.forEach(item => {
    if (item.seccion || item.comentario) {
      texto += `[Sección: ${item.seccion || 'Sin título'}]\n${item.comentario}\n\n`
    }
  })
  if (revision.comentariosAutor) {
    texto += `[General]\n${revision.comentariosAutor}`
  }
  return texto.trim()
})

function cumpleMinimoComentarios() {
  return textoCombinadoAutor.value.length >= 50
}

function cumpleMinimoComentariosIA() {
  return textoCombinadoAutor.value.length >= 20
}

const dimensiones = [
  { campo: 'originalidad', label: 'Originalidad' },
  { campo: 'metodologia',  label: 'Metodología' },
  { campo: 'claridad',     label: 'Claridad' },
  { campo: 'relevancia',   label: 'Relevancia' },
]

const recomendaciones = [
  { value: 'ACEPTAR',         label: 'Aceptar' },
  { value: 'REVISION_MENOR',  label: 'Revisiones menores' },
  { value: 'REVISION_MAYOR',  label: 'Revisiones mayores' },
  { value: 'RECHAZAR',        label: 'Rechazar' },
]

async function solicitarFeedbackIA() {
  const texto = textoCombinadoAutor.value;
  if (!texto) return;
  cargandoIA.value = true;
  try {
    const data = await evaluarRevisionApi({ comentarios: texto });
    if (data) {
      feedbackIA.value = data;
      dialogoFeedbackIA.value = true;
    }
  } catch (e) {
    console.error("Error solicitando feedback IA", e);
  } finally {
    cargandoIA.value = false;
  }
}

async function enviarRevision() {
  enviando.value = true

  const puntuacion = Math.round(
    (revision.originalidad + revision.metodologia + revision.claridad + revision.relevancia) / 4
  )

  const comentarios = textoCombinadoAutor.value;
  const comentarios_editor = revision.comentariosEditor;

  const dataParaBackend = {
    originalidad: revision.originalidad,
    metodologia: revision.metodologia,
    claridad: revision.claridad,
    relevancia: revision.relevancia,
    puntuacion,
    comentarios,
    comentarios_editor,
    recomendacion: revision.recomendacion
  }

  const resultado = await revisorStore.enviarRevision(articuloId.value, dataParaBackend)

  enviando.value = false

  if (resultado) {
    if (resultado.offlineSync) {
      alert("Estás sin conexión. Tu revisión ha sido guardada en tu dispositivo y se enviará automáticamente cuando recuperes el internet.")
    } else {
      await cargarOpinionesOtrosRevisores()
    }
    dialogoConfirmacion.value = true
  } else {
    alert("Hubo un error al enviar la revisión. Asegúrate de tener conexión a internet.")
  }
}

async function cargarOpinionesOtrosRevisores() {
  try {
    const idManuscrito = articulo.value?.id_manuscrito
    if (!idManuscrito) return

    const asignaciones = await fetchAsignacionesPorManuscrito(idManuscrito)
    if (!asignaciones || asignaciones.length === 0) return

    const currentUserId = revisorStore.articulosAsignados.find(a => String(a.id) === String(articuloId.value))?.id

    const opiniones = asignaciones
      .filter(a => a.estado === 'COMPLETADA' && String(a.id_asignacion) !== String(currentUserId))
      .map((a, idx) => {
        let texto = a.comentarios || ''
        const markerAutor = 'PARA EL AUTOR: '
        const markerEditor = 'PARA EL EDITOR: '

        if (texto.includes(markerAutor)) {
          const idxAutor = texto.indexOf(markerAutor) + markerAutor.length
          const idxEditor = texto.indexOf(markerEditor)
          if (idxEditor !== -1 && idxEditor > idxAutor) {
            texto = texto.substring(idxAutor, idxEditor).trim()
          } else {
            texto = texto.substring(idxAutor).trim()
          }
        }

        const colores = ['#546e7a', '#558b2f', '#7b1fa2', '#e65100', '#00838f']
        return {
          label: `Revisor #${idx + 1}`,
          comentarios: texto || 'Sin comentarios para el autor',
          puntuacion: a.puntuacion,
          originalidad: a.originalidad,
          metodologia: a.metodologia,
          claridad: a.claridad,
          relevancia: a.relevancia,
          color: colores[idx % colores.length]
        }
      })

    otrasOpiniones.value = opiniones
    todasLasRevisionesCompletadas.value = true
  } catch (e) {
    console.error('Error cargando opiniones de otros revisores:', e)
  }
}

function irAsignados() {
  dialogoConfirmacion.value = false
  router.push('/revisor/asignados')
}
</script>
