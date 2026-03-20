<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useDbStore } from '../stores/db'

const db = useDbStore()

const statusFilter = ref('all')
const categoryFilters = ref([])
const availableCategories = ['AI', 'SECURITY', 'WEB3', 'BACKEND', 'FRONTEND']

const toggleCategory = (cat) => {
  const idx = categoryFilters.value.indexOf(cat)
  if (idx > -1) categoryFilters.value.splice(idx, 1)
  else categoryFilters.value.push(cat)
}

const filteredHackathons = computed(() => {
  return db.hackathons.filter(h => {
    if (statusFilter.value === 'ongoing' && h.status !== 'ongoing') return false
    if (statusFilter.value === 'ended' && h.status !== 'ended') return false
    
    if (categoryFilters.value.length > 0) {
      const matches = h.tags.some(t => categoryFilters.value.includes(t))
      if (!matches) return false
    }
    return true
  })
})
</script>

<template>
  <div class="flex flex-col gap-8 pb-24">
    <div class="flex items-end justify-between border-b border-white/5 pb-4">
      <h1 class="text-4xl font-outfit font-bold text-white tracking-tight">Explore</h1>
      <p class="text-sm text-sync-muted">{{ filteredHackathons.length }} Hackathons found</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 items-start">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-64 flex flex-col gap-6 flex-shrink-0">
        <!-- Status Filter -->
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-5">
          <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest mb-4">STATUS</h3>
          <div class="flex flex-col gap-2">
            <button @click="statusFilter = 'all'" :class="[statusFilter === 'all' ? 'bg-sync-primary text-white shadow-[0_4px_12px_rgba(50,132,255,0.2)]' : 'text-sync-muted hover:text-white hover:bg-white/5', 'w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors']">전체</button>
            <button @click="statusFilter = 'ongoing'" :class="[statusFilter === 'ongoing' ? 'bg-sync-primary text-white shadow-[0_4px_12px_rgba(50,132,255,0.2)]' : 'text-sync-muted hover:text-white hover:bg-white/5', 'w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors']">진행 중</button>
            <button @click="statusFilter = 'ended'" :class="[statusFilter === 'ended' ? 'bg-sync-primary text-white shadow-[0_4px_12px_rgba(50,132,255,0.2)]' : 'text-sync-muted hover:text-white hover:bg-white/5', 'w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors']">종료</button>
          </div>
        </div>

        <!-- Categories Filter -->
        <div class="bg-[#181A20] rounded-2xl border border-white/5 p-5">
          <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest mb-4">CATEGORIES</h3>
          <div class="flex flex-col gap-3">
            <label v-for="cat in availableCategories" :key="cat" class="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" :value="cat" class="hidden" @change="toggleCategory(cat)" :checked="categoryFilters.includes(cat)" />
              <div :class="[categoryFilters.includes(cat) ? 'bg-sync-primary border-sync-primary' : 'bg-transparent border-white/20 group-hover:border-white/40', 'w-4 h-4 rounded border flex items-center justify-center transition-colors']">
                <svg v-if="categoryFilters.includes(cat)" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span :class="[categoryFilters.includes(cat) ? 'text-white' : 'text-sync-muted group-hover:text-white', 'text-sm transition-colors']">{{ cat }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Main Grid -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouterLink v-for="h in filteredHackathons" :key="h.id" :to="`/hackathons/${h.slug}`" class="bg-[#181A20] rounded-2xl border border-white/5 overflow-hidden group hover:-translate-y-1 hover:border-white/10 transition-all shadow-sm flex flex-col">
          <div class="h-[200px] w-full bg-gradient-to-br from-[#22252D] to-[#13151A] border-b border-white/5 flex items-center justify-center relative overflow-hidden">
             <div class="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0iI2ZmZiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
             <div class="text-center z-10">
              <h2 class="text-2xl font-outfit font-bold text-white tracking-widest mb-1 drop-shadow-lg uppercase">{{ h.title }}</h2>
              <p class="text-[9px] text-white/50 tracking-[0.2em] uppercase">{{ h.tags.join(' · ') }}</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span v-if="h.status === 'ongoing'" class="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-widest rounded">진행 중</span>
              <span v-else-if="h.status === 'upcoming'" class="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded">모집 중</span>
              <span v-else class="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest rounded border border-white/5">종료</span>
              
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest truncate max-w-[150px]">{{ h.tags[0] }}</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-sync-primary transition-colors">{{ h.title }}</h3>
            </div>
            <div class="flex flex-col gap-2 text-xs text-sync-muted mt-2">
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ h.startDate }} ~ {{ h.endDate }}</span>
              <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 참가자 {{ h.participants }}명</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
