import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '../data/mockData'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // Initialize with dummy data if present in localStorage
  const localSession = localStorage.getItem('sync_user')
  const user = ref(localSession ? JSON.parse(localSession) : null)

  const isAuthenticated = computed(() => !!user.value)

  const login = (email, password) => {
    // Create a local session linking standard mock data
    const mockUser = {
      ...mockUsers[0],
      email: email
    }
    user.value = mockUser
    localStorage.setItem('sync_user', JSON.stringify(mockUser))
    router.push('/')
  }

  const signup = (nickname, email, password) => {
    // Create an entirely new mock session object
    const mockUser = {
      id: Date.now(),
      nickname: nickname,
      role: 'New Builder',
      email: email,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(nickname)}`,
      points: 0,
      rank: 99,
      status: 'up',
      badges: ['🌱', '🚀']
    }
    user.value = mockUser
    localStorage.setItem('sync_user', JSON.stringify(mockUser))
    router.push('/')
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('sync_user')
    router.push('/')
  }

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  }
})
