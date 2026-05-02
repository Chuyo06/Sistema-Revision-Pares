import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { publico: true }
  },

  // ── AUTOR ──────────────────────────────────────────────────────
  {
    path: '/autor',
    component: () => import('@/components/common/AppLayout.vue'),
    meta: { rol: 'autor' },
    children: [
      { path: '', redirect: '/autor/dashboard' },
      { path: 'dashboard', name: 'autor-dashboard', component: () => import('@/pages/autor/DashboardPage.vue') },
      { path: 'articulos', name: 'autor-articulos', component: () => import('@/pages/autor/ArticulosPage.vue') },
      { path: 'nuevo', name: 'autor-nuevo', component: () => import('@/pages/autor/NuevoArticuloPage.vue') },
    ]
  },

  // ── REVISOR ────────────────────────────────────────────────────
  {
    path: '/revisor',
    component: () => import('@/components/common/AppLayout.vue'),
    meta: { rol: 'revisor' },
    children: [
      { path: '', redirect: '/revisor/dashboard' },
      { path: 'dashboard', name: 'revisor-dashboard', component: () => import('@/pages/revisor/DashboardPage.vue') },
      { path: 'asignados', name: 'revisor-asignados', component: () => import('@/pages/revisor/AsignadosPage.vue') },
      { path: 'revision/:id', name: 'revisor-revision', component: () => import('@/pages/revisor/RevisionPage.vue') },
    ]
  },

  // ── EDITOR ─────────────────────────────────────────────────────
  {
    path: '/editor',
    component: () => import('@/components/common/AppLayout.vue'),
    meta: { rol: 'editor' },
    children: [
      { path: '', redirect: '/editor/dashboard' },
      { path: 'dashboard', name: 'editor-dashboard', component: () => import('@/pages/editor/DashboardPage.vue') },
      { path: 'manuscritos', name: 'editor-manuscritos', component: () => import('@/pages/editor/ManuscritosPage.vue') },
      { path: 'asignacion/:id', name: 'editor-asignacion', component: () => import('@/pages/editor/AsignacionPage.vue') },
      { path: 'convocatorias', name: 'editor-convocatorias', component: () => import('@/pages/editor/ConvocatoriasPage.vue') },
    ]
  },

  // ── ADMINISTRADOR ──────────────────────────────────────────────
  {
    path: '/administrador',
    component: () => import('@/components/common/AppLayout.vue'),
    meta: { rol: 'administrador' },
    children: [
      { path: '', redirect: '/administrador/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/pages/administrador/DashboardPage.vue') },
      { path: 'usuarios', name: 'admin-usuarios', component: () => import('@/pages/administrador/UsuariosPage.vue') },
      { path: 'manuscritos', name: 'admin-manuscritos', component: () => import('@/pages/administrador/ManuscritosPage.vue') },
    ]
  },

  // ── PERFIL GLOBAL ──────────────────────────────────────────────
  {
    path: '/perfil',
    component: () => import('@/components/common/AppLayout.vue'),
    children: [
      { path: '', name: 'perfil', component: () => import('@/pages/perfil/PerfilPage.vue') },
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.publico) return next()
  if (!auth.estaAutenticado) return next('/login')

  if (to.meta.rol) {
    // Si el usuario no tiene este rol en su lista de acceso, lo devolvemos
    if (!auth.roles.includes(to.meta.rol)) {
      const rolSeguro = auth.roles.includes(auth.rol) ? auth.rol : auth.roles[0]
      if (!rolSeguro || to.meta.rol === rolSeguro) {
        auth.logout()
        return next('/login')
      }
      return next(`/${rolSeguro}/dashboard`)
    }
    // Si tiene el rol pero no es el activo actualmente, lo auto-cambiamos
    if (auth.rol !== to.meta.rol) {
      auth.cambiarRol(to.meta.rol)
    }
  }

  next()
})

export default router
