<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
let refreshInterval;

onMounted(() => {
  authStore.initFromKeyCloak();

  refreshInterval = setInterval(() => {
    keycloak.updateToken(60).catch(() => keycloak.logout());
  }, 30_000); //verifica a cada 30s, renova se expira em menos de 60s
});

onMounted(() => clearInterval(refreshInterval));
</script>
