<template>
  <div style="max-width:800px; padding:20px">

    <!-- Barra de acciones -->
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap">
      <v-text-field
        v-model="busqueda"
        placeholder="Buscar artículo..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        clearable
        style="max-width:260px; flex:1; min-width:160px"
      />
      <v-select
        v-model="filtroEstado"
        :items="filtros"
        item-title="label"
        item-value="value"
        density="compact"
        hide-details
        style="max-width:200px; flex:1; min-width:140px"
      />
      <v-btn color="primary" prepend-icon="mdi-plus" to="/autor/nuevo" style="flex-shrink:0">
        Nuevo
      </v-btn>
    </div>

    <!-- Lista feed de artículos -->
    <div
      v-for="m in manuscritosFiltrados"
      :key="m.id"
      style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; margin-bottom:10px; overflow:hidden; transition: 0.2s;"
      :style="(m.estado === 'ACEPTADO' || m.estado === 'RECHAZADO' || m.estado === 'REQUERIDAS_REVISIONES') ? 'cursor: pointer;' : ''"
      @click="(m.estado === 'ACEPTADO' || m.estado === 'RECHAZADO' || m.estado === 'REQUERIDAS_REVISIONES') ? abrirComentarios(m) : null"
      class="articulo-card"
    >
      <div :style="`height:5px; background:${hexEstado(m.estado)}`" />
      <div style="padding:16px">
        <!-- Fila 1: Título + chip (no se enciman) -->
        <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:6px">
          <div style="flex:1; min-width:0">
            <div style="font-size:15px; font-weight:600; color:#1B4332; word-break:break-word">
              {{ m.titulo }}
            </div>
          </div>
          <v-chip
            :color="chipEstado(m.estado)"
            label
            size="small"
            style="flex-shrink:0; margin-top:1px"
          >
            {{ estadoLabel(m.estado) }}
          </v-chip>
        </div>

        <!-- Fila 2: Subtítulo -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
          <span style="font-size:12px; color:#8B5A2B">{{ m.convocatoria }}</span>
          <span v-if="m.fechaEnvio" style="font-size:12px; color:#bda89a">Â·</span>
          <span v-if="m.fechaEnvio" style="font-size:12px; color:#8B5A2B">{{ m.fechaEnvio }}</span>
          <v-chip v-if="m.referencia" size="x-small" variant="tonal" color="secondary">
            REF: {{ m.referencia }}
          </v-chip>
        </div>

        <!-- Fila 3: Resumen -->
        <p style="font-size:13px; color:#4CAF50; margin-top:8px; margin-bottom:0;
                  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden">
          {{ m.resumen }}
        </p>
      </div>
    </div>

    <!-- Vacío -->
    <div v-if="manuscritosFiltrados.length === 0" style="text-align:center; padding:48px 0; color:#8B5A2B">
      <v-icon size="44" color="secondary">mdi-file-search-outline</v-icon>
      <p style="font-size:14px; margin-top:10px">No se encontraron artículos.</p>
    </div>

    <!-- Dialogo de comentarios -->
    <v-dialog v-model="dialogoComentarios" max-width="600">
      <v-card color="surface" rounded="xl" border>
        <div style="background:#546e7a; height:6px; border-radius:8px 8px 0 0" />
        <v-card-title class="pa-5 pb-2 text-h5 font-weight-bold" style="color:#1B4332">
          <v-icon start color="primary">mdi-comment-text-multiple-outline</v-icon>
          Comentarios de Revisión
        </v-card-title>
        <v-card-subtitle class="px-5 pb-4">
          Manuscrito: {{ articuloSeleccionado?.titulo }}
        </v-card-subtitle>
        <v-divider />

        <v-card-text class="pa-5" style="max-height: 400px; overflow-y: auto;">
          <div v-if="cargandoComentarios" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else-if="comentarios.length === 0" class="text-center py-4 text-grey">
            No hay comentarios disponibles para este artículo.
          </div>
          <div v-else>
            <div v-for="comentario in comentarios" :key="comentario.id" class="mb-4 pa-4 bg-grey-lighten-4 rounded-lg border">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="font-weight-bold" style="color:#8B5A2B">Revisor #{{ comentario.id }}</div>
                <div class="d-flex align-center" v-if="comentario.puntuacion">
                  <v-rating :model-value="comentario.puntuacion" color="amber" density="compact" size="small" readonly></v-rating>
                </div>
              </div>
              <div style="color:#1B4332; white-space: pre-wrap; font-size: 14px;">{{ comentario.comentarios }}</div>
            </div>
          </div>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn 
            v-if="articuloSeleccionado?.estado === 'REQUERIDAS_REVISIONES'" 
            color="orange-darken-3" 
            variant="flat" 
            prepend-icon="mdi-upload"
            :to="`/autor/reenviar/${articuloSeleccionado?.id}`"
          >
            Reenviar Versión Corregida
          </v-btn>
          <v-btn color="primary" variant="tonal" @click="dialogoComentarios = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAutorStore } from '@/store/autor/index.js'

const autorStore = useAutorStore()

onMounted(() => {
  autorStore.cargarMisManuscritos()
})
const busqueda = ref('')
const filtroEstado = ref('TODOS')

const dialogoComentarios = ref(false)
const cargandoComentarios = ref(false)
const comentarios = ref([])
const articuloSeleccionado = ref(null)

async function abrirComentarios(manuscrito) {
  articuloSeleccionado.value = manuscrito
  dialogoComentarios.value = true
  cargandoComentarios.value = true
  comentarios.value = await autorStore.cargarComentarios(manuscrito.id)
  cargandoComentarios.value = false
}

const filtros = [
  { label:'Todos los estados', value:'TODOS' },
  { label:'Borrador',    value:'BORRADOR' },
  { label:'En revisión', value:'EN_REVISION' },
  { label:'Aceptado',    value:'ACEPTADO' },
  { label:'Rechazado',   value:'RECHAZADO' },
]

const manuscritosFiltrados = computed(() =>
  autorStore.manuscritos.filter(m => {
    const b = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    const e = filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value
    return b && e
  })
)

const ESTADOS = { BORRADOR:'Borrador', ENVIADO:'Enviado', EN_REVISION:'En revisión', REQUERIDAS_REVISIONES:'Requiere revisiones', ACEPTADO:'Aceptado', RECHAZADO:'Rechazado' }
const HEX     = { BORRADOR:'#9e9e9e', ENVIADO:'#546e7a', EN_REVISION:'#e65100', REQUERIDAS_REVISIONES:'#ef6c00', ACEPTADO:'#558b2f', RECHAZADO:'#c62828' }
const CHIPS   = { BORRADOR:'secondary', ENVIADO:'info', EN_REVISION:'warning', REQUERIDAS_REVISIONES:'warning', ACEPTADO:'success', RECHAZADO:'error' }

function estadoLabel(e) { return ESTADOS[e] ?? e }
function hexEstado(e)   { return HEX[e]     ?? '#9e9e9e' }
function chipEstado(e)  { return CHIPS[e]   ?? 'secondary' }
</script>

<style scoped>
.articulo-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
