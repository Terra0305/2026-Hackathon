<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { mockMyHackathons, mockMySubmissions, mockMyActivities, mockUsers } from '../data/mockData'
import GlowCard from '../components/GlowCard.vue'
import GlowCardContainer from '../components/GlowCardContainer.vue'

const route = useRoute()
const activeMenu = ref('dashboard')

const userProfile = computed(() => {
  const id = Number(route.params.id)
  return mockUsers.find(u => u.id === id) || {
    id: id,
    nickname: `User_${id}`,
    role: "New Builder",
    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=user${id}`,
    points: 0,
    rank: 999,
    status: "up",
    badges: ["🌱"],
    techStack: ["Vue.js", "JavaScript"],
    githubCommits: 0
  }
})

const menus = [
  { id: 'dashboard', name: '개요' },
  { id: 'participating', name: '참여 해커톤 & 팀' },
  { id: 'submissions', name: '제출 내역' },
  { id: 'activities', name: '활동 및 랭킹' }
]

const ongoingProjects = [
  { title: 'AI Web Infrastructure 2024', dDay: 'D-12', progress: 60, colorClass: 'bg-sync-primary/20 text-sync-primary border-sync-primary/30', barClass: 'bg-sync-primary shadow-[0_0_12px_rgba(50,132,255,0.6)]' },
  { title: 'Creative UI/UX Challenge', dDay: 'D-34', progress: 25, colorClass: 'bg-teal-500/20 text-teal-400 border-teal-500/30', barClass: 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]' }
]

const recentTimeline = [
  { title: '새로운 팀 합류', time: '2시간 전', colorClass: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]' },
  { title: '코드 커밋 완료', time: '어제', colorClass: 'bg-blue-400 shadow-[0_0_8px_rgba(50,132,255,0.8)]' },
  { title: '프로필 업데이트', time: '3일 전', colorClass: 'bg-sync-muted' }
]
</script>

<template>
  <div class="w-full flex-1 max-w-[1240px] mx-auto px-4 sm:px-6 py-10 transition-colors duration-300 relative min-h-[calc(100vh-4rem)]">
    <!-- Ambient Base -->
    <div class="fixed inset-0 bg-gradient-to-b from-sync-primary/5 to-transparent pointer-events-none -z-10"></div>
    <div class="fixed top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>

    <div v-if="userProfile" class="w-full flex flex-col">
      <!-- Profile Header Block -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
        <div class="flex items-center gap-6">
           <div class="relative w-28 h-28 shrink-0">
             <div class="w-full h-full rounded-full overflow-hidden border-4 border-sync-bg shadow-[0_8px_32px_rgba(0,0,0,0.15)] bg-slate-200 z-10 relative">
                <img :src="userProfile.avatar" class="w-full h-full object-cover" />
             </div>
             <div class="absolute bottom-1 right-1 w-6 h-6 rounded-full border-[3px] border-sync-bg z-20 flex items-center justify-center shadow-sm" :class="userProfile.status === 'up' ? 'bg-teal-400' : 'bg-orange-400'"></div>
           </div>
           
           <div class="flex flex-col gap-1.5">
              <h1 class="text-4xl font-outfit font-black text-sync-text tracking-tight">{{ userProfile.nickname }}</h1>
              <p class="text-[15px] font-medium text-sync-muted">{{ userProfile.role }}</p>
           </div>
        </div>

        <GlowCardContainer class="flex gap-4 w-full md:w-auto">
           <GlowCard contentClass="p-5 px-6 flex flex-col justify-center gap-1.5 min-w-[140px]" class="flex-1 md:flex-auto shadow-sm border border-slate-200 dark:border-white/5" :hoverable="false">
             <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase">참여 중인 해커톤</span>
             <span class="text-2xl font-black text-sync-text tracking-tight">{{ mockMyHackathons.length || 0 }}개</span>
           </GlowCard>
           <GlowCard contentClass="p-5 px-6 flex flex-col justify-center gap-1.5 min-w-[140px]" class="flex-1 md:flex-auto shadow-sm border border-slate-200 dark:border-white/5" :hoverable="false">
             <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase">현재 포인트</span>
             <span class="text-2xl font-black text-teal-500 dark:text-teal-400 tracking-tight">{{ userProfile.points.toLocaleString() }}점</span>
           </GlowCard>
        </GlowCardContainer>
      </div>

      <!-- Horizontal Tabs -->
      <div class="flex items-center gap-2 sm:gap-8 border-b border-black/10 dark:border-white/5 mb-8 overflow-x-auto custom-scrollbar">
         <button 
           v-for="menu in menus" 
           :key="menu.id"
           @click="activeMenu = menu.id"
           class="pb-4 font-bold text-sm transition-colors whitespace-nowrap px-2 outline-none focus:outline-none focus:ring-0"
           :class="activeMenu === menu.id ? 'text-sync-primary border-b-2 border-sync-primary' : 'text-sync-muted hover:text-sync-text border-b-2 border-transparent'"
         >
           {{ menu.name }}
         </button>
      </div>

      <!-- Dynamic Content Body -->
      <div class="flex-1 w-full animate-fade-in relative z-10">
         
         <!-- Dashboard View (Graph heavy) -->
         <div v-if="activeMenu === 'dashboard'" class="flex flex-col gap-6">
            <!-- 3 Panel Layout -->
            <GlowCardContainer class="grid grid-cols-1 lg:grid-cols-3 gap-6">
               
               <!-- Projects Progress -->
               <GlowCard contentClass="p-8 flex flex-col gap-6" class="shadow-sm border border-slate-200 dark:border-white/5" :hoverable="false">
                 <div class="flex justify-between items-center mb-2">
                   <h3 class="font-bold text-lg text-sync-text">진행 중인 프로젝트</h3>
                   <span class="text-teal-500">🚀</span>
                 </div>
                 
                 <div v-for="(proj, idx) in ongoingProjects" :key="idx" class="flex items-center gap-4 group">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border" :class="proj.colorClass">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    </div>
                    <div class="flex flex-col w-full gap-2">
                       <div class="flex justify-between text-sm">
                          <span class="font-bold text-sync-text">{{ proj.title }}</span>
                          <span class="text-sync-muted text-xs font-bold font-mono">{{ proj.dDay }}</span>
                       </div>
                       <!-- Progress Bar -->
                       <div class="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-1000 origin-left" :style="{width: proj.progress + '%'}" :class="proj.barClass"></div>
                       </div>
                    </div>
                 </div>
               </GlowCard>

               <!-- Timeline -->
               <GlowCard contentClass="p-8" class="shadow-sm border border-slate-200 dark:border-white/5" :hoverable="false">
                 <div class="flex justify-between items-center mb-6">
                   <h3 class="font-bold text-lg text-sync-text">최근 활동</h3>
                   <span class="text-sync-muted">🕒</span>
                 </div>
                 <div class="flex flex-col gap-6 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black/10 dark:before:bg-white/10 ml-2">
                    <div v-for="(act, idx) in recentTimeline" :key="idx" class="flex flex-col gap-1 pl-6 relative">
                       <span class="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full z-10" :class="act.colorClass"></span>
                       <span class="text-[13px] font-bold text-sync-text">{{ act.title }}</span>
                       <span class="text-xs font-bold text-sync-muted mt-0.5 opacity-80">{{ act.time }}</span>
                    </div>
                 </div>
               </GlowCard>

               <!-- SVG Ring -->
               <GlowCard contentClass="p-8 flex flex-col" class="shadow-sm border border-slate-200 dark:border-white/5" :hoverable="false">
                 <div class="flex justify-between items-center mb-4">
                   <h3 class="font-bold text-lg text-sync-text">제출 현황</h3>
                   <span class="text-sync-muted">📄</span>
                 </div>
                 <div class="flex-1 flex flex-col items-center justify-center py-4">
                    <div class="relative w-32 h-32 flex items-center justify-center">
                       <svg class="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="38" class="stroke-black/5 dark:stroke-white/10" stroke-width="8" fill="none" />
                         <!-- 1/4 = 25% of 2*pi*38(238.76) => dashoffset 179.07 -->
                         <circle cx="50" cy="50" r="38" stroke="#3284FF" stroke-width="8" fill="none" stroke-dasharray="238.76" stroke-dashoffset="179.07" stroke-linecap="round" class="drop-shadow-[0_0_12px_rgba(50,132,255,0.4)]" />
                       </svg>
                       <span class="absolute text-3xl font-black text-sync-text font-outfit">1<span class="text-sync-muted text-lg font-bold">/4</span></span>
                    </div>
                    <p class="text-xs font-bold text-sync-muted mt-6 text-center tracking-wide">완료된 프로젝트 제출</p>
                 </div>
               </GlowCard>

            </GlowCardContainer>

            <!-- GitHub Integration Block -->
            <GlowCard contentClass="p-8 shadow-sm border border-slate-200 dark:border-white/5 flex flex-col gap-6" :hoverable="false">
               <div class="flex justify-between items-center border-b border-sync-border pb-4">
                 <div class="flex items-center gap-3">
                   <svg class="w-6 h-6 text-sync-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   <h3 class="font-bold text-lg text-sync-text">GitHub Contributions</h3>
                 </div>
                 <div class="flex items-center gap-2">
                   <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest border border-sync-border px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">Connected</span>
                 </div>
               </div>

               <div class="flex flex-col lg:flex-row gap-8">
                 <!-- Grass Grid -->
                 <div class="flex-1 flex flex-col gap-2 overflow-x-auto custom-scrollbar pb-2">
                    <div class="flex gap-1.5 w-max">
                      <div v-for="col in 32" :key="col" class="flex flex-col gap-1.5">
                        <div v-for="row in 7" :key="row" class="w-3 h-3 rounded-sm transition-colors hover:border hover:border-black/20 dark:hover:border-white/20 cursor-help" :class="Math.random() > 0.7 ? (Math.random() > 0.5 ? 'bg-teal-400 dark:bg-teal-500 shadow-[0_0_6px_rgba(45,212,191,0.5)]' : 'bg-teal-300 dark:bg-teal-600') : (Math.random() > 0.8 ? 'bg-teal-200 dark:bg-teal-800' : 'bg-black/5 dark:bg-white/5 border border-sync-border')"></div>
                      </div>
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-sync-muted font-bold mt-1">
                      <span>Mon</span><span>Wed</span><span>Fri</span>
                    </div>
                 </div>
                 
                 <!-- Tech Stack -->
                 <div class="w-full lg:w-64 lg:border-l border-sync-border lg:pl-8 flex flex-col gap-5 justify-center">
                    <div class="flex flex-col gap-1">
                      <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Commits in 2026</span>
                      <span class="text-3xl font-black text-sync-text drop-shadow-sm">{{ userProfile.githubCommits }}</span>
                    </div>
                    <div class="flex flex-col gap-2 mt-2">
                      <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Top Tech Stack</span>
                      <div class="flex flex-wrap gap-2">
                         <span v-for="tech in userProfile.techStack" :key="tech" class="px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-sync-border rounded-[0.4rem] text-[11px] font-bold text-sync-text tracking-wide shadow-sm hover:border-sync-primary/50 hover:bg-sync-primary/10 transition-colors">{{ tech }}</span>
                      </div>
                    </div>
                 </div>
               </div>
            </GlowCard>

            <!-- Ribbon Metric Block -->
             <GlowCard contentClass="p-6 px-8 flex flex-col sm:flex-row justify-between items-center sm:gap-4 gap-6 bg-gradient-to-r from-sync-primary/5 to-transparent border-l-4 border-l-sync-primary" class="shadow-sm border border-slate-200 dark:border-white/5" :hoverable="false">
                <div class="flex items-center gap-5 w-full sm:w-auto">
                  <div class="w-12 h-12 bg-sync-bg rounded-xl border border-sync-border flex items-center justify-center text-xl shadow-sm">🎖️</div>
                  <div class="flex flex-col gap-0.5">
                    <h4 class="font-bold text-sync-text text-base">이번 주 상위 5% 달성</h4>
                    <p class="text-xs text-sync-muted font-bold">지난주 대비 120 포인트 추가 획득</p>
                  </div>
                </div>
                <button class="px-5 py-2.5 w-full sm:w-auto bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-sync-text text-xs font-bold rounded-lg border border-black/10 dark:border-white/10 transition-colors shrink-0">랭킹 상세보기</button>
            </GlowCard>
         </div>

         <!-- Array Mappings -->
         <GlowCardContainer v-if="activeMenu === 'participating'" class="flex flex-col gap-5 animate-fade-in">
             <div v-if="mockMyHackathons.length === 0" class="py-16 text-center text-sync-muted border border-dashed border-sync-border rounded-2xl bg-black/5 dark:bg-white/5">아직 참여 중인 해커톤이 없습니다.</div>
             
             <GlowCard v-for="hack in mockMyHackathons" :key="hack.id" class="group border border-slate-200 dark:border-white/5 shadow-sm" contentClass="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-sync-primary/40 transition-colors rounded-3xl">
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
                  <button v-if="hack.status === '심사 중' || hack.status === '매칭 중'" @click="mockMyHackathons.splice(mockMyHackathons.findIndex(h => h.id === hack.id), 1)" class="px-6 py-3 min-w-[130px] shrink-0 text-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:text-red-400 hover:bg-red-500/20 text-sm font-bold transition-all shadow-sm">신청 취소</button>
                  <RouterLink :to="`/hackathons/${hack.hackathonId}`" class="px-6 py-3 min-w-[130px] shrink-0 text-center rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border text-sync-text text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">공고 열람</RouterLink>
                  <RouterLink v-if="hack.status === '진행 중'" :to="`/workspace/${hack.hackathonId}`" class="px-6 py-3 min-w-[130px] shrink-0 text-center rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">작업 공간</RouterLink>
                </div>
             </GlowCard>
         </GlowCardContainer>

         <GlowCardContainer v-if="activeMenu === 'submissions'" class="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
             <div v-if="mockMySubmissions.length === 0" class="col-span-full py-16 text-center text-sync-muted border border-dashed border-sync-border rounded-2xl bg-black/5 dark:bg-white/5">제출된 프로젝트 내역이 없습니다.</div>

             <GlowCard v-for="sub in mockMySubmissions" :key="sub.id" class="shadow-sm border border-slate-200 dark:border-white/5 group transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]" contentClass="overflow-hidden rounded-3xl">
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
                  
                  <div v-if="sub.historyDocs && sub.historyDocs.length" class="flex flex-col gap-2 mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border transition-colors group-hover:border-sync-primary/20">
                     <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest mb-1">Workspace Archive</span>
                     <div v-for="doc in sub.historyDocs" :key="doc.title" class="flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2">
                           <span class="text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-sync-text font-bold drop-shadow-sm">{{ doc.type }}</span>
                           <span class="text-sync-text font-medium">{{ doc.title }}</span>
                        </div>
                        <span class="text-sync-muted font-bold text-[10px] hidden sm:block">{{ doc.date }}</span>
                     </div>
                  </div>

                  <div class="mt-4 pt-5 border-t border-sync-border flex justify-between items-center text-sm">
                    <span class="font-bold text-sync-muted">{{ sub.date }}</span>
                    <a :href="sub.link" target="_blank" class="font-bold text-sync-primary hover:text-sync-primaryHover transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sync-primary/10 border border-sync-primary/20 shadow-sm">Source Code <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                  </div>
                </div>
             </GlowCard>
         </GlowCardContainer>

         <GlowCardContainer v-if="activeMenu === 'activities'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
             <GlowCard class="lg:col-span-2 bg-black/5 dark:bg-white/5 p-6 md:p-10 shadow-sm border border-slate-200 dark:border-white/5 rounded-[2rem]">
                 <h3 class="text-xl font-bold text-sync-text mb-8 md:mb-10 font-outfit">최근 활동 내역</h3>
                 <div class="relative flex flex-col gap-6 sm:gap-8">
                    <div class="absolute left-[19px] top-4 bottom-4 w-px bg-sync-border pointer-events-none"></div>
                    <div v-if="mockMyActivities.length === 0" class="text-sync-muted text-sm py-4 z-10 bg-white/50 dark:bg-[#181A20]/50 relative backdrop-blur-md rounded-xl p-4 border border-sync-border">활동 기록이 존재하지 않습니다.</div>

                    <div v-for="act in mockMyActivities" :key="act.id" class="relative flex gap-4 sm:gap-6 items-start group">
                       <div class="w-10 h-10 shrink-0 rounded-full border-[4px] border-white dark:border-[#181A20] flex items-center justify-center text-[15px] z-10 shadow-sm transition-transform group-hover:scale-110 ml-0 mt-3 mix-blend-normal" :class="act.iconColor">
                         {{ act.icon }}
                       </div>
                       <div class="flex-1 flex flex-col gap-2 bg-black/5 dark:bg-white/5-hover p-5 rounded-2xl border border-transparent hover:border-sync-border hover:shadow-sm transition-all bg-black/[0.02] dark:bg-white/[0.02]">
                         <div class="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-3">
                            <h4 class="text-base font-bold text-sync-text">{{ act.title }}</h4>
                            <span class="text-[10px] font-bold text-sync-muted mt-1 sm:mt-0 opacity-70 tracking-widest uppercase">{{ act.date }}</span>
                         </div>
                         <p class="text-[13.5px] text-sync-muted leading-relaxed font-medium mt-1">{{ act.desc }}</p>
                       </div>
                    </div>
                 </div>
             </GlowCard>

             <div class="lg:col-span-1 flex flex-col gap-6">
                 <!-- Ranking Card -->
                 <GlowCard class="bg-black/5 dark:bg-white/5 p-8 shadow-sm border border-slate-200 dark:border-white/5 rounded-[2rem] flex flex-col items-center text-center">
                    <div class="w-full flex justify-between items-center mb-6">
                       <h3 class="text-sm font-bold text-sync-muted tracking-widest uppercase">실시간 랭킹</h3>
                       <button class="text-sync-primary hover:text-sync-primaryHover transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                    </div>
                    <div class="relative w-28 h-28 mb-4 drop-shadow-md">
                       <img :src="userProfile.avatar" class="w-full h-full rounded-full border-[4px] border-sync-primary/30 bg-white/50 dark:bg-black/50" />
                       <div class="absolute -bottom-1 -right-1 w-11 h-11 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white dark:border-[#181A20] z-10 transform -rotate-12">🏆</div>
                    </div>
                    <div class="flex items-center gap-2 mb-1">
                      <h2 class="text-4xl font-black text-sync-text tracking-tight">{{ userProfile.rank }}<span class="text-2xl font-bold text-sync-muted ml-0.5">위</span></h2>
                    </div>
                    <p class="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full mt-2">상위 1.2% 진입 (마스터티어)</p>
                    
                    <div class="w-full h-px bg-sync-border my-6"></div>
                    
                    <div class="flex justify-between w-full items-center mb-3">
                       <span class="text-sm font-bold text-sync-muted">누적 경험치</span>
                       <span class="text-[15px] font-black text-sync-text">{{ userProfile.points.toLocaleString() }} <span class="text-xs font-bold text-sync-primary">XP</span></span>
                    </div>
                    <div class="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner flex">
                       <div class="h-full bg-gradient-to-r from-sync-primary to-blue-400 rounded-full w-[80%] relative"></div>
                    </div>
                    <div class="w-full flex justify-between mt-2">
                       <span class="text-[10px] text-sync-muted font-bold">{{ userProfile.points.toLocaleString() }}</span>
                       <span class="text-[10px] text-sync-muted font-bold opacity-50">15,000 XP (다음 랭크 승급)</span>
                    </div>
                 </GlowCard>

                 <!-- Global Leaderboard Widget -->
                 <GlowCard to="/rankings" class="bg-black/5 dark:bg-white/5 p-6 shadow-sm border border-slate-200 dark:border-white/5 rounded-[1.5rem] bg-gradient-to-br from-sync-primary/5 to-transparent hover:border-sync-primary/30 transition-all cursor-pointer group flex items-center gap-4 hover:-translate-y-1">
                     <div class="w-12 h-12 rounded-xl bg-white dark:bg-[#181A20] shadow-sm border border-sync-border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📊</div>
                     <div class="flex flex-col gap-0.5">
                        <h4 class="font-bold text-[15px] text-sync-text group-hover:text-sync-primary transition-colors">글로벌 랭킹 리더보드</h4>
                        <p class="text-xs text-sync-muted font-medium">전체 순위와 개발자 티어를 확인하세요.</p>
                     </div>
                 </GlowCard>
             </div>
         </GlowCardContainer>

      </div>
    </div>
    
    <div v-else class="flex items-center justify-center py-32 flex-col gap-4">
      <div class="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border flex items-center justify-center mb-2">
         <svg class="w-8 h-8 text-sync-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      </div>
      <h2 class="text-2xl font-bold font-outfit text-sync-text">유저를 찾을 수 없습니다</h2>
      <p class="text-sm text-sync-muted font-medium mb-4">해당 유저의 프로필이 존재하지 않습니다.</p>
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
  height: 0px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
