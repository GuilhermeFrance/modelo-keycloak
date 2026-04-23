<template>
  <q-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    persistent
  >
    <q-card style="width: 100%; max-width: 400px; border-radius: 16px;" class="q-pa-md">
      
      <q-card-section class="column items-center q-pb-none">
        <q-avatar 
          icon="logout" 
          color="blue-1" 
          text-color="pmvc-blue" 
          size="72px" 
          class="q-mb-md" 
        />
        
        <div class="text-h6 text-grey-9 text-weight-bold text-center" style="line-height: 1.2;">
          Tem certeza que deseja sair?
        </div>
        
        <div class="text-body2 text-grey-6 text-center q-mt-md">
          <q-icon name="error_outline" size="18px" class="q-mr-xs" />
          <span class="text-weight-medium">Você precisará fazer login novamente.</span>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-lg q-mb-sm q-px-md row q-col-gutter-sm">
        <div class="col-6">
          <q-btn 
            flat
            no-caps
            class="full-width font-medium hover:bg-slate-100 px-4 rounded-lg sm:py-3 sm:text-base"
            label="Cancelar" 
            color="blue-grey-6" 
            v-close-popup 
          />
        </div>
        <div class="col-6">
          <q-btn 
            unelevated 
            no-caps
            class="full-width font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity sm:py-3 sm:text-base"
            label="Sair" 
            color="pmvc-blue" 
            @click="onConfirm" 
          />
        </div>
      </q-card-actions>
      
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'confirm'])

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>