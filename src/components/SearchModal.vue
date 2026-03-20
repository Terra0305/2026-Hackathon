<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockHackathons } from '../data/mockData'

const emit = defineEmits(['close'])
const router = useRouter()
const query = ref('')

const filteredResults = computed(() => {
  if (!query.value) return []
  const lowerQuery = query.value.toLowerCase()
  return mockHackathons.filter(h => 
    h.title.toLowerCase().includes(lowerQuery) || 
    h.type.toLowerCase().includes(lowerQuery)
  )
})

const navigateTo = (id) => {
  emit('close')
  router.push(`/hackathons/${id}`)
}

// Close on Escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden' // Prevent page scrolling
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="fixed inset-0 z-[100] flex flex-col items-center pt-[15vh] px-4 transition-all duration-300">
    <!-- Glowing Backdrop -->
    <div class="absolute inset-0 bg-white/20 dark:bg-black/50 backdrop-blur-xl transition-colors duration-300" @click="emit('close')"></div>
    
    <!-- Modal Content (Glassmorphism) -->
    <div class="relative w-full max-w-2xl bg-white/70 dark:bg-[#181A20]/80 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-[0_32px_64px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transform transition-all">
      
      <!-- Search Input Header -->
      <div class="flex items-center px-6 py-5 border-b border-sync-border bg-white/40 dark:bg-white/5">
        <svg class="w-6 h-6 text-sync-muted mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input 
          v-model="query"
          type="text" 
          placeholder="해커톤 컨퍼런스, 기술, 분야 등 검색..." 
          class="flex-1 bg-transparent border-none text-xl text-sync-text placeholder-sync-muted focus:outline-none focus:ring-0"
          autofocus
        >
        <button @click="emit('close')" class="px-2 py-1 bg-black/5 dark:bg-white/10 text-sync-muted rounded text-[10px] font-bold ml-4 hover:text-sync-text transition-colors">ESC</button>
      </div>

      <!-- Results Area -->
      <div class="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
        <!-- Empty State (No query) -->
        <div v-if="!query" class="py-12 text-center text-sync-muted">
          <p class="text-sm font-bold mb-2">추천 검색어</p>
          <div class="flex flex-wrap justify-center gap-2 mt-4">
            <button @click="query = 'AI'" class="px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg text-xs font-bold hover:bg-sync-primary hover:text-white transition-colors"># AI</button>
            <button @click="query = '보안'" class="px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg text-xs font-bold hover:bg-sync-primary hover:text-white transition-colors"># 보안</button>
            <button @click="query = 'Web3'" class="px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg text-xs font-bold hover:bg-sync-primary hover:text-white transition-colors"># Web3</button>
          </div>
        </div>

        <!-- No Results State -->
        <div v-else-if="filteredResults.length === 0" class="py-12 text-center text-sync-muted">
          <div class="text-4xl mb-4">🔍</div>
          <p class="font-medium text-sync-text">검색 결과가 없습니다.</p>
          <p class="text-xs mt-1">다른 키워드로 검색해보세요.</p>
        </div>

        <!-- Results List -->
        <div v-else class="flex flex-col gap-2">
          <button 
            v-for="hackathon in filteredResults" 
            :key="hackathon.id"
            @click="navigateTo(hackathon.id)"
            class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-left group"
          >
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br shadow-inner shrink-0" :class="hackathon.bgGradient">
              <span class="text-white font-bold opacity-95 text-lg">{{ hackathon.heroText.charAt(0) }}</span>
            </div>
            <div class="flex flex-col flex-1">
              <span class="text-[10px] font-bold text-sync-primary mb-0.5 tracking-widest">{{ hackathon.type }}</span>
              <h4 class="text-base font-bold text-sync-text group-hover:text-sync-primary transition-colors">{{ hackathon.title }}</h4>
            </div>
            <div class="hidden sm:flex items-center gap-3 text-[11px] font-bold text-sync-muted">
              <span>{{ hackathon.startDate }}</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform text-sync-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.3);
  border-radius: 10px;
}
</style>
