<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useDbStore } from '../stores/db'

const db = useDbStore()
const activeHackathons = computed(() => db.hackathons.filter(h => h.status !== 'ended').slice(0, 3))
</script>

<template>
  <div class="flex flex-col gap-16 pb-24">
    <!-- Hero Section -->
    <section class="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#101928] to-[#0A0D14] border border-white/5 p-12 md:p-20 flex flex-col items-start gap-8">
      <!-- Decorative radial gradient -->
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      
      <div class="relative z-10 flex flex-col items-start gap-6 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-[0.15em] uppercase">
          <span class="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] animate-pulse"></span>
          LIVE NOW<span class="text-teal-400/30 mx-1">•</span>SEASON 04 • GLOBAL COMPETITION
        </div>
        
        <h1 class="text-5xl md:text-7xl font-outfit font-bold tracking-tight text-white leading-[1.1]">
          2026 글로벌 AI<br/>해커톤
        </h1>
        
        <p class="text-lg md:text-xl text-sync-muted leading-relaxed">
          차세대 인공지능 기술의 한계를 시험하는 48시간의 여정. 전 세계 빌더들과 함께 아이디어를 실현하고 기술 생태계의 정점에 도전하세요.
        </p>
        
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <button class="bg-sync-primary hover:bg-sync-primaryHover text-white font-medium py-3.5 px-8 rounded-xl transition-all hover:shadow-[0_0_24px_rgba(50,132,255,0.4)]">
            참가 신청하기
          </button>
          <button class="bg-[#1C1F26]/80 hover:bg-[#232730] border border-white/10 text-white font-medium py-3.5 px-8 rounded-xl transition-colors backdrop-blur-md">
            상세 정보 보기
          </button>
        </div>
      </div>
    </section>

    <!-- Navigation Cards Grid -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <RouterLink to="/hackathons" class="glass-card glass-card-hover p-8 group flex flex-col gap-5">
        <div class="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-xl bg-white/5 group-hover:bg-sync-primary/20 group-hover:text-sync-primary transition-colors text-white/80">🧭</div>
        <div class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-white">해커톤 보러가기</h3>
          <p class="text-sm text-sync-muted leading-relaxed">
            현재 진행 중인 프로젝트와 다가오는 일정을 확인하고 당신의 다음 도전을 선택하세요.
          </p>
        </div>
      </RouterLink>

      <RouterLink to="/camp" class="glass-card glass-card-hover p-8 group flex flex-col gap-5">
        <div class="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-xl bg-white/5 group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors text-white/80">👥</div>
        <div class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-white">팀 찾기</h3>
          <p class="text-sm text-sync-muted leading-relaxed">
            기술 스택과 성향이 맞는 최고의 파트너를 만나 프로젝트의 완성도를 높여보세요.
          </p>
        </div>
      </RouterLink>

      <RouterLink to="/rankings" class="glass-card glass-card-hover p-8 group flex flex-col gap-5">
        <div class="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-xl bg-white/5 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors text-white/80">🥇</div>
        <div class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-white">랭킹 보기</h3>
          <p class="text-sm text-sync-muted leading-relaxed">
            커뮤니티 내 실시간 랭킹과 빌더들의 팀메이킹 도달 성과를 한눈에 확인하세요.
          </p>
        </div>
      </RouterLink>
    </section>

    <!-- Active Hackathons List -->
    <section class="flex flex-col gap-6 w-full">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-outfit font-bold text-white tracking-tight">진행 중 해커톤</h2>
          <p class="text-sm text-sync-muted">참가 참여 가능한 활성 챌린지 리스트</p>
        </div>
        <RouterLink to="/hackathons" class="text-xs font-bold text-sync-primary hover:text-sync-primaryHover uppercase tracking-widest">VIEW ALL CHALLENGES</RouterLink>
      </div>

      <div class="flex flex-col gap-3">
        <RouterLink v-for="h in activeHackathons" :key="h.id" :to="`/hackathons/${h.slug}`" class="bg-[#181A20] p-4 rounded-xl border border-white/5 hover:border-white/10 flex items-center justify-between group cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22252D] to-[#181A20] border border-white/5 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
               <span class="text-white/80 text-xl font-bold font-outfit tracking-tighter">{{ h.title.charAt(0) }}</span>
            </div>
            <div class="flex flex-col gap-1.5">
              <h4 class="text-white font-bold md:text-lg group-hover:text-sync-primary transition-colors">{{ h.title }}</h4>
              <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-sync-muted">
                <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ h.startDate }} ~ {{ h.endDate }}</span>
                <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> {{ h.participants }}명 참여 중</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <span v-if="h.status === 'ongoing'" class="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-teal-500/10 text-[10px] font-bold text-teal-400 border border-teal-500/20 uppercase tracking-widest">진행 중</span>
            <span v-else-if="h.status === 'upcoming'" class="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-blue-500/10 text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">모집 중</span>
            <span v-else class="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-white/5 text-[10px] font-bold text-white/50 border border-white/5 uppercase tracking-widest">종료</span>
            
            <svg class="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
