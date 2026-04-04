<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockHackathons, mockTeams, mockUsers, mockGlobalSubmissions } from '../data/mockData'

const route = useRoute()
const router = useRouter()

const hackathon = computed(() => mockHackathons.find(h => String(h.id) === route.params.slug) || mockHackathons[0])
const team = computed(() => mockTeams.find(t => t.hackathonId === hackathon.value.id) || mockTeams[0])

// ─── Tab ───────────────────────────────────────────────
const activeTab = ref('board')

// ─── Sprint Board ───────────────────────────────────────
const tasks = ref([
  { id: 1, title: '웹소켓 통신 인터페이스 구축', status: 'In Progress', assignee: 'Alex_Dev', priority: 'High', due: '2026.04.10', desc: '실시간 채팅 및 협업을 위한 소켓 모듈 구현' },
  { id: 2, title: '컴포넌트 구조 설계서 작성', status: 'Done', assignee: '건축가_Kim', priority: 'High', due: '2026.04.08', desc: '프론트 아키텍처 문서화' },
  { id: 3, title: '메인 랜딩페이지 퍼블리싱', status: 'To Do', assignee: 'Web3_Ninja', priority: 'Medium', due: '2026.04.12', desc: '디자인 시안 기반 반응형 퍼블리싱' }
])

const STATUSES = ['To Do', 'In Progress', 'Done']

// Task modal
const isTaskModalOpen = ref(false)
const editingTask = ref(null)
const taskForm = ref({ title: '', status: 'To Do', assignee: '', priority: 'Medium', due: '', desc: '' })

const openNewTask = (status = 'To Do') => {
  editingTask.value = null
  taskForm.value = { title: '', status, assignee: '', priority: 'Medium', due: '', desc: '' }
  isTaskModalOpen.value = true
}

const openEditTask = (task) => {
  editingTask.value = task
  taskForm.value = { ...task }
  isTaskModalOpen.value = true
}

const saveTask = () => {
  if (!taskForm.value.title.trim()) return
  if (editingTask.value) {
    const idx = tasks.value.findIndex(t => t.id === editingTask.value.id)
    if (idx !== -1) tasks.value[idx] = { ...taskForm.value, id: editingTask.value.id }
  } else {
    tasks.value.push({ ...taskForm.value, id: Date.now() })
  }
  isTaskModalOpen.value = false
}

const deleteTask = (id) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

const moveTaskStatus = (task, dir) => {
  const idx = STATUSES.indexOf(task.status)
  const next = STATUSES[idx + dir]
  if (next) task.status = next
}

// ─── Documents ─────────────────────────────────────────
const documents = ref([
  { id: 1, name: '서비스 기획 및 요구사항 정의서', type: '기획서', updated: '2시간 전', content: '# 서비스 기획서\n\n## 개요\n\n본 문서는 서비스의 핵심 요구사항을 정의합니다.\n\n## 주요 기능\n\n- 실시간 협업 대시보드\n- 팀 스프린트 보드\n- 문서 공동 편집\n\n## 기술 스택\n\n- Vue.js 3\n- Supabase\n- Tailwind CSS' },
  { id: 2, name: '초기 아키텍처 설계 문서', type: '디자인', updated: '1일 전', content: '# 아키텍처 설계\n\n## 시스템 구성도\n\n프론트엔드 → API Gateway → Supabase\n\n## 컴포넌트 구조\n\n- NavBar\n- WorkspaceView\n- SprintBoard\n- DocEditor' }
])

const isEditorOpen = ref(false)
const isNewDocModalOpen = ref(false)
const newDocName = ref('')
const currentDoc = ref(null)
const editorContent = ref('')
const isSaved = ref(true)

const openEditor = (doc) => {
  currentDoc.value = doc
  editorContent.value = doc.content || ''
  isSaved.value = true
  isEditorOpen.value = true
}

const openNewDocModal = () => {
  newDocName.value = ''
  isNewDocModalOpen.value = true
}

const createNewDoc = () => {
  if (!newDocName.value.trim()) return
  const doc = { id: Date.now(), name: newDocName.value.trim(), type: '문서', updated: '방금 전', content: `# ${newDocName.value.trim()}\n\n내용을 작성하세요.` }
  documents.value.unshift(doc)
  isNewDocModalOpen.value = false
  openEditor(doc)
}

