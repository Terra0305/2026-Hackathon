import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/hackathons',
      name: 'hackathons',
      component: () => import('../views/HackathonListView.vue')
    },
    {
      path: '/hackathons/:slug',
      name: 'hackathon-detail',
      component: () => import('../views/HackathonDetailView.vue')
    },
    {
      path: '/camp',
      name: 'camp',
      component: () => import('../views/CampView.vue')
    },
    {
      path: '/camp/create',
      name: 'camp-create',
      component: () => import('../views/CampCreateView.vue')
    },
    {
      path: '/rankings',
      name: 'rankings',
      component: () => import('../views/RankingView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('../views/MyPageView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
