<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { mockTeams, mockMyHackathons, mockMySubmissions, mockMyActivities, mockJoinRequests } from '../data/mockData'
import EmptyState from '../components/EmptyState.vue'

const authStore = useAuthStore()

const mySentRequests = computed(() => {
  return mockJoinRequests.filter(r => r.userId === authStore.user?.id)
})

const myIncomingRequests = computed(() => {
  const myTeamIds = mockTeams.filter(t => t.leaderId === authStore.user?.id).map(t => t.id)
  return mockJoinRequests.filter(r => myTeamIds.includes(r.teamId))
})

const handleAcceptRequest = (req) => {
  const team = mockTeams.find(t => t.id === req.teamId)
  if (!team) return

  const role = team.roles.find(r => r.name === req.role)
  if (!role) return

  if (role.current >= role.total) {
    alert('해당 역할의 정원이 이미 가득 찼습니다.')
    return
  }

  // Update Data
  role.current++
  if (!team.members.includes(req.nickname)) {
    team.members.push(req.nickname)
  }
  req.status = 'accepted'

  // Auto-close team if all roles are full
  if (team.roles.every(r => r.current >= r.total)) {
    team.status = '마감'
  }

  alert(`${req.nickname} 님이 팀에 합류했습니다!`)
}

const handleRejectRequest = (req) => {
  if (confirm(`'${req.nickname}' 님의 합류 요청을 거절하시겠습니까?`)) {
    req.status = 'rejected'
  }
}

const isPointShopOpen = ref(false)
const pointShopItems = [
  { id: 1, name: 'CGV 영화 관람권 1인', price: 15000, icon: '🍿', color: 'from-red-500 to-rose-400' },
  { id: 2, name: '스타벅스 아메리카노', price: 4500, icon: '☕', color: 'from-green-500 to-emerald-400' },
  { id: 3, name: 'AWS $100 Cloud Credit', price: 20000, icon: '☁️', color: 'from-orange-500 to-amber-400' },
  { id: 4, name: 'GitHub Pro 1개월권', price: 12000, icon: '💻', color: 'from-slate-700 to-slate-900' }
]

const buyItem = (item) => {
  if (authStore.user.points >= item.price) {
    if (confirm(`'${item.name}' 상품을 교환하시겠습니까?\n(${item.price.toLocaleString()} 포인트가 차감됩니다)`)) {
      authStore.user.points -= item.price
      localStorage.setItem('sync_user', JSON.stringify(authStore.user))
      alert('성공적으로 교환되었습니다! 🎁\n가입하신 이메일로 쿠폰 코드가 즉시 발송됩니다.')
    }
  } else {
    alert('포인트가 부족합니다. 해커톤과 커뮤니티 활동을 통해 포인트를 더 모아보세요!')
  }
}
const activeMenu = ref('dashboard')

const menus = [
  { id: 'dashboard', name: '개요' },
  { id: 'participating', name: '참여 해커톤 & 팀' },
  { id: 'applications', name: '팀 합류 관리' },
  { id: 'submissions', name: '제출 내역' },
  { id: 'decoration', name: '프로필 꾸미기' },
  { id: 'activities', name: '활동 및 랭킹' }
]

const decorationItems = [
  { id: 'neon', name: '네온 시안', description: '세련된 사이버네틱 광채', color: 'from-cyan-400 to-blue-500', class: 'profile-border-neon' },
  { id: 'gold', name: '로열 골드', description: '최상위 포식자의 황금빛', color: 'from-amber-300 to-orange-500', class: 'profile-border-gold' },
  { id: 'chroma', name: '크로마 펄스', description: '화려하게 빛나는 RGB', color: 'from-purple-500 via-blue-500 to-teal-400', class: 'profile-border-chroma' }
]

const availableBadges = [
  { id: 'badge1', name: 'First Hackathon', icon: '🌱', description: '첫 번째 해커톤 참여 완료' },
  { id: 'badge2', name: 'Bug Hunter', icon: '🐛', description: '코드 버그 10개 이상 수정' },
  { id: 'badge3', name: 'Fast Learner', icon: '📚', description: '새로운 스택 3개 이상 학습' },
  { id: 'badge4', name: 'Night Owl', icon: '🌙', description: '심야 시간에 100회 이상 커밋' },
  { id: 'badge5', name: 'Team Leader', icon: '👑', description: '프로젝트 리더로 팀 운영' },
  { id: 'badge6', name: 'Innovation Award', icon: '💡', description: '아이디어 경연대회 입상' }
]

const selectBorder = (borderId) => {
  if (authStore.user.profileBorder === borderId) {
    authStore.user.profileBorder = null
  } else {
    authStore.user.profileBorder = borderId
  }
  localStorage.setItem('sync_user', JSON.stringify(authStore.user))
}

