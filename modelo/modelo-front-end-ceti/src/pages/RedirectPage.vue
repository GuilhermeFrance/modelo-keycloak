<template>
  <span></span>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

onMounted(async () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const id = window.sessionStorage.getItem('user_id');
  const token = window.sessionStorage.getItem('token');

  if (!id || !token) {
    console.log('Usuário não autenticado, redirecionando para login');
    router.push('/login');
    return;
  }

  try {
    const res = await authStore.getUserAccessLevel(id, token);
    // console.log(id, token)
    switch (res) {
      case 'ADMIN': {
        router.push('/admin/');
        break;
      }
      case 'USUARIO': {
        router.push('/usuario/');
        break;
      }
      default: {
        router.push('/login');
        console.log('erro ao redirecionar');
        break;
      }
    }
  } catch (error) {
    console.error('Erro ao obter nível de acesso:', error);
    router.push('/login');
  }
});
</script>

<style lang="scss" scoped></style>
