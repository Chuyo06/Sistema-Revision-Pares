<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list-item title="Rev. Pares" nav class="py-3" />

      <v-divider />

      <v-list density="compact" nav class="mt-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.label"
          :to="item.to"
        />
      </v-list>

      <template #append>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" @click="cerrarSesion" />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-app-bar elevation="1">
        <v-app-bar-title>{{ titulo }}</v-app-bar-title>
        <template #append>
          <span class="text-caption mr-4">{{ auth.usuario?.nombre }}</span>
        </template>
      </v-app-bar>

      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const drawer = ref(true)

const NAV_CONFIG = {
  autor: [
    { icon: 'mdi-view-dashboard', label: 'Dashboard', to: '/autor/dashboard' },
    { icon: 'mdi-file-document-multiple', label: 'Mis artículos', to: '/autor/articulos' },
    { icon: 'mdi-plus-circle', label: 'Enviar artículo', to: '/autor/nuevo' },
  ],
  revisor: [
    { icon: 'mdi-view-dashboard', label: 'Dashboard', to: '/revisor/dashboard' },
    { icon: 'mdi-clipboard-list', label: 'Artículos asignados', to: '/revisor/asignados' },
  ],
  editor: [
    { icon: 'mdi-view-dashboard', label: 'Dashboard', to: '/editor/dashboard' },
    { icon: 'mdi-file-document-multiple', label: 'Manuscritos', to: '/editor/manuscritos' },
  ],
  administrador: [
    { icon: 'mdi-view-dashboard', label: 'Dashboard', to: '/administrador/dashboard' },
    { icon: 'mdi-account-group', label: 'Usuarios', to: '/administrador/usuarios' },
  ],
}

const navItems = computed(() => NAV_CONFIG[auth.rol] || [])

const TITULOS = {
  'autor-dashboard': 'Dashboard',
  'autor-articulos': 'Mis Artículos',
  'autor-nuevo': 'Enviar Artículo',
  'revisor-dashboard': 'Dashboard',
  'revisor-asignados': 'Artículos Asignados',
  'revisor-revision': 'Formulario de Revisión',
  'editor-dashboard': 'Panel Editorial',
  'editor-manuscritos': 'Gestión de Manuscritos',
  'editor-asignacion': 'Asignación de Revisores',
  'admin-dashboard': 'Administración',
  'admin-usuarios': 'Gestión de Usuarios',
}

const titulo = computed(() => TITULOS[route.name] || 'Sistema de Revisión por Pares')

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>
