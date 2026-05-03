<template>
  <v-dialog v-model="visible" max-width="900" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-3" style="background:#1B4332; color:white">
        <v-icon class="mr-2">mdi-file-pdf-box</v-icon>
        <span class="text-truncate flex-grow-1">{{ titulo || 'Documento del manuscrito' }}</span>
        <v-chip v-if="referencia" size="x-small" color="white" variant="outlined" class="mr-2">
          {{ referencia }}
        </v-chip>
        <v-btn icon variant="text" size="small" color="white" @click="visible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0" style="height:75vh">
        <!-- Si hay URL real del PDF lo mostramos en iframe -->
        <iframe
          v-if="urlPdf"
          :src="urlPdf"
          style="width:100%; height:100%; border:0"
          title="Visor PDF"
        />

        <!-- Fallback: el manuscrito no tiene PDF asociado todavía -->
        <div v-else class="d-flex flex-column align-center justify-center text-center pa-6" style="height:100%">
          <v-icon size="80" color="brown-lighten-2" class="mb-4">mdi-file-document-alert-outline</v-icon>
          <div class="text-h6 mb-2" style="color:#1B4332">Documento no disponible</div>
          <div class="text-body-2 text-medium-emphasis" style="max-width:420px">
            Este manuscrito no tiene un archivo PDF cargado.
            El autor sólo proporcionó la información textual (título, resumen, convocatoria).
          </div>
          <div v-if="contenido" class="mt-6 pa-4 text-left" style="background:#FAFAF7; border:1px solid #D3E0D7; border-radius:8px; max-width:680px; max-height:280px; overflow:auto">
            <div class="text-caption font-weight-bold mb-2" style="color:#8B5A2B; text-transform:uppercase">
              Contenido textual
            </div>
            <div class="text-body-2" style="white-space:pre-wrap">{{ contenido }}</div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-3" style="background:#F6F8F6">
        <v-btn
          v-if="urlPdf"
          variant="text"
          prepend-icon="mdi-download"
          :href="urlPdf"
          target="_blank"
          rel="noopener"
        >
          Abrir en pestaña nueva
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="visible = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  titulo: { type: String, default: '' },
  referencia: { type: String, default: '' },
  urlPdf: { type: String, default: '' },
  contenido: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>
