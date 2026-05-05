<template>
  <v-container style="max-width:900px; padding:20px">
    <v-row align="center" class="mb-6">
      <v-col>
        <v-btn variant="text" to="/editor" prepend-icon="mdi-arrow-left">Panel de Control</v-btn>
        <h1 class="text-h4 font-weight-bold mt-2">
          {{ editorStore.esEditorJefe ? 'Gestión Editorial (Jefe)' : editorStore.esEditorSeccion ? 'Mis Manuscritos Asignados' : 'Gestión de Manuscritos' }}
        </h1>
        <p v-if="editorStore.esEditorSeccion" class="text-body-2 text-medium-emphasis mt-1">
          Solo se muestran los manuscritos que el editor jefe te asignó.
        </p>
      </v-col>
    </v-row>

    <!-- Estado de Carga -->
    <v-row v-if="editorStore.cargando && (!editorStore.manuscritos || editorStore.manuscritos.length === 0)" justify="center">
      <v-col cols="auto" class="py-12 text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4">Sincronizando con microservicios...</div>
      </v-col>
    </v-row>

    <template v-else>
      <!-- Filtros -->
      <v-row class="mb-2" align="center" dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="busqueda"
            prepend-inner-icon="mdi-magnify"
            label="Buscar por título o autor"
            density="compact"
            hide-details
            variant="outlined"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="filtroEstado"
            :items="filtros"
            label="Estado"
            item-title="label"
            item-value="value"
            density="compact"
            hide-details
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="5">
          <v-select
            v-model="editorStore.filtros.convocatoria"
            :items="convocatoriaOpciones"
            label="Convocatoria"
            density="compact"
            hide-details
            variant="outlined"
          />
        </v-col>
      </v-row>
      <v-row class="mb-4" align="center" dense>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="editorStore.filtros.desde"
            type="date"
            label="Desde"
            density="compact"
            hide-details
            variant="outlined"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="editorStore.filtros.hasta"
            type="date"
            label="Hasta"
            density="compact"
            hide-details
            variant="outlined"
            clearable
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-center justify-end gap-2">
          <v-switch
            v-model="agruparPorConvocatoria"
            color="primary"
            density="compact"
            hide-details
            label="Agrupar por convocatoria"
          />
          <v-btn variant="tonal" color="brown" prepend-icon="mdi-download" @click="exportarCSV">
            Exportar CSV
          </v-btn>
        </v-col>
      </v-row>

      <!-- Lista (plana o agrupada por convocatoria) -->
      <template v-if="manuscritosVisibles.length > 0">
        <div v-for="grupo in gruposParaMostrar" :key="grupo.nombre || 'todos'">
          <!-- Encabezado de grupo (solo si está agrupado) -->
          <div v-if="grupo.nombre" class="d-flex align-center mb-2 mt-4">
            <v-icon color="brown" class="mr-2">mdi-calendar-star</v-icon>
            <span class="text-h6 font-weight-bold" style="color:#1B4332">{{ grupo.nombre }}</span>
            <v-chip size="x-small" variant="tonal" color="brown" class="ml-2">{{ grupo.items.length }}</v-chip>
          </div>

          <v-row>
            <v-col v-for="m in paginar(grupo.items)" :key="m.id" cols="12">
              <!-- ... card content ... -->
              <v-card
                border
                elevation="1"
                class="mb-3 hover-elevation"
                style="background:#FFFFFF; border-radius:12px; overflow:hidden;"
              >
                <!-- (Keep existing card content exactly as is) -->
                <div :style="`height:6px; background:${hexEstado(m.estado)}`" />
                <v-card-item class="pa-4">
                  <div class="d-flex align-start justify-space-between mb-2">
                    <div>
                      <div class="text-h6 font-weight-bold text-brown-darken-4 line-height-1">
                        {{ m.titulo || 'Sin título' }}
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        {{ m.autores || 'Autor desconocido' }} · {{ m.convocatoria || 'Sin convocatoria' }}
                      </div>
                    </div>
                    <v-chip :color="chipEstado(m.estado)" label size="small" class="font-weight-bold">
                      {{ estadoLabel(m.estado) }}
                    </v-chip>
                  </div>

                  <div class="d-flex align-center gap-4 mt-3">
                    <v-chip size="x-small" variant="tonal" color="brown" prepend-icon="mdi-account-multiple">
                      {{ m.revisionesCompletadas || 0 }}/{{ m.revisoresAsignados || 0 }} revisiones
                    </v-chip>
                    <template v-if="m.alertas?.length">
                      <v-chip v-for="(alerta, i) in m.alertas" :key="i" size="x-small" color="error" variant="flat" prepend-icon="mdi-alert-circle">
                        {{ alerta }}
                      </v-chip>
                    </template>
                  </div>

                  <div v-if="(m.revisoresAsignados || 0) > 0" class="mt-3">
                    <div class="d-flex justify-space-between text-caption text-medium-emphasis mb-1">
                      <span>Progreso de revisión</span>
                      <span>{{ Math.round(((m.revisionesCompletadas || 0) / m.revisoresAsignados) * 100) }}%</span>
                    </div>
                    <v-progress-linear
                      :model-value="((m.revisionesCompletadas || 0) / m.revisoresAsignados) * 100"
                      color="success"
                      bg-color="brown-lighten-5"
                      height="6"
                      rounded
                    />
                  </div>
                </v-card-item>

                <v-divider></v-divider>
                <v-card-actions class="pa-4 flex-wrap">
                  <v-btn
                    variant="text"
                    color="brown-darken-2"
                    prepend-icon="mdi-file-pdf-box"
                    class="text-none mr-1"
                    @click="abrirPdf(m)"
                  >
                    Ver PDF
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    :to="`/editor/asignacion/${m.id}`"
                    prepend-icon="mdi-account-plus"
                    class="text-none"
                  >
                    Gestionar Revisores
                  </v-btn>
                  <v-btn
                    v-if="editorStore.esEditorJefe"
                    size="small"
                    color="brown"
                    variant="tonal"
                    prepend-icon="mdi-account-tie-outline"
                    class="text-none ml-2"
                    @click="abrirDialogAsignarEditor(m)"
                  >
                    {{ m.editorSeccionId ? 'Reasignar editor sección' : 'Asignar editor sección' }}
                  </v-btn>
                  <v-spacer></v-spacer>
                  <template v-if="editorStore.esEditorJefe && m.estado === 'EN_REVISION' && (m.revisionesCompletadas || 0) >= 2">
                    <v-btn size="small" color="success" variant="tonal" class="text-none mr-2" @click="decidir(m.id, 'ACEPTADO')">Aceptar</v-btn>
                    <v-btn size="small" color="warning" variant="tonal" class="text-none mr-2" @click="decidir(m.id, 'EN_REVISION')">Pedir revisiones</v-btn>
                    <v-btn size="small" color="error" variant="tonal" class="text-none" @click="decidir(m.id, 'RECHAZADO')">Rechazar</v-btn>
                  </template>
                  <v-chip
                    v-else-if="editorStore.esEditorSeccion"
                    size="small"
                    color="info"
                    variant="tonal"
                    prepend-icon="mdi-information-outline"
                  >
                    La decisión final la toma el editor jefe
                  </v-chip>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Paginación -->
        <v-pagination
          v-if="!agruparPorConvocatoria"
          v-model="pagina"
          :length="Math.ceil(manuscritosVisibles.length / itemsPorPagina)"
          rounded="lg"
          class="mt-4"
        ></v-pagination>
      </template>

      <!-- Vacío -->
      <v-row v-else justify="center" class="py-12">
        <v-col cols="auto" class="text-center">
          <v-icon size="64" color="brown-lighten-3" class="mb-4">mdi-file-search-outline</v-icon>
          <p class="text-h6 text-brown-lighten-1">
            {{ editorStore.esEditorSeccion ? 'Aún no tienes manuscritos asignados' : 'No se encontraron manuscritos' }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            {{ editorStore.esEditorSeccion
              ? 'Cuando el editor jefe te asigne un manuscrito aparecerá aquí.'
              : 'Intenta ajustar los filtros de búsqueda' }}
          </p>
        </v-col>
      </v-row>
    </template>

    <!-- Visor PDF -->
    <PdfViewer
      v-model="dialogPdf"
      :titulo="manuscritoPdf?.titulo"
      :referencia="manuscritoPdf?.referencia"
      :url-pdf="manuscritoPdf?.referencia ? `/api/manuscritos/download/${manuscritoPdf.referencia}` : ''"
      :contenido="manuscritoPdf?.contenido || manuscritoPdf?.resumen"
    />

    <!-- Diálogo: asignar editor de sección (solo editor jefe) -->
    <v-dialog v-model="dialogAsignar" max-width="480">
      <v-card v-if="manuscritoSeleccionado">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="brown">mdi-account-tie-outline</v-icon>
          Asignar editor de sección
        </v-card-title>
        <v-card-text>
          <div class="text-body-2 mb-3">
            <strong>{{ manuscritoSeleccionado.titulo }}</strong>
          </div>
          <v-select
            v-model="editorSeccionElegido"
            :items="editorStore.editoresSeccion"
            item-title="nombre"
            item-value="id"
            label="Selecciona editor de sección"
            density="comfortable"
            variant="outlined"
            no-data-text="No hay editores de sección disponibles"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogAsignar = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!editorSeccionElegido"
            @click="confirmarAsignarEditor"
          >
            Asignar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEditorStore } from '@/store/editor/index.js'
