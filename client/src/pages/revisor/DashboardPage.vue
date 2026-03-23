<template>
  <div>
    <h1 class="text-h6 mb-1">Dashboard del Revisor</h1>
    <p class="text-body-2 mb-4">Bienvenido, {{ auth.usuario?.nombre }}. Tienes {{ pendientes }} revisiones pendientes.</p>

    <!-- Resumen -->
    <v-row class="mb-4">
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ revisorStore.articulosAsignados.length }}</div>
            <div class="text-caption">Asignados</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ pendientes }}</div>
            <div class="text-caption">Pendientes</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ revisorStore.articulosAsignados.filter(a => a.estado === 'EN_PROGRESO').length }}</div>
            <div class="text-caption">En progreso</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ completadas.length }}</div>
            <div class="text-caption">Completadas</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-4">
      <v-card-title>Revisiones pendientes</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="a in pendientesLista"
            :key="a.id"
            :title="a.titulo"
            :subtitle="a.convocatoria + ' · Deadline: ' + a.deadline"
            :to="`/revisor/revision/${a.id}`"
          />
        </v-list>
        <v-btn variant="text" color="primary" to="/revisor/asignados">Ver todos</v-btn>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Revisiones completadas</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="a in completadas"
            :key="a.id"
            :title="a.titulo"
            :subtitle="a.convocatoria"
          />
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useRevisorStore } from '@/store/revisor/index.js'

const auth = useAuthStore()
const revisorStore = useRevisorStore()

const pendientes = computed(() => revisorStore.articulosAsignados.filter(a => a.estado !== 'COMPLETADA').length)
const pendientesLista = computed(() => revisorStore.articulosAsignados.filter(a => a.estado === 'PENDIENTE'))
const completadas = computed(() => revisorStore.articulosAsignados.filter(a => a.estado === 'COMPLETADA'))
</script>
