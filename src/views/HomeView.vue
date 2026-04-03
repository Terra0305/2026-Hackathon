<script setup>
import { RouterLink } from 'vue-router'
import { mockHackathons, mockMyHackathons } from '../data/mockData'
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import GlowCard from '../components/GlowCard.vue'
import GlowCardContainer from '../components/GlowCardContainer.vue'

const authStore = useAuthStore()
// Ensure these are refs for stable template rendering
const activeHackathons = ref(mockHackathons.slice(0, 3))
const participatingHackathons = computed(() => authStore.isAuthenticated ? mockMyHackathons.slice(0, 2) : [])

const isHeroFolded = ref(false)
const contentArea = ref(null)

// Switching logic (Wheel & Touch)
const handleWheel = (e) => {
  if (!isHeroFolded.value && e.deltaY > 5) {
    isHeroFolded.value = true
  } else if (isHeroFolded.value && contentArea.value?.scrollTop <= 0 && e.deltaY < -5) {
    isHeroFolded.value = false
  }
}

let touchStartY = 0
const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY }
const handleTouchMove = (e) => {
  const deltaY = touchStartY - e.touches[0].clientY
  if (!isHeroFolded.value && deltaY > 30) {
    isHeroFolded.value = true
  } else if (isHeroFolded.value && contentArea.value?.scrollTop <= 0 && deltaY < -30) {
    isHeroFolded.value = false
  }
}
</script>

