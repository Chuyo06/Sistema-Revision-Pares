<template>
  <v-layout>
    <!-- ── Sidebar estilo X ─────────────────────────────────── -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="smAndUp"
      width="260"
      color="#FFFFFF"
      border="end"
      elevation="0"
    >
      <!-- Logo -->
      <div class="pa-5 pb-3">
        <div style="display:flex; align-items:center; gap:12px">
          <div style="background:#4CAF50; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; flex-shrink:0">
            <v-icon color="white" size="20">mdi-book-open-page-variant</v-icon>
          </div>
          <div>
            <div style="font-size:15px; font-weight:700; color:#1B4332; line-height:1.2">
              Rev. por Pares
            </div>
            <div style="font-size:11px; color:#8B5A2B">Sistema académico</div>
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
          <RoleSwitcher />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- ── Contenido principal ────────────────────────────── -->
    <v-main style="background:#F6F8F6">
      <!-- Barra superior con notificaciones -->
      <div
        v-if="smAndUp && auth.estaAutenticado"
        style="background:#FFFFFF; border-bottom:1px solid #D3E0D7; display:flex; align-items:center; padding:8px 16px; gap:12px"
      >
        <span style="font-size:16px; font-weight:700; color:#1B4332; flex:1">{{ titulo }}</span>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="mostrarNotificaciones = true"
        >
          <v-badge
            v-if="notifStore.count > 0"
            :content="notifStore.count"
            color="error"
            floating
          >
            <v-icon color="brown-darken-1">mdi-bell-outline</v-icon>
          </v-badge>
          <v-icon v-else color="brown-darken-1">mdi-bell-outline</v-icon>
        </v-btn>
      </div>

      <!-- Barra mobile -->
      <div
        v-if="!smAndUp"
        style="background:#FFFFFF; border-bottom:1px solid #D3E0D7; display:flex; align-items:center; padding:10px 14px; gap:10px"
      >
        <v-btn icon variant="text" size="small" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <span style="font-size:16px; font-weight:700; color:#1B4332">{{ titulo }}</span>
        <v-spacer />
        <v-btn
          v-if="auth.estaAutenticado"
          icon
          variant="text"
          size="small"
          @click="mostrarNotificaciones = true"
        >
          <v-badge
            v-if="notifStore.count > 0"
            :content="notifStore.count"
            color="error"
            floating
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-bell-outline</v-icon>
        </v-btn>
      </div>

      <!-- Página con key para forzar re-render -->
      <router-view :key="$route.fullPath" />
    </v-main>

    <!-- Diálogo de notificaciones -->
    <v-dialog v-model="mostrarNotificaciones" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="pa-4 d-flex align-center">
          <v-icon class="mr-2" color="brown-darken-1">mdi-bell-outline</v-icon>
          Notificaciones
          <v-spacer />
          <v-btn
            v-if="notifStore.sinLeer.length > 0"
            variant="text"
            size="small"
            @click="notifStore.marcarTodasLeidas()"
          >
            Marcar todo leído
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-0" style="max-height:400px; overflow-y:auto">
          <template v-if="notifStore.notificaciones.length > 0">
            <v-list-item
              v-for="n in notifStore.notificaciones"
              :key="n.id"
              :class="n.leida ? '' : 'bg-blue-lighten-5'"
              @click="n.ruta && router.push(n.ruta); notifStore.marcarLeida(n.id); mostrarNotificaciones = false"
            >
              <template #prepend>
                <v-avatar
                  :color="n.tipo === 'REVISION_COMPLETADA' ? 'success' : n.tipo === 'INVITACION_RECHAZADA' ? 'error' : n.tipo === 'DECISION_EDITORIAL' ? 'warning' : 'info'"
                  size="36"
                >
                  <v-icon color="white" size="18">
                    {{ n.tipo === 'REVISION_COMPLETADA' ? 'mdi-check-circle' : n.tipo === 'INVITACION_RECHAZADA' ? 'mdi-account-cancel' : n.tipo === 'DECISION_EDITORIAL' ? 'mdi-gavel' : 'mdi-bell' }}
                  </v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-bold">{{ n.titulo }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ n.mensaje }}</v-list-item-subtitle>
              <template #append>
                <span class="text-caption text-medium-emphasis">{{ formatTime(n.timestamp) }}</span>
              </template>
            </v-list-item>
          </template>
          <div v-else class="pa-8 text-center text-medium-emphasis">
            <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-bell-sleep-outline</v-icon>
            <div>Sin notificaciones</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/store/auth.js'
import { useNotificacionesStore } from '@/store/notificaciones.js'
import { useEditorStore } from '@/store/editor/index.js'
import RoleSwitcher from './RoleSwitcher.vue'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()
const { smAndUp } = useDisplay()

