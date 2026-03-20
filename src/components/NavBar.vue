<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import SearchModal from './SearchModal.vue'

const route = useRoute()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const isSearchOpen = ref(false)
const isDropdownOpen = ref(false)

// Utility to match root paths for active states
const isPathActive = (path) => {
  if (path === '/' && route.path === '/') return true;
  if (path !== '/' && route.path.startsWith(path)) return true;
  return false;
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/60 dark:bg-[#0D0E12]/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 transition-colors duration-300">
    <div class="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2 group">
        <span class="font-outfit font-bold text-xl tracking-tight text-sync-text group-hover:text-sync-primary transition-colors">Sync</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-8 h-full">
        <RouterLink to="/" class="h-full flex items-center text-xs font-semibold tracking-wider text-sync-muted hover:text-sync-text transition-colors duration-200 relative" :class="{ 'text-sync-primary': isPathActive('/') }">
          HOME
          <span v-if="isPathActive('/')" class="absolute bottom-0 left-0 w-full h-[2px] bg-sync-primary rounded-t-md"></span>
        </RouterLink>
        <RouterLink to="/hackathons" class="h-full flex items-center text-xs font-semibold tracking-wider text-sync-muted hover:text-sync-text transition-colors duration-200 relative" :class="{ 'text-sync-primary': isPathActive('/hackathons') }">
          HACKATHONS
          <span v-if="isPathActive('/hackathons')" class="absolute bottom-0 left-0 w-full h-[2px] bg-sync-primary rounded-t-md"></span>
        </RouterLink>
        <RouterLink to="/camp" class="h-full flex items-center text-xs font-semibold tracking-wider text-sync-muted hover:text-sync-text transition-colors duration-200 relative" :class="{ 'text-sync-primary': isPathActive('/camp') }">
          CAMP
          <span v-if="isPathActive('/camp')" class="absolute bottom-0 left-0 w-full h-[2px] bg-sync-primary rounded-t-md"></span>
        </RouterLink>
        <RouterLink to="/rankings" class="h-full flex items-center text-xs font-semibold tracking-wider text-sync-muted hover:text-sync-text transition-colors duration-200 relative" :class="{ 'text-sync-primary': isPathActive('/rankings') }">
          RANKINGS
          <span v-if="isPathActive('/rankings')" class="absolute bottom-0 left-0 w-full h-[2px] bg-sync-primary rounded-t-md"></span>
        </RouterLink>
      </nav>

      <div class="flex items-center gap-4 sm:gap-5 relative">
        <!-- Search Icon -->
        <button @click="isSearchOpen = true" class="text-sync-muted hover:text-sync-text transition-colors p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hidden sm:block">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
        <!-- Theme Toggle -->
        <button @click="themeStore.toggleTheme" class="text-sync-muted hover:text-sync-text transition-colors p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" title="Toggle Theme">
          <svg v-if="themeStore.isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>
        <!-- Divider -->
        <div class="w-px h-5 bg-sync-border hidden sm:block"></div>
        <!-- Auth Profile Block -->
        <div class="flex items-center gap-3 relative">
          <RouterLink v-if="!authStore.isAuthenticated" to="/login" class="px-5 py-2.5 bg-sync-primary hover:bg-sync-primaryHover text-white text-[11px] uppercase tracking-wide font-bold rounded-xl transition-all shadow-[0_4px_10px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">
            로그인 / 회원가입
          </RouterLink>
          
          <div v-else>
            <div v-if="isDropdownOpen" class="fixed inset-0 z-40" @click="isDropdownOpen = false"></div>
            
            <div class="relative z-50">
              <div @click="isDropdownOpen = !isDropdownOpen" class="w-9 h-9 rounded-full bg-slate-200 overflow-hidden cursor-pointer flex-shrink-0 border-2 border-white dark:border-[#22252D] hover:opacity-80 transition-all shadow-sm group">
                <img :src="authStore.user.avatar" alt="User Profile" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
              </div>
              
              <transition name="dropdown-fade">
                <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-52 bg-white/90 dark:bg-[#181A20]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl py-2 shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col group origin-top-right">
                  <div class="px-4 py-3.5 border-b border-black/5 dark:border-white/10 mb-1 flex flex-col gap-0.5 shrink-0">
                     <span class="text-[13px] font-bold text-sync-text">{{ authStore.user.nickname }}</span>
                     <span class="text-[10px] text-sync-muted font-bold truncate opacity-80">{{ authStore.user.email || 'builder@sync.com' }}</span>
                  </div>
                  <RouterLink to="/mypage" class="px-4 py-2.5 text-sm font-bold text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2.5 shrink-0" @click="isDropdownOpen = false">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    마이페이지
                  </RouterLink>
                  <button @click="authStore.logout(); isDropdownOpen = false" class="px-4 py-2.5 text-sm font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2.5 w-full text-left shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    로그아웃
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Search Modal -->
  <Transition name="fade" appear>
    <SearchModal v-if="isSearchOpen" @close="isSearchOpen = false" />
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}
</style>
