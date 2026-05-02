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
        <v-alert v-if="enviado" type="success" variant="tonal" class="mb-4" rounded="lg">
          Artículo enviado. Puede seguir su estado en "Mis artículos".
        </v-alert>

        <v-form ref="formulario" v-model="valido">
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
            :rules="[r => !!r || 'El resumen es requerido']"
            rows="5"
            class="mb-2"
            :disabled="enviado"
          />
        </v-form>

        <v-divider class="my-4" />

        <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
          Archivo PDF
        </p>

        <div v-if="valido || enviado">
          <v-file-input
            v-model="selectedFile"
            label="Archivo PDF (Requerido para enviar)"
            accept="application/pdf"
            prepend-icon=""
            prepend-inner-icon="mdi-file-pdf-box"
            show-size
            variant="outlined"
            color="primary"
            class="mb-4"
            :disabled="enviado || isUploading"
          ></v-file-input>
          
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">{{ errorMessage }}</v-alert>

          <div class="d-flex gap-4">
            <v-btn 
              color="grey" 
              variant="elevated" 
              class="flex-grow-1 text-none font-weight-bold"
              size="large"
              @click="guardarBorrador"
              :loading="isUploading"
              :disabled="enviado"
            >
              Guardar como Borrador
            </v-btn>
            <v-btn 
              color="primary" 
              variant="elevated"
              class="flex-grow-1 text-none font-weight-bold"
              size="large"
              @click="enviarManuscrito"
              :loading="isUploading"
              :disabled="enviado || !selectedFile"
            >
              Enviar Artículo
            </v-btn>
          </div>
        </div>
        <v-alert v-else type="info" variant="tonal" density="compact" rounded="lg">
          Complete la información de arriba para habilitar la carga del PDF y el guardado.
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAutorStore } from '@/store/autor/index.js'

const router = useRouter()

const autorStore = useAutorStore()

const valido = ref(false)
const enviado = ref(false)

const form = ref({ titulo: '', convocatoria: '', resumen: '' })

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))

const selectedFile = ref(null)
const isUploading = ref(false)
const errorMessage = ref('')

async function procesarSubidaArchivo() {
  if (!selectedFile.value) return null
  
  const file = Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value
  
  if (file.type !== 'application/pdf') {
    errorMessage.value = 'El archivo debe ser PDF.'
    return null
  }
  if (file.size > 50 * 1024 * 1024) {
    errorMessage.value = 'El archivo supera 50MB.'
    return null
  }

  try {
    const formData = new FormData()
    formData.append('archivo', file)

    const res = await fetch('/api/manuscritos/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) throw new Error('Error al subir el archivo')
    const data = await res.json()
    return data.referencia
  } catch (error) {
    errorMessage.value = 'Error al subir el archivo al servidor.'
    return null
  }
}

async function guardarBorrador() {
  isUploading.value = true
  errorMessage.value = ''
  
  let referencia = null
  if (selectedFile.value) {
    referencia = await procesarSubidaArchivo()
    if (errorMessage.value) {
      isUploading.value = false
      return
    }
  }

  const exito = await autorStore.guardarBorrador({
    ...form.value,
    referencia
  })

  isUploading.value = false
  if (exito) {
    router.push('/autor/borradores')
  }
}

async function enviarManuscrito() {
  if (!selectedFile.value) {
    errorMessage.value = 'Debe seleccionar un archivo PDF para enviar el manuscrito.'
    return
  }

  isUploading.value = true
  errorMessage.value = ''
  
  const referencia = await procesarSubidaArchivo()
  if (!referencia) {
    isUploading.value = false
    return
  }

  const exito = await autorStore.enviarManuscrito({
    ...form.value,
    referencia
  })

  isUploading.value = false
  if (exito) {
    enviado.value = true
  }
}
</script>

<style scoped>
.gap-4 { gap: 16px; }
</style>
