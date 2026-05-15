<template>
  <div style="max-width:800px; padding:20px">

    <!-- Tabs Enviados / Borradores -->
    <v-tabs v-model="tab" color="primary" align-tabs="start" density="compact" class="mb-3">
      <v-tab value="enviados">
        <v-icon start size="18">mdi-send-check-outline</v-icon>
        Enviados
        <v-chip size="x-small" variant="tonal" class="ml-2">{{ autorStore.manuscritos.length }}</v-chip>
      </v-tab>
      <v-tab value="borradores">
        <v-icon start size="18">mdi-file-edit-outline</v-icon>
        Borradores
        <v-chip size="x-small" variant="tonal" class="ml-2">{{ autorStore.borradores.length }}</v-chip>
      </v-tab>
    </v-tabs>

    <!-- Barra de acciones -->
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap">
      <v-text-field
        v-model="busqueda"
        placeholder="Buscar artículo..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        clearable
        style="max-width:260px; flex:1; min-width:160px"
        @update:model-value="pagina = 1"
      />
      <v-select
        v-if="tab === 'enviados'"
        v-model="filtroEstado"
        :items="filtros"
        item-title="label"
        item-value="value"
        density="compact"
        hide-details
        style="max-width:200px; flex:1; min-width:140px"
        @update:model-value="pagina = 1"
      />
      <v-btn color="primary" prepend-icon="mdi-plus" to="/autor/nuevo" style="flex-shrink:0">
        Nuevo
      </v-btn>
    </div>

    <!-- Lista feed de artículos -->
    <div
      v-for="m in manuscritosPaginados"
      :key="m.id"
      style="background:#FFFFFF; border:1px solid #D3E0D7; border-radius:12px; margin-bottom:10px; overflow:hidden; transition: 0.2s; cursor: pointer;"
      @click="m.estado !== 'BORRADOR' ? abrirComentarios(m) : $router.push(`/autor/borrador/${m.id}`)"
      class="articulo-card"
    >
      <div :style="`height:5px; background:${hexEstado(m.estado)}`" />
      <div style="padding:16px">
        <!-- Fila 1: Título + chip -->
        <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:6px">
          <div style="flex:1; min-width:0">
            <div style="font-size:15px; font-weight:600; color:#1B4332; word-break:break-word">
              {{ m.titulo }}
            </div>
          </div>
          <v-chip
            :color="chipEstado(m.estado)"
            label
            size="small"
            style="flex-shrink:0; margin-top:1px"
          >
            {{ estadoLabel(m.estado) }}
          </v-chip>
        </div>

        <!-- Fila 2: Subtítulo -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
          <span style="font-size:12px; color:#8B5A2B">{{ m.convocatoria }}</span>
          <span v-if="m.fechaEnvio" style="font-size:12px; color:#bda89a">·</span>
          <span v-if="m.fechaEnvio" style="font-size:12px; color:#8B5A2B">{{ m.fechaEnvio }}</span>
          <v-chip v-if="m.referencia" size="x-small" variant="tonal" color="secondary">
            REF: {{ m.referencia }}
          </v-chip>
          <v-btn
            v-if="m.referencia"
            size="x-small"
            variant="tonal"
            color="brown"
            prepend-icon="mdi-file-pdf-box"
            class="text-none"
            @click.stop="abrirPdf(m)"
          >
            Ver PDF
          </v-btn>
        </div>

        <!-- Fila 3: Resumen -->
        <p style="font-size:13px; color:#4CAF50; margin-top:8px; margin-bottom:0;
                  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden">
          {{ m.resumen }}
        </p>
      </div>
    </div>

    <!-- Paginación -->
    <v-pagination
      v-if="totalPaginas > 1"
      v-model="pagina"
      :length="totalPaginas"
      :total-visible="5"
      density="compact"
      class="mt-4"
    ></v-pagination>

    <!-- Vacío -->
    <div v-if="manuscritosFiltrados.length === 0" style="text-align:center; padding:48px 0; color:#8B5A2B">
      <v-icon size="44" color="secondary">mdi-file-search-outline</v-icon>
      <p style="font-size:14px; margin-top:10px">No se encontraron artículos.</p>
    </div>

    <!-- Dialogo de comentarios -->
    <v-dialog v-model="dialogoComentarios" max-width="600">
      <v-card color="surface" rounded="xl" border>
        <div style="background:#546e7a; height:6px; border-radius:8px 8px 0 0" />
        <v-card-title class="pa-5 pb-2 text-h5 font-weight-bold" style="color:#1B4332">
          <v-icon start color="primary">mdi-history</v-icon>
          Historial del Manuscrito
        </v-card-title>
        <v-card-subtitle class="px-5 pb-4">
          Manuscrito: {{ articuloSeleccionado?.titulo }}
        </v-card-subtitle>
        <v-divider />

        <v-card-text class="pa-5" style="max-height: 400px; overflow-y: auto;">
          <div v-if="cargandoComentarios" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else>
            <!-- LÍNEA DEL TIEMPO -->
            <v-timeline density="compact" side="end" class="mb-6">
              <v-timeline-item
                v-for="evento in eventosLineaDeTiempo"
                :key="evento.id"
                :dot-color="evento.color"
                :icon="evento.icon"
                size="small"
              >
                <div class="mb-1">
                  <div class="font-weight-bold" :style="{ color: evento.colorText || '#1B4332' }">
                    {{ evento.titulo }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ evento.fecha }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>

            <v-divider class="mb-6" />

            <!-- CARTA DEL EDITOR — visible cuando el editor ya tomó una
                 decisión final (ACEPTADO / RECHAZADO / REQUERIDAS_REVISIONES).
                 Se mantiene `motivoRechazo` como campo de transporte para no
                 romper datos anteriores; ahora actúa como "carta editorial". -->
            <v-alert
              v-if="['ACEPTADO', 'RECHAZADO', 'REQUERIDAS_REVISIONES'].includes(articuloSeleccionado?.estado) && articuloSeleccionado?.motivoRechazo"
              :type="cartaAlertaTipo"
              variant="tonal"
              class="mb-6"
              :icon="cartaAlertaIcono"
            >
              <strong>Carta del Editor:</strong><br/>
              <span style="white-space: pre-wrap;">{{ articuloSeleccionado.motivoRechazo }}</span>
            </v-alert>

            <!-- HISTORIAL DE VERSIONES PDF -->
            <div v-if="articuloSeleccionado?.historialVersiones && articuloSeleccionado.historialVersiones.length > 0" class="mb-6">
              <h3 class="text-h6 mb-2" style="color:#8B5A2B">Versiones del Documento</h3>
              <v-list class="bg-grey-lighten-4 rounded-lg border">
                <v-list-item v-for="(v, index) in articuloSeleccionado.historialVersiones" :key="v.referencia" class="border-bottom">
                  <template v-slot:prepend>
                    <v-icon color="brown">mdi-file-pdf-box</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">Versión {{ index + 1 }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(v.fecha) }} - REF: {{ v.referencia }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <v-btn
                      size="small"
                      variant="tonal"
                      color="primary"
                      prepend-icon="mdi-download"
                      class="text-none"
                      :href="`/api/manuscritos/download/${v.referencia}`"
                      target="_blank"
                    >Descargar</v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <v-divider class="mb-6" />

            <!-- Gating de opiniones: solo se publican al autor cuando la decisión
                 editorial está tomada O cuando todos los revisores terminaron.
                 Los nombres de los revisores quedan anonimizados como "Revisor #N". -->
            <div v-if="!puedeVerOpiniones" class="text-center py-6">
              <v-icon size="36" color="grey-lighten-1" class="mb-2">mdi-account-eye-outline</v-icon>
              <p class="text-body-2" style="color:#8B5A2B">
                Las opiniones de los revisores se publicarán de forma anonimizada
                <strong>cuando todos hayan completado su revisión</strong> y el editor tome la decisión final.
              </p>
            </div>
            <div v-else>
              <h3 class="text-h6 mb-2" style="color:#8B5A2B">Opiniones de los Revisores</h3>
              <p class="text-caption text-medium-emphasis mb-4">
                Los nombres de los revisores se mantienen anónimos (doble ciego).
              </p>
              
              <div v-for="ronda in comentariosPorRonda" :key="ronda.numero" class="mb-6">
                <div class="bg-brown-lighten-4 pa-2 px-4 text-subtitle-2 font-weight-bold text-brown-darken-3 rounded-t-lg border">
                  RONDA {{ ronda.numero }}
                </div>
                <div class="border rounded-b-lg pa-4 bg-white">
                  <div v-for="comentario in ronda.items" :key="comentario.id" class="mb-4 pa-4 bg-grey-lighten-4 rounded-lg border-dashed">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="d-flex align-center gap-2">
                        <span class="font-weight-bold" style="color:#8B5A2B">Revisor #{{ comentario.id }}</span>
                        <v-chip v-if="comentario.especialidad" size="x-small" variant="tonal" color="teal" prepend-icon="mdi-school">
                          {{ comentario.especialidad }}
                        </v-chip>
                      </div>
                      <div v-if="comentario.puntuacion" class="mb-2">
                        <div class="d-flex align-center">
                          <v-rating :model-value="comentario.puntuacion" color="amber" density="compact" size="small" readonly></v-rating>
                          <span class="ml-2 font-weight-bold text-brown">{{ comentario.puntuacion }}/5</span>
                        </div>
                        <div class="d-flex flex-wrap gap-2 mt-1" v-if="comentario.originalidad" style="font-size: 11px; color: #546e7a;">
                          <v-chip size="x-small" variant="outlined" color="primary">Originalidad: {{ comentario.originalidad }}</v-chip>
                          <v-chip size="x-small" variant="outlined" color="info">Metodología: {{ comentario.metodologia }}</v-chip>
                          <v-chip size="x-small" variant="outlined" color="success">Claridad: {{ comentario.claridad }}</v-chip>
                          <v-chip size="x-small" variant="outlined" color="warning">Relevancia: {{ comentario.relevancia }}</v-chip>
                        </div>
                      </div>
                    </div>
                    <template v-if="parsearSecciones(comentario.comentarios).length > 1">
                      <div
                        v-for="(sec, sIdx) in parsearSecciones(comentario.comentarios)"
                        :key="sIdx"
                        class="mb-2 pa-3 rounded-lg"
                        :style="{ background: sec.esGeneral ? '#e8f5e9' : '#f5f5f5', border: '1px solid ' + (sec.esGeneral ? '#c8e6c9' : '#e0e0e0') }"
                      >
                        <div class="d-flex align-center mb-1">
                          <v-icon size="14" :color="sec.esGeneral ? 'success' : 'brown'" class="mr-1">
                            {{ sec.esGeneral ? 'mdi-comment-text-outline' : 'mdi-bookmark-outline' }}
                          </v-icon>
                          <span class="text-caption font-weight-bold" :style="{ color: sec.esGeneral ? '#2e7d32' : '#5d4037' }">
                            {{ sec.titulo }}
                          </span>
                        </div>
                        <div style="color:#1B4332; white-space: pre-wrap; font-size: 13px; line-height: 1.5;">{{ sec.texto }}</div>
                      </div>
                    </template>
                    <div v-else style="color:#1B4332; white-space: pre-wrap; font-size: 14px;">{{ comentario.comentarios }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn 
            v-if="articuloSeleccionado?.estado === 'REQUERIDAS_REVISIONES'" 
            color="orange-darken-3" 
            variant="flat" 
            prepend-icon="mdi-upload"
            :to="`/autor/reenviar/${articuloSeleccionado?.id}`"
          >
            Reenviar Versión Corregida
          </v-btn>
          <v-btn color="primary" variant="tonal" @click="dialogoComentarios = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Visor PDF compartido -->
    <PdfViewer
      v-model="dialogoPdf"
      :titulo="manuscritoPdf?.titulo"
      :referencia="manuscritoPdf?.referencia"
      :url-pdf="manuscritoPdf?.referencia ? `/api/manuscritos/download/${manuscritoPdf.referencia}` : ''"
      :contenido="manuscritoPdf?.contenido || manuscritoPdf?.resumen"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAutorStore } from '@/store/autor/index.js'
