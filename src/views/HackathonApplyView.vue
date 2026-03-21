<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockHackathons, mockMyHackathons } from '../data/mockData'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const hackathon = computed(() => {
  return mockHackathons.find(h => String(h.id) === route.params.slug) || mockHackathons[0]
})

const submitForm = ref({
  agreeRules: false,
  agreeSchedule: false,
  participationType: 'team_create' // 'individual', 'team_create', 'team_join'
})

const applyForHackathon = () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }
  
  if (!submitForm.value.agreeRules || !submitForm.value.agreeSchedule) {
    alert('모든 필수 동의사항에 체크해야 신청이 가능합니다.')
    return
  }

  // Set immediate progression bypass
  mockMyHackathons.push({
    id: Date.now(),
    hackathonId: hackathon.value.id,
    title: hackathon.value.title,
    role: submitForm.value.participationType === 'individual' ? '개인 개발자' : '팀 (예정)',
    teamName: submitForm.value.participationType === 'individual' ? 'Solo Participant' : null,
    status: '진행 중',
    appliedDate: new Date().toLocaleDateString('ko-KR')
  })
  
  alert('참여 신청이 완료되었습니다! 선택하신 옵션에 맞춰 이동합니다.')
  
  // Navigate based on selected type
  if (submitForm.value.participationType === 'team_create') {
     router.push(`/camp/create?hackathonId=${hackathon.value.id}`)
  } else if (submitForm.value.participationType === 'team_join') {
     router.push(`/camp?hackathonId=${hackathon.value.id}`)
  } else {
     router.push(`/workspace/${hackathon.value.id}`)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-16 animate-fade-in relative min-h-screen">
    <!-- Ambient Base -->
    <div class="fixed inset-0 bg-gradient-to-b from-sync-primary/5 to-transparent pointer-events-none -z-10"></div>
    <div class="fixed top-20 right-20 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen -z-10"></div>

    <button @click="router.back()" class="text-xs font-bold text-sync-muted hover:text-sync-text mb-8 flex items-center gap-2 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      돌아가기
    </button>

    <div class="glass-card p-10 rounded-[2rem] border border-sync-border drop-shadow-sm bg-white/60 dark:bg-[#181A20]/60">
       <div class="flex items-center gap-3 mb-3">
         <span class="px-3 py-1 rounded bg-sync-primary/10 border border-sync-primary/30 text-[10px] font-bold text-sync-primary uppercase">{{ hackathon.type }}</span>
       </div>
       <h1 class="text-3xl font-outfit font-black text-sync-text mb-2 tracking-tight">{{ hackathon.title }} 신청서</h1>
       <p class="text-sync-muted text-sm font-medium mb-10 pb-6 border-b border-sync-border">본 대회는 심사 없이 신청 즉시 워크스페이스 이용 및 팀 합류가 가능합니다.</p>

       <form @submit.prevent="applyForHackathon" class="flex flex-col gap-10">
          
          <!-- T&C Section -->
          <div class="flex flex-col gap-5">
            <h3 class="text-sm font-bold text-sync-text flex items-center gap-2">필수 사항 동의 <span class="text-red-500">*</span></h3>
            
            <label class="flex items-start gap-4 cursor-pointer p-4 rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 hover:border-sync-primary/50 transition-colors">
              <input type="checkbox" v-model="submitForm.agreeRules" class="mt-1 w-5 h-5 rounded border-sync-border text-sync-primary focus:ring-sync-primary bg-transparent custom-checkbox" />
              <div class="flex flex-col gap-1">
                 <span class="text-sm font-bold text-sync-text">대회 규정 및 오픈소스 준수사항을 모두 확인했고 동의합니다.</span>
                 <p class="text-xs text-sync-muted font-medium">부정 행위 (코드 재사용 등) 적발 시 즉시 자격이 박탈됩니다.</p>
              </div>
            </label>

            <label class="flex items-start gap-4 cursor-pointer p-4 rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 hover:border-sync-primary/50 transition-colors">
              <input type="checkbox" v-model="submitForm.agreeSchedule" class="mt-1 w-5 h-5 rounded border-sync-border text-sync-primary focus:ring-sync-primary bg-transparent custom-checkbox" />
              <div class="flex flex-col gap-1">
                 <span class="text-sm font-bold text-sync-text">공지된 대회 일정 전체에 참여할 수 있음을 확인합니다.</span>
                 <p class="text-xs text-sync-muted font-medium">OT 및 중간 평가, 최종 PT 일정에 무단 불참할 경우 페널티가 부여됩니다.</p>
              </div>
            </label>
          </div>

          <!-- Modality Selection -->
          <div class="flex flex-col gap-5">
            <h3 class="text-sm font-bold text-sync-text flex items-center gap-2">참가 방식 선택 <span class="text-red-500">*</span></h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
               
               <label class="cursor-pointer relative group">
                 <input type="radio" value="individual" v-model="submitForm.participationType" class="peer sr-only" />
                 <div class="flex flex-col items-center justify-center p-6 text-center border-2 border-sync-border rounded-2xl peer-checked:bg-sync-primary/10 peer-checked:border-sync-primary peer-checked:text-sync-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sync-muted gap-3 h-full">
                   <span class="text-3xl drop-shadow-sm group-hover:scale-110 transition-transform">👤</span>
                   <span class="text-sm font-bold">1인 (개인 빌드)</span>
                   <p class="text-[10px] font-medium opacity-70">팀원 없이 혼자 해커톤에 참여하여 단독 프로젝트를 완성합니다.</p>
                 </div>
               </label>
               
               <label class="cursor-pointer relative group">
                 <input type="radio" value="team_join" v-model="submitForm.participationType" class="peer sr-only" />
                 <div class="flex flex-col items-center justify-center p-6 text-center border-2 border-sync-border rounded-2xl peer-checked:bg-sync-primary/10 peer-checked:border-sync-primary peer-checked:text-sync-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sync-muted gap-3 h-full">
                   <span class="text-3xl drop-shadow-sm group-hover:scale-110 transition-transform">🤝</span>
                   <span class="text-sm font-bold">기존 팀 합류</span>
                   <p class="text-[10px] font-medium opacity-70">이미 개설된 팀 모집 공고를 둘러보고 역할을 찾아 합류합니다.</p>
                 </div>
               </label>

               <label class="cursor-pointer relative group">
                 <input type="radio" value="team_create" v-model="submitForm.participationType" class="peer sr-only" />
                 <div class="flex flex-col items-center justify-center p-6 text-center border-2 border-sync-border rounded-2xl peer-checked:bg-sync-primary/10 peer-checked:border-sync-primary peer-checked:text-sync-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sync-muted gap-3 h-full">
                   <span class="text-3xl drop-shadow-sm group-hover:scale-110 transition-transform">🚀</span>
                   <span class="text-sm font-bold">새로운 팀 개설</span>
                   <p class="text-[10px] font-medium opacity-70">새로운 아이디어로 프로젝트 캠프에 구인 공고를 바로 올립니다.</p>
                 </div>
               </label>

            </div>
          </div>

          <button type="submit" class="w-full py-4 bg-sync-primary hover:bg-sync-primaryHover text-white text-base font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(50,132,255,0.4)] hover:-translate-y-1 mt-4">
            동의 및 신청 완료하기
          </button>
       </form>
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
.custom-checkbox {
  @apply rounded border-sync-border bg-white dark:bg-[#181A20] shadow-inner;
  appearance: none;
}
.custom-checkbox:checked {
  @apply bg-sync-primary border-sync-primary;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
