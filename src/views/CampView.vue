<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { mockTeams, mockHackathons, mockJoinRequests } from '../data/mockData'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import GlowCard from '../components/GlowCard.vue'
import GlowCardContainer from '../components/GlowCardContainer.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import EmptyState from '../components/EmptyState.vue'

const route = useRoute()
const authStore = useAuthStore()
const currentRole = ref('all')
const searchQuery = ref('')
const joinedTeams = ref(new Set()) // Local mockup tracking
const isLoading = ref(true)
const selectedTeam = ref(null)

const showApplicationForm = ref(false)
const joinForm = ref({ role: '', message: '' })

const openTeamModal = (team) => {
  selectedTeam.value = team
  showApplicationForm.value = false
}

const closeTeamModal = () => {
  selectedTeam.value = null
  showApplicationForm.value = false
}

const handleJoinInit = () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    return
  }
  showApplicationForm.value = true
  joinForm.value = { role: selectedTeam.value.roles?.[0]?.name || '', message: '' }
}

const handleJoinSubmit = () => {
  mockJoinRequests.push({
    id: Date.now(),
    teamId: selectedTeam.value.id,
    userId: authStore.user.id,
    nickname: authStore.user.nickname,
    role: joinForm.value.role,
    message: joinForm.value.message,
    status: 'pending',
    createdAt: new Date().toLocaleDateString()
  })
  joinedTeams.value.add(selectedTeam.value.id)
  showApplicationForm.value = false
  closeTeamModal()
  alert('합류 요청이 성공적으로 전송되었습니다!')
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1200)
})

const queryHackathonTitle = computed(() => {
  const qId = route.query.hackathonId ? parseInt(route.query.hackathonId) : null
  if (!qId) return null
  const hack = mockHackathons.find(h => h.id === qId)
  return hack ? hack.title : null
})

const handleCardJoinClick = (team) => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    return
  }
  selectedTeam.value = team
  showApplicationForm.value = true
  joinForm.value = { role: selectedTeam.value.roles?.[0]?.name || '', message: '' }
}

const filteredTeams = computed(() => {
  const queryHackId = route.query.hackathonId ? parseInt(route.query.hackathonId) : null
  
  return mockTeams.filter(team => {
    const matchRole = currentRole.value === 'all' || team.roles.some(r => r.name.includes(currentRole.value) || currentRole.value.includes(r.name))
    const matchQuery = !searchQuery.value || team.teamName.toLowerCase().includes(searchQuery.value.toLowerCase()) || team.hackathonTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchHackathon = queryHackId ? team.hackathonId === queryHackId : true
    
    return matchRole && matchQuery && matchHackathon
  })
})
</script>

