<template>
  <v-snackbar
    v-model="isOffline"
    color="error"
    location="bottom center"
    timeout="-1"
    elevation="24"
  >
    <div class="d-flex align-center">
      <v-icon start>mdi-wifi-off</v-icon>
      <div>
        <strong>Sin conexión a internet.</strong><br>
        Modo offline activo. Tus cambios se sincronizarán automáticamente al reconectar.
      </div>
    </div>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOffline = ref(!navigator.onLine)

const updateOnlineStatus = () => {
  isOffline.value = !navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>
