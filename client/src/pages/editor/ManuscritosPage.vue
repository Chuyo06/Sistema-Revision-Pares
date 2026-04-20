<template>
  <v-container style="max-width:900px; padding:20px">
    <v-row align="center" class="mb-6">
      <v-col>
        <v-btn variant="text" to="/editor" prepend-icon="mdi-arrow-left">Panel de Control</v-btn>
        <h1 class="text-h4 font-weight-bold mt-2">Gestión de Manuscritos</h1>
      </v-col>
    </v-row>

    <!-- Estado de Carga -->
    <v-row v-if="editorStore.cargando && (!editorStore.manuscritos || editorStore.manuscritos.length === 0)" justify="center">
      <v-col cols="auto" class="py-12 text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4">Sincronizando con microservicios...</div>
      </v-col>
    </v-row>

    <template v-else>
      <!-- Filtros Simple -->
      <v-row class="mb-4" align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="busqueda"
            prepend-inner-icon="mdi-magnify"
            label="Buscar por título o autor"
            density="compact"
            hide-details
            variant="outlined"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filtroEstado"
            :items="filtros"
            label="Estado"
            item-title="label"
            item-value="value"
            density="compact"
            hide-details
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Lista de Manuscritos -->
      <v-row v-if="manuscritosFiltrados.length > 0">
        <v-col v-for="m in manuscritosFiltrados" :key="m.id" cols="12">
          <v-card 
            border 
            elevation="1" 
            class="mb-3 hover-elevation"
            style="background:#FFFFFF; border-radius:12px; overflow:hidden;"
          >
            <div :style="`height:6px; background:${hexEstado(m.estado)}`" />
            <v-card-item class="pa-4">
              <div class="d-flex align-start justify-space-between mb-2">
                <div>
                  <div class="text-h6 font-weight-bold text-brown-darken-4 line-height-1">
                    {{ m.titulo || 'Sin título' }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    {{ m.autores || 'Autor desconocido' }} Â· {{ m.convocatoria || 'Sin convocatoria' }}
                  </div>
                </div>
                <v-chip :color="chipEstado(m.estado)" label size="small" class="font-weight-bold">
                  {{ estadoLabel(m.estado) }}
                </v-chip>
              </div>

              <div class="d-flex align-center gap-4 mt-3">
                <v-chip size="x-small" variant="tonal" color="brown" prepend-icon="mdi-account-multiple">
                  {{ m.revisionesCompletadas || 0 }}/{{ m.revisoresAsignados || 0 }} revisiones
                </v-chip>
                <template v-if="m.alertas?.length">
                  <v-chip v-for="(alerta, i) in m.alertas" :key="i" size="x-small" color="error" variant="flat" prepend-icon="mdi-alert-circle">
                    {{ alerta }}
                  </v-chip>
                </template>
              </div>
            </v-card-item>

            <v-divider></v-divider>
            <v-card-actions class="pa-4">
              <v-btn 
                color="primary" 
                variant="flat" 
                :to="`/editor/asignacion/${m.id}`"
                prepend-icon="mdi-account-plus"
                class="text-none"
              >
                Gestionar Revisores
              </v-btn>
              <v-spacer></v-spacer>
              <template v-if="m.estado === 'EN_REVISION' && (m.revisionesCompletadas || 0) >= 2">
                <v-btn size="small" color="success" variant="tonal" class="text-none mr-2" @click="decidir(m.id, 'ACEPTADO')">Aceptar</v-btn>
                <v-btn size="small" color="error" variant="tonal" class="text-none" @click="decidir(m.id, 'RECHAZADO')">Rechazar</v-btn>
              </template>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Vacío -->
      <v-row v-else justify="center" class="py-12">
        <v-col cols="auto" class="text-center">
          <v-icon size="64" color="brown-lighten-3" class="mb-4">mdi-file-search-outline</v-icon>
          <p class="text-h6 text-brown-lighten-1">No se encontraron manuscritos</p>
          <p class="text-body-2 text-medium-emphasis">Intenta ajustar los filtros de búsqueda</p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEditorStore } from '@/store/editor/index.js'

const editorStore = useEditorStore()
const busqueda = ref('')
const filtroEstado = ref('TODOS')

const filtros = [
  { label:'Todos los estados', value:'TODOS' },
  { label:'Enviado',     value:'ENVIADO' },
  { label:'En revisión', value:'EN_REVISION' },
  { label:'Aceptado',    value:'ACEPTADO' },
  { label:'Rechazado',   value:'RECHAZADO' },
]

const manuscritosFiltrados = computed(() => {
  if (!editorStore.manuscritos) return []
  return editorStore.manuscritos.filter(m => {
    const titulo = (m.titulo || '').toLowerCase()
    const autores = (m.autores || '').toLowerCase()
    const term = (busqueda.value || '').toLowerCase()
    
    const b = titulo.includes(term) || autores.includes(term)
    const e = filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value
    return b && e
  })
})

const ESTADOS = { ENVIADO:'Enviado', EN_REVISION:'En revisión', ACEPTADO:'Aceptado', RECHAZADO:'Rechazado' }
const HEX     = { ENVIADO:'#546e7a', EN_REVISION:'#e65100', ACEPTADO:'#558b2f', RECHAZADO:'#c62828' }
const CHIPS   = { ENVIADO:'info', EN_REVISION:'warning', ACEPTADO:'success', RECHAZADO:'error' }

function estadoLabel(e) { return ESTADOS[e] ?? (e || 'Desconocido') }
function hexEstado(e)   { return HEX[e]     ?? '#9e9e9e' }
function chipEstado(e)  { return CHIPS[e]   ?? 'info' }

onMounted(() => {
  editorStore.cargarDashboardEditor()
})

function decidir(id, decision) {
  editorStore.tomarDecision(id, decision)
}
</script>

<style scoped>
.hover-elevation {
  transition: all 0.3s ease;
}
.hover-elevation:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(93, 64, 55, 0.12) !important;
}
.line-height-1 {
  line-height: 1.2;
}
</style>