const drawer = ref(true)
const notifStore = useNotificacionesStore()
const editorStore = useEditorStore()
const mostrarNotificaciones = ref(false)

onMounted(() => {
  const userId = auth.usuario?.id || auth.usuario?.id_usuario
  if (userId) {
    notifStore.cargarNotificacionesBackend(userId)
    notifStore.iniciarPolling()
  }
})

onBeforeUnmount(() => {
  notifStore.detenerPolling()
})

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = Math.floor((now - d) / 60000)
  if (diff < 1) return 'ahora'
  if (diff < 60) return `${diff}m`
  if (diff < 1440) return `${Math.floor(diff / 60)}h`
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

const NAV_CONFIG = {
  autor: [
    { icon: 'mdi-home-outline',                  label: 'Inicio',          to: '/autor/dashboard' },
    { icon: 'mdi-file-document-edit-outline',     label: 'Mis borradores',  to: '/autor/borradores' },
    { icon: 'mdi-file-document-multiple-outline', label: 'Mis artículos',  to: '/autor/articulos' },
    { icon: 'mdi-plus-circle-outline',            label: 'Enviar artículo',to: '/autor/nuevo' },
    { icon: 'mdi-account-circle-outline',         label: 'Mi Perfil',      to: '/perfil' },
  ],
  revisor: [
    { icon: 'mdi-home-outline',              label: 'Inicio',              to: '/revisor/dashboard' },
    { icon: 'mdi-clipboard-list-outline',    label: 'Artículos asignados', to: '/revisor/asignados' },
    { icon: 'mdi-account-circle-outline',    label: 'Mi Perfil',           to: '/perfil' },
  ],
  editor: [
    { icon: 'mdi-home-outline',                   label: 'Inicio',        to: '/editor/dashboard' },
    { icon: 'mdi-file-document-multiple-outline', label: 'Manuscritos',   to: '/editor/manuscritos' },
    { icon: 'mdi-calendar-star-outline',          label: 'Convocatorias', to: '/editor/convocatorias' },
    { icon: 'mdi-account-circle-outline',         label: 'Mi Perfil',      to: '/perfil' },
  ],
  administrador: [
    { icon: 'mdi-home-outline',           label: 'Inicio',      to: '/administrador/dashboard' },
    { icon: 'mdi-monitor-dashboard',      label: 'Monitor',     to: '/administrador/monitor' },
    { icon: 'mdi-account-group-outline',  label: 'Usuarios',    to: '/administrador/usuarios' },
    { icon: 'mdi-file-document-outline',  label: 'Manuscritos', to: '/administrador/manuscritos' },
    { icon: 'mdi-tag-multiple-outline',   label: 'Temáticas',   to: '/administrador/areas' },
    { icon: 'mdi-robot-outline',          label: 'Ajustes IA',  to: '/administrador/ia' },
    { icon: 'mdi-account-circle-outline', label: 'Mi Perfil',    to: '/perfil' },
  ],
}

const navItems = computed(() => {
  if (!auth.rol) return []
  let items = NAV_CONFIG[auth.rol.toLowerCase()] || []
  
  // Filtro extra para Editor: Solo Editor Jefe ve Convocatorias
  if (auth.rol.toLowerCase() === 'editor') {
    if (!editorStore.esEditorJefe) {
      items = items.filter(i => i.to !== '/editor/convocatorias')
    }
  }
  
  return items
})

const TITULOS = {
  'perfil':             'Mi Perfil',
  'autor-dashboard':    'Inicio',
  'autor-borradores':   'Mis Borradores',
  'autor-editar-borrador': 'Editar Borrador',
  'autor-articulos':    'Mis Artículos',
  'autor-nuevo':        'Enviar Artículo',
  'autor-reenviar':     'Reenviar Artículo',
  'revisor-dashboard':  'Inicio',
  'revisor-asignados':  'Artículos Asignados',
  'revisor-revision':   'Revisión',
  'editor-dashboard':    'Panel Editorial',
  'editor-manuscritos':  'Manuscritos',
  'editor-asignacion':   'Asignación',
  'editor-convocatorias':'Convocatorias',
  'admin-dashboard':    'Administración',
  'admin-usuarios':     'Usuarios',
  'admin-manuscritos':  'Manuscritos Globales',
  'admin-areas':        'Áreas Temáticas',
  'admin-monitor':      'Monitor de Sistema',
  'admin-ia':           'Ajustes de IA',
}
const titulo = computed(() => TITULOS[route.name] ?? 'Rev. por Pares')
</script>

<style scoped>
.nav-item:hover {
  background: rgba(93, 64, 55, 0.08) !important;
}
</style>
