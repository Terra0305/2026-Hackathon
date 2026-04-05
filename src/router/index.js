import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

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
      path: '/hackathons/:slug/apply',
      name: 'hackathon-apply',
      component: () => import('../views/HackathonApplyView.vue')
    },
    {
      path: '/hackathons/:slug',
      name: 'hackathon-detail',
      component: () => import('../views/HackathonDetailView.vue')
    },
    {
      path: '/workspace/:slug',
      name: 'workspace',
      component: () => import('../views/WorkspaceView.vue')
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
    },
    {
      path: '/mypage/edit',
      name: 'profile-edit',
      component: () => import('../views/ProfileEditView.vue')
    },
    {
      path: '/user/:id',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue')
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboardView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/hackathons/:id/submissions',
      name: 'admin-submissions',
      component: () => import('../views/admin/AdminSubmissionsView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/admin/AdminUsersView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/users/:id',
      name: 'admin-user-detail',
      component: () => import('../views/admin/AdminUserDetailView.vue'),
      meta: { requiresAdmin: true }
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAdmin = authStore.user?.isAdmin

  // If Admin user tries to go to any non-admin (and non-login) page, redirect back to /admin
  if (isAdmin && !to.path.startsWith('/admin') && to.path !== '/login') {
    return next('/admin')
  }
  
  // If Normal user tries to go to an admin page, redirect to home
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }

  next()
})

export default router
