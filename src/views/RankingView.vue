<script setup>
import { ref, onMounted } from 'vue'
import StateFeedback from '../components/StateFeedback.vue'

const loading = ref(true)
const rankings = ref([])
const activeFilter = ref('all')

onMounted(() => {
  setTimeout(() => {
    rankings.value = [
      { rank: 1, nickname: 'HackKing', points: 15400, avatar: '👑', trend: 'up' },
      { rank: 2, nickname: 'FrontendNinja', points: 12200, avatar: '🥷', trend: 'same' },
      { rank: 3, nickname: 'AI_Master', points: 9800, avatar: '🤖', trend: 'up' },
      { rank: 4, nickname: 'RustLover', points: 8400, avatar: '🦀', trend: 'down' },
      { rank: 5, nickname: 'CodeBreaker', points: 7200, avatar: '💻', trend: 'same' }
    ]
    loading.value = false
  }, 1000)
})

const setFilter = (filter) => {
  activeFilter.value = filter;
  loading.value = true;
  // Simulating API refetch
  setTimeout(() => { loading.value = false; }, 500);
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="text-gradient">Global Rankings 🥇</h1>
        <p class="subtitle">해커톤 참여와 수상을 통해 획득한 포인트 기반 랭킹입니다.</p>
      </div>
      
      <div class="filter-group">
        <button class="filter-btn" :class="{ active: activeFilter === '7d' }" @click="setFilter('7d')">최근 7일</button>
        <button class="filter-btn" :class="{ active: activeFilter === '30d' }" @click="setFilter('30d')">최근 30일</button>
        <button class="filter-btn" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">전체 기간</button>
      </div>
    </div>

    <StateFeedback :loading="loading" :empty="rankings.length === 0">
      <div class="glass-card table-wrapper">
        <table class="ranking-table">
          <thead>
            <tr>
              <th width="10%">Rank</th>
              <th width="60%">Developer</th>
              <th width="30%">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in rankings" :key="user.nickname" :class="{ 'top-3': user.rank <= 3 }">
              <td class="rank-cell">
                <span v-if="user.rank === 1" class="medal gold">1</span>
                <span v-else-if="user.rank === 2" class="medal silver">2</span>
                <span v-else-if="user.rank === 3" class="medal bronze">3</span>
                <span v-else>{{ user.rank }}</span>
              </td>
              <td>
                <div class="user-info">
                  <span class="avatar">{{ user.avatar }}</span>
                  <span class="nickname">{{ user.nickname }}</span>
                </div>
              </td>
              <td class="points-cell">
                {{ user.points.toLocaleString() }} PTS
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </StateFeedback>
  </div>
</template>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 2.5rem; animation: fadeIn 0.5s ease; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.page-header h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.subtitle { color: var(--text-secondary); font-size: 1.1rem; }

.filter-group { display: flex; background: rgba(0,0,0,0.3); padding: 0.25rem; border-radius: 8px; border: 1px solid var(--border-color); }
.filter-btn { background: transparent; border: none; color: var(--text-secondary); padding: 0.5rem 1.25rem; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500; font-family: inherit; }
.filter-btn:hover { color: var(--text-primary); }
.filter-btn.active { background: var(--bg-tertiary); color: var(--text-primary); box-shadow: 0 2px 4px rgba(0,0,0,0.2); }

.table-wrapper { padding: 0; overflow: hidden; }
.ranking-table { width: 100%; border-collapse: collapse; text-align: left; }
.ranking-table th { padding: 1.5rem 2rem; background: rgba(0,0,0,0.2); color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border-color); }
.ranking-table td { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s; }
.ranking-table tbody tr:hover td { background: rgba(255,255,255,0.02); }

.rank-cell { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--text-secondary); }
.medal { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; color: #000; font-size: 1rem; }
.gold { background: linear-gradient(135deg, #fceabb, #f8b500); box-shadow: 0 0 12px rgba(248, 181, 0, 0.4); }
.silver { background: linear-gradient(135deg, #e3e3e3, #9e9e9e); }
.bronze { background: linear-gradient(135deg, #f4a460, #cd7f32); }

.top-3 td { background: rgba(255,255,255,0.01); }
.top-3 .nickname { color: var(--text-primary); font-weight: 600; font-size: 1.1rem; }

.user-info { display: flex; align-items: center; gap: 1rem; }
.avatar { font-size: 1.5rem; background: rgba(255,255,255,0.05); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.nickname { color: var(--text-secondary); font-size: 1.05rem; }

.points-cell { font-family: 'Outfit', sans-serif; font-weight: 700; color: var(--accent-blue); font-size: 1.1rem; letter-spacing: 0.02em; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
