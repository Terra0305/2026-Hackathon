<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isLogin = ref(true)

const email = ref('')
const password = ref('')
const nickname = ref('')
const realName = ref('')

const handleLogin = () => {
  if (email.value && password.value) {
    authStore.login(email.value, password.value)
  } else {
    alert('이메일과 비밀번호를 모두 입력해주세요.')
  }
}

const handleSignup = () => {
  if (nickname.value && realName.value && email.value && password.value) {
    authStore.signup(nickname.value, realName.value, email.value, password.value)
  } else {
    alert('모든 필드(닉네임, 본명, 이메일, 비밀번호)를 기입해주세요.')
  }
}
</script>

<template>
  <div class="w-full flex-1 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 py-12 px-4 sm:px-6 transition-colors duration-500 min-h-[calc(100vh-8rem)] relative overflow-hidden">
    
    <!-- Background Ambient Gradients for Glassmorphism -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen transition-colors duration-1000"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-teal-400/20 dark:bg-teal-500/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen transition-colors duration-1000"></div>

    <!-- Left Promotional -->
    <div class="flex flex-col gap-8 w-full md:w-1/2 max-w-md z-10">
      <div class="flex flex-col gap-2">
        <h1 class="text-6xl font-outfit font-black tracking-tight text-sync-text mb-4 transition-colors">Sync</h1>
        <h2 class="text-3xl font-bold text-sync-text leading-snug transition-colors">
          해커톤을 더 쉽게,<br/>
          더 빠르게
        </h2>
        <p class="text-sync-muted mt-2 leading-relaxed transition-colors">
          팀 빌딩부터 제출까지 한 곳에서.<br/>
          빌더들을 위한 정교한 디지털 아틀리에.
        </p>
      </div>
      
      <div class="flex items-center gap-4 mt-8">
        <div class="flex -space-x-3">
          <div class="w-10 h-10 rounded-full border-2 border-sync-bg bg-orange-300 z-30 flex-shrink-0 relative overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=A" class="w-full h-full object-cover"></div>
          <div class="w-10 h-10 rounded-full border-2 border-sync-bg bg-pink-300 z-20 flex-shrink-0 relative overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=B" class="w-full h-full object-cover"></div>
          <div class="w-10 h-10 rounded-full border-2 border-sync-bg bg-teal-300 z-10 flex-shrink-0 relative overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=C" class="w-full h-full object-cover"></div>
        </div>
        <p class="text-sm font-medium text-sync-text transition-colors">2,400+ 빌더들이 함께하고 있습니다</p>
      </div>
    </div>

    <!-- Right Auth Box (Apple Glassmorphism UI) -->
    <div class="w-full md:w-1/2 max-w-[420px] z-10 perspective-1000">
      <div class="rounded-[2.5rem] p-8 pb-10 transition-all duration-500 bg-white/60 dark:bg-[#181A20]/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transform-gpu hover:scale-[1.01] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.8)] flex flex-col min-h-[500px]">
        
        <!-- Animated Segmented Control (Tabs) -->
        <div class="flex items-center bg-black/5 dark:bg-white/5 rounded-xl p-1 mb-8 relative shrink-0">
          <div 
            class="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white dark:bg-[#22252D] rounded-lg shadow-sm transition-transform duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1)" 
            :style="{ transform: isLogin ? 'translateX(0.125rem)' : 'translateX(calc(100% + 0.375rem))' }"
          ></div>
          
          <button @click="isLogin = true" class="flex-1 py-3 rounded-lg text-sm font-bold z-10 transition-colors duration-300" :class="isLogin ? 'text-sync-primary' : 'text-sync-muted hover:text-sync-text'">로그인</button>
          <button @click="isLogin = false" class="flex-1 py-3 rounded-lg text-sm font-bold z-10 transition-colors duration-300" :class="!isLogin ? 'text-sync-primary' : 'text-sync-muted hover:text-sync-text'">회원가입</button>
        </div>

        <!-- Form Area (Dynamic based on state) -->
        <div class="relative w-full flex-1 mb-4">
          <transition name="slide-fade" mode="out-in">
            <!-- LOGIN FORM -->
            <form v-if="isLogin" key="login" class="flex flex-col gap-6 w-full" @submit.prevent="handleLogin">
              <!-- Email -->
              <div class="flex flex-col gap-2 group">
                <label class="text-xs font-bold text-sync-text tracking-widest transition-colors group-focus-within:text-sync-primary">이메일</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted group-focus-within:text-sync-primary transition-colors">@</span>
                  <input v-model="email" type="email" placeholder="name@company.com" class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-sync-text placeholder-sync-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all">
                </div>
              </div>

              <!-- Password -->
              <div class="flex flex-col gap-2 group">
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted group-focus-within:text-sync-primary transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </span>
                  <input v-model="password" type="password" placeholder="••••••••" class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3.5 pl-10 pr-10 text-sm text-sync-text placeholder-sync-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all">
                </div>
              </div>

              <!-- Options -->
              <div class="flex items-center justify-between text-xs mt-[-8px]">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <div class="w-4 h-4 rounded border border-sync-border flex items-center justify-center group-hover:border-sync-primary transition-colors bg-white/50 dark:bg-black/50 backdrop-blur-sm"></div>
                  <span class="text-sync-muted group-hover:text-sync-text transition-colors">로그인 상태 유지</span>
                </label>
                <a href="#" class="text-sync-primary font-bold hover:text-sync-primaryHover transition-colors">비밀번호 찾기</a>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="w-full py-4 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white font-bold text-sm transition-all mt-2 shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:shadow-[0_6px_20px_rgba(50,132,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                로그인 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </form>

            <!-- SIGNUP FORM -->
            <form v-else key="signup" class="flex flex-col gap-4 w-full" @submit.prevent="handleSignup">
              <!-- Nickname -->
               <div class="flex flex-col gap-2 group">
                <label class="text-xs font-bold text-sync-text tracking-widest transition-colors group-focus-within:text-sync-primary">닉네임</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted group-focus-within:text-sync-primary transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </span>
                  <input v-model="nickname" type="text" placeholder="Gildong_Dev" class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-sync-text placeholder-sync-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all">
                </div>
              </div>

              <!-- Real Name -->
              <div class="flex flex-col gap-2 group">
                <label class="text-xs font-bold text-sync-text tracking-widest transition-colors group-focus-within:text-sync-primary">본명</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted group-focus-within:text-sync-primary transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </span>
                  <input v-model="realName" type="text" placeholder="홍길동" class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-sync-text placeholder-sync-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all">
                </div>
              </div>

              <!-- Email -->
              <div class="flex flex-col gap-2 group">
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted group-focus-within:text-sync-primary transition-colors">@</span>
                  <input v-model="email" type="email" placeholder="name@company.com" class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-sync-text placeholder-sync-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all">
                </div>
              </div>

              <!-- Password -->
              <div class="flex flex-col gap-2 group">
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted group-focus-within:text-sync-primary transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </span>
                  <input v-model="password" type="password" placeholder="비밀번호 입력 (8자리 이상)" class="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-sync-text placeholder-sync-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-sync-primary focus:ring-2 focus:ring-sync-primary/20 transition-all">
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="w-full py-4 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white font-bold text-sm transition-all mt-4 shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:shadow-[0_6px_20px_rgba(50,132,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                계정 생성하기 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              </button>
            </form>
          </transition>
        </div>

        <div class="mt-4 shrink-0">
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="h-px flex-1 bg-sync-border transition-colors"></div>
            <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest transition-colors">OR CONTINUE WITH</span>
            <div class="h-px flex-1 bg-sync-border transition-colors"></div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <!-- Google Login Button -->
            <button @click="authStore.login('social@google.com', 'dummy')" class="w-full py-3.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span class="text-xs font-bold text-sync-text transition-colors">Google</span>
            </button>
            
            <!-- GitHub Login Button -->
            <button @click="authStore.login('social@github.com', 'dummy')" class="w-full py-3.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2 text-sync-text transition-colors">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span class="text-xs font-bold transition-colors">GitHub</span>
            </button>
            <!-- Admin Login Button -->
            <button @click="authStore.login('admin@sync.com', 'admin')" class="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2 text-red-500 font-bold shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <span class="text-xs transition-colors">Admin Demo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* High quality slide-fade transition for form toggling */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.98);
}

.slide-fade-leave-active {
  position: absolute;
  width: 100%;
}
</style>
