<script setup>
import { RouterLink } from 'vue-router'
import { mockHackathons } from '../data/mockData'
import { ref, computed } from 'vue'

const currentTab = ref('all')

const filteredHackathons = computed(() => {
  if (currentTab.value === 'all') return mockHackathons;
  if (currentTab.value === 'on') return mockHackathons.filter(h => h.status === '진행 중');
  if (currentTab.value === 'pre') return mockHackathons.filter(h => h.status === '예정' || h.status === '모집 중');
  if (currentTab.value === 'end') return mockHackathons.filter(h => h.status === '종료' || h.status === '마감');
  return mockHackathons;
})
</script>

<template>
  <div class="flex flex-col gap-8 pb-32 transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-sync-border pb-6 transition-colors duration-300">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-outfit font-bold text-sync-text tracking-tight transition-colors">Hackathons</h1>
        <p class="text-sync-muted transition-colors">전 세계의 뛰어난 사람들과 함께 아이디어를 실현하세요.</p>
      </div>
      <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
        <button @click="currentTab = 'all'" class="px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors" :class="currentTab === 'all' ? 'bg-sync-primary text-white shadow-[0_4px_14px_rgba(50,132,255,0.3)]' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-sync-muted hover:text-sync-text'">All</button>
        <button @click="currentTab = 'on'" class="px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors" :class="currentTab === 'on' ? 'bg-sync-primary text-white shadow-[0_4px_14px_rgba(50,132,255,0.3)]' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-sync-muted hover:text-sync-text'">진행 중</button>
        <button @click="currentTab = 'pre'" class="px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors" :class="currentTab === 'pre' ? 'bg-sync-primary text-white shadow-[0_4px_14px_rgba(50,132,255,0.3)]' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-sync-muted hover:text-sync-text'">모집 중/예정</button>
        <button @click="currentTab = 'end'" class="px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors" :class="currentTab === 'end' ? 'bg-sync-primary text-white shadow-[0_4px_14px_rgba(50,132,255,0.3)]' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-sync-muted hover:text-sync-text'">종료</button>
      </div>
    </div>

    <!-- Grid Layout mapping the computed filtered array -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       
       <div v-if="filteredHackathons.length === 0" class="col-span-full py-16 text-center text-sync-muted font-medium border border-dashed border-sync-border rounded-2xl glass-card">해당 상태에 존재하는 해커톤이 없습니다. 다른 필터를 선택하세요.</div>

       <RouterLink 
          v-for="hackathon in filteredHackathons" 
          :key="hackathon.id"
          :to="`/hackathons/${hackathon.id}`" 
          class="glass-card glass-card-hover p-6 flex flex-col gap-6 group cursor-pointer"
        >
        
        <div class="h-40 rounded-2xl bg-gradient-to-br flex flex-col p-5 relative overflow-hidden transition-all duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]" :class="hackathon.bgGradient">
           <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
           <div class="z-10 flex justify-between items-start">
              <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">{{ hackathon.type }}</span>
              <div class="flex gap-1" v-if="hackathon.status === '진행 중'">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              </div>
           </div>
           
           <div class="mt-auto z-10 flex flex-col">
              <span class="text-white/60 text-[10px] font-bold uppercase tracking-widest">{{ hackathon.subText }}</span>
              <h3 class="text-2xl font-outfit font-black text-white drop-shadow-sm">{{ hackathon.heroText }}</h3>
           </div>
           <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-bold text-sync-text group-hover:text-sync-primary transition-colors">{{ hackathon.title }}</h4>
          </div>
          <div class="flex items-center gap-2 text-xs font-bold text-sync-muted">
             <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ hackathon.endDate }} 마감</span>
             <span class="w-1 h-1 rounded-full bg-sync-border"></span>
             <span class="flex items-center gap-1 text-sync-text"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> {{ hackathon.participants.toLocaleString() }}명 참여</span>
          </div>
        </div>

        <div class="mt-auto pt-4 flex items-center justify-between border-t border-sync-border transition-colors">
           <div class="flex items-center gap-2">
             <span class="relative flex h-2 w-2">
               <span v-if="hackathon.status === '진행 중'" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="'bg-' + hackathon.statusColor + '-400'"></span>
               <span class="relative inline-flex rounded-full h-2 w-2" :class="'bg-' + hackathon.statusColor + '-500'"></span>
             </span>
             <span class="text-xs font-bold text-sync-text">{{ hackathon.status }}</span>
           </div>
           <svg class="w-5 h-5 text-sync-muted group-hover:text-sync-primary transition-colors group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </div>
      </RouterLink>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 0px;
}
</style>
