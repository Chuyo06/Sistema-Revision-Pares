<template>
  <div>
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/autor/articulos" class="mb-4">
      Volver a mis artículos
    </v-btn>

    <v-card max-width="750" class="mx-auto" color="surface" border>
      <div style="background:#4CAF50; height:6px; border-radius:8px 8px 0 0" />

      <v-card-title class="pa-5 pb-2" style="color:#1B4332">
        <v-icon start color="primary">mdi-file-plus-outline</v-icon>
        Enviar nuevo artículo
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-5">
        <!-- Bloqueo: no hay convocatorias abiertas -->
        <v-alert
          v-if="!hayConvocatoriasAbiertas && !enviado"
          type="warning"
          variant="tonal"
          rounded="lg"
          icon="mdi-calendar-remove-outline"
        >
          <strong>No hay convocatorias abiertas en este momento.</strong>
          <div class="text-body-2 mt-1">
            Debes esperar a que el editor jefe abra una nueva convocatoria para enviar tu artículo.
          </div>
        </v-alert>

        <v-alert v-if="enviado" type="success" variant="tonal" class="mb-4" rounded="lg">
          Artículo enviado. Puede seguir su estado en "Mis artículos".
        </v-alert>

        <v-form v-if="hayConvocatoriasAbiertas" ref="formulario" v-model="valido">
          <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
            Información del manuscrito
          </p>

          <v-text-field
            v-model="form.titulo"
            label="Título del artículo *"
            prepend-inner-icon="mdi-format-title"
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
            prepend-inner-icon="mdi-calendar-star"
            :rules="[r => !!r || 'Seleccione una convocatoria']"
            class="mb-3"
            :disabled="enviado"
          />
          <v-textarea
            v-model="form.resumen"
            label="Resumen *"
            prepend-inner-icon="mdi-text"
            :rules="[r => !!r || 'El resumen es requerido', r => r.length >= 100 || 'Mínimo 100 caracteres']"
            rows="5"
            class="mb-2"
            :disabled="enviado"
          />
        </v-form>

        <template v-if="hayConvocatoriasAbiertas">
          <v-divider class="my-4" />

          <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
            Archivo PDF
          </p>

          <div v-if="valido || enviado">
            <PdfUploader @uploaded="onPdfUploaded" @reset="onReset" />
          </div>
          <v-alert v-else type="info" variant="tonal" density="compact" rounded="lg">
            Complete la información de arriba para habilitar la carga del PDF.
          </v-alert>
        </template>
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

const form = ref({ titulo: '', convocatoria: '', resumen: '' })

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))
const hayConvocatoriasAbiertas = computed(() => convocatoriasAbiertas.value.length > 0)

function onPdfUploaded({ reference }) {
  autorStore.enviarManuscrito({
    titulo: form.value.titulo,
    resumen: form.value.resumen,
    convocatoria: form.value.convocatoria,
    referencia: reference,
  })
  enviado.value = true
}

function onReset() {
  enviado.value = false
  form.value = { titulo: '', convocatoria: '', resumen: '' }
}
</script>
