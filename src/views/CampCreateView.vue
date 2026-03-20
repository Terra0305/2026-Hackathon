<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockHackathons } from '../data/mockData'

const router = useRouter()
const teamName = ref('')
const hackathonId = ref('')
const description = ref('')
const rolesRequired = ref([{ name: '', count: 1 }])

const addRole = () => rolesRequired.value.push({ name: '', count: 1 })
const removeRole = (index) => rolesRequired.value.splice(index, 1)

const submitTeam = () => {
  // Mock function, just goes back to /camp
  alert('팀원 모집 공고가 성공적으로 등록 되었습니다!\n' + '해커톤: ' + mockHackathons.find(h=>h.id === hackathonId.value)?.title)
  router.push('/camp')
}
</script>

<template>
  <div class="flex justify-center pb-32 transition-colors duration-300 w-full animate-fade-in relative pt-4">
    <!-- Ambient Background Effects for this page -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-sync-primary/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>
    <div class="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-400/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>

    <div class="glass-card w-full max-w-3xl p-8 md:p-12 flex flex-col gap-10">
      <div class="border-b border-sync-border pb-6">
        <h1 class="text-3xl font-outfit font-black text-sync-text tracking-tight">Post a New Team</h1>
        <p class="text-sync-muted mt-2">함께 도전할 새로운 팀원을 찾고, 프로젝트를 런칭하세요.</p>
      </div>

      <form @submit.prevent="submitTeam" class="flex flex-col gap-8">
        
        <!-- Team Name -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-sync-text">팀 이름</label>
          <input v-model="teamName" type="text" placeholder="예: 로켓 추진팀" required class="w-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
        </div>

        <!-- Target Hackathon -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-sync-text">목표 참가 해커톤</label>
          <div class="relative">
             <select v-model="hackathonId" required class="w-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] appearance-none cursor-pointer">
               <option value="" disabled>분류/해커톤 콘테스트를 선택하세요</option>
               <option v-for="h in mockHackathons" :value="h.id" :key="h.id">{{ h.type }} | {{ h.title }}</option>
             </select>
             <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-sync-muted">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
             </div>
          </div>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-sync-text">프로젝트 아이디어 및 본인/팀 소개</label>
          <textarea v-model="description" required rows="6" placeholder="우주 탐사용 AI 챗봇을 기획 중입니다. 함께 아이디어를 발산하고 프로토타입을 만들어갈 우주에 관심이 많은 디자이너, 프론트엔드를 찾습니다! 연락처: 카카오톡 오픈채팅방 ..." class="w-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"></textarea>
        </div>

        <!-- Roles required -->
        <div class="flex flex-col gap-4">
          <label class="text-sm font-bold text-sync-text flex justify-between items-center border-b border-sync-border pb-3">
            모집 역할 분야 및 인원
            <button type="button" @click="addRole" class="text-xs text-sync-primary bg-sync-primary/10 hover:bg-sync-primary/20 px-3 py-1.5 rounded-lg transition-colors border border-sync-primary/30 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> 추가 구인 파트
            </button>
          </label>
          
          <div v-for="(role, index) in rolesRequired" :key="index" class="flex flex-col sm:flex-row items-center gap-3">
            <div class="relative flex-1 w-full sm:w-auto">
               <select v-model="role.name" required class="w-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] appearance-none cursor-pointer">
                  <option value="" disabled>어떤 역할이 필요하신가요?</option>
                  <option value="프론트엔드">프론트엔드</option>
                  <option value="백엔드">백엔드</option>
                  <option value="인프라/DB">클라우드 인프라/DB</option>
                  <option value="데이터 엔지니어">데이터 엔지니어/AI</option>
                  <option value="기획자">앱 기획자 (PM/PO)</option>
                  <option value="디자이너">UX/UI 디자이너</option>
               </select>
               <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-sync-muted">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
            </div>
            
            <div class="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
               <input v-model.number="role.count" type="number" min="1" max="10" required class="w-24 bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-sync-text text-center focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
               <span class="text-sync-text font-bold text-sm shrink-0 w-8">명</span>
               
               <button v-if="rolesRequired.length > 1" type="button" @click="removeRole(index)" class="w-10 h-10 flex items-center justify-center shrink-0 text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-colors ml-2" title="삭제하기">
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
               </button>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="pt-8 border-t border-sync-border mt-4 flex flex-col sm:flex-row justify-end gap-3 w-full">
          <button type="button" @click="router.back()" class="w-full sm:w-auto px-6 py-4 rounded-xl border border-sync-border bg-white/50 dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/5 text-sync-muted hover:text-sync-text text-sm font-bold transition-all shadow-sm">취소</button>
          <button type="submit" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:shadow-[0_6px_20px_rgba(50,132,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
            팀원 공고 등록하기 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
