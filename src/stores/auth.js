import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '../data/mockData'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // Version-based session cleanup:
  // If the stored session version doesn't match, clear it once.
  // This ensures old dev sessions are wiped on first load after this update,
  // while allowing normal login sessions to persist across refreshes.
  const SESSION_VERSION = 'v2'
  if (localStorage.getItem('sync_session_version') !== SESSION_VERSION) {
    localStorage.removeItem('sync_user')
    localStorage.setItem('sync_session_version', SESSION_VERSION)
  }
  
  // Restore session if user was previously logged in
  const localSession = localStorage.getItem('sync_user')
  const parsedUser = localSession ? JSON.parse(localSession) : null
  
  const user = ref(parsedUser)

  const isAuthenticated = computed(() => !!user.value)

  const allBadges = [
    { id: '1', name: 'First Commit', icon: '🌱' },
    { id: '2', name: 'Bug Hunter', icon: '🐛' },
    { id: '3', name: 'Top Contributor', icon: '🏆' },
    { id: '4', name: 'Night Owl', icon: '🌙' }
  ]

  const getEarnedBadges = computed(() => {
    if (!user.value?.selectedBadges) return []
    return allBadges.filter(b => user.value.selectedBadges.includes(b.id))
  })

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
        githubCommits: 0,
        profileBorder: null,
        selectedBadges: []
      }
    } else {
      mockUser = {
        ...mockUsers[0],
        email: email,
        profileBorder: mockUsers[0].profileBorder || null
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

  const signup = (nickname, realName, email, password) => {
    // Create an entirely new mock session object
    const mockUser = {
      id: Date.now(),
      nickname: nickname,
      realName: realName,
      role: 'New Builder',
      email: email,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(nickname)}`,
      points: 0,
      rank: 99,
      status: 'up',
      badges: ['🌱', '🚀'],
      githubConnected: true,
      techStack: ["React", "JavaScript", "HTML/CSS"],
      githubCommits: 28,
      profileBorder: null
    }
    user.value = mockUser
    localStorage.setItem('sync_user', JSON.stringify(mockUser))
    router.push('/')
  }

  const updateProfile = (data) => {
    if (!user.value) return
    const updatedUser = { ...user.value, ...data }
    user.value = updatedUser
    localStorage.setItem('sync_user', JSON.stringify(updatedUser))
    
    // Also update mockUsers if it's one of them
    const idx = mockUsers.findIndex(u => u.id === updatedUser.id)
    if (idx !== -1) {
      mockUsers[idx] = { ...mockUsers[idx], ...data }
    }
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
    updateProfile,
    logout
  }
})
