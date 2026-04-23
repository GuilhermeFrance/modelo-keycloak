<template>
  <label class="text-xs font-semibold text-slate-500 uppercase mb-1 block">
    <slot></slot>
    <span v-if="required" class="text-red-500 ml-1">*</span>
  </label>
</template>

<script setup>
defineProps({
  required: {
    type: Boolean,
    default: false
  },
  colorClass: {
    type: String,
    default: 'text-neutral-950' 
  }
})
</script>
