<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { mockUsers } from '../../data/mockData'
import { useAuthStore } from '../../stores/auth'
import { getAvailablePoints } from '../../utils/userDecorations'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

if (!authStore.isAuthenticated || !authStore.user?.isAdmin) {
  router.push('/')
}

const userId = parseInt(route.params.id)
const targetUser = computed(() => mockUsers.find(u => u.id === userId))

if (!targetUser.value) {
  router.push('/admin/users')
}

// Points management
const pointAmount = ref(0)

const addPoints = () => {
  if (pointAmount.value > 0) {
    targetUser.value.walletPoints = getAvailablePoints(targetUser.value) + pointAmount.value
    targetUser.value.points += pointAmount.value
    alert(`${pointAmount.value} 포인트가 지급되었습니다.`)
    pointAmount.value = 0
  }
}

const subtractPoints = () => {
  if (pointAmount.value > 0) {
    if (targetUser.value.points >= pointAmount.value && getAvailablePoints(targetUser.value) >= pointAmount.value) {
      targetUser.value.walletPoints = getAvailablePoints(targetUser.value) - pointAmount.value
      targetUser.value.points -= pointAmount.value
      alert(`${pointAmount.value} 포인트가 차감되었습니다.`)
    } else {
      alert('보유 포인트보다 많은 포인트를 차감할 수 없습니다.')
    }
    pointAmount.value = 0
  }
}

// Status toggle
const toggleStatus = () => {
  if (targetUser.value.status === 'up') {
    targetUser.value.status = 'down' // 휴면
    alert('사용자 상태가 휴면(INACTIVE)으로 변경되었습니다.')
  } else {
    targetUser.value.status = 'up' // 비휴면
    alert('사용자 상태가 활성(ACTIVE)으로 변경되었습니다.')
  }
}
</script>

<template>
  <div class="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
    <div class="flex flex-col gap-4 border-b border-sync-border pb-8">
      <RouterLink to="/admin/users" class="text-sync-muted hover:text-white transition-colors text-sm font-bold flex items-center gap-1 w-max">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        사용자 목록으로 돌아가기
      </RouterLink>
      
      <div v-if="targetUser" class="flex flex-col gap-2">
        <span class="px-2.5 py-1 rounded w-max text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20">사용자 상세 관리</span>
        <div class="flex items-center gap-3 mt-2">
          <div class="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-sync-border">
             <img :src="targetUser.avatar" class="w-full h-full object-cover" />
          </div>
          <h1 class="text-3xl lg:text-4xl font-outfit font-black tracking-tight text-sync-text">{{ targetUser.nickname }}</h1>
          <div class="flex gap-1 ml-2">
            <span v-for="(badge, bIdx) in targetUser.badges" :key="bIdx" class="text-2xl">{{ badge }}</span>
          </div>
        </div>
        <p class="text-sync-muted text-sm font-medium mt-1">{{ targetUser.role }}</p>
      </div>
    </div>

    <div v-if="targetUser" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- Basic Details -->
      <div class="flex flex-col gap-6">
        <div class="bg-black/5 dark:bg-white/5 border border-sync-border rounded-[2rem] p-8 flex flex-col gap-6">
          <h3 class="text-lg font-bold text-sync-text border-b border-sync-border pb-3">개인 및 연락처 정보</h3>
          
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Real Name (본명)</span>
              <span class="text-sync-text font-black text-lg">{{ targetUser.realName || '미입력' }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Email</span>
              <span class="text-sync-text font-medium">{{ targetUser.email || '미입력' }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Contact (Phone)</span>
              <span class="text-sync-text font-medium">{{ targetUser.phone || '미입력' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-black/5 dark:bg-white/5 border border-sync-border rounded-[2rem] p-8 flex flex-col gap-6">
          <h3 class="text-lg font-bold text-sync-text border-b border-sync-border pb-3">기술 및 활동 정보</h3>
          
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Tech Stack</span>
              <div class="flex flex-wrap gap-2 mt-1">
                 <span v-for="(tech, i) in targetUser.techStack" :key="i" class="px-3 py-1 rounded text-xs bg-black/5 border border-sync-border text-sync-text">
                   {{ tech }}
                 </span>
                 <span v-if="!targetUser.techStack?.length" class="text-sm text-sync-muted">미입력</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Controls -->
      <div class="flex flex-col gap-6">
        
        <!-- Status Management -->
        <div class="bg-black/5 dark:bg-white/5 border border-sync-border rounded-[2rem] p-8 flex flex-col gap-6 relative shadow-lg overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-br from-sync-primary/5 to-transparent pointer-events-none"></div>
           <h3 class="text-lg font-bold text-sync-text border-b border-sync-border pb-3 flex items-center justify-between z-10">
             계정 상태 관리
             <span class="px-3 py-1 rounded w-max text-[10px] font-bold tracking-widest transition-colors shadow-sm"
                   :class="targetUser.status === 'up' ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'">
               {{ targetUser.status === 'up' ? '현재 비휴면 (ACTIVE)' : '현재 휴면 (INACTIVE)' }}
             </span>
           </h3>
           
           <div class="z-10 flex flex-col gap-2">
             <p class="text-[13px] text-sync-muted mb-4">계정을 휴면 처리하면 사용자가 플랫폼 내 주요 서비스(해커톤 지원, 팀 생성 등)를 이용할 수 없습니다.</p>
             <button @click="toggleStatus" class="px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                     :class="targetUser.status === 'down' ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_14px_rgba(20,184,166,0.3)]' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]'">
               {{ targetUser.status === 'down' ? '계정 활성화 (비휴면 해제)' : '계정 휴면 (비활성화)' }} 
             </button>
           </div>
        </div>

        <!-- Points Management -->
        <div class="bg-black/5 dark:bg-white/5 border border-sync-border rounded-[2rem] p-8 flex flex-col gap-6 relative shadow-lg overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none"></div>
           <h3 class="text-lg font-bold text-sync-text border-b border-sync-border pb-3 flex items-center justify-between z-10">
             액티비티 포인트 관리
             <span class="text-xl font-black text-sync-primary">🎯 {{ targetUser.points.toLocaleString() }} XP</span>
           </h3>

           <div class="z-10 flex flex-col gap-4">
             <p class="text-[13px] text-sync-muted">특정 이벤트 진행, 어뷰징, 또는 특별 보상 시 수동으로 포인트를 지급하거나 차감할 수 있습니다.</p>
             
             <div class="flex flex-col gap-2">
               <label class="text-[11px] font-bold text-sync-text uppercase tracking-widest">금액 (Amount)</label>
               <input v-model.number="pointAmount" type="number" placeholder="예: 500" class="w-full bg-white/50 dark:bg-black/40 border border-sync-border rounded-xl p-3 text-lg font-mono text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
             </div>

             <div class="grid grid-cols-2 gap-3 mt-2">
               <button @click="addPoints" class="px-4 py-3 rounded-xl bg-sync-primary/10 text-sync-primary hover:bg-sync-primary hover:text-white border border-sync-primary/20 text-sm font-bold transition-colors">
                 + 포인트 지급
               </button>
               <button @click="subtractPoints" class="px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 text-sm font-bold transition-colors">
                 - 포인트 차감
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  </div>
</template>
