<template>
  <v-layout>
    <!-- ── Sidebar estilo X ─────────────────────────────────── -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="smAndUp"
      width="260"
      color="#fdfbf5"
      border="end"
      elevation="0"
    >
      <!-- Logo -->
      <div class="pa-5 pb-3">
        <div style="display:flex; align-items:center; gap:12px">
          <div style="background:#5d4037; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0">
            <v-icon color="white" size="20">mdi-book-open-page-variant</v-icon>
          </div>
          <div>
            <div style="font-size:15px; font-weight:700; color:#3e2723; line-height:1.2">
              Rev. por Pares
            </div>
            <div style="font-size:11px; color:#8d6e63">Sistema académico</div>
          </div>
        </div>
      </div>

      <v-divider class="mb-2" />

      <!-- Navegación (X-style: pills grandes) -->
      <v-list nav class="px-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          rounded="xl"
          active-color="primary"
          class="mb-1 nav-item"
          min-height="44"
        >
          <template #prepend>
            <v-icon size="22">{{ item.icon }}</v-icon>
          </template>
          <template #title>
            <span style="font-size:15px; font-weight:500">{{ item.label }}</span>
          </template>
        </v-list-item>
      </v-list>

      <!-- Usuario al fondo (X-style) -->
      <template #append>
        <v-divider class="mx-3 mb-2" />
        <div class="pa-4" style="display:flex; align-items:center; gap:10px">
          <div
            :style="`background:${rolMeta.color}; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0`"
          >
            <v-icon color="white" size="18">{{ rolMeta.icon }}</v-icon>
          </div>
          <div style="flex:1; min-width:0">
            <div style="font-size:14px; font-weight:600; color:#3e2723; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
              {{ auth.usuario?.nombre }}
            </div>
            <div style="font-size:12px; color:#8d6e63">{{ rolMeta.label }}</div>
          </div>
          <v-btn icon variant="text" size="small" @click="cerrarSesion" title="Cerrar sesión">
            <v-icon size="18" color="#c62828">mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- ── Contenido principal ─────────────────────────────── -->
    <v-main style="background:#f5f0e8">
      <!-- Barra mobile -->
      <div
        v-if="!smAndUp"
        style="background:#fdfbf5; border-bottom:1px solid #e8ddd0; display:flex; align-items:center; padding:10px 14px; gap:10px"
      >
        <v-btn icon variant="text" size="small" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <span style="font-size:16px; font-weight:700; color:#3e2723">{{ titulo }}</span>
      </div>

      <!-- Página -->
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/store/auth.js'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()
const { smAndUp } = useDisplay()

const drawer = ref(true)

const NAV_CONFIG = {
  autor: [
    { icon: 'mdi-home-outline',                  label: 'Inicio',          to: '/autor/dashboard' },
    { icon: 'mdi-file-document-multiple-outline', label: 'Mis artículos',  to: '/autor/articulos' },
    { icon: 'mdi-plus-circle-outline',            label: 'Enviar artículo',to: '/autor/nuevo' },
  ],
  revisor: [
    { icon: 'mdi-home-outline',        label: 'Inicio',              to: '/revisor/dashboard' },
    { icon: 'mdi-clipboard-list-outline', label: 'Artículos asignados', to: '/revisor/asignados' },
  ],
  editor: [
    { icon: 'mdi-home-outline',                   label: 'Inicio',      to: '/editor/dashboard' },
    { icon: 'mdi-file-document-multiple-outline', label: 'Manuscritos', to: '/editor/manuscritos' },
  ],
  administrador: [
    { icon: 'mdi-home-outline',           label: 'Inicio',    to: '/administrador/dashboard' },
    { icon: 'mdi-account-group-outline',  label: 'Usuarios',  to: '/administrador/usuarios' },
  ],
}

const ROL_META = {
  autor:         { label:'Autor',         icon:'mdi-account-edit-outline',    color:'#546e7a' },
  revisor:       { label:'Revisor',       icon:'mdi-clipboard-check-outline', color:'#558b2f' },
  editor:        { label:'Editor',        icon:'mdi-pencil-ruler',            color:'#e65100' },
  administrador: { label:'Administrador', icon:'mdi-shield-account-outline',  color:'#c62828' },
}

const navItems = computed(() => NAV_CONFIG[auth.rol] || [])
const rolMeta  = computed(() => ROL_META[auth.rol]  || { label: auth.rol, icon:'mdi-account', color:'#8d6e63' })

const TITULOS = {
  'autor-dashboard':    'Inicio',
  'autor-articulos':    'Mis Artículos',
  'autor-nuevo':        'Enviar Artículo',
  'revisor-dashboard':  'Inicio',
  'revisor-asignados':  'Artículos Asignados',
  'revisor-revision':   'Revisión',
  'editor-dashboard':   'Panel Editorial',
  'editor-manuscritos': 'Manuscritos',
  'editor-asignacion':  'Asignación',
  'admin-dashboard':    'Administración',
  'admin-usuarios':     'Usuarios',
}
const titulo = computed(() => TITULOS[route.name] ?? 'Rev. por Pares')

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-item:hover {
  background: rgba(93, 64, 55, 0.08) !important;
}
</style>
