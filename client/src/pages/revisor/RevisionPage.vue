<template>
  <div>
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/revisor/asignados" class="mb-4">
      Volver a asignados
    </v-btn>

    <div v-if="articulo">
      <!-- Info del artículo -->
      <v-card class="mb-4" color="surface" border>
        <div style="background:#546e7a; height:6px; border-radius:8px 8px 0 0" />
        <v-card-text class="pa-4">
          <div class="text-h6 font-weight-bold mb-1" style="color:#1B4332">{{ articulo.titulo }}</div>
          <div class="text-caption mb-3" style="color:#8B5A2B">
            {{ articulo.autores }} Â· {{ articulo.convocatoria }}
          </div>
          <p class="text-body-2" style="color:#4CAF50">{{ articulo.resumen }}</p>
          
          <v-btn
            v-if="articulo.referencia"
            color="primary"
            variant="outlined"
            size="small"
            class="mt-4"
            prepend-icon="mdi-file-pdf-box"
            :href="`/api/manuscritos/download/${articulo.referencia}`"
            target="_blank"
          >
            Ver PDF Adjunto
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Formulario de revisión -->
      <v-card color="surface" border>
        <div style="background:#4CAF50; height:6px; border-radius:8px 8px 0 0" />
        <v-card-title class="pa-4 pb-2" style="color:#1B4332">
          <v-icon start color="primary">mdi-clipboard-edit-outline</v-icon>
          Formulario de revisión
        </v-card-title>
        <v-divider />

        <v-card-text class="pa-5">
          <v-form ref="form" v-model="valido" @submit.prevent="enviarRevision">

            <!-- Evaluación -->
            <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
              Evaluación general
            </p>
            <v-row class="mb-3">
              <v-col v-for="dim in dimensiones" :key="dim.campo" cols="12" sm="6">
                <div class="text-body-2 mb-1" style="color:#1B4332">{{ dim.label }}</div>
                <v-rating
                  v-model="revision[dim.campo]"
                  :length="5"
                  density="compact"
                  color="warning"
                  active-color="warning"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
              Dictamen
            </p>

            <v-select
              v-model="revision.recomendacion"
              :items="recomendaciones"
              item-title="label"
              item-value="value"
              label="Recomendación *"
              prepend-inner-icon="mdi-gavel"
              :rules="[r => !!r || 'Seleccione una recomendación']"
              class="mb-3"
            />
            <v-textarea
              v-model="revision.comentariosAutor"
              label="Comentarios para el autor *"
              prepend-inner-icon="mdi-comment-text-outline"
              :rules="[r => !!r || 'Los comentarios son requeridos', r => r.length >= 50 || 'Mínimo 50 caracteres']"
              rows="5"
              class="mb-3"
            />
            <v-textarea
              v-model="revision.comentariosEditor"
              label="Comentarios confidenciales para el editor"
              prepend-inner-icon="mdi-comment-lock-outline"
              rows="3"
              class="mb-4"
            />

            <div class="d-flex justify-end">
              <v-btn
                type="submit"
                color="primary"
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
    </div>

    <p v-else class="text-body-2" style="color:#8B5A2B">Artículo no encontrado.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRevisorStore } from '@/store/revisor/index.js'

const route = useRoute()
const router = useRouter()
const revisorStore = useRevisorStore()

const articuloId = Number(route.params.id)
const articulo = computed(() => revisorStore.articulosAsignados.find(a => a.id === articuloId))

onMounted(() => {
  if (revisorStore.articulosAsignados.length === 0) {
    revisorStore.cargarDashboard()
  }
})

const valido = ref(false)
const enviando = ref(false)
const dialogoConfirmacion = ref(false)


const revision = reactive({
  originalidad: 0, metodologia: 0, claridad: 0, relevancia: 0,
  recomendacion: '', comentariosAutor: '', comentariosEditor: '',
})

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

async function enviarRevision() {
  enviando.value = true
  
  // Calcular puntuación media (1-5)
  const puntuacion = Math.round(
    (revision.originalidad + revision.metodologia + revision.claridad + revision.relevancia) / 4
  )

  // Consolidar comentarios
  const comentarios = `PARA EL AUTOR: ${revision.comentariosAutor}\n\nPARA EL EDITOR: ${revision.comentariosEditor}`

  const dataParaBackend = {
    puntuacion,
    comentarios,
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
