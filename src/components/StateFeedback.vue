<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  empty: {
    type: Boolean,
    default: false
  },
  error: {
    type: [Boolean, String],
    default: false
  },
  emptyMessage: {
    type: String,
    default: "표시할 데이터가 없습니다."
  }
})
</script>

<template>
  <div class="w-full">
    <!-- 1. Loading State -->
    <div v-if="loading" class="w-full flex flex-col items-center justify-center py-24 gap-4 animate-[fadeIn_0.5s_ease-out]">
      <div class="w-10 h-10 border-4 border-white/10 border-t-sync-primary rounded-full animate-spin"></div>
      <p class="text-sm text-sync-muted font-medium">데이터를 불러오는 중입니다...</p>
    </div>

    <!-- 2. Error State -->
    <div v-else-if="error" class="w-full flex flex-col items-center justify-center py-24 gap-4 text-center animate-[fadeIn_0.5s_ease-out]">
      <div class="text-5xl drop-shadow-[0_0_12px_rgba(229,62,62,0.4)] mb-2">⚠️</div>
      <h3 class="text-lg font-bold text-white">오류가 발생했습니다</h3>
      <p class="text-sm text-sync-muted max-w-sm">{{ typeof error === 'string' ? error : '데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' }}</p>
      <button class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium mt-2 transition-colors" @click="$emit('retry')">다시 시도</button>
    </div>

    <!-- 3. Empty State -->
    <div v-else-if="empty" class="w-full flex flex-col items-center justify-center py-24 gap-4 text-center animate-[fadeIn_0.5s_ease-out]">
      <div class="text-5xl opacity-80 mb-2">📭</div>
      <h3 class="text-lg font-bold text-white">결과 없음</h3>
      <p class="text-sm text-sync-muted max-w-sm">{{ emptyMessage }}</p>
    </div>

    <!-- 4. Content -->
    <div v-else class="w-full animate-[fadeIn_0.4s_ease-out]">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
