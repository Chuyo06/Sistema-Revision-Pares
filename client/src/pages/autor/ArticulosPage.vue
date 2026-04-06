<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col>
        <h2 class="text-h6">Mis artículos</h2>
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
      <v-col cols="auto">
        <v-btn color="primary" to="/autor/nuevo">Nuevo</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="auto">
        <span class="text-body-2 mr-2">Filtrar:</span>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="filtroEstado"
          :items="['TODOS', 'BORRADOR', 'EN_REVISION', 'ACEPTADO', 'RECHAZADO']"
          density="compact"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="m in manuscritosFiltrados" :key="m.id" cols="12" md="6">
        <v-card class="mb-2">
          <v-card-title class="text-body-1 d-flex justify-space-between align-center">
            {{ m.titulo }}
            <v-chip v-if="m.referencia" size="x-small" color="secondary" variant="flat" class="ml-2">
              REF: {{ m.referencia }}
            </v-chip>
          </v-card-title>
          <v-card-subtitle>{{ m.convocatoria }} — {{ estadoLabel(m.estado) }}</v-card-subtitle>
          <v-card-text>
            <p class="text-body-2 mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ m.resumen }}
            </p>
            <span class="text-caption">{{ m.revisores }} revisores</span>
            <span v-if="m.fechaEnvio" class="text-caption ml-3">{{ m.fechaEnvio }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <p v-if="manuscritosFiltrados.length === 0" class="text-body-2 text-center mt-4">
      No se encontraron artículos.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAutorStore } from '@/store/autor/index.js'

const autorStore = useAutorStore()
const busqueda = ref('')
const filtroEstado = ref('TODOS')

const manuscritosFiltrados = computed(() => {
  return autorStore.manuscritos.filter(m => {
    const coincideBusqueda = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideEstado = filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value
    return coincideBusqueda && coincideEstado
  })
})

const ESTADOS = {
  BORRADOR: 'Borrador',
  ENVIADO: 'Enviado',
  EN_REVISION: 'En revisión',
  ACEPTADO: 'Aceptado',
  RECHAZADO: 'Rechazado',
}

function estadoLabel(e) { return ESTADOS[e] ?? e }
</script>
