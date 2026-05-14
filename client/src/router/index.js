import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

// Importaciones estáticas para eager loading (Alternativa 2 para offline en dev)
import LoginPage from '@/pages/auth/LoginPage.vue'
import AppLayout from '@/components/common/AppLayout.vue'

// Autor
import AutorDashboardPage from '@/pages/autor/DashboardPage.vue'
import AutorBorradoresPage from '@/pages/autor/BorradoresPage.vue'
import AutorEditarBorradorPage from '@/pages/autor/EditarBorradorPage.vue'
import AutorArticulosPage from '@/pages/autor/ArticulosPage.vue'
import AutorNuevoArticuloPage from '@/pages/autor/NuevoArticuloPage.vue'
import AutorReenviarArticuloPage from '@/pages/autor/ReenviarArticuloPage.vue'

// Revisor
import RevisorDashboardPage from '@/pages/revisor/DashboardPage.vue'
import RevisorAsignadosPage from '@/pages/revisor/AsignadosPage.vue'
import RevisorRevisionPage from '@/pages/revisor/RevisionPage.vue'

// Editor
import EditorDashboardPage from '@/pages/editor/DashboardPage.vue'
import EditorManuscritosPage from '@/pages/editor/ManuscritosPage.vue'
import EditorAsignacionPage from '@/pages/editor/AsignacionPage.vue'
import EditorConvocatoriasPage from '@/pages/editor/ConvocatoriasPage.vue'

// Admin
import AdminDashboardPage from '@/pages/administrador/DashboardPage.vue'
import AdminUsuariosPage from '@/pages/administrador/UsuariosPage.vue'
import AdminManuscritosPage from '@/pages/administrador/ManuscritosPage.vue'
import AdminAreasPage from '@/pages/administrador/AreasPage.vue'
import AdminMonitorPage from '@/pages/administrador/MonitorPage.vue'
import AdminIAPage from '@/pages/administrador/ConfiguracionIAPage.vue'

// Perfil
import PerfilPage from '@/pages/perfil/PerfilPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { publico: true }
  },

  // ── AUTOR ──────────────────────────────────────────────────────
  {
    path: '/autor',
    component: AppLayout,
    meta: { rol: 'autor' },
    children: [
      { path: '', redirect: '/autor/dashboard' },
      { path: 'dashboard', name: 'autor-dashboard', component: AutorDashboardPage },
      { path: 'borradores', name: 'autor-borradores', component: AutorBorradoresPage },
      { path: 'borrador/:id', name: 'autor-editar-borrador', component: AutorEditarBorradorPage },
      { path: 'articulos', name: 'autor-articulos', component: AutorArticulosPage },
      { path: 'nuevo', name: 'autor-nuevo', component: AutorNuevoArticuloPage },
      { path: 'reenviar/:id', name: 'autor-reenviar', component: AutorReenviarArticuloPage },
    ]
  },

  // ── REVISOR ────────────────────────────────────────────────────
  {
    path: '/revisor',
    component: AppLayout,
    meta: { rol: 'revisor' },
    children: [
      { path: '', redirect: '/revisor/dashboard' },
      { path: 'dashboard', name: 'revisor-dashboard', component: RevisorDashboardPage },
      { path: 'asignados', name: 'revisor-asignados', component: RevisorAsignadosPage },
      { path: 'revision/:id', name: 'revisor-revision', component: RevisorRevisionPage },
    ]
  },

  // ── EDITOR ─────────────────────────────────────────────────────
  {
    path: '/editor',
    component: AppLayout,
    meta: { rol: 'editor' },
    children: [
      { path: '', redirect: '/editor/dashboard' },
      { path: 'dashboard', name: 'editor-dashboard', component: EditorDashboardPage },
      { path: 'manuscritos', name: 'editor-manuscritos', component: EditorManuscritosPage },
      { path: 'asignacion/:id', name: 'editor-asignacion', component: EditorAsignacionPage },
      { path: 'convocatorias', name: 'editor-convocatorias', component: EditorConvocatoriasPage },
    ]
  },

  // ── ADMINISTRADOR ──────────────────────────────────────────────
  {
    path: '/administrador',
    component: AppLayout,
    meta: { rol: 'administrador' },
    children: [
      { path: '', redirect: '/administrador/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardPage },
      { path: 'usuarios', name: 'admin-usuarios', component: AdminUsuariosPage },
      { path: 'manuscritos', name: 'admin-manuscritos', component: AdminManuscritosPage },
      { path: 'areas', name: 'admin-areas', component: AdminAreasPage },
      { path: 'monitor', name: 'admin-monitor', component: AdminMonitorPage },
      { path: 'ia', name: 'admin-ia', component: AdminIAPage },
    ]
  },

  // ── PERFIL GLOBAL ──────────────────────────────────────────────
  {
    path: '/perfil',
    component: AppLayout,
    children: [
      { path: '', name: 'perfil', component: PerfilPage },
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
