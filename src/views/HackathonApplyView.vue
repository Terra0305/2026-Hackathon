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
  role: '',
  motivation: '',
  githubUrl: '',
  portfolioUrl: ''
})

const applyForHackathon = () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }
  
  if (!submitForm.value.role) {
    alert('지원 역할을 선택해주세요.')
    return
  }

  // Push to reactive mock array
  mockMyHackathons.push({
    id: Date.now(),
    hackathonId: hackathon.value.id,
    title: hackathon.value.title,
    role: submitForm.value.role,
    teamName: null,
    status: '심사 중',
    appliedDate: new Date().toLocaleDateString('ko-KR')
  })
  
  alert('성공적으로 참가 신청이 접수되었습니다! 마이페이지로 이동합니다.')
  router.push('/mypage')
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
       <p class="text-sync-muted text-sm font-medium mb-10 pb-6 border-b border-sync-border">본 대회는 사전 자격 심사가 진행되며, 합격자에 한해 팀 빌딩이 시작됩니다.</p>

       <form @submit.prevent="applyForHackathon" class="flex flex-col gap-8">
          
          <div class="flex flex-col gap-3">
            <label class="text-sm font-bold text-sync-text">지원 포지션 <span class="text-red-500">*</span></label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
               <label v-for="role in ['프론트엔드', '백엔드', '디자이너', '기획자']" :key="role" class="cursor-pointer">
                 <input type="radio" :value="role" v-model="submitForm.role" class="peer sr-only" />
                 <div class="py-3 px-4 text-center text-sm font-bold text-sync-muted border border-sync-border rounded-xl peer-checked:bg-sync-primary/10 peer-checked:border-sync-primary/50 peer-checked:text-sync-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all w-full">
                   {{ role }}
                 </div>
               </label>
            </div>
          </div>

          <div class="flex flex-col gap-3 group">
            <label class="text-sm font-bold text-sync-text group-focus-within:text-sync-primary transition-colors">지원 동기 및 포부 <span class="text-red-500">*</span></label>
            <textarea required v-model="submitForm.motivation" rows="4" placeholder="해커톤에 참여하게 된 계기와 기여할 수 있는 역량을 적어주세요." class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all custom-scrollbar"></textarea>
          </div>

          <div class="flex flex-col sm:flex-row gap-6">
            <div class="flex-1 flex flex-col gap-3 group">
              <label class="text-sm font-bold text-sync-text group-focus-within:text-sync-primary transition-colors">GitHub 프로필 URL <span class="text-xs text-sync-muted ml-1 font-normal">(선택)</span></label>
              <input v-model="submitForm.githubUrl" type="url" placeholder="https://github.com/..." class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all" />
            </div>

            <div class="flex-1 flex flex-col gap-3 group">
              <label class="text-sm font-bold text-sync-text group-focus-within:text-sync-primary transition-colors">포트폴리오 URL <span class="text-xs text-sync-muted ml-1 font-normal">(선택)</span></label>
              <input v-model="submitForm.portfolioUrl" type="url" placeholder="https://..." class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all" />
            </div>
          </div>

          <div class="bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl flex items-start gap-3 mt-4">
             <span class="text-blue-500 mt-0.5">💡</span>
             <p class="text-xs text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
               신청서 제출 후, 시스템 자격 심사가 영업일 기준 1~2일 소요될 수 있습니다. 합격 및 반려 결과는 이메일 코드를 통해 발송되며 마이페이지에서도 확인 가능합니다.
             </p>
          </div>

          <button type="submit" class="w-full py-4 bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(50,132,255,0.4)] hover:-translate-y-1 mt-4">
            해커톤 참여 신청하기
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
.custom-scrollbar::-webkit-scrollbar {
  height: 0px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