const toggleBadge = (badgeId) => {
  const user = authStore.user
  if (!user.selectedBadges) user.selectedBadges = []
  
  const index = user.selectedBadges.indexOf(badgeId)
  if (index > -1) {
    user.selectedBadges.splice(index, 1)
  } else {
    if (user.selectedBadges.length >= 3) {
      alert('배지는 최대 3개까지만 선택할 수 있습니다.')
      return
    }
    user.selectedBadges.push(badgeId)
  }
  localStorage.setItem('sync_user', JSON.stringify(authStore.user))
}

const isBadgeSelected = (badgeId) => {
  return authStore.user?.selectedBadges?.includes(badgeId) || false
}

const ongoingProjects = [
  { title: 'AI Web Infrastructure 2024', dDay: 'D-12', progress: 60, colorClass: 'bg-sync-primary/20 text-sync-primary border-sync-primary/30', barClass: 'bg-sync-primary shadow-[0_0_12px_rgba(50,132,255,0.6)]' },
  { title: 'Creative UI/UX Challenge', dDay: 'D-34', progress: 25, colorClass: 'bg-teal-500/20 text-teal-400 border-teal-500/30', barClass: 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]' }
]

const recentTimeline = [
  { title: '새로운 팀 합류', time: '2시간 전', colorClass: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]' },
  { title: '코드 커밋 완료', time: '어제', colorClass: 'bg-blue-400 shadow-[0_0_8px_rgba(50,132,255,0.8)]' },
  { title: '프로필 업데이트', time: '3일 전', colorClass: 'bg-sync-muted' }
]
</script>