import { useConvocatoriasStore } from '@/store/convocatorias.js'
import PdfViewer from '@/components/common/PdfViewer.vue'

const editorStore = useEditorStore()
const convStore = useConvocatoriasStore()
const busqueda = ref('')
const filtroEstado = ref('TODOS')
const agruparPorConvocatoria = ref(false)
const dialogAsignar = ref(false)
const manuscritoSeleccionado = ref(null)
const editorSeccionElegido = ref(null)
const dialogPdf = ref(false)
const manuscritoPdf = ref(null)

// Paginación
const pagina = ref(1)
const itemsPorPagina = 6

function paginar(items) {
  if (agruparPorConvocatoria.value) return items // No paginar dentro de grupos
  const inicio = (pagina.value - 1) * itemsPorPagina
  return items.slice(inicio, inicio + itemsPorPagina)
}

function abrirPdf(m) {
  manuscritoPdf.value = m
  dialogPdf.value = true
}

function abrirDialogAsignarEditor(m) {
  manuscritoSeleccionado.value = m
  editorSeccionElegido.value = m.editorSeccionId || null
  dialogAsignar.value = true
}

async function confirmarAsignarEditor() {
  await editorStore.asignarEditorSeccion(manuscritoSeleccionado.value.id, editorSeccionElegido.value)
  dialogAsignar.value = false
  manuscritoSeleccionado.value = null
}

