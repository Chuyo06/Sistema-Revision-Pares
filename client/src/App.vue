<template>
  <v-app>
    <router-view />
    <PwaInstallBanner />
  </v-app>
</template>

<script setup>
import PwaInstallBanner from '@/components/common/PwaInstallBanner.vue'
</script>
