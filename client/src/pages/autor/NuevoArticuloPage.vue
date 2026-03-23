<template>
  <div>
    <v-btn variant="text" to="/autor/articulos" class="mb-4">← Volver</v-btn>

    <v-card max-width="800" class="mx-auto">
      <v-card-title>Enviar nuevo artículo</v-card-title>
      <v-card-text>
        <v-alert v-if="enviado" type="success" class="mb-4">
          Artículo enviado correctamente. Puede seguir su progreso en "Mis artículos".
        </v-alert>

        <v-form ref="formulario" v-model="valido" @submit.prevent="enviar">
          <v-text-field
            v-model="form.titulo"
            label="Título del artículo *"
            :rules="[r => !!r || 'El título es requerido']"
            class="mb-3"
          />
          <v-select
            v-model="form.convocatoria"
            :items="convocatoriasAbiertas"
            item-title="nombre"
            item-value="nombre"
            label="Convocatoria *"
            :rules="[r => !!r || 'Seleccione una convocatoria']"
            class="mb-3"
          />
          <v-textarea
            v-model="form.resumen"
            label="Resumen *"
            :rules="[r => !!r || 'El resumen es requerido', r => r.length >= 100 || 'Mínimo 100 caracteres']"
            rows="5"
            class="mb-3"
          />
          <v-file-input
            v-model="form.archivo"
            label="Archivo PDF *"
            accept=".pdf"
            :rules="[r => !!r?.length || 'El archivo es requerido']"
            class="mb-3"
          />

          <v-divider class="my-4" />

          <div class="d-flex justify-end">
            <v-btn type="submit" color="primary" :loading="cargando" :disabled="!valido">Enviar artículo</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAutorStore } from '@/store/autor/index.js'

const autorStore = useAutorStore()

const valido = ref(false)
const cargando = ref(false)
const enviado = ref(false)

const form = ref({
  titulo: '',
  convocatoria: '',
  resumen: '',
  archivo: null,
})

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))

async function enviar() {
  cargando.value = true
  await new Promise(r => setTimeout(r, 1000))
  autorStore.enviarManuscrito({
    titulo: form.value.titulo,
    resumen: form.value.resumen,
    convocatoria: form.value.convocatoria,
  })
  cargando.value = false
  enviado.value = true
  form.value = { titulo: '', convocatoria: '', resumen: '', archivo: null }
}
</script>
