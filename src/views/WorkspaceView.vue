<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockHackathons, mockTeams, mockUsers } from '../data/mockData'

const route = useRoute()
const router = useRouter()

const hackathon = computed(() => mockHackathons.find(h => String(h.id) === route.params.slug) || mockHackathons[0])
const team = computed(() => mockTeams.find(t => t.hackathonId === hackathon.value.id) || mockTeams[0])

const tasks = ref([
  { id: 1, title: '웹소켓 통신 인터페이스 구축', status: 'In Progress', assignee: 'Alex_Dev', priority: 'High' },
  { id: 2, title: '컴포넌트 구조 설계서.pdf', status: 'Done', assignee: '건축가_Kim', priority: 'High' },
  { id: 3, title: '메인 랜딩페이지 퍼블리싱', status: 'To Do', assignee: 'Web3_Ninja', priority: 'Medium' }
])

const documents = ref([
  { id: 1, name: '서비스 기획 및 요구사항 정의서.pdf', type: '기획서', updated: '2시간 전' },
  { id: 2, name: '초기 아키텍처 디자인.fig', type: '디자인', updated: '1일 전' }
])

const isUploadModalOpen = ref(false)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadedFile = ref(null)

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processFile(e.dataTransfer.files[0])
  }
}

const handleFileSelect = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    processFile(e.target.files[0])
  }
}

const processFile = (file) => {
  uploadedFile.value = file
  isUploading.value = true
  
  // Simulate network upload progress
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    uploadProgress.value = progress
    if (progress >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        completeUpload()
      }, 500)
    }
  }, 150)
}

const completeUpload = () => {
  if (uploadedFile.value) {
    // Add to documents array
    const ext = uploadedFile.value.name.split('.').pop().toLowerCase()
    let typeIcon = '문서'
    if (ext === 'pdf') typeIcon = '기획서'
    else if (['fig', 'png', 'jpg'].includes(ext)) typeIcon = '디자인'
    else if (['zip', 'rar'].includes(ext)) typeIcon = '결과물'
    
    documents.value.unshift({
      id: Date.now(),
      name: uploadedFile.value.name,
      type: typeIcon,
      updated: '방금 전'
    })
  }
  
  isUploadModalOpen.value = false
  isUploading.value = false
  uploadProgress.value = 0
  uploadedFile.value = null
}
</script>

