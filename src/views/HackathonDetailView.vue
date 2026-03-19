<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import StateFeedback from '../components/StateFeedback.vue'

const route = useRoute()
const loading = ref(true)
const detail = ref(null)
const error = ref(false)

onMounted(() => {
  setTimeout(() => {
    detail.value = {
      slug: route.params.slug,
      title: 'AI Innovators 2026',
      status: '진행 중',
      Overview: '미래를 바꿀 인공지능 솔루션을 개발하는 글로벌 해커톤입니다.',
      Eval: '독창성(40%), 기술 완성도(40%), 비즈니스 임팩트(20%)',
      Schedule: [
        { date: '2026-04-01', event: '대회 시작 및 팀 빌딩' },
        { date: '2026-04-15', event: '중간 멘토링' },
        { date: '2026-04-30', event: '최종 제출 마감' }
      ],
      Prize: '1등: $10,000 | 2등: $5,000 | 3등: $2,000',
      Teams: [
        { id: 1, name: 'AlphaTech', is_open: true, looking_for: ['Frontend', 'Designer'] },
        { id: 2, name: 'NeuralNet', is_open: false, looking_for: [] }
      ],
      Submit: '제출은 4월 30일까지 가능합니다. (zip, pdf 권장)',
      Leaderboard: [
        { rank: 1, team: 'NeuralNet', score: 95, status: '제출 완료' },
        { rank: 2, team: 'AlphaTech', score: 0, status: '미제출' }
      ]
    }
    loading.value = false
  }, 1000)
})
</script>

<template>
  <StateFeedback :loading="loading" :error="error" :empty="!detail" emptyMessage="존재하지 않는 해커톤입니다.">
    <div class="detail-container" v-if="detail">
      <!-- Header -->
      <div class="header-section glass-card">
        <span class="status-badge" :class="{ active: detail.status === '진행 중' }">{{ detail.status }}</span>
        <h1 class="text-gradient">{{ detail.title }}</h1>
        <div class="actions">
          <button class="btn btn-primary">참가 신청하기</button>
        </div>
      </div>

      <div class="content-grid">
        <!-- 1. Overview -->
        <section class="glass-card">
          <h2>🎯 개요 (Overview)</h2>
          <p>{{ detail.Overview }}</p>
        </section>

        <!-- 2. Eval -->
        <section class="glass-card">
          <h2>⚖️ 평가 (Eval)</h2>
          <p>{{ detail.Eval }}</p>
        </section>

        <!-- 3. Schedule -->
        <section class="glass-card">
          <h2>🗓 일정 (Schedule)</h2>
          <ul class="schedule-list">
            <li v-for="item in detail.Schedule" :key="item.date">
              <strong>{{ item.date }}</strong> - {{ item.event }}
            </li>
          </ul>
        </section>

        <!-- 4. Prize -->
        <section class="glass-card">
          <h2>🏆 상금 (Prize)</h2>
          <p class="prize-text">{{ detail.Prize }}</p>
        </section>

        <!-- 5. Teams -->
        <section class="glass-card">
          <h2>⛺ 팀 (Teams)</h2>
          <div class="team-list">
            <div v-for="team in detail.Teams" :key="team.id" class="mini-card">
              <h4>{{ team.name }}</h4>
              <span class="badge" v-if="team.is_open">모집 중</span>
              <span class="badge closed" v-else>마감</span>
              <p v-if="team.is_open" class="looking-for">구인: {{ team.looking_for.join(', ') }}</p>
              <button class="btn btn-outline btn-sm mt" v-if="team.is_open">초대 요청</button>
            </div>
          </div>
        </section>

        <!-- 6. Submit -->
        <section class="glass-card submit-section">
          <h2>📤 제출 (Submit)</h2>
          <p>{{ detail.Submit }}</p>
          <div class="submit-box">
            <input type="file" disabled />
            <button class="btn btn-outline btn-sm" disabled>제출하기</button>
          </div>
        </section>

        <!-- 7. Leaderboard -->
        <section class="glass-card full-width">
          <h2>📊 리더보드 (Leaderboard)</h2>
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>팀명</th>
                <th>점수</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in detail.Leaderboard" :key="row.team">
                <td>{{ row.status === '미제출' ? '-' : row.rank }}</td>
                <td>{{ row.team }}</td>
                <td>{{ row.score }}</td>
                <td>
                  <span class="status-indicator" :class="{ 'error': row.status === '미제출' }">
                    {{ row.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </StateFeedback>
</template>

<style scoped>
.detail-container { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.5s ease; }
.header-section { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; padding: 3rem; background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); }
.status-badge { font-size: 0.85rem; padding: 0.4rem 0.8rem; border-radius: 999px; background: rgba(56, 161, 105, 0.2); color: #68d391; font-weight: 600; }
.header-section h1 { font-size: 3.5rem; }

.content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; }
.glass-card { display: flex; flex-direction: column; gap: 1rem; }
.full-width { grid-column: 1 / -1; }

h2 { font-size: 1.35rem; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem; margin-bottom: 0.5rem; }
p, li { color: var(--text-secondary); font-size: 0.95rem; }
.schedule-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.schedule-list strong { color: var(--accent-blue); }
.prize-text { font-size: 1.1rem; font-weight: 600; color: #fbd38d; }

.team-list { display: flex; gap: 1rem; flex-wrap: wrap; }
.mini-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start; }
.mini-card .badge { font-size: 0.75rem; background: rgba(49, 130, 206, 0.2); color: #63b3ed; padding: 0.2rem 0.5rem; border-radius: 4px; }
.mini-card .badge.closed { background: rgba(255,255,255,0.1); color: var(--text-muted); }
.looking-for { font-size: 0.8rem; color: #a0aec0; }
.btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
.mt { margin-top: auto; }

.submit-box { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px dashed var(--border-color); }

.leaderboard-table { width: 100%; border-collapse: collapse; text-align: left; }
.leaderboard-table th, .leaderboard-table td { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
.leaderboard-table th { color: var(--text-primary); font-weight: 600; }
.leaderboard-table td { color: var(--text-secondary); }
.status-indicator { font-size: 0.85rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(56, 161, 105, 0.15); color: #68d391; }
.status-indicator.error { background: rgba(229, 62, 62, 0.15); color: #fc8181; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
