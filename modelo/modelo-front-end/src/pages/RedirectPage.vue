<template>
  <span></span>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

onMounted(() => {
  const authStore = useAuthStore();
  const router = useRouter();

  if (!authStore.isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando para login');
    router.push({ name: 'error' });
    return;
  }

  if (authStore.isAdmin) {
    router.push('/admin/');
  } else {
    router.push('/usuario/');
  }
});
</script>

<style lang="scss" scoped></style>
