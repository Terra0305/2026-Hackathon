<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import './assets/main.css'
import { useDbStore } from './stores/db'

const db = useDbStore()

onMounted(() => {
  db.initialize()
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    
    <main class="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Simple footer to match design bottoms -->
    <footer class="mt-auto py-8 border-t border-white/5">
      <div class="max-w-[1240px] mx-auto px-6 flex items-center justify-between text-xs text-sync-muted">
        <div>© 2024 Sync. All rights reserved.</div>
        <div class="flex gap-4">
          <a href="#" class="hover:text-white">Terms</a>
          <a href="#" class="hover:text-white">Privacy</a>
          <a href="#" class="hover:text-white ml-4 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            KR
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
