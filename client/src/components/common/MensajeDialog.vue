<template>
  <v-dialog v-model="visible" max-width="560" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4" style="background:#4CAF50; color:white">
        <v-icon class="mr-2">mdi-message-text-outline</v-icon>
        Enviar mensaje
      </v-card-title>

      <v-card-text class="pa-5">
        <div class="text-body-2 mb-3" style="color:#1B4332">
          Para: <strong>{{ destinatarioNombre || 'destinatario' }}</strong>
          <span v-if="contexto" class="text-caption text-medium-emphasis ml-2">· {{ contexto }}</span>
        </div>

        <v-textarea
          v-model="texto"
          label="Mensaje *"
          variant="outlined"
          rows="6"
          auto-grow
          counter
          :rules="[v => !!v?.trim() || 'Escribe un mensaje antes de enviar']"
          :hint="hint"
          persistent-hint
        />
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" :disabled="enviando" @click="cancelar">Cancelar</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-send"
          :loading="enviando"
          :disabled="!texto?.trim()"
          @click="enviar"
        >
          Enviar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  destinatarioId: { type: [Number, String], default: null },
  destinatarioNombre: { type: String, default: '' },
  // Texto descriptivo del contexto (ej. "sobre manuscrito X")
  contexto: { type: String, default: '' },
  hint: { type: String, default: '' },
  enviando: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'enviar'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const texto = ref('')

// Al abrir, limpiamos el texto previo para no arrastrar mensajes anteriores.
watch(visible, (v) => {
  if (v) texto.value = ''
})

function cancelar() {
  visible.value = false
}

function enviar() {
  const limpio = texto.value?.trim()
  if (!limpio) return
  emit('enviar', { destinatarioId: props.destinatarioId, mensaje: limpio })
}
</script>
