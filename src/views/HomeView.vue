<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home-container">
    <div class="hero">
      <div class="badge">Platform Launch 2026</div>
      <h1 class="text-gradient">Innovate Without Borders</h1>
      <p class="hero-desc">Discover global hackathons, build your dream team, and compete on the interactive leaderboard. Connect with developers worldwide and prove your skills.</p>
    </div>
    
    <div class="card-grid">
      <RouterLink to="/hackathons" class="glass-card nav-card">
        <div class="icon">🚀</div>
        <h2>해커톤 보러가기</h2>
        <p>진행 중인 모든 대회 정보를 확인하고 즉시 참가하세요. 기술 태그와 일정으로 필터링 기능을 제공합니다.</p>
      </RouterLink>
      
      <RouterLink to="/camp" class="glass-card nav-card">
        <div class="icon">⛺</div>
        <h2>팀 찾기</h2>
        <p>해커톤용 팀 또는 사이드 프로젝트를 함께할 팀원을 모집합니다. 직무별 필터와 연락처 링크를 지원합니다.</p>
      </RouterLink>
      
      <RouterLink to="/rankings" class="glass-card nav-card">
        <div class="icon">🥇</div>
        <h2>랭킹 보기</h2>
        <p>플랫폼 통합 리더보드에서 누적 포인트를 확인하세요. 7일, 30일 필터를 통해 트렌디한 인재를 찾을 수 있습니다.</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  align-items: center;
  padding-top: 3rem;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero {
  text-align: center;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.badge {
  background: rgba(49, 130, 206, 0.15);
  color: var(--accent-blue);
  padding: 0.35rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(49, 130, 206, 0.3);
}

.hero h1 {
  font-size: 4.5rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.hero-desc {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  width: 100%;
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 1rem;
  padding: 2.5rem;
}

.nav-card .icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.nav-card h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
}

.nav-card p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .hero h1 { font-size: 3rem; }
}
</style>
