<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

if (!authStore.isAuthenticated) {
  router.push('/login')
}

const formData = ref({
  nickname: '',
  realName: '',
  email: '',
  role: '',
  avatar: ''
})

const isSaving = ref(false)

onMounted(() => {
  if (authStore.user) {
    formData.value = {
      nickname: authStore.user.nickname || '',
      realName: authStore.user.realName || '',
      email: authStore.user.email || '',
      role: authStore.user.role || '',
      avatar: authStore.user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.user.nickname}`
    }
  }
})

const handleSave = async () => {
  isSaving.value = true
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  authStore.updateProfile(formData.value)
  
  isSaving.value = false
  alert('프로필 정보가 성공적으로 업데이트되었습니다.')
  router.push('/mypage')
}

const refreshAvatar = () => {
  formData.value.avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${Date.now()}`
}
</script>

<template>
  <div class="max-w-[800px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
    
    <!-- Header -->
    <div class="flex flex-col gap-4 border-b border-sync-border pb-8">
      <RouterLink to="/mypage" class="text-sync-muted hover:text-sync-text transition-colors text-sm font-bold flex items-center gap-1 w-max">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        마이페이지로 돌아가기
      </RouterLink>

      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-outfit font-black tracking-tight text-sync-text font-outfit">프로필 수정</h1>
        <p class="text-sync-muted text-sm font-medium">빌더로서의 정보를 최신으로 유지하세요.</p>
      </div>
    </div>

    <!-- Edit Form Content -->
    <div class="glass-card p-8 md:p-12 rounded-[2.5rem] border border-sync-border shadow-2xl relative overflow-hidden">
      <!-- Ambient effects -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-sync-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <form @submit.prevent="handleSave" class="flex flex-col gap-10">
        
        <!-- Avatar Edit Section -->
        <div class="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-sync-border/50">
          <div class="relative group">
            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#181A20] shadow-xl bg-slate-200 relative">
              <img :src="formData.avatar" class="w-full h-full object-cover" />
            </div>
            <button type="button" @click="refreshAvatar" class="absolute bottom-1 right-1 p-2.5 bg-sync-primary text-white rounded-full shadow-lg hover:bg-sync-primaryHover transition-all transform hover:scale-110 active:scale-95">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
          <div class="flex flex-col gap-1 text-center sm:text-left">
            <h3 class="text-lg font-bold text-sync-text">아바타 이미지</h3>
            <p class="text-xs text-sync-muted font-medium mb-2">Notionist 스타일의 랜덤 아바타를 생성합니다.</p>
            <span class="text-[10px] text-sync-primary font-black uppercase tracking-widest bg-sync-primary/10 px-2 py-0.5 rounded w-max mx-auto sm:mx-0">SYNC DEFAULT AVATAR SYSTEM</span>
          </div>
        </div>

        <!-- Input Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Nickname -->
          <div class="flex flex-col gap-2 group">
            <label class="text-[11px] font-black text-sync-muted uppercase tracking-widest ml-1 transition-colors group-focus-within:text-sync-primary">닉네임</label>
            <input v-model="formData.nickname" type="text" placeholder="Gildong_Dev" required
                   class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-2xl py-4 px-5 text-[15px] font-bold text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-4 focus:ring-sync-primary/10 transition-all shadow-sm">
          </div>

          <!-- Real Name -->
          <div class="flex flex-col gap-2 group">
            <label class="text-[11px] font-black text-sync-muted uppercase tracking-widest ml-1 transition-colors group-focus-within:text-sync-primary">본명 (실명)</label>
            <input v-model="formData.realName" type="text" placeholder="홍길동" required
                   class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-2xl py-4 px-5 text-[15px] font-bold text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-4 focus:ring-sync-primary/10 transition-all shadow-sm">
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-2 group">
            <label class="text-[11px] font-black text-sync-muted uppercase tracking-widest ml-1 transition-colors group-focus-within:text-sync-primary">이메일</label>
            <input v-model="formData.email" type="email" placeholder="gildong@sync.com" required
                   class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-2xl py-4 px-5 text-[15px] font-bold text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-4 focus:ring-sync-primary/10 transition-all shadow-sm">
          </div>

          <!-- Role -->
          <div class="flex flex-col gap-2 group">
            <label class="text-[11px] font-black text-sync-muted uppercase tracking-widest ml-1 transition-colors group-focus-within:text-sync-primary">개발자 포지션 (역할)</label>
            <input v-model="formData.role" type="text" placeholder="Frontend Architect / AI Researcher"
                   class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-2xl py-4 px-5 text-[15px] font-bold text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-4 focus:ring-sync-primary/10 transition-all shadow-sm">
          </div>
        </div>

        <!-- Submit Section -->
        <div class="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-sync-border">
          <button type="submit" :disabled="isSaving"
                  class="w-full sm:w-max px-12 py-4 bg-sync-primary hover:bg-sync-primaryHover text-white rounded-2xl font-bold text-sm transition-all shadow-[0_8px_20px_rgba(50,132,255,0.3)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!isSaving">데이터 변경사항 저장</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              처리 중...
            </span>
          </button>
          <RouterLink to="/mypage" class="w-full sm:w-max px-8 py-4 text-sync-muted hover:text-sync-text font-bold text-sm text-center">
            수정 취소
          </RouterLink>
        </div>

      </form>
    </div>

    <!-- Danger Zone -->
    <div class="mt-10 p-8 rounded-[2rem] border border-red-500/10 bg-red-500/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
       <div class="flex flex-col gap-1">
         <h4 class="text-base font-black text-red-500">계정 영구 삭제</h4>
         <p class="text-xs text-red-400 font-medium">모든 정보와 점수가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
       </div>
       <button class="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
         Sync 떠나기
       </button>
    </div>
  </div>
</template>

<style scoped>
</style>
