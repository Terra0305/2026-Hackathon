<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { mockTeams, mockMyHackathons, mockMySubmissions, mockMyActivities, mockJoinRequests, mockShopItems, availableBadges } from '../data/mockData'
import EmptyState from '../components/EmptyState.vue'
import UserAvatar from '../components/UserAvatar.vue'
import UserBadgeStrip from '../components/UserBadgeStrip.vue'
import { getAvailablePoints } from '../utils/userDecorations'

const authStore = useAuthStore()
const router = useRouter()

const isTimelinePublic = computed({
  get: () => authStore.user?.isTimelinePublic ?? true,
  set: (val) => {
    authStore.updateProfile({ isTimelinePublic: val })
  }
})

const mySentRequests = computed(() => {
  return mockJoinRequests.filter(r => r.userId === authStore.user?.id)
})

const myIncomingRequests = computed(() => {
  const myTeamIds = mockTeams.filter(t => t.leaderId === authStore.user?.id).map(t => t.id)
  return mockJoinRequests.filter(r => myTeamIds.includes(r.teamId))
})

const availablePoints = computed(() => {
  return getAvailablePoints(authStore.user)
})

const myJoinedTeams = computed(() => {
  return mockTeams.filter(t => 
    t.members.includes(authStore.user?.nickname) || 
    t.leaderId === authStore.user?.id
  )
})

const hasNewTeamUpdates = computed(() => {
  return myIncomingRequests.value.some(r => r.status === 'pending')
})

const selectedRequest = ref(null)

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

const isOwnedDecoration = (itemId) => {
  return (authStore.user?.ownedItems || []).includes(itemId)
}

const canPurchaseDecoration = (item) => {
  return !isOwnedDecoration(item.id) && availablePoints.value >= item.price
}

const openParticipatingMenu = () => {
  activeMenu.value = 'participating'
}

const buyItem = (item) => {
  if ((item.type === 'border' || item.type === 'badge') && isOwnedDecoration(item.id)) {
    alert('이미 보유 중인 꾸미기 요소입니다.')
    return
  }

  if (availablePoints.value >= item.price) {
    if (confirm(`'${item.name}' 상품을 교환하시겠습니까?\n(${item.price.toLocaleString()} 포인트가 차감됩니다)`)) {
      const updatedUser = { ...authStore.user }
      updatedUser.walletPoints = getAvailablePoints(updatedUser) - item.price
      
      // Initialize if missing
      if (!updatedUser.ownedItems) updatedUser.ownedItems = []
      if (!updatedUser.pointHistory) updatedUser.pointHistory = []
      
      // Add to inventory if it's a decoration or badge
      let isEquippable = false
      if (item.type === 'border' || item.type === 'badge') {
         if (!updatedUser.ownedItems.includes(item.id)) {
            updatedUser.ownedItems.push(item.id)
            isEquippable = true
         }
      }
      
      // Add to point history record (No time info as requested)
      updatedUser.pointHistory.unshift({
         id: Date.now(),
         type: 'spend',
         amount: item.price,
         detail: `상점 구매: ${item.name}`,
         date: new Date().toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1)
      })
      
      authStore.updateProfile(updatedUser)
      
      if (isEquippable && item.type === 'border') {
        if (confirm(`성공적으로 구매했습니다! 🎉\n지금 바로 '${item.name}'을(를) 장착하시겠습니까?`)) {
          selectBorder(item.id)
        } else {
          alert('인벤토리에 추가되었습니다. 나중에 "프로필 꾸미기" 탭에서 장착하실 수 있습니다.')
        }
      } else if (isEquippable && item.type === 'badge') {
        alert('새 배지가 인벤토리에 추가되었습니다. 프로필 꾸미기 탭에서 선택해 보세요.')
      } else {
        alert('성공적으로 교환되었습니다! 🎁\n인벤토리 또는 내역에서 확인해 보세요.')
      }
    }
  } else {
    alert('포인트가 부족합니다. 해커톤과 커뮤니티 활동을 통해 포인트를 더 모아보세요!')
  }
}
const activeMenu = ref('dashboard')

const menus = [
  { id: 'dashboard', name: '개요' },
  { id: 'participating', name: '참여 해커톤 & 팀' },
  { id: 'applications', name: '팀 관리' },
  { id: 'submissions', name: '제출 내역' },
  { id: 'decoration', name: '프로필 꾸미기' },
  { id: 'activities', name: '활동 및 랭킹' }
]

const decorationItems = [
  { id: 'neon', name: '네온 시안', description: '세련된 사이버네틱 광채', color: 'from-cyan-400 to-blue-500', class: 'profile-border-neon' },
  { id: 'gold', name: '로열 골드', description: '최상위 포식자의 황금빛', color: 'from-amber-300 to-orange-500', class: 'profile-border-gold' },
  { id: 'chroma', name: '크로마 펄스', description: '화려하게 빛나는 RGB', color: 'from-purple-500 via-blue-500 to-teal-400', class: 'profile-border-chroma' }
]



const selectBorder = (borderId) => {
  const nextBorder = authStore.user.profileBorder === borderId ? null : borderId
  authStore.updateProfile({ profileBorder: nextBorder })
}

const toggleBadge = (badgeId) => {
  const selectedBadges = [...(authStore.user.selectedBadges || [])]
  const index = selectedBadges.indexOf(badgeId)

  if (index > -1) {
    selectedBadges.splice(index, 1)
  } else {
    if (selectedBadges.length >= 3) {
      alert('배지는 최대 3개까지만 선택할 수 있습니다.')
      return
    }
    selectedBadges.push(badgeId)
  }

  authStore.updateProfile({ selectedBadges })
}

const isBadgeSelected = (badgeId) => {
  return authStore.user?.selectedBadges?.includes(badgeId) || false
}

const dashboardOngoingProjects = computed(() => {
  return myJoinedTeams.value.slice(0, 2).map(team => {
    return {
      id: team.id,
      hackathonId: team.hackathonId,
      title: team.teamName,
      hackathonName: team.hackathonTitle || team.hackathonName,
      dDay: 'D-Day', // Mocking for now
      progress: Math.floor(Math.random() * 40) + 30, // Mocking progress
      colorClass: 'bg-sync-primary/20 text-sync-primary border-sync-primary/30',
      barClass: 'bg-sync-primary shadow-[0_0_12px_rgba(50,132,255,0.6)]'
    }
  })
})

