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
        <v-alert v-if="enviado" type="success" variant="tonal" class="mb-6" rounded="lg" icon="mdi-check-circle">
          <strong>¡Artículo enviado con éxito!</strong>
          <div class="text-body-2 mt-1">
            Tu manuscrito ha sido registrado y el editor ha sido notificado. Redirigiendo a tu lista de artículos...
          </div>
          <v-btn color="success" variant="flat" class="mt-3" to="/autor/articulos">Ver mis artículos ahora</v-btn>
        </v-alert>

        <template v-else>
          <!-- Bloqueo: no hay convocatorias abiertas -->
          <v-alert
            v-if="!hayConvocatoriasAbiertas"
            type="warning"
            variant="tonal"
            rounded="lg"
            icon="mdi-calendar-remove-outline"
            class="mb-4"
          >
            <strong>No hay convocatorias abiertas en este momento.</strong>
            <div class="text-body-2 mt-1">
              Debes esperar a que el editor jefe abra una nueva convocatoria para enviar tu artículo.
            </div>
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

          <template v-if="hayConvocatoriasAbiertas">
            <v-divider class="my-4" />

            <p class="text-caption font-weight-bold mb-3" style="color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em">
              Archivo PDF
            </p>

            <div v-if="valido">
              <PdfUploader @uploaded="onPdfUploaded" @reset="onReset" />
              
              <v-alert v-if="referenciaSubida" type="success" variant="tonal" density="compact" rounded="lg" class="mt-4" icon="mdi-file-check">
                Documento vinculado: <strong>{{ referenciaSubida }}</strong>. Ya puedes enviar el artículo.
              </v-alert>
            </div>
            <v-alert v-else type="info" variant="tonal" density="compact" rounded="lg">
              Complete la información de arriba para habilitar la carga del PDF.
            </v-alert>
          </template>
        </template>
      </v-card-text>

      <v-divider v-if="!enviado && hayConvocatoriasAbiertas" />
      <v-card-actions v-if="!enviado && hayConvocatoriasAbiertas" class="pa-4 justify-end">
        <v-btn
          variant="text"
          color="brown"
          @click="guardarBorrador"
          :disabled="!valido || guardando"
          :loading="guardando && !esEnvio"
        >
          Guardar Borrador
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="ejecutarEnvio"
          :disabled="!valido || !referenciaSubida || guardando"
          :loading="guardando && esEnvio"
          prepend-icon="mdi-send"
        >
          Enviar Artículo
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAutorStore } from '@/store/autor/index.js'
import PdfUploader from '@/components/common/PdfUploader.vue'

const router = useRouter()
const autorStore = useAutorStore()

const valido = ref(false)
const enviado = ref(false)
const guardando = ref(false)
const esEnvio = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const form = ref({ titulo: '', convocatoria: '', resumen: '' })
const referenciaSubida = ref(null)

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))
const hayConvocatoriasAbiertas = computed(() => convocatoriasAbiertas.value.length > 0)

function onPdfUploaded({ reference }) {
  referenciaSubida.value = reference
}

function onReset() {
  referenciaSubida.value = null
}

async function guardarBorrador() {
  guardando.value = true
  esEnvio.value = false
  try {
    const exito = await autorStore.guardarBorrador({
      ...form.value,
      referencia: referenciaSubida.value
    })

    if (exito) {
      snackbarText.value = 'Borrador guardado correctamente'
      snackbarColor.value = 'success'
      snackbar.value = true
      setTimeout(() => router.push('/autor/borradores'), 1500)
    }
  } catch (e) {
    snackbarText.value = 'Error al guardar: ' + e.message
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    guardando.value = false
  }
}

async function ejecutarEnvio() {
  if (!referenciaSubida.value) {
    snackbarText.value = 'Debe subir el PDF primero'
    snackbarColor.value = 'warning'
    snackbar.value = true
    return
  }

  guardando.value = true
  esEnvio.value = true
  try {
    const nuevo = await autorStore.enviarManuscrito({
      ...form.value,
      referencia: referenciaSubida.value,
    })

    if (!nuevo) {
      throw new Error('No se obtuvo confirmación del servidor.')
    }

    enviado.value = true
    setTimeout(() => router.push('/autor/articulos'), 3500)
  } catch (e) {
    console.error('[NuevoArticulo] Error al enviar:', e)
    snackbarText.value = 'No se pudo enviar el artículo: ' + (e.message || 'error desconocido')
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.gap-4 { gap: 16px; }
</style>
