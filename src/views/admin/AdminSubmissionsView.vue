<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { mockHackathons, mockGlobalSubmissions } from '../../data/mockData'
import { useAuthStore } from '../../stores/auth'

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
const openDrawer = (sub) => { selectedSub.value = sub }
const closeDrawer = () => { selectedSub.value = null }

// ─── Review Edit ─────────────────────────────────────────
const editingReview = ref(false)
const reviewDraft = ref('')
const scoreDraft = ref(0)

const startReview = (sub) => {
  reviewDraft.value = sub.review || ''
  scoreDraft.value = sub.score || 0
  editingReview.value = true
}
const saveReview = (sub) => {
  sub.review = reviewDraft.value
  sub.score = scoreDraft.value
  sub.status = '심사 완료'
  editingReview.value = false
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
          <div class="flex flex-col items-center px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 min-w-[80px]">
            <span class="text-2xl font-black text-amber-400">{{ statusCounts['심사 중'] }}</span>
            <span class="text-[10px] text-amber-500 font-bold mt-0.5">심사 중</span>
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
                <h3 class="text-xl font-bold text-sync-text group-hover:text-sync-primary transition-colors truncate">{{ sub.teamName }}</h3>
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
              <span class="w-max px-3 py-1.5 rounded-full text-[11px] font-bold border" :class="statusClass(sub.status || '심사 전')">{{ sub.status || '심사 전' }}</span>
            </div>

            <!-- Score if available -->
            <div v-if="sub.score" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">심사 점수</span>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full" :style="{ width: sub.score + '%' }"></div>
                </div>
                <span class="text-sm font-black text-sync-text">{{ sub.score }}</span>
              </div>
            </div>

            <!-- Repo Links -->
            <div class="flex flex-col gap-1.5">
              <span class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">저장소</span>
              <a v-for="(link, i) in sub.links" :key="i" :href="link" target="_blank" @click.stop class="text-xs font-bold text-sync-text hover:text-sync-primary transition-colors flex items-center gap-1.5 truncate">
                <svg class="w-3.5 h-3.5 text-sync-muted shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span class="truncate">{{ link.replace('https://', '') }}</span>
              </a>
            </div>

            <!-- Files count -->
            <div class="flex items-center gap-2 text-xs text-sync-muted font-medium">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              첨부파일 {{ (sub.files || []).length }}개
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
              <span class="text-xs text-sync-muted font-bold">제출일: {{ selectedSub.submittedAt }}</span>
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

          <!-- 2. Team Members -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">👥 참여 팀원</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="m in (selectedSub.members || [])" :key="m.nickname"
                   class="flex items-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border">
                <img :src="m.avatar" class="w-10 h-10 rounded-full border-2 border-white dark:border-[#0D0F14] shadow-sm shrink-0" />
                <div>
                  <p class="text-sm font-bold text-sync-text">{{ m.nickname }}</p>
                  <p class="text-xs text-sync-muted font-medium mt-0.5">{{ m.role }}</p>
                </div>
              </div>
              <div v-if="!(selectedSub.members || []).length" class="text-sm text-sync-muted">팀원 정보 없음</div>
            </div>
          </section>

          <!-- 3. Tasks (Sprint Board result) -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">📋 스프린트 현황</h3>
            <div class="flex flex-col gap-2">
              <div v-for="t in (selectedSub.tasks || [])" :key="t.title"
                   class="flex items-center justify-between px-4 py-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="w-5 h-5 rounded flex items-center justify-center text-[10px] flex-shrink-0"
                        :class="t.status === 'Done' ? 'bg-teal-500/10 text-teal-400' : 'bg-amber-500/10 text-amber-400'">
                    {{ t.status === 'Done' ? '✓' : '…' }}
                  </span>
                  <span class="text-sm font-bold text-sync-text" :class="t.status === 'Done' ? 'line-through text-sync-muted' : ''">{{ t.title }}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded border" :class="priorityClass(t.priority)">{{ t.priority }}</span>
                  <span class="text-[10px] text-sync-muted font-medium">{{ t.assignee }}</span>
                </div>
              </div>
              <div v-if="!(selectedSub.tasks || []).length" class="text-sm text-sync-muted px-2">태스크 정보 없음</div>
            </div>
          </section>

          <!-- 4. Documents -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">📄 문서 & 기획서</h3>
            <div class="flex flex-col gap-2">
              <div v-for="doc in (selectedSub.documents || [])" :key="doc.name"
                   class="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border">
                <span class="text-xl shrink-0">{{ docIcon(doc.type) }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-sync-text truncate">{{ doc.name }}</p>
                  <p class="text-[10px] text-sync-muted mt-0.5">{{ doc.type }} · {{ doc.updated }} 업데이트</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 5. Files -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">📎 첨부 파일</h3>
            <div class="flex flex-col gap-2">
              <button v-for="(file, i) in (selectedSub.files || [])" :key="i"
                      class="w-full flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <svg class="w-4 h-4 text-sync-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-sync-text truncate">{{ file.name }}</p>
                    <p class="text-[10px] text-sync-muted">{{ file.type }}</p>
                  </div>
                </div>
                <span class="text-[10px] text-sync-muted shrink-0 ml-4 font-mono">{{ file.size }}</span>
              </button>
              <div v-if="!(selectedSub.files || []).length" class="text-sm text-sync-muted px-2">첨부 파일 없음</div>
            </div>
          </section>

          <!-- 6. Admin Review Section -->
          <section class="flex flex-col gap-4">
            <h3 class="text-xs font-bold text-sync-muted uppercase tracking-widest border-b border-sync-border pb-3">⭐ 어드민 심사 영역</h3>
            
            <!-- Score display -->
            <div v-if="selectedSub.score && !editingReview" class="flex flex-col gap-3">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-sync-muted">심사 점수</span>
                  <span class="text-3xl font-black text-sync-text">{{ selectedSub.score }}</span>
                  <span class="text-sync-muted font-bold">/ 100</span>
                </div>
                <div class="flex-1 h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full transition-all" :style="{ width: selectedSub.score + '%' }"></div>
                </div>
              </div>
              <div v-if="selectedSub.review" class="p-5 rounded-2xl bg-teal-500/5 border border-teal-500/20">
                <p class="text-sm text-sync-text leading-relaxed font-medium">{{ selectedSub.review }}</p>
              </div>
              <button @click="startReview(selectedSub)" class="w-max text-xs font-bold text-sync-muted hover:text-sync-primary transition-colors underline underline-offset-4">
                심사 내용 수정
              </button>
            </div>

            <!-- Review Edit Form -->
            <div v-else-if="editingReview" class="flex flex-col gap-4 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border">
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-sync-muted uppercase tracking-widest">심사 점수 (0-100)</label>
                <input v-model.number="scoreDraft" type="number" min="0" max="100"
                       class="w-32 bg-black/5 dark:bg-white/10 border border-sync-border rounded-xl p-3 text-lg font-black text-sync-text outline-none focus:border-sync-primary" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-sync-muted uppercase tracking-widest">심사 코멘트</label>
                <textarea v-model="reviewDraft" rows="4" placeholder="팀의 프로젝트에 대한 심사 의견을 작성하세요..."
                          class="w-full bg-black/5 dark:bg-white/10 border border-sync-border rounded-xl p-4 text-sm text-sync-text outline-none focus:border-sync-primary custom-scrollbar resize-none"></textarea>
              </div>
              <div class="flex gap-3">
                <button @click="saveReview(selectedSub)" class="px-5 py-2.5 bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)]">저장</button>
                <button @click="editingReview = false" class="px-5 py-2.5 text-sync-muted border border-sync-border rounded-xl text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all">취소</button>
              </div>
            </div>

            <!-- No review yet -->
            <div v-else class="flex flex-col gap-4">
              <p class="text-sm text-sync-muted">아직 심사가 완료되지 않았습니다.</p>
              <button @click="startReview(selectedSub)" class="w-max px-6 py-2.5 bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(50,132,255,0.3)]">
                심사 시작하기
              </button>
            </div>
          </section>

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
</style>
