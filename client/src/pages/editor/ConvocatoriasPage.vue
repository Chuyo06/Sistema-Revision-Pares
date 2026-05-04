<template>
  <v-container style="max-width:1000px; padding:24px">
    <!-- Cabecera -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <v-btn variant="text" to="/editor" prepend-icon="mdi-arrow-left">Panel de Control</v-btn>
        <h1 class="text-h4 font-weight-bold mt-2">Convocatorias</h1>
        <p class="text-body-2 text-medium-emphasis">
          Las convocatorias se cierran automáticamente al pasar la fecha límite.
        </p>
      </div>
      <v-btn
        v-if="editorStore.esEditorJefe"
        color="primary"
        prepend-icon="mdi-plus"
        @click="abrirDialogo()"
      >
        Nueva convocatoria
      </v-btn>
    </div>

    <!-- Aviso si no es editor jefe -->
    <v-alert v-if="!editorStore.esEditorJefe" type="info" variant="tonal" class="mb-4" icon="mdi-information-outline">
      Solo el <strong>editor jefe</strong> puede crear y editar convocatorias. Lo que ves es el listado actual.
    </v-alert>

    <!-- Listado -->
    <v-row>
      <v-col v-for="c in convStore.convocatorias" :key="c.id" cols="12" md="6">
        <v-card border rounded="lg" elevation="1" class="h-100">
          <div :style="`height:6px; background:${c.estado === 'ABIERTA' ? '#4CAF50' : '#9e9e9e'}`" />
          <v-card-item class="pa-4">
            <div class="d-flex align-start justify-space-between mb-2">
              <div class="text-h6 font-weight-bold" style="color:#1B4332">
                {{ c.nombre }}
              </div>
              <v-chip
                :color="c.estado === 'ABIERTA' ? 'success' : 'grey'"
                size="x-small"
                label
                class="font-weight-bold"
              >
                {{ c.estado }}
              </v-chip>
            </div>

            <div class="text-caption text-medium-emphasis mb-3">
              <v-icon size="14" class="mr-1">mdi-calendar-range</v-icon>
              {{ formatFecha(c.fechaInicio) }} → {{ formatFecha(c.fechaLimite) }}
              <span v-if="c.estado === 'ABIERTA'" class="ml-2">
                · {{ diasRestantes(c.fechaLimite) }} día(s) restante(s)
              </span>
            </div>

            <div v-if="c.areasTematicas?.length" class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="area in c.areasTematicas"
                :key="area"
                size="x-small"
                variant="tonal"
                color="brown"
              >
                {{ area }}
              </v-chip>
            </div>
          </v-card-item>

          <v-card-actions v-if="editorStore.esEditorJefe" class="pa-3">
            <v-btn size="small" variant="text" prepend-icon="mdi-pencil" @click="abrirDialogo(c)">
              Editar
            </v-btn>
            <v-spacer />
            <v-btn size="small" variant="text" color="error" prepend-icon="mdi-delete" @click="confirmarEliminar(c)">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="convStore.convocatorias.length === 0" justify="center" class="py-12">
      <v-col cols="auto" class="text-center">
        <v-icon size="64" color="brown-lighten-3" class="mb-4">mdi-calendar-blank-outline</v-icon>
        <p class="text-h6">No hay convocatorias creadas</p>
      </v-col>
    </v-row>

    <!-- Diálogo crear/editar -->
    <v-dialog v-model="dialogo" max-width="640">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-calendar-plus</v-icon>
          {{ editando ? 'Editar convocatoria' : 'Nueva convocatoria' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <v-text-field
              v-model="form.nombre"
              label="Nombre *"
              :rules="[r => !!r || 'Requerido']"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            />
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.fechaInicio"
                  label="Fecha de inicio *"
                  type="date"
                  :rules="[r => !!r || 'Requerido']"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.fechaLimite"
                  label="Fecha límite *"
                  type="date"
                  :rules="[r => !!r || 'Requerido', r => r > form.fechaInicio || 'Debe ser posterior al inicio']"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
            <v-combobox
              v-model="form.areasTematicas"
              :items="adminStore.areasTematicas"
              label="Áreas temáticas"
              hint="Selecciona áreas existentes o escribe y presiona Enter para crear nuevas"
              persistent-hint
              multiple
              chips
              closable-chips
              variant="outlined"
              density="comfortable"
              class="mt-2"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialogo = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!formValido" @click="guardar">
            {{ editando ? 'Guardar cambios' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmar eliminar -->
    <v-dialog v-model="dialogoEliminar" max-width="420">
      <v-card>
        <v-card-title>¿Eliminar convocatoria?</v-card-title>
        <v-card-text>
          Esta acción quitará "<strong>{{ convAEliminar?.nombre }}</strong>" del listado.
          Los manuscritos ya enviados conservarán el nombre como referencia.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogoEliminar = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="eliminarConfirmado">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useConvocatoriasStore } from '@/store/convocatorias.js'
import { useEditorStore } from '@/store/editor/index.js'
import { useAdminStore } from '@/store/administrador/index.js'

const convStore = useConvocatoriasStore()
const editorStore = useEditorStore()
const adminStore = useAdminStore()

const dialogo = ref(false)
const dialogoEliminar = ref(false)
const formValido = ref(false)
const editando = ref(null)
const convAEliminar = ref(null)

const form = ref({ nombre: '', fechaInicio: '', fechaLimite: '', areasTematicas: [] })

function abrirDialogo(c = null) {
  if (c) {
    editando.value = c.id
    form.value = {
      nombre: c.nombre,
      fechaInicio: c.fechaInicio,
      fechaLimite: c.fechaLimite,
      areasTematicas: [...(c.areasTematicas || [])],
    }
  } else {
    editando.value = null
    form.value = { nombre: '', fechaInicio: '', fechaLimite: '', areasTematicas: [] }
  }
  dialogo.value = true
}

async function guardar() {
  try {
    if (editando.value) {
      await convStore.actualizar(editando.value, form.value)
    } else {
      await convStore.crear(form.value)
    }
  } catch (e) {
    console.error('Error al guardar convocatoria', e)
  }
  dialogo.value = false
}

function confirmarEliminar(c) {
  convAEliminar.value = c
  dialogoEliminar.value = true
}

async function eliminarConfirmado() {
  try {
    await convStore.eliminar(convAEliminar.value.id)
  } catch (e) {
    console.error('Error al eliminar convocatoria', e)
  }
  dialogoEliminar.value = false
  convAEliminar.value = null
}

function formatFecha(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function diasRestantes(iso) {
  if (!iso) return 0
  const ms = new Date(iso + 'T23:59:59') - new Date()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}
</script>
