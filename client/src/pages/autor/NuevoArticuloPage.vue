<template>
  <div>
    <v-btn variant="text" to="/autor/articulos" class="mb-4">← Volver</v-btn>

    <v-card max-width="800" class="mx-auto">
      <v-card-title>Enviar nuevo artículo</v-card-title>
      <v-card-text>
        <v-alert v-if="enviado" type="success" class="mb-4">
          Artículo enviado correctamente. Puede seguir su progreso en "Mis artículos".
        </v-alert>

        <v-form ref="formulario" v-model="valido">
          <v-text-field
            v-model="form.titulo"
            label="Título del artículo *"
            :rules="[r => !!r || 'El título es requerido']"
            class="mb-3"
            :disabled="enviado"
          />
          <v-select
            v-model="form.convocatoria"
            :items="convocatoriasAbiertas"
            item-title="nombre"
            item-value="nombre"
            label="Convocatoria *"
            :rules="[r => !!r || 'Seleccione una convocatoria']"
            class="mb-3"
            :disabled="enviado"
          />
          <v-textarea
            v-model="form.resumen"
            label="Resumen *"
            :rules="[r => !!r || 'El resumen es requerido', r => r.length >= 100 || 'Mínimo 100 caracteres']"
            rows="5"
            class="mb-3"
            :disabled="enviado"
          />

          <v-divider class="my-6" />

          <!-- Nuevo componente de subida que cumple con los requerimientos -->
          <div v-if="valido || enviado">
            <PdfUploader 
              @uploaded="onPdfUploaded" 
              @reset="onReset"
            />
          </div>
          <v-alert v-else type="info" variant="tonal" density="compact">
            Complete la información arriba para habilitar la subida del archivo PDF.
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAutorStore } from '@/store/autor/index.js'
import PdfUploader from '@/components/common/PdfUploader.vue'

const autorStore = useAutorStore()

const valido = ref(false)
const enviado = ref(false)

const form = ref({
  titulo: '',
  convocatoria: '',
  resumen: '',
})

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))

function onPdfUploaded({ reference }) {
  // Cuando el PDF se sube (con todos sus requisitos de tamaño/tipo y su número de referencia)
  // Finalizamos el envío del manuscrito completo al store
  autorStore.enviarManuscrito({
    titulo: form.value.titulo,
    resumen: form.value.resumen,
    convocatoria: form.value.convocatoria,
    referencia: reference // Guardamos la referencia generada
  })
  enviado.value = true
}

function onReset() {
  enviado.value = false
  form.value = { titulo: '', convocatoria: '', resumen: '' }
}
</script>
