<template>
  <div>
    <!-- ── Banner estilo Classroom ──────────────────────────── -->
    <div
      style="background:linear-gradient(135deg,#5d4037 0%,#8d6e63 100%); padding:32px 28px 24px; position:relative; overflow:hidden"
    >
      <v-icon
        size="120"
        style="position:absolute; right:-16px; bottom:-20px; color:rgba(255,255,255,0.08)"
      >mdi-account-edit</v-icon>

      <div style="color:rgba(255,255,255,0.7); font-size:12px; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">
        Autor
      </div>
      <div style="font-size:22px; font-weight:700; color:#fff; margin-bottom:4px">
        Bienvenido, {{ auth.usuario?.nombre }}
      </div>
      <div style="font-size:14px; color:rgba(255,255,255,0.75)">
        Gestiona tus manuscritos y sigue el estado de tus envíos
      </div>

      <!-- Acción principal estilo Classroom -->
      <v-btn
        color="white"
        class="mt-4"
        style="color:#5d4037"
        prepend-icon="mdi-plus"
        rounded="xl"
        elevation="0"
        to="/autor/nuevo"
      >
        Enviar artículo
      </v-btn>
    </div>

    <!-- ── Cuerpo: feed + panel derecho ─────────────────────── -->
    <div style="display:grid; grid-template-columns:1fr 300px; gap:20px; padding:20px 20px; max-width:1100px">

      <!-- Columna principal (feed) -->
      <div>
        <!-- Barra de "compose" estilo X → artículos recientes -->
        <div
          style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; padding:14px 16px; margin-bottom:14px; display:flex; align-items:center; gap:12px"
        >
          <v-icon color="secondary" size="20">mdi-file-document-outline</v-icon>
          <span style="font-size:14px; color:#8d6e63; flex:1">Artículos recientes</span>
          <v-btn size="small" variant="text" color="primary" to="/autor/articulos">Ver todos</v-btn>
        </div>

        <!-- Items del feed (estilo assignment de Classroom) -->
        <div
          v-for="m in autorStore.manuscritos.slice(0, 5)"
          :key="m.id"
          style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; margin-bottom:10px; overflow:hidden"
        >
          <!-- Franja de color (Classroom) -->
          <div :style="`height:5px; background:${colorEstado(m.estado)}`" />
          <div style="padding:14px 16px; display:flex; align-items:flex-start; gap:12px">
            <!-- Icono de estado -->
            <div
              :style="`background:${colorEstado(m.estado)}22; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px`"
            >
              <v-icon :color="colorEstado(m.estado)" size="18">{{ iconEstado(m.estado) }}</v-icon>
            </div>
            <!-- Contenido -->
            <div style="flex:1; min-width:0">
              <div style="font-size:14px; font-weight:600; color:#3e2723; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                {{ m.titulo }}
              </div>
              <div style="font-size:12px; color:#8d6e63; margin-top:2px">
                {{ m.convocatoria }}<span v-if="m.fechaEnvio"> · {{ m.fechaEnvio }}</span>
              </div>
            </div>
            <!-- Chip estado -->
            <v-chip
              :color="chipColor(m.estado)"
              label
              size="x-small"
              style="flex-shrink:0; margin-top:2px"
            >
              {{ estadoLabel(m.estado) }}
            </v-chip>
          </div>
        </div>

        <div v-if="autorStore.manuscritos.length === 0" style="text-align:center; padding:40px 0; color:#8d6e63">
          <v-icon size="40" color="secondary">mdi-file-outline</v-icon>
          <p style="font-size:14px; margin-top:8px">Aún no has enviado ningún artículo.</p>
          <v-btn color="primary" to="/autor/nuevo" class="mt-2">Enviar primer artículo</v-btn>
        </div>
      </div>

      <!-- Panel derecho (estilo X "What's happening") -->
      <div>
        <!-- Stats -->
        <div style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; overflow:hidden; margin-bottom:14px">
          <div style="background:#5d4037; padding:10px 14px">
            <span style="font-size:13px; font-weight:600; color:#fff">Mis estadísticas</span>
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

        <!-- Convocatorias abiertas -->
        <div style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; overflow:hidden">
          <div style="background:#8d6e63; padding:10px 14px">
            <span style="font-size:13px; font-weight:600; color:#fff">Convocatorias abiertas</span>
          </div>
          <div
            v-for="c in convocatoriasAbiertas"
            :key="c.id"
            style="padding:10px 14px; border-top:1px solid #f0e9df"
          >
            <div style="font-size:13px; font-weight:600; color:#3e2723">{{ c.nombre }}</div>
            <div style="font-size:11px; color:#c62828; margin-top:2px">
              <v-icon size="11">mdi-calendar-clock</v-icon> {{ c.deadline }}
            </div>
          </div>
          <div v-if="convocatoriasAbiertas.length === 0" style="padding:12px 14px; font-size:13px; color:#8d6e63">
            Sin convocatorias abiertas
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useAutorStore } from '@/store/autor/index.js'

const auth = useAuthStore()
const autorStore = useAutorStore()

onMounted(() => {
  autorStore.cargarMisManuscritos()
})

const convocatoriasAbiertas = computed(() => autorStore.convocatorias.filter(c => c.estado === 'ABIERTA'))

const stats = computed(() => [
  { label:'Enviados',    valor: autorStore.manuscritos.filter(m => m.estado !== 'BORRADOR').length },
  { label:'En revisión', valor: autorStore.manuscritos.filter(m => m.estado === 'EN_REVISION').length },
  { label:'Aceptados',   valor: autorStore.manuscritos.filter(m => m.estado === 'ACEPTADO').length },
  { label:'Borradores',  valor: autorStore.manuscritos.filter(m => m.estado === 'BORRADOR').length },
])

const ESTADOS = { BORRADOR:'Borrador', ENVIADO:'Enviado', EN_REVISION:'En revisión', ACEPTADO:'Aceptado', RECHAZADO:'Rechazado' }
const COLORES  = { BORRADOR:'#9e9e9e', ENVIADO:'#546e7a', EN_REVISION:'#e65100', ACEPTADO:'#558b2f', RECHAZADO:'#c62828' }
const CHIPS    = { BORRADOR:'secondary', ENVIADO:'info', EN_REVISION:'warning', ACEPTADO:'success', RECHAZADO:'error' }
const ICONOS   = { BORRADOR:'mdi-pencil-outline', ENVIADO:'mdi-send', EN_REVISION:'mdi-clock-outline', ACEPTADO:'mdi-check-circle-outline', RECHAZADO:'mdi-close-circle-outline' }

function estadoLabel(e) { return ESTADOS[e] ?? e }
function colorEstado(e) { return COLORES[e]  ?? '#9e9e9e' }
function chipColor(e)   { return CHIPS[e]    ?? 'secondary' }
function iconEstado(e)  { return ICONOS[e]   ?? 'mdi-file-outline' }
</script>