<template>
  <div class="w-full flex-1 max-w-[1240px] mx-auto px-4 sm:px-6 py-10 transition-colors duration-300 relative min-h-[calc(100vh-4rem)]">
    <!-- Ambient Base -->
    <div class="fixed inset-0 bg-gradient-to-b from-sync-primary/5 to-transparent pointer-events-none -z-10"></div>
    <div class="fixed top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000 -z-10"></div>

    <div v-if="authStore.isAuthenticated" class="w-full flex flex-col">
      <!-- Profile Header Block -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
        <div class="flex items-center gap-6">
           <div class="relative w-28 h-28 shrink-0 flex items-center justify-center">
             <!-- Profile Border Overlay -->
             <div v-if="authStore.user.profileBorder" class="absolute inset-0 profile-border-container z-0" :class="`profile-border-${authStore.user.profileBorder}`"></div>
             
             <div class="w-full h-full rounded-full overflow-hidden border-4 border-sync-bg shadow-[0_8px_32px_rgba(0,0,0,0.15)] bg-slate-200 z-10 relative">
                <img :src="authStore.user.avatar" class="w-full h-full object-cover" />
             </div>
             <div class="absolute bottom-1 right-1 w-6 h-6 rounded-full border-[3px] border-sync-bg z-20 flex items-center justify-center shadow-sm" :class="authStore.user.status === 'up' ? 'bg-teal-400' : 'bg-orange-400'"></div>
           </div>
           
           <div class="flex flex-col gap-1.5">
              <h1 class="text-4xl font-outfit font-black text-sync-text tracking-tight">{{ authStore.user.nickname }}</h1>
              <p class="text-[15px] font-medium text-sync-muted">{{ authStore.user.role }}</p>
           </div>
        </div>

        <div class="flex gap-4 w-full md:w-auto">
           <div class="flex-1 md:flex-auto p-5 px-6 flex flex-col justify-center gap-1.5 min-w-[140px] glass-card border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
             <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase">참여 중인 해커톤</span>
             <span class="text-2xl font-black text-sync-text tracking-tight">{{ mockMyHackathons.length || 0 }}개</span>
           </div>
           <div class="flex-1 md:flex-auto p-5 px-6 flex flex-col justify-center gap-1.5 min-w-[140px] glass-card border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
             <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase">현재 포인트</span>
             <span class="text-2xl font-black text-teal-500 dark:text-teal-400 tracking-tight">{{ authStore.user.points?.toLocaleString() }}점</span>
           </div>
        </div>
      </div>

      <!-- Horizontal Tabs -->
      <div class="flex items-center gap-2 sm:gap-8 border-b border-black/10 dark:border-white/5 mb-8 overflow-x-auto custom-scrollbar">
         <button 
           v-for="menu in menus" 
           :key="menu.id"
           @click="activeMenu = menu.id"
           class="pb-4 font-bold text-sm transition-colors whitespace-nowrap px-2 outline-none focus:outline-none focus:ring-0"
           :class="activeMenu === menu.id ? 'text-sync-primary border-b-2 border-sync-primary' : 'text-sync-muted hover:text-sync-text border-b-2 border-transparent'"
         >
           {{ menu.name }}
         </button>
      </div>

      <!-- Dynamic Content Body -->
      <div class="flex-1 w-full animate-fade-in relative z-10">
          <!-- Dashboard View -->
          <div v-if="activeMenu === 'dashboard'" class="flex flex-col gap-10">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 flex flex-col gap-8">
                   <div class="glass-card p-8 md:p-10 border border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] relative overflow-hidden group">
                      <div class="absolute -right-20 -top-20 w-64 h-64 bg-sync-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-sync-primary/20 transition-all duration-1000"></div>
                      <div class="flex justify-between items-center mb-10">
                        <h3 class="text-2xl font-black text-sync-text tracking-tight font-outfit">진행 중인 프로젝트</h3>
                        <RouterLink to="/workspace" class="text-xs font-bold text-sync-primary hover:underline underline-offset-4">워크스페이스로 이동</RouterLink>
                      </div>

                      <div class="flex flex-col gap-5">
                         <div v-for="pj in ongoingProjects" :key="pj.title" class="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-sync-border hover:border-sync-primary/30 transition-all">
                            <div class="flex justify-between items-center mb-4">
                               <div class="flex flex-col gap-1">
                                  <span class="text-[10px] font-bold uppercase tracking-widest text-sync-muted">{{ pj.dDay }}</span>
                                  <h4 class="text-lg font-bold text-sync-text">{{ pj.title }}</h4>
                                </div>
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold shadow-sm" :class="pj.colorClass">ONGOING</span>
                            </div>
                            <div class="flex flex-col gap-2">
                               <div class="flex justify-between text-[11px] font-bold">
                                  <span class="text-sync-muted">Progress</span>
                                  <span class="text-sync-text">{{ pj.progress }}%</span>
                               </div>
                               <div class="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                                  <div class="h-full rounded-full transition-all duration-1000" :style="`width: ${pj.progress}%`" :class="pj.barClass"></div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div class="glass-card p-8 md:p-10 border border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-transparent relative overflow-hidden group">
                      <h3 class="text-2xl font-black text-sync-text tracking-tight mb-10 font-outfit">나의 활동 타임라인</h3>
                      <div class="flex flex-col gap-8 relative pl-6">
                         <div class="absolute left-[3px] top-2 bottom-2 w-[2px] bg-sync-border"></div>
                         <div v-for="time in recentTimeline" :key="time.title" class="relative flex flex-col gap-1">
                            <div class="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#181A20]" :class="time.colorClass || 'bg-sync-muted'"></div>
                            <h4 class="text-base font-bold text-sync-text">{{ time.title }}</h4>
                            <span class="text-xs font-medium text-sync-muted">{{ time.time }}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div class="flex flex-col gap-8">
                   <div class="glass-card p-8 border border-slate-200 dark:border-white/5 shadow-md rounded-[2.5rem] flex flex-col items-center text-center bg-gradient-to-br from-teal-500/5 via-transparent to-transparent">
                      <div class="w-20 h-20 bg-teal-500/10 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-teal-500/20">💰</div>
                      <h3 class="text-xl font-bold text-sync-text mb-2">Sync 포인트</h3>
                      <p class="text-3xl font-black text-teal-500 dark:text-teal-400 tracking-tighter">{{ authStore.user.points?.toLocaleString() }} <span class="text-[15px] font-bold opacity-70">PTS</span></p>
                      <p class="text-xs font-medium text-sync-muted mt-3 mb-8 px-4 leading-relaxed">해커톤 참여와 가이드 작성을 통해 모은 포인트로 다양한 리워드와 교환하세요!</p>
                      <button @click="isPointShopOpen = true" class="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold text-sm transition-all shadow-[0_8px_20px_rgba(45,212,191,0.3)] hover:-translate-y-1">포인트 점점 상점 가기</button>
                   </div>

                   <div class="glass-card p-8 border border-slate-200 dark:border-white/5 shadow-md rounded-[2.5rem] flex flex-col gap-6">
                      <h4 class="text-lg font-bold text-sync-text border-b border-sync-border pb-4">나의 관심사 태그</h4>
                      <div class="flex flex-wrap gap-2">
                         <span v-for="tag in ['Web3', 'AI', 'UI/UX', 'Solidity', 'Frontend']" :key="tag" class="px-4 py-1.5 bg-black/5 dark:bg-white/5 border border-sync-border rounded-full text-xs font-bold text-sync-muted hover:text-sync-primary hover:border-sync-primary/30 transition-all cursor-default">{{ tag }}</span>
                      </div>
                   </div>
                </div>
              </div>
          </div>

          <!-- Participating View -->
          <div v-if="activeMenu === 'participating'" class="flex flex-col gap-8 animate-fade-in">
              <div v-if="mockMyHackathons.length === 0" class="py-20 flex flex-col items-center justify-center text-center gap-4">
                 <EmptyState size="md" message="참여 중인 프로젝트가 존재하지 않습니다." icon="🚀" />
                 <RouterLink to="/hackathons" class="text-sm font-bold text-sync-primary hover:underline">첫 해커톤 찾아보기</RouterLink>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div v-for="team in mockTeams.filter(t => t.members.includes(authStore.user?.nickname))" :key="team.id" class="glass-card p-8 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm hover:border-sync-primary/30 transition-all group">
                    <div class="flex justify-between items-start mb-8">
                       <div class="flex flex-col gap-1.5">
                          <span class="text-[10px] font-bold text-sync-primary uppercase tracking-widest">{{ team.hackathonName }}</span>
                          <h3 class="text-2xl font-black text-sync-text tracking-tight group-hover:text-sync-primary transition-colors">{{ team.teamName }}</h3>
                       </div>
                       <span class="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[10px] font-bold uppercase tracking-widest">Active Team</span>
                    </div>
                    <div class="flex flex-col gap-4 mb-8">
                       <p class="text-sm font-medium text-sync-muted line-clamp-2 leading-relaxed">{{ team.description }}</p>
                    </div>
                    <div class="flex justify-between items-center pt-6 border-t border-sync-border">
                       <div class="flex -space-x-3">
                          <div v-for="i in 3" :key="i" class="w-9 h-9 rounded-full border-2 border-sync-bg bg-slate-200 overflow-hidden shadow-sm">
                             <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=member${i}`" class="w-full h-full object-cover" />
                          </div>
                          <div class="w-9 h-9 rounded-full border-2 border-sync-bg bg-sync-border flex items-center justify-center text-[10px] font-bold text-sync-muted">+{{ team.members.length - 3 }}</div>
                       </div>
                       <RouterLink :to="`/workspace/${team.id}`" class="px-6 py-2.5 bg-sync-primary/5 hover:bg-sync-primary/10 border border-sync-primary/20 text-sync-primary rounded-xl text-xs font-bold transition-all hover:scale-105">워크스페이스 입장</RouterLink>
                    </div>
                 </div>
              </div>
          </div>

          <!-- Applications View -->
          <div v-if="activeMenu === 'applications'" class="flex flex-col gap-12 animate-fade-in">
              <!-- Incoming Requests -->
              <div class="flex flex-col gap-5">
                <h3 class="text-xl font-bold text-sync-text flex items-center justify-between">
                  📩 나에게 도착한 합류 요청
                  <span class="text-xs font-bold text-teal-500 bg-teal-400/10 px-2 py-0.5 rounded">{{ myIncomingRequests.filter(r => r.status === 'pending').length }}건 대기</span>
                </h3>
                
                <div v-if="myIncomingRequests.length === 0" class="py-12 w-full flex justify-center">
                  <EmptyState size="sm" message="받은 합류 요청이 없습니다." icon="📮" />
                </div>

                <div v-for="req in myIncomingRequests" :key="'in-' + req.id" class="glass-card p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl relative overflow-hidden group">
                  <div class="absolute inset-y-0 left-0 w-1.5 bg-sync-primary"></div>
                  <div class="flex flex-col gap-3 flex-1 pl-4">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] bg-sync-primary/10 text-sync-primary border border-sync-primary/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{{ req.role }} 지원</span>
                      <span class="text-[11px] text-sync-muted font-bold">{{ req.createdAt }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-slate-200 rounded-full border border-sync-border overflow-hidden">
                        <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${req.nickname}`" class="w-full h-full object-cover"/>
                      </div>
                      <span class="text-lg font-bold text-sync-text">{{ req.nickname }}</span>
                    </div>
                    <div class="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-sync-border mt-1">
                      <p class="text-[13px] font-medium text-sync-text whitespace-pre-line leading-relaxed">{{ req.message }}</p>
                    </div>
                  </div>
                  <div class="flex lg:flex-col gap-3 shrink-0 lg:w-32 justify-end mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-sync-border">
                    <button @click="handleAcceptRequest(req)" v-if="req.status === 'pending'" class="w-full px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm">수락하기</button>
                    <button @click="handleRejectRequest(req)" v-if="req.status === 'pending'" class="w-full px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-xs font-bold rounded-xl transition-all shadow-sm">거절하기</button>
                    <span v-if="req.status === 'accepted'" class="w-full px-4 py-2.5 bg-teal-500/10 border border-teal-500/30 text-teal-500 text-xs font-bold rounded-xl text-center">수락 완료</span>
                    <span v-if="req.status === 'rejected'" class="w-full px-4 py-2.5 bg-gray-500/10 border border-gray-500/30 text-gray-500 text-xs font-bold rounded-xl text-center">거절 완료</span>
                  </div>
                </div>
              </div>

              <div class="w-full h-px bg-sync-border my-2"></div>

              <!-- Sent Requests -->
              <div class="flex flex-col gap-5">
                <h3 class="text-xl font-bold text-sync-text">📤 내가 보낸 합류 요청</h3>
                
                <div v-if="mySentRequests.length === 0" class="py-12 w-full flex justify-center">
                  <EmptyState size="sm" message="신청한 내역이 없습니다." icon="✈️" />
                </div>

                <div v-for="req in mySentRequests" :key="'out-' + req.id" class="glass-card p-6 flex flex-col gap-4 border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl opacity-90 transition-opacity hover:opacity-100">
                  <div class="flex items-center justify-between border-b border-sync-border pb-3">
                    <div class="flex items-center gap-2">
                      <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest border border-sync-border px-1.5 py-0.5 rounded">{{ req.role }}</span>
                      <span class="text-sm font-bold text-sync-text underline decoration-sync-border underline-offset-4">{{ mockTeams.find(t => t.id === req.teamId)?.teamName }}</span>
                    </div>
                    <span class="px-2.5 py-1 rounded flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest border"
                          :class="req.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : req.status === 'accepted' ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'">
                      <span v-if="req.status === 'pending'" class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                      {{ req.status === 'pending' ? '대기 중' : req.status === 'accepted' ? '수락됨' : '거절됨' }}
                    </span>
                  </div>
                  <p class="text-[13px] text-sync-muted leading-relaxed whitespace-pre-line bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-sync-border">"{{ req.message }}"</p>
                  <div class="flex justify-between items-center mt-1">
                    <span class="font-bold text-sync-muted text-xs">{{ req.createdAt }}</span>
                    <button v-if="req.status === 'pending'" @click="mockJoinRequests.splice(mockJoinRequests.indexOf(req), 1)" class="text-red-500 text-xs font-bold hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-500/30">요청 취소</button>
                  </div>
                </div>
              </div>
          </div>

          <!-- Submissions View -->
          <div v-if="activeMenu === 'submissions'" class="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
              <div v-if="mockMySubmissions.length === 0" class="col-span-full py-12 flex justify-center w-full">
                 <EmptyState size="md" message="제출된 프로젝트 내역이 없습니다." icon="📦" />
              </div>

              <div v-for="sub in mockMySubmissions" :key="sub.id" class="glass-card shadow-sm overflow-hidden group hover:-translate-y-1 transition-transform border border-slate-200 dark:border-white/5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] rounded-3xl">
                 <div class="h-36 bg-gradient-to-br flex items-center justify-center relative shadow-inner overflow-hidden" :class="sub.awardColor">
                    <div class="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                    <div class="absolute -top-10 -right-10 w-24 h-24 bg-white/20 blur-[20px] rounded-full mix-blend-overlay group-hover:scale-150 transition-transform duration-700"></div>
                    <img :src="sub.thumbnail" class="w-24 h-24 opacity-60 z-10 drop-shadow-md group-hover:scale-110 transition-transform" />
                    <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">{{ sub.award }}</div>
                 </div>
                 <div class="p-8 flex flex-col gap-3">
                   <p class="text-[10px] font-bold text-sync-primary uppercase tracking-widest">{{ sub.hackathonTitle }}</p>
                   <h3 class="text-xl font-bold text-sync-text leading-tight mt-1">{{ sub.projectName }}</h3>
                   <p class="text-[13px] text-sync-muted line-clamp-2 leading-relaxed mt-1 font-medium">{{ sub.description }}</p>
                   
                   <div v-if="sub.historyDocs && sub.historyDocs.length" class="flex flex-col gap-2 mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border transition-colors group-hover:border-sync-primary/20">
                      <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest mb-1">Workspace Archive</span>
                      <div v-for="doc in sub.historyDocs" :key="doc.title" class="flex items-center justify-between text-xs">
                         <div class="flex items-center gap-2">
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-sync-text font-bold drop-shadow-sm">{{ doc.type }}</span>
                            <span class="text-sync-text font-medium">{{ doc.title }}</span>
                         </div>
                         <span class="text-sync-muted font-bold text-[10px] hidden sm:block">{{ doc.date }}</span>
                      </div>
                   </div>

                   <div class="mt-4 pt-5 border-t border-sync-border flex justify-between items-center text-sm">
                     <span class="font-bold text-sync-muted">{{ sub.date }}</span>
                     <a :href="sub.link" target="_blank" class="font-bold text-sync-primary hover:text-sync-primaryHover transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sync-primary/10 border border-sync-primary/20 shadow-sm">Source Code <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                   </div>
                 </div>
              </div>
          </div>

          <!-- Decoration View -->
          <div v-if="activeMenu === 'decoration'" class="flex flex-col gap-10 animate-fade-in">
              <!-- Border Section -->
              <div class="glass-card p-8 md:p-10 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm">
                 <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div class="flex flex-col gap-2">
                       <h3 class="text-2xl font-black text-sync-text tracking-tight">프로필 테두리 장착</h3>
                       <p class="text-sm font-bold text-sync-muted">내 프로필을 돋보이게 해줄 특별한 테두리를 선택하세요.</p>
                    </div>
                    <div class="bg-black/5 dark:bg-white/5 border border-sync-border p-4 rounded-2xl flex items-center gap-4">
                       <div class="relative w-14 h-14 flex items-center justify-center">
                          <div v-if="authStore.user.profileBorder" class="absolute inset-0 profile-border-container scale-110" :class="`profile-border-${authStore.user.profileBorder}`"></div>
                          <img :src="authStore.user.avatar" class="w-full h-full rounded-full border-2 border-sync-bg relative z-10" />
                       </div>
                       <div class="flex flex-col gap-0.5">
                          <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">현재 적용 중</span>
                          <span class="text-sm font-bold text-sync-text">{{ authStore.user.profileBorder ? decorationItems.find(i => i.id === authStore.user.profileBorder).name : '없음' }}</span>
                       </div>
                    </div>
                 </div>

                 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- None Option -->
                    <div @click="authStore.user.profileBorder = null; localStorage.setItem('sync_user', JSON.stringify(authStore.user))" 
                         class="glass-card p-6 rounded-[2rem] border border-sync-border cursor-pointer transition-all hover:border-sync-primary/50 flex flex-col items-center justify-center gap-4 group h-full min-h-[200px]"
                         :class="!authStore.user.profileBorder ? 'bg-sync-primary/5 border-sync-primary shadow-[0_0_20px_rgba(50,132,255,0.1)]' : ''">
                       <div class="w-16 h-16 rounded-full border-2 border-dashed border-sync-muted flex items-center justify-center text-sync-muted group-hover:scale-110 transition-transform">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                       </div>
                       <div class="text-center">
                          <h4 class="font-bold text-sync-text">기본 프로필</h4>
                          <p class="text-xs text-sync-muted font-medium mt-1">테두리를 사용하지 않습니다.</p>
                       </div>
                    </div>

                    <!-- Decoration Items -->
                    <div v-for="item in decorationItems" :key="item.id" 
                         @click="selectBorder(item.id)"
                         class="glass-card p-6 rounded-[2rem] border border-sync-border cursor-pointer transition-all hover:border-sync-primary/50 flex flex-col items-center justify-center gap-4 group h-full min-h-[200px] relative overflow-hidden"
                         :class="authStore.user.profileBorder === item.id ? 'bg-sync-primary/5 border-sync-primary shadow-[0_0_20px_rgba(50,132,255,0.1)]' : ''">
                       
                       <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-bl-full pointer-events-none" :class="item.color"></div>
                       
                       <div class="relative w-16 h-16 flex items-center justify-center">
                          <div class="absolute inset-[-4px] profile-border-container scale-110" :class="item.class"></div>
                          <div class="w-full h-full rounded-full border-2 border-sync-bg relative z-10 bg-slate-200 overflow-hidden">
                             <img :src="authStore.user.avatar" class="w-full h-full object-cover" />
                          </div>
                       </div>
                       
                       <div class="text-center relative z-10">
                          <h4 class="font-bold text-sync-text">{{ item.name }}</h4>
                          <p class="text-xs text-sync-muted font-medium mt-1">{{ item.description }}</p>
                       </div>

                       <div v-if="authStore.user.profileBorder === item.id" class="absolute top-4 right-4 text-sync-primary">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Badges Section -->
              <div class="glass-card p-8 md:p-10 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm">
                 <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div class="flex flex-col gap-2">
                       <h3 class="text-2xl font-black text-sync-text tracking-tight">수집한 배지 진열</h3>
                       <p class="text-sm font-bold text-sync-muted">나의 특별한 업적을 프로필에 표시하세요. (최대 3개)</p>
                    </div>
                    <div class="bg-black/5 dark:bg-white/5 border border-sync-border p-4 px-6 rounded-2xl flex items-center gap-4">
                       <div class="flex items-center -space-x-2">
                          <div v-for="badgeId in authStore.user.selectedBadges || []" :key="badgeId" class="w-10 h-10 rounded-full bg-white dark:bg-[#181A20] border-2 border-sync-bg flex items-center justify-center text-xl shadow-sm z-10">
                             {{ availableBadges.find(b => b.id === badgeId)?.icon }}
                          </div>
                          <div v-if="!authStore.user.selectedBadges?.length" class="text-xs font-bold text-sync-muted">선택된 배지 없음</div>
                       </div>
                    </div>
                 </div>

                 <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div v-for="badge in availableBadges" :key="badge.id" 
                         @click="toggleBadge(badge.id)"
                         class="glass-card p-5 rounded-2xl border border-sync-border cursor-pointer transition-all flex flex-col items-center gap-3 group relative"
                         :class="isBadgeSelected(badge.id) ? 'bg-sync-primary/5 border-sync-primary shadow-sm' : 'hover:border-sync-primary/30'">
                       <div class="text-3xl transition-transform group-hover:scale-110" :class="!isBadgeSelected(badge.id) ? 'grayscale opacity-50' : ''">
                          {{ badge.icon }}
                       </div>
                       <span class="text-[11px] font-bold text-sync-text text-center leading-tight">{{ badge.name }}</span>
                       <div v-if="isBadgeSelected(badge.id)" class="absolute -top-1 -right-1 w-5 h-5 bg-sync-primary text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                          ✓
                       </div>
                    </div>
                 </div>
              </div>
          </div>

          <!-- Activities View -->
          <div v-if="activeMenu === 'activities'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div class="lg:col-span-2 glass-card p-6 md:p-10 shadow-sm border border-slate-200 dark:border-white/5 rounded-[2rem]">
                  <h3 class="text-xl font-bold text-sync-text mb-8 md:mb-10 font-outfit">최근 활동 내역</h3>
                  <div class="relative flex flex-col gap-6 sm:gap-8">
                     
                     <div v-if="mockMyActivities.length === 0" class="py-8 z-10 relative flex justify-center">
                        <EmptyState size="sm" message="활동 기록이 존재하지 않습니다." icon="🔔" />
                     </div>

                     <div v-if="mockMyActivities.length > 0" class="absolute left-[19px] top-4 bottom-4 w-px bg-sync-border pointer-events-none"></div>

                     <div v-for="act in mockMyActivities" :key="act.id" class="relative flex gap-4 sm:gap-6 items-start group">
                        <div class="w-10 h-10 shrink-0 rounded-full border-[4px] border-white dark:border-[#181A20] flex items-center justify-center text-[15px] z-10 shadow-sm transition-transform group-hover:scale-110 ml-0 mt-3 mix-blend-normal" :class="act.iconColor">
                          {{ act.icon }}
                        </div>
                        <div class="flex-1 flex flex-col gap-2 glass-card-hover p-5 rounded-2xl border border-transparent hover:border-sync-border hover:shadow-sm transition-all duration-300 ease-out bg-transparent hover:bg-black/5 dark:hover:bg-white/5">
                          <div class="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-3">
                             <h4 class="text-base font-bold text-sync-text">{{ act.title }}</h4>
                             <span class="text-[10px] font-bold text-sync-muted mt-1 sm:mt-0 opacity-70 tracking-widest uppercase">{{ act.date }}</span>
                          </div>
                          <p class="text-[13.5px] text-sync-muted leading-relaxed font-medium mt-1">{{ act.desc }}</p>
                        </div>
                     </div>
                  </div>
              </div>

              <div class="lg:col-span-1 flex flex-col gap-6">
                  <div class="glass-card p-8 md:p-10 shadow-sm border border-slate-200 dark:border-white/5 rounded-[2.5rem] bg-gradient-to-br from-sync-primary/5 to-transparent relative overflow-hidden group">
                     <div class="absolute -top-12 -right-12 w-48 h-48 bg-sync-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-sync-primary/20 transition-all duration-700"></div>
                     
                     <div class="flex items-center gap-3 mb-8">
                        <div class="w-10 h-10 rounded-xl bg-sync-primary/20 flex items-center justify-center text-xl shadow-sm">👑</div>
                        <span class="text-sm font-bold text-sync-primary uppercase tracking-widest">나의 티어 및 랭킹</span>
                     </div>
                     <div class="flex items-center gap-2 mb-1">
                       <h2 class="text-4xl font-black text-sync-text tracking-tight">{{ authStore.user.rank }}<span class="text-2xl font-bold text-sync-muted ml-0.5">위</span></h2>
                     </div>
                     <p class="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full mt-2">상위 1.2% 진입 (마스터티어)</p>
                     
                     <div class="w-full h-px bg-sync-border my-6"></div>
                     
                     <div class="flex justify-between w-full items-center mb-3">
                        <span class="text-sm font-bold text-sync-muted">누적 경험치</span>
                        <span class="text-[15px] font-black text-sync-text">{{ authStore.user.points?.toLocaleString() }} <span class="text-xs font-bold text-sync-primary">XP</span></span>
                     </div>
                     <div class="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner flex">
                        <div class="h-full bg-gradient-to-r from-sync-primary to-blue-400 rounded-full w-[80%] relative"></div>
                     </div>
                     <div class="w-full flex justify-between mt-2">
                        <span class="text-[10px] text-sync-muted font-bold">{{ authStore.user.points?.toLocaleString() }}</span>
                        <span class="text-[10px] text-sync-muted font-bold opacity-50">15,000 XP (다음 랭크 승급)</span>
                     </div>
                  </div>

                  <!-- Global Leaderboard Widget -->
                  <RouterLink to="/rankings" class="glass-card p-6 shadow-sm border border-slate-200 dark:border-white/5 rounded-[1.5rem] bg-gradient-to-br from-sync-primary/5 to-transparent hover:border-sync-primary/30 transition-all cursor-pointer group flex items-center gap-4 hover:-translate-y-1">
                      <div class="w-12 h-12 rounded-xl bg-white dark:bg-[#181A20] shadow-sm border border-sync-border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📊</div>
                      <div class="flex flex-col gap-0.5">
                         <h4 class="font-bold text-[15px] text-sync-text group-hover:text-sync-primary transition-colors">글로벌 랭킹 리더보드</h4>
                         <p class="text-xs text-sync-muted font-medium">전체 순위와 개발자 티어를 확인하세요.</p>
                      </div>
                  </RouterLink>
              </div>
          </div>
      </div>
    </div>
    
    <div v-else class="flex items-center justify-center py-32 flex-col gap-4">
      <div class="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border flex items-center justify-center mb-2">
         <svg class="w-8 h-8 text-sync-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      </div>
      <h2 class="text-2xl font-bold font-outfit text-sync-text">로그인이 필요합니다</h2>
      <p class="text-sm text-sync-muted font-medium mb-4">마이페이지에 접근하려면 먼저 로그인을 해주세요.</p>
      <RouterLink to="/login" class="px-8 py-3 bg-sync-primary hover:bg-sync-primaryHover text-white rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">로그인 하러 가기</RouterLink>
    </div>

    <!-- Point Shop Modal -->
    <Teleport to="body">
      <div v-if="isPointShopOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="isPointShopOpen = false"></div>
        <div class="glass-card relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] shadow-2xl animate-fade-in flex flex-col overflow-hidden">
          
          <div class="flex justify-between items-center px-8 py-6 border-b border-sync-border bg-black/5 dark:bg-white/5 relative overflow-hidden">
            <div class="relative z-10 flex flex-col gap-1">
              <h3 class="text-2xl font-black text-sync-text">🎁 Sync 포인트 상점</h3>
              <p class="text-sm font-bold text-sync-muted hidden sm:block">활동으로 모은 포인트를 유용한 리워드로 교환하세요!</p>
            </div>
            <button @click="isPointShopOpen = false" class="relative z-10 p-2 text-sync-muted hover:text-red-500 transition-colors bg-white/50 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-8 bg-black/5 dark:bg-black/20 custom-scrollbar flex flex-col gap-6">
            
            <div class="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 shadow-sm">
               <span class="text-sm font-bold text-sync-text flex items-center gap-2"><span class="text-xl">💰</span>내 보유 포인트</span>
               <span class="text-3xl font-black text-teal-600 dark:text-teal-400 drop-shadow-sm">{{ authStore.user.points?.toLocaleString() }} <span class="text-lg text-teal-500/70">PTS</span></span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div v-for="item in pointShopItems" :key="item.id" class="flex flex-col p-6 rounded-2xl bg-white dark:bg-[#181A20] border border-sync-border hover:border-sync-primary/50 transition-colors shadow-sm relative group overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br transition-opacity group-hover:opacity-20 pointer-events-none rounded-bl-full" :class="item.color"></div>
                  
                  <div class="flex items-start justify-between mb-4 relative z-10">
                     <div class="w-14 h-14 flex items-center justify-center text-3xl bg-black/5 dark:bg-white/5 rounded-2xl shadow-inner border border-white/10">{{ item.icon }}</div>
                     <span class="px-3 py-1 bg-sync-border/30 dark:bg-white/5 rounded-full text-xs font-bold text-sync-muted group-hover:text-sync-text transition-colors border border-sync-border">리워드</span>
                  </div>
                  
                  <h4 class="text-lg font-bold text-sync-text mb-1 relative z-10">{{ item.name }}</h4>
                  <p class="text-2xl font-black text-sync-primary mb-6 relative z-10">{{ item.price.toLocaleString() }} <span class="text-sm">PTS</span></p>
                  
                  <button @click="buyItem(item)" class="mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all relative z-10 shadow-sm" :class="authStore.user.points >= item.price ? 'bg-sync-primary text-white hover:bg-sync-primaryHover hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(50,132,255,0.3)]' : 'bg-black/5 dark:bg-white/5 text-sync-muted cursor-not-allowed'">
                     {{ authStore.user.points >= item.price ? '교환하기' : '포인트 부족' }}
                  </button>
               </div>
            </div>

            <div class="mt-4 p-4 rounded-xl border border-dashed border-sync-border bg-black/5 dark:bg-white/5 text-center">
              <p class="text-xs font-bold text-sync-muted leading-relaxed">쿠폰은 내 정보에 등록된 이메일 주소로 영업일 기준 1~2일 이내에 발송됩니다.<br/>발송된 기프티콘 및 혜택은 환불이 불가능하니 신중하게 교환해 주세요.</p>
            </div>

          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.custom-scrollbar::-webkit-scrollbar {
  height: 0px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.profile-border-neon {
  border: 4px solid #22d3ee;
  box-shadow: 0 0 15px #22d3ee, inset 0 0 15px #22d3ee;
  border-radius: 50%;
}
.profile-border-gold {
  border: 4px solid #fbbf24;
  box-shadow: 0 0 15px #fbbf24, inset 0 0 10px #fbbf24;
  border-radius: 50%;
}
.profile-border-chroma {
  border: 4px solid transparent;
  background-image: linear-gradient(#181a20, #181a20), linear-gradient(to right, #8b5cf6, #3b82f6, #2dd4bf);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
  border-radius: 50%;
}
</style>
