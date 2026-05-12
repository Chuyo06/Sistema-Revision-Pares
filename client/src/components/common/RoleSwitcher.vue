<template>
  <div style="display:flex; align-items:center; gap:10px; width:100%">
    <v-menu v-if="rolesNavegables.length > 1" location="top start">
      <template v-slot:activator="{ props }">
        <div
          v-bind="props"
          style="cursor: pointer"
          title="Cambiar rol"
          :style="`background:${rolMeta.color}; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0`"
        >
          <v-icon color="white" size="18">{{ rolMeta.icon }}</v-icon>
        </div>
      </template>
      <v-list>
        <v-list-item
          v-for="rolOption in rolesNavegables"
          :key="rolOption"
          @click="cambiarRolUi(rolOption)"
        >
          <template v-slot:prepend>
            <v-icon :color="ROL_META[rolOption.toLowerCase()]?.color || '#8B5A2B'">
              {{ ROL_META[rolOption.toLowerCase()]?.icon || 'mdi-account' }}
            </v-icon>
          </template>
          <v-list-item-title>
            {{ ROL_META[rolOption.toLowerCase()]?.label || rolOption }}
          </v-list-item-title>
          <template v-slot:append v-if="rolOption.toLowerCase() === auth.rol.toLowerCase()">
            <v-icon color="success" size="small" class="ml-2">mdi-check-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>

    <div
      v-else
      :style="`background:${rolMeta.color}; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0`"
    >
      <v-icon color="white" size="18">{{ rolMeta.icon }}</v-icon>
    </div>

    <div style="flex:1; min-width:0">
      <div style="font-size:14px; font-weight:600; color:#1B4332; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
        {{ auth.usuario?.nombre || auth.usuario?.email?.split('@')[0] }}
      </div>
      <div style="font-size:12px; color:#8B5A2B">
        {{ rolMeta.label }}
        <v-icon v-if="auth.tieneMultiplesRoles" size="10" color="#8B5A2B">mdi-chevron-up</v-icon>
      </div>
    </div>
    <div style="display: flex; gap: 4px;">
      <v-btn icon variant="text" size="small" to="/perfil" title="Mi Perfil">
        <v-icon size="18" color="#4CAF50">mdi-account-cog-outline</v-icon>
      </v-btn>
      <v-btn icon variant="text" size="small" @click="cerrarSesion" title="Cerrar sesión">
        <v-icon size="18" color="#c62828">mdi-logout</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const auth = useAuthStore()
const router = useRouter()

const ROL_META = {
  autor:          { label:'Autor',           icon:'mdi-account-edit-outline',    color:'#546e7a' },
  revisor:        { label:'Revisor',         icon:'mdi-clipboard-check-outline', color:'#558b2f' },
  editor:         { label:'Editor',          icon:'mdi-pencil-ruler',            color:'#e65100' },
  editor_jefe:    { label:'Editor Jefe',     icon:'mdi-account-tie',             color:'#bf360c' },
  editor_seccion: { label:'Editor Sección',  icon:'mdi-account-tie-outline',     color:'#ef6c00' },
  administrador:  { label:'Administrador',   icon:'mdi-shield-account-outline',  color:'#c62828' },
}

// Sólo los roles "primarios" se navegan vía router (autor, revisor, editor, administrador).
// Los sub-roles (editor_jefe, editor_seccion) NO son rutas — modifican la vista interna.
const ROLES_PRIMARIOS = ['autor', 'revisor', 'editor', 'administrador']
const rolesNavegables = computed(() =>
  (auth.roles || []).filter(r => ROLES_PRIMARIOS.includes(r.toLowerCase()))
)

// Etiqueta más específica: si el usuario está en /editor y tiene editor_jefe/seccion, mostramos eso.
const rolMostrar = computed(() => {
  if (auth.rol === 'editor') {
    if (auth.roles?.includes('editor_seccion')) return 'editor_seccion'
    if (auth.roles?.includes('editor_jefe')) return 'editor_jefe'
  }
  return auth.rol
})

const rolMeta = computed(() => ROL_META[rolMostrar.value] || { label: rolMostrar.value, icon:'mdi-account', color:'#8B5A2B' })

async function cambiarRolUi(nuevoRol) {
  auth.cambiarRol(nuevoRol)
  await router.push(`/${nuevoRol.toLowerCase()}/dashboard`)
}

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>
