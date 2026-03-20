<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDbStore } from '../stores/db'

const route = useRoute()
const db = useDbStore()

const searchQuery = ref('')
const roleFilter = ref('all') // 'all', '프론트엔드', '백엔드', '디자이너', '기획자'

// ?hackathon=slug
const hackathonFilter = computed(() => route.query.hackathon || null)

const filteredTeams = computed(() => {
  return db.teams.filter(t => {
    // 1. Hackathon match
    if (hackathonFilter.value && t.hackathonSlug !== hackathonFilter.value) return false
    
    // 2. Search match
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchName = t.name.toLowerCase().includes(q)
      const matchIntro = t.intro.toLowerCase().includes(q)
      if (!matchName && !matchIntro) return false
    }

    // 3. Role match
    if (roleFilter.value !== 'all') {
      if (!t.lookingFor || !t.lookingFor.includes(roleFilter.value)) return false
    }

    return true
  })
})

// Modal states
const showModal = ref(false)
const newTeam = ref({
  name: '',
  intro: '',
  isOpen: true,
  lookingFor: [],
  contactUrl: '',
  hackathonSlug: hackathonFilter.value || ''
})

const availableRoles = ['프론트엔드', '백엔드', '디자이너', '기획자', '데이터 분석']

const toggleNewTeamRole = (role) => {
  const i = newTeam.value.lookingFor.indexOf(role)
  if (i > -1) newTeam.value.lookingFor.splice(i, 1)
  else newTeam.value.lookingFor.push(role)
}

const submitTeam = () => {
  if (!newTeam.value.name || !newTeam.value.intro) return alert('팀 이름과 한 줄 소개는 필수입니다.')
  
  db.addTeam({
    ...newTeam.value,
    memberCount: 1,
    maxMembers: 4
  })
  showModal.value = false
  newTeam.value = { name: '', intro: '', isOpen: true, lookingFor: [], contactUrl: '', hackathonSlug: hackathonFilter.value || '' }
  alert('팀이 성공적으로 생성되었습니다!')
}
</script>

