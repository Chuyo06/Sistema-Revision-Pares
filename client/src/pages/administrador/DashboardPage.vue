<template>
  <div>
    <!-- Banner -->
    <div
      style="background:linear-gradient(135deg,#7b1fa2 0%,#ab47bc 100%); padding:32px 28px 24px; position:relative; overflow:hidden"
    >
      <v-icon size="120" style="position:absolute; right:-16px; bottom:-20px; color:rgba(255,255,255,0.08)">
        mdi-shield-account
      </v-icon>
      <div style="color:rgba(255,255,255,0.7); font-size:12px; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Administrador</div>
      <div style="font-size:22px; font-weight:700; color:#fff; margin-bottom:4px">Panel de Administración</div>
      <div style="font-size:14px; color:rgba(255,255,255,0.75)">Gestión de usuarios del sistema</div>
      <v-btn
        color="white"
        class="mt-4"
        style="color:#7b1fa2"
        prepend-icon="mdi-account-group-outline"
        rounded="xl"
        elevation="0"
        to="/administrador/usuarios"
      >
        Gestionar usuarios
      </v-btn>
    </div>

    <!-- Cuerpo -->
    <div style="display:grid; grid-template-columns:1fr 300px; gap:20px; padding:20px; max-width:1100px">

      <!-- Feed -->
      <div>
        <div style="font-size:13px; font-weight:700; color:#8d6e63; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px">
          Distribución de roles
        </div>

        <div
          v-for="rol in rolesDistribucion"
          :key="rol.nombre"
          style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; margin-bottom:10px; overflow:hidden"
        >
          <div :style="`height:5px; background:${rol.hex}`" />
          <div style="padding:14px 16px; display:flex; align-items:center; gap:12px">
            <div
              :style="`background:${rol.hex}22; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; flex-shrink:0`"
            >
              <v-icon :color="rol.hex" size="18">{{ rol.icon }}</v-icon>
            </div>
            <div style="flex:1; min-width:0">
              <div style="font-size:14px; font-weight:600; color:#3e2723">{{ rol.nombre }}</div>
              <div style="font-size:12px; color:#8d6e63">{{ rol.cantidad }} usuario(s) registrado(s)</div>
            </div>
            <span style="font-size:24px; font-weight:700; color:#3e2723">{{ rol.cantidad }}</span>
          </div>
        </div>
      </div>

      <!-- Panel derecho -->
      <div>
        <div style="background:#fdfbf5; border:1px solid #e8ddd0; border-radius:12px; overflow:hidden">
          <div style="background:#7b1fa2; padding:10px 14px">
            <span style="font-size:13px; font-weight:600; color:#fff">Usuarios del sistema</span>
          </div>
          <div
            v-for="kpi in kpis"
            :key="kpi.label"
            style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-top:1px solid #f0e9df"
          >
            <span style="font-size:13px; color:#5d4037">{{ kpi.label }}</span>
            <span style="font-size:18px; font-weight:700; color:#3e2723">{{ kpi.valor }}</span>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-top:1px solid #f0e9df; background: #fafafa">
            <span style="font-size:13px; color:#5d4037">Total Manuscritos</span>
            <span style="font-size:18px; font-weight:700; color:#7b1fa2">{{ adminStore.metricas.totalManuscritos }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/store/administrador/index.js'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.cargarUsuarios()
})

const kpis = computed(() => [
  { label:'Total usuarios', valor: adminStore.metricas.totalUsuarios },
  { label:'Activos',        valor: adminStore.metricas.activos },
  { label:'Inactivos',      valor: adminStore.metricas.inactivos },
])

const rolesDistribucion = computed(() => [
  { nombre:'Autores',   cantidad: adminStore.metricas.autores,   icon:'mdi-account-edit-outline',    hex:'#546e7a' },
  { nombre:'Revisores', cantidad: adminStore.metricas.revisores, icon:'mdi-clipboard-check-outline', hex:'#558b2f' },
  { nombre:'Editores',  cantidad: adminStore.metricas.editores,  icon:'mdi-pencil-ruler',            hex:'#e65100' },
])
</script>
