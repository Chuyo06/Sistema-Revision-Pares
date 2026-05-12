<template>
  <v-dialog v-model="visible" max-width="640" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4" :style="`background:${meta.color}; color:white`">
        <v-icon class="mr-2">{{ meta.icon }}</v-icon>
        {{ meta.titulo }}
      </v-card-title>

      <v-card-text class="pa-5">
        <div class="text-body-2 mb-4">
          Manuscrito: <strong>{{ manuscritoTitulo }}</strong>
          <span v-if="referencia" class="text-caption text-medium-emphasis ml-2">{{ referencia }}</span>
        </div>

        <div class="d-flex align-center gap-4 mb-3">
          <v-select
            v-model="plantillaElegida"
            :items="plantillas"
            item-title="nombre"
            item-value="id"
            label="Plantilla"
            variant="outlined"
            density="comfortable"
            hide-details
            class="flex-grow-1"
            @update:model-value="aplicarPlantilla"
          />
          <v-btn
            color="purple"
            variant="tonal"
            prepend-icon="mdi-robot-outline"
            :loading="cargandoIA"
            @click="generarBorradorIA"
            class="text-none"
            style="height: 48px;"
          >
            Generar con IA
          </v-btn>
        </div>

        <v-textarea
          v-model="comentario"
          label="Carta al autor"
          variant="outlined"
          rows="10"
          auto-grow
          counter
        />
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="cancelar">Cancelar</v-btn>
        <v-btn :color="meta.color" variant="flat" @click="confirmar">
          Confirmar {{ meta.accion }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { borradorDecisionApi } from '@/services/api/analisis.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  decision: { type: String, default: 'ACEPTADO' }, // ACEPTADO | RECHAZADO | EN_REVISION
  manuscritoTitulo: { type: String, default: '' },
  referencia: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'confirmar'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const META_DECISION = {
  ACEPTADO: {
    titulo: 'Aceptar manuscrito',
    accion: 'aceptación',
    color: '#558b2f',
    icon: 'mdi-check-circle',
  },
  RECHAZADO: {
    titulo: 'Rechazar manuscrito',
    accion: 'rechazo',
    color: '#c62828',
    icon: 'mdi-close-circle',
  },
  REQUERIDAS_REVISIONES: {
    titulo: 'Solicitar revisiones',
    accion: 'solicitud',
    color: '#e65100',
    icon: 'mdi-refresh',
  },
}

const meta = computed(() => META_DECISION[props.decision] || META_DECISION.ACEPTADO)

// Plantillas por tipo de decisión.
const PLANTILLAS_BASE = {
  ACEPTADO: [
    {
      id: 'aceptado-formal',
      nombre: 'Aceptación formal',
      texto:
        'Estimado/a autor/a:\n\nNos complace informarle que su manuscrito ha sido ACEPTADO para publicación, ' +
        'tras la evaluación favorable de los revisores asignados.\n\n' +
        'Recibirá próximamente las indicaciones del proceso editorial final (formato, pruebas de imprenta, ' +
        'cesión de derechos).\n\nCordialmente,\nComité Editorial',
    },
    {
      id: 'aceptado-condicionado',
      nombre: 'Aceptación con cambios menores',
      texto:
        'Estimado/a autor/a:\n\nSu manuscrito ha sido ACEPTADO condicionado a la incorporación de los cambios ' +
        'menores señalados por los revisores. Por favor envíe la versión revisada en un plazo de 15 días.\n\n' +
        'Cordialmente,\nComité Editorial',
    },
  ],
  RECHAZADO: [
    {
      id: 'rechazado-cortesia',
      nombre: 'Rechazo cortés',
      texto:
        'Estimado/a autor/a:\n\nLamentamos informarle que su manuscrito no ha sido aceptado para publicación. ' +
        'Tras un análisis cuidadoso, los revisores consideran que el trabajo no se ajusta a los criterios de ' +
        'la presente convocatoria. Le animamos a someterlo a otras publicaciones especializadas.\n\n' +
        'Agradecemos su interés en participar.\n\nCordialmente,\nComité Editorial',
    },
    {
      id: 'rechazado-fuera-alcance',
      nombre: 'Rechazo por alcance',
      texto:
        'Estimado/a autor/a:\n\nTras la evaluación inicial, hemos determinado que el tema de su manuscrito ' +
        'queda fuera del alcance temático de esta convocatoria. Le sugerimos enviarlo a foros especializados ' +
        'en el área correspondiente.\n\nCordialmente,\nComité Editorial',
    },
  ],
  REQUERIDAS_REVISIONES: [
    {
      id: 'revisiones-mayores',
      nombre: 'Revisiones mayores',
      texto:
        'Estimado/a autor/a:\n\nLos revisores recomiendan REVISIONES MAYORES antes de tomar una decisión final. ' +
        'Por favor atienda los comentarios indicados y reenvíe el manuscrito con una carta de respuesta ' +
        'punto-por-punto en un plazo de 30 días.\n\nCordialmente,\nComité Editorial',
    },
    {
      id: 'revisiones-menores',
      nombre: 'Revisiones menores',
      texto:
        'Estimado/a autor/a:\n\nLos revisores solicitan revisiones menores en su manuscrito. Por favor incorpore ' +
        'los cambios señalados y envíe la nueva versión en un plazo de 15 días.\n\nCordialmente,\nComité Editorial',
    },
  ],
}

const plantillas = computed(() => PLANTILLAS_BASE[props.decision] || [])
const plantillaElegida = ref(null)
const comentario = ref('')
const cargandoIA = ref(false)

function aplicarPlantilla(id) {
  const p = plantillas.value.find(x => x.id === id)
  if (p) comentario.value = p.texto
}

async function generarBorradorIA() {
  cargandoIA.value = true
  try {
    const data = await borradorDecisionApi({
      decisionEditor: props.decision,
      revisiones: ['Revisión 1 simulada', 'Revisión 2 simulada'], // Idealmente esto vendría de los props
    })
    if (data) {
      comentario.value = (data.carta || '') + (data.timelineSugerido ? `\n\nTiempo sugerido para revisión: ${data.timelineSugerido}` : '')
    }
  } catch (e) {
    console.error('Error generando borrador IA:', e)
  } finally {
    cargandoIA.value = false
  }
}

// Al abrir el diálogo, precarga la primera plantilla.
watch(visible, (v) => {
  if (v) {
    plantillaElegida.value = plantillas.value[0]?.id || null
    if (plantillaElegida.value) aplicarPlantilla(plantillaElegida.value)
  }
})

function cancelar() {
  visible.value = false
}

function confirmar() {
  emit('confirmar', {
    decision: props.decision,
    plantilla: plantillaElegida.value,
    comentario: comentario.value,
  })
  visible.value = false
}
</script>