const recentTimeline = [
  { title: '새로운 팀 합류', time: '2시간 전', colorClass: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]' },
  { title: '코드 커밋 완료', time: '어제', colorClass: 'bg-blue-400 shadow-[0_0_8px_rgba(50,132,255,0.8)]' },
  { title: '프로필 업데이트', time: '3일 전', colorClass: 'bg-sync-muted' }
]

// Mock contribution data generator
const generateContribs = (seed) => {
  const weeks = 24, days = 7
  const result = []
  for (let w = 0; w < weeks; w++) {
    const week = []
    for (let d = 0; d < days; d++) {
      const rand = ((seed * (w * 7 + d + 1)) % 5)
      week.push(rand)
    }
    result.push(week)
  }
  return result
}

const contribColor = (val) => {
  if (val === 0) return 'bg-black/5 dark:bg-white/5 border border-sync-border'
  if (val <= 1) return 'bg-teal-500/20 dark:bg-teal-900/30 border border-teal-500/10'
  if (val <= 2) return 'bg-teal-500/40 dark:bg-teal-700/40 border border-teal-500/20'
  if (val <= 3) return 'bg-teal-500/70 dark:bg-teal-500/60'
  return 'bg-teal-500 dark:bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.4)]'
}

const isPointShopOpen = ref(false)
const isPointHistoryOpen = ref(false)
const activeShopTab = ref('gifticons') // 'gifticons' or 'decorations'
const isSubmissionModalOpen = ref(false)
const selectedSubmission = ref(null)

const openSubmissionTimeline = (sub) => {
  selectedSubmission.value = sub
  isSubmissionModalOpen.value = true
}

