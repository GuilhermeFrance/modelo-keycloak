<template>
  <q-page padding>
    <div class="row flex justify-around">
      <CardDashboard :infoDashboard="infoDashboard" />
    </div>
  </q-page>
</template>

<script setup>
import CardDashboard from 'src/components/dashboard/CardDashboard.vue';
import { ref } from 'vue';

const infoDashboard = ref([
  {
    amount: 10,
    icon: 'home',
    iconColor: 'green',
    backgroundColor:
      'linear-gradient(to left, rgba(200, 228, 213, 0.3), rgba(255, 255, 255, 0.98))',
    amountColor: 'black',
    title: 'Início',
    size_icon: '5em',
  },
  {
    amount: 5,
    icon: 'settings',
    iconColor: 'blue',
    backgroundColor:
      'linear-gradient(to left, rgba(249, 233, 184, 0.2), rgba(255, 253, 249, 0.89))',
    amountColor: 'black',
    title: 'Administradores',
    size_icon: '5em',
  },
  {
    amount: 15,
    icon: 'favorite',
    iconColor: 'red',
    backgroundColor:
      'linear-gradient(to left, rgba(95, 246, 236, 0.2), rgba(255, 255, 255, 0.87))',
    amountColor: 'black',
    title: 'Favoritos',
    size_icon: '5em',
  },
]);
</script>

<style scoped></style>