<template>
  <div class="max-w-[1240px] mx-auto px-4 py-8 animate-fade-in min-h-[calc(100vh-4rem)]">
    <!-- Basic header -->
    <button @click="router.push('/mypage')" class="text-xs font-bold text-sync-muted hover:text-sync-text mb-6 flex items-center gap-2 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      돌아가기
    </button>
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-outfit font-black text-sync-text">{{ team.teamName }} <span class="text-xl text-sync-muted font-medium ml-2 drop-shadow-sm">Workspace</span></h1>
        <p class="text-sm font-medium text-sync-muted mt-2 border border-sync-border px-3 py-1 rounded bg-black/5 dark:bg-white/5 inline-block">{{ hackathon.title }} 전용 협업 공간</p>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Kanban Board -->
      <div class="col-span-1 lg:col-span-2 glass-card p-8 rounded-[2rem] border border-sync-border shadow-sm">
         <h2 class="text-xl font-bold text-sync-text mb-6">스프린트 보드</h2>
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           <!-- To Do -->
           <div class="flex flex-col gap-3">
             <div class="flex items-center justify-between mb-2">
               <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">To Do</span>
               <span class="w-5 h-5 rounded bg-black/10 dark:bg-white/10 text-[10px] flex items-center justify-center font-bold">1</span>
             </div>
             <div v-for="t in tasks.filter(t => t.status === 'To Do')" :key="t.id" class="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border hover:border-sync-primary/50 transition-colors shadow-sm cursor-grab active:cursor-grabbing">
               <div class="flex justify-between">
                 <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">{{ t.priority }}</span>
               </div>
               <p class="text-sm font-bold text-sync-text mt-3">{{ t.title }}</p>
               <div class="mt-4 flex items-center gap-2">
                 <div class="w-5 h-5 rounded-full bg-slate-200 border border-sync-border flex items-center justify-center text-[8px] font-bold text-black">{{ t.assignee[0] }}</div>
                 <span class="text-[10px] text-sync-muted font-bold">{{ t.assignee }}</span>
               </div>
             </div>
           </div>

           <!-- In Progress -->
           <div class="flex flex-col gap-3">
             <div class="flex items-center justify-between mb-2">
               <span class="text-[11px] font-bold text-teal-500 dark:text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">In Progress</span>
               <span class="w-5 h-5 rounded bg-teal-500/10 text-[10px] flex items-center justify-center font-bold text-teal-600 border border-teal-500/20">1</span>
             </div>
             <div v-for="t in tasks.filter(t => t.status === 'In Progress')" :key="t.id" class="p-5 rounded-2xl bg-teal-50 dark:bg-teal-500/5 border border-teal-500/30 hover:border-teal-500/50 transition-colors shadow-[0_8px_20px_rgba(20,184,166,0.05)] cursor-grab active:cursor-grabbing">
               <div class="flex justify-between">
                 <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20">{{ t.priority }}</span>
               </div>
               <p class="text-sm font-bold text-sync-text mt-3">{{ t.title }}</p>
               <div class="mt-4 flex items-center gap-2">
                 <div class="w-5 h-5 rounded-full bg-slate-200 border border-sync-border flex items-center justify-center text-[8px] font-bold text-black">{{ t.assignee[0] }}</div>
                 <span class="text-[10px] text-sync-muted font-bold">{{ t.assignee }}</span>
               </div>
             </div>
           </div>

           <!-- Done -->
           <div class="flex flex-col gap-3">
             <div class="flex items-center justify-between mb-2">
               <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">Done</span>
               <span class="w-5 h-5 rounded bg-black/10 dark:bg-white/10 text-[10px] flex items-center justify-center font-bold">1</span>
             </div>
             <div v-for="t in tasks.filter(t => t.status === 'Done')" :key="t.id" class="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border transition-colors opacity-60">
               <div class="flex justify-between">
                 <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20">{{ t.priority }}</span>
               </div>
               <p class="text-sm font-bold text-sync-text mt-3 line-through">{{ t.title }}</p>
               <div class="mt-4 flex items-center gap-2">
                 <div class="w-5 h-5 rounded-full bg-slate-200 border border-sync-border flex items-center justify-center text-[8px] font-bold text-black">{{ t.assignee[0] }}</div>
                 <span class="text-[10px] text-sync-muted font-bold">{{ t.assignee }}</span>
               </div>
             </div>
           </div>

         </div>
      </div>

      <!-- Right Column -->
      <div class="col-span-1 flex flex-col gap-6">
        <!-- Docs / Assets -->
        <div class="glass-card p-8 rounded-[2rem] flex flex-col justify-between border border-sync-border shadow-sm">
          <div class="flex flex-col gap-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-sync-text">팀 문서 공간</h2>
              <span class="text-sync-muted">📁</span>
            </div>
            
            <div class="flex flex-col gap-4">
              <div v-for="doc in documents" :key="doc.id" class="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                <div class="flex items-center gap-4">
                   <span class="text-2xl group-hover:scale-110 transition-transform">{{ doc.type === '기획서' ? '📄' : '🎨' }}</span>
                   <div class="flex flex-col gap-0.5">
                     <span class="text-[13px] font-bold text-sync-text underline decoration-transparent group-hover:decoration-sync-border underline-offset-2">{{ doc.name }}</span>
                     <span class="text-[10px] text-sync-muted font-bold">업데이트: {{ doc.updated }}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <button @click="isUploadModalOpen = true" class="w-full py-4 rounded-xl border border-dashed border-sync-primary/50 bg-sync-primary/5 text-xs font-bold text-sync-primary hover:bg-sync-primary/10 transition-all mt-6 shadow-sm">
            + 새 문서 추가
          </button>
        </div>

        <!-- Team Members -->
        <div class="glass-card p-8 rounded-[2rem] border border-sync-border shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-sync-text">팀 멤버</h2>
            <span class="text-sync-muted">👥</span>
          </div>
          
          <div class="flex flex-col gap-4">
            <div v-for="user in mockUsers" :key="user.id" 
                 class="flex items-center gap-4 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                 @click="router.push(`/user/${user.id}`)">
               <img :src="user.avatar" class="w-12 h-12 flex-shrink-0 rounded-full border border-sync-border bg-white group-hover:scale-105 transition-transform" alt="profile"/>
               <div class="flex flex-col flex-1 min-w-0">
                 <span class="text-sm font-bold text-sync-text group-hover:text-sync-primary transition-colors truncate">{{ user.nickname }}</span>
                 <span class="text-[11px] text-sync-muted font-medium truncate">{{ user.role }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Upload Modal -->
    <div v-if="isUploadModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="!isUploading && (isUploadModalOpen = false)"></div>
      <div class="glass-card relative w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in flex flex-col">
        
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-sync-text">문서 스토리지 업로드</h3>
          <button v-if="!isUploading" @click="isUploadModalOpen = false" class="text-sync-muted hover:text-sync-text transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <p class="text-sm text-sync-muted mb-6">최종 결과물(ZIP, PDF 등)이나 팀 기획서를 업로드하세요. 팀원 모두와 즉시 실시간 동기화됩니다.</p>

        <div v-if="!isUploading" 
             @dragover.prevent="isDragging = true" 
             @dragleave.prevent="isDragging = false"
             @drop="handleDrop"
             class="relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group"
             :class="isDragging ? 'border-sync-primary bg-sync-primary/5' : 'border-sync-border hover:border-sync-primary/50 hover:bg-black/5 dark:hover:bg-white/5'">
             
             <input type="file" @change="handleFileSelect" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".zip,.pdf,.jpg,.png,.fig,.doc,.docx" />
             
             <div class="w-16 h-16 rounded-full bg-sync-card border border-sync-border flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
               ☁️
             </div>
             <p class="font-bold text-sync-text text-center">클릭하거나 파일을 드래그 앤 드롭</p>
             <p class="text-xs text-sync-muted mt-2">최대 50MB (PDF, ZIP, FIG 등 지원)</p>
        </div>

        <!-- Upload Progress -->
        <div v-else class="flex flex-col items-center justify-center py-8">
           <div class="w-16 h-16 rounded-full bg-sync-primary/10 border border-sync-primary/20 flex items-center justify-center mb-6 animate-pulse">
             <span class="text-2xl animate-bounce">📦</span>
           </div>
           <p class="font-bold text-sync-text mb-4">{{ uploadedFile?.name }} 업로드 중...</p>
           
           <div class="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border border-sync-border relative">
              <div class="absolute top-0 left-0 bottom-0 bg-sync-primary rounded-full transition-all duration-150 relative overflow-hidden" 
                   :style="`width: ${uploadProgress}%`">
                 <div class="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite]"></div>
              </div>
           </div>
           <p class="text-xs font-bold text-sync-primary mt-2">{{ uploadProgress }}%</p>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