import PdfViewer from '@/components/common/PdfViewer.vue'

const autorStore = useAutorStore()
const busqueda = ref('')
const filtroEstado = ref('TODOS')
const tab = ref('enviados')
const pagina = ref(1)
const itemsPorPagina = 5

onMounted(() => {
  autorStore.cargarMisManuscritos()
  autorStore.cargarBorradores()
})

// Cuando cambia la pestaña, vuelve a página 1.
watch(tab, () => { pagina.value = 1 })

const dialogoComentarios = ref(false)
const dialogoPdf = ref(false)
const manuscritoPdf = ref(null)

function abrirPdf(m) {
  manuscritoPdf.value = m
  dialogoPdf.value = true
}
const cargandoComentarios = ref(false)
const comentarios = ref([])
const asignacionesPuras = ref([])
const articuloSeleccionado = ref(null)

async function abrirComentarios(manuscrito) {
  articuloSeleccionado.value = manuscrito
  dialogoComentarios.value = true
  cargandoComentarios.value = true
  const data = await autorStore.cargarComentarios(manuscrito.id)
  comentarios.value = data.comentarios
  asignacionesPuras.value = data.asignaciones
  cargandoComentarios.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha desconocida'
  return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Las opiniones de los revisores se muestran al autor SOLO cuando:
//  (a) la decisión editorial está tomada (ACEPTADO / RECHAZADO / REQUERIDAS_REVISIONES), o
//  (b) hay al menos una revisión completada y TODAS las asignaciones lo están.
// Antes de eso solo se muestra un placeholder, no se filtran datos sensibles del backend.
// Estilo del alert "Carta del Editor" según la decisión final.
const cartaAlertaTipo = computed(() => {
  const e = articuloSeleccionado.value?.estado
  if (e === 'ACEPTADO') return 'success'
  if (e === 'RECHAZADO') return 'error'
  return 'warning' // REQUERIDAS_REVISIONES
})
const cartaAlertaIcono = computed(() => {
  const e = articuloSeleccionado.value?.estado
  if (e === 'ACEPTADO') return 'mdi-check-decagram'
  if (e === 'RECHAZADO') return 'mdi-alert-circle'
  return 'mdi-clipboard-text-outline'
})

const puedeVerOpiniones = computed(() => {
  const m = articuloSeleccionado.value
  if (!m) return false
  if (['ACEPTADO', 'RECHAZADO', 'REQUERIDAS_REVISIONES'].includes(m.estado)) return true
  const asigs = asignacionesPuras.value || []
  if (asigs.length === 0) return false
  return asigs.every(a => a.estado === 'COMPLETADA')
})

const comentariosPorRonda = computed(() => {
  const grupos = {}
  comentarios.value.forEach(c => {
    const r = c.ronda || 1
    if (!grupos[r]) grupos[r] = []
    grupos[r].push(c)
  })
  return Object.keys(grupos).sort((a, b) => b - a).map(num => ({
    numero: num,
    items: grupos[num]
  }))
})

const eventosLineaDeTiempo = computed(() => {
  if (!articuloSeleccionado.value) return []
  
  const eventos = []
  let idCounter = 1
  
  const m = articuloSeleccionado.value
  eventos.push({
    id: idCounter++,
    titulo: 'Manuscrito Enviado',
    fecha: formatDate(m.fechaSubida || m.fechaEnvio),
    color: 'info',
    icon: 'mdi-file-upload'
  })

  asignacionesPuras.value.forEach((a) => {
    if (a.fecha_invitacion) {
      eventos.push({
        id: idCounter++,
        titulo: `Ronda ${a.ronda || 1}: Revisor Asignado`,
        fecha: formatDate(a.fecha_invitacion),
        color: 'warning',
        icon: 'mdi-account-arrow-right'
      })
    }
    if (a.fecha_completada) {
      eventos.push({
        id: idCounter++,
        titulo: `Ronda ${a.ronda || 1}: Revisión Completada`,
        fecha: formatDate(a.fecha_completada),
        color: 'success',
        icon: 'mdi-check-all'
      })
    }
  })

  if (['ACEPTADO', 'RECHAZADO', 'REQUERIDAS_REVISIONES'].includes(m.estado)) {
    const estado = m.estado === 'REQUERIDAS_REVISIONES' ? 'Requiere Revisiones' : m.estado
    const isError = m.estado === 'RECHAZADO'
    const isWarning = m.estado === 'REQUERIDAS_REVISIONES'
    eventos.push({
      id: idCounter++,
      titulo: `Veredicto Final: ${estado}`,
      fecha: formatDate(m.fechaDecision || new Date()),
      color: isError ? 'error' : (isWarning ? 'orange-darken-3' : 'success'),
      colorText: isError ? '#c62828' : (isWarning ? '#ef6c00' : '#2e7d32'),
      icon: 'mdi-gavel'
    })
  }
  
  return eventos
})

const filtros = [
  { label:'Todos los estados', value:'TODOS' },
  { label:'Borrador',    value:'BORRADOR' },
  { label:'En revisión', value:'EN_REVISION' },
  { label:'Aceptado',    value:'ACEPTADO' },
  { label:'Rechazado',   value:'RECHAZADO' },
]

// Fuente de datos según la pestaña activa.
const fuenteActiva = computed(() =>
  tab.value === 'borradores' ? autorStore.borradores : autorStore.manuscritos
)

const manuscritosFiltrados = computed(() =>
  fuenteActiva.value.filter(m => {
    const titulo = (m.titulo || '').toLowerCase()
    const term = (busqueda.value || '').toLowerCase()
    const b = titulo.includes(term)
    // El filtro por estado solo aplica en la pestaña Enviados.
    const e = tab.value === 'borradores'
      ? true
      : (filtroEstado.value === 'TODOS' || m.estado === filtroEstado.value)
    return b && e
  })
)

const totalPaginas = computed(() => Math.ceil(manuscritosFiltrados.value.length / itemsPorPagina))

const manuscritosPaginados = computed(() => {
  const inicio = (pagina.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return manuscritosFiltrados.value.slice(inicio, fin)
})

const ESTADOS = { BORRADOR:'Borrador', ENVIADO:'Enviado', EN_REVISION:'En revisión', REQUERIDAS_REVISIONES:'Requiere revisiones', ACEPTADO:'Aceptado', RECHAZADO:'Rechazado' }
const HEX     = { BORRADOR:'#9e9e9e', ENVIADO:'#546e7a', EN_REVISION:'#e65100', REQUERIDAS_REVISIONES:'#ef6c00', ACEPTADO:'#558b2f', RECHAZADO:'#c62828' }
const CHIPS   = { BORRADOR:'secondary', ENVIADO:'info', EN_REVISION:'warning', REQUERIDAS_REVISIONES:'warning', ACEPTADO:'success', RECHAZADO:'error' }

function estadoLabel(e) { return ESTADOS[e] ?? e }
function hexEstado(e)   { return HEX[e]     ?? '#9e9e9e' }
function chipEstado(e)  { return CHIPS[e]   ?? 'secondary' }

/**
 * Parsea el texto de comentarios con marcadores [Sección: X] en bloques
 * estructurados para mostrar al autor de forma organizada.
 */
function parsearSecciones(texto) {
  if (!texto) return [{ titulo: 'Comentario', texto: '', esGeneral: true }]

  // Primero encontrar todos los marcadores y sus posiciones
  const regex = /\[Sección:\s*([^\]]+)\]|\[General\]/g
  const marcadores = []
  let match

  while ((match = regex.exec(texto)) !== null) {
    marcadores.push({
      index: match.index,
      length: match[0].length,
      esGeneral: match[0] === '[General]',
      titulo: match[0] === '[General]' ? 'Comentarios Generales' : match[1].trim(),
    })
  }

  // Si no hay marcadores, devolver el texto completo
  if (marcadores.length === 0) {
    return [{ titulo: 'Comentario', texto: texto, esGeneral: true }]
  }

  const secciones = []

  // Texto antes del primer marcador
  if (marcadores[0].index > 0) {
    const previo = texto.substring(0, marcadores[0].index).trim()
    if (previo) secciones.push({ titulo: 'Comentario', texto: previo, esGeneral: true })
  }

  // Procesar cada marcador
  marcadores.forEach((m, i) => {
    const startContent = m.index + m.length
    const endContent = i < marcadores.length - 1 ? marcadores[i + 1].index : texto.length
    const contenido = texto.substring(startContent, endContent).trim()
    secciones.push({ titulo: m.titulo, texto: contenido, esGeneral: m.esGeneral })
  })

  return secciones
}
</script>

<style scoped>
.articulo-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-bottom:last-child {
  border-bottom: none;
}
</style>
