<template>
  <div>
    <v-btn variant="text" to="/editor/manuscritos" class="mb-4">← Volver</v-btn>

    <div v-if="manuscrito">
      <v-card class="mb-4">
        <v-card-title>{{ manuscrito.titulo }}</v-card-title>
        <v-card-subtitle>{{ manuscrito.autores }} · {{ manuscrito.convocatoria }} — {{ estadoLabel(manuscrito.estado) }}</v-card-subtitle>
        <v-card-text v-if="manuscrito.alertas.length">
          <p v-for="(a, i) in manuscrito.alertas" :key="i" class="text-caption">⚠ {{ a }}</p>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>Revisores disponibles</v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-for="revisor in editorStore.revisoresDisponibles" :key="revisor.id" cols="12" md="6">
              <v-card variant="outlined" class="mb-2">
                <v-card-title class="text-body-2">{{ revisor.nombre }}</v-card-title>
                <v-card-subtitle>Matching: {{ revisor.matching }}% — {{ revisor.disponible ? 'Disponible' : 'No disponible' }}</v-card-subtitle>
                <v-card-text class="pt-0">
                  <span v-for="esp in revisor.especialidades" :key="esp" class="text-caption mr-2">{{ esp }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    v-if="!revisorAsignado(revisor.id)"
                    :disabled="!revisor.disponible"
                    color="primary"
                    size="small"
                    @click="asignar(revisor.id)"
                  >
                    Asignar
                  </v-btn>
                  <v-btn v-else size="small" disabled>Asignado</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card v-if="manuscrito.revisionesCompletadas >= 2">
        <v-card-title>Decisión editorial</v-card-title>
        <v-card-text>
          <div class="d-flex gap-3">
            <v-btn color="success" @click="decidir('ACEPTADO')">Aceptar</v-btn>
            <v-btn color="warning" @click="decidir('REVISION_MENOR')">Revisiones menores</v-btn>
            <v-btn color="error" @click="decidir('RECHAZADO')">Rechazar</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <p v-else class="text-body-2">Manuscrito no encontrado.</p>

    <v-snackbar v-model="snackbar" timeout="3000">Revisor asignado correctamente</v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useEditorStore } from '@/store/editor/index.js'

const route = useRoute()
const editorStore = useEditorStore()
const snackbar = ref(false)

const manuscritoId = Number(route.params.id)
const manuscrito = editorStore.manuscritos.find(m => m.id === manuscritoId)

const asignados = ref([])

function revisorAsignado(id) { return asignados.value.includes(id) }

function asignar(revisorId) {
  asignados.value.push(revisorId)
  editorStore.asignarRevisor(manuscritoId, revisorId)
  snackbar.value = true
}

function decidir(decision) {
  editorStore.tomarDecision(manuscritoId, decision === 'REVISION_MENOR' ? 'EN_REVISION' : decision)
}

function iniciales(nombre) {
  return nombre.split(' ').slice(0, 2).map(n => n[0]).join('')
}

const ESTADOS = {
  ENVIADO: 'Enviado',
  EN_REVISION: 'En revisión',
  ACEPTADO: 'Aceptado',
  RECHAZADO: 'Rechazado',
}

function estadoLabel(e) { return ESTADOS[e] ?? e }
</script>
