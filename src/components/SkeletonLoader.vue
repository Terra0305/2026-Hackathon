<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'card', // 'card', 'list', 'text', 'avatar'
    validator: (value) => ['card', 'list', 'text', 'avatar', 'glow-card'].includes(value)
  },
  count: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <div v-for="i in count" :key="`skel-${type}-${i}`" class="animate-pulse">
      
      <!-- Hackathon / Glow Card Skeleton -->
      <div v-if="type === 'glow-card'" class="w-full rounded-[2rem] bg-white/5 border border-sync-border h-[400px] overflow-hidden flex flex-col relative">
         <div class="h-52 bg-white/10 w-full relative overflow-hidden">
           <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
         </div>
         <div class="p-8 flex flex-col gap-4 flex-1 justify-center">
            <div class="flex justify-between items-center w-full">
              <div class="h-4 w-16 bg-white/10 rounded-full"></div>
              <div class="h-6 w-20 bg-white/10 rounded"></div>
            </div>
            <div class="h-8 w-3/4 bg-white/10 rounded-xl mt-2"></div>
            <div class="h-6 w-1/2 bg-white/10 rounded mt-1"></div>
            <div class="mt-auto pt-6 flex justify-between items-center border-t border-white/5">
              <div class="h-4 w-24 bg-white/10 rounded"></div>
              <div class="h-4 w-32 bg-white/10 rounded"></div>
            </div>
         </div>
      </div>

      <!-- Camp / Ranking List Item Skeleton -->
      <div v-else-if="type === 'list'" class="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-sync-border">
         <div class="flex items-center gap-4 w-2/3">
            <div class="w-12 h-12 rounded-full bg-white/10 flex-shrink-0"></div>
            <div class="flex flex-col gap-2 w-full">
               <div class="h-5 w-1/2 bg-white/10 rounded"></div>
               <div class="h-3 w-1/3 bg-white/10 rounded"></div>
            </div>
         </div>
         <div class="h-10 w-24 bg-white/10 rounded-xl"></div>
      </div>

      <!-- Simple Text Line -->
      <div v-else-if="type === 'text'" class="h-4 bg-white/10 rounded w-full"></div>

      <!-- Avatar Core -->
      <div v-else-if="type === 'avatar'" class="h-16 w-16 bg-white/10 rounded-full"></div>

    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
