<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockHackathons } from '../data/mockData'
import GlowCard from '../components/GlowCard.vue'
import GlowCardContainer from '../components/GlowCardContainer.vue'

const route = useRoute()
const router = useRouter()
const currentTab = ref('overview')
const hasApplied = ref(false)

const hackathon = computed(() => {
  const id = parseInt(route.params.slug) // Properly maps to :slug route
  return mockHackathons.find(h => h.id === id) || mockHackathons[0]
})

// Scroll top on mount
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="flex flex-col gap-8 pb-32 transition-colors duration-300">
    <!-- Hero Header Component (Redesigned with Flex to prevent overlap) -->
    <div class="w-full flex-1 min-h-[380px] md:min-h-[440px] flex flex-col justify-between rounded-[2.5rem] relative overflow-hidden py-10 md:py-12 px-5 bg-gradient-to-br shadow-[0_16px_48px_rgba(0,0,0,0.1)] group transition-all" :class="hackathon.bgGradient">
      
      <!-- Ambient effects -->
      <div class="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full group-hover:bg-white/30 transition-colors duration-700 pointer-events-none mix-blend-overlay"></div>
      
      <!-- Top Title Block (Fixed centered alignment matching user request) -->
      <div class="z-10 flex flex-col items-center text-center max-w-4xl gap-4 mx-auto mb-16 md:mb-12">
        <span class="px-5 py-2 bg-white/10 border border-white/30 rounded-full text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase backdrop-blur-md shadow-sm">{{ hackathon.type }}</span>
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-outfit font-black text-white drop-shadow-md leading-tight sm:leading-tight mt-1">{{ hackathon.title }}</h1>
      </div>

      <!-- Bottom Specifics Block (Inline Flex - Resolving Absolute overlap issues) -->
      <div class="z-10 w-full md:w-[94%] max-w-4xl mx-auto border border-white/20 bg-black/20 md:p-6 p-5 py-6 rounded-[2.5rem] flex flex-wrap md:flex-nowrap items-center justify-around gap-y-6 gap-x-2 text-white text-sm backdrop-blur-3xl shadow-[0_16px_40px_rgba(0,0,0,0.3)] mt-auto border-t border-t-white/30">
        <div class="flex flex-col items-center flex-1 min-w-0 px-2 text-center break-keep">
          <span class="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1 drop-shadow-sm">일정</span>
          <span class="font-bold text-sm md:text-base leading-tight">{{ hackathon.startDate }} - {{ hackathon.endDate }}</span>
        </div>
        <div class="flex items-center justify-center text-white/40 font-light text-2xl shrink-0">|</div>
        <div class="flex flex-col items-center flex-1 min-w-0 px-2 text-center break-keep">
          <span class="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1 drop-shadow-sm">참여 규모</span>
          <span class="font-bold text-sm md:text-base leading-tight">{{ hackathon.participants.toLocaleString() }}명 참여</span>
        </div>
        <div class="flex items-center justify-center text-white/40 font-light text-2xl shrink-0">|</div>
        <div class="flex flex-col items-center flex-1 min-w-0 px-2 text-center break-keep w-full md:w-auto mt-2 md:mt-0">
          <span class="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1 drop-shadow-sm">주최 기관</span>
          <span class="font-bold text-sm md:text-base leading-tight">{{ hackathon.organizer || 'Sync 공식' }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content & Application Sidebar Layout -->
    <div class="flex flex-col lg:flex-row gap-8 mt-2 md:mt-6">
      
      <!-- Left: Content Structure -->
      <div class="flex-1 flex flex-col gap-6">
        <!-- Tab Navigation -->
        <div class="flex items-center gap-2 border-b border-sync-border overflow-x-auto pb-px custom-scrollbar">
          <button @click="currentTab = 'overview'" class="px-6 py-4 text-[13px] font-bold border-b-2 transition-all shrink-0 uppercase tracking-wider" :class="currentTab === 'overview' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">Overview</button>
          <button @click="currentTab = 'timeline'" class="px-6 py-4 text-[13px] font-bold border-b-2 transition-all shrink-0 uppercase tracking-wider" :class="currentTab === 'timeline' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">Timeline</button>
          <button @click="currentTab = 'prizes'" class="px-6 py-4 text-[13px] font-bold border-b-2 transition-all shrink-0 uppercase tracking-wider" :class="currentTab === 'prizes' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">Prizes</button>
          <button @click="currentTab = 'rules'" class="px-6 py-4 text-[13px] font-bold border-b-2 transition-all shrink-0 uppercase tracking-wider" :class="currentTab === 'rules' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">Rules</button>
        </div>

        <!-- Tab Content Base -->
        <GlowCard contentClass="p-6 md:p-10 min-h-[400px]" :hoverable="false">
          
          <!-- 1. Overview -->
          <div v-if="currentTab === 'overview'" class="flex flex-col gap-8 animate-fade-in text-sync-text">
            <h2 class="text-2xl font-bold font-outfit">해커톤 상세 소개</h2>
            <p class="text-sync-muted leading-relaxed whitespace-pre-line text-[15px] sm:text-[17px] font-medium">{{ hackathon.description }}</p>
            
            <!-- Contextual Mock Content -->
            <div class="w-full aspect-video rounded-[2rem] bg-black/5 dark:bg-white/5 border border-sync-border flex items-center justify-center flex-col gap-4 group cursor-pointer mt-4 hover:border-sync-primary/50 transition-colors shadow-inner overflow-hidden relative">
              <div class="absolute inset-0 bg-gradient-to-tr from-sync-primary/10 to-transparent mix-blend-overlay"></div>
              <div class="w-20 h-20 rounded-full bg-white/20 dark:bg-black/30 border border-white/20 backdrop-blur-md flex items-center justify-center text-sync-text shadow-[0_0_30px_rgba(50,132,255,0.2)] group-hover:scale-110 transition-transform z-10">
                <svg class="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span class="text-xs font-bold text-sync-muted z-10 uppercase tracking-widest drop-shadow-sm">Play Promotional Video</span>
            </div>
          </div>

          <!-- 2. Timeline -->
          <div v-if="currentTab === 'timeline'" class="flex flex-col gap-8 animate-fade-in">
            <h2 class="text-2xl font-bold font-outfit text-sync-text">진행 일정 (타임라인)</h2>
            <div class="relative pl-8 flex flex-col gap-10 before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-sync-border">
              
              <div v-for="(item, idx) in hackathon.timeline" :key="idx" class="relative">
                <div class="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full bg-sync-bg border-[4px] border-sync-primary shadow-[0_0_12px_rgba(50,132,255,0.4)] transition-all"></div>
                <div class="flex flex-col gap-1 pl-4 glass-card-hover p-4 rounded-2xl border border-transparent hover:border-sync-border transition-colors">
                  <p class="text-[11px] font-bold text-sync-primary tracking-widest uppercase">{{ item.date }}</p>
                  <h4 class="text-lg font-bold text-sync-text mt-1">{{ item.step }}</h4>
                </div>
              </div>

            </div>
          </div>

          <!-- 3. Prizes -->
          <div v-if="currentTab === 'prizes'" class="flex flex-col gap-8 animate-fade-in">
             <h2 class="text-2xl font-bold font-outfit text-sync-text">시상 규모 및 상금</h2>
             <GlowCardContainer class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Golden card logic -->
                <GlowCard v-for="(prize, idx) in hackathon.prizes" :key="idx" 
                  class="flex flex-col items-center text-center transition-all hover:-translate-y-2"
                  contentClass="p-6 md:p-8 rounded-3xl bg-gradient-to-br border shadow-[0_8px_32px_rgba(0,0,0,0.05)] relative overflow-hidden"
                  :class="idx === 0 ? 'from-amber-200/40 to-amber-50/40 border-amber-300 dark:border-amber-500/30 dark:from-amber-900/40 dark:to-transparent' : idx === 1 ? 'from-slate-200/40 to-slate-50/40 border-slate-300 dark:border-slate-500/30 dark:from-slate-800/50' : 'from-orange-200/40 to-orange-50/40 border-orange-300 dark:border-orange-500/30 dark:from-orange-900/40'"
                >
                  <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/30 dark:bg-white/10 blur-[20px] rounded-full mix-blend-overlay"></div>
                  <div class="text-5xl mb-6 relative z-10 drop-shadow-sm">{{ idx === 0 ? '🏆' : idx === 1 ? '🥈' : '🥉' }}</div>
                  <h4 class="text-[11px] font-bold text-sync-text opacity-70 uppercase tracking-widest mb-2 z-10">{{ prize.rank }}</h4>
                  <p class="text-xl md:text-2xl font-black text-sync-text tracking-tight z-10">{{ prize.reward }}</p>
                </GlowCard>
             </GlowCardContainer>
          </div>

          <!-- 4. Rules -->
          <div v-if="currentTab === 'rules'" class="flex flex-col gap-6 animate-fade-in">
            <div class="flex flex-col gap-2 mb-2">
              <h2 class="text-2xl font-bold font-outfit text-sync-text">대회 규정사항</h2>
              <p class="text-sync-muted text-sm">해커톤 진행을 위한 필수 준수사항입니다.</p>
            </div>
            <ul class="flex flex-col gap-4 list-none pl-0">
              <li v-for="(rule, idx) in hackathon.rules" :key="idx" class="flex gap-4 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <svg class="w-6 h-6 text-sync-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span class="text-sync-text text-[15px] font-medium leading-relaxed">{{ rule }}</span>
              </li>
            </ul>
          </div>
          
        </GlowCard>
      </div>

      <!-- Right: Application Configurator Sidebar -->
      <div class="w-full lg:w-[380px] flex flex-col shrink-0">
         <GlowCard contentClass="p-6 md:p-8 flex flex-col gap-8" class="sticky top-24" :hoverable="false">
           
           <div class="flex flex-col gap-3">
             <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">신청 및 진행 상태</span>
             <div class="flex items-center gap-3">
               <span class="relative flex h-4 w-4 shrink-0">
                 <span v-if="hackathon.status === '진행 중'" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-4 w-4" :class="hackathon.status === '진행 중' ? 'bg-teal-500' : hackathon.status === '예정' ? 'bg-blue-500' : 'bg-gray-400'"></span>
               </span>
               <span class="text-3xl font-black text-sync-text tracking-tight">{{ hackathon.status }}</span>
             </div>
             <p v-if="hackathon.status === '진행 중'" class="text-[13px] text-sync-text font-medium mt-2 p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-700 dark:text-teal-400">현재 모집 중인 대회로 참가가 능합니다. 자리가 조기 마감될 수 있습니다.</p>
             <p v-else-if="hackathon.status === '종료'" class="text-[13px] text-sync-text font-medium mt-2 p-3 bg-gray-500/10 rounded-xl border border-gray-500/20 text-gray-700 dark:text-gray-400">이미 모집이 종료된 해커톤입니다.</p>
           </div>

           <div class="flex flex-col gap-5 pt-6 border-t border-sync-border">
             <div class="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-sync-border">
               <span class="text-sync-muted text-xs font-bold uppercase tracking-widest">참가비용</span>
               <span class="text-sync-text font-black text-lg">무료</span>
             </div>
             <div class="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-sync-border">
               <span class="text-sync-muted text-xs font-bold uppercase tracking-widest">방식</span>
               <span class="text-sync-text font-black text-sm">하이브리드 (온/오프)</span>
             </div>
           </div>

           <div class="pt-6 border-t border-sync-border flex flex-col gap-4">
              <!-- Application Vue State Logic (Redirect to Form) -->
              <RouterLink
                v-if="!hasApplied" 
                :to="hackathon.status === '종료' ? '' : `/hackathons/${hackathon.id}/apply`"
                class="w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:shadow-[0_6px_20px_rgba(50,132,255,0.4)] hover:-translate-y-1 active:translate-y-0 text-white text-[15px]"
                :class="hackathon.status === '종료' ? 'bg-gray-400 text-gray-200 cursor-not-allowed pointer-events-none shadow-none' : 'bg-sync-primary hover:bg-sync-primaryHover'"
              >
                {{ hackathon.status === '종료' ? '마감된 해커톤' : '대회 참가 신청하기' }}
                <svg v-if="hackathon.status !== '종료'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </RouterLink>
              
              <div v-else class="w-full py-5 rounded-2xl border-2 border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(20,184,166,0.2)]">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                성공적으로 참가 접수되었습니다!
              </div>

              <!-- Call to Action for Teams -->
              <RouterLink :to="`/camp?hackathonId=${hackathon.id}`" class="w-full py-4 rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-sync-muted hover:text-sync-text text-sm font-bold transition-all flex items-center justify-center gap-2 mt-2">
                이 해커톤의 구인 팀원 찾기 <svg class="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </RouterLink>
           </div>
         </GlowCard>
         </div>
         
         <!-- Footer Utility links -->
         <div class="flex items-center gap-4 text-xs font-bold text-sync-muted py-6 justify-center">
             <button class="hover:text-sync-text transition-colors flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>공유하기</button>
             <div class="w-1.5 h-1.5 rounded-full bg-sync-border"></div>
             <button class="hover:text-sync-text transition-colors flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>문의하기</button>
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
