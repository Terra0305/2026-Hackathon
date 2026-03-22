<script setup>
import { RouterLink } from 'vue-router'
import { mockHackathons, mockMyHackathons } from '../data/mockData'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const activeHackathons = computed(() => mockHackathons.slice(0, 3))
const participatingHackathons = computed(() => authStore.isAuthenticated ? mockMyHackathons.slice(0, 2) : [])
</script>

<template>
  <div class="flex flex-col gap-12 pb-24 transition-colors duration-300">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center text-center py-20 gap-6 glass-card mt-4 relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-br from-sync-primary/10 to-transparent pointer-events-none opacity-50 dark:opacity-100 transition-opacity"></div>
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-sync-primary/20 blur-[80px] rounded-full group-hover:bg-sync-primary/30 transition-colors duration-700"></div>
      
      <span class="px-4 py-1.5 rounded-full bg-sync-primary/10 text-sync-primary text-xs font-bold tracking-widest uppercase border border-sync-primary/20 relative z-10 transition-colors hover:bg-sync-primary/20 cursor-default">Hackathon Platform</span>
      <h1 class="text-5xl sm:text-7xl font-outfit font-black tracking-tight text-sync-text transition-colors relative z-10 drop-shadow-sm">
        Build, Sync, <span class="bg-gradient-to-r from-sync-primary to-teal-400 bg-clip-text text-transparent">Launch.</span>
      </h1>
      <p class="text-lg sm:text-xl text-sync-muted max-w-2xl mt-2 transition-colors relative z-10">
        최고의 아이디어를 현실로 만드세요. <br/>
        전 세계의 뛰어난 개발자, 디자이너, 기획자들과 함께 혁신적인 프로젝트를 시작할 수 있습니다.
      </p>
      <div class="flex items-center gap-4 mt-8 relative z-10">
        <RouterLink to="/hackathons" class="px-8 py-4 bg-sync-primary hover:bg-sync-primaryHover text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:shadow-[0_6px_20px_rgba(50,132,255,0.4)] hover:-translate-y-0.5 active:translate-y-0">
          해커톤 찾아보기
        </RouterLink>
        <RouterLink to="/camp" class="px-8 py-4 bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 text-sync-text font-bold rounded-xl border border-sync-border transition-all hover:-translate-y-0.5 shadow-sm backdrop-blur-md">
          팀 모집하기
        </RouterLink>
      </div>
    </section>

    <!-- Participating Hackathons Section -->
    <section v-if="authStore.isAuthenticated && participatingHackathons.length > 0" class="flex flex-col gap-8">
      <div class="flex items-end justify-between border-b border-sync-border pb-4 transition-colors">
        <div class="flex flex-col gap-1">
          <h2 class="text-3xl font-outfit font-bold text-sync-text tracking-tight transition-colors">현재 참여중인 해커톤</h2>
          <p class="text-sync-muted text-sm transition-colors">진행 중이거나 심사 대기 중인 나의 해커톤 목록입니다.</p>
        </div>
        <RouterLink to="/mypage" class="hidden sm:flex items-center text-sm font-bold text-sync-primary hover:text-sync-primaryHover transition-colors group">
          마이페이지 <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </RouterLink>
      </div>

      <div class="flex flex-col gap-5">
         <div v-for="hack in participatingHackathons" :key="hack.id" class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-sync-primary/40 transition-colors border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl cursor-pointer">
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
            <div class="flex flex-col sm:flex-row justify-end gap-3 shrink-0 mt-4 md:mt-0">
              <RouterLink :to="`/hackathons/${hack.hackathonId}`" class="px-6 py-3 min-w-[130px] shrink-0 text-center rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border text-sync-text text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">공고 열람</RouterLink>
              <RouterLink v-if="hack.status === '진행 중'" :to="`/workspace/${hack.hackathonId}`" class="px-6 py-3 min-w-[130px] shrink-0 text-center rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">작업 공간</RouterLink>
            </div>
         </div>
      </div>
    </section>

    <!-- Hackathons Section -->
    <section class="flex flex-col gap-8">
      <div class="flex items-end justify-between border-b border-sync-border pb-4 transition-colors">
        <div class="flex flex-col gap-1">
          <h2 class="text-3xl font-outfit font-bold text-sync-text tracking-tight transition-colors">Active Hackathons</h2>
          <p class="text-sync-muted text-sm transition-colors">현재 모집 중이거나 진행 중인 해커톤 목록입니다.</p>
        </div>
        <RouterLink to="/hackathons" class="hidden sm:flex items-center text-sm font-bold text-sync-primary hover:text-sync-primaryHover transition-colors group">
          전체 보기 <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Render 3 Top Hackathons from our dummy data -->
        <RouterLink 
          v-for="hackathon in activeHackathons" 
          :key="hackathon.id"
          :to="`/hackathons/${hackathon.id}`" 
          class="glass-card glass-card-hover p-6 flex flex-col gap-6 group cursor-pointer"
        >
          <div class="w-full h-48 rounded-xl bg-gradient-to-br flex items-center justify-center p-6 relative overflow-hidden" :class="hackathon.bgGradient">
             <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[30px] rounded-full mix-blend-overlay"></div>
             <h3 class="text-3xl font-outfit font-black text-white text-center opacity-90 drop-shadow-md z-10">{{ hackathon.heroText }}</h3>
             <span class="absolute bottom-4 left-4 text-[10px] font-bold text-white/70 uppercase tracking-widest z-10">{{ hackathon.subText }}</span>
          </div>

          <div class="flex flex-col gap-3 flex-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-sync-primary tracking-widest">{{ hackathon.type }}</span>
              <span class="px-2.5 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold border border-teal-500/20 shadow-sm">{{ hackathon.status }}</span>
            </div>
            <h4 class="text-xl font-bold text-sync-text group-hover:text-sync-primary transition-colors line-clamp-2 leading-snug">{{ hackathon.title }}</h4>
            <div class="mt-auto pt-4 flex items-center justify-between text-xs text-sync-muted font-medium border-t border-sync-border transition-colors">
               <div class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ hackathon.startDate }} - {{ hackathon.endDate }}</div>
               <div class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> {{ hackathon.participants }}명 참여</div>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
