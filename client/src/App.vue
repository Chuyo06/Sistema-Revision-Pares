<template>
  <v-app>
    <router-view />
    <PwaInstallBanner />
    <OfflineBanner />
  </v-app>
</template>

<script setup>
import PwaInstallBanner from '@/components/common/PwaInstallBanner.vue'
import OfflineBanner from '@/components/common/OfflineBanner.vue'
</script>
