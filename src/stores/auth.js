import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '../data/mockData'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // Initialize with dummy data if present in localStorage
  const localSession = localStorage.getItem('sync_user')
  let parsedUser = localSession ? JSON.parse(localSession) : null
  
  // Implicit Migration: Populate GitHub data if missing from older session signatures
  if (parsedUser && !parsedUser.techStack) {
    parsedUser.techStack = ["Vue.js", "React", "Node.js"]
    parsedUser.githubCommits = 142
    parsedUser.githubConnected = true
    localStorage.setItem('sync_user', JSON.stringify(parsedUser))
  }
  
  const user = ref(parsedUser)

  const isAuthenticated = computed(() => !!user.value)

  const login = (email, password) => {
    let mockUser;
    if (email === 'admin@sync.com') {
      mockUser = {
        id: 999,
        nickname: "Sync Admin",
        role: "Global Administrator",
        email: email,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Admin",
        isAdmin: true,
        points: 0,
        rank: 0,
        status: "up",
        badges: ["👑"],
        githubConnected: false,
        techStack: ["DevOps", "Management"],
        githubCommits: 0
      }
    } else {
      mockUser = {
        ...mockUsers[0],
        email: email
      }
    }
    user.value = mockUser
    localStorage.setItem('sync_user', JSON.stringify(mockUser))
    if (mockUser.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
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
      badges: ['🌱', '🚀'],
      githubConnected: true,
      techStack: ["React", "JavaScript", "HTML/CSS"],
      githubCommits: 28
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
