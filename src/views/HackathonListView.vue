<script setup>
import { ref, onMounted } from 'vue'
import StateFeedback from '../components/StateFeedback.vue'

const loading = ref(true)
const error = ref(false)
const hackathons = ref([])
const activeStatus = ref('All')

onMounted(() => {
  // Mock API call simulation
  setTimeout(() => {
    hackathons.value = [
      { id: 1, slug: 'ai-innovators-2026', title: 'AI Innovators 2026', status: '진행 중', tags: ['AI', 'Python', 'ML'], startDate: '2026-04-01', endDate: '2026-04-30', participants: 154 },
      { id: 2, slug: 'web3-builder-camp', title: 'Web3 Builder Camp', status: '예정', tags: ['Blockchain', 'Solidity'], startDate: '2026-06-01', endDate: '2026-06-15', participants: 42 },
      { id: 3, slug: 'fintech-future', title: 'Fintech Future Hack', status: '종료', tags: ['Finance', 'React'], startDate: '2026-01-10', endDate: '2026-01-20', participants: 210 },
    ]
    loading.value = false
  }, 1200)
})

const filteredHackathons = () => {
  if (activeStatus.value === 'All') return hackathons.value;
  return hackathons.value.filter(h => h.status === activeStatus.value);
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="text-gradient">Hackathons</h1>
        <p class="subtitle">글로벌 해커톤을 탐색하고 혁신적인 아이디어를 실현하세요.</p>
      </div>
      
      <div class="filters">
        <select v-model="activeStatus" class="glass-select">
          <option value="All">상태: 전체</option>
          <option value="진행 중">진행 중</option>
          <option value="예정">예정</option>
          <option value="종료">종료</option>
        </select>
        <select class="glass-select">
          <option>태그: 전체</option>
          <option>AI</option>
          <option>Web3</option>
        </select>
      </div>
    </div>

    <StateFeedback :loading="loading" :error="error" :empty="filteredHackathons().length === 0" emptyMessage="조건에 맞는 해커톤이 없습니다.">
      <div class="list-grid">
        <router-link :to="`/hackathons/${item.slug}`" v-for="item in filteredHackathons()" :key="item.id" class="glass-card list-card">
          <div class="card-top">
            <span class="status-badge" :class="{ 
              active: item.status === '진행 중',
              pending: item.status === '예정',
              closed: item.status === '종료'
            }">{{ item.status }}</span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
          <div class="card-meta">
            <div class="meta-item">
              <span class="icon">📅</span>
              <span>{{ item.startDate }} ~ {{ item.endDate }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">👥</span>
              <span>{{ item.participants }}명 참여 중</span>
            </div>
          </div>
        </router-link>
      </div>
    </StateFeedback>
  </div>
</template>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 2.5rem; animation: fadeIn 0.5s ease; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.page-header h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.subtitle { color: var(--text-secondary); font-size: 1.1rem; }
.filters { display: flex; gap: 1rem; }
.glass-select { background: rgba(0,0,0,0.3); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.75rem 1.25rem; border-radius: 8px; outline: none; font-size: 0.95rem; cursor: pointer; transition: border-color 0.2s; backdrop-filter: blur(10px); }
.glass-select:focus { border-color: var(--accent-blue); }

.list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
.list-card { display: flex; flex-direction: column; gap: 1rem; position: relative; overflow: hidden; }

/* Subtle gradient top strip for cards */
.list-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--accent-gradient); opacity: 0; transition: opacity 0.3s ease; }
.list-card:hover::before { opacity: 1; }

.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
.status-badge { font-size: 0.8rem; font-weight: 600; padding: 0.4rem 0.75rem; border-radius: 999px; }
.status-badge.active { background: rgba(56, 161, 105, 0.15); color: #68d391; border: 1px solid rgba(56, 161, 105, 0.3); }
.status-badge.pending { background: rgba(214, 158, 46, 0.15); color: #f6ad55; border: 1px solid rgba(214, 158, 46, 0.3); }
.status-badge.closed { background: rgba(255, 255, 255, 0.1); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1); }

.card-title { font-size: 1.5rem; color: var(--text-primary); }
.tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.tag { font-size: 0.8rem; color: var(--accent-blue); font-weight: 500; }

.card-meta { display: flex; flex-direction: column; gap: 0.5rem; margin-top: auto; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
.meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
