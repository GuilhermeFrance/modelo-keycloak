<template>
  <q-card
    class="shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl bg-white border-none cursor-pointer card-dashboard"
  >
    <q-card-section class="q-pa-md">
      <div class="row items-center justify-between q-mb-sm">
        <div
          class="text-caption text-pmvc-gray text-weight-medium text-uppercase tracking-wider"
        >
          {{ title }}
        </div>
        <div
          class="rounded-xl q-pa-xs flex flex-center"
          :class="iconBgClass"
        >
          <q-icon :name="icon" size="sm" />
        </div>
      </div>
      <div class="text-h4 text-weight-bold text-pmvc-dark leading-tight">
        {{ amount }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  amount: {
    type: [Number, String],
    default: 0,
  },
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'assignment',
  },
  iconColor: {
    type: String,
    default: 'primary',
  },
});

const iconBgClass = computed(() => {
  const map = {
    primary: 'bg-blue-50 text-blue-600',
    warning: 'bg-amber-50 text-amber-600',
    positive: 'bg-green-50 text-green-600',
    positiveDark: 'bg-green-100 text-green-900',
    negative: 'bg-red-50 text-red-600',
  };
  return map[props.iconColor] || map.primary;
});
</script>

<style scoped>
.card-dashboard {
  transition: transform 0.2s;
}

.card-dashboard:hover {
  transform: translateY(-1px);
}

@media (max-width: 1269px) {
  .card-dashboard {
    padding: 0.5rem !important;
  }

  .card-dashboard :deep(.q-card__section) {
    padding: 0.75rem !important;
  }

  .card-dashboard :deep(.text-caption) {
    font-size: 0.75rem;
  }

  .card-dashboard :deep(.text-h4) {
    font-size: 1.25rem;
  }

  .card-dashboard :deep(.q-icon) {
    font-size: 1.2rem;
  }
}

</style>