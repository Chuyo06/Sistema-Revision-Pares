<template>
  <div>
    <v-btn variant="text" to="/revisor/asignados" class="mb-4">← Volver</v-btn>

    <div v-if="articulo">
      <v-card class="mb-4">
        <v-card-title>{{ articulo.titulo }}</v-card-title>
        <v-card-subtitle>{{ articulo.autores }} · {{ articulo.convocatoria }}</v-card-subtitle>
        <v-card-text>
          <p class="text-body-2">{{ articulo.resumen }}</p>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>Formulario de revisión</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valido" @submit.prevent="enviarRevision">

            <p class="text-subtitle-2 mb-2">Evaluación general</p>
            <v-row class="mb-3">
              <v-col v-for="dim in dimensiones" :key="dim.campo" cols="12" sm="6">
                <div class="text-body-2 mb-1">{{ dim.label }}</div>
                <v-rating v-model="revision[dim.campo]" :length="5" density="compact" />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-select
              v-model="revision.recomendacion"
              :items="recomendaciones"
              item-title="label"
              item-value="value"
              label="Recomendación *"
              :rules="[r => !!r || 'Seleccione una recomendación']"
              class="mb-3"
            />

            <v-textarea
              v-model="revision.comentariosAutor"
              label="Comentarios para el autor *"
              :rules="[r => !!r || 'Los comentarios son requeridos', r => r.length >= 50 || 'Mínimo 50 caracteres']"
              rows="6"
              class="mb-3"
            />

            <v-textarea
              v-model="revision.comentariosEditor"
              label="Comentarios confidenciales para el editor"
              rows="3"
              class="mb-3"
            />

            <v-divider class="my-3" />

            <div class="d-flex justify-end">
              <v-btn type="submit" color="primary" :loading="enviando" :disabled="!valido">Enviar revisión</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>

      <v-dialog v-model="dialogoConfirmacion" max-width="400">
        <v-card>
          <v-card-title>Revisión enviada</v-card-title>
          <v-card-text>Tu revisión ha sido enviada correctamente.</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="irAsignados">Ver mis artículos</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <p v-else class="text-body-2">Artículo no encontrado.</p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRevisorStore } from '@/store/revisor/index.js'

const route = useRoute()
const router = useRouter()
const revisorStore = useRevisorStore()

const articuloId = Number(route.params.id)
const articulo = revisorStore.articulosAsignados.find(a => a.id === articuloId)

const valido = ref(false)
const enviando = ref(false)
const dialogoConfirmacion = ref(false)

const revision = reactive({
  originalidad: 0,
  metodologia: 0,
  claridad: 0,
  relevancia: 0,
  recomendacion: '',
  comentariosAutor: '',
  comentariosEditor: '',
})

const dimensiones = [
  { campo: 'originalidad', label: 'Originalidad' },
  { campo: 'metodologia', label: 'Metodología' },
  { campo: 'claridad', label: 'Claridad' },
  { campo: 'relevancia', label: 'Relevancia' },
]

const recomendaciones = [
  { value: 'ACEPTAR', label: 'Aceptar' },
  { value: 'REVISION_MENOR', label: 'Revisiones menores' },
  { value: 'REVISION_MAYOR', label: 'Revisiones mayores' },
  { value: 'RECHAZAR', label: 'Rechazar' },
]

async function enviarRevision() {
  enviando.value = true
  await new Promise(r => setTimeout(r, 800))
  revisorStore.enviarRevision(articuloId, { ...revision })
  enviando.value = false
  dialogoConfirmacion.value = true
}

function irAsignados() {
  dialogoConfirmacion.value = false
  router.push('/revisor/asignados')
}
</script>
