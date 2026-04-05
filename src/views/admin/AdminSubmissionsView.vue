<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { mockHackathons, mockGlobalSubmissions } from '../../data/mockData'
import { useAuthStore } from '../../stores/auth'
import {
  applySubmissionRewards,
  buildSubmissionRewardDistribution,
  formatReviewDate,
  getSubmissionRewardTotal
} from '../../utils/submissionReview'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

if (!authStore.isAuthenticated || !authStore.user?.isAdmin) {
  router.push('/')
}

const hackathonId = parseInt(route.params.id)
const targetHackathon = computed(() => mockHackathons.find(h => h.id === hackathonId))

const submissions = computed(() =>
  mockGlobalSubmissions.filter(s => s.hackathonId === hackathonId)
)

// ─── Status Filter ───────────────────────────────────────
const STATUS_OPTIONS = ['전체', '심사 전', '심사 중', '심사 완료', '수상']
const activeFilter = ref('전체')

const filteredSubmissions = computed(() => {
  if (activeFilter.value === '전체') return submissions.value
  return submissions.value.filter(s => (s.status || '심사 전') === activeFilter.value)
})

const statusCounts = computed(() => {
  const counts = { '전체': submissions.value.length }
  STATUS_OPTIONS.slice(1).forEach(st => {
    counts[st] = submissions.value.filter(s => (s.status || '심사 전') === st).length
  })
  return counts
})

// ─── Detail Drawer ───────────────────────────────────────
const selectedSub = ref(null)
const openDrawer = (sub) => { 
  selectedSub.value = sub 
  editingReview.value = false
}
const closeDrawer = () => { selectedSub.value = null }

// ─── File Preview ────────────────────────────────────────
const previewFile = ref(null)
const openPreview = (file) => { previewFile.value = file }
const closePreview = () => { previewFile.value = null }
const downloadFile = (file) => {
  // Simulated download
  alert(`'${file.name}' 파일을 다운로드합니다.`)
}

// ─── Review Edit ─────────────────────────────────────────
const editingReview = ref(false)
const reviewDraft = ref('')
const detailedScoresDraft = ref({})
const awardDraft = ref('')

const startReview = (sub) => {
  reviewDraft.value = sub.review || ''
  awardDraft.value = sub.award || ''
  
  // Initialize detailed scores from criteria
  const scores = {}
  if (targetHackathon.value?.scoringCriteria) {
    targetHackathon.value.scoringCriteria.forEach(c => {
      scores[c.name] = (sub.detailedScores && sub.detailedScores[c.name]) || 0
    })
  }
  detailedScoresDraft.value = scores
  editingReview.value = true
}

const saveReview = (sub) => {
  sub.review = reviewDraft.value
  sub.detailedScores = { ...detailedScoresDraft.value }
  sub.award = awardDraft.value
  
  // Calculate total weighted score
  let totalScore = 0
  if (targetHackathon.value?.scoringCriteria) {
    targetHackathon.value.scoringCriteria.forEach(c => {
      totalScore += (detailedScoresDraft.value[c.name] || 0) * (c.weight / 100)
    })
  }
  sub.score = Math.round(totalScore)
  
  if (sub.award) {
    sub.status = '수상'
  } else {
    sub.status = '심사 완료'
  }

  sub.reviewedAt = formatReviewDate()

  const nextRewardDistribution = buildSubmissionRewardDistribution(sub)
  applySubmissionRewards(sub, nextRewardDistribution)
  
  editingReview.value = false
  alert(`심사 결과가 저장되었습니다. 팀 전체에 ${getSubmissionRewardTotal(sub).toLocaleString()} PTS가 지급되었습니다.`)
}

