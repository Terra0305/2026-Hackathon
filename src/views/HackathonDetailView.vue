<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDbStore } from '../stores/db'

const route = useRoute()
const db = useDbStore()

const hackathonSlug = route.params.id || route.params.slug
const hackathon = computed(() => db.hackathons.find(h => h.slug === hackathonSlug || h.id === hackathonSlug))

const tabs = ['개요', '평가 기준', '일정', '상금', '팀 찾기', '제출', '리더보드']
const activeTab = ref('개요')

// 팀 찾기
const teams = computed(() => db.teams.filter(t => t.hackathonSlug === hackathon.value?.slug || t.hackathonSlug === hackathon.value?.id))

// 리더보드
const leaderboards = computed(() => db.leaderboards.filter(l => l.hackathonSlug === hackathon.value?.slug || l.hackathonSlug === hackathon.value?.id))

// 제출 폼
const submitMemo = ref('')
const submitLink = ref('')
const handleSubmission = () => {
  if (!submitMemo.value) return alert('내용을 입력해주세요.')
  db.addSubmission({
    hackathonSlug: hackathon.value.slug || hackathon.value.id,
    userId: 'currentUser', // Mock
    memo: submitMemo.value,
    link: submitLink.value,
    createdAt: new Date().toISOString()
  })
  alert('제출이 완료되었습니다!')
  submitMemo.value = ''
  submitLink.value = ''
}
</script>

