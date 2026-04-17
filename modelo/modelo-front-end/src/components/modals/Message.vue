<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin card-style">
      <q-card-section
        align="center"
        class="colum items-center justify-between text-center"
      >
        <q-avatar icon="live_help" color="warning" text-color="white" />
        <div class="text-h6 q-my-md">{{ message }}</div>
        <div class="text-red-10 text-h6">{{ identification }}</div>
      </q-card-section>

      <q-card-section class="text-center">
        Ao confirmar essa ação, você não poderá desfazê-la.
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="blue-10" unelevated :label="label" @click="onOKClick" />
        <q-btn outline label="Cancelar" color="red" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  identification: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Sim, Excluir!',
  },
});

const emit = defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

function onOKClick() {
  onDialogOK();
}
</script>

<style scoped>
.card-style {
  width: 100%;
  max-width: 500px;
}
</style>
