<template>
  <div style="max-width:800px; padding:20px">

    <!-- Barra de acciones -->
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap">
      <v-text-field
        v-model="busqueda"
        placeholder="Buscar borrador..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        clearable
        style="max-width:260px; flex:1; min-width:160px"
      />
      <v-btn color="primary" prepend-icon="mdi-plus" to="/autor/nuevo" style="flex-shrink:0">
        Nuevo Artículo
      </v-btn>
    </div>

    <!-- Lista feed de borradores -->
    <div
      v-for="m in borradoresFiltrados"
      :key="m.id"
      style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; margin-bottom:10px; overflow:hidden; transition: 0.2s; cursor: pointer;"
      class="articulo-card"
      @click="$router.push(`/autor/borrador/${m.id}`)"
    >
      <div style="height:5px; background:#9e9e9e" />
      <div style="padding:16px">
        <!-- Fila 1: Título + chip -->
        <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:6px">
          <div style="flex:1; min-width:0">
            <div style="font-size:15px; font-weight:600; color:#1B4332; word-break:break-word">
              {{ m.titulo || '(Sin título)' }}
            </div>
          </div>
          <v-chip color="secondary" label size="small" style="flex-shrink:0; margin-top:1px">
            Borrador
          </v-chip>
          <v-btn 
            icon="mdi-delete-outline" 
            variant="text" 
            color="error" 
            size="small" 
            style="flex-shrink:0; margin-top:-4px; margin-right:-4px"
            @click.stop="abrirDialogoEliminar(m)"
          ></v-btn>
        </div>

        <!-- Fila 2: Subtítulo -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
          <span style="font-size:12px; color:#8B5A2B">{{ m.convocatoria || 'Sin convocatoria asignada' }}</span>
          <v-chip v-if="m.referencia" size="x-small" variant="tonal" color="primary">
            PDF ADJUNTO
          </v-chip>
        </div>

        <!-- Fila 3: Resumen -->
        <p style="font-size:13px; color:#4CAF50; margin-top:8px; margin-bottom:0;
                  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden">
          {{ m.resumen || 'Sin resumen...' }}
        </p>
      </div>
    </div>

    <!-- Vacío -->
    <div v-if="borradoresFiltrados.length === 0" style="text-align:center; padding:48px 0; color:#8B5A2B">
      <v-icon size="44" color="secondary">mdi-file-document-edit-outline</v-icon>
      <p style="font-size:14px; margin-top:10px">No tienes borradores guardados.</p>
    </div>

    <!-- Dialogo Confirmación Eliminación -->
    <v-dialog v-model="dialogoEliminar" max-width="400">
      <v-card rounded="xl" border>
        <div style="background:#c62828; height:6px; border-radius:8px 8px 0 0" />
        <v-card-title class="pa-5 pb-2 text-h5 font-weight-bold text-error">
          <v-icon start color="error">mdi-delete-alert</v-icon>
          Eliminar Borrador
        </v-card-title>
        <v-card-text class="px-5 text-body-2">
          ¿Estás seguro de que deseas eliminar el borrador <strong>"{{ borradorAEliminar?.titulo || '(Sin título)' }}"</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="dialogoEliminar = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" :loading="eliminando" @click="ejecutarEliminacion">Eliminar de forma permanente</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAutorStore } from '@/store/autor/index.js'

const router = useRouter()
const autorStore = useAutorStore()
const busqueda = ref('')

const dialogoEliminar = ref(false)
const borradorAEliminar = ref(null)
const eliminando = ref(false)

onMounted(() => {
  autorStore.cargarMisManuscritos()
})

const borradoresFiltrados = computed(() =>
  autorStore.manuscritos.filter(m => {
    const isBorrador = m.estado === 'BORRADOR'
    const matchBusqueda = (m.titulo || '').toLowerCase().includes(busqueda.value.toLowerCase())
    return isBorrador && matchBusqueda
  })
)

function abrirDialogoEliminar(borrador) {
  borradorAEliminar.value = borrador
  dialogoEliminar.value = true
}

async function ejecutarEliminacion() {
  if (borradorAEliminar.value) {
    eliminando.value = true
    try {
      await autorStore.eliminarBorrador(borradorAEliminar.value.id)
      dialogoEliminar.value = false
    } finally {
      eliminando.value = false
      borradorAEliminar.value = null
    }
  }
}
</script>

<style scoped>
.articulo-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: #9e9e9e !important;
}
</style>
