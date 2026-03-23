import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('administrador', () => {
  const usuarios = ref([
    { id: 1, nombre: 'Ana García', email: 'autor@demo.com', rol: 'autor', estado: 'activo', fechaRegistro: '2025-10-01', manuscritos: 4 },
    { id: 2, nombre: 'Carlos López', email: 'revisor@demo.com', rol: 'revisor', estado: 'activo', fechaRegistro: '2025-09-15', manuscritos: 0 },
    { id: 3, nombre: 'Dr. Martínez', email: 'editor@demo.com', rol: 'editor', estado: 'activo', fechaRegistro: '2025-08-01', manuscritos: 0 },
    { id: 4, nombre: 'Admin Sistema', email: 'admin@demo.com', rol: 'administrador', estado: 'activo', fechaRegistro: '2025-07-01', manuscritos: 0 },
    { id: 5, nombre: 'Dra. María Fernández', email: 'mfernandez@uni.es', rol: 'revisor', estado: 'activo', fechaRegistro: '2025-10-10', manuscritos: 0 },
    { id: 6, nombre: 'Prof. Laura Sánchez', email: 'lsanchez@tech.edu', rol: 'revisor', estado: 'inactivo', fechaRegistro: '2025-11-05', manuscritos: 0 },
    { id: 7, nombre: 'Roberto Díaz', email: 'rdiaz@research.org', rol: 'autor', estado: 'activo', fechaRegistro: '2025-12-01', manuscritos: 2 },
  ])

  const configuracionIA = ref({
    modeloMatching: 'claude-sonnet-4-6',
    modeloAnalisis: 'claude-sonnet-4-6',
    umbralConflictoInteres: 0.85,
    umbralPlagio: 0.75,
    asistenciaCalidadActiva: true,
    analisisEticaActivo: true,
    generacionCartasActiva: true,
  })

  const metricas = computed(() => ({
    totalUsuarios: usuarios.value.length,
    autores: usuarios.value.filter(u => u.rol === 'autor').length,
    revisores: usuarios.value.filter(u => u.rol === 'revisor').length,
    editores: usuarios.value.filter(u => u.rol === 'editor').length,
    activos: usuarios.value.filter(u => u.estado === 'activo').length,
    inactivos: usuarios.value.filter(u => u.estado === 'inactivo').length,
  }))

  function toggleEstadoUsuario(id) {
    const usuario = usuarios.value.find(u => u.id === id)
    if (usuario) {
      usuario.estado = usuario.estado === 'activo' ? 'inactivo' : 'activo'
    }
  }

  function agregarUsuario(datos) {
    usuarios.value.push({
      id: usuarios.value.length + 1,
      ...datos,
      estado: 'activo',
      fechaRegistro: new Date().toISOString().split('T')[0],
      manuscritos: 0,
    })
  }

  return { usuarios, configuracionIA, metricas, toggleEstadoUsuario, agregarUsuario }
})
