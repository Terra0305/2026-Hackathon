<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  empty: {
    type: Boolean,
    default: false
  },
  error: {
    type: [Boolean, String],
    default: false
  },
  emptyMessage: {
    type: String,
    default: "표시할 데이터가 없습니다."
  }
})
</script>

<template>
  <div class="state-feedback-wrapper">
    <!-- 1. Loading State -->
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p class="state-text">데이터를 불러오는 중입니다...</p>
    </div>

    <!-- 2. Error State -->
    <div v-else-if="error" class="state-container state-error">
      <div class="icon">⚠️</div>
      <h3 class="state-title">오류가 발생했습니다</h3>
      <p class="state-text">{{ typeof error === 'string' ? error : '데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' }}</p>
      <button class="btn btn-outline mt-4" @click="$emit('retry')">다시 시도</button>
    </div>

    <!-- 3. Empty State -->
    <div v-else-if="empty" class="state-container state-empty">
      <div class="icon">📭</div>
      <h3 class="state-title">결과 없음</h3>
      <p class="state-text">{{ emptyMessage }}</p>
    </div>

    <!-- Slot for Content (when not loading, error, or empty) -->
    <div v-else class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 2rem;
  text-align: center;
  border-radius: var(--card-radius);
  background: var(--bg-tertiary);
  border: 1px dashed var(--border-color);
  animation: fadeIn 0.4s ease;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.state-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.state-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.mt-4 {
  margin-top: 1rem;
}

.state-error .icon {
  filter: drop-shadow(0 0 12px rgba(229, 62, 62, 0.4));
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
