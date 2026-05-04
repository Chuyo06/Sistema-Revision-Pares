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
                v-if="articulo.referencia"
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
              <v-icon start color="primary" size="20">mdi-clipboard-edit-outline</v-icon>
              Formulario de revisión
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-4" style="max-height: 850px; overflow-y: auto;">
              <v-form ref="form" v-model="valido" @submit.prevent="enviarRevision">

                <!-- Evaluación -->
                <p class="text-caption font-weight-bold mb-2" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
                  Evaluación general
                </p>
                <v-row class="mb-1" dense>
                  <v-col v-for="dim in dimensiones" :key="dim.campo" cols="12" sm="6">
                    <div class="text-caption font-weight-medium mb-1" style="color:#1B4332">{{ dim.label }}</div>
                    <v-rating
                      v-model="revision[dim.campo]"
                      :length="5"
                      density="compact"
                      size="small"
                      color="warning"
                      active-color="warning"
                    />
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <p class="text-caption font-weight-bold mb-2" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
                  Dictamen
                </p>

                <v-select
                  v-model="revision.recomendacion"
                  :items="recomendaciones"
                  item-title="label"
                  item-value="value"
                  label="Recomendación *"
                  density="compact"
                  prepend-inner-icon="mdi-gavel"
                  :rules="[r => !!r || 'Seleccione una recomendación']"
                  class="mb-3"
                />
                
                <!-- Comentarios por sección -->
                <div class="mb-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-caption font-weight-bold" style="color:#1B4332">Comentarios Específicos</span>
                    <v-btn size="x-small" color="primary" variant="tonal" prepend-icon="mdi-plus" @click="agregarSeccion">
                      Añadir sección
                    </v-btn>
                  </div>
                  <v-card v-for="(item, index) in comentariosPorSeccion" :key="index" variant="outlined" class="mb-2 pa-2 bg-grey-lighten-4">
                    <div class="d-flex align-center mb-1">
                      <v-text-field
                        v-model="item.seccion"
                        placeholder="Sección (Ej. Introducción)"
                        density="compact"
                        hide-details
                        variant="underlined"
                        class="flex-grow-1"
                      />
                      <v-btn icon="mdi-delete" color="error" variant="text" size="small" @click="eliminarSeccion(index)" />
                    </div>
                    <v-textarea
                      v-model="item.comentario"
                      placeholder="Escribe tu comentario detallado..."
                      rows="2"
                      auto-grow
                      density="compact"
                      hide-details
                      variant="plain"
                    />
                  </v-card>
                </div>

                <v-textarea
                  v-model="revision.comentariosAutor"
                  label="Comentarios generales (Autor)"
                  prepend-inner-icon="mdi-comment-text-outline"
                  :rules="[() => cumpleMinimoComentarios() || 'Requiere mín. 50 caracteres']"
                  rows="3"
                  density="compact"
                  class="mb-3"
                />
                <v-textarea
                  v-model="revision.comentariosEditor"
                  label="Confidencial para Editor"
                  prepend-inner-icon="mdi-comment-lock-outline"
                  rows="2"
                  density="compact"
                  class="mb-4"
                />

                <div class="d-flex justify-space-between align-center mt-2">
                  <div class="d-flex align-center">
                    <v-btn
                      color="secondary"
                      variant="tonal"
                      size="small"
                      @click="solicitarFeedbackIA"
                      :loading="cargandoIA"
                      :disabled="!cumpleMinimoComentariosIA()"
                      prepend-icon="mdi-robot-outline"
                    >
                      Asistente IA
                    </v-btn>
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

      <!-- Confirmación -->
      <v-dialog v-model="dialogoConfirmacion" max-width="380">
        <v-card color="surface">
          <div style="background:#558b2f; height:6px; border-radius:8px 8px 0 0" />
          <v-card-text class="pa-5 text-center">
            <v-icon size="40" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h6" style="color:#1B4332">Revisión enviada</div>
            <p class="text-body-2 mt-1" style="color:#8B5A2B">Tu revisión fue registrada correctamente.</p>
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

const route = useRoute()
const router = useRouter()
const revisorStore = useRevisorStore()

const articuloId = route.params.id
const articulo = computed(() => revisorStore.articulosAsignados.find(a => String(a.id) === String(articuloId)))

onMounted(() => {
  if (revisorStore.articulosAsignados.length === 0) {
    revisorStore.cargarDashboard()
  }

  // Cargar borrador local si existe
  const borrador = revisorStore.cargarBorrador(articuloId)
  if (borrador) {
    if (borrador.revision) Object.assign(revision, borrador.revision)
    if (borrador.comentariosPorSeccion) comentariosPorSeccion.value = borrador.comentariosPorSeccion
  }
})

const valido = ref(false)
const enviando = ref(false)
const dialogoConfirmacion = ref(false)

const cargandoIA = ref(false)
const dialogoFeedbackIA = ref(false)
const feedbackIA = ref({ score: 0, constructividad: '', tono: '', sugerencias: [] })

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
      revisorStore.guardarBorrador(articuloId, {
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
    const res = await fetch('/api/analisis/evaluate-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentarios: texto })
    });
    if (res.ok) {
      feedbackIA.value = await res.json();
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
  
  // Calcular puntuación media (1-5)
  const puntuacion = Math.round(
    (revision.originalidad + revision.metodologia + revision.claridad + revision.relevancia) / 4
  )

  // Consolidar comentarios
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

  await revisorStore.enviarRevision(articuloId, dataParaBackend)
  
  enviando.value = false
  dialogoConfirmacion.value = true
}

function irAsignados() {
  dialogoConfirmacion.value = false
  router.push('/revisor/asignados')
}
</script>
