<template>
  <div style="max-width:800px; padding:20px">
    <div style="font-size:13px; font-weight:700; color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:14px">
      Gestión de Áreas Temáticas
    </div>

    <v-card border elevation="0" rounded="lg" class="pa-5 mb-5">
      <h3 class="text-h6 mb-4" style="color:#1B4332">Añadir nueva área</h3>
      <p class="text-body-2 text-grey-darken-1 mb-4">
        Las áreas temáticas creadas estarán disponibles en todo el sistema para ser seleccionadas en las convocatorias y por los revisores en sus especialidades.
      </p>

      <v-form @submit.prevent="agregarNuevaArea" class="d-flex align-center mt-2">
        <v-text-field
          v-model="nuevaArea"
          label="Nombre del Área Temática"
          variant="outlined"
          density="compact"
          placeholder="Ej: Biología Molecular"
          hide-details="auto"
          class="flex-grow-1 mr-4"
        ></v-text-field>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          type="submit"
          :disabled="!nuevaArea.trim()"
          style="height: 40px;"
        >
          Agregar
        </v-btn>
      </v-form>
    </v-card>

    <v-card border elevation="0" rounded="lg" class="pa-5">
      <h3 class="text-h6 mb-4" style="color:#1B4332">Áreas Existentes ({{ adminStore.areasTematicas.length }})</h3>
      
      <v-list class="bg-transparent" lines="one">
        <v-list-item
          v-for="area in adminStore.areasTematicas"
          :key="area"
          class="mb-2 border rounded-lg"
        >
          <template v-slot:prepend>
            <v-icon color="primary" class="mr-3">mdi-tag-outline</v-icon>
          </template>
          <v-list-item-title class="font-weight-medium" style="color:#1B4332">
            {{ area }}
          </v-list-item-title>
          
          <template v-slot:append>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              color="error"
              size="small"
              title="Eliminar área"
              @click="confirmarEliminacion(area)"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      
      <div v-if="adminStore.areasTematicas.length === 0" class="text-center text-body-2 text-grey-darken-1 py-4">
        No hay áreas temáticas registradas.
      </div>
    </v-card>

    <!-- Dialogo Confirmación Eliminación -->
    <v-dialog v-model="dialogoEliminar" max-width="400">
      <v-card rounded="xl" border>
        <div style="background:#c62828; height:6px; border-radius:8px 8px 0 0" />
        <v-card-title class="pa-5 pb-2 text-h5 font-weight-bold text-error">
          <v-icon start color="error">mdi-alert</v-icon>
          Eliminar Área
        </v-card-title>
        <v-card-text class="px-5 text-body-2">
          ¿Estás seguro de que deseas eliminar el área temática <strong>"{{ areaAEliminar }}"</strong>?
          Esto podría afectar las convocatorias y perfiles de revisores que ya la utilizan.
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="dialogoEliminar = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="ejecutarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMsg }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/store/administrador/index.js'

const adminStore = useAdminStore()
const nuevaArea = ref('')

const snackbar = ref(false)
const snackbarMsg = ref('')
const snackbarColor = ref('success')

const dialogoEliminar = ref(false)
const areaAEliminar = ref(null)

function agregarNuevaArea() {
  const nombre = nuevaArea.value.trim()
  if (!nombre) return
  
  const exito = adminStore.agregarArea(nombre)
  if (exito) {
    snackbarMsg.value = `Área "${nombre}" añadida correctamente`
    snackbarColor.value = 'success'
    nuevaArea.value = ''
  } else {
    snackbarMsg.value = `El área "${nombre}" ya existe`
    snackbarColor.value = 'warning'
  }
  snackbar.value = true
}

function confirmarEliminacion(area) {
  areaAEliminar.value = area
  dialogoEliminar.value = true
}

function ejecutarEliminacion() {
  if (areaAEliminar.value) {
    adminStore.eliminarArea(areaAEliminar.value)
    snackbarMsg.value = `Área "${areaAEliminar.value}" eliminada`
    snackbarColor.value = 'info'
    snackbar.value = true
  }
  dialogoEliminar.value = false
  areaAEliminar.value = null
}
</script>