// ─── Status helpers ──────────────────────────────────────
const statusClass = (status) => {
  const map = {
    '심사 전':    'text-gray-400 bg-gray-500/10 border-gray-500/20',
    '심사 중':    'text-amber-400 bg-amber-500/10 border-amber-500/20',
    '심사 완료':  'text-teal-400 bg-teal-500/10 border-teal-500/20',
    '수상':       'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  }
  return map[status] || map['심사 전']
}

const priorityClass = (p) => {
  if (p === 'High') return 'text-red-400 border-red-400/30 bg-red-400/10'
  if (p === 'Medium') return 'text-amber-400 border-amber-400/30 bg-amber-400/10'
  return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
}

const docIcon = (type) => {
  const m = { '기획서': '📋', '발표자료': '📊', '디자인': '🎨', '영상': '🎬' }
  return m[type] || '📄'
}

const rewardTotal = (submission) => {
  return getSubmissionRewardTotal(submission)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

    <!-- Header -->
    <div class="flex flex-col gap-4 border-b border-sync-border pb-8">
      <RouterLink to="/admin" class="text-sync-muted hover:text-sync-text transition-colors text-sm font-bold flex items-center gap-1 w-max">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        대시보드로 돌아가기
      </RouterLink>

      <div v-if="targetHackathon" class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div class="flex flex-col gap-2">
          <span class="px-3 py-1 rounded-full w-max text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 uppercase tracking-widest">제출 자료 관리</span>
          <h1 class="text-3xl lg:text-4xl font-outfit font-black tracking-tight text-sync-text mt-1">{{ targetHackathon.title }}</h1>
          <p class="text-sync-muted text-sm font-medium">총 <span class="font-bold text-sync-text">{{ submissions.length }}팀</span>이 최종 개발물을 제출했습니다.</p>
        </div>
        <!-- Summary Stat Pills -->
        <div class="flex gap-3 flex-wrap shrink-0">
          <div class="flex flex-col items-center px-5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border min-w-[80px]">
            <span class="text-2xl font-black text-sync-text">{{ submissions.length }}</span>
            <span class="text-[10px] text-sync-muted font-bold mt-0.5">전체 팀</span>
          </div>
          <div class="flex flex-col items-center px-5 py-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 min-w-[80px]">
            <span class="text-2xl font-black text-teal-400">{{ statusCounts['심사 완료'] }}</span>
            <span class="text-[10px] text-teal-500 font-bold mt-0.5">심사 완료</span>
          </div>
          <div class="flex flex-col items-center px-5 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 min-w-[80px]">
            <span class="text-2xl font-black text-yellow-500">{{ statusCounts['수상'] }}</span>
            <span class="text-[10px] text-yellow-600 font-bold mt-0.5">수상 확정</span>
          </div>
        </div>
      </div>
      <div v-else class="text-red-500">해당 해커톤을 찾을 수 없습니다.</div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="st in STATUS_OPTIONS" :key="st"
        @click="activeFilter = st"
        class="px-4 py-2 rounded-xl text-[13px] font-bold border transition-all"
        :class="activeFilter === st
          ? 'bg-sync-primary text-white border-sync-primary shadow-[0_4px_14px_rgba(50,132,255,0.3)]'
          : 'text-sync-muted border-sync-border hover:border-sync-primary/40 hover:text-sync-text bg-black/5 dark:bg-white/5'"
      >
        {{ st }}
        <span class="ml-1.5 text-[10px] opacity-70">{{ statusCounts[st] }}</span>
      </button>
    </div>

    <!-- Submissions Table -->
    <div v-if="filteredSubmissions.length > 0" class="flex flex-col gap-4">
      <div
        v-for="sub in filteredSubmissions" :key="sub.id"
        class="glass-card p-6 md:p-7 rounded-[2rem] border border-sync-border hover:border-sync-primary/40 transition-all group cursor-pointer shadow-sm hover:shadow-md"
        @click="openDrawer(sub)"
      >
        <div class="flex flex-col md:flex-row gap-6 items-start">

          <!-- Left: Team + Project -->
          <div class="flex-1 flex flex-col gap-4 min-w-0">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-xl shadow-inner shrink-0">🏆</div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-bold text-sync-text group-hover:text-sync-primary transition-colors truncate">{{ sub.teamName }}</h3>
                  <span v-if="sub.award" class="px-2 py-0.5 rounded-lg bg-yellow-500 text-white text-[10px] font-black uppercase tracking-tighter shadow-sm animate-pulse">WINNER</span>
                </div>
                <span class="text-xs text-sync-muted font-bold">제출일: {{ sub.submittedAt }}</span>
              </div>
            </div>

            <div class="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-sync-border">
              <h4 class="font-bold text-base text-sync-primary mb-2">{{ sub.projectName }}</h4>
              <p class="text-sm text-sync-muted leading-relaxed line-clamp-2">{{ sub.description }}</p>
            </div>

            <!-- Members preview -->
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <img v-for="m in (sub.members || []).slice(0,4)" :key="m.nickname" :src="m.avatar" class="w-7 h-7 rounded-full border-2 border-white dark:border-[#0A0A0A] shadow-sm" :title="m.nickname" />
              </div>
              <span class="text-xs text-sync-muted font-medium">{{ (sub.members || []).length }}명 참여</span>
            </div>
          </div>

          <!-- Right: Status / Links / Files preview -->
            <div class="w-full md:w-56 flex flex-col gap-4 shrink-0">
            <!-- Status Badge -->
            <div class="flex flex-col gap-2">
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">진행 상태</span>
              <div class="flex items-center gap-2">
                <span class="w-max px-3 py-1.5 rounded-full text-[11px] font-bold border" :class="statusClass(sub.status || '심사 전')">{{ sub.status || '심사 전' }}</span>
                <span v-if="sub.award" class="text-xs font-bold text-yellow-500">🏆 {{ sub.award }}</span>
              </div>
            </div>

            <!-- Score if available -->
            <div v-if="sub.score" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">심사 총점</span>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full" :style="{ width: sub.score + '%' }"></div>
                </div>
                <span class="text-sm font-black text-sync-text">{{ sub.score }}</span>
              </div>
            </div>

            <div v-if="rewardTotal(sub)" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">지급 포인트</span>
              <span class="text-sm font-black text-sync-primary">{{ rewardTotal(sub).toLocaleString() }} PTS</span>
            </div>

            <!-- Repo Links -->
            <div class="flex flex-col gap-1.5">
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">저장소</span>
              <a v-for="(link, i) in sub.links" :key="i" :href="link" target="_blank" @click.stop class="text-xs font-bold text-sync-text hover:text-sync-primary transition-colors flex items-center gap-1.5 truncate">
                <svg class="w-3.5 h-3.5 text-sync-muted shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span class="truncate">{{ link.replace('https://', '') }}</span>
              </a>
            </div>

            <div class="mt-auto flex items-center gap-1.5 text-sync-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              자세히 보기
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-else class="py-24 text-center flex flex-col items-center justify-center gap-4 bg-black/5 dark:bg-white/5 rounded-[2rem] border border-sync-border">
      <span class="text-5xl">📭</span>
      <p class="text-sync-muted text-sm font-bold">해당 상태의 제출 내역이 없습니다.</p>
    </div>

  </div>

  <!-- ═══════════ Detail Drawer ═══════════ -->
  <Teleport to="body">
    <div v-if="selectedSub" class="fixed inset-0 z-[200] flex" @click.self="closeDrawer">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDrawer"></div>

      <!-- Panel slides in from right -->
      <div class="relative ml-auto w-full max-w-[700px] h-full bg-white dark:bg-[#0D0F14] border-l border-sync-border shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">

        <!-- Panel Header -->
        <div class="flex items-center justify-between px-8 py-5 border-b border-sync-border bg-black/5 dark:bg-white/5 shrink-0">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-xl shrink-0">🏆</div>
            <div class="min-w-0">
              <h2 class="text-xl font-black text-sync-text truncate">{{ selectedSub.teamName }}</h2>
              <div class="flex items-center gap-2">
                <span class="text-xs text-sync-muted font-bold">제출일: {{ selectedSub.submittedAt }}</span>
                <span class="text-xs text-sync-muted">•</span>
                <RouterLink :to="`/workspace/${selectedSub.teamId || selectedSub.id}`" class="text-xs font-bold text-sync-primary hover:underline">팀 워크스페이스 방문</RouterLink>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="px-3 py-1.5 rounded-full text-[11px] font-bold border" :class="statusClass(selectedSub.status || '심사 전')">{{ selectedSub.status || '심사 전' }}</span>
            <button @click="closeDrawer" class="p-2 text-sync-muted hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Panel Body (scrollable) -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 flex flex-col gap-10">

          <!-- 1. Project Overview -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">📁 프로젝트 개요</h3>
            <div class="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border">
              <h4 class="text-lg font-black text-sync-primary mb-3">{{ selectedSub.projectName }}</h4>
              <p class="text-sm text-sync-muted leading-relaxed whitespace-pre-line">{{ selectedSub.description }}</p>
            </div>
            <!-- Links -->
            <div class="flex flex-col gap-2">
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">저장소 링크</span>
              <a v-for="(link, i) in selectedSub.links" :key="i" :href="link" target="_blank"
                 class="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border hover:border-sync-primary/40 transition-colors text-sm font-bold text-sync-text hover:text-sync-primary">
                <svg class="w-4 h-4 text-sync-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                {{ link }}
              </a>
            </div>
          </section>

          <!-- 5. Files with Preview/Download -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">📎 첨부 파일 (클릭하여 미리보기)</h3>
            <div class="flex flex-col gap-2">
              <div v-for="(file, i) in (selectedSub.files || [])" :key="i"
                  class="w-full flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors group/file cursor-pointer"
                  @click="openPreview(file)">
                <div class="flex items-center gap-3 min-w-0">
                  <svg class="w-4 h-4 text-sync-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-sync-text truncate">{{ file.name }}</p>
                    <p class="text-[10px] text-sync-muted">{{ file.type }} · {{ file.size }}</p>
                  </div>
                </div>
                <!-- Download button inside the item -->
                <button @click.stop="downloadFile(file)" class="p-2 rounded-lg bg-black/5 dark:bg-white/10 opacity-0 group-hover/file:opacity-100 hover:bg-sync-primary/10 hover:text-sync-primary transition-all">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              </div>
              <div v-if="!(selectedSub.files || []).length" class="text-sm text-sync-muted px-2">첨부 파일 없음</div>
            </div>
          </section>

          <!-- 6. Detailed Admin Review Section -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">⭐ 어드민 심사 영역 (체점 항목표)</h3>
            
            <!-- Result View -->
            <div v-if="selectedSub.score && !editingReview" class="flex flex-col gap-6">
              <!-- Summary Award -->
              <div v-if="selectedSub.award" class="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex flex-col gap-1">
                <span class="text-[10px] font-black text-yellow-600 uppercase tracking-widest">최종 수상 결과</span>
                <span class="text-xl font-black text-yellow-500">🏆 {{ selectedSub.award }}</span>
              </div>

              <div v-if="rewardTotal(selectedSub)" class="p-5 rounded-2xl bg-sync-primary/5 border border-sync-primary/20 flex flex-col gap-4">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-[10px] font-black text-sync-primary uppercase tracking-widest">심사 보상 지급</span>
                    <span class="text-2xl font-black text-sync-text">{{ rewardTotal(selectedSub).toLocaleString() }} PTS</span>
                  </div>
                  <span class="text-[11px] font-bold text-sync-muted">{{ selectedSub.reviewedAt }}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="reward in selectedSub.rewardDistribution"
                    :key="reward.userId"
                    class="rounded-xl border border-sync-border bg-black/5 dark:bg-white/5 px-4 py-3"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-bold text-sync-text truncate">{{ reward.nickname }}</span>
                      <span class="text-sm font-black text-sync-primary">{{ reward.total.toLocaleString() }} PTS</span>
                    </div>
                    <p class="text-[11px] font-medium text-sync-muted mt-1">{{ reward.breakdown.join(' · ') }}</p>
                  </div>
                </div>
              </div>

              <!-- Overall Score -->
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-sync-muted">심사 총점</span>
                  <span class="text-3xl font-black text-sync-text">{{ selectedSub.score }}</span>
                  <span class="text-sync-muted font-bold">/ 100</span>
                </div>
                <div class="flex-1 h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full transition-all" :style="{ width: selectedSub.score + '%' }"></div>
                </div>
              </div>

              <!-- Detailed Scores -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="(score, name) in selectedSub.detailedScores" :key="name" 
                     class="flex flex-col gap-1 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border">
                  <span class="text-[10px] font-bold text-sync-muted uppercase">{{ name }}</span>
                  <span class="text-lg font-black text-sync-text">{{ score }} 점</span>
                </div>
              </div>

              <div v-if="selectedSub.review" class="p-5 rounded-2xl bg-teal-500/5 border border-teal-500/20">
                <span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1 block">심사 총평</span>
                <p class="text-sm text-sync-text leading-relaxed font-medium">{{ selectedSub.review }}</p>
              </div>

              <button @click="startReview(selectedSub)" class="w-max text-xs font-bold text-sync-muted hover:text-sync-primary transition-colors underline underline-offset-4">
                심사 내용 및 수상 수정
              </button>
            </div>

            <!-- Detailed Edit Form -->
            <div v-else-if="editingReview" class="flex flex-col gap-6 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border">
              <!-- Scoring Criteria Inputs -->
              <div class="flex flex-col gap-4">
                <label class="text-xs font-black text-sync-text uppercase tracking-widest border-l-4 border-sync-primary pl-3">항목별 채점표</label>
                <div v-for="c in targetHackathon.scoringCriteria" :key="c.name" class="flex flex-col gap-2">
                  <div class="flex justify-between items-end">
                    <label class="text-xs font-bold text-sync-muted">{{ c.name }} <span class="opacity-50">(비중 {{ c.weight }}%)</span></label>
                    <span class="text-sm font-black text-sync-primary">{{ detailedScoresDraft[c.name] || 0 }} / 100</span>
                  </div>
                  <input v-model.number="detailedScoresDraft[c.name]" type="range" min="0" max="100" class="w-full accent-sync-primary" />
                </div>
              </div>

              <!-- Award Selection -->
              <div class="flex flex-col gap-2">
                <label class="text-xs font-black text-sync-text uppercase tracking-widest border-l-4 border-yellow-500 pl-3">수상 팀 선정</label>
                <select v-model="awardDraft" class="w-full bg-black/5 dark:bg-white/10 border border-sync-border rounded-xl p-3 text-sm font-bold text-sync-text outline-none focus:border-sync-primary appearance-none">
                  <option value="">적용 안 함 (수상 제외)</option>
                  <option v-for="p in targetHackathon.prizes" :key="p.rank" :value="p.rank">{{ p.rank }} ({{ p.reward }})</option>
                </select>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs font-black text-sync-text uppercase tracking-widest border-l-4 border-sync-muted pl-3">심사 총평</label>
                <textarea v-model="reviewDraft" rows="4" placeholder="팀의 프로젝트에 대한 가감 없는 심사 의견을 작성하세요..."
                          class="w-full bg-black/5 dark:bg-white/10 border border-sync-border rounded-xl p-4 text-sm text-sync-text outline-none focus:border-sync-primary custom-scrollbar resize-none"></textarea>
              </div>

              <div class="flex gap-3 pt-4 border-t border-sync-border">
                <button @click="saveReview(selectedSub)" class="px-6 py-3 bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">심사 결과 적용</button>
                <button @click="editingReview = false" class="px-6 py-3 text-sync-muted border border-sync-border rounded-xl text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all">취소</button>
              </div>
            </div>

            <!-- No review yet -->
            <div v-else class="flex flex-col gap-4">
              <p class="text-sm text-sync-muted font-medium">아직 상세요건 심사 및 수상 여부가 결정되지 않았습니다.</p>
              <button @click="startReview(selectedSub)" class="w-max px-8 py-3 bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold rounded-2xl transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5 font-outfit uppercase tracking-wider">
                Begin Final Evaluation
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══════════ File Preview Modal ═══════════ -->
  <Teleport to="body">
    <div v-if="previewFile" class="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-10">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="closePreview"></div>
      
      <div class="relative w-full max-w-5xl h-full flex flex-col bg-[#0D0F14] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-fade-in-scale">
        <!-- Preview Header -->
        <div class="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-white/5">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ docIcon(previewFile.type) }}</span>
            <div>
              <p class="text-sm font-black text-white">{{ previewFile.name }}</p>
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ previewFile.type }} · {{ previewFile.size }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="downloadFile(previewFile)" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-sync-primary text-white text-xs font-bold hover:bg-sync-primaryHover transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              다운로드
            </button>
            <button @click="closePreview" class="p-2 text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Preview Body (Placeholder) -->
        <div class="flex-1 flex items-center justify-center bg-[#07080A] relative overflow-hidden group">
          <!-- Placeholder Mock -->
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 opacity-40">
             <div class="w-64 h-80 rounded-lg bg-white/5 border border-white/10 flex flex-col p-6 gap-4">
                <div class="w-full h-4 bg-white/20 rounded"></div>
                <div class="w-3/4 h-4 bg-white/10 rounded"></div>
                <div class="w-full h-32 bg-white/5 rounded-xl mt-4"></div>
                <div class="grid grid-cols-2 gap-2 mt-auto">
                   <div class="h-8 bg-white/10 rounded"></div>
                   <div class="h-8 bg-white/10 rounded"></div>
                </div>
             </div>
             <p class="text-white text-sm font-bold animate-pulse">프리뷰 렌더링 중...</p>
          </div>
          
          <!-- Type Specific Mockups -->
          <div v-if="previewFile.type === '영상'" class="z-10 flex flex-col items-center gap-4">
             <div class="w-20 h-20 rounded-full bg-sync-primary/20 border border-sync-primary/40 flex items-center justify-center text-sync-primary animate-pulse cursor-pointer hover:scale-110 transition-transform">
                <svg class="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             </div>
             <span class="text-xs font-bold text-gray-500">동영상 플레이어 미리보기</span>
          </div>
          <div v-else-if="previewFile.type === '발표자료' || previewFile.type === '기획서'" class="z-10 flex flex-col items-center gap-4">
             <div class="w-[80%] aspect-[16/9] bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col gap-6 shadow-2xl">
                <div class="h-8 bg-sync-primary/20 w-1/3 rounded"></div>
                <div class="h-4 bg-white/10 w-full rounded"></div>
                <div class="h-4 bg-white/10 w-full rounded"></div>
                <div class="h-4 bg-white/10 w-2/3 rounded"></div>
                <div class="mt-auto grid grid-cols-3 gap-6">
                   <div class="aspect-square bg-white/5 rounded-xl border border-white/10"></div>
                   <div class="aspect-square bg-white/5 rounded-xl border border-white/10"></div>
                   <div class="aspect-square bg-white/5 rounded-xl border border-white/10"></div>
                </div>
             </div>
             <span class="text-xs font-bold text-gray-500">문서 뷰어 미리보기 ({{ previewFile.name }})</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes fade-in-scale {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-fade-in-scale {
  animation: fade-in-scale 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

input[type="range"] {
  -webkit-appearance: none;
  height: 6px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3284FF;
  cursor: pointer;
  border: 3px solid rgba(50, 132, 255, 0.3);
  transition: all 0.2s;
}
input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(50, 132, 255, 0.5);
}
</style>
