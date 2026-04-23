<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card style="width: 100%; max-width: 500px; border-radius: 16px;" class="q-pa-md">
      
      <q-card-section class="column items-center q-pb-none">
        <q-avatar 
          icon="live_help" 
          color="blue-1" 
          text-color="pmvc-blue"  
          size="72px" 
          class="q-mb-md" 
        />
        
        <div class="text-h6 text-grey-9 text-weight-bold text-center" style="line-height: 1.2;">
          {{ message }}
        </div>
        
        <div class="text-subtitle1 text-red-10 text-weight-bold text-center q-mt-md">
          {{ identification }}
        </div>
        
        <div class="text-body2 text-grey-6 text-center q-mt-md">
          <q-icon name="error_outline" size="18px" class="q-mr-xs" />
          <span class="text-weight-medium">
            Ao confirmar essa ação, você não poderá desfazê-la.
          </span>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-lg q-mb-sm q-px-md row q-col-gutter-sm">
        <div class="col-6">
          <q-btn 
            flat
            no-caps
            label="Cancelar" 
            color="blue-grey-6" 
            class="full-width font-medium hover:bg-slate-100 rounded-lg sm:py-3 sm:text-base"
            v-close-popup 
          />
        </div>
        <div class="col-6">
          <q-btn 
            unelevated 
            no-caps
            :label="label" 
            color="blue-10" 
            class="full-width font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity sm:py-3 sm:text-base"
            @click="onOKClick" 
          />
        </div>
      </q-card-actions>
      
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';

const props = defineProps({
  message: { type: String, required: true },
  identification: { type: String, required: true },
  label: { type: String, default: 'Sim, Excluir!' },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

function onOKClick() {
  onDialogOK();
}
</script>
