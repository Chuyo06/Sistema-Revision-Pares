<template>
  <div>
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" to="/autor/borradores" class="mb-4">
      Volver a mis borradores
    </v-btn>

    <v-card max-width="750" class="mx-auto" color="surface" border>
      <div style="background:#9e9e9e; height:6px; border-radius:8px 8px 0 0" />

      <v-card-title class="pa-5 pb-2" style="color:#1B4332">
        <v-icon start color="secondary">mdi-file-document-edit-outline</v-icon>
        Editar Borrador
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-5">
        <v-alert v-if="enviado" type="success" variant="tonal" class="mb-4" rounded="lg">
          Artículo enviado. Puede seguir su estado en "Mis artículos".
        </v-alert>

        <div v-if="!manuscritoCargado && !enviado" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <template v-else-if="!enviado">
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
            />
            <v-textarea
              v-model="form.resumen"
              label="Resumen *"
              prepend-inner-icon="mdi-text"
              :rules="[r => !!r || 'El resumen es requerido']"
              rows="5"
              class="mb-2"
            />
          </v-form>

          <v-divider class="my-4" />

          <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
            Archivo PDF
          </p>

          <div v-if="valido">
            <v-alert v-if="referenciaActual" type="info" variant="tonal" class="mb-4" density="compact">
              <v-icon start>mdi-file-pdf-box</v-icon>
              Ya has subido un PDF previamente (Ref: {{ referenciaActual }}). 
              Sube uno nuevo abajo solo si deseas reemplazarlo.
            </v-alert>

            <v-file-input
              v-model="selectedFile"
              :label="referenciaActual ? 'Reemplazar archivo PDF (Opcional)' : 'Archivo PDF (Requerido para enviar)'"
              accept="application/pdf"
              prepend-icon=""
              prepend-inner-icon="mdi-file-pdf-box"
              show-size
              variant="outlined"
              color="primary"
              class="mb-4"
              :disabled="isUploading"
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
                :disabled="!sePuedeEnviar"
              >
                Enviar Artículo
              </v-btn>
            </div>
          </div>
          <v-alert v-else type="info" variant="tonal" density="compact" rounded="lg">
            Complete la información de arriba para habilitar la carga del PDF y el guardado.
          </v-alert>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAutorStore } from '@/store/autor/index.js'

const route = useRoute()
const router = useRouter()
const autorStore = useAutorStore()

const valido = ref(false)
const enviado = ref(false)
const manuscritoCargado = ref(false)

const form = ref({ titulo: '', convocatoria: '', resumen: '' })
const referenciaActual = ref(null)

const manuscritoId = route.params.id

onMounted(async () => {
  if (autorStore.manuscritos.length === 0) {
    await autorStore.cargarMisManuscritos()
  }
  const m = autorStore.manuscritos.find(m => String(m.id) === String(manuscritoId))
  if (m) {
    form.value = { 
      titulo: m.titulo || '', 
      convocatoria: m.convocatoria || '', 
      resumen: m.resumen || '' 
    }
    referenciaActual.value = m.referencia || null
  }
  manuscritoCargado.value = true
})

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))

const selectedFile = ref(null)
const isUploading = ref(false)
const errorMessage = ref('')

const sePuedeEnviar = computed(() => {
  return selectedFile.value || referenciaActual.value
})

async function procesarSubidaArchivo() {
  if (!selectedFile.value) return referenciaActual.value // Conservar el anterior si no subió uno nuevo
  
  const file = Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value
  
  if (file.type !== 'application/pdf') {
    errorMessage.value = 'El archivo debe ser PDF.'
    return null
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'El archivo supera 5MB.'
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
  
  const referencia = await procesarSubidaArchivo()
  if (errorMessage.value) {
    isUploading.value = false
    return
  }

  const exito = await autorStore.guardarBorrador({
    ...form.value,
    referencia
  }, manuscritoId)

  isUploading.value = false
  if (exito) {
    router.push('/autor/borradores')
  }
}

async function enviarManuscrito() {
  if (!sePuedeEnviar.value) {
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
  }, manuscritoId)

  isUploading.value = false
  if (exito) {
    enviado.value = true
  }
}
</script>

<style scoped>
.gap-4 { gap: 16px; }
</style>
