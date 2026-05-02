<template>
  <v-layout>
    <!-- â”€â”€ Sidebar estilo X â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
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

    <!-- â”€â”€ Contenido principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
    <v-main style="background:#F6F8F6">
      <!-- Barra mobile -->
      <div
        v-if="!smAndUp"
        style="background:#FFFFFF; border-bottom:1px solid #D3E0D7; display:flex; align-items:center; padding:10px 14px; gap:10px"
      >
        <v-btn icon variant="text" size="small" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <span style="font-size:16px; font-weight:700; color:#1B4332">{{ titulo }}</span>
      </div>

      <!-- Página con key para forzar re-render -->
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/store/auth.js'
import RoleSwitcher from './RoleSwitcher.vue'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()
const { smAndUp } = useDisplay()

const drawer = ref(true)

const NAV_CONFIG = {
  autor: [
    { icon: 'mdi-home-outline',                  label: 'Inicio',          to: '/autor/dashboard' },
    { icon: 'mdi-file-document-edit-outline',     label: 'Mis borradores',  to: '/autor/borradores' },
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
    { icon: 'mdi-home-outline',           label: 'Inicio',      to: '/administrador/dashboard' },
    { icon: 'mdi-account-group-outline',  label: 'Usuarios',    to: '/administrador/usuarios' },
    { icon: 'mdi-file-document-outline',  label: 'Manuscritos', to: '/administrador/manuscritos' },
  ],
}

const navItems = computed(() => NAV_CONFIG[auth.rol] || [])

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
  'editor-dashboard':   'Panel Editorial',
  'editor-manuscritos': 'Manuscritos',
  'editor-asignacion':  'Asignación',
  'admin-dashboard':    'Administración',
  'admin-usuarios':     'Usuarios',
  'admin-manuscritos':  'Manuscritos Globales',
}
const titulo = computed(() => TITULOS[route.name] ?? 'Rev. por Pares')
</script>

<style scoped>
.nav-item:hover {
  background: rgba(93, 64, 55, 0.08) !important;
}
</style>
