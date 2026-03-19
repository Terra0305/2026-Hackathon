<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="navbar-wrapper">
    <div class="navbar-content">
      <RouterLink to="/" class="brand">
        <span class="logo-icon">✨</span>
        <span class="brand-text">HTHON 26</span>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/hackathons" class="nav-link" active-class="active">Hackathons</RouterLink>
        <RouterLink to="/camp" class="nav-link" active-class="active">Camp</RouterLink>
        <RouterLink to="/rankings" class="nav-link" active-class="active">Rankings</RouterLink>
      </nav>

      <div class="user-actions">
        <button class="btn btn-primary btn-sm">Sign In</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(11, 15, 25, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo-icon {
  font-size: 1.5rem;
}

.brand-text {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  color: var(--text-secondary);
  position: relative;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-blue);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link.active {
  color: var(--text-primary);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