<template>
  <div v-if="hackathon" class="flex flex-col gap-6 pb-24 max-w-[1200px] mx-auto w-full">
    <!-- Hero Section -->
    <section class="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#101928] to-[#0A0D14] border border-white/5 p-12 flex flex-col items-start gap-8">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
      
      <div class="relative z-10 flex flex-col items-start gap-6 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-[0.15em] uppercase">
          <span v-if="hackathon.status === 'ongoing'" class="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
          {{ hackathon.status === 'ongoing' ? 'LIVE NOW' : hackathon.status === 'upcoming' ? 'RECRUITING' : 'ENDED' }}
        </div>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-outfit font-bold tracking-tight text-white leading-[1.1]">
          {{ hackathon.title }}
        </h1>
        
        <p class="text-base text-sync-muted leading-relaxed max-w-xl">
          {{ hackathon.description }}
        </p>
        
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button class="bg-sync-primary hover:bg-sync-primaryHover text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md">
            참가 신청하기
          </button>
        </div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-white/5 pb-0 my-2 overflow-x-auto no-scrollbar scroll-smooth">
      <button 
        v-for="tab in tabs" :key="tab"
        @click="activeTab = tab"
        :class="[
          activeTab === tab ? 'bg-white/10 text-white border-b-2 border-white/20 rounded-t-lg font-bold' : 'text-sync-muted hover:text-white',
          'px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap outline-none'
        ]"
      >{{ tab }}</button>
    </div>

    <!-- Content Sections -->
    <section class="w-full bg-[#181A20] rounded-2xl border border-white/5 p-6 lg:p-10 min-h-[400px]">
      <!-- 1. 개요 -->
      <div v-if="activeTab === '개요'" class="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
        <h3 class="text-xl font-bold text-white mb-2">해커톤 개요</h3>
        <p class="text-sync-muted leading-relaxed whitespace-pre-wrap">{{ hackathon.description }}</p>
        
        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-[#22252D] rounded-xl p-6 flex flex-col gap-2 border border-white/5">
            <span class="text-[10px] text-sync-muted uppercase tracking-[0.2em] font-bold">참가자</span>
            <span class="text-2xl font-outfit font-bold text-white">{{ hackathon.participants }}명</span>
          </div>
          <div class="bg-[#22252D] rounded-xl p-6 flex flex-col gap-2 border border-white/5">
            <span class="text-[10px] text-sync-muted uppercase tracking-[0.2em] font-bold">상태</span>
            <span class="text-2xl font-outfit font-bold text-white capitalize">{{ hackathon.status }}</span>
          </div>
          <div class="md:col-span-2 bg-[#22252D] rounded-xl p-6 flex flex-col gap-2 border border-white/5">
            <span class="text-[10px] text-sync-muted uppercase tracking-[0.2em] font-bold">태그</span>
            <div class="flex flex-wrap gap-2 mt-1">
              <span v-for="tag in hackathon.tags" :key="tag" class="px-2.5 py-1 text-xs font-bold text-white/70 bg-white/5 rounded-md border border-white/5">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 평가 기준 -->
      <div v-if="activeTab === '평가 기준'" class="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
         <h3 class="text-xl font-bold text-white mb-2">평가 기준</h3>
         <div class="p-8 rounded-2xl bg-gradient-to-br from-[#22252D] to-[#1A1C23] border border-white/5 shadow-inner">
           <p class="text-sync-muted leading-relaxed whitespace-pre-wrap text-lg">{{ hackathon.evaluation || '평가 기준이 등록되지 않았습니다.' }}</p>
         </div>
      </div>

      <!-- 3. 일정 -->
      <div v-if="activeTab === '일정'" class="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
         <h3 class="text-xl font-bold text-white mb-2">대회 일정</h3>
         <div class="flex flex-col gap-4">
           <div class="flex items-center gap-6 p-6 rounded-2xl border border-white/5 bg-[#22252D]">
             <div class="w-14 h-14 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-2xl font-bold">🏁</div>
             <div>
               <h4 class="text-white font-bold mb-1">시작일</h4>
               <p class="text-sm text-sync-muted">{{ hackathon.startDate }}</p>
             </div>
           </div>
           <div class="flex items-center gap-6 p-6 rounded-2xl border border-white/5 bg-[#22252D]">
             <div class="w-14 h-14 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-2xl font-bold">🛑</div>
             <div>
               <h4 class="text-white font-bold mb-1">종료일</h4>
               <p class="text-sm text-sync-muted">{{ hackathon.endDate }}</p>
             </div>
           </div>
         </div>
      </div>

      <!-- 4. 상금 -->
      <div v-if="activeTab === '상금'" class="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
         <h3 class="text-xl font-bold text-white mb-2">총 상금 (Prize Pool)</h3>
         <div class="py-12 flex items-center justify-center border border-white/5 rounded-2xl bg-[#22252D] shadow-inner relative overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 pointer-events-none"></div>
           <div class="text-6xl md:text-8xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-sm">
             {{ hackathon.prizePool }}
           </div>
         </div>
      </div>

      <!-- 5. 팀 찾기 -->
      <div v-if="activeTab === '팀 찾기'" class="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-bold text-white">팀 찾기 <span class="text-sync-muted text-sm font-normal ml-2">({{ teams.length }}팀 모집중)</span></h3>
        </div>
        <div v-if="teams.length === 0" class="text-center py-20 text-sync-muted border border-white/5 border-dashed rounded-2xl">
          등록된 팀이 없습니다. Camp에서 팀을 생성해보세요.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="team in teams" :key="team.id" class="p-6 rounded-2xl border border-white/5 bg-[#22252D] flex flex-col justify-between hover:border-white/10 transition-colors">
            <div class="flex flex-col gap-3">
              <h4 class="text-white font-bold text-lg leading-tight">{{ team.name }}</h4>
              <p class="text-sm text-sync-muted line-clamp-3 leading-relaxed h-[60px]">{{ team.intro }}</p>
              
              <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                <span v-for="role in team.lookingFor" :key="role" class="px-2 py-1 bg-[#181A20] border border-white/5 text-[10px] font-medium text-white/80 rounded-md">{{ role }}</span>
              </div>
            </div>
            <button @click="() => alert('참여 요청이 전송되었습니다!')" class="mt-6 w-full py-2.5 bg-sync-primary/10 text-sync-primary hover:bg-sync-primary hover:text-white rounded-xl text-sm font-bold transition-all shadow-sm">
              참여 요청하기
            </button>
          </div>
        </div>
      </div>

      <!-- 6. 제출 -->
      <div v-if="activeTab === '제출'" class="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
         <h3 class="text-xl font-bold text-white mb-2">프로젝트 제출</h3>
         <form @submit.prevent="handleSubmission" class="flex flex-col gap-6 max-w-2xl">
           <div class="flex flex-col gap-2.5">
             <label class="text-sm font-bold text-white">프로젝트 설명 <span class="text-red-400">*</span></label>
             <textarea required v-model="submitMemo" rows="6" class="w-full bg-[#22252D] border border-white/10 rounded-xl p-5 text-white placeholder-white/30 focus:outline-none focus:border-sync-primary transition-colors focus:ring-1 focus:ring-sync-primary resize-none shadow-inner" placeholder="프로젝트에 대한 간단한 설명을 입력하세요. 사용 기술스택과 해결하고자 하는 문제 등을 적어주시면 좋습니다."></textarea>
           </div>
           <div class="flex flex-col gap-2.5">
             <label class="text-sm font-bold text-white">데모 링크 또는 소스코드 URL <span class="text-sync-muted font-normal">(선택)</span></label>
             <input type="url" v-model="submitLink" class="w-full bg-[#22252D] border border-white/10 rounded-xl p-5 text-white placeholder-white/30 focus:outline-none focus:border-sync-primary transition-colors focus:ring-1 focus:ring-sync-primary shadow-inner" placeholder="https://github.com/..." />
           </div>
           <button type="submit" class="self-end mt-2 py-3 px-8 bg-sync-primary hover:bg-sync-primaryHover text-white font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(50,132,255,0.2)]">제출 완료하기</button>
         </form>
      </div>

      <!-- 7. 리더보드 -->
      <div v-if="activeTab === '리더보드'" class="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
         <h3 class="text-xl font-bold text-white mb-2">해커톤 리더보드</h3>
         <div v-if="leaderboards.length === 0" class="text-center py-20 text-sync-muted border border-white/5 border-dashed rounded-2xl">
           아직 리더보드 데이터가 없습니다. (진행 중이거나 제출된 프로젝트가 없음)
         </div>
         <div v-else class="flex flex-col gap-3">
           <div v-for="(lb, i) in leaderboards.sort((a,b) => b.score - a.score)" :key="lb.id" class="flex items-center gap-6 p-5 rounded-2xl border border-white/5 bg-[#22252D] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
             <!-- rank badge bg -->
             <div v-if="i === 0" class="absolute top-0 left-0 bottom-0 w-1 bg-amber-400"></div>
             <div v-if="i === 1" class="absolute top-0 left-0 bottom-0 w-1 bg-gray-300"></div>
             <div v-if="i === 2" class="absolute top-0 left-0 bottom-0 w-1 bg-amber-700"></div>
             
             <div class="w-10 flex items-center justify-center font-outfit font-black text-2xl" :class="i === 0 ? 'text-amber-400 drop-shadow-md' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-700' : 'text-sync-muted'">
               {{ i + 1 }}
             </div>
             <div class="w-12 h-12 rounded-full bg-[#181A20] flex items-center justify-center text-lg shadow-inner font-outfit text-white">
               {{ lb.avatarSeed.charAt(0) }}
             </div>
             <div class="flex-1 flex flex-col gap-0.5">
               <span class="text-white font-bold text-lg">{{ lb.nickname }}</span>
               <div class="flex items-center gap-2">
                 <span class="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold tracking-widest text-sync-muted uppercase">{{ lb.status }}</span>
               </div>
             </div>
             <div class="pr-2 flex flex-col items-end">
               <span class="text-2xl font-outfit font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{{ lb.score.toLocaleString() }}</span>
               <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase">Points</span>
             </div>
           </div>
         </div>
      </div>
    </section>
  </div>
  
  <div v-else class="min-h-[50vh] flex flex-col items-center justify-center gap-6 text-center">
    <div class="text-6xl mb-2 opacity-50">🧭</div>
    <h2 class="text-2xl text-white font-bold tracking-tight">해커톤 정보를 찾을 수 없습니다.</h2>
    <p class="text-sync-muted text-sm">입력하신 링크가 잘못되었거나 삭제된 페이지입니다.</p>
    <router-link to="/hackathons" class="mt-2 text-sync-primary hover:text-white transition-colors bg-sync-primary/10 hover:bg-sync-primary py-2.5 px-6 rounded-xl font-bold border border-sync-primary/20">목록으로 돌아가기</router-link>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
