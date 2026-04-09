<template>
  <v-snackbar
    v-model="show"
    :timeout="-1"
    color="primary"
    elevation="24"
    location="bottom right"
    class="mb-4 mr-4"
    rounded="lg"
  >
    <div class="d-flex align-center py-1">
      <v-icon icon="mdi-cellphone-arrow-down" class="mr-3" size="32"></v-icon>
      <div>
        <div class="text-subtitle-1 font-weight-bold">Instalar App</div>
        <div class="text-body-2">Accede más rápido y trabaja sin conexión.</div>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="show = false"
        class="text-none"
      >
        Quizás luego
      </v-btn>
      <v-btn
        color="white"
        theme="light"
        @click="installPwa"
        class="text-none ml-2 px-4"
        elevation="2"
      >
        <v-icon left class="mr-2">mdi-download</v-icon>
        Instalar ahora
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const show = ref(false);
const deferredPrompt = ref(null);

const onBeforeInstallPrompt = (e) => {
  // Previene que el navegador muestre el banner nativo inmediatamente
  e.preventDefault();
  // Guarda el evento para dispararlo luego
  deferredPrompt.value = e;
  // Muestra nuestro banner personalizado
  show.value = true;
  console.log('[PWA Banner] Evento beforeinstallprompt capturado');
};

const installPwa = async () => {
  if (!deferredPrompt.value) return;

  // Oculta el banner
  show.value = false;
  
  // Muestra el prompt nativo
  deferredPrompt.value.prompt();
  
  // Espera a que el usuario responda
  const { outcome } = await deferredPrompt.value.userChoice;
  console.log(`[PWA Banner] El usuario eligió: ${outcome}`);
  
  // Limpia el evento
  deferredPrompt.value = null;
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  
  // También escuchamos appinstalled para saber cuando ya se instaló
  window.addEventListener('appinstalled', () => {
    console.log('[PWA Banner] La aplicación ha sido instalada exitosamente');
    show.value = false;
    deferredPrompt.value = null;
  });
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
});
</script>

<style scoped>
:deep(.v-snackbar__content) {
  padding-right: 8px !important;
}
</style>
