<template>
  <div>
    <h1 class="text-h6 mb-1">Panel Editorial</h1>
    <p class="text-body-2 mb-4">Bienvenido, {{ auth.usuario?.nombre }}.</p>

    <v-alert v-if="editorStore.metricas.alertasPendientes > 0" type="warning" class="mb-4">
      Tienes {{ editorStore.metricas.alertasPendientes }} alerta(s) pendientes.
      <v-btn variant="text" size="small" to="/editor/manuscritos">Ver manuscritos</v-btn>
    </v-alert>

    <!-- Resumen -->
    <v-row class="mb-4">
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ editorStore.metricas.totalManuscritos }}</div>
            <div class="text-caption">Total</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ editorStore.metricas.enRevision }}</div>
            <div class="text-caption">En revisión</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ editorStore.metricas.aceptados }}</div>
            <div class="text-caption">Aceptados</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ editorStore.metricas.tasaAceptacion }}%</div>
            <div class="text-caption">Tasa aceptación</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Manuscritos recientes -->
    <v-card>
      <v-card-title>Manuscritos recientes</v-card-title>
      <v-data-table
        :headers="headers"
        :items="editorStore.manuscritos"
        :items-per-page="5"
      >
        <template #item.estado="{ item }">
          {{ estadoLabel(item.estado) }}
        </template>
        <template #item.progreso="{ item }">
          {{ item.revisionesCompletadas }}/{{ item.revisoresAsignados }}
        </template>
        <template #item.acciones="{ item }">
          <v-btn size="small" variant="text" :to="`/editor/asignacion/${item.id}`">Ver</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.js'
import { useEditorStore } from '@/store/editor/index.js'

const auth = useAuthStore()
const editorStore = useEditorStore()

const headers = [
  { title: 'Título', key: 'titulo', sortable: true },
  { title: 'Convocatoria', key: 'convocatoria', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Progreso', key: 'progreso', sortable: false },
  { title: '', key: 'acciones', sortable: false, align: 'end' },
]

const ESTADOS = {
  ENVIADO: 'Enviado',
  EN_REVISION: 'En revisión',
  ACEPTADO: 'Aceptado',
  RECHAZADO: 'Rechazado',
}

function estadoLabel(e) { return ESTADOS[e] ?? e }
</script>
