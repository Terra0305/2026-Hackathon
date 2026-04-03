<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { mockHackathons, mockGlobalSubmissions } from '../../data/mockData'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

if (!authStore.isAuthenticated || !authStore.user?.isAdmin) {
  router.push('/')
}

const hackathonId = parseInt(route.params.id)
const targetHackathon = computed(() => mockHackathons.find(h => h.id === hackathonId))

const submissions = computed(() => {
  return mockGlobalSubmissions.filter(s => s.hackathonId === hackathonId)
})
</script>

<template>
  <div class="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
    <div class="flex flex-col gap-4 border-b border-sync-border pb-8">
      <RouterLink to="/admin" class="text-sync-muted hover:text-white transition-colors text-sm font-bold flex items-center gap-1 w-max">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        대시보드로 돌아가기
      </RouterLink>
      
      <div v-if="targetHackathon" class="flex flex-col gap-2">
        <span class="px-2.5 py-1 rounded w-max text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20">제출 자료 관리</span>
        <h1 class="text-3xl lg:text-4xl font-outfit font-black tracking-tight text-white mt-2">{{ targetHackathon.title }}</h1>
        <p class="text-sync-muted text-sm font-medium mt-1">이 대회에서 최종 개발물을 제출한 팀들의 산출물 내역입니다.</p>
      </div>
      <div v-else class="text-red-500">해당 해커톤을 찾을 수 없습니다.</div>
    </div>

    <!-- Submissions List -->
    <div v-if="submissions.length > 0" class="flex flex-col gap-6">
       <div v-for="sub in submissions" :key="sub.id" class="p-6 md:p-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-sync-border flex flex-col md:flex-row gap-8 shadow-sm">
         
         <div class="flex-1 flex flex-col gap-4 min-w-0">
           <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-lg shadow-inner">🏆</div>
             <div class="flex flex-col">
               <h3 class="text-lg font-bold text-sync-text">{{ sub.teamName }}</h3>
               <span class="text-[11px] text-sync-muted tracking-wide font-bold">제출일: {{ sub.submittedAt }}</span>
             </div>
           </div>
           
           <div class="mt-2 bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-sync-border">
             <h4 class="font-bold text-sm text-sync-primary mb-1 underline decoration-sync-border underline-offset-4">{{ sub.projectName }}</h4>
             <p class="text-[13px] text-sync-muted leading-relaxed whitespace-pre-line">{{ sub.description }}</p>
           </div>
         </div>

         <div class="w-full md:w-64 flex flex-col gap-4 shrink-0 border-t md:border-t-0 md:border-l border-sync-border pt-6 md:pt-0 md:pl-8">
           <div class="flex flex-col gap-2">
             <h5 class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">저장소 링크</h5>
             <a v-for="(link, i) in sub.links" :key="'link-'+i" :href="link" target="_blank" class="text-sm font-bold text-sync-text hover:text-sync-primary transition-colors flex items-center gap-2 max-w-full">
               <svg class="w-4 h-4 text-sync-muted shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
               <span class="truncate">{{ link.replace('https://', '') }}</span>
             </a>
           </div>
           
           <div class="flex flex-col gap-2 mt-2">
             <h5 class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">첨부 파일</h5>
             <button v-for="(file, i) in sub.files" :key="'file-'+i" class="w-full flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors group">
               <div class="flex items-center gap-2 min-w-0">
                 <svg class="w-4 h-4 text-sync-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                 <span class="text-[11px] font-bold text-sync-text truncate">{{ file.name }}</span>
               </div>
               <span class="text-[9px] text-sync-muted shrink-0">{{ file.size }}</span>
             </button>
           </div>
         </div>

       </div>
    </div>
    
    <div v-else class="py-24 text-center flex flex-col items-center justify-center gap-4 bg-black/5 dark:bg-white/5 rounded-[2rem] border border-sync-border">
      <span class="text-5xl">📭</span>
      <p class="text-sync-muted text-sm font-bold">아직 제출한 팀이 없습니다.</p>
    </div>
  </div>
</template>
