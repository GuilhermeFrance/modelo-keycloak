<template>
  <div>{{ name }}</div>
</template>

<script setup>
import keycloak from 'src/plugins/keycloak';

const name =
  keycloak.tokenParsed?.name ||
  keycloak.tokenParsed?.preferred_username ||
  'Usuário';
</script>

<style lang="scss" scoped></style>
