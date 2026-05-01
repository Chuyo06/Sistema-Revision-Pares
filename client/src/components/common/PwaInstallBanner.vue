<template></template>

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
