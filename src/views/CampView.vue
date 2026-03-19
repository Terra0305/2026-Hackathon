<script setup>
import { ref, onMounted } from 'vue'
import StateFeedback from '../components/StateFeedback.vue'

const loading = ref(true)
const teams = ref([])

onMounted(() => {
  setTimeout(() => {
    teams.value = [
      { id: 1, name: 'Web3 Pioneers', hackathon: 'Web3 Builder Camp', intro: '블록체인 혁신을 함께할 프론트엔드 개발자를 찾습니다.', isOpen: true, lookingFor: ['Frontend (Vue.js)', 'Smart Contract'], contact: 'https://discord.gg/example' },
      { id: 2, name: 'AI Revolution', hackathon: 'AI Innovators 2026', intro: 'AI 모델 최적화 경험이 있는 분 환영합니다.', isOpen: true, lookingFor: ['Data Scientist'], contact: 'https://open.kakao.com/example' },
      { id: 3, name: 'Independent Team', hackathon: null, intro: '해커톤 무관하게 사이드 프로젝트 같이 하실 분 구해요.', isOpen: false, lookingFor: [], contact: '#' },
    ]
    loading.value = false
  }, 800)
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="text-gradient">Team Camp ⛺</h1>
        <p class="subtitle">독립적인 팀 모집부터 특정 해커톤을 위한 팀 빌딩까지 한곳에서.</p>
      </div>
      <button class="btn btn-primary">새 팀 만들기</button>
    </div>

    <StateFeedback :loading="loading" :empty="teams.length === 0">
      <div class="camp-grid">
        <div v-for="team in teams" :key="team.id" class="glass-card camp-card" :class="{ 'closed': !team.isOpen }">
          <div class="card-header">
            <h3>{{ team.name }}</h3>
            <span class="status-badge" :class="{ active: team.isOpen }">{{ team.isOpen ? '모집 중' : '마감됨' }}</span>
          </div>
          
          <div class="linked-hackathon" v-if="team.hackathon">
            <span class="icon">🔗</span> {{ team.hackathon }} 참여 예정
          </div>
          <div class="linked-hackathon independent" v-else>
            <span class="icon">🌱</span> 독립 프로젝트
          </div>

          <p class="intro">{{ team.intro }}</p>

          <div class="looking-list" v-if="team.isOpen">
            <strong>모집 분야:</strong>
            <div class="tags">
              <span v-for="role in team.lookingFor" :key="role" class="tag">{{ role }}</span>
            </div>
          </div>

          <div class="card-footer">
            <a :href="team.isOpen ? team.contact : '#'" class="btn btn-outline" :class="{ disabled: !team.isOpen }">
              연락하기 (Contact)
            </a>
          </div>
        </div>
      </div>
    </StateFeedback>
  </div>
</template>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 2.5rem; animation: fadeIn 0.5s ease; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem; }
.page-header h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.subtitle { color: var(--text-secondary); font-size: 1.1rem; }

.camp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
.camp-card { display: flex; flex-direction: column; gap: 1rem; border-top: 3px solid var(--accent-purple); }
.camp-card.closed { border-top-color: var(--text-muted); opacity: 0.7; }

.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-header h3 { font-size: 1.5rem; color: var(--text-primary); }
.status-badge { font-size: 0.75rem; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: 600; background: var(--bg-tertiary); }
.status-badge.active { background: rgba(128, 90, 213, 0.2); color: #d6bcfa; }

.linked-hackathon { font-size: 0.85rem; color: var(--accent-blue); display: flex; align-items: center; gap: 0.4rem; background: rgba(49, 130, 206, 0.1); padding: 0.4rem 0.8rem; border-radius: 6px; width: fit-content; }
.linked-hackathon.independent { color: #48bb78; background: rgba(72, 187, 120, 0.1); }

.intro { color: var(--text-secondary); line-height: 1.5; font-size: 0.95rem; margin-bottom: 0.5rem; flex-grow: 1; }

.looking-list { display: flex; flex-direction: column; gap: 0.5rem; }
.looking-list strong { font-size: 0.85rem; color: var(--text-primary); }
.tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tag { font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 0.3rem 0.6rem; border-radius: 4px; color: #e2e8f0; }

.card-footer { margin-top: 1rem; }
.card-footer .btn { width: 100%; border-color: rgba(255,255,255,0.1); }
.disabled { cursor: not-allowed; opacity: 0.5; pointer-events: none; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
