<template>
  <div 
    ref="containerRef" 
    class="glow-card-container" 
    :class="props.class"
    @mousemove="handleMouseMove"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})

const containerRef = ref(null)
let rafId = null

const handleMouseMove = (e) => {
  if (rafId) return
  
  rafId = requestAnimationFrame(() => {
    if (!containerRef.value) return
    
    const cards = containerRef.value.querySelectorAll('.glow-card')
    for (const card of cards) {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    }
    rafId = null
  })
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* Any specific styles for the container if needed */
</style>
