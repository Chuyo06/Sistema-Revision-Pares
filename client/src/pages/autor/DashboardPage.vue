<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h6">Bienvenido, {{ auth.usuario?.nombre }}</h1>
        <p class="text-body-2">Gestiona tus manuscritos y sigue el progreso de tus envíos.</p>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" to="/autor/nuevo">Nuevo artículo</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen -->
    <v-row class="mb-4">
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ autorStore.manuscritos.filter(m => m.estado !== 'BORRADOR').length }}</div>
            <div class="text-caption">Enviados</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ autorStore.manuscritos.filter(m => m.estado === 'EN_REVISION').length }}</div>
            <div class="text-caption">En revisión</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ autorStore.manuscritos.filter(m => m.estado === 'ACEPTADO').length }}</div>
            <div class="text-caption">Aceptados</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ autorStore.manuscritos.filter(m => m.estado === 'BORRADOR').length }}</div>
            <div class="text-caption">Borradores</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mis manuscritos recientes -->
    <v-card class="mb-4">
      <v-card-title>Mis artículos recientes</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="m in autorStore.manuscritos.slice(0, 4)"
            :key="m.id"
            :title="m.titulo"
            :subtitle="m.convocatoria + (m.fechaEnvio ? ' · ' + m.fechaEnvio : '')"
          >
            <template #append>
              <span class="text-caption">{{ estadoLabel(m.estado) }}</span>
            </template>
          </v-list-item>
        </v-list>
        <v-btn variant="text" color="primary" to="/autor/articulos">Ver todos</v-btn>
      </v-card-text>
    </v-card>

    <!-- Convocatorias abiertas -->
    <v-card>
      <v-card-title>Convocatorias abiertas</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="c in convocatoriasAbiertas"
            :key="c.id"
            :title="c.nombre"
            :subtitle="'Deadline: ' + c.deadline"
          />
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useAutorStore } from '@/store/autor/index.js'

const auth = useAuthStore()
const autorStore = useAutorStore()

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))

const ESTADOS = {
  BORRADOR: 'Borrador',
  ENVIADO: 'Enviado',
  EN_REVISION: 'En revisión',
  ACEPTADO: 'Aceptado',
  RECHAZADO: 'Rechazado',
}

function estadoLabel(estado) { return ESTADOS[estado] ?? estado }
</script>
