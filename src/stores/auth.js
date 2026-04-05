import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockJoinRequests, mockTeams, mockUsers } from '../data/mockData'
import { normalizeUserDecorations } from '../utils/userDecorations'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const syncNicknameReferences = (previousNickname, nextUser) => {
    if (!previousNickname || !nextUser?.nickname || previousNickname === nextUser.nickname) return

    mockTeams.forEach((team) => {
      const memberIndex = team.members.findIndex((member) => member === previousNickname)
      if (memberIndex !== -1) {
        team.members[memberIndex] = nextUser.nickname
      }
    })

    mockJoinRequests.forEach((request) => {
      if (request.userId === nextUser.id || request.nickname === previousNickname) {
        request.nickname = nextUser.nickname
      }
    })
  }

  const syncSessionUserToMockData = (sessionUser) => {
    if (!sessionUser?.id) return

    const idx = mockUsers.findIndex((mockUser) => mockUser.id === sessionUser.id)
    if (idx === -1) return

    const previousNickname = mockUsers[idx].nickname
    mockUsers[idx] = normalizeUserDecorations({ ...mockUsers[idx], ...sessionUser })
    syncNicknameReferences(previousNickname, mockUsers[idx])
  }
  
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
  const parsedUser = localSession ? normalizeUserDecorations(JSON.parse(localSession)) : null
  if (parsedUser) {
    syncSessionUserToMockData(parsedUser)
    localStorage.setItem('sync_user', JSON.stringify(parsedUser))
  }
  
  const user = ref(parsedUser)

  const isAuthenticated = computed(() => !!user.value)

  const login = (email, password) => {
    let mockUser;
    if (email === 'admin@sync.com') {
      mockUser = normalizeUserDecorations({
        id: 999,
        nickname: "Sync Admin",
        role: "Global Administrator",
        email: email,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Admin",
        isAdmin: true,
        points: 0,
        walletPoints: 0,
        rank: 0,
        status: "up",
        badges: ["👑"],
        githubConnected: false,
        techStack: ["DevOps", "Management"],
        githubCommits: 0,
        profileBorder: null,
        selectedBadges: [],
        ownedItems: [],
        pointHistory: []
      })
    } else {
      mockUser = normalizeUserDecorations({
        ...mockUsers[0],
        email: email
      })
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
    const mockUser = normalizeUserDecorations({
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
      walletPoints: 0,
      techStack: ["React", "JavaScript", "HTML/CSS"],
      githubCommits: 28,
      profileBorder: null,
      selectedBadges: [],
      ownedItems: [],
      pointHistory: [],
      isTimelinePublic: true
    })
    user.value = mockUser
    localStorage.setItem('sync_user', JSON.stringify(mockUser))
    router.push('/')
  }

  const updateProfile = (data) => {
    if (!user.value) return
    const previousNickname = user.value.nickname
    const updatedUser = normalizeUserDecorations({ ...user.value, ...data })
    user.value = updatedUser
    localStorage.setItem('sync_user', JSON.stringify(updatedUser))
    
    // Also update mockUsers if it's one of them
    const idx = mockUsers.findIndex(u => u.id === updatedUser.id)
    if (idx !== -1) {
      mockUsers[idx] = normalizeUserDecorations({ ...mockUsers[idx], ...updatedUser })
    }

    syncNicknameReferences(previousNickname, updatedUser)
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
