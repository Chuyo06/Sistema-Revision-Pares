<template>
  <div>
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/autor/articulos" class="mb-4">
      Volver a mis artículos
    </v-btn>

    <v-card max-width="750" class="mx-auto" color="surface" border>
      <div style="background:#ef6c00; height:6px; border-radius:8px 8px 0 0" />

      <v-card-title class="pa-5 pb-2" style="color:#1B4332">
        <v-icon start color="orange-darken-3">mdi-file-refresh-outline</v-icon>
        Reenviar Versión Corregida
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-5">
        <v-alert v-if="enviado" type="success" variant="tonal" class="mb-4" rounded="lg">
          Versión corregida enviada exitosamente. El editor ha sido notificado.
        </v-alert>

        <div v-if="!manuscrito && !enviado" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <template v-else-if="manuscrito">
          <v-form ref="formulario" v-model="valido">
            <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
              Información Original (Solo lectura)
            </p>

            <v-text-field
              :model-value="manuscrito.titulo"
              label="Título del artículo"
              prepend-inner-icon="mdi-format-title"
              disabled
              class="mb-3 bg-grey-lighten-4"
            />
            <v-text-field
              :model-value="manuscrito.convocatoria"
              label="Convocatoria"
              prepend-inner-icon="mdi-calendar-star"
              disabled
              class="mb-3 bg-grey-lighten-4"
            />
            
            <v-divider class="my-6" />

            <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
              Respuestas a Revisores
            </p>
            
            <v-alert type="info" variant="tonal" class="mb-4 text-caption">
              Describe detalladamente los cambios realizados en el documento en respuesta a las observaciones de los revisores.
            </v-alert>

            <v-textarea
              v-model="respuestasRevisores"
              label="Cambios realizados *"
              prepend-inner-icon="mdi-comment-edit-outline"
              :rules="[r => !!r || 'Debe proporcionar una descripción de los cambios']"
              rows="5"
              class="mb-2"
              :disabled="enviado"
            />
          </v-form>

          <v-divider class="my-4" />

          <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
            Nuevo Archivo PDF
          </p>

          <div v-if="valido || enviado">
            <PdfUploader @uploaded="onPdfUploaded" @reset="onReset" />
          </div>
          <v-alert v-else type="info" variant="tonal" density="compact" rounded="lg">
            Complete la descripción de los cambios para habilitar la subida del nuevo PDF.
          </v-alert>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAutorStore } from '@/store/autor/index.js'
import PdfUploader from '@/components/common/PdfUploader.vue'

const route = useRoute()
const autorStore = useAutorStore()

const valido = ref(false)
const enviado = ref(false)
const respuestasRevisores = ref('')

const manuscritoId = Number(route.params.id)
const manuscrito = computed(() => autorStore.manuscritos.find(m => m.id === manuscritoId))

onMounted(async () => {
  if (autorStore.manuscritos.length === 0) {
    await autorStore.cargarMisManuscritos()
  }
})

async function onPdfUploaded({ reference }) {
  const exito = await autorStore.reenviarManuscrito(manuscritoId, reference, respuestasRevisores.value)
  if (exito) {
    enviado.value = true
  }
}

function onReset() {
  enviado.value = false
  respuestasRevisores.value = ''
}
</script>