const saveDoc = () => {
  if (currentDoc.value) {
    const idx = documents.value.findIndex(d => d.id === currentDoc.value.id)
    if (idx !== -1) {
      documents.value[idx].content = editorContent.value
      documents.value[idx].updated = '방금 전'
    }
    isSaved.value = true
  }
}

const onEditorInput = () => { isSaved.value = false }

const insertFormat = (prefix, suffix = '') => {
  const ta = document.getElementById('doc-editor-textarea')
  if (!ta) return
  const start = ta.selectionStart, end = ta.selectionEnd
  const sel = editorContent.value.slice(start, end)
  editorContent.value = editorContent.value.slice(0, start) + prefix + sel + suffix + editorContent.value.slice(end)
  isSaved.value = false
  setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, end + prefix.length) }, 0)
}

const deleteDocument = (id) => {
  if (confirm('정말 이 문서를 삭제하시겠습니까?')) {
    documents.value = documents.value.filter(d => d.id !== id)
  }
}

// Upload modal
const isUploadModalOpen = ref(false)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadedFile = ref(null)

const handleDrop = (e) => {
  e.preventDefault(); isDragging.value = false
  if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0])
}
const handleFileSelect = (e) => { if (e.target.files?.length) processFile(e.target.files[0]) }
const processFile = (file) => {
  uploadedFile.value = file; isUploading.value = true
  let p = 0
  const iv = setInterval(() => {
    p += 10; uploadProgress.value = p
    if (p >= 100) { clearInterval(iv); setTimeout(completeUpload, 500) }
  }, 150)
}
const completeUpload = () => {
  if (uploadedFile.value) {
    const ext = uploadedFile.value.name.split('.').pop().toLowerCase()
    const type = ext === 'pdf' ? '기획서' : ['fig','png','jpg'].includes(ext) ? '디자인' : '문서'
    documents.value.unshift({ id: Date.now(), name: uploadedFile.value.name, type, updated: '방금 전', content: '' })
  }
  isUploadModalOpen.value = false; isUploading.value = false; uploadProgress.value = 0; uploadedFile.value = null
}

// Final submit
const isSubmitModalOpen = ref(false)
const submitForm = ref({ projectName: '', description: '', link: '', selectedDocs: [] })
const openSubmitModal = () => { submitForm.value = { projectName: '', description: '', link: '', selectedDocs: [] }; isSubmitModalOpen.value = true }
const handleFinalSubmit = () => {
  if (!submitForm.value.projectName || !submitForm.value.description) { alert('프로젝트 명과 상세 설명을 입력해주세요.'); return }
  mockGlobalSubmissions.push({ id: Date.now(), hackathonId: hackathon.value.id, teamId: team.value.id, teamName: team.value.teamName, projectName: submitForm.value.projectName, description: submitForm.value.description, submittedAt: new Date().toLocaleDateString('ko-KR'), links: [submitForm.value.link].filter(Boolean), files: [] })
  alert('최종 제출이 완료되었습니다!'); isSubmitModalOpen.value = false
}

const docTypeIcon = (type) => type === '기획서' ? '📄' : type === '디자인' ? '🎨' : '📝'
const priorityClass = (p) => p === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : p === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
const statusClass = (s) => s === 'In Progress' ? 'text-teal-500 bg-teal-500/10 border-teal-500/20' : s === 'Done' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : 'text-sync-muted bg-black/10 dark:bg-white/10 border-sync-border'
</script>

