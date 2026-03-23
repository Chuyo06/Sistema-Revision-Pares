<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col>
        <h2 class="text-h6">Gestión de manuscritos</h2>
      </v-col>
      <v-col cols="12" sm="auto">
        <v-text-field
          v-model="busqueda"
          placeholder="Buscar..."
          density="compact"
          hide-details
          style="min-width: 200px"
        />
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="auto"><span class="text-body-2 mr-2">Filtrar:</span></v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="filtroEstado"
          :items="['TODOS', 'ENVIADO', 'EN_REVISION', 'ACEPTADO', 'RECHAZADO']"
          density="compact"
          hide-details
        />
      </v-col>
    </v-row>

    <v-card v-for="m in manuscritosFiltrados" :key="m.id" class="mb-3">
      <v-card-title class="text-body-1">{{ m.titulo }}</v-card-title>
      <v-card-subtitle>{{ m.autores }} · {{ m.convocatoria }} · {{ m.fechaEnvio }} — {{ estadoLabel(m.estado) }}</v-card-subtitle>
      <v-card-text>
        <p v-for="(alerta, i) in m.alertas" :key="i" class="text-caption text-warning">⚠ {{ alerta }}</p>
        <p class="text-body-2">Revisores: {{ m.revisionesCompletadas }}/{{ m.revisoresAsignados }} completadas</p>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" color="primary" :to="`/editor/asignacion/${m.id}`">Gestionar revisores</v-btn>
        <template v-if="m.estado === 'EN_REVISION' && m.revisionesCompletadas >= 2">
          <v-btn size="small" color="success" @click="decidir(m.id, 'ACEPTADO')">Aceptar</v-btn>
          <v-btn size="small" color="error" @click="decidir(m.id, 'RECHAZADO')">Rechazar</v-btn>
        </template>
      </v-card-actions>
    </v-card>

    <p v-if="manuscritosFiltrados.length === 0" class="text-body-2 text-center mt-4">Sin resultados.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEditorStore } from '@/store/editor/index.js'

const editorStore = useEditorStore()
const busqueda = ref('')
const filtroEstado = ref('TODOS')

const manuscritosFiltrados = computed(() =>
  editorStore.manuscritos.filter(m => {
    const b = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    const e = filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value
    return b && e
  })
)

const ESTADOS = {
  ENVIADO: 'Enviado',
  EN_REVISION: 'En revisión',
  ACEPTADO: 'Aceptado',
  RECHAZADO: 'Rechazado',
}

function estadoLabel(e) { return ESTADOS[e] ?? e }

function decidir(id, decision) {
  editorStore.tomarDecision(id, decision)
}
</script>
