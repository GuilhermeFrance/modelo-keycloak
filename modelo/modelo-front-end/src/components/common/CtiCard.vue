<template>
  <q-card :style="`min-height: ${$q.screen.height - 100}px;`" class="q-ma-sm">
    <q-card-section class="row bg-grey-2 q-py-sm flex justify-between">
      <div class="flex justify-center items-center">
        <q-icon :name="iconName" size="md" />
        <div class="text-h6 q-ml-sm">{{ title }}</div>
      </div>
      <slot name="button" />
    </q-card-section>
    <q-separator />
    <div class="q-pa-md">
      <slot />
    </div>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps({
  iconName: {
    type: String,
    default: 'account_circle',
  },
  title: {
    type: String,
    default: 'Perfil',
  },
});
</script>