<template>
  <div class="max-w-[1240px] mx-auto px-4 py-8 animate-fade-in min-h-[calc(100vh-4rem)]">

    <!-- Header -->
    <button @click="router.push('/mypage')" class="text-xs font-bold text-sync-muted hover:text-sync-text mb-6 flex items-center gap-2 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
      돌아가기
    </button>

    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-outfit font-black text-sync-text">{{ team.teamName }} <span class="text-xl text-sync-muted font-medium ml-2">Workspace</span></h1>
        <p class="text-sm font-medium text-sync-muted mt-2 border border-sync-border px-3 py-1 rounded bg-black/5 dark:bg-white/5 inline-block">{{ hackathon.title }} 전용 협업 공간</p>
      </div>
      <button @click="openSubmitModal" class="px-5 py-2.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-xs font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
        🚀 최종 제출
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-sync-border mb-6">
      <button @click="activeTab = 'board'" class="px-5 py-3 text-[13px] font-bold border-b-2 transition-all" :class="activeTab==='board' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">📋 스프린트 보드</button>
      <button @click="activeTab = 'docs'" class="px-5 py-3 text-[13px] font-bold border-b-2 transition-all" :class="activeTab==='docs' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">📄 문서 & 기획서</button>
      <button @click="activeTab = 'members'" class="px-5 py-3 text-[13px] font-bold border-b-2 transition-all" :class="activeTab==='members' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">👥 팀원</button>
    </div>

    <!-- ── TAB 1: Sprint Board ── -->
    <div v-if="activeTab === 'board'" class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="status in STATUSES" :key="status" class="flex flex-col gap-3">
          <!-- Column Header -->
          <div class="flex items-center justify-between px-1 mb-1">
            <span class="text-[11px] font-bold uppercase tracking-widest" :class="status==='In Progress' ? 'text-teal-500' : 'text-sync-muted'">{{ status }}</span>
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold" :class="status==='In Progress' ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20' : 'bg-black/10 dark:bg-white/10 text-sync-muted'">{{ tasks.filter(t=>t.status===status).length }}</span>
              <button @click="openNewTask(status)" class="w-5 h-5 rounded flex items-center justify-center text-sync-muted hover:text-sync-primary hover:bg-sync-primary/10 transition-colors text-lg font-bold leading-none" title="태스크 추가">+</button>
            </div>
          </div>

          <!-- Task Cards -->
          <div v-for="t in tasks.filter(t=>t.status===status)" :key="t.id"
               class="p-4 rounded-2xl border transition-all group cursor-pointer"
               :class="status==='In Progress' ? 'bg-teal-50 dark:bg-teal-500/5 border-teal-500/30 hover:border-teal-500/60 shadow-[0_4px_16px_rgba(20,184,166,0.06)]' : status==='Done' ? 'bg-black/5 dark:bg-white/5 border-sync-border opacity-60' : 'bg-black/5 dark:bg-white/5 border-sync-border hover:border-sync-primary/40'"
               @click="openEditTask(t)">
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold border" :class="priorityClass(t.priority)">{{ t.priority }}</span>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
                <button v-if="STATUSES.indexOf(t.status)>0" @click="moveTaskStatus(t,-1)" class="w-5 h-5 flex items-center justify-center text-sync-muted hover:text-sync-primary text-xs rounded hover:bg-sync-primary/10 transition-colors" title="이전 상태">◀</button>
                <button v-if="STATUSES.indexOf(t.status)<STATUSES.length-1" @click="moveTaskStatus(t,1)" class="w-5 h-5 flex items-center justify-center text-sync-muted hover:text-teal-500 text-xs rounded hover:bg-teal-500/10 transition-colors" title="다음 상태">▶</button>
                <button @click="deleteTask(t.id)" class="w-5 h-5 flex items-center justify-center text-sync-muted hover:text-red-500 text-xs rounded hover:bg-red-500/10 transition-colors" title="삭제">✕</button>
              </div>
            </div>
            <p class="text-sm font-bold text-sync-text mt-2 leading-snug" :class="status==='Done' ? 'line-through' : ''">{{ t.title }}</p>
            <p v-if="t.desc" class="text-[11px] text-sync-muted mt-1 line-clamp-2">{{ t.desc }}</p>
            <div class="mt-3 flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 border border-sync-border flex items-center justify-center text-[8px] font-bold">{{ t.assignee[0] }}</div>
                <span class="text-[10px] text-sync-muted font-bold">{{ t.assignee }}</span>
              </div>
              <span v-if="t.due" class="text-[10px] text-sync-muted">{{ t.due }}</span>
            </div>
          </div>

          <!-- Add Task Button (empty state) -->
          <button v-if="tasks.filter(t=>t.status===status).length===0" @click="openNewTask(status)" class="w-full py-6 rounded-2xl border-2 border-dashed border-sync-border hover:border-sync-primary/50 text-sync-muted hover:text-sync-primary text-xs font-bold transition-all hover:bg-sync-primary/5">
            + 태스크 추가
          </button>
        </div>
      </div>
    </div>

    <!-- ── TAB 2: Documents ── -->
    <div v-if="activeTab === 'docs'" class="animate-fade-in">
      <div class="flex justify-between items-center mb-5">
        <p class="text-sm text-sync-muted font-medium">팀 기획서 및 문서를 공동으로 작성하고 관리합니다.</p>
        <div class="flex gap-2">
          <button @click="isUploadModalOpen=true" class="px-4 py-2 rounded-xl border border-sync-border text-xs font-bold text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            파일 업로드
          </button>
          <button @click="openNewDocModal" class="px-4 py-2 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-xs font-bold shadow-[0_4px_14px_rgba(50,132,255,0.25)] hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            새 문서 작성
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="doc in documents" :key="doc.id"
             class="glass-card p-5 rounded-2xl border border-sync-border hover:border-sync-primary/40 transition-all group cursor-pointer"
             @click="openEditor(doc)">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{{ docTypeIcon(doc.type) }}</span>
              <div class="min-w-0">
                <p class="text-sm font-bold text-sync-text truncate group-hover:text-sync-primary transition-colors">{{ doc.name }}</p>
                <p class="text-[11px] text-sync-muted mt-0.5">{{ doc.updated }} 업데이트 · {{ doc.type }}</p>
              </div>
            </div>
            <button @click.stop="deleteDocument(doc.id)" class="w-7 h-7 flex-shrink-0 flex items-center justify-center text-sync-muted hover:text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
          <div class="mt-3 text-[11px] text-sync-muted line-clamp-2 font-mono bg-black/5 dark:bg-white/5 rounded-lg p-2">{{ (doc.content || '').slice(0,100) }}<span v-if="(doc.content||'').length>100">...</span></div>
        </div>

        <!-- Empty state -->
        <div v-if="documents.length===0" class="col-span-2 py-20 text-center border-2 border-dashed border-sync-border rounded-2xl">
          <span class="text-4xl block mb-3">📂</span>
          <p class="text-sync-muted text-sm font-bold">문서가 없습니다. 새 문서를 작성하거나 파일을 업로드하세요.</p>
        </div>
      </div>
    </div>

    <!-- ── TAB 3: Members ── -->
    <div v-if="activeTab === 'members'" class="animate-fade-in max-w-xl">
      <div class="glass-card p-6 rounded-2xl border border-sync-border">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-lg font-bold text-sync-text">팀 멤버 ({{ mockUsers.length }}명)</h2>
          <span class="text-sync-muted">👥</span>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="user in mockUsers" :key="user.id"
               class="flex items-center gap-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border hover:border-sync-primary/40 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer group"
               @click="router.push(`/user/${user.id}`)">
            <img :src="user.avatar" class="w-11 h-11 rounded-full border border-sync-border bg-white group-hover:scale-105 transition-transform flex-shrink-0" alt=""/>
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-sm font-bold text-sync-text group-hover:text-sync-primary transition-colors truncate">{{ user.nickname }}</span>
              <span class="text-[11px] text-sync-muted font-medium truncate">{{ user.role }}</span>
            </div>
            <svg class="w-4 h-4 text-sync-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- ══ Task Modal ══ -->
  <Teleport to="body">
    <div v-if="isTaskModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isTaskModalOpen=false"/>
      <div class="glass-card relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in flex flex-col gap-5">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-sync-text">{{ editingTask ? '태스크 수정' : '새 태스크 추가' }}</h3>
          <button @click="isTaskModalOpen=false" class="text-sync-muted hover:text-sync-text transition-colors p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">제목 *</label>
            <input v-model="taskForm.title" type="text" placeholder="태스크 제목을 입력하세요" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">설명</label>
            <textarea v-model="taskForm.desc" rows="2" placeholder="상세 설명 (선택)" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all resize-none custom-scrollbar"/>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">상태</label>
              <div class="relative">
                <select v-model="taskForm.status" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all appearance-none">
                  <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sync-muted"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">우선순위</label>
              <div class="relative">
                <select v-model="taskForm.priority" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all appearance-none">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sync-muted"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">담당자</label>
              <input v-model="taskForm.assignee" type="text" placeholder="닉네임" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">마감일</label>
              <input v-model="taskForm.due" type="text" placeholder="2026.04.15" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="isTaskModalOpen=false" class="flex-1 py-3 rounded-xl border border-sync-border text-sync-muted hover:text-sync-text text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">취소</button>
          <button @click="saveTask" class="flex-1 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all">저장하기</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ Document Editor Modal ══ -->
  <Teleport to="body">
    <div v-if="isEditorOpen" class="fixed inset-0 z-[100] flex flex-col">
      <div class="flex-1 bg-white dark:bg-[#0A0A0A] flex flex-col overflow-hidden">

        <!-- Editor Navbar -->
        <div class="flex items-center justify-between px-6 py-3 border-b border-sync-border bg-black/5 dark:bg-white/5 flex-shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <span class="text-xl flex-shrink-0">{{ docTypeIcon(currentDoc?.type) }}</span>
            <h3 class="font-bold text-sync-text truncate">{{ currentDoc?.name }}</h3>
            <span class="text-[10px] px-2 py-0.5 rounded-full border transition-colors flex-shrink-0" :class="isSaved ? 'text-teal-500 border-teal-500/30 bg-teal-500/10' : 'text-amber-500 border-amber-500/30 bg-amber-500/10'">{{ isSaved ? '✓ 저장됨' : '● 미저장' }}</span>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="saveDoc" class="px-4 py-2 bg-sync-primary hover:bg-sync-primaryHover text-white text-xs font-bold rounded-xl shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              저장
            </button>
            <button @click="isEditorOpen=false" class="p-2 text-sync-muted hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Formatting Toolbar -->
        <div class="flex items-center gap-1 px-6 py-2 border-b border-sync-border bg-black/[0.02] dark:bg-white/[0.02] flex-shrink-0 overflow-x-auto custom-scrollbar">
          <button @click="insertFormat('**','**')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-bold" title="굵게">B</button>
          <button @click="insertFormat('*','*')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm italic" title="기울임">I</button>
          <button @click="insertFormat('~~','~~')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm line-through" title="취소선">S</button>
          <div class="w-px h-5 bg-sync-border mx-1 flex-shrink-0"/>
          <button @click="insertFormat('# ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold" title="제목 1">H1</button>
          <button @click="insertFormat('## ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold" title="제목 2">H2</button>
          <button @click="insertFormat('### ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold" title="제목 3">H3</button>
          <div class="w-px h-5 bg-sync-border mx-1 flex-shrink-0"/>
          <button @click="insertFormat('- ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm" title="목록">≡</button>
          <button @click="insertFormat('> ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm" title="인용">❝</button>
          <button @click="insertFormat('`','`')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-mono" title="인라인 코드">&lt;/&gt;</button>
          <button @click="insertFormat('\n```\n','\n```')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-mono" title="코드 블록">{ }</button>
          <div class="w-px h-5 bg-sync-border mx-1 flex-shrink-0"/>
          <button @click="insertFormat('---\n')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs" title="구분선">——</button>
          <div class="ml-auto flex items-center gap-2 text-[11px] text-sync-muted flex-shrink-0">
            <span>{{ (editorContent||'').length.toLocaleString() }} 자</span>
          </div>
        </div>

        <!-- Editor Body -->
        <div class="flex-1 overflow-hidden flex">
          <textarea
            id="doc-editor-textarea"
            v-model="editorContent"
            @input="onEditorInput"
            class="flex-1 w-full p-8 text-sm text-sync-text bg-transparent outline-none resize-none font-mono leading-relaxed custom-scrollbar"
            placeholder="내용을 작성하세요. 마크다운 문법을 지원합니다&#10;&#10;예시:&#10;# 제목&#10;## 소제목&#10;**굵게** *기울임*&#10;- 항목1&#10;- 항목2"
            spellcheck="false"
          />
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ New Doc Name Modal ══ -->
  <Teleport to="body">
    <div v-if="isNewDocModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isNewDocModalOpen=false"/>
      <div class="glass-card relative w-full max-w-sm bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in">
        <h3 class="text-xl font-bold text-sync-text mb-5">새 문서 이름 입력</h3>
        <input v-model="newDocName" type="text" placeholder="예: 기능 명세서 v1.0" @keyup.enter="createNewDoc"
               class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all mb-5"/>
        <div class="flex gap-3">
          <button @click="isNewDocModalOpen=false" class="flex-1 py-3 rounded-xl border border-sync-border text-sync-muted text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">취소</button>
          <button @click="createNewDoc" class="flex-1 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all">만들기</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ Upload Modal ══ -->
  <Teleport to="body">
    <div v-if="isUploadModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="!isUploading && (isUploadModalOpen=false)"/>
      <div class="glass-card relative w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-sync-text">파일 업로드</h3>
          <button v-if="!isUploading" @click="isUploadModalOpen=false" class="text-sync-muted hover:text-sync-text transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div v-if="!isUploading"
             @dragover.prevent="isDragging=true" @dragleave.prevent="isDragging=false" @drop="handleDrop"
             class="relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group"
             :class="isDragging ? 'border-sync-primary bg-sync-primary/5' : 'border-sync-border hover:border-sync-primary/50 hover:bg-black/5 dark:hover:bg-white/5'">
          <input type="file" @change="handleFileSelect" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".zip,.pdf,.jpg,.png,.fig,.doc,.docx"/>
          <div class="w-16 h-16 rounded-full bg-sync-card border border-sync-border flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">☁️</div>
          <p class="font-bold text-sync-text text-center">클릭하거나 파일을 드래그 앤 드롭</p>
          <p class="text-xs text-sync-muted mt-2">최대 50MB (PDF, ZIP, FIG 등 지원)</p>
        </div>
        <div v-else class="flex flex-col items-center py-8">
          <div class="w-16 h-16 rounded-full bg-sync-primary/10 border border-sync-primary/20 flex items-center justify-center mb-6 animate-pulse"><span class="text-2xl animate-bounce">📦</span></div>
          <p class="font-bold text-sync-text mb-4">{{ uploadedFile?.name }} 업로드 중...</p>
          <div class="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border border-sync-border">
            <div class="h-full bg-sync-primary rounded-full transition-all duration-150" :style="`width:${uploadProgress}%`"/>
          </div>
          <p class="text-xs font-bold text-sync-primary mt-2">{{ uploadProgress }}%</p>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ Final Submit Modal ══ -->
  <Teleport to="body">
    <div v-if="isSubmitModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isSubmitModalOpen=false"/>
      <div class="glass-card relative w-full max-w-2xl bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center mb-6 border-b border-sync-border pb-4">
          <h3 class="text-xl font-bold text-sync-text">🚀 프로젝트 최종 제출</h3>
          <button @click="isSubmitModalOpen=false" class="text-sync-muted hover:text-sync-text transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-5">
          <p class="text-sm text-sync-muted">해커톤 주관사에게 최종 결과물을 제출합니다. 마감 기한 내에는 덮어쓰기가 가능합니다.</p>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">프로젝트 명 <span class="text-red-500">*</span></label>
            <input v-model="submitForm.projectName" type="text" placeholder="예: Decentralized Escrow Protocol" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">프로젝트 상세 설명 <span class="text-red-500">*</span></label>
            <textarea v-model="submitForm.description" rows="4" placeholder="주요 기능과 혁신성을 설명해주세요." class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all custom-scrollbar"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">저장소 링크 (Github)</label>
            <input v-model="submitForm.link" type="text" placeholder="https://github.com/..." class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">첨부 문서 선택</label>
            <div v-if="documents.length===0" class="p-4 border border-dashed border-sync-border rounded-xl text-center text-sync-muted text-sm">업로드된 문서가 없습니다.</div>
            <label v-for="doc in documents" :key="doc.id" class="flex items-center gap-3 p-3 border border-sync-border rounded-xl cursor-pointer transition-colors has-[:checked]:border-sync-primary has-[:checked]:bg-sync-primary/5 hover:bg-black/5 dark:hover:bg-white/5">
              <input type="checkbox" :value="doc.id" v-model="submitForm.selectedDocs" class="w-4 h-4 rounded text-sync-primary bg-black/10 border-sync-border focus:ring-sync-primary focus:ring-offset-0"/>
              <span class="text-xl">{{ docTypeIcon(doc.type) }}</span>
              <span class="text-sm font-bold text-sync-text truncate select-none">{{ doc.name }}</span>
            </label>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-sync-border">
          <button @click="handleFinalSubmit" class="w-full py-3.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all">주최사에게 제출하기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width:5px; height:5px; }
.custom-scrollbar::-webkit-scrollbar-track { background:transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(150,150,150,0.3); border-radius:4px; }
#doc-editor-textarea { tab-size: 2; }
</style>
