<template>
  <div style="max-width:1000px; padding:20px">
    <div style="font-size:13px; font-weight:700; color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:14px">
      Control Global de Manuscritos
    </div>

    <!-- Filtros -->
    <div style="display:flex; gap:12px; margin-bottom:20px">
      <v-text-field
        v-model="busqueda"
        placeholder="Buscar por título o ID..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        style="flex:1"
      />
      <v-select
        v-model="filtroEstado"
        :items="filtros"
        density="compact"
        hide-details
        style="width:200px"
      />
    </div>

    <!-- Tabla -->
    <v-card border elevation="0" rounded="lg">
      <v-table density="comfortable">
        <thead>
          <tr style="background:#FFFFFF">
            <th class="text-left font-weight-bold">ID</th>
            <th class="text-left font-weight-bold">Título</th>
            <th class="text-left font-weight-bold">Estado</th>
            <th class="text-left font-weight-bold">Autor ID</th>
            <th class="text-left font-weight-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in filtrados" :key="m.id">
            <td class="text-caption">#{{ m.id }}</td>
            <td style="max-width:300px">
              <div class="text-truncate font-weight-medium">{{ m.titulo }}</div>
              <div class="text-caption color-secondary">{{ m.convocatoria }}</div>
            </td>
            <td>
              <v-chip :color="chipColor(m.estado)" size="x-small" label>{{ m.estado }}</v-chip>
            </td>
            <td>{{ m.autorId }}</td>
            <td>
              <v-btn icon="mdi-eye-outline" variant="text" size="small" :to="`/editor/asignacion/${m.id}`" title="Ver como Editor"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div v-if="filtrados.length === 0" class="pa-10 text-center text-body-2 color-secondary">
        No se encontraron manuscritos.
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/store/administrador/index.js'

const adminStore = useAdminStore()
const busqueda = ref('')
const filtroEstado = ref('TODOS')

onMounted(() => {
  adminStore.cargarUsuarios() // Carga usuarios y manuscritos (alias de cargarDatosGlobales)
})

const filtros = ['TODOS', 'ENVIADO', 'EN_REVISION', 'ACEPTADO', 'RECHAZADO']

const filtrados = computed(() => {
  return adminStore.manuscritos.filter(m => {
    const matchesBusqueda = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) || String(m.id).includes(busqueda.value)
    const matchesEstado = filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value
    return matchesBusqueda && matchesEstado
  })
})

const chipColor = (e) => {
  if (e === 'ACEPTADO') return 'success'
  if (e === 'RECHAZADO') return 'error'
  if (e === 'EN_REVISION') return 'warning'
  return 'secondary'
}
</script>
