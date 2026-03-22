<template>
  <component 
    :is="props.as"
    class="glow-card" 
    :class="[props.class, props.hoverable ? 'glow-card-hover' : '']"
  >
    <div class="glow-card-content" :class="props.contentClass">
      <slot />
    </div>
  </component>
</template>

<script setup>
const props = defineProps({
  as: {
    type: [String, Object],
    default: 'div'
  },
  class: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  hoverable: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
/* Scoped styles if needed, but mostly uses global main.css classes */
</style>
