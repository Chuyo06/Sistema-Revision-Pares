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

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const isValidForUpload = computed(() => {
  const file = getFileToProcess();
  return file && !errorMessage.value;
});

const getFileToProcess = () => {
  if (!selectedFile.value) return null;
  return Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value;
};

const validateFile = () => {
  errorMessage.value = '';
  const file = getFileToProcess();

  if (!file) return false;

  if (file.type !== 'application/pdf') {
    errorMessage.value = 'Error: El archivo debe ser un documento en formato PDF.';
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
    errorMessage.value = `Error: El archivo supera el tamaño máximo de 50MB (Actual: ${sizeInMB}MB).`;
    return false;
  }

  return true;
};

const emit = defineEmits(['uploaded', 'reset']);

const uploadFile = async () => {
  if (!validateFile()) return;

  isUploading.value = true;

  try {
    const file = getFileToProcess();
    const formData = new FormData();
    formData.append('archivo', file);

    const res = await fetch('/api/manuscritos/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al subir el archivo');
    }

    const data = await res.json();
    referenceNumber.value = data.referencia;
    uploadSuccess.value = true;

    emit('uploaded', {
      file,
      reference: data.referencia,
    });
  } catch (error) {
    errorMessage.value = error.message || 'Ocurrió un error de red o de servidor al subir el archivo.';
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
