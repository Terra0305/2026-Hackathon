<script setup>
import { ref, computed } from 'vue'
import { useDbStore } from '../stores/db'

const db = useDbStore()
const timeFilter = ref('전체') // '7일', '30일', '전체'

const sortedLeaderboards = computed(() => {
  // Mock filter logic based on time filter
  return [...db.leaderboards].sort((a,b) => b.score - a.score)
})

const top3 = computed(() => sortedLeaderboards.value.slice(0, 3))
const others = computed(() => sortedLeaderboards.value.slice(3))

const rank1 = computed(() => top3.value[0])
const rank2 = computed(() => top3.value[1])
const rank3 = computed(() => top3.value[2])
</script>

<template>
  <div class="flex flex-col gap-16 pb-24 max-w-[1200px] mx-auto w-full">
    
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 px-4">
      <div class="flex flex-col gap-4">
        <h1 class="text-5xl md:text-6xl font-outfit font-bold tracking-tight text-white leading-none">
          TOP <span class="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">BUILDERS</span>
        </h1>
        <p class="text-sm text-sync-muted leading-relaxed max-w-md mt-2">
          Sync 생태계에서 혁신적인 가치를 창출하고 있는 최고의 빌더들을 확인하세요.
        </p>
      </div>

      <div class="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 w-fit overflow-hidden">
        <button @click="timeFilter = '7일'" :class="[timeFilter === '7일' ? 'bg-sync-primary text-white shadow-sm' : 'text-sync-muted hover:text-white', 'px-5 py-2 rounded-lg text-sm font-medium transition-colors']">7일</button>
        <button @click="timeFilter = '30일'" :class="[timeFilter === '30일' ? 'bg-sync-primary text-white shadow-sm' : 'text-sync-muted hover:text-white', 'px-5 py-2 rounded-lg text-sm font-medium transition-colors']">30일</button>
        <button @click="timeFilter = '전체'" :class="[timeFilter === '전체' ? 'bg-sync-primary text-white shadow-sm' : 'text-sync-muted hover:text-white', 'px-5 py-2 rounded-lg text-sm font-medium transition-colors']">전체</button>
      </div>
    </section>

    <!-- Podium Section -->
    <section class="flex flex-col lg:flex-row items-center justify-center gap-6 w-full lg:px-12 mt-8">
      
      <!-- Rank 2 -->
      <div v-if="rank2" class="w-full lg:w-1/3 max-w-sm mt-0 lg:mt-16 relative">
        <div class="absolute -top-4 w-full flex justify-center z-20">
          <div class="w-8 h-8 rounded-full bg-[#181A20] border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 shadow-xl">2</div>
        </div>
        <div class="bg-[#181A20] rounded-[2rem] border border-white/5 p-8 flex flex-col items-center gap-6 relative z-10 hover:-translate-y-2 transition-transform shadow-lg">
          <div class="w-24 h-24 rounded-full border-4 border-[#22252D] bg-[#FFE0B2] flex items-center justify-center text-3xl font-bold flex-shrink-0 mt-4 overflow-hidden relative">
            {{ rank2.avatarSeed.charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col items-center gap-1">
            <h3 class="text-xl font-bold text-white">{{ rank2.nickname }}</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">RANK 2</p>
          </div>
          <div class="flex items-baseline gap-1 mt-2">
            <span class="text-2xl font-outfit font-bold text-white">{{ rank2.score.toLocaleString() }}</span>
            <span class="text-[10px] text-sync-muted font-bold tracking-wider">PTS</span>
          </div>
        </div>
      </div>

      <!-- Rank 1 (Center) -->
      <div v-if="rank1" class="w-full lg:w-1/3 max-w-sm relative z-30">
        <div class="absolute -top-5 w-full flex justify-center z-20">
          <div class="w-10 h-10 rounded-full bg-amber-500 border-[3px] border-[#0D0E12] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 9a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM10 12.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"></path></svg>
          </div>
        </div>
        
        <div class="bg-[#181A20] rounded-[2rem] border border-amber-500/20 p-8 flex flex-col items-center gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] shadow-amber-500/10 hover:-translate-y-2 transition-transform pb-12">
          <div class="relative mt-4">
            <div class="w-28 h-28 rounded-full border-[5px] border-amber-500/20 p-1 flex flex-shrink-0 relative overflow-hidden">
               <div class="w-full h-full rounded-full bg-[#FFD180] flex items-center justify-center text-4xl font-bold overflow-hidden text-[#181A20]">
                  {{ rank1.avatarSeed.charAt(0).toUpperCase() }}
               </div>
            </div>
            <div class="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-amber-400 text-[#0D0E12] text-[9px] font-black tracking-widest uppercase rounded-full border-2 border-[#181A20] shadow-sm">
              CHAMP
            </div>
          </div>
          
          <div class="flex flex-col items-center gap-1">
            <h3 class="text-2xl font-bold text-white">{{ rank1.nickname }}</h3>
            <p class="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mt-1">RANK 1</p>
          </div>
          
          <div class="flex items-baseline gap-1 mt-4">
            <span class="text-4xl font-outfit font-bold text-amber-400 text-shadow-glow">{{ rank1.score.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Rank 3 -->
      <div v-if="rank3" class="w-full lg:w-1/3 max-w-sm mt-0 lg:mt-16 relative">
        <div class="absolute -top-4 w-full flex justify-center z-20">
          <div class="w-8 h-8 rounded-full bg-[#181A20] border border-white/10 flex items-center justify-center text-xs font-bold text-amber-700 shadow-xl">3</div>
        </div>
        <div class="bg-[#181A20] rounded-[2rem] border border-white/5 p-8 flex flex-col items-center gap-6 relative z-10 hover:-translate-y-2 transition-transform shadow-lg">
          <div class="w-24 h-24 rounded-full border-4 border-[#22252D] bg-[#FFE0B2] flex items-center justify-center text-3xl font-bold flex-shrink-0 mt-4 overflow-hidden relative">
            {{ rank3.avatarSeed.charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col items-center gap-1">
            <h3 class="text-xl font-bold text-white">{{ rank3.nickname }}</h3>
            <p class="text-[10px] font-bold text-amber-700/80 uppercase tracking-widest">RANK 3</p>
          </div>
          <div class="flex items-baseline gap-1 mt-2">
            <span class="text-2xl font-outfit font-bold text-white">{{ rank3.score.toLocaleString() }}</span>
            <span class="text-[10px] text-sync-muted font-bold tracking-wider">PTS</span>
          </div>
        </div>
      </div>

    </section>

    <!-- Rankings Data Table -->
    <section class="w-full bg-[#13151A] rounded-3xl border border-white/5 overflow-hidden mt-8 px-4 lg:px-0">
      
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 border-b border-white/5 p-6 text-[11px] font-bold text-sync-muted tracking-widest uppercase">
        <div class="col-span-2 md:col-span-2 pl-4">순위</div>
        <div class="col-span-5 md:col-span-5">닉네임</div>
        <div class="col-span-3">포인트</div>
        <div class="col-span-2 text-right pr-6">상태</div>
      </div>

      <!-- Table Body -->
      <div class="flex flex-col">
        <div v-for="(user, i) in others" :key="user.id" class="grid grid-cols-12 gap-4 items-center p-6 border-b border-white/[0.02] hover:bg-white/[0.04] transition-colors group">
          <div class="col-span-2 md:col-span-2 pl-4 text-sm font-outfit text-sync-muted font-medium">{{ String(i + 4).padStart(2, '0') }}</div>
          <div class="col-span-5 md:col-span-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-200 text-[#181A20] flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0">
               {{ user.avatarSeed.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm font-bold text-white group-hover:text-sync-primary transition-colors">{{ user.nickname }}</span>
          </div>
          <div class="col-span-3 text-sm font-outfit font-bold text-white">{{ user.score.toLocaleString() }}</div>
          <div class="col-span-2 text-right pr-4">
            <span v-if="user.status === 'STABLE'" class="inline-flex px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest rounded-full w-[70px] justify-center">STABLE</span>
            <span v-else-if="user.status === 'RISING'" class="inline-flex items-center justify-center gap-1 px-3 py-1 bg-[#22252D] border border-white/5 text-blue-400 text-[9px] font-bold uppercase tracking-widest rounded-full w-[70px]">RISING</span>
            <span v-else-if="user.status === 'LIVE'" class="inline-flex px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[9px] font-bold uppercase tracking-widest rounded-full w-[70px] justify-center">LIVE</span>
            <span v-else class="inline-flex px-3 py-1 bg-[#181A20] border border-white/5 text-sync-muted text-[9px] font-bold uppercase tracking-widest rounded-full w-[70px] justify-center">IDLE</span>
          </div>
        </div>
      </div>

      <div class="w-full p-6 flex justify-center border-t border-white/5">
        <button class="px-6 py-2.5 rounded-full bg-[#181A20] hover:bg-[#22252D] border border-white/5 text-[11px] font-bold text-white tracking-widest transition-colors flex items-center gap-2">
          더 보기 
          <svg class="w-3 h-3 text-sync-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-shadow-glow {
  text-shadow: 0 0 40px rgba(245, 158, 11, 0.4);
}
</style>
