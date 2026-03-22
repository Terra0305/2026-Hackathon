<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '../data/mockData'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const filterType = ref('all-time') // 'all-time' or 'monthly'
const visibleCount = ref(7) // Top 3 + 4 initially

// Ensure we get a copy and sort without mutating original
const sortedUsers = computed(() => {
  return [...mockUsers].sort((a, b) => {
    const scoreA = filterType.value === 'all-time' ? a.points : a.monthlyPoints
    const scoreB = filterType.value === 'all-time' ? b.points : b.monthlyPoints
    return scoreB - scoreA
  })
})

const top3 = computed(() => sortedUsers.value.slice(0, 3))
const tableUsers = computed(() => sortedUsers.value.slice(3, visibleCount.value))

const loadMore = () => {
  visibleCount.value = Math.min(visibleCount.value + 5, mockUsers.length)
}
</script>

<template>
  <div class="flex flex-col gap-12 pb-24 max-w-[1000px] mx-auto w-full transition-colors duration-300">
    <div class="flex items-end justify-between border-b border-sync-border pb-6 transition-colors duration-300">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-outfit font-bold text-sync-text tracking-tight transition-colors">Top Builders</h1>
        <p class="text-sm text-sync-muted transition-colors">글로벌 해커톤 생태계를 이끌어가는 상위 빌더 랭킹입니다.</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-sync-border">
        <button @click="filterType = 'all-time'" :class="{'bg-sync-card text-sync-text shadow-sm': filterType === 'all-time', 'text-sync-muted hover:text-sync-text': filterType !== 'all-time'}" class="px-4 py-1.5 text-xs font-bold rounded transition-colors">All Time</button>
        <button @click="filterType = 'monthly'" :class="{'bg-sync-card text-sync-text shadow-sm': filterType === 'monthly', 'text-sync-muted hover:text-sync-text': filterType !== 'monthly'}" class="px-4 py-1.5 text-xs font-bold rounded transition-colors">Monthly</button>
      </div>
    </div>

    <!-- My Rank Section -->
    <section v-if="authStore.isAuthenticated && authStore.user" class="glass-card p-4 rounded-2xl flex items-center justify-between border border-sync-primary/20 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-sync-card border border-sync-border overflow-hidden">
          <img :src="authStore.user.avatar" class="w-full h-full object-cover" alt="My Profile"/>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-sync-text">나의 랭킹 현황</span>
          <span class="text-xs text-sync-muted">{{ authStore.user.nickname }}</span>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-lg font-outfit font-black text-sync-primary">
          {{ filterType === 'all-time' 
               ? (mockUsers.find(u => u.id === authStore.user.id)?.points || authStore.user.points || 0).toLocaleString()
               : (mockUsers.find(u => u.id === authStore.user.id)?.monthlyPoints || authStore.user.monthlyPoints || 0).toLocaleString() 
          }} PTS
        </span>
        <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase">My {{ filterType === 'all-time' ? 'All-Time' : 'Monthly' }} Points</span>
      </div>
    </section>

    <!-- Podium Section (Top 3) -->
    <section class="flex items-end justify-center gap-4 sm:gap-8 h-[380px] mt-24">
      <!-- 2nd Place -->
      <div v-if="top3[1]" @click="router.push(`/user/${top3[1].id}`)" class="cursor-pointer flex flex-col items-center justify-end h-full w-[120px] sm:w-[160px] relative group hover:-translate-y-2 transition-transform">
        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/5 dark:bg-white/10 text-sync-text text-[10px] font-bold px-3 py-1.5 border border-sync-border rounded-full backdrop-blur-md z-20">{{ top3[1].role }}</div>
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#C0C0C0] shadow-[0_0_20px_rgba(192,192,192,0.3)] bg-blue-200 relative z-10 overflow-hidden bg-cover bg-center text-center flex items-center justify-center font-bold text-xl text-blue-800">
          <img :src="top3[1].avatar" class="w-full h-full object-cover" alt="avatar"/>
        </div>
        <div class="mt-4 flex flex-col items-center gap-1 z-10">
          <span class="text-lg font-bold text-sync-text truncate w-full text-center px-2">{{ top3[1].nickname }}</span>
          <span class="text-xs font-bold text-[#C0C0C0]">{{ filterType === 'all-time' ? top3[1].points.toLocaleString() : top3[1].monthlyPoints.toLocaleString() }} PTS</span>
        </div>
        <div class="w-full h-[180px] bg-gradient-to-t from-transparent to-[#C0C0C0]/10 border-t-2 border-[#C0C0C0] mt-4 rounded-t-2xl flex items-start justify-center pt-4 backdrop-blur-sm group-hover:from-[#C0C0C0]/5 transition-colors">
          <span class="text-4xl font-outfit font-black text-[#C0C0C0]/50">2</span>
        </div>
      </div>

      <!-- 1st Place -->
      <div v-if="top3[0]" @click="router.push(`/user/${top3[0].id}`)" class="cursor-pointer flex flex-col items-center justify-end h-full w-[140px] sm:w-[200px] relative group hover:-translate-y-2 transition-transform">
        <div class="absolute -top-[72px] flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
        </div>
        <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/5 dark:bg-white/10 text-sync-text text-[10px] font-bold px-3 py-1.5 border border-sync-border rounded-full backdrop-blur-md z-20">{{ top3[0].role }}</div>
        <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.4)] bg-amber-200 relative z-10 overflow-hidden bg-cover bg-center text-center flex items-center justify-center font-bold text-xl text-amber-800">
          <img :src="top3[0].avatar" class="w-full h-full object-cover" alt="avatar" />
        </div>
        <div class="mt-4 flex flex-col items-center gap-1 z-10">
          <span class="text-xl font-bold text-sync-text drop-shadow-md truncate w-full text-center px-2">{{ top3[0].nickname }}</span>
          <span class="text-sm font-black text-[#FFD700] mt-1">{{ filterType === 'all-time' ? top3[0].points.toLocaleString() : top3[0].monthlyPoints.toLocaleString() }} PTS</span>
        </div>
        <div class="w-full h-[240px] bg-gradient-to-t from-transparent to-[#FFD700]/10 border-t-2 border-[#FFD700] mt-4 rounded-t-2xl flex items-start justify-center pt-4 backdrop-blur-sm group-hover:from-[#FFD700]/5 transition-colors">
          <span class="text-5xl font-outfit font-black text-[#FFD700]/50 drop-shadow-sm">1</span>
        </div>
      </div>

      <!-- 3rd Place -->
      <div v-if="top3[2]" @click="router.push(`/user/${top3[2].id}`)" class="cursor-pointer flex flex-col items-center justify-end h-full w-[120px] sm:w-[160px] relative group hover:-translate-y-2 transition-transform">
         <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/5 dark:bg-white/10 text-sync-text text-[10px] font-bold px-3 py-1.5 border border-sync-border rounded-full backdrop-blur-md z-20">{{ top3[2].role }}</div>
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#CD7F32] shadow-[0_0_20px_rgba(205,127,50,0.3)] bg-orange-200 relative z-10 overflow-hidden bg-cover bg-center text-center flex items-center justify-center font-bold text-xl text-orange-800">
          <img :src="top3[2].avatar" class="w-full h-full object-cover" alt="avatar" />
        </div>
        <div class="mt-4 flex flex-col items-center gap-1 z-10">
          <span class="text-sm sm:text-lg font-bold text-sync-text truncate w-full text-center px-2">{{ top3[2].nickname }}</span>
          <span class="text-xs font-bold text-[#CD7F32]">{{ filterType === 'all-time' ? top3[2].points.toLocaleString() : top3[2].monthlyPoints.toLocaleString() }} PTS</span>
        </div>
        <div class="w-full h-[140px] bg-gradient-to-t from-transparent to-[#CD7F32]/10 border-t-2 border-[#CD7F32] mt-4 rounded-t-2xl flex items-start justify-center pt-4 backdrop-blur-sm group-hover:from-[#CD7F32]/5 transition-colors">
          <span class="text-4xl font-outfit font-black text-[#CD7F32]/50">3</span>
        </div>
      </div>
    </section>

    <!-- Rankings Table List -->
    <section class="bg-sync-card border border-sync-border rounded-[2rem] p-4 sm:p-8 shadow-sm transition-colors duration-300">
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="border-b border-sync-border text-xs font-bold text-sync-muted uppercase tracking-widest transition-colors">
              <th class="py-4 px-4 sm:px-6 w-16 text-center">Rank</th>
              <th class="py-4 px-4 sm:px-6">Builder</th>
              <th class="py-4 px-4 sm:px-6">Badges</th>
              <th class="py-4 px-4 sm:px-6 text-right">Points</th>
              <th class="py-4 px-4 sm:px-6 w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="(user, index) in tableUsers" :key="user.id" 
                @click="router.push(`/user/${user.id}`)"
                class="border-b border-sync-border hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
              <td class="py-5 px-4 sm:px-6 text-center font-bold text-sync-muted">{{ index + 4 }}</td>
              <td class="py-5 px-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden text-center flex justify-center items-center relative bg-sync-card border border-sync-border">
                    <img :src="user.avatar" class="w-full h-full object-cover">
                  </div>
                  <span class="font-bold text-sync-text group-hover:text-sync-primary transition-colors">{{ user.nickname }}</span>
                </div>
              </td>
              <td class="py-5 px-4 sm:px-6 flex gap-2">
                <span v-for="(badge, bIdx) in user.badges" :key="bIdx" class="w-6 h-6 rounded bg-black/5 dark:bg-white/5 flex items-center justify-center text-xs border border-sync-border transition-colors">{{ badge }}</span>
              </td>
              <td class="py-5 px-4 sm:px-6 text-right font-outfit font-bold text-sync-text">
                {{ filterType === 'all-time' ? user.points.toLocaleString() : user.monthlyPoints.toLocaleString() }}
              </td>
              <td class="py-5 px-4 sm:px-6 text-center">
                 <svg v-if="user.status === 'up'" class="w-5 h-5 mx-auto text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                 <svg v-else-if="user.status === 'down'" class="w-5 h-5 mx-auto text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                 <svg v-else class="w-5 h-5 mx-auto text-sync-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6"></path></svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="visibleCount < mockUsers.length" class="w-full mt-6 flex justify-center">
        <button @click="loadMore" class="px-6 py-2.5 rounded-lg border border-sync-border text-sync-muted hover:text-sync-text hover:border-sync-muted text-sm font-bold transition-all bg-black/5 dark:bg-white/5 shadow-sm">
          Load More ({{ mockUsers.length - visibleCount }} Left)
        </button>
      </div>
    </section>

  </div>
</template>
