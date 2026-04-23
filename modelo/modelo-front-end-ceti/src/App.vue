<template>
  <router-view />
</template>

<script setup>
import { defineComponent, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useAuthStore } from 'src/stores/authStore';

const authStore = useAuthStore();
onMounted(() => {
  authStore.initSystem();
  const token = authStore.token;

  if (token) {
    api.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
  } else {
    api.defaults.headers.common.Authorization = '';
  }
});
</script>

