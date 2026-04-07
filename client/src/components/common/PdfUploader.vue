<template>
  <v-card class="mx-auto" max-width="600" elevation="2">
    <v-card-title class="text-h5 font-weight-bold d-flex align-center">
      <v-icon color="primary" class="mr-2">mdi-cloud-upload</v-icon>
      Subir Documento (PDF)
    </v-card-title>
    
    <v-card-text class="pt-4">
      <!-- Formulario de subida -->
      <v-form @submit.prevent="uploadFile" v-if="!uploadSuccess">
        <v-file-input
          v-model="selectedFile"
          label="Seleccione el archivo"
          accept="application/pdf"
          prepend-icon=""
          prepend-inner-icon="mdi-file-pdf-box"
          :error-messages="errorMessage"
          @update:model-value="validateFile"
          @change="validateFile"
          show-size
          variant="outlined"
          color="primary"
          hint="Requisitos: Formato PDF. Tamaño máximo 50MB."
          persistent-hint
          class="mb-6"
        ></v-file-input>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          elevation="2"
          :loading="isUploading"
          :disabled="!isValidForUpload"
        >
          <v-icon left class="mr-2">mdi-upload</v-icon>
          Subir Archivo
        </v-btn>
      </v-form>

      <!-- Pantalla de confirmación / éxito -->
      <div v-else class="text-center py-6">
        <v-icon color="success" size="80" class="mb-4">mdi-check-circle-outline</v-icon>
        <h3 class="text-h5 text-success font-weight-bold mb-2">¡Carga Completada!</h3>
        <p class="text-body-1 mb-6 text-medium-emphasis">
          El documento se ha subido y validado correctamente.
        </p>
        
        <v-alert
          type="info"
          variant="tonal"
          border="start"
          class="mb-6 text-left"
        >
          <div class="text-subtitle-2 font-weight-regular text-uppercase mb-1">
            Número de Referencia Único
          </div>
          <div class="text-h5 font-weight-black mb-1 letter-spacing-1">
            {{ referenceNumber }}
          </div>
          <div class="text-caption">
            * Por favor, guarda este código para dar seguimiento a tu manuscrito.
          </div>
        </v-alert>

        <v-btn 
          color="primary" 
          variant="outlined" 
          @click="resetForm"
          prepend-icon="mdi-refresh"
        >
          Subir otro documento
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedFile = ref(null);
const errorMessage = ref('');
const isUploading = ref(false);
const uploadSuccess = ref(false);
const referenceNumber = ref('');

// Límite de 50MB en bytes
const MAX_FILE_SIZE = 50 * 1024 * 1024; 

// Propiedad computada para habilitar/deshabilitar el botón de subida
const isValidForUpload = computed(() => {
  const file = getFileToProcess();
  return file && !errorMessage.value;
});

// Función auxiliar para manejar v-model que puede ser File o Array de Files en Vuetify 3
const getFileToProcess = () => {
  if (!selectedFile.value) return null;
  return Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value;
};

// 1. Validar que el archivo sea PDF y no supere 50MB (Tarea #2403)
const validateFile = () => {
  errorMessage.value = '';
  const file = getFileToProcess();

  if (!file) {
    return false;
  }

  // Validar formato PDF
  if (file.type !== 'application/pdf') {
    errorMessage.value = 'Error: El archivo debe ser un documento en formato PDF.';
    return false;
  }

  // Validar tamaño máximo (50MB) 
  if (file.size > MAX_FILE_SIZE) {
    const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
    errorMessage.value = `Error: El archivo supera el tamaño máximo de 50MB (Actual: ${sizeInMB}MB).`;
    return false;
  }

  return true;
};

// 2. Generar número de referencia único al subir (Tarea #2406)
// Nota:  En un entorno real, la API/Backend suele generar este número.
// Aquí se presenta el algoritmo simulado que podría usar o devolver el backend.
const generateUniqueReference = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
  // Formato: DOC-AAAAMMDD-XXXXXX
  return `DOC-${dateStr}-${uniqueId}`;
};

const emit = defineEmits(['uploaded', 'reset']);

const uploadFile = async () => {
  if (!validateFile()) return;
  
  isUploading.value = true;
  
  try {
    // Simulamos la latencia de la red (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Obtenemos el número generado
    const refNum = generateUniqueReference();
    referenceNumber.value = refNum;
    
    // 3. Mostrar confirmación con el número de referencia al finalizar (Tarea #2408)
    uploadSuccess.value = true;

    // Notificar al padre
    emit('uploaded', {
      file: getFileToProcess(),
      reference: refNum
    });

  } catch (error) {
    errorMessage.value = 'Ocurrió un error de red o de servidor al subir el archivo.';
    console.error('Error al subir:', error);
  } finally {
    isUploading.value = false;
  }
};

const resetForm = () => {
  selectedFile.value = null;
  errorMessage.value = '';
  uploadSuccess.value = false;
  referenceNumber.value = '';
  emit('reset');
};
</script>

<style scoped>
.letter-spacing-1 {
  letter-spacing: 1.5px !important;
}
</style>
