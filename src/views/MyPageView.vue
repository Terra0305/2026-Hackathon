<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { mockUsers, mockMyHackathons, mockMySubmissions, mockMyActivities } from '../data/mockData'

const activeMenu = ref('dashboard')
const user = mockUsers[0] // 건축가_Kim Mockup Base

const menus = [
  { id: 'dashboard', name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'participating', name: '참여 중인 해커톤 & 팀', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'submissions', name: '프로젝트 제출 내역', icon: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z' },
  { id: 'activities', name: '활동 내역 보드', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
]
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-8 pb-32 transition-colors duration-300 relative w-full pt-4">
    <!-- Global ambient background -->
    <div class="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>
    <div class="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>

    <!-- Left Sidebar Navigation Layout -->
    <div class="w-full lg:w-80 flex flex-col shrink-0 gap-6">
      
      <!-- Profile Status Card -->
      <div class="glass-card p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden group border border-sync-border">
         <div class="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mix-blend-overlay"></div>
         <div class="w-24 h-24 rounded-full border-4 border-sync-card bg-slate-200 z-10 shrink-0 overflow-hidden shadow-[0_4px_16px_rgba(50,132,255,0.2)] transition-transform group-hover:scale-105">
           <img :src="user.avatar" alt="avatar" class="w-full h-full object-cover">
         </div>
         <div class="flex flex-col gap-1.5 z-10 mt-2">
           <h2 class="text-xl font-bold text-sync-text tracking-tight">{{ user.nickname }} <span class="text-xs font-bold px-2 py-0.5 ml-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded-full">상위 {{ user.rank }}%</span></h2>
           <p class="text-[13px] text-sync-muted font-medium">{{ user.role }}</p>
         </div>
         <div class="flex items-center gap-2 z-10 text-xs font-bold w-full bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-sync-border justify-center">
            <span class="text-yellow-600 dark:text-yellow-500 tracking-wider">🏆 {{ user.points.toLocaleString() }} PTS</span>
         </div>
         <div class="flex flex-wrap gap-2.5 mt-2 z-10 justify-center">
           <span v-for="badge in user.badges" :key="badge" class="w-9 h-9 rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 flex items-center justify-center text-base shadow-sm hover:-translate-y-1 transition-transform cursor-help shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">{{ badge }}</span>
         </div>
      </div>

      <!-- Navigation Router List -->
      <nav class="glass-card p-4 flex lg:flex-col gap-2 overflow-x-auto custom-scrollbar sticky top-24">
         <button 
           v-for="menu in menus" 
           :key="menu.id"
           @click="activeMenu = menu.id"
           class="flex items-center gap-3.5 px-5 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0 border outline-none focus:outline-none focus:ring-0"
           :class="activeMenu === menu.id ? 'bg-sync-primary/10 border-sync-primary/20 text-sync-primary shadow-[inset_0_0_12px_rgba(50,132,255,0.1)]' : 'border-transparent text-sync-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-sync-text'"
         >
           <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menu.icon"></path></svg>
           {{ menu.name }}
         </button>
      </nav>
    </div>

    <!-- Main Dynamic Content Dashboard Area -->
    <div class="flex-1 flex flex-col gap-6">
       
       <!-- O1. Dashboard Outline Tab -->
       <div v-if="activeMenu === 'dashboard'" class="flex flex-col gap-6 animate-fade-in">
          <div class="glass-card p-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden">
             <!-- ambient internal styling -->
             <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] mix-blend-overlay"></div>
             
             <h2 class="text-3xl font-outfit font-black text-sync-text tracking-tight mb-2 drop-shadow-sm">Welcome Back, {{ user.nickname }}!</h2>
             <p class="text-sync-muted text-[15px] font-medium leading-relaxed max-w-xl">현재 안전하게 연결되어 있습니다. 이번 달 활동 점수가 상위 1%에 성공적으로 진입했습니다. 열정을 응원합니다!</p>
          </div>
          
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="glass-card p-8 flex flex-col items-center text-center justify-center gap-3 transition-colors border border-sync-border shadow-sm group hover:-translate-y-1">
              <span class="text-4xl font-black text-sync-text drop-shadow-sm">{{ mockMyHackathons.length }}</span>
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">참여 중</span>
            </div>
            <div class="glass-card p-8 flex flex-col items-center text-center justify-center gap-3 transition-colors border border-sync-border shadow-sm group hover:-translate-y-1">
              <span class="text-4xl font-black text-sync-text drop-shadow-sm">{{ mockMySubmissions.length }}</span>
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">누적 제출</span>
            </div>
            <div class="glass-card p-8 flex flex-col items-center text-center justify-center gap-3 transition-colors border border-sync-border shadow-sm group hover:-translate-y-1">
              <span class="text-4xl font-black text-yellow-500 drop-shadow-sm">4</span>
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">수상이력</span>
            </div>
            <div class="glass-card p-8 flex flex-col items-center text-center justify-center gap-3 transition-colors border border-sync-border shadow-sm group hover:-translate-y-1">
              <span class="text-4xl font-black text-sync-text drop-shadow-sm">{{ user.rank }}%</span>
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">글로벌 랭킹</span>
            </div>
          </div>
          
          <div class="glass-card p-8">
            <h3 class="font-outfit text-xl font-bold text-sync-text mb-4">최근 나의 활동</h3>
            <div class="bg-black/5 dark:bg-white/5 border border-sync-border rounded-2xl p-6 text-sm text-sync-muted cursor-pointer hover:bg-black/10 transition-colors">
               🚀 'Sync Web3 넥서스' 결과물 Github 코드와 함께 제출 완료 (2026.03.22)
            </div>
          </div>
       </div>

       <!-- O2. Participating Hub Tab -->
       <div v-if="activeMenu === 'participating'" class="flex flex-col gap-6 animate-fade-in">
          <h2 class="text-2xl font-outfit font-black text-sync-text tracking-tight ml-2">참여 중인 해커톤 / 진행 중인 팀</h2>
          <div class="grid grid-cols-1 gap-5">
             <div v-if="mockMyHackathons.length === 0" class="py-16 text-center text-sync-muted border border-dashed border-sync-border rounded-2xl glass-card">아직 참여 중인 해커톤이 없습니다.</div>
             
             <div v-for="hack in mockMyHackathons" :key="hack.id" class="glass-card p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:border-sync-primary/40 transition-colors">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors shadow-sm" :class="hack.status === '진행 중' ? 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'">{{ hack.status }}</span>
                    <span class="text-[11px] text-sync-muted font-bold">지원 일자: {{ hack.appliedDate }}</span>
                  </div>
                  <h3 class="text-xl font-bold text-sync-text mt-1">{{ hack.title }}</h3>
                  <div class="flex items-center gap-2.5 text-sm text-sync-muted mt-1">
                    <span class="font-bold underline decoration-sync-border underline-offset-4">{{ hack.role }}</span>
                    <span v-if="hack.teamName" class="w-1.5 h-1.5 rounded-full bg-sync-border"></span>
                    <span v-if="hack.teamName" class="font-bold text-sync-text">{{ hack.teamName }} 팀 소속</span>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row justify-end gap-3 shrink-0 mt-4 lg:mt-0">
                  <RouterLink :to="`/hackathons/${hack.hackathonId}`" class="px-6 py-3 min-w-[130px] shrink-0 text-center rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border text-sync-text text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">공고 열람</RouterLink>
                  <button v-if="hack.status === '진행 중'" class="px-6 py-3 min-w-[130px] shrink-0 text-center rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">작업 공간</button>
                </div>
             </div>
          </div>
       </div>

       <!-- O3. Submissions History Tab -->
       <div v-if="activeMenu === 'submissions'" class="flex flex-col gap-6 animate-fade-in">
          <h2 class="text-2xl font-outfit font-black text-sync-text tracking-tight ml-2">프로젝트 제출 관리</h2>
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
             <div v-if="mockMySubmissions.length === 0" class="col-span-full py-16 text-center text-sync-muted border border-dashed border-sync-border rounded-2xl glass-card">제출된 프로젝트 내역이 없습니다.</div>

             <div v-for="sub in mockMySubmissions" :key="sub.id" class="glass-card overflow-hidden group hover:-translate-y-1 transition-transform border border-sync-border hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
                <div class="h-36 bg-gradient-to-br flex items-center justify-center relative shadow-inner overflow-hidden" :class="sub.awardColor">
                   <div class="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                   <div class="absolute -top-10 -right-10 w-24 h-24 bg-white/20 blur-[20px] rounded-full mix-blend-overlay group-hover:scale-150 transition-transform duration-700"></div>
                   <img :src="sub.thumbnail" class="w-24 h-24 opacity-60 z-10 drop-shadow-md group-hover:scale-110 transition-transform" />
                   <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">{{ sub.award }}</div>
                </div>
                <div class="p-8 flex flex-col gap-3">
                  <p class="text-[10px] font-bold text-sync-primary uppercase tracking-widest">{{ sub.hackathonTitle }}</p>
                  <h3 class="text-xl font-bold text-sync-text leading-tight mt-1">{{ sub.projectName }}</h3>
                  <p class="text-[13px] text-sync-muted line-clamp-2 leading-relaxed mt-1 font-medium">{{ sub.description }}</p>
                  <div class="mt-6 pt-5 border-t border-sync-border flex justify-between items-center text-sm">
                    <span class="font-bold text-sync-muted">{{ sub.date }}</span>
                    <a :href="sub.link" target="_blank" class="font-bold text-sync-primary hover:text-sync-primaryHover transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sync-primary/10 border border-sync-primary/20">Source Code <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                  </div>
                </div>
             </div>
          </div>
       </div>

       <!-- O4. Activity Log Tab -->
       <div v-if="activeMenu === 'activities'" class="flex flex-col gap-6 animate-fade-in">
          <div class="flex items-center justify-between ml-2">
             <h2 class="text-2xl font-outfit font-black text-sync-text tracking-tight">글로벌 랭킹 및 활동 시퀀스</h2>
          </div>
          <div class="glass-card p-6 md:p-10">
             <div class="relative pl-8 flex flex-col gap-10 before:content-[''] before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-sync-border">
                
                <div v-if="mockMyActivities.length === 0" class="text-sync-muted text-sm py-4">활동 기록이 존재하지 않습니다.</div>

                <div v-for="act in mockMyActivities" :key="act.id" class="relative group">
                   <!-- Icon Orb -->
                   <div class="absolute -left-[45px] top-0 w-10 h-10 rounded-full border-[3px] bg-sync-card border-sync-bg flex items-center justify-center text-[15px] z-10 transition-colors shadow-sm" :class="act.iconColor">
                     {{ act.icon }}
                   </div>
                   <!-- Content List -->
                   <div class="flex flex-col gap-2 pl-4 glass-card-hover p-5 rounded-2xl border border-transparent hover:border-sync-border transition-colors">
                     <div class="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-3">
                        <h4 class="text-base font-bold text-sync-text">{{ act.title }}</h4>
                        <span class="text-[10px] font-bold text-sync-muted mt-1 sm:mt-0 opacity-70">{{ act.date }}</span>
                     </div>
                     <p class="text-sm text-sync-muted leading-relaxed font-medium">{{ act.desc }}</p>
                   </div>
                </div>

             </div>
          </div>
       </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
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
