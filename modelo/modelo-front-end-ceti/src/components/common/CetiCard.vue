<template>
  <div class="w-full mx-auto animate-fade-in-down">
      <div class="mb-6 flex items-center justify-between gap-3">
        <div
          class="row items-center gap-3"
        >
          <div class="p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-pmvc-blue">
            <q-icon :name="iconName" size="24px" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-pmvc-blue leading-tight">
              {{ title }}
            </h1>
            <p v-if="description" class="text-sm text-slate-500">
              {{ description }}
            </p>
          </div>
        </div>
        <div
          v-if="$slots.button"
          class="w-full md:w-auto flex justify-end shrink-0"
        >
          <slot name="button" />
        </div>
      </div>

      <div v-if="$slots.beforeSection" class="mb-4">
        <slot name="beforeSection" />
      </div>

      <section
        :class="['bg-white rounded-xl shadow-sm border border-slate-200', noOverflowHidden ? 'overflow-visible' : 'overflow-hidden']"
      >
        <div class="p-2">
          <slot />
        </div>
      </section>
    </div>

</template>

<script setup>
import { computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  iconName: {
    type: String,
    default: 'account_circle',
  },
  title: {
    type: String,
    default: 'Perfil',
  },
  description: {
    type: String,
    default: 'Descrição da página',
  },
  noOverflowHidden: {
    type: Boolean,
    default: false,
  },
});
const iconDisplay = computed(() => props.icon || props.iconName);
</script>
