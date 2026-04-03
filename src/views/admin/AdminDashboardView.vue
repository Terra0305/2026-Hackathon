<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { mockHackathons, mockUsers, mockTeams } from '../../data/mockData'
import { useAuthStore } from '../../stores/auth'
import HackathonEditorModal from '../../components/admin/HackathonEditorModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// Protect the route client-side natively if not hit via router guard
if (!authStore.isAuthenticated || !authStore.user?.isAdmin) {
  router.push('/')
}

const isEditorOpen = ref(false)
const selectedHackathon = ref(null)

const openCreateModal = () => {
  selectedHackathon.value = null
  isEditorOpen.value = true
}

const openEditModal = (hackathon) => {
  selectedHackathon.value = hackathon
  isEditorOpen.value = true
}

const saveHackathon = (data) => {
  const existingIdx = mockHackathons.findIndex(h => h.id === data.id)
  if (existingIdx !== -1) {
    // Edit
    mockHackathons[existingIdx] = { ...data }
  } else {
    // Create new
    mockHackathons.unshift({ ...data })
  }
  isEditorOpen.value = false
}

const deleteHackathon = (id) => {
  if (confirm('정말로 이 해커톤을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
    const idx = mockHackathons.findIndex(h => h.id === id)
    if (idx !== -1) {
      mockHackathons.splice(idx, 1)
    }
  }
}
</script>

<template>
  <div class="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-outfit font-bold tracking-tight text-white flex items-center gap-3">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Admin Dashboard
        </h1>
        <p class="text-sync-muted text-sm font-medium">진행 중인 해커톤 및 설정들을 한곳에서 관리합니다.</p>
      </div>

      <button @click="openCreateModal" class="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2 select-none hover:-translate-y-0.5">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        새 해커톤 만들기
      </button>
    </div>

    <!-- Stats Overview Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-card p-6 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col gap-2 shadow-sm bg-black/5 dark:bg-white/5">
        <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Total Hackathons</span>
        <div class="flex items-center gap-3">
          <span class="text-3xl font-black text-sync-text">{{ mockHackathons.length }}</span>
          <span class="px-2 py-0.5 bg-teal-500/10 text-teal-500 rounded text-[10px] font-bold">+2 This Month</span>
        </div>
      </div>
      <div class="glass-card p-6 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col gap-2 shadow-sm bg-black/5 dark:bg-white/5">
        <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Registered Users</span>
        <div class="flex items-center gap-3">
          <span class="text-3xl font-black text-sync-text">{{ mockUsers.length }}</span>
          <span class="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[10px] font-bold">+15 This Week</span>
        </div>
      </div>
      <div class="glass-card p-6 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col gap-2 shadow-sm bg-black/5 dark:bg-white/5">
        <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Active Teams</span>
        <div class="flex items-center gap-3">
          <span class="text-3xl font-black text-sync-text">{{ mockTeams.length }}</span>
          <span class="px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded text-[10px] font-bold">Building 🚀</span>
        </div>
      </div>
    </div>

    <!-- Hackathons Management Grid -->
    <div class="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-sync-border bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-2xl">
       <div class="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-sync-border bg-black/5 dark:bg-white/5">
         <div class="col-span-5 text-[11px] font-bold text-sync-muted uppercase tracking-widest">Hackathon Title</div>
         <div class="col-span-2 text-[11px] font-bold text-sync-muted uppercase tracking-widest text-center">Status</div>
         <div class="col-span-3 text-[11px] font-bold text-sync-muted uppercase tracking-widest text-center">Date Range</div>
         <div class="col-span-2 text-[11px] font-bold text-sync-muted uppercase tracking-widest text-right">Actions</div>
       </div>

       <div v-for="hackathon in mockHackathons" :key="hackathon.id" class="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-6 border-b border-sync-border last:border-0 items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
         <div class="col-span-5 flex flex-col gap-1.5 min-w-0">
           <div class="flex items-center gap-2">
             <span class="text-[10px] font-bold text-sync-muted border border-sync-border rounded px-1.5 py-0.5 truncate max-w-[120px]">{{ hackathon.type }}</span>
           </div>
           <h3 class="text-base font-bold text-sync-text truncate">{{ hackathon.title }}</h3>
         </div>

         <div class="col-span-2 flex justify-center mt-2 md:mt-0">
           <span class="px-3 py-1 rounded w-max text-xs font-bold transition-colors"
                 :class="hackathon.status === '진행 중' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : hackathon.status === '종료' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'">
             {{ hackathon.status }}
           </span>
         </div>

         <div class="col-span-3 text-center text-sm font-medium text-sync-muted mt-2 md:mt-0 whitespace-nowrap">
           {{ hackathon.startDate }} ~ {{ hackathon.endDate }}
         </div>

         <div class="col-span-2 flex items-center justify-end gap-2 mt-4 md:mt-0">
           <RouterLink :to="`/admin/hackathons/${hackathon.id}/submissions`" class="p-2 border border-sync-border text-sync-muted hover:text-sync-primary hover:border-sync-primary rounded-lg transition-colors group" title="제출 자료 보기">
             <svg class="w-5 h-5 line-clamp-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           </RouterLink>
           <button @click="openEditModal(hackathon)" class="p-2 border border-sync-border text-sync-muted hover:text-white hover:border-white rounded-lg transition-colors group" title="수정하기">
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
           </button>
           <button @click="deleteHackathon(hackathon.id)" class="p-2 border border-sync-border text-sync-muted hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 rounded-lg transition-colors group" title="삭제하기">
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
         </div>
       </div>

       <div v-if="mockHackathons.length === 0" class="py-24 text-center flex flex-col gap-3">
         <span class="text-4xl">🏕️</span>
         <p class="text-sync-muted text-sm font-bold">생성된 해커톤이 없습니다.</p>
       </div>
    </div>

    <!-- Hackathon Editor Modal Component -->
    <HackathonEditorModal
      :isOpen="isEditorOpen"
      :hackathon="selectedHackathon"
      @close="isEditorOpen = false"
      @save="saveHackathon"
    />
  </div>
</template>