<template>
  <div class="max-w-[1240px] w-full mx-auto px-4 sm:px-6 flex flex-col gap-8 pb-32 transition-colors duration-[400ms] ease-out relative pt-4">
    <!-- Ambient Background Effects for this page -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-sync-primary/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>
    <div class="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-400/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>

    <div class="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-sync-border pb-6 transition-colors duration-300">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-outfit font-bold text-sync-text tracking-tight transition-colors flex items-center flex-wrap gap-2">
           Project Camp
           <span v-if="queryHackathonTitle" class="text-xl md:text-2xl text-sync-primary">/ {{ queryHackathonTitle }}</span>
        </h1>
        <p class="text-sync-muted transition-colors">최고의 팀원들을 만나 새로운 프로젝트를 시작하세요.</p>
        
        <div v-if="queryHackathonTitle" class="mt-2 md:hidden">
           <RouterLink to="/camp" class="text-xs font-bold bg-sync-primary/10 text-sync-primary border border-sync-primary/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 group hover:bg-sync-primary hover:text-white transition-colors">
             필터 초기화
             <svg class="w-3 h-3 pt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
           </RouterLink>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <RouterLink v-if="queryHackathonTitle" to="/camp" class="hidden md:flex px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border text-sync-muted hover:text-sync-text text-sm font-bold transition-all items-center justify-center gap-2 hover:bg-black/10 dark:hover:bg-white/10">
          필터 해제
        </RouterLink>
        <RouterLink :to="`/camp/create${route.query.hackathonId ? '?hackathonId=' + route.query.hackathonId : ''}`" class="px-6 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          새로운 팀 포스팅
        </RouterLink>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
      <div class="relative w-full md:w-96">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sync-muted">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="팀명, 해커톤 이름 검색" class="w-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-sync-text placeholder-sync-muted focus:outline-none focus:border-sync-primary transition-colors shadow-sm">
      </div>
      
      <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
        <button @click="currentRole = 'all'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm transition-colors border" :class="currentRole === 'all' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">전체 역할</button>
        <button @click="currentRole = '기획자'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '기획자' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">기획자</button>
        <button @click="currentRole = '디자이너'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '디자이너' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">디자이너</button>
        <button @click="currentRole = '프론트엔드'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '프론트엔드' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">프론트엔드</button>
        <button @click="currentRole = '백엔드'" class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border" :class="currentRole === '백엔드' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-sync-border text-sync-muted hover:text-sync-text'">백엔드</button>
      </div>
    </div>

    <!-- Recruitment Grid -->
    <GlowCardContainer class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <template v-if="isLoading">
         <SkeletonLoader type="glow-card" :count="6" class="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
      </template>

      <div v-else-if="filteredTeams.length === 0" class="col-span-full py-16 flex justify-center w-full">
         <EmptyState size="lg" message="검색된 팀 모집 공고가 없습니다." icon="🏕️" class="w-full">
            <template #action>
               <RouterLink to="/camp/create" class="mt-4 px-8 py-3 bg-sync-primary hover:bg-sync-primaryHover text-white font-bold rounded-xl transition-all shadow-sm">직접 팀 모집하기</RouterLink>
            </template>
         </EmptyState>
      </div>

      <template v-else>
        <GlowCard 
          v-for="team in filteredTeams" 
          :key="team.id"
          class="flex flex-col gap-6 group cursor-pointer"
          contentClass="p-8 pb-6 h-full flex flex-col"
          @click="openTeamModal(team)"
        >
        <div class="flex items-start justify-between z-10 w-full">
          <div class="flex items-center gap-4">
             <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr shadow-inner flex items-center justify-center text-xl" :class="team.theme">{{ team.icon }}</div>
             <div class="flex flex-col gap-1.5">
               <span class="px-2 py-0.5 bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 text-[10px] font-bold uppercase tracking-widest rounded w-max border border-teal-200 dark:border-teal-500/20 transition-colors">{{ team.status }}</span>
               <h3 class="text-lg font-bold text-sync-text group-hover:text-sync-primary transition-colors">{{ team.teamName }}</h3>
             </div>
          </div>
        </div>
        
        <div class="flex flex-col gap-1.5 z-10 mt-2">
           <p class="text-[10px] font-bold text-sync-primary uppercase tracking-widest">목표 해커톤</p>
           <h4 class="text-[13px] font-bold text-sync-text underline decoration-sync-border underline-offset-4">{{ team.hackathonTitle }}</h4>
        </div>

        <p class="text-[13px] text-sync-muted leading-[1.7] line-clamp-3 transition-colors mt-3 z-10">
          {{ team.description }}
        </p>

        <div class="flex flex-col gap-3 z-10 mt-4">
          <p class="text-[10px] font-bold text-sync-muted uppercase tracking-widest transition-colors">REQUIRED ROLES</p>
          <div class="flex flex-wrap gap-2.5">
            <span v-for="(role, idx) in team.roles" :key="idx" class="px-3.5 py-2 bg-black/5 dark:bg-white/5 border border-sync-border rounded-lg text-xs font-bold text-sync-text transition-colors">
               {{ role.name }} <span class="text-sync-muted ml-1 text-[10px]">{{ role.current }}/{{ role.total }}</span>
            </span>
          </div>
        </div>

        <div class="mt-auto pt-8 flex items-center justify-between border-t border-sync-border transition-colors z-10 w-full">
          <div class="flex -space-x-3">
            <div v-for="(member, mIdx) in team.members" :key="mIdx" class="w-8 h-8 rounded-full border-2 border-white dark:border-[#181A20] overflow-hidden bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-800" :style="{ zIndex: 10 - mIdx }">{{ member }}</div>
          </div>
          <div class="flex gap-2">
             <button
               v-if="team.status === '마감'"
               disabled
               class="px-5 py-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-sync-border text-sync-muted text-xs font-bold cursor-not-allowed opacity-60"
             >
               마감되었습니다
             </button>
             <button 
               v-else-if="!joinedTeams.has(team.id)"
               @click.stop="handleCardJoinClick(team)"
               class="px-5 py-2.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-xs font-bold transition-all shadow-[0_4px_10px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">
               팀 합류하기
             </button>
             <button
               v-else
               @click.stop="joinedTeams.delete(team.id)"
               class="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
             >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                합류 요청 취소
             </button>
          </div>
        </div>
        </GlowCard>
      </template>
    </GlowCardContainer>

    <!-- Team Detail Modal -->
    <div v-if="selectedTeam" class="fixed inset-0 z-[100] flex items-center justify-center p-6 py-16">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" @click="closeTeamModal"></div>
      
      <div class="relative w-full max-w-2xl bg-white dark:bg-[#0f1115] border border-black/10 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[80vh] animate-fade-in z-10 overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-30 -z-10" :class="selectedTeam.theme"></div>
        
        <div class="p-8 md:p-10 overflow-y-auto custom-scrollbar flex flex-col gap-6 w-full h-full">
          <div class="flex justify-between items-start w-full shrink-0">
            <div class="flex items-center gap-4">
               <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr shadow-inner flex items-center justify-center text-3xl" :class="selectedTeam.theme">{{ selectedTeam.icon }}</div>
               <div class="flex flex-col gap-1.5">
                 <span class="px-2 py-0.5 bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 text-[10px] font-bold uppercase tracking-widest rounded w-max border border-teal-200 dark:border-teal-500/20">{{ selectedTeam.status }}</span>
                 <h3 class="text-2xl font-bold text-sync-text">{{ selectedTeam.teamName }}</h3>
               </div>
            </div>
          <button @click="closeTeamModal" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-sync-muted transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-sync-border">
           <p class="text-[11px] font-bold text-sync-primary uppercase tracking-widest">목표 해커톤</p>
           <h4 class="text-base font-bold text-sync-text">{{ selectedTeam.hackathonTitle }}</h4>
        </div>
        
        <div class="flex flex-col gap-3">
          <p class="text-[12px] font-bold text-sync-muted uppercase tracking-widest">팀 및 프로젝트 소개</p>
          <p class="text-[14px] text-sync-text leading-relaxed font-medium whitespace-pre-line bg-black/5 dark:bg-black/20 p-4 md:p-5 rounded-2xl border border-sync-border">{{ selectedTeam.description }}</p>
        </div>

        <div class="flex flex-col gap-3 mt-2">
          <p class="text-[12px] font-bold text-sync-muted uppercase tracking-widest">모집 중인 역할</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="(role, idx) in selectedTeam.roles" :key="idx" class="px-4 py-2.5 bg-black/5 dark:bg-black/40 border border-sync-border rounded-xl text-sm font-bold text-sync-text flex items-center gap-2">
               {{ role.name }} <span class="bg-black/10 dark:bg-white/10 px-2.5 py-0.5 rounded text-[11px] text-sync-text">{{ role.current }}/{{ role.total }}</span>
            </span>
          </div>
        </div>

        <div v-if="!showApplicationForm" class="mt-4 pt-6 border-t border-sync-border flex justify-end w-full">
           <button
             v-if="selectedTeam.status === '마감'"
             disabled
             class="w-full md:w-auto px-10 py-4 rounded-xl bg-black/10 dark:bg-white/5 border border-sync-border text-sync-muted text-[15px] font-bold cursor-not-allowed opacity-60"
           >
             모집이 마감되었습니다
           </button>
           <button 
             v-else-if="!joinedTeams.has(selectedTeam.id)"
             @click.stop="handleJoinInit()"
             class="w-full md:w-auto px-10 py-4 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-[15px] font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5 flex justify-center">
             이 팀에 합류하기
           </button>
           <button
             v-else
             @click.stop="joinedTeams.delete(selectedTeam.id); closeTeamModal()"
             class="w-full md:w-auto px-10 py-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[15px] font-bold transition-all flex items-center justify-center gap-2"
           >
              합류 요청 취소
           </button>
        </div>

        <div v-else class="mt-2 pt-6 border-t border-sync-border flex flex-col gap-4 w-full animate-fade-in">
           <div class="flex flex-col gap-1.5">
             <label class="text-xs font-bold text-sync-muted uppercase tracking-widest">지원 포지션</label>
             <select v-model="joinForm.role" class="w-full bg-black/5 dark:bg-black/40 border border-sync-border rounded-xl p-3 text-sm text-sync-text outline-none focus:border-sync-primary">
               <option v-for="(role, idx) in selectedTeam.roles" :key="'role-'+idx" :value="role.name">{{ role.name }} ({{role.current}}/{{role.total}})</option>
             </select>
           </div>
           <div class="flex flex-col gap-1.5">
             <label class="text-xs font-bold text-sync-muted uppercase tracking-widest">지원 동기 및 코멘트</label>
             <textarea v-model="joinForm.message" rows="3" placeholder="본인의 역량이나 프로젝트 합류 동기를 작성해주세요." class="w-full bg-black/5 dark:bg-black/40 border border-sync-border rounded-xl p-3 text-sm text-sync-text outline-none focus:border-sync-primary custom-scrollbar"></textarea>
           </div>
           
           <div class="flex justify-end gap-3 mt-2">
             <button @click="showApplicationForm = false" class="px-6 py-3 rounded-xl border border-sync-border text-sync-text text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">취소</button>
             <button @click="handleJoinSubmit" class="px-8 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-md transition-all">신청하기</button>
           </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.3);
  border-radius: 4px;
}
</style>
