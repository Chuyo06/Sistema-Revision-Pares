<template>
  <div>
    <h1 class="text-h6 mb-1">Panel de Administración</h1>
    <p class="text-body-2 mb-4">Gestión del sistema.</p>

    <!-- Resumen usuarios -->
    <v-row class="mb-4">
      <v-col cols="6" sm="4" md="2" v-for="kpi in kpis" :key="kpi.label">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h4">{{ kpi.valor }}</div>
            <div class="text-caption">{{ kpi.label }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>Distribución de usuarios</v-card-title>
      <v-card-text>
        <v-list density="compact">
          <v-list-item v-for="rol in rolesDistribucion" :key="rol.nombre" :title="rol.nombre">
            <template #append>
              <span class="font-weight-bold">{{ rol.cantidad }}</span>
            </template>
          </v-list-item>
        </v-list>
        <v-btn color="primary" variant="text" to="/administrador/usuarios" class="mt-2">Gestionar usuarios</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '@/store/administrador/index.js'

const adminStore = useAdminStore()

const kpis = computed(() => [
  { label: 'Total', valor: adminStore.metricas.totalUsuarios },
  { label: 'Autores', valor: adminStore.metricas.autores },
  { label: 'Revisores', valor: adminStore.metricas.revisores },
  { label: 'Editores', valor: adminStore.metricas.editores },
  { label: 'Activos', valor: adminStore.metricas.activos },
  { label: 'Inactivos', valor: adminStore.metricas.inactivos },
])

const rolesDistribucion = [
  { nombre: 'Autores', cantidad: adminStore.metricas.autores },
  { nombre: 'Revisores', cantidad: adminStore.metricas.revisores },
  { nombre: 'Editores', cantidad: adminStore.metricas.editores },
]
</script>
