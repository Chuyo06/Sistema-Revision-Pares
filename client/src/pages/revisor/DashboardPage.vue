<template>
  <div>
    <!-- Banner -->
    <div
      style="background:linear-gradient(135deg,#33691e 0%,#558b2f 100%); padding:32px 28px 24px; position:relative; overflow:hidden"
    >
      <v-icon size="120" style="position:absolute; right:-16px; bottom:-20px; color:rgba(255,255,255,0.08)">
        mdi-clipboard-check
      </v-icon>
      <div style="color:rgba(255,255,255,0.7); font-size:12px; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Revisor</div>
      <div style="font-size:22px; font-weight:700; color:#fff; margin-bottom:4px">
        Bienvenido, {{ auth.usuario?.nombre }}
      </div>
      <div style="font-size:14px; color:rgba(255,255,255,0.75)">
        <span v-if="pendientes > 0">Tienes <strong>{{ pendientes }}</strong> revisión(es) pendiente(s)</span>
        <span v-else>Estás al día con tus revisiones</span>
      </div>

      <v-btn
        color="white"
        class="mt-4"
        style="color:#33691e"
        prepend-icon="mdi-clipboard-list-outline"
        rounded="xl"
        elevation="0"
        to="/revisor/asignados"
      >
        Ver asignados
      </v-btn>
    </div>

    <!-- Cuerpo -->
    <div style="display:grid; grid-template-columns:1fr 300px; gap:20px; padding:20px; max-width:1100px">

      <!-- Feed izquierdo -->
      <div>
        <!-- Pendientes -->
        <div style="font-size:13px; font-weight:700; color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px">
          Pendientes de revisión
        </div>

        <div
          v-for="a in pendientesLista"
          :key="a.id"
          style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; margin-bottom:10px; overflow:hidden;"
          :style="a.estado !== 'PENDIENTE' ? 'cursor:pointer' : ''"
          @click="a.estado !== 'PENDIENTE' ? $router.push(`/revisor/revision/${a.id}`) : null"
        >
          <div :style="`height:5px; background:${a.estado === 'PENDIENTE' ? '#e65100' : '#546e7a'}`" />
          <div style="padding:14px 16px; display:flex; align-items:flex-start; gap:12px">
            <div :style="`background:${a.estado === 'PENDIENTE' ? '#e6510022' : '#546e7a22'}; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px`"
            >
              <v-icon :color="a.estado === 'PENDIENTE' ? '#e65100' : '#546e7a'" size="18">{{ a.estado === 'PENDIENTE' ? 'mdi-clock-outline' : 'mdi-pencil-outline' }}</v-icon>
            </div>
            <div style="flex:1; min-width:0">
              <div style="font-size:14px; font-weight:600; color:#1B4332; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                {{ a.titulo }}
              </div>
              <div style="font-size:12px; color:#8B5A2B; margin-top:2px">{{ a.convocatoria }}</div>
              <div v-if="a.estado === 'PENDIENTE'" style="font-size:11px; color:#e65100; margin-top:2px; font-weight:600">
                <v-icon size="11">mdi-alert-circle-outline</v-icon> Invitación pendiente
              </div>
              <div v-else style="font-size:11px; color:#c62828; margin-top:2px">
                <v-icon size="11">mdi-calendar-clock</v-icon> Deadline: {{ a.deadline }}
              </div>
            </div>
            
            <div style="display:flex; gap:6px">
              <template v-if="a.estado === 'PENDIENTE'">
                <v-btn size="x-small" color="success" rounded="lg" elevation="0" @click.stop="aceptarYRevisar(a.id)">
                  Aceptar
                </v-btn>
                <v-btn size="x-small" color="error" variant="outlined" rounded="lg" @click.stop="revisorStore.responderInvitacion(a.id, false)">
                  Declinar
                </v-btn>
              </template>
              <v-btn v-else size="small" color="primary" rounded="lg" elevation="0">
                Revisar
              </v-btn>
            </div>
          </div>
        </div>

        <div v-if="pendientesLista.length === 0" style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; padding:20px 16px; text-align:center; margin-bottom:14px">
          <v-icon color="success" size="28">mdi-check-circle</v-icon>
          <p style="font-size:13px; color:#558b2f; margin-top:6px">Sin revisiones pendientes</p>
        </div>

        <!-- Completadas -->
        <div style="font-size:13px; font-weight:700; color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em; margin:16px 0 10px">
          Revisiones completadas
        </div>

        <div
          v-for="a in completadas"
          :key="a.id"
          style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; margin-bottom:10px; overflow:hidden"
        >
          <div style="height:5px; background:#558b2f" />
          <div style="padding:12px 16px; display:flex; align-items:center; gap:12px">
            <div style="background:#558b2f22; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; flex-shrink:0">
              <v-icon color="#558b2f" size="16">mdi-check</v-icon>
            </div>
            <div style="flex:1; min-width:0">
              <div style="font-size:13px; font-weight:600; color:#1B4332; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                {{ a.titulo }}
              </div>
              <div style="font-size:12px; color:#8B5A2B">{{ a.convocatoria }}</div>
            </div>
            <v-chip color="success" label size="x-small">Enviada</v-chip>
          </div>
        </div>

        <div v-if="completadas.length === 0" style="font-size:13px; color:#8B5A2B; padding:8px 0">
          Ninguna completada aún.
        </div>
      </div>

      <!-- Panel derecho -->
      <div>
        <div style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; overflow:hidden">
          <div style="background:#558b2f; padding:10px 14px">
            <span style="font-size:13px; font-weight:600; color:#fff">Mis estadísticas</span>
          </div>
          <div
            v-for="stat in stats"
            :key="stat.label"
            style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-top:1px solid #f0e9df"
          >
            <span style="font-size:13px; color:#4CAF50">{{ stat.label }}</span>
            <span style="font-size:18px; font-weight:700; color:#1B4332">{{ stat.valor }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'
import { useRevisorStore } from '@/store/revisor/index.js'

const router = useRouter()
const auth = useAuthStore()
const revisorStore = useRevisorStore()

onMounted(() => {
  revisorStore.cargarDashboard()
})

async function aceptarYRevisar(id) {
  const exito = await revisorStore.responderInvitacion(id, true)
  if (exito) {
    router.push(`/revisor/revision/${id}`)
  }
}

const pendientes      = computed(() => revisorStore.articulosAsignados.filter(a => a.estado !== 'COMPLETADA' && a.estado !== 'DECLINADO').length)
const pendientesLista = computed(() => revisorStore.articulosAsignados.filter(a => a.estado === 'PENDIENTE' || a.estado === 'EN_PROGRESO'))
const completadas     = computed(() => revisorStore.articulosAsignados.filter(a => a.estado === 'COMPLETADA'))

const stats = computed(() => [
  { label:'Asignados',   valor: revisorStore.articulosAsignados.length },
  { label:'Pendientes',  valor: pendientes.value },
  { label:'En progreso', valor: revisorStore.articulosAsignados.filter(a => a.estado === 'EN_PROGRESO').length },
  { label:'Completadas', valor: completadas.value.length },
])
</script>
