<template>
  <div>
    <h2 class="text-h6 mb-4">Artículos asignados</h2>

    <v-row>
      <v-col v-for="articulo in revisorStore.articulosAsignados" :key="articulo.id" cols="12" md="6">
        <v-card class="mb-2">
          <v-card-title class="text-body-1">{{ articulo.titulo }}</v-card-title>
          <v-card-subtitle>{{ articulo.autores }} — {{ estadoLabel(articulo.estado) }}</v-card-subtitle>
          <v-card-text>
            <p class="text-caption">Convocatoria: {{ articulo.convocatoria }}</p>
            <p class="text-caption">Deadline: {{ articulo.deadline }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="articulo.estado !== 'COMPLETADA'"
              color="primary"
              :to="`/revisor/revision/${articulo.id}`"
            >
              {{ articulo.estado === 'EN_PROGRESO' ? 'Continuar revisión' : 'Iniciar revisión' }}
            </v-btn>
            <v-btn v-else disabled>Revisión enviada</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRevisorStore } from '@/store/revisor/index.js'

const revisorStore = useRevisorStore()

const ESTADOS = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
}

function estadoLabel(e) { return ESTADOS[e] ?? e }
</script>
