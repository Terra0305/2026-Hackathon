<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '../../data/mockData'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Native client-side check
if (!authStore.isAuthenticated || !authStore.user?.isAdmin) {
  router.push('/')
}

const searchQuery = ref('')

const filteredUsers = computed(() => {
  return mockUsers.filter(u => 
    u.nickname.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div class="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col gap-2">
         <span class="px-2.5 py-1 rounded w-max text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20">BACKOFFICE / USERS</span>
         <h1 class="text-3xl font-outfit font-bold tracking-tight text-white flex items-center gap-3">
           사용자 관리
         </h1>
         <p class="text-sync-muted text-sm font-medium">플랫폼에 가입한 빌더들을 조회하고 관리합니다.</p>
      </div>

      <div class="relative w-full md:w-80">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted z-10 pointer-events-none">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="닉네임, 역할 검색" class="w-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-sync-border rounded-xl py-3 pl-11 pr-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary transition-colors shadow-sm">
      </div>
    </div>

    <!-- Users Grid -->
    <div class="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-sync-border bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-2xl">
       <div class="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-sync-border bg-black/10 dark:bg-white/5">
         <div class="col-span-4 text-[11px] font-bold text-sync-muted uppercase tracking-widest">Builder</div>
         <div class="col-span-3 text-[11px] font-bold text-sync-muted uppercase tracking-widest text-center">Tech Stack</div>
         <div class="col-span-3 text-[11px] font-bold text-sync-muted uppercase tracking-widest text-center">Points & Rank</div>
         <div class="col-span-2 text-[11px] font-bold text-sync-muted uppercase tracking-widest text-right">Status</div>
       </div>

       <div v-for="user in filteredUsers" :key="user.id" class="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-6 border-b border-sync-border last:border-0 items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
         <div class="col-span-4 flex items-center gap-4 min-w-0">
           <div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white dark:border-[#22252D]">
             <img :src="user.avatar" class="w-full h-full object-cover" />
           </div>
           <div class="flex flex-col gap-1 w-full min-w-0">
             <div class="flex items-center gap-1.5 w-full">
               <h3 class="text-sm font-bold text-sync-text truncate">{{ user.nickname }}</h3>
               <span v-for="(badge, bIdx) in user.badges" :key="bIdx">{{ badge }}</span>
             </div>
             <span class="text-[11px] text-sync-muted font-bold truncate">{{ user.role }}</span>
           </div>
         </div>

         <div class="col-span-3 flex justify-center mt-2 md:mt-0 flex-wrap gap-1.5">
            <template v-if="user.techStack && user.techStack.length">
               <span v-for="(tech, i) in user.techStack.slice(0,2)" :key="i" class="px-2 py-0.5 rounded text-[10px] bg-black/5 border border-sync-border text-sync-text">
                 {{ tech }}
               </span>
               <span v-if="user.techStack.length > 2" class="px-2 py-0.5 border border-sync-border text-[10px] text-sync-muted rounded bg-black/5">+{{ user.techStack.length - 2 }}</span>
            </template>
            <span v-else class="text-[11px] text-sync-muted italic">미입력</span>
         </div>

         <div class="col-span-3 flex flex-col items-center justify-center mt-2 md:mt-0 text-[11px] gap-1 font-bold">
            <span class="text-sync-primary">🎯 {{ user.points?.toLocaleString() || 0 }} XP</span>
            <span class="text-sync-muted border-t border-sync-border px-4 block pt-1">Rank {{ user.rank }}</span>
         </div>

         <div class="col-span-2 flex items-center justify-end gap-2 mt-4 md:mt-0">
            <span class="px-3 py-1 rounded w-max text-[10px] font-bold uppercase tracking-widest transition-colors"
                  :class="user.status === 'up' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'">
              {{ user.status === 'up' ? 'ACTIVE' : 'INACTIVE' }}
            </span>
         </div>
       </div>

       <div v-if="filteredUsers.length === 0" class="py-24 text-center flex flex-col gap-3">
         <span class="text-4xl">❌</span>
         <p class="text-sync-muted text-sm font-bold">조건에 맞는 사용자가 없습니다.</p>
       </div>
    </div>
  </div>
</template>
