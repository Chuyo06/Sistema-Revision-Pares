<template>
  <div style="max-width:900px; padding:20px">

    <!-- Filtros -->
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap">
      <v-text-field
        v-model="busqueda"
        placeholder="Buscar manuscrito..."
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
        style="max-width:220px; flex:1; min-width:140px"
      />
    </div>

    <!-- Lista -->
    <div
      v-for="m in manuscritosFiltrados"
      :key="m.id"
      style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; margin-bottom:12px; overflow:hidden"
    >
      <div :style="`height:5px; background:${hexEstado(m.estado)}`" />
      <div style="padding:16px">

        <!-- Fila 1: Título + chip -->
        <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:6px">
          <div style="flex:1; min-width:0">
            <div style="font-size:15px; font-weight:600; color:#3e2723; word-break:break-word">
              {{ m.titulo }}
            </div>
          </div>
          <v-chip :color="chipEstado(m.estado)" label size="small" style="flex-shrink:0">
            {{ estadoLabel(m.estado) }}
          </v-chip>
        </div>

        <!-- Fila 2: Meta -->
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:8px">
          <span style="font-size:12px; color:#8d6e63">{{ m.autores }}</span>
          <span style="font-size:12px; color:#bda89a">·</span>
          <span style="font-size:12px; color:#8d6e63">{{ m.convocatoria }}</span>
          <span v-if="m.fechaEnvio" style="font-size:12px; color:#bda89a">·</span>
          <span v-if="m.fechaEnvio" style="font-size:12px; color:#8d6e63">{{ m.fechaEnvio }}</span>
        </div>

        <!-- Fila 3: Progreso + alertas -->
        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:10px">
          <span style="font-size:12px; color:#5d4037; display:flex; align-items:center; gap:4px">
            <v-icon size="13" color="secondary">mdi-account-multiple-check-outline</v-icon>
            {{ m.revisionesCompletadas }}/{{ m.revisoresAsignados }} revisiones
          </span>
          <span
            v-for="(alerta, i) in m.alertas"
            :key="i"
            style="font-size:12px; color:#c62828; display:flex; align-items:center; gap:3px"
          >
            <v-icon size="13" color="error">mdi-alert-outline</v-icon>{{ alerta }}
          </span>
        </div>

        <!-- Acciones -->
        <div style="border-top:1px solid #f0e9df; padding-top:10px; display:flex; align-items:center; gap:8px; flex-wrap:wrap">
          <v-btn
            variant="text"
            color="primary"
            size="small"
            :to="`/editor/asignacion/${m.id}`"
            prepend-icon="mdi-account-plus-outline"
          >
            Gestionar revisores
          </v-btn>
          <template v-if="m.estado === 'EN_REVISION' && m.revisionesCompletadas >= 2">
            <v-btn size="small" color="success" elevation="0" rounded="lg" @click="decidir(m.id, 'ACEPTADO')">Aceptar</v-btn>
            <v-btn size="small" color="error"   elevation="0" rounded="lg" @click="decidir(m.id, 'RECHAZADO')">Rechazar</v-btn>
          </template>
        </div>
      </div>
    </div>

    <!-- Vacío -->
    <div v-if="manuscritosFiltrados.length === 0" style="text-align:center; padding:48px 0; color:#8d6e63">
      <v-icon size="44" color="secondary">mdi-file-search-outline</v-icon>
      <p style="font-size:14px; margin-top:10px">Sin resultados.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const manuscritosFiltrados = computed(() =>
  editorStore.manuscritos.filter(m => {
    const b = m.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    const e = filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value
    return b && e
  })
)

const ESTADOS = { ENVIADO:'Enviado', EN_REVISION:'En revisión', ACEPTADO:'Aceptado', RECHAZADO:'Rechazado' }
const HEX     = { ENVIADO:'#546e7a', EN_REVISION:'#e65100', ACEPTADO:'#558b2f', RECHAZADO:'#c62828' }
const CHIPS   = { ENVIADO:'info', EN_REVISION:'warning', ACEPTADO:'success', RECHAZADO:'error' }

function estadoLabel(e) { return ESTADOS[e] ?? e }
function hexEstado(e)   { return HEX[e]     ?? '#9e9e9e' }
function chipEstado(e)  { return CHIPS[e]   ?? 'secondary' }

function decidir(id, decision) {
  editorStore.tomarDecision(id, decision)
}
</script>
