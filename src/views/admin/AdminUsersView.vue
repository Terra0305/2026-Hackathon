<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '../../data/mockData'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Native client-side check
if (!authStore.isAuthenticated || !authStore.user?.isAdmin) {
  router.push('/')
}

const searchQuery = ref('')

const filteredUsers = computed(() => {
  return mockUsers.filter(u => 
    u.nickname.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    (u.realName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getStatusClass = (status) => {
  if (status === 'up') return 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
  return 'bg-red-500/10 text-red-500 border border-red-500/20'
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-sync-border pb-8">
      <div class="flex flex-col gap-2">
         <span class="px-3 py-1 rounded-full w-max text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 uppercase tracking-widest">Backoffice / Management</span>
         <h1 class="text-4xl font-outfit font-black tracking-tight text-sync-text">사용자 관리</h1>
         <p class="text-sync-muted text-sm font-medium">서비스에 가입된 모든 빌더 정보를 조회하고 관리합니다.</p>
      </div>

      <div class="relative w-full md:w-96 group">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted z-10 pointer-events-none group-focus-within:text-sync-primary transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="닉네임, 본명, 역할로 검색..." 
               class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-[1.25rem] py-4 pl-12 pr-6 text-[15px] text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-4 focus:ring-sync-primary/10 transition-all shadow-sm">
      </div>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
       <div class="glass-card p-6 rounded-3xl border border-sync-border flex flex-col gap-1 bg-black/5 dark:bg-white/5">
          <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">전체 사용자</span>
          <span class="text-3xl font-black text-sync-text">{{ mockUsers.length }}</span>
       </div>
       <div class="glass-card p-6 rounded-3xl border border-teal-500/10 flex flex-col gap-1 bg-teal-500/5">
          <span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest">활성 사용자</span>
          <span class="text-3xl font-black text-teal-500">{{ mockUsers.filter(u=>u.status==='up').length }}</span>
       </div>
    </div>

    <!-- Users Table/List -->
    <div class="flex flex-col overflow-hidden rounded-[2.5rem] border border-sync-border bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-2xl">
       <!-- Table Header -->
       <div class="hidden md:grid grid-cols-12 gap-4 px-10 py-6 border-b border-sync-border bg-black/10 dark:bg-white/5">
         <div class="col-span-4 text-[11px] font-black text-sync-muted uppercase tracking-widest">빌더 (닉네임 / 본명)</div>
         <div class="col-span-3 text-[11px] font-black text-sync-muted uppercase tracking-widest">이메일 연락처</div>
         <div class="col-span-3 text-[11px] font-black text-sync-muted uppercase tracking-widest text-center">진행 상태</div>
         <div class="col-span-2 text-[11px] font-black text-sync-muted uppercase tracking-widest text-right">관리</div>
       </div>

       <!-- Table Body -->
       <div v-for="user in filteredUsers" :key="user.id" 
            class="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 md:px-10 py-7 border-b border-sync-border last:border-0 items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
         
         <!-- Builder Info -->
         <div class="col-span-4 flex items-center gap-5 min-w-0">
           <div class="w-14 h-14 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white dark:border-[#22252D] group-hover:scale-105 transition-transform shadow-sm">
             <img :src="user.avatar" class="w-full h-full object-cover" />
           </div>
           <div class="flex flex-col gap-1 w-full min-w-0">
             <div class="flex items-center gap-2">
               <h3 class="text-base font-black text-sync-text truncate group-hover:text-sync-primary transition-colors">{{ user.nickname }}</h3>
               <span v-if="user.realName" class="text-[11px] font-bold text-sync-muted opacity-60">({{ user.realName }})</span>
             </div>
             <span class="text-xs text-sync-muted font-bold truncate">{{ user.role }}</span>
           </div>
         </div>

         <!-- Contact -->
         <div class="col-span-3 flex flex-col justify-center text-xs font-semibold text-sync-muted gap-1">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span class="text-sync-text">{{ user.email || 'not_set@sync.com' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>{{ user.phone || '010-0000-0000' }}</span>
            </div>
         </div>

         <!-- Status -->
         <div class="col-span-3 flex justify-center mt-4 md:mt-0">
            <span class="px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase transition-all shadow-sm"
                  :class="getStatusClass(user.status)">
              {{ user.status === 'up' ? 'Active' : 'Inactive' }}
            </span>
         </div>

         <!-- Actions -->
         <div class="col-span-2 flex items-center justify-end gap-3 mt-4 md:mt-0">
            <RouterLink :to="`/admin/users/${user.id}`" 
                        class="px-6 py-2.5 rounded-xl text-[11px] font-bold border border-sync-border text-sync-text hover:bg-sync-primary hover:text-white hover:border-sync-primary hover:shadow-lg transition-all active:scale-95 shadow-sm">
              관리하기
            </RouterLink>
         </div>
       </div>

       <!-- Empty State -->
       <div v-if="filteredUsers.length === 0" class="py-32 text-center flex flex-col items-center justify-center gap-6">
         <span class="text-6xl grayscale opacity-30">👤</span>
         <div class="flex flex-col gap-1">
           <p class="text-sync-text text-lg font-black tracking-tight">검색 결과가 없습니다.</p>
           <p class="text-sync-muted text-sm font-medium">검색어를 확인하거나 필터를 초기화해 보세요.</p>
         </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
</style>
