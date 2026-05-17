<template>
  <div style="max-width:800px; padding:20px">
    <div style="font-size:13px; font-weight:700; color:#8B5A2B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:14px">
      Configuración de Inteligencia Artificial
    </div>

    <v-card border elevation="0" rounded="lg" class="pa-5 mb-5">
      <h3 class="text-h6 mb-4" style="color:#1B4332">Modelos y API</h3>
      <p class="text-body-2 text-grey-darken-1 mb-4">
        Configura los proveedores de modelos de lenguaje utilizados por el sistema. El MVP utiliza Gemini de forma predeterminada con búsqueda vectorial en memoria.
      </p>

      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="adminStore.configuracionIA.modeloMatching"
            :items="['gemini-2.5-flash', 'gemini-2.5-pro']"
            label="Modelo para Asignación (Matching)"
            variant="outlined"
            density="compact"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="adminStore.configuracionIA.modeloAnalisis"
            :items="['gemini-2.5-flash', 'gemini-2.5-pro']"
            label="Modelo para Análisis (Calidad/Ética)"
            variant="outlined"
            density="compact"
          ></v-select>
        </v-col>
      </v-row>

      <div class="d-flex justify-end mt-2">
        <v-btn
          color="info"
          variant="tonal"
          prepend-icon="mdi-connection"
          :loading="probandoConexion"
          @click="probarConexion"
          style="height: 40px;"
        >
          Probar Conexión del Backend
        </v-btn>
      </div>
    </v-card>

    <v-card border elevation="0" rounded="lg" class="pa-5 mb-5">
      <h3 class="text-h6 mb-4" style="color:#1B4332">Ajustes del Sistema</h3>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-slider
            v-model="adminStore.configuracionIA.umbralConflictoInteres"
            label="Sensibilidad Conflicto Interés"
            min="0"
            max="1"
            step="0.05"
            thumb-label
            color="primary"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="6">
          <v-slider
            v-model="adminStore.configuracionIA.umbralPlagio"
            label="Umbral de Alerta Plagio/Ética"
            min="0"
            max="1"
            step="0.05"
            thumb-label
            color="primary"
          ></v-slider>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-switch
        v-model="adminStore.configuracionIA.asistenciaCalidadActiva"
        color="primary"
        label="Activar Asistente de Calidad para Revisores"
        hide-details
      ></v-switch>
      <v-switch
        v-model="adminStore.configuracionIA.analisisEticaActivo"
        color="primary"
        label="Activar Análisis Automático de Ética y Plagio"
        hide-details
      ></v-switch>
      <v-switch
        v-model="adminStore.configuracionIA.generacionCartasActiva"
        color="primary"
        label="Activar Generación Automática de Cartas de Decisión"
        hide-details
      ></v-switch>

    </v-card>

    <div class="text-right">
      <v-btn color="primary" @click="guardarConfiguracion" prepend-icon="mdi-content-save">
        Guardar Configuración
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMsg }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/store/administrador/index.js'
import { testConexionIAApi } from '@/services/api/analisis.js'

const adminStore = useAdminStore()
const snackbar = ref(false)
const snackbarMsg = ref('')
const snackbarColor = ref('success')
const probandoConexion = ref(false)

async function guardarConfiguracion() {
  await adminStore.guardarConfiguracionIA()
  snackbarMsg.value = 'Configuración guardada exitosamente en el servidor'
  snackbarColor.value = 'success'
  snackbar.value = true
}

async function probarConexion() {
  probandoConexion.value = true
  try {
    const data = await testConexionIAApi()
    if (data.ok) {
      snackbarMsg.value = '¡Conexión a IA exitosa! El modelo está respondiendo.'
      snackbarColor.value = 'success'
    } else {
      snackbarMsg.value = 'Fallo en la conexión: ' + (data.message || 'desconocido')
      snackbarColor.value = 'error'
    }
  } catch (e) {
    console.error('Error probando conexión:', e)
    snackbarMsg.value = 'Error de red al intentar conectar con IA'
    snackbarColor.value = 'error'
  } finally {
    probandoConexion.value = false
    snackbar.value = true
  }
}
</script>
