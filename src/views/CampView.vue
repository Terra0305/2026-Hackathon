<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { mockTeams } from '../data/mockData'
import { ref, computed } from 'vue'

const route = useRoute()
const currentRole = ref('all')
const searchQuery = ref('')
const joinedTeams = ref(new Set()) // Local mockup tracking

const handleJoin = (teamId) => {
  joinedTeams.value.add(teamId)
}

const filteredTeams = computed(() => {
  const queryHackId = route.query.hackathonId ? parseInt(route.query.hackathonId) : null
  
  return mockTeams.filter(team => {
    const matchRole = currentRole.value === 'all' || team.roles.some(r => r.name.includes(currentRole.value) || currentRole.value.includes(r.name))
    const matchQuery = !searchQuery.value || team.teamName.toLowerCase().includes(searchQuery.value.toLowerCase()) || team.hackathonTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchHackathon = queryHackId ? team.hackathonId === queryHackId : true
    
    return matchRole && matchQuery && matchHackathon
  })
})
</script>

<template>
  <div class="flex flex-col gap-8 pb-32 transition-colors duration-300 relative pt-4">
    <!-- Ambient Background Effects for this page -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-sync-primary/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>
    <div class="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-400/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>

    <div class="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-sync-border pb-6 transition-colors duration-300">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-outfit font-bold text-sync-text tracking-tight transition-colors">Project Camp</h1>
        <p class="text-sync-muted transition-colors">최고의 팀원들을 만나 새로운 프로젝트를 시작하세요.</p>
      </div>
      <RouterLink to="/camp/create" class="px-6 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        새로운 팀 포스팅
      </RouterLink>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
      <div class="relative w-full md:w-96">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="팀명, 해커톤 이름 검색" class="w-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary transition-colors shadow-sm">
      </div>
      
      <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
        <button @click="currentRole = 'all'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm transition-colors border" :class="currentRole === 'all' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">전체 역할</button>
        <button @click="currentRole = '기획자'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '기획자' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">기획자</button>
        <button @click="currentRole = '디자이너'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '디자이너' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">디자이너</button>
        <button @click="currentRole = '프론트엔드'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '프론트엔드' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">프론트엔드</button>
        <button @click="currentRole = '백엔드'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '백엔드' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">백엔드</button>
      </div>
    </div>

    <!-- Recruitment Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div v-if="filteredTeams.length === 0" class="col-span-full py-16 text-center text-sync-muted font-medium">검색된 팀 모집 공고가 없습니다. 새로운 팀을 포스팅해보세요!</div>

      <div 
        v-for="team in filteredTeams" 
        :key="team.id"
        class="glass-card glass-card-hover p-8 flex flex-col gap-6 group cursor-pointer relative overflow-hidden"
      >
        <div class="flex items-start justify-between z-10 w-full">
          <div class="flex items-center gap-4">
             <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr shadow-inner flex items-center justify-center text-xl" :class="team.theme">{{ team.icon }}</div>
             <div class="flex flex-col gap-1.5">
               <span class="px-2 py-0.5 bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 text-[10px] font-bold uppercase tracking-widest rounded w-max border border-teal-200 dark:border-teal-500/20 transition-colors">{{ team.status }}</span>
               <h3 class="text-lg font-bold text-sync-text group-hover:text-sync-primary transition-colors">{{ team.teamName }}</h3>
             </div>
          </div>
        </div>
        
        <div class="flex flex-col gap-1 z-10">
           <p class="text-[10px] font-bold text-sync-primary uppercase tracking-widest">목표 해커톤</p>
           <h4 class="text-xs font-bold text-sync-text underline decoration-sync-border underline-offset-4">{{ team.hackathonTitle }}</h4>
        </div>

        <p class="text-sm text-sync-muted leading-relaxed line-clamp-3 transition-colors mt-2 z-10">
          {{ team.description }}
        </p>

        <div class="flex flex-col gap-3 z-10 mt-2">
          <p class="text-[10px] font-bold text-sync-muted uppercase tracking-widest transition-colors">REQUIRED ROLES</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="(role, idx) in team.roles" :key="idx" class="px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-sync-border rounded-lg text-xs font-bold text-sync-text transition-colors">
               {{ role.name }} <span class="text-sync-muted ml-0.5 text-[10px]">{{ role.current }}/{{ role.total }}</span>
            </span>
          </div>
        </div>

        <div class="mt-auto pt-6 flex items-center justify-between border-t border-sync-border transition-colors z-10 w-full">
          <div class="flex -space-x-3">
            <div v-for="(member, mIdx) in team.members" :key="mIdx" class="w-8 h-8 rounded-full border-2 border-white dark:border-[#181A20] overflow-hidden bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-800" :style="{ zIndex: 10 - mIdx }">{{ member }}</div>
          </div>
          <div class="flex gap-2">
             <button 
               v-if="!joinedTeams.has(team.id)"
               @click.stop="handleJoin(team.id)"
               class="px-5 py-2.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-xs font-bold transition-all shadow-[0_4px_10px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">
               팀 합류하기
             </button>
             <button
               v-else
               @click.stop="joinedTeams.delete(team.id)"
               class="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
             >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                합류 요청 취소
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.3);
  border-radius: 4px;
}
</style>