const myOwnedBorders = computed(() => {
  return decorationItems.filter(i => (authStore.user?.ownedItems || []).includes(i.id))
})
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
           <UserAvatar
             :user="authStore.user"
             size-class="w-28 h-28"
             avatar-class="border-4 border-sync-bg shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
             show-badge-overlay
             :badge-ids="authStore.user.selectedBadges || []"
             badge-size="sm"
             badge-position-class="-bottom-2 -right-3"
             badge-container-class="px-2 py-1"
           />
           
            <div class="flex flex-col gap-1.5 min-w-0">
              <div class="flex items-center gap-3">
                <h1 class="text-4xl font-outfit font-black text-sync-text tracking-tight truncate">{{ authStore.user.nickname }}</h1>
                <RouterLink to="/mypage/edit" class="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border text-sync-muted hover:text-sync-primary hover:border-sync-primary transition-all shadow-sm shrink-0" title="프로필 수정">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </RouterLink>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-[15px] font-medium text-sync-muted truncate">{{ authStore.user.role }}</p>
                <span v-if="authStore.user.realName" class="text-[11px] font-bold text-sync-muted bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-sync-border whitespace-nowrap">({{ authStore.user.realName }})</span>
              </div>
            </div>
        </div>

        <div class="flex gap-4 w-full md:w-auto">
           <div @click="openParticipatingMenu" class="flex-1 md:flex-auto p-5 px-6 flex flex-col justify-center gap-1.5 min-w-[140px] glass-card border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm cursor-pointer hover:border-sync-primary/50 transition-all hover:-translate-y-1 group">
             <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase group-hover:text-sync-primary transition-colors">참여 중인 해커톤</span>
             <span class="text-2xl font-black text-sync-text tracking-tight">{{ mockMyHackathons.length || 0 }}개</span>
           </div>
           <div @click="isPointHistoryOpen = true" class="flex-1 md:flex-auto p-5 px-6 flex flex-col justify-center gap-1.5 min-w-[140px] glass-card border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm cursor-pointer hover:border-sync-primary/50 transition-all hover:-translate-y-1 group">
             <span class="text-[10px] text-sync-muted font-bold tracking-widest uppercase group-hover:text-sync-primary transition-colors">현재 포인트</span>
             <span class="text-2xl font-black text-teal-500 dark:text-teal-400 tracking-tight">{{ availablePoints.toLocaleString() }}점</span>
           </div>
        </div>
      </div>

      <!-- Horizontal Tabs -->
      <div class="flex items-center gap-2 sm:gap-8 border-b border-black/10 dark:border-white/5 mb-8 overflow-x-auto custom-scrollbar">
         <button 
           v-for="menu in menus" 
           :key="menu.id"
           @click="activeMenu = menu.id"
           class="pb-4 font-bold text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap px-2 outline-none focus:outline-none focus:ring-0"
           :class="activeMenu === menu.id ? 'text-sync-primary border-b-2 border-sync-primary' : 'text-sync-muted hover:text-sync-text border-b-2 border-transparent'"
         >
           {{ menu.name }}
           <span v-if="menu.id === 'applications' && hasNewTeamUpdates" class="w-1.5 h-1.5 rounded-full bg-red-500 mb-2"></span>
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
                        <button @click="openParticipatingMenu" class="text-xs font-bold text-sync-primary hover:underline underline-offset-4">더보기</button>
                      </div>

                      <div class="flex flex-col gap-6">
                         <div v-for="pj in dashboardOngoingProjects" :key="pj.id" class="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-sync-border hover:border-sync-primary/30 transition-all">
                            <div class="flex justify-between items-start mb-4">
                               <div class="flex flex-col gap-1">
                                  <span class="text-[10px] font-bold uppercase tracking-widest text-sync-primary">{{ pj.hackathonName }}</span>
                                  <h4 class="text-lg font-bold text-sync-text">{{ pj.title }}</h4>
                                </div>
                                <div class="flex gap-2">
                                  <RouterLink :to="`/hackathons/${pj.hackathonId}`" class="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-sync-border text-[10px] font-bold text-sync-muted hover:text-sync-text transition-colors">공고보기</RouterLink>
                                  <RouterLink :to="`/workspace/${pj.id}`" class="px-3 py-1.5 rounded-lg bg-sync-primary/10 border border-sync-primary/20 text-[10px] font-bold text-sync-primary hover:bg-sync-primary/20 transition-colors">워크스페이스</RouterLink>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                               <div class="flex justify-between text-[11px] font-bold">
                                  <span class="text-sync-muted">프로젝트 진행률</span>
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
                       <div class="flex justify-between items-center mb-10">
                          <h3 class="text-2xl font-black text-sync-text tracking-tight font-outfit">나의 활동 타임라인</h3>
                          <div class="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-sync-border">
                             <button @click="isTimelinePublic = true" class="px-3 py-1 text-[10px] font-bold rounded-md transition-all" :class="isTimelinePublic ? 'bg-sync-primary text-white shadow-sm' : 'text-sync-muted hover:text-sync-text'">공개</button>
                             <button @click="isTimelinePublic = false" class="px-3 py-1 text-[10px] font-bold rounded-md transition-all" :class="!isTimelinePublic ? 'bg-red-500 text-white shadow-sm' : 'text-sync-muted hover:text-sync-text'">비공개</button>
                          </div>
                       </div>
                       <div class="flex flex-col gap-8 relative pl-6">
                          <div class="absolute left-[3px] top-2 bottom-2 w-[2px] bg-sync-border"></div>
                          <div v-for="time in recentTimeline" :key="time.title" class="relative flex flex-col gap-1">
                             <div class="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#181A20]" :class="time.colorClass || 'bg-sync-muted'"></div>
                             <h4 class="text-base font-bold text-sync-text">{{ time.title }}</h4>
                             <span class="text-xs font-medium text-sync-muted">{{ time.time }}</span>
                          </div>
                       </div>
                    </div>

                    <!-- GitHub Contributions Section -->
                    <div class="glass-card p-8 md:p-10 border border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] relative overflow-hidden group">
                       <div class="flex justify-between items-center mb-8 border-b border-sync-border pb-4">
                          <div class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-sync-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            <h3 class="font-bold text-lg text-sync-text">GitHub Contributions</h3>
                          </div>
                          <span v-if="authStore.user.githubConnected" class="text-[10px] font-bold text-sync-muted uppercase tracking-widest border border-sync-border px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">Connected</span>
                          <button v-else @click="authStore.user.githubConnected = true" class="text-[10px] font-bold text-sync-primary hover:underline">Link Account</button>
                       </div>

                       <div v-if="authStore.user.githubConnected" class="flex flex-col gap-6">
                          <!-- Contribution Grid -->
                          <div class="flex flex-col gap-2 overflow-x-auto custom-scrollbar pb-2">
                             <div class="flex gap-1.5 w-max">
                               <div v-for="(week, wi) in generateContribs(authStore.user.id)" :key="wi" class="flex flex-col gap-1.5">
                                 <div v-for="(day, di) in week" :key="di"
                                      class="w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 cursor-help"
                                      :class="contribColor(day)"
                                      :title="`${day === 0 ? 'No' : day} contributions`"
                                 ></div>
                               </div>
                             </div>
                             <div class="flex items-center justify-between mt-3">
                                <span class="text-[10px] text-sync-muted font-bold">24주 전</span>
                                <div class="flex items-center gap-1.5">
                                   <span class="text-[10px] text-sync-muted font-bold">적음</span>
                                   <div class="flex gap-1">
                                      <div class="w-3 h-3 rounded-[2px] bg-black/5 dark:bg-white/5 border border-sync-border"></div>
                                      <div class="w-3 h-3 rounded-[2px] bg-teal-500/20"></div>
                                      <div class="w-3 h-3 rounded-[2px] bg-teal-500/40"></div>
                                      <div class="w-3 h-3 rounded-[2px] bg-teal-500/70"></div>
                                      <div class="w-3 h-3 rounded-[2px] bg-teal-500 shadow-[0_0_4px_rgba(20,184,166,0.4)]"></div>
                                   </div>
                                   <span class="text-[10px] text-sync-muted font-bold">많음</span>
                                </div>
                                <span class="text-[10px] text-sync-muted font-bold">이번 주</span>
                             </div>
                          </div>
                          
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sync-border mt-2">
                             <div class="flex flex-col gap-1">
                               <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Commits in 2026</span>
                               <span class="text-3xl font-black text-sync-text drop-shadow-sm">{{ authStore.user.githubCommits || 0 }}</span>
                             </div>
                             <div class="flex flex-col gap-2">
                               <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Top Tech Stack</span>
                               <div class="flex flex-wrap gap-2">
                                  <span v-for="tech in authStore.user.techStack" :key="tech" class="px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-sync-border rounded-lg text-[11px] font-bold text-sync-text tracking-wide shadow-sm hover:border-sync-primary/50 hover:bg-sync-primary/10 transition-colors">{{ tech }}</span>
                               </div>
                             </div>
                          </div>
                       </div>
                       <div v-else class="pt-2">
                          <button @click="authStore.user.githubConnected = true" class="px-6 py-2.5 rounded-xl bg-sync-primary text-white text-xs font-bold hover:bg-sync-primaryHover transition-all shadow-md">지금 연결하기</button>
                       </div>
                    </div>
                 </div>

                <div class="flex flex-col gap-8">
                   <div class="glass-card p-8 border border-slate-200 dark:border-white/5 shadow-md rounded-[2.5rem] flex flex-col items-center text-center bg-gradient-to-br from-teal-500/5 via-transparent to-transparent">
                      <div @click="isPointHistoryOpen = true" class="w-20 h-20 bg-teal-500/10 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-teal-500/20 cursor-pointer hover:scale-105 transition-transform">💰</div>
                      <h3 class="text-xl font-bold text-sync-text mb-2">Sync 포인트</h3>
                      <p @click="isPointHistoryOpen = true" class="text-3xl font-black text-teal-500 dark:text-teal-400 tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">{{ availablePoints.toLocaleString() }} <span class="text-[15px] font-bold opacity-70">PTS</span></p>
                      <p class="text-xs font-medium text-sync-muted mt-3 mb-8 px-4 leading-relaxed">해커톤 참여와 가이드 작성을 통해 모은 포인트로 다양한 리워드와 교환하세요!</p>
                      <button @click="isPointShopOpen = true" class="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold text-sm transition-all shadow-[0_8px_20px_rgba(45,212,191,0.3)] hover:-translate-y-1">포인트 상점 가기</button>
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
          <div v-if="activeMenu === 'participating'" class="flex flex-col gap-10 animate-fade-in">
              <!-- Participating Teams -->
              <div class="flex flex-col gap-6">
                <h3 class="text-xl font-bold text-sync-text px-2">👥 소속 팀</h3>
                <div v-if="myJoinedTeams.length === 0" class="py-12 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-sync-border rounded-[2.5rem]">
                   <EmptyState size="sm" message="참여 중인 프로젝트가 존재하지 않습니다." icon="🚀" />
                   <RouterLink to="/hackathons" class="text-sm font-bold text-sync-primary hover:underline">첫 해커톤 찾아보기</RouterLink>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div v-for="team in myJoinedTeams" :key="team.id" class="glass-card p-8 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm hover:border-sync-primary/30 transition-all group">
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

              <!-- My Applied Hackathons -->
              <div class="flex flex-col gap-6 mt-4">
                <h3 class="text-xl font-bold text-sync-text px-2">📤 내가 신청한 해커톤</h3>
                <div v-if="mockMyHackathons.length === 0" class="py-12 w-full flex justify-center border border-dashed border-sync-border rounded-[2.5rem]">
                  <EmptyState size="sm" message="신청한 해커톤이 없습니다." icon="✈️" />
                </div>
                <div v-for="hack in mockMyHackathons" :key="hack.id" class="glass-card p-6 flex flex-col gap-4 border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl opacity-90 transition-opacity hover:opacity-100">
                  <div class="flex items-center justify-between border-b border-sync-border pb-3">
                    <div class="flex items-center gap-2">
                      <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest border border-sync-border px-1.5 py-0.5 rounded">{{ hack.role }}</span>
                      <span class="text-sm font-bold text-sync-text underline decoration-sync-border underline-offset-4">{{ hack.title }}</span>
                    </div>
                    <span class="px-2.5 py-1 rounded flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest border"
                          :class="{
                            'bg-teal-500/10 text-teal-500 border-teal-500/20': hack.status === '진행 중',
                            'bg-orange-500/10 text-orange-500 border-orange-500/20': hack.status === '매칭 중' || hack.status === '심사 중',
                            'bg-blue-500/10 text-blue-500 border-blue-500/20': hack.status === '참여 대기'
                          }">
                      <span class="w-1.5 h-1.5 rounded-full" 
                            :class="{
                              'bg-teal-500': hack.status === '진행 중',
                              'bg-orange-500 animate-pulse': hack.status === '매칭 중' || hack.status === '심사 중',
                              'bg-blue-500': hack.status === '참여 대기'
                            }"></span>
                      {{ hack.status }}
                    </span>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span class="font-bold text-sync-muted text-xs">신청일: {{ hack.appliedDate }}</span>
                    <div class="flex gap-2">
                       <button v-if="hack.status === '심사 중' || hack.status === '매칭 중'" @click="mockMyHackathons.splice(mockMyHackathons.indexOf(hack), 1)" class="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all">신청 취소</button>
                       <RouterLink :to="`/hackathons/${hack.hackathonId}`" class="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border text-sync-text text-xs font-bold hover:bg-black/10 transition-colors">상세 보기</RouterLink>
                       <RouterLink v-if="hack.status === '진행 중'" :to="`/workspace/${mockTeams.find(t => t.hackathonId === hack.hackathonId)?.id || ''}`" class="px-4 py-2 rounded-xl bg-sync-primary text-white text-xs font-bold hover:bg-sync-primaryHover transition-all shadow-sm">워크스페이스</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          <!-- Team Management View -->
          <div v-if="activeMenu === 'applications'" class="flex flex-col gap-10 animate-fade-in">
              <!-- Incoming Requests to My Teams -->
              <div class="flex flex-col gap-4">
                <h3 class="text-xl font-bold text-sync-text flex items-center gap-2">
                  📥 팀에 들어온 합류 요청 <span class="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-[0_2px_8px_rgba(239,68,68,0.4)]">{{ myIncomingRequests.length }}</span>
                </h3>
                
                <EmptyState v-if="myIncomingRequests.length === 0" size="sm" message="받은 합류 요청이 없습니다." icon="📮" />

                <div v-else class="flex flex-col gap-3">
                  <div v-for="req in myIncomingRequests" :key="'in-' + req.id"
                       class="glass-card flex items-center justify-between p-4 flex-wrap gap-4 px-6 rounded-2xl border border-sync-border hover:border-sync-primary/40 cursor-pointer transition-all shadow-sm group"
                       @click="selectedRequest = { ...req, isOutgoing: false }">
                    <div class="flex items-center gap-4 min-w-0">
                      <div class="w-10 h-10 bg-slate-200 rounded-full overflow-hidden shrink-0 border border-sync-border relative">
                        <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${req.nickname}`" class="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                      </div>
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-base font-bold text-sync-text leading-none">{{ req.nickname }}</span>
                          <span class="text-xs text-sync-muted font-medium">{{ req.createdAt }}</span>
                        </div>
                        <span class="text-[13px] font-bold text-sync-primary">[{{ mockTeams.find(t => t.id === req.teamId)?.teamName }}] {{ req.role }} 지원</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span v-if="req.status === 'pending'" class="text-[12px] font-bold px-3 py-1.5 bg-sync-primary/10 text-sync-primary rounded-lg border border-sync-primary/20 shadow-[0_2px_10px_rgba(50,132,255,0.1)]">대기 중</span>
                      <span v-else-if="req.status === 'accepted'" class="text-[12px] font-bold px-3 py-1.5 bg-teal-500/10 text-teal-500 rounded-lg border border-teal-500/20 shadow-[0_2px_10px_rgba(45,212,191,0.1)]">수락 완료</span>
                      <span v-else class="text-[12px] font-bold px-3 py-1.5 bg-gray-500/10 text-gray-500 rounded-lg border border-gray-500/20">거절됨</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full h-px bg-sync-border my-2"></div>

              <!-- My Sent Requests -->
              <div class="flex flex-col gap-4">
                <h3 class="text-xl font-bold text-sync-text flex items-center justify-between">
                  📤 내가 보낸 합류 요청
                </h3>
                
                <EmptyState v-if="mySentRequests.length === 0" size="sm" message="신청한 내역이 없습니다." icon="✈️" />

                <div v-else class="flex flex-col gap-3">
                  <div v-for="req in mySentRequests" :key="'out-' + req.id"
                       class="glass-card flex items-center justify-between p-4 flex-wrap gap-4 px-6 rounded-2xl border border-sync-border hover:border-sync-primary/40 cursor-pointer transition-all shadow-sm group"
                       @click="selectedRequest = { ...req, isOutgoing: true }">
                    <div class="flex items-center gap-4 min-w-0">
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-base font-bold text-sync-primary truncate leading-none">{{ mockTeams.find(t => t.id === req.teamId)?.teamName }}</span>
                        <div class="flex items-center gap-2">
                           <span class="text-[13px] font-bold text-sync-primary">{{ req.role }} 지원</span>
                           <span class="text-xs text-sync-muted font-medium">{{ req.createdAt }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span v-if="req.status === 'pending'" class="text-[12px] font-bold px-3 py-1.5 flex items-center gap-2 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg shadow-[0_2px_10px_rgba(249,115,22,0.1)]"><span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>대기 중</span>
                      <span v-else-if="req.status === 'accepted'" class="text-[12px] font-bold px-3 py-1.5 bg-teal-500/10 text-teal-500 border-teal-500/20 rounded-lg shadow-[0_2px_10px_rgba(45,212,191,0.1)]">수락됨</span>
                      <span v-else class="text-[12px] font-bold px-3 py-1.5 bg-gray-500/10 text-gray-500 border border-gray-500/20 rounded-lg">거절됨</span>
                    </div>
                  </div>
               </div>
              </div>
          </div>

          <!-- Submissions View -->
          <div v-if="activeMenu === 'submissions'" class="flex flex-col gap-8 animate-fade-in">
              <div v-if="mockMySubmissions.length === 0" class="py-20 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-sync-border rounded-[2.5rem]">
                 <EmptyState size="md" message="제출 내역이 존재하지 않습니다." icon="🏆" />
                 <RouterLink to="/workspace" class="text-sm font-bold text-sync-primary hover:underline">프로젝트 제출하러 가기</RouterLink>
              </div>

              <div v-for="sub in mockMySubmissions" :key="sub.id" class="glass-card p-8 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between gap-8 group">
                 <div class="flex flex-col gap-4 flex-1">
                    <div class="flex items-center gap-3">
                       <span class="text-[10px] font-black text-white bg-sync-primary px-3 py-1 rounded-full shadow-sm">{{ sub.hackathonName }}</span>
                    </div>
                    <h3 class="text-2xl font-black text-sync-text tracking-tight group-hover:text-sync-primary transition-colors">{{ sub.projectName }}</h3>
                    <p class="text-sm text-sync-muted font-medium leading-relaxed">{{ sub.description }}</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                       <a v-for="link in sub.links" :key="link" :href="link" target="_blank" class="text-xs font-bold text-sync-muted hover:text-sync-primary flex items-center gap-1.5 border border-sync-border px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 transition-all">🔗 GitHub Link</a>
                    </div>
                 </div>
                 <div class="flex flex-col justify-between items-end shrink-0">
                    <span class="text-xs font-bold text-sync-muted">제출일: {{ sub.date }}</span>
                    <button @click="openSubmissionTimeline(sub)" class="px-6 py-2.5 bg-sync-primary/10 border border-sync-primary/20 hover:bg-sync-primary/20 text-sync-primary rounded-xl text-xs font-bold transition-all shadow-sm">제출 내역 보기</button>
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
                          <span class="text-sm font-bold text-sync-text">{{ decorationItems.find(i => i.id === authStore.user.profileBorder)?.name || '없음' }}</span>
                       </div>
                    </div>
                 </div>

	                 <div class="flex flex-col gap-3">
	                    <button
                        @click="selectBorder(null)"
                        class="flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-all"
                        :class="!authStore.user.profileBorder ? 'border-sync-primary bg-sync-primary/5 shadow-sm' : 'border-sync-border hover:border-sync-primary/40'"
                      >
                        <div class="flex items-center gap-4 min-w-0">
                          <div class="w-12 h-12 rounded-full border-2 border-dashed border-sync-muted flex items-center justify-center text-sync-muted">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </div>
                          <div class="flex flex-col min-w-0">
                            <span class="text-sm font-bold text-sync-text">기본 프로필</span>
                            <span class="text-xs text-sync-muted">테두리를 사용하지 않습니다.</span>
                          </div>
                        </div>
                        <span class="text-[11px] font-bold" :class="!authStore.user.profileBorder ? 'text-sync-primary' : 'text-sync-muted'">
                          {{ !authStore.user.profileBorder ? '사용 중' : '선택' }}
                        </span>
                      </button>

	                    <button
                        v-for="item in myOwnedBorders"
                        :key="item.id"
                        @click="selectBorder(item.id)"
                        class="flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-all"
                        :class="authStore.user.profileBorder === item.id ? 'border-sync-primary bg-sync-primary/5 shadow-sm' : 'border-sync-border hover:border-sync-primary/40'"
                      >
                        <div class="flex items-center gap-4 min-w-0">
                          <div class="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <div class="absolute inset-0 profile-border-container scale-110" :class="item.class"></div>
                            <img :src="authStore.user.avatar" class="relative z-10 w-full h-full rounded-full border-2 border-sync-bg object-cover bg-slate-200" />
                          </div>
                          <div class="flex flex-col min-w-0">
                            <span class="text-sm font-bold text-sync-text">{{ item.name }}</span>
                            <span class="text-xs text-sync-muted truncate">{{ item.description }}</span>
                          </div>
                        </div>
                        <span class="text-[11px] font-bold" :class="authStore.user.profileBorder === item.id ? 'text-sync-primary' : 'text-sync-muted'">
                          {{ authStore.user.profileBorder === item.id ? '사용 중' : '장착' }}
                        </span>
                      </button>

	                    <button
                        v-if="myOwnedBorders.length < (decorationItems.length || 0)"
                        @click="isPointShopOpen = true; activeShopTab = 'decorations'"
                        class="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-sync-border px-4 py-3 text-left transition-all hover:border-sync-primary/40"
                      >
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 rounded-full bg-sync-primary/10 flex items-center justify-center text-xl">🏪</div>
                          <div class="flex flex-col">
                            <span class="text-sm font-bold text-sync-primary">새로운 아이템 보러가기</span>
                            <span class="text-xs text-sync-muted">상점에서 더 많은 테두리를 확인하세요.</span>
                          </div>
                        </div>
                        <span class="text-[11px] font-bold text-sync-muted">상점</span>
                      </button>
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
	                       <UserBadgeStrip
                          :badge-ids="authStore.user.selectedBadges || []"
                          size="xl"
                          overlap
                          badge-class="bg-white dark:bg-[#181A20] border-2 border-sync-bg"
                        />
                          <div v-if="!authStore.user.selectedBadges?.length" class="text-xs font-bold text-sync-muted">선택된 배지 없음</div>
	                    </div>
	                 </div>

                 <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div v-for="badge in availableBadges" :key="badge.id" 
                         @click="toggleBadge(badge.id)"
                         class="glass-card p-5 rounded-2xl border border-sync-border cursor-pointer transition-all flex flex-col items-center gap-3 group relative overflow-hidden"
                         :class="isBadgeSelected(badge.id) ? 'bg-sync-primary/5 border-sync-primary shadow-[0_0_15px_rgba(50,132,255,0.1)]' : 'hover:border-sync-primary/30 hover:bg-black/5 dark:hover:bg-white/5'">
                       
                       <div class="absolute inset-0 bg-gradient-to-br from-sync-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                       
                       <div class="text-3xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" 
                            :class="!isBadgeSelected(badge.id) ? 'grayscale opacity-30 brightness-75' : 'drop-shadow-md'">
                          {{ badge.icon }}
                       </div>
                       <span class="text-[11px] font-bold text-sync-text text-center leading-tight relative z-10" :class="!isBadgeSelected(badge.id) ? 'opacity-50' : ''">{{ badge.name }}</span>
                       
                       <div v-if="isBadgeSelected(badge.id)" class="absolute top-2 right-2 w-5 h-5 bg-sync-primary text-white rounded-full flex items-center justify-center text-[10px] shadow-sm animate-bounce-in">
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

            <div class="flex-1 overflow-y-auto p-4 sm:p-8 bg-black/5 dark:bg-black/20 custom-scrollbar flex flex-col gap-10">
            
            <div class="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-600 dark:from-teal-600 dark:to-emerald-700 text-white shadow-[0_8px_30px_rgba(20,184,166,0.3)]">
               <div class="flex flex-col gap-1">
                 <span class="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">보유 포인트</span>
                 <span class="text-3xl font-black drop-shadow-md">{{ availablePoints.toLocaleString() }} <span class="text-lg opacity-80">XP</span></span>
               </div>
               <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30">💰</div>
            </div>

            <!-- Tab Navigation for Shop (Sticky Category Bar) -->
            <div class="sticky top-0 z-20 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border border-sync-border rounded-2xl flex p-1 shadow-sm">
               <button 
                 @click="activeShopTab = 'gifticons'"
                 class="flex-1 py-3 px-4 font-bold text-xs transition-all flex items-center justify-center gap-2 rounded-xl"
                 :class="activeShopTab === 'gifticons' ? 'bg-sync-primary text-white shadow-md' : 'text-sync-muted hover:text-sync-text'"
               >
                 <span>☕</span> 모바일 기프트콘
               </button>
               <button 
                 @click="activeShopTab = 'decorations'"
                 class="flex-1 py-3 px-4 font-bold text-xs transition-all flex items-center justify-center gap-2 rounded-xl"
                 :class="activeShopTab === 'decorations' ? 'bg-sync-primary text-white shadow-md' : 'text-sync-muted hover:text-sync-text'"
               >
                 <span>✨</span> 프로필 꾸미기
               </button>
            </div>

            <!-- Category: Gifticons (High Price) -->
            <div v-if="activeShopTab === 'gifticons'" class="flex flex-col gap-5 animate-fade-in">
               <div v-if="mockShopItems.gifticons.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="item in mockShopItems.gifticons" :key="item.id" class="flex flex-col p-6 rounded-3xl bg-white dark:bg-[#181A20] border border-sync-border hover:border-sync-primary/50 transition-all shadow-sm relative group overflow-hidden">
                     <div class="absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br transition-opacity group-hover:opacity-20 pointer-events-none rounded-bl-full" :class="item.color"></div>
                     <div class="flex items-start justify-between mb-4 relative z-10">
                        <div class="w-14 h-14 flex items-center justify-center text-3xl bg-black/5 dark:bg-white/5 rounded-2xl shadow-inner border border-white/10">{{ item.icon }}</div>
                        <span class="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-[10px] font-black text-sync-muted uppercase tracking-widest border border-sync-border">{{ item.brand }}</span>
                     </div>
                     <h4 class="text-base font-bold text-sync-text mb-1 relative z-10">{{ item.name }}</h4>
                     <p class="text-xl font-black text-sync-primary mb-6 relative z-10">{{ item.price.toLocaleString() }} <span class="text-xs opacity-70">XP</span></p>
                     <button @click="buyItem(item)" class="mt-auto w-full py-3.5 rounded-xl font-bold text-xs transition-all relative z-10 shadow-sm" :class="availablePoints >= item.price ? 'bg-sync-primary text-white hover:bg-sync-primaryHover hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(50,132,255,0.3)]' : 'bg-black/5 dark:bg-white/5 text-sync-muted cursor-not-allowed'">
                        {{ availablePoints >= item.price ? '교환하기' : '포인트 부족' }}
                     </button>
                  </div>
               </div>
               <div v-else class="py-20 text-center text-sync-muted">준비된 기프트콘이 없습니다.</div>
            </div>

            <!-- Category: Decoration (Low Price) -->
            <div v-if="activeShopTab === 'decorations'" class="flex flex-col gap-5 animate-fade-in">
               <div v-if="mockShopItems.decorations.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
	                  <div v-for="item in mockShopItems.decorations" :key="item.id" class="flex flex-col p-6 rounded-3xl bg-white dark:bg-[#181A20] border border-sync-border hover:border-sync-primary/50 transition-all shadow-sm relative group overflow-hidden">
	                     <div class="absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br transition-opacity group-hover:opacity-20 pointer-events-none rounded-bl-full" :class="item.color"></div>
	                     <div class="flex items-start justify-between mb-4 relative z-10">
	                        <div class="w-14 h-14 flex items-center justify-center text-3xl bg-black/5 dark:bg-white/5 rounded-2xl shadow-inner border border-white/10">{{ item.icon }}</div>
	                        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                            :class="isOwnedDecoration(item.id) ? 'bg-black/5 dark:bg-white/5 text-sync-muted border-sync-border' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'"
                          >
                            {{ isOwnedDecoration(item.id) ? 'Owned' : 'Special' }}
                          </span>
	                     </div>
	                     <h4 class="text-base font-bold text-sync-text mb-1 relative z-10">{{ item.name }}</h4>
	                     <p class="text-xl font-black text-teal-500 mb-6 relative z-10">{{ item.price.toLocaleString() }} <span class="text-xs opacity-70">XP</span></p>
	                     <button
                        @click="canPurchaseDecoration(item) && buyItem(item)"
                        class="mt-auto w-full py-3.5 rounded-xl font-bold text-xs transition-all relative z-10 shadow-sm"
                        :class="isOwnedDecoration(item.id) ? 'bg-black/5 dark:bg-white/5 text-sync-muted cursor-not-allowed' : availablePoints >= item.price ? 'bg-sync-primary text-white hover:bg-sync-primaryHover hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(50,132,255,0.3)]' : 'bg-black/5 dark:bg-white/5 text-sync-muted cursor-not-allowed'"
                      >
	                        {{ isOwnedDecoration(item.id) ? '보유 중' : availablePoints >= item.price ? '구매하기' : '포인트 부족' }}
		                     </button>
	                  </div>
	               </div>
               <div v-else class="py-20 text-center text-sync-muted">준비된 꾸미기 요소가 없습니다.</div>
            </div>

            <div class="mt-4 p-4 rounded-xl border border-dashed border-sync-border bg-black/5 dark:bg-white/5 text-center">
              <p class="text-xs font-bold text-sync-muted leading-relaxed">쿠폰은 내 정보에 등록된 이메일 주소로 영업일 기준 1~2일 이내에 발송됩니다.<br/>발송된 기프티콘 및 혜택은 환불이 불가능하니 신중하게 교환해 주세요.</p>
            </div>

          </div>
        </div>
      </div>
    </Teleport>

    <!-- Application Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedRequest" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="selectedRequest = null"></div>
        <div class="glass-card relative w-full max-w-lg bg-white dark:bg-[#0f1115] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in flex flex-col gap-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div class="flex justify-between items-center border-b border-sync-border pb-4 shrink-0">
            <h3 class="text-[17px] font-bold text-sync-text flex items-center gap-2">📄 팀 합류 신청서</h3>
            <button @click="selectedRequest = null" class="text-sync-muted hover:text-sync-text transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div class="flex items-center gap-4 mb-2 shrink-0">
            <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedRequest.nickname}`" class="w-14 h-14 bg-slate-200 rounded-full border border-sync-border flex-shrink-0"/>
            <div class="flex flex-col gap-1 min-w-0">
              <span class="text-lg font-bold text-sync-text truncate">{{ selectedRequest.nickname }}</span>
              <span class="text-xs text-sync-muted font-bold truncate">{{ mockTeams.find(t => t.id === selectedRequest.teamId)?.teamName || '프로젝트' }} - {{ selectedRequest.createdAt }} 신청</span>
            </div>
          </div>
          
          <div class="flex flex-col gap-5 flex-1 min-h-0">
            <div class="flex flex-col gap-2 shrink-0">
              <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">지원 포지션</span>
              <div class="p-4 bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl text-sm font-bold text-sync-text">{{ selectedRequest.role }}</div>
            </div>
            
            <div class="flex flex-col gap-2 flex-1 min-h-[120px]">
              <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">지원 동기 및 코멘트</span>
              <div class="p-5 bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl text-[14px] text-sync-text leading-relaxed whitespace-pre-wrap">{{ selectedRequest.message || '내용이 없습니다.' }}</div>
            </div>
          </div>
          
          <div class="mt-2 pt-5 border-t border-sync-border flex justify-end gap-3 shrink-0" v-if="!selectedRequest.isOutgoing && selectedRequest.status === 'pending'">
             <button @click="handleRejectRequest(mockJoinRequests.find(r => r.id === selectedRequest.id)); selectedRequest = null" class="flex-1 sm:flex-none min-w-[100px] px-8 py-3.5 rounded-xl border border-red-500/30 text-red-500 text-[13px] font-bold hover:bg-red-500/10 transition-colors">거절하기</button>
             <button @click="handleAcceptRequest(mockJoinRequests.find(r => r.id === selectedRequest.id)); selectedRequest = null" class="flex-1 sm:flex-none min-w-[100px] px-8 py-3.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-[13px] font-bold transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5">수락하기</button>
          </div>
          <div class="mt-2 pt-5 border-t border-sync-border flex justify-end shrink-0" v-else-if="selectedRequest.isOutgoing && selectedRequest.status === 'pending'">
             <button @click="mockJoinRequests.splice(mockJoinRequests.findIndex(r => r.id === selectedRequest.id), 1); selectedRequest = null" class="w-full px-6 py-3.5 rounded-xl border border-red-500/30 text-red-500 text-[13px] font-bold hover:bg-red-500/10 transition-colors">지원 취소하기</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Point History Modal -->
    <Teleport to="body">
       <div v-if="isPointHistoryOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
         <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isPointHistoryOpen = false"></div>
         <div class="glass-card relative w-full max-w-lg bg-white dark:bg-[#0f1115] border border-sync-border rounded-[2.5rem] shadow-2xl animate-fade-in flex flex-col max-h-[80vh] overflow-hidden">
            <div class="flex justify-between items-center px-8 py-6 border-b border-sync-border shrink-0">
               <h3 class="text-lg font-bold text-sync-text flex items-center gap-2">💰 포인트 이용 내역</h3>
               <button @click="isPointHistoryOpen = false" class="text-sync-muted hover:text-sync-text transition-colors"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            
            <div class="p-6 bg-black/5 dark:bg-white/5 flex items-center justify-between shrink-0">
               <span class="text-sm font-bold text-sync-muted">현재 보유 중인 포인트</span>
               <span class="text-2xl font-black text-sync-primary">{{ availablePoints.toLocaleString() }} XP</span>
            </div>
            
             <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div v-if="!(authStore.user.pointHistory?.length > 0)" class="py-12 text-center text-sync-muted flex flex-col gap-3">
                   <span class="text-3xl opacity-50 font-black">📋</span>
                   <p class="text-sm font-bold">포인트 이용 내역이 없습니다.</p>
                </div>
                <div v-else class="flex flex-col gap-8 relative pl-6">
                   <!-- Timeline Line -->
                   <div class="absolute left-[3px] top-2 bottom-2 w-px bg-sync-border border-l border-dashed opacity-50"></div>
                   
                   <div v-for="log in authStore.user.pointHistory" :key="log.id" class="relative flex flex-col gap-1 group">
                      <!-- Timeline Dot -->
                      <div class="absolute -left-[27.5px] top-1.5 w-4 h-4 rounded-full border-4 border-white dark:border-[#0f1115] z-10 transition-transform group-hover:scale-125 shadow-sm"
                           :class="log.type === 'earn' ? 'bg-teal-500' : 'bg-red-500'"></div>
                      
                      <div class="flex justify-between items-start gap-4">
                        <div class="flex flex-col gap-1 min-w-0">
                           <h4 class="text-[15px] font-bold text-sync-text line-clamp-1 group-hover:text-sync-primary transition-colors">{{ log.detail }}</h4>
                           <span class="text-[10px] text-sync-muted font-bold tracking-tight uppercase">{{ log.date }}</span>
                        </div>
                        <div class="flex flex-col items-end shrink-0">
                           <span class="text-base font-black px-2 py-0.5 rounded-lg" :class="log.type === 'earn' ? 'text-teal-500 bg-teal-500/10' : 'text-red-500 bg-red-500/10'">
                              {{ log.type === 'earn' ? '+' : '-' }}{{ log.amount.toLocaleString() }}
                           </span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
         </div>
       </div>
    </Teleport>

    <!-- Submission Detail Timeline Modal -->
    <Teleport to="body">
      <div v-if="isSubmissionModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="isSubmissionModalOpen = false"></div>
        <div class="glass-card relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in flex flex-col gap-6">
          <div class="flex justify-between items-center border-b border-sync-border pb-4">
            <div class="flex flex-col gap-1">
              <h3 class="text-xl font-black text-sync-text tracking-tight">🔎 제출 상세 내역</h3>
              <p class="text-xs font-bold text-sync-muted">{{ selectedSubmission?.hackathonTitle }}</p>
            </div>
            <button @click="isSubmissionModalOpen = false" class="text-sync-muted hover:text-red-500 transition-colors bg-black/5 dark:bg-white/5 p-2 rounded-full">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="flex flex-col gap-8 py-4 relative pl-6">
            <div class="absolute left-[3px] top-6 bottom-6 w-px bg-sync-border border-l border-dashed"></div>
            
            <div class="relative flex flex-col gap-1">
              <div class="absolute -left-[27.5px] top-1.5 w-4 h-4 rounded-full bg-teal-500 border-4 border-white dark:border-[#0A0A0A] z-10 shadow-sm"></div>
              <h4 class="text-base font-bold text-sync-text">해커톤 참가 신청</h4>
              <p class="text-xs text-sync-muted font-medium">참가 모집 기간 내 정상 신청 완료</p>
              <span class="text-[10px] font-bold text-sync-muted mt-1 uppercase opacity-60">2026.03.10</span>
            </div>

            <div class="relative flex flex-col gap-1">
              <div class="absolute -left-[27.5px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-[#0A0A0A] z-10 shadow-sm"></div>
              <h4 class="text-base font-bold text-sync-text">팀 빌딩 완료</h4>
              <p class="text-xs text-sync-muted font-medium">'Sync-Wizard' 팀 소속으로 확정</p>
              <span class="text-[10px] font-bold text-sync-muted mt-1 uppercase opacity-60">2026.03.15</span>
            </div>

            <div class="relative flex flex-col gap-1">
              <div class="absolute -left-[27.5px] top-1.5 w-4 h-4 rounded-full bg-sync-primary border-4 border-white dark:border-[#0A0A0A] z-10 shadow-sm"></div>
              <h4 class="text-base font-bold text-sync-text">최종 결과물 제출</h4>
              <p class="text-xs text-sync-muted font-medium">GitHub Repo 및 문서 아카이빙 완료</p>
              <span class="text-[10px] font-bold text-sync-muted mt-1 uppercase opacity-60">{{ selectedSubmission?.date }}</span>
            </div>

            <div v-if="selectedSubmission?.award" class="relative flex flex-col gap-1">
              <div class="absolute -left-[27.5px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-[#0A0A0A] z-10 shadow-sm animate-pulse"></div>
              <h4 class="text-base font-bold text-sync-text">수상 결과 발표</h4>
              <p class="text-xs text-sync-muted font-medium">{{ selectedSubmission.award }} 달성 ✨</p>
              <span class="text-[10px] font-bold text-sync-muted mt-1 uppercase opacity-60">2026.03.25</span>
            </div>
          </div>

          <div class="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-sync-border flex flex-col gap-1.5">
             <span class="text-[10px] font-black text-sync-muted uppercase tracking-widest">Final Project</span>
             <h5 class="text-base font-bold text-sync-text">{{ selectedSubmission?.projectName }}</h5>
             <div class="flex gap-2 mt-2">
                <a :href="selectedSubmission?.link" target="_blank" class="px-4 py-2 bg-white dark:bg-[#181A20] border border-sync-border rounded-xl text-[11px] font-bold text-sync-text hover:text-sync-primary transition-colors shadow-sm">Code Repository</a>
             </div>
          </div>
          
          <button @click="isSubmissionModalOpen = false" class="w-full py-4 bg-black/5 dark:bg-white/5 border border-sync-border hover:bg-black/10 text-sync-text rounded-2xl text-sm font-bold transition-all">닫기</button>
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
