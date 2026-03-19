<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Utility to match root paths for active states
const isPathActive = (path) => {
  if (path === '/' && route.path === '/') return true;
  if (path !== '/' && route.path.startsWith(path)) return true;
  return false;
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-[#0D0E12]/80 backdrop-blur-xl border-b border-navbar-border">
    <div class="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2">
        <span class="font-outfit font-bold text-xl tracking-tight text-white">AELIER</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-8 h-full">
        <RouterLink to="/" class="h-full flex items-center text-xs font-semibold tracking-wider text-aelier-muted hover:text-white transition-colors duration-200 relative" :class="{ 'text-aelier-primary': isPathActive('/') }">
          HOME
          <span v-if="isPathActive('/')" class="absolute bottom-0 left-0 w-full h-[2px] bg-aelier-primary rounded-t-md"></span>
        </RouterLink>
        
        <RouterLink to="/hackathons" class="h-full flex items-center text-xs font-semibold tracking-wider text-aelier-muted hover:text-white transition-colors duration-200 relative" :class="{ 'text-aelier-primary': isPathActive('/hackathons') }">
          HACKATHONS
          <span v-if="isPathActive('/hackathons')" class="absolute bottom-0 left-0 w-full h-[2px] bg-aelier-primary rounded-t-md"></span>
        </RouterLink>
        
        <RouterLink to="/camp" class="h-full flex items-center text-xs font-semibold tracking-wider text-aelier-muted hover:text-white transition-colors duration-200 relative" :class="{ 'text-aelier-primary': isPathActive('/camp') }">
          CAMP
          <span v-if="isPathActive('/camp')" class="absolute bottom-0 left-0 w-full h-[2px] bg-aelier-primary rounded-t-md"></span>
        </RouterLink>
        <RouterLink to="/rankings" class="h-full flex items-center text-xs font-semibold tracking-wider text-aelier-muted hover:text-white transition-colors duration-200 relative" :class="{ 'text-aelier-primary': isPathActive('/rankings') }">
          RANKINGS
          <span v-if="isPathActive('/rankings')" class="absolute bottom-0 left-0 w-full h-[2px] bg-aelier-primary rounded-t-md"></span>
        </RouterLink>
      </nav>

      <div class="flex items-center gap-5 relative">
        <button class="text-aelier-muted hover:text-white transition-colors relative">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0D0E12]"></span>
        </button>
        <div class="w-8 h-8 rounded-full bg-orange-200 overflow-hidden cursor-pointer flex-shrink-0">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User Profile" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.border-navbar-border {
  border-color: rgba(255, 255, 255, 0.04);
}
</style>