<template>
  <div class="h-[calc(100vh-64px)] w-full overflow-hidden relative bg-[#050608]" @wheel="handleWheel" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
    
    <!-- 1. Background Layer (Spline) -->
    <div class="fixed inset-0 z-0 pointer-events-none transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
         :class="{ 'opacity-0 scale-95': isHeroFolded }">
      <spline-viewer class="w-full h-full object-cover" url="https://prod.spline.design/j9a3Ou6jdJcpdLSz/scene.splinecode"></spline-viewer>
      <div class="absolute inset-0 bg-black/50 z-[1] transition-opacity duration-1000 mix-blend-multiply"></div>
    </div>

    <!-- 2. SCREEN 1: Hero (Landing) -->
    <section class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center gap-6 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
             :class="{ '-translate-y-full opacity-0 blur-xl pointer-events-none': isHeroFolded }">
      <div class="flex flex-col items-center gap-6 max-w-4xl px-6">
        <span class="px-4 py-1.5 rounded-full bg-sync-primary/10 text-sync-primary text-xs font-bold tracking-widest uppercase border border-sync-primary/20">Hackathon Platform</span>
        <h1 class="text-6xl sm:text-8xl font-outfit font-black tracking-tight text-white drop-shadow-2xl leading-[1.1]">
          Build, Sync, <span class="bg-gradient-to-r from-sync-primary to-teal-400 bg-clip-text text-transparent">Launch.</span>
        </h1>
        <p class="text-xl sm:text-2xl text-slate-300 mt-2">
          최고의 아이디어를 현실로 만드세요. <br class="hidden sm:block"/>
          전 세계의 뛰어난 개발자, 디자이너, 기획자들과 함께 혁신적인 프로젝트를 시작할 수 있습니다.
        </p>
        <div class="flex items-center gap-4 mt-8">
          <RouterLink to="/hackathons" class="px-10 py-5 bg-sync-primary hover:bg-sync-primaryHover text-white text-lg font-bold rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer text-center">
            해커톤 찾아보기
          </RouterLink>
          <RouterLink to="/camp" class="px-10 py-5 bg-white/10 hover:bg-white/20 text-white text-lg font-bold rounded-2xl border border-white/10 transition-all hover:-translate-y-0.5 backdrop-blur-md">
            팀 모집하기
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 3. SCREEN 2: Content (Hackathons) - Forced High Visibility -->
    <div ref="contentArea" 
         class="absolute inset-0 z-20 w-full h-full overflow-y-auto overflow-x-hidden transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) bg-[#0a0b12] content-scrollbar"
         :style="{ transform: isHeroFolded ? 'translateY(0)' : 'translateY(105%)' }">
      
      <div class="max-w-[1240px] mx-auto py-20 px-4 sm:px-6 flex flex-col gap-24">
        
        <!-- Section: My Hackathons -->
        <section class="flex flex-col gap-12">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
            <div class="flex flex-col gap-2">
              <h2 class="text-4xl font-outfit font-black text-white tracking-tight">현재 참여중인 해커톤</h2>
              <p class="text-slate-400 text-base">혁신을 향한 당신의 여정을 여기서 관리하세요.</p>
            </div>
            <RouterLink v-if="authStore.isAuthenticated" to="/mypage" class="text-sync-primary font-bold text-sm flex items-center gap-1 hover:underline">
              마이페이지 이동 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </RouterLink>
          </div>
          
          <GlowCardContainer class="flex flex-col gap-6">
            <template v-if="authStore.isAuthenticated && participatingHackathons.length > 0">
              <GlowCard v-for="hack in participatingHackathons" :key="hack.id" contentClass="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#151723]/50">
                <div class="flex flex-col gap-3 relative z-10">
                  <div class="flex items-center gap-4">
                    <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-lg">{{ hack.status }}</span>
                    <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">Applied: {{ hack.appliedDate }}</span>
                  </div>
                  <h3 class="text-3xl font-black text-white leading-tight mt-2">{{ hack.title }}</h3>
                  <p class="text-base text-slate-400 mt-2">
                    <span class="text-white font-bold">{{ hack.role }}</span>
                    <span v-if="hack.teamName" class="mx-3 text-white/20">|</span>
                    <span v-if="hack.teamName" class="text-slate-300">{{ hack.teamName }} 팀 소속</span>
                  </p>
                </div>
                <div class="flex gap-4 relative z-10 shrink-0">
                   <RouterLink :to="`/hackathons/${hack.hackathonId}`" class="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">공고 열람</RouterLink>
                   <RouterLink v-if="hack.status === '진행 중'" :to="`/workspace/${hack.hackathonId}`" class="px-8 py-4 rounded-2xl bg-sync-primary text-white font-bold shadow-2xl hover:bg-sync-primaryHover hover:-translate-y-1 transition-all">작업 공간 입장</RouterLink>
                </div>
              </GlowCard>
            </template>
            
            <GlowCard v-else-if="authStore.isAuthenticated" contentClass="py-24 px-10 flex flex-col items-center gap-8 text-center bg-white/[0.02] border-dashed">
              <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <svg class="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-3xl font-black text-white">참여 중인 해커톤이 없습니다.</h3>
              <RouterLink to="/hackathons" class="px-12 py-5 bg-sync-primary text-white font-black rounded-2xl shadow-2xl hover:scale-105 transition-transform">모든 해커톤 둘러보기</RouterLink>
            </GlowCard>

            <GlowCard v-else contentClass="py-32 px-10 flex flex-col items-center gap-8 text-center bg-white/[0.02] border-dashed">
              <h3 class="text-4xl font-black text-white tracking-tight">당신의 첫 해커톤을 시작하세요</h3>
              <p class="text-slate-400 text-lg max-w-md">로그인하고 전 세계 개발자들과 함께 협업하며 아이디어를 현실로 만드세요.</p>
              <RouterLink to="/login" class="px-16 py-6 bg-sync-primary text-white font-black text-xl rounded-2xl shadow-2xl hover:scale-105 transition-transform tracking-widest uppercase">로그인하기</RouterLink>
            </GlowCard>
          </GlowCardContainer>
        </section>

        <!-- Section: Active Hackathons -->
        <section class="flex flex-col gap-12">
          <div class="flex items-center justify-between border-b border-white/10 pb-8">
            <h2 class="text-4xl font-outfit font-black text-white tracking-tight">Active Hackathons</h2>
            <RouterLink to="/hackathons" class="text-slate-400 hover:text-white font-bold text-sm flex items-center gap-2">전체 보기 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></RouterLink>
          </div>
          
          <GlowCardContainer class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <GlowCard v-for="hackathon in activeHackathons" :key="hackathon.id" :as="RouterLink" :to="`/hackathons/${hackathon.id}`" 
              class="flex flex-col group h-full" contentClass="bg-[#151723]/50">
              <div class="w-full h-52 rounded-b-none bg-gradient-to-br flex items-center justify-center p-8 relative overflow-hidden" :class="hackathon.bgGradient">
                <div class="absolute inset-0 bg-black/10"></div>
                <h3 class="text-3xl font-black text-white text-center drop-shadow-2xl z-10 select-none">{{ hackathon.heroText }}</h3>
                <span class="absolute bottom-5 left-6 text-[10px] font-black text-white/60 uppercase tracking-[0.2em] z-10">{{ hackathon.subText }}</span>
              </div>
              <div class="p-8 flex flex-col gap-6 flex-1">
                <div class="flex justify-between items-center text-[10px] font-black tracking-widest">
                  <span class="text-sync-primary uppercase">{{ hackathon.type }}</span>
                  <span class="px-3 py-1 rounded bg-white/10 text-white border border-white/10">{{ hackathon.status }}</span>
                </div>
                <h4 class="text-2xl font-bold text-white group-hover:text-sync-primary transition-colors leading-tight line-clamp-2">{{ hackathon.title }}</h4>
                <div class="mt-auto pt-6 flex justify-between text-xs text-slate-500 font-bold border-t border-white/5">
                  <span class="flex items-center gap-2 font-black text-slate-300"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> {{ hackathon.startDate }}</span>
                  <span class="font-black text-white uppercase">{{ hackathon.participants }} PARTICIPANTS</span>
                </div>
              </div>
            </GlowCard>
          </GlowCardContainer>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.content-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}
</style>
```