<template>
  <div class="flex flex-col gap-10 pb-24 relative">
    
    <!-- Hero Section -->
    <section class="flex flex-col items-start gap-4">
      <div v-if="hackathonFilter" class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm font-bold flex items-center gap-2 mb-2">
        <span>해커톤 필터 활성화됨:</span>
        <span class="text-white">{{ hackathonFilter }}</span>
        <router-link to="/camp" class="ml-2 hover:text-white transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></router-link>
      </div>

      <div class="flex items-center gap-2 px-3 py-1 bg-teal-500/10 rounded-full border border-teal-500/20 text-[10px] font-bold tracking-widest uppercase text-teal-400">
        LIVE RECRUITMENT <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
      </div>
      
      <h1 class="text-5xl md:text-6xl font-outfit font-bold tracking-tight leading-[1.1] mt-2">
        <span class="text-white">Build the Next.</span><br/>
        <span class="text-sync-primary">Join the Camp.</span>
      </h1>
      
      <p class="text-sync-muted leading-relaxed mt-2 max-w-xl">
        혁신적인 아이디어를 현실로 구현할 동료를 찾으세요.<br/>
        Sync Camp에서 최고의 팀원들과 함께 성장을 시작하세요.
      </p>
    </section>

    <!-- Search & Filters -->
    <section class="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
      <div class="relative w-full md:w-[400px]">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-sync-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input v-model="searchQuery" type="text" class="w-full bg-[#181A20] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-sync-muted focus:outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all shadow-sm" placeholder="관심 분야나 팀명을 검색하세요" />
      </div>
      
      <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
        <button @click="roleFilter = 'all'" :class="[roleFilter === 'all' ? 'bg-sync-primary border-sync-primary text-white' : 'bg-[#181A20] border-white/5 text-sync-muted hover:text-white', 'px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap']">전체보기</button>
        <button v-for="r in availableRoles" :key="r" @click="roleFilter = r" :class="[roleFilter === r ? 'bg-sync-primary border-sync-primary text-white' : 'bg-[#181A20] border-white/5 text-sync-muted hover:text-white', 'px-5 py-2.5 rounded-xl text-sm font-medium border hover:border-white/10 transition-colors whitespace-nowrap']">{{r}}</button>
      </div>
    </section>

    <!-- Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Dynamic Flow -->
      <div v-for="team in filteredTeams" :key="team.id" class="bg-[#181A20] rounded-2xl border border-white/5 p-6 flex flex-col hover:-translate-y-1 hover:border-white/10 transition-all group shadow-sm">
        <div class="flex items-start justify-between mb-4">
           <!-- Dynamic bg just based on letters length -->
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">{{ team.name.charAt(0) }}</div>
          <span v-if="team.isOpen" class="px-2.5 py-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-md">모집 중</span>
          <span v-else class="px-2.5 py-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">마감됨</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">{{ team.name }}</h3>
        
        <p class="text-sm text-sync-muted leading-relaxed line-clamp-3 mb-6 min-h-[60px]">
          {{ team.intro }}
        </p>
        
        <div class="flex items-center gap-2 mt-auto mb-4 flex-wrap">
           <!-- Roles mapping -->
           <span v-for="r in team.lookingFor" :key="r" class="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] font-medium text-white/80">{{ r }}</span>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <a :href="team.contactUrl" target="_blank" rel="noopener noreferrer" class="flex-1 py-3 text-center bg-sync-primary/10 text-sync-primary hover:bg-sync-primary hover:text-white text-sm font-bold rounded-xl transition-all shadow-sm border border-sync-primary/20 hover:border-sync-primary">
              연락하기
            </a>
          </div>
        </div>
      </div>

      <!-- Add Card -->
      <div @click="showModal = true" class="bg-[#181A20]/30 rounded-2xl border border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-center hover:bg-[#181A20] hover:border-sync-primary/50 transition-all cursor-pointer min-h-[360px] group">
        <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sync-muted group-hover:text-sync-primary group-hover:border-sync-primary/30 group-hover:bg-sync-primary/10 text-2xl mb-6 transition-all">
          +
        </div>
        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-sync-primary transition-colors">우리 팀 시작하기</h3>
        <p class="text-xs text-sync-muted leading-relaxed max-w-[200px]">
          함께 프로젝트를 완주할 멋진 팀원을 모집해 보세요.
        </p>
      </div>
    </section>

    <!-- Floating Action Button -->
    <div class="fixed bottom-8 right-8 z-40">
      <button @click="showModal = true" class="w-14 h-14 bg-sync-primary hover:bg-sync-primaryHover text-white rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(50,132,255,0.4)] transition-transform hover:scale-110">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </div>

    <!-- Create Team Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div class="w-full max-w-lg bg-[#181A20] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div class="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#181A20] z-10">
          <h2 class="text-xl font-bold text-white">팀 생성하기</h2>
          <button @click="showModal = false" class="text-sync-muted hover:text-white transition-colors p-1">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form @submit.prevent="submitTeam" class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-white">팀 이름 <span class="text-red-400">*</span></label>
              <input v-model="newTeam.name" required type="text" class="w-full bg-[#22252D] border border-white/5 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary shadow-inner transition-all" placeholder="멋진 팀 이름을 지어주세요" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-white">해커톤 슬러그/ID <span class="text-sync-muted font-normal">(선택)</span></label>
              <input v-model="newTeam.hackathonSlug" type="text" class="w-full bg-[#22252D] border border-white/5 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary shadow-inner transition-all" placeholder="참여하려는 해커톤 슬러그 (예: ai-hack)" />
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-white">팀 한 줄 소개 <span class="text-red-400">*</span></label>
              <textarea v-model="newTeam.intro" required rows="3" class="w-full bg-[#22252D] border border-white/5 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary shadow-inner transition-all resize-none" placeholder="팀의 목표나 비전을 알려주세요"></textarea>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-white mb-1">모집 중인 포지션</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="role in availableRoles" :key="role" type="button"
                  @click="toggleNewTeamRole(role)"
                  :class="[
                    newTeam.lookingFor.includes(role) ? 'bg-sync-primary border-sync-primary text-white' : 'bg-[#22252D] border-white/5 text-sync-muted hover:text-white',
                    'px-4 py-2 border rounded-full text-xs font-medium transition-colors'
                  ]"
                >
                  {{ role }}
                </button>
              </div>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-white">연락처 URL <span class="text-sync-muted font-normal">(선택)</span></label>
              <input v-model="newTeam.contactUrl" type="url" class="w-full bg-[#22252D] border border-white/5 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary shadow-inner transition-all" placeholder="오픈채팅방, 구글 폼 등" />
            </div>

            <div class="flex items-center gap-3 mt-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="newTeam.isOpen" class="sr-only peer">
                <div class="w-11 h-6 bg-[#22252D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
              <span class="text-sm font-medium text-white">팀원 모집 상태 켜기</span>
            </div>
          </form>
        </div>
        
        <div class="p-6 border-t border-white/5 bg-[#181A20] flex gap-3 z-10 sticky bottom-0">
          <button @click="showModal = false" class="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors">취소</button>
          <button @click="submitTeam" class="flex-1 py-3.5 bg-sync-primary hover:bg-sync-primaryHover text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(50,132,255,0.3)] transition-all">생성하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
</style>