const filtros = [
  { label:'Todos los estados', value:'TODOS' },
  { label:'Enviado',     value:'ENVIADO' },
  { label:'En revisión', value:'EN_REVISION' },
  { label:'Aceptado',    value:'ACEPTADO' },
  { label:'Rechazado',   value:'RECHAZADO' },
]

// Opciones del filtro de convocatoria: 'TODAS' + las del store global.
const convocatoriaOpciones = computed(() => [
  { title: 'Todas las convocatorias', value: 'TODAS' },
  ...convStore.convocatorias.map(c => ({ title: c.nombre, value: c.nombre })),
])

// Aplica búsqueda + estado sobre los ya filtrados por convocatoria/fecha del store.
const manuscritosVisibles = computed(() => {
  return (editorStore.manuscritosFiltrados || []).filter(m => {
    const titulo = (m.titulo || '').toLowerCase()
    const autores = (m.autores || '').toLowerCase()
    const term = (busqueda.value || '').toLowerCase()
    const b = titulo.includes(term) || autores.includes(term)
    const e = filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value
    return b && e
  })
})

// Agrupa por convocatoria si está activo el toggle. Si no, un solo grupo sin nombre.
const gruposParaMostrar = computed(() => {
  if (!agruparPorConvocatoria.value) {
    return [{ nombre: '', items: manuscritosVisibles.value }]
  }
  const mapa = new Map()
  for (const m of manuscritosVisibles.value) {
    const key = m.convocatoria || 'Sin convocatoria'
    if (!mapa.has(key)) mapa.set(key, [])
    mapa.get(key).push(m)
  }
  return [...mapa.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([nombre, items]) => ({ nombre, items }))
})

// Exportación a CSV de la lista actualmente visible.
function exportarCSV() {
  const rows = manuscritosVisibles.value
  if (rows.length === 0) return

  const headers = ['ID', 'Referencia', 'Título', 'Autores', 'Convocatoria', 'Estado', 'Revisores asignados', 'Revisiones completadas', 'Fecha envío']
  const escape = v => {
    const s = String(v ?? '')
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const m of rows) {
    lines.push([
      m.id,
      m.referencia || '',
      m.titulo || '',
      m.autores || '',
      m.convocatoria || '',
      m.estado || '',
      m.revisoresAsignados || 0,
      m.revisionesCompletadas || 0,
      (m.fechaEnvio || m.fechaSubida || '').split('T')[0],
    ].map(escape).join(','))
  }
  const csv = '\ufeff' + lines.join('\n') // BOM para que Excel lea acentos
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `manuscritos_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const ESTADOS = { ENVIADO:'Enviado', EN_REVISION:'En revisión', ACEPTADO:'Aceptado', RECHAZADO:'Rechazado' }
const HEX     = { ENVIADO:'#546e7a', EN_REVISION:'#e65100', ACEPTADO:'#558b2f', RECHAZADO:'#c62828' }
const CHIPS   = { ENVIADO:'info', EN_REVISION:'warning', ACEPTADO:'success', RECHAZADO:'error' }

function estadoLabel(e) { return ESTADOS[e] ?? (e || 'Desconocido') }
function hexEstado(e)   { return HEX[e]     ?? '#9e9e9e' }
function chipEstado(e)  { return CHIPS[e]   ?? 'info' }

onMounted(() => {
  editorStore.cargarDashboardEditor()
})

function decidir(id, decision) {
  editorStore.tomarDecision(id, decision)
}
</script>

<style scoped>
.hover-elevation {
  transition: all 0.3s ease;
}
.hover-elevation:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(93, 64, 55, 0.12) !important;
}
.line-height-1 {
  line-height: 1.2;
}
</style>
