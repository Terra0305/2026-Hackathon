<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  hackathon: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const activeTab = ref('basic')

const formData = ref({
  id: Date.now(),
  title: '',
  type: '',
  status: '예정',
  statusColor: 'blue',
  startDate: '',
  endDate: '',
  participants: 0,
  bgGradient: 'from-gray-700 to-gray-900',
  heroText: '',
  subText: '',
  organizer: '',
  contactEmail: '',
  description: '',
  prizes: [],
  timeline: [],
  rules: []
})

watch(() => props.hackathon, (nVal) => {
  activeTab.value = 'basic'
  if (nVal) {
    formData.value = JSON.parse(JSON.stringify({
      ...nVal,
      prizes: nVal.prizes || [],
      timeline: nVal.timeline || [],
      rules: nVal.rules || []
    }))
  } else {
    formData.value = {
      id: Date.now(),
      title: '',
      type: '',
      status: '예정',
      statusColor: 'blue',
      startDate: '',
      endDate: '',
      participants: 0,
      bgGradient: 'from-[#1E293B] to-[#0F172A]',
      heroText: '',
      subText: '',
      organizer: '',
      contactEmail: '',
      description: '',
      prizes: [
        { rank: '1등상', reward: '' }
      ],
      timeline: [
        { step: '참가 접수', date: '' }
      ],
      rules: ['대회 기본 규정을 준수합니다.']
    }
  }
}, { immediate: true })

const addPrize = () => formData.value.prizes.push({ rank: '', reward: '' })
const removePrize = (index) => formData.value.prizes.splice(index, 1)

const addTimeline = () => formData.value.timeline.push({ step: '', date: '' })
const removeTimeline = (index) => formData.value.timeline.splice(index, 1)

const addRule = () => formData.value.rules.push('')
const removeRule = (index) => formData.value.rules.splice(index, 1)

