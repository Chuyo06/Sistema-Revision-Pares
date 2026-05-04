<template>
  <div style="max-width:800px; padding:20px">

    <div style="font-size:13px; font-weight:700; color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:14px">
      Artículos asignados para revisión
    </div>

    <!-- Barra de búsqueda y filtros -->
    <v-card border elevation="0" rounded="lg" class="pa-4 mb-6 bg-white">
      <v-row density="compact">
        <v-col cols="12" md="7">
          <v-text-field
            v-model="busqueda"
            prepend-inner-icon="mdi-magnify"
            label="Buscar por título o autor..."
            variant="outlined"
            density="compact"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-select
            v-model="filtroEstado"
            :items="opcionesEstado"
            label="Filtrar por estado"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tarjetas de asignación -->
    <div
      v-for="a in articulosFiltrados"
      :key="a.id"
      style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; margin-bottom:12px; overflow:hidden"
    >
      <!-- Franja de color -->
      <div :style="`height:6px; background:${hexEstado(a.estado)}`" />

      <div style="padding:16px">
        <!-- Fila 1: Título + chip (sin encimarse) -->
        <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:8px">
          <div style="flex:1; min-width:0">
            <div style="font-size:15px; font-weight:600; color:#1B4332; word-break:break-word">
              {{ a.titulo }}
            </div>
          </div>
          <v-chip :color="chipEstado(a.estado)" label size="small" style="flex-shrink:0">
            {{ estadoLabel(a.estado) }}
          </v-chip>
        </div>

        <!-- Fila 2: Meta -->
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:10px">
          <span style="font-size:12px; color:#8B5A2B; display:flex; align-items:center; gap:4px">
            <v-icon size="13">mdi-account-outline</v-icon>{{ a.autores }}
          </span>
          <span style="font-size:12px; color:#4CAF50; display:flex; align-items:center; gap:4px">
            <v-icon size="13">mdi-tag-outline</v-icon>{{ a.convocatoria }}
          </span>
          <span style="font-size:12px; color:#c62828; display:flex; align-items:center; gap:4px">
            <v-icon size="13">mdi-calendar-clock</v-icon>Deadline: {{ a.deadline }}
          </span>
        </div>

        <!-- Acción -->
        <div style="border-top:1px solid #f0e9df; padding-top:10px">
          <v-btn
            v-if="a.estado !== 'COMPLETADA'"
            color="primary"
            size="small"
            rounded="lg"
            elevation="0"
            :to="`/revisor/revision/${a.id}`"
            prepend-icon="mdi-pencil-outline"
          >
            {{ a.estado === 'EN_PROGRESO' ? 'Continuar revisión' : 'Iniciar revisión' }}
          </v-btn>
          <div v-else style="display:flex; align-items:center; gap:6px">
            <v-icon color="success" size="16">mdi-check-circle</v-icon>
            <span style="font-size:13px; color:#558b2f">Revisión enviada</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vacío -->
    <div v-if="articulosFiltrados.length === 0" style="text-align:center; padding:48px 0; color:#8B5A2B">
      <v-icon size="44" color="secondary">mdi-clipboard-text-off-outline</v-icon>
      <p style="font-size:14px; margin-top:10px">
        {{ busqueda || filtroEstado !== 'TODOS' ? 'No se encontraron artículos con estos filtros.' : 'No tienes artículos asignados.' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRevisorStore } from '@/store/revisor/index.js'

const revisorStore = useRevisorStore()
const busqueda = ref('')
const filtroEstado = ref('TODOS')

const opcionesEstado = [
  { title: 'Todos los estados', value: 'TODOS' },
  { title: 'Pendientes', value: 'PENDIENTE' },
  { title: 'En Progreso', value: 'EN_PROGRESO' },
  { title: 'Completadas', value: 'COMPLETADA' }
]

const articulosFiltrados = computed(() => {
  return revisorStore.articulosAsignados.filter(a => {
    const matchesBusqueda = !busqueda.value || 
      a.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      a.autores.toLowerCase().includes(busqueda.value.toLowerCase())
    
    const matchesEstado = filtroEstado.value === 'TODOS' || a.estado === filtroEstado.value
    
    return matchesBusqueda && matchesEstado
  })
})

onMounted(() => {
  revisorStore.cargarDashboard()
})

const ESTADOS = { PENDIENTE:'Pendiente', EN_PROGRESO:'En progreso', COMPLETADA:'Completada' }

const HEX     = { PENDIENTE:'#e65100',  EN_PROGRESO:'#546e7a',     COMPLETADA:'#558b2f' }
const CHIPS   = { PENDIENTE:'warning',  EN_PROGRESO:'info',         COMPLETADA:'success' }

function estadoLabel(e) { return ESTADOS[e] ?? e }
function hexEstado(e)   { return HEX[e]     ?? '#9e9e9e' }
function chipEstado(e)  { return CHIPS[e]   ?? 'secondary' }
</script>
