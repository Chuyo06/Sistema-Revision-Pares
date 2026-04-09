<template>
  <div>
    <!-- Banner -->
    <div
      style="background:linear-gradient(135deg,#bf360c 0%,#e65100 100%); padding:32px 28px 24px; position:relative; overflow:hidden"
    >
      <v-icon size="120" style="position:absolute; right:-16px; bottom:-20px; color:rgba(255,255,255,0.08)">
        mdi-pencil-ruler
      </v-icon>
      <div style="color:rgba(255,255,255,0.7); font-size:12px; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Editor</div>
      <div style="font-size:22px; font-weight:700; color:#fff; margin-bottom:4px">Panel Editorial</div>
      <div style="font-size:14px; color:rgba(255,255,255,0.75)">Bienvenido, {{ auth.usuario?.nombre }}</div>
      <v-btn
        color="white"
        class="mt-4"
        style="color:#bf360c"
        prepend-icon="mdi-file-document-multiple-outline"
        rounded="xl"
        elevation="0"
        to="/editor/manuscritos"
      >
        Ver manuscritos
      </v-btn>
    </div>

    <!-- Alerta -->
    <div v-if="editorStore.metricas.alertasPendientes > 0" style="margin:16px 20px 0">
      <div style="background:#fff3e0; border:1px solid #ffcc80; border-radius:10px; padding:12px 16px; display:flex; align-items:center; gap:10px">
        <v-icon color="warning" size="20">mdi-alert-outline</v-icon>
        <span style="font-size:13px; color:#e65100; flex:1">
          {{ editorStore.metricas.alertasPendientes }} manuscrito(s) requieren atención
        </span>
        <v-btn size="small" color="warning" variant="text" to="/editor/manuscritos">Revisar</v-btn>
      </div>
    </div>

    <!-- Cuerpo -->
    <div style="display:grid; grid-template-columns:1fr 300px; gap:20px; padding:20px; max-width:1100px">

      <!-- Feed -->
      <div>
        <div style="font-size:13px; font-weight:700; color:#8d6e63; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px">
          Manuscritos recientes
        </div>

        <div
          v-for="m in editorStore.manuscritos.slice(0, 6)"
          :key="m.id"
          style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; margin-bottom:10px; overflow:hidden"
        >
          <div :style="`height:5px; background:${colorEstado(m.estado)}`" />
          <div style="padding:14px 16px; display:flex; align-items:flex-start; gap:12px">
            <div
              :style="`background:${colorEstado(m.estado)}22; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px`"
            >
              <v-icon :color="colorEstado(m.estado)" size="18">mdi-file-document-outline</v-icon>
            </div>
            <div style="flex:1; min-width:0">
              <div style="font-size:14px; font-weight:600; color:#3e2723; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                {{ m.titulo }}
              </div>
              <div style="font-size:12px; color:#8d6e63; margin-top:2px">
                {{ m.convocatoria }} · {{ m.revisionesCompletadas }}/{{ m.revisoresAsignados }} revisiones
              </div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0">
              <v-chip :color="chipColor(m.estado)" label size="x-small">{{ estadoLabel(m.estado) }}</v-chip>
              <v-btn size="x-small" variant="text" color="primary" :to="`/editor/asignacion/${m.id}`">
                Ver
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho -->
      <div>
        <div style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; overflow:hidden">
          <div style="background:#e65100; padding:10px 14px">
            <span style="font-size:13px; font-weight:600; color:#fff">Resumen editorial</span>
          </div>
          <div
            v-for="stat in stats"
            :key="stat.label"
            style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-top:1px solid #f0e9df"
          >
            <span style="font-size:13px; color:#5d4037">{{ stat.label }}</span>
            <span style="font-size:18px; font-weight:700; color:#3e2723">{{ stat.valor }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useEditorStore } from '@/store/editor/index.js'

const auth = useAuthStore()
const editorStore = useEditorStore()

const stats = computed(() => [
  { label:'Total',          valor: editorStore.metricas.totalManuscritos },
  { label:'En revisión',    valor: editorStore.metricas.enRevision },
  { label:'Aceptados',      valor: editorStore.metricas.aceptados },
  { label:'Tasa aceptación',valor: editorStore.metricas.tasaAceptacion + '%' },
])

const ESTADOS  = { ENVIADO:'Enviado', EN_REVISION:'En revisión', ACEPTADO:'Aceptado', RECHAZADO:'Rechazado' }
const COLORES  = { ENVIADO:'#546e7a', EN_REVISION:'#e65100', ACEPTADO:'#558b2f', RECHAZADO:'#c62828' }
const CHIP_COL = { ENVIADO:'info', EN_REVISION:'warning', ACEPTADO:'success', RECHAZADO:'error' }

function estadoLabel(e) { return ESTADOS[e] ?? e }
function colorEstado(e) { return COLORES[e]  ?? '#9e9e9e' }
function chipColor(e)   { return CHIP_COL[e] ?? 'secondary' }
</script>
