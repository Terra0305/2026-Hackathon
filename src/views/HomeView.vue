<script setup>
import { RouterLink } from 'vue-router'
import { mockHackathons, mockUsers } from '../data/mockData'
import { computed } from 'vue'

const activeHackathons = computed(() => mockHackathons.slice(0, 3))
const topBuilders = computed(() => mockUsers.slice(0, 3))
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

    <!-- Builders Section -->
    <section class="flex flex-col gap-8">
      <div class="flex items-end justify-between border-b border-sync-border pb-4 transition-colors">
        <div class="flex flex-col gap-1">
          <h2 class="text-3xl font-outfit font-bold text-sync-text tracking-tight transition-colors">Top Builders</h2>
          <p class="text-sync-muted text-sm transition-colors">이번 달 가장 많은 기여를 한 빌더 랭킹입니다.</p>
        </div>
        <RouterLink to="/rankings" class="hidden sm:flex items-center text-sm font-bold text-sync-primary hover:text-sync-primaryHover transition-colors group">
          랭킹 보기 <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RouterLink 
          v-for="user in topBuilders" 
          :key="user.id"
          to="/rankings" 
          class="glass-card glass-card-hover p-6 flex items-center gap-5 group"
        >
          <div class="relative">
            <div class="w-14 h-14 rounded-full border-2 border-white dark:border-[#22252D] bg-sync-card overflow-hidden shadow-sm z-10 relative">
               <img :src="user.avatar" class="w-full h-full object-cover">
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-sync-card border border-sync-border rounded-full flex items-center justify-center text-[10px] font-bold text-sync-text z-20 shadow-sm">{{ user.rank }}</div>
          </div>
          <div class="flex flex-col flex-1">
            <h4 class="text-sm font-bold text-sync-text group-hover:text-sync-primary transition-colors">{{ user.nickname }}</h4>
            <p class="text-xs text-sync-muted mb-1">{{ user.role }}</p>
            <div class="flex gap-1">
               <span v-for="(badge, bIdx) in user.badges" :key="bIdx" class="w-5 h-5 flex items-center justify-center bg-black/5 dark:bg-white/5 border border-sync-border rounded text-[10px]">{{ badge }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
             <span class="text-sm font-outfit font-black text-sync-primary">{{ user.points.toLocaleString() }}</span>
             <span class="text-[10px] font-bold text-sync-muted">PTS</span>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