const handleSave = () => {
  if (!formData.value.title) {
    alert('해커톤 이름을 입력하세요.')
    return
  }
  emit('save', formData.value)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>
    <div class="relative w-full max-w-4xl bg-white dark:bg-[#0f1115] border border-black/10 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col h-[90vh] lg:h-[85vh] overflow-hidden">
      
      <!-- Header -->
      <div class="px-8 py-6 border-b border-sync-border flex justify-between items-center bg-black/5 dark:bg-white/5 shrink-0">
        <h2 class="text-2xl font-bold text-sync-text">{{ hackathon ? '해커톤 수정' : '새로운 해커톤 만들기' }}</h2>
        <button @click="emit('close')" class="text-sync-muted hover:text-sync-text p-2 bg-black/5 dark:bg-white/5 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <!-- Sidebar Navigation -->
        <div class="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-sync-border bg-black/[0.02] dark:bg-white/[0.02] flex flex-row lg:flex-col gap-2 p-4 lg:p-6 shrink-0 overflow-x-auto custom-scrollbar">
           <button @click="activeTab = 'basic'" :class="activeTab === 'basic' ? 'bg-sync-primary/10 text-sync-primary border-sync-primary/30' : 'text-sync-muted hover:bg-black/5 dark:hover:bg-white/5 border-transparent'" class="px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all whitespace-nowrap lg:whitespace-normal shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sync-primary/50 active:scale-[0.98]">기본 정보</button>
           <button @click="activeTab = 'details'" :class="activeTab === 'details' ? 'bg-sync-primary/10 text-sync-primary border-sync-primary/30' : 'text-sync-muted hover:bg-black/5 dark:hover:bg-white/5 border-transparent'" class="px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all whitespace-nowrap lg:whitespace-normal shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sync-primary/50 active:scale-[0.98]">상세 및 주관사</button>
           <button @click="activeTab = 'timeline'" :class="activeTab === 'timeline' ? 'bg-sync-primary/10 text-sync-primary border-sync-primary/30' : 'text-sync-muted hover:bg-black/5 dark:hover:bg-white/5 border-transparent'" class="px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all whitespace-nowrap lg:whitespace-normal shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sync-primary/50 active:scale-[0.98]">일정 및 상금</button>
           <button @click="activeTab = 'rules'" :class="activeTab === 'rules' ? 'bg-sync-primary/10 text-sync-primary border-sync-primary/30' : 'text-sync-muted hover:bg-black/5 dark:hover:bg-white/5 border-transparent'" class="px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all whitespace-nowrap lg:whitespace-normal shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sync-primary/50 active:scale-[0.98]">대회 규정</button>
        </div>

        <!-- Form Area -->
        <div class="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          
          <!-- TAB 1: BASIC INFO -->
          <div v-show="activeTab === 'basic'" class="flex flex-col gap-6 animate-fade-in">
            <h3 class="text-lg font-bold text-sync-text border-b border-sync-border pb-3">기본 정보 설정</h3>
            
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-sync-muted">타이틀 <span class="text-red-500">*</span></label>
              <input v-model="formData.title" type="text" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               <div class="flex flex-col gap-2 w-full">
                 <label class="text-xs font-bold text-sync-muted">해커톤 분야 (예: WEB3, AI 등)</label>
                 <input v-model="formData.type" type="text" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
               </div>
               <div class="flex flex-col gap-2 w-full">
                 <label class="text-xs font-bold text-sync-muted">현재 상태</label>
                 <select v-model="formData.status" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
                    <option value="예정">예정</option>
                    <option value="진행 중">진행 중</option>
                    <option value="종료">종료</option>
                 </select>
               </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               <div class="flex flex-col gap-2 w-full">
                 <label class="text-xs font-bold text-sync-muted">시작일 (YYYY.MM.DD)</label>
                 <input v-model="formData.startDate" placeholder="2026.05.01" type="text" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
               </div>
               <div class="flex flex-col gap-2 w-full">
                 <label class="text-xs font-bold text-sync-muted">종료일 (YYYY.MM.DD)</label>
                 <input v-model="formData.endDate" placeholder="2026.05.07" type="text" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
               </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-sync-muted">결선 참여자 수 / 팀 수</label>
              <input v-model="formData.participants" type="number" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
            </div>
          </div>

          <!-- TAB 2: DETAILS -->
          <div v-show="activeTab === 'details'" class="flex flex-col gap-6 animate-fade-in">
            <h3 class="text-lg font-bold text-sync-text border-b border-sync-border pb-3">상세 및 디자인 설정</h3>
            
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-sync-muted">주관처 (Organizer)</label>
              <input v-model="formData.organizer" type="text" placeholder="재단법인 코딩스타" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-sync-muted">연락처 이메일</label>
              <input v-model="formData.contactEmail" type="email" placeholder="contact@hackathon.com" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-sync-muted">상세 설명 내용</label>
              <textarea v-model="formData.description" rows="5" placeholder="해커톤에 대한 자세한 설명을 적어주세요." class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all custom-scrollbar"></textarea>
            </div>

            <h4 class="text-sm font-bold text-sync-text mt-4">비주얼 요소 렌더링</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               <div class="flex flex-col gap-2 w-full">
                 <label class="text-xs font-bold text-sync-muted">상단 메인 텍스트 (Hero Text)</label>
                 <input v-model="formData.heroText" type="text" placeholder="GLOBAL HACKATHON" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
               </div>
               <div class="flex flex-col gap-2 w-full">
                 <label class="text-xs font-bold text-sync-muted">상단 서브 텍스트 (Sub Text)</label>
                 <input v-model="formData.subText" type="text" placeholder="Build the future" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all">
               </div>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-sync-muted">배경 그라데이션 CSS Class (Tailwind)</label>
              <input v-model="formData.bgGradient" type="text" placeholder="from-slate-700 to-slate-900" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all font-mono text-xs">
            </div>
          </div>

          <!-- TAB 3: TIMELINE & PRIZES -->
          <div v-show="activeTab === 'timeline'" class="flex flex-col gap-10 animate-fade-in">
            
            <!-- Timeline Section -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between border-b border-sync-border pb-3">
                <h3 class="text-lg font-bold text-sync-text">타임라인 (Timeline)</h3>
                <button @click="addTimeline" class="text-xs font-bold text-sync-primary hover:text-sync-primaryHover transition-colors flex items-center gap-1.5 bg-sync-primary/10 px-3 py-1.5 rounded-lg border border-sync-primary/20">+ 항목 추가</button>
              </div>

              <div v-if="formData.timeline.length === 0" class="py-6 text-center text-sync-muted text-sm border border-dashed border-sync-border rounded-xl">일정이 없습니다.</div>
              
              <div v-for="(item, idx) in formData.timeline" :key="'tl-'+idx" class="flex gap-4 items-start group">
                 <div class="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-sync-muted shrink-0 mt-2 border border-sync-border">{{ idx + 1 }}</div>
                 <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-sync-border relative">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">단계 내용</label>
                      <input v-model="item.step" type="text" placeholder="예: 오리엔테이션" class="w-full bg-transparent border-b border-sync-border p-1.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:bg-white/5 dark:focus:bg-black/20 rounded transition-all">
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">일정 일자</label>
                      <input v-model="item.date" type="text" placeholder="예: 2026.05.01" class="w-full bg-transparent border-b border-sync-border p-1.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:bg-white/5 dark:focus:bg-black/20 rounded transition-all">
                    </div>
                    <button @click="removeTimeline(idx)" class="absolute -right-3 -top-3 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                 </div>
              </div>
            </div>

            <!-- Prizes Section -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between border-b border-sync-border pb-3">
                <h3 class="text-lg font-bold text-sync-text">상금 및 혜택 (Prizes)</h3>
                <button @click="addPrize" class="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">+ 항목 추가</button>
              </div>

              <div v-if="formData.prizes.length === 0" class="py-6 text-center text-sync-muted text-sm border border-dashed border-sync-border rounded-xl">등록된 상금이 없습니다.</div>
              
              <div v-for="(prize, idx) in formData.prizes" :key="'pr-'+idx" class="flex gap-4 items-start group">
                 <div class="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xl shrink-0 mt-2 border border-sync-border">🏆</div>
                 <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-sync-border relative">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">등위 명칭</label>
                      <input v-model="prize.rank" type="text" placeholder="예: 대상 (1팀)" class="w-full bg-transparent border-b border-sync-border p-1.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:bg-white/5 dark:focus:bg-black/20 rounded transition-all">
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-bold text-sync-muted uppercase tracking-widest">상금 또는 혜택 내역</label>
                      <input v-model="prize.reward" type="text" placeholder="예: ₩ 10,000,000" class="w-full bg-transparent border-b border-sync-border p-1.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:bg-white/5 dark:focus:bg-black/20 rounded transition-all font-mono">
                    </div>
                    <button @click="removePrize(idx)" class="absolute -right-3 -top-3 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                 </div>
              </div>
            </div>

          </div>

          <!-- TAB 4: RULES -->
          <div v-show="activeTab === 'rules'" class="flex flex-col gap-6 animate-fade-in">
            <div class="flex items-center justify-between border-b border-sync-border pb-3">
              <h3 class="text-lg font-bold text-sync-text">대회 규정 (Rules)</h3>
              <button @click="addRule" class="text-xs font-bold text-teal-500 hover:text-teal-400 transition-colors flex items-center gap-1.5 bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20">+ 규정 추가</button>
            </div>

            <div v-if="formData.rules.length === 0" class="py-6 text-center text-sync-muted text-sm border border-dashed border-sync-border rounded-xl">대회 규정이 없습니다.</div>
              
            <div class="flex flex-col gap-3">
              <div v-for="(rule, idx) in formData.rules" :key="'rl-'+idx" class="flex items-start gap-3 group relative">
                <div class="w-6 h-6 rounded-full bg-black/5 dark:bg-white/5 border border-sync-border flex items-center justify-center shrink-0 mt-2 text-xs font-bold text-sync-muted">{{ idx + 1 }}</div>
                <div class="flex-1 bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-2 relative pr-10">
                  <textarea v-model="formData.rules[idx]" rows="2" placeholder="규정을 입력하세요." class="w-full bg-transparent p-2 text-sm text-sync-text outline-none focus:border-sync-primary focus:bg-white/5 dark:focus:bg-black/20 rounded transition-all custom-scrollbar"></textarea>
                  <button @click="removeRule(idx)" class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-8 py-5 border-t border-sync-border flex justify-end gap-4 bg-black/5 dark:bg-white/5 shrink-0 relative z-10 box-border">
        <button @click="emit('close')" class="px-6 py-3 rounded-xl border border-sync-border text-sync-muted hover:text-sync-text text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">취소</button>
        <button @click="handleSave" class="px-8 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all flex items-center gap-2 hover:-translate-y-0.5">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          변경사항 저장하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.3); border-radius: 4px; }

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
