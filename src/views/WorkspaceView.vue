<script setup>
import { computed, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink, onBeforeRouteLeave } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { mockHackathons, mockTeams, mockUsers, mockGlobalSubmissions, mockWorkspaceChats } from '../data/mockData'
import UserAvatar from '../components/UserAvatar.vue'
import UserBadgeStrip from '../components/UserBadgeStrip.vue'
import {
  formatReviewDate,
  getSubmissionRewardForUser,
  getSubmissionRewardTotal
} from '../utils/submissionReview'

const route = useRoute()
const router = useRouter()

const team = computed(() => mockTeams.find(t => String(t.id) === route.params.slug) || mockTeams[0])
const hackathon = computed(() => mockHackathons.find(h => h.id === team.value.hackathonId) || mockHackathons[0])
const authStore = useAuthStore()

const syncedUsers = computed(() => {
  const users = [...mockUsers]

  if (authStore.user) {
    const idx = users.findIndex((user) => user.id === authStore.user.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...authStore.user }
    } else {
      users.unshift(authStore.user)
    }
  }

  return users
})

const teamMembers = computed(() => {
  if (!team.value) return []
  const memberNames = team.value.members || []
  const members = memberNames
    .map((memberName) => syncedUsers.value.find((user) => user.nickname === memberName))
    .filter(Boolean)

  if (authStore.user && team.value.leaderId === authStore.user.id && !members.some((user) => user.id === authStore.user.id)) {
    members.unshift(authStore.user)
  }

  return members
})

const isCurrentUser = (user) => {
  return !!authStore.user && user.id === authStore.user.id
}

const currentUser = computed(() => {
  if (!authStore.user?.id) return null
  return syncedUsers.value.find((user) => user.id === authStore.user.id) || authStore.user
})

const isTeamParticipant = computed(() => {
  if (!currentUser.value) return false
  return teamMembers.value.some((user) => user.id === currentUser.value.id)
})

// ─── GitHub ────────────────────────────────────────────
const githubRepoUrl = ref(team.value?.githubUrl || '')
const githubRepoInput = ref('')
const showGithubInput = ref(false)

const saveGithubRepo = () => {
  if (githubRepoInput.value.trim()) {
    githubRepoUrl.value = githubRepoInput.value.trim()
    showGithubInput.value = false
  }
}

// Mock contribution data generator
const generateContribs = (seed) => {
  const weeks = 10, days = 7
  const result = []
  for (let w = 0; w < weeks; w++) {
    const week = []
    for (let d = 0; d < days; d++) {
      const rand = ((seed * (w * 7 + d + 1)) % 5)
      week.push(rand)
    }
    result.push(week)
  }
  return result
}

const contribColor = (val) => {
  if (val === 0) return 'bg-black/5 dark:bg-white/5 border border-sync-border'
  if (val <= 1) return 'bg-teal-500/20 dark:bg-teal-900/30 border border-teal-500/10'
  if (val <= 2) return 'bg-teal-500/40 dark:bg-teal-700/40 border border-teal-500/20'
  if (val <= 3) return 'bg-teal-500/70 dark:bg-teal-500/60'
  return 'bg-teal-500 dark:bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.4)]'
}

// ─── Tab ───────────────────────────────────────────────
const activeTab = ref('board')

const latestSubmission = computed(() => {
  return [...mockGlobalSubmissions]
    .filter((submission) => submission.teamId === team.value.id && submission.hackathonId === hackathon.value.id)
    .sort((left, right) => right.id - left.id)[0] || null
})

const isSubmissionReviewed = computed(() => {
  return ['심사 완료', '수상'].includes(latestSubmission.value?.status)
})

const teamRewardTotal = computed(() => {
  return latestSubmission.value ? getSubmissionRewardTotal(latestSubmission.value) : 0
})

const myReviewReward = computed(() => {
  if (!latestSubmission.value || !currentUser.value) return null
  return getSubmissionRewardForUser(latestSubmission.value, currentUser.value.id)
})

const reviewStatusClass = (status) => {
  const map = {
    '심사 전': 'text-sync-muted bg-black/5 dark:bg-white/5 border-sync-border',
    '심사 중': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    '심사 완료': 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    '수상': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
  }

  return map[status] || map['심사 전']
}

// ─── Workspace Chat ────────────────────────────────────
const activeChatRoomId = ref('')
const chatDraft = ref('')
const isChatPopupOpen = ref(false)
const isChatComposing = ref(false)
const isDraggingChatPopup = ref(false)
const simulatedReadReceiptTimers = new Map()
const recentChatSend = ref({ roomId: null, text: '', at: 0 })
const chatMessageViewport = ref(null)
const chatPopupPanel = ref(null)
const chatPopupOffset = ref({ x: 0, y: 0 })
const chatPopupDragState = ref(null)
const CHAT_POPUP_MARGIN = 16

const formatChatTimestamp = (date = new Date()) => {
  const targetDate = new Date(date)
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const hours = String(targetDate.getHours()).padStart(2, '0')
  const minutes = String(targetDate.getMinutes()).padStart(2, '0')

  return `${year}.${month}.${day} ${hours}:${minutes}`
}

const normalizeReadBy = (message, participantIds = []) => {
  if (!message) return

  const allowedParticipantIds = new Set(participantIds)
  const normalizedReadBy = []
  const seenUserIds = new Set()

  ;(Array.isArray(message.readBy) ? message.readBy : []).forEach((entry) => {
    const userId = Number(entry?.userId)
    if (!allowedParticipantIds.has(userId) || seenUserIds.has(userId)) return

    normalizedReadBy.push({
      userId,
      readAt: entry?.readAt || message.sentAt || formatChatTimestamp()
    })
    seenUserIds.add(userId)
  })

  const senderId = Number(message.senderId)
  if (allowedParticipantIds.has(senderId) && !seenUserIds.has(senderId)) {
    normalizedReadBy.unshift({
      userId: senderId,
      readAt: message.sentAt || formatChatTimestamp()
    })
  }

  message.readBy = normalizedReadBy
}

const normalizeRoomMessages = (room) => {
  if (!room) return
  room.messages = (room.messages || []).map((message) => {
    normalizeReadBy(message, room.participantIds || [])
    return message
  })
}

const isMessageReadByUser = (message, userId) => {
  if (!message || !userId) return false
  return (message.readBy || []).some((entry) => entry.userId === userId)
}

const upsertMessageRead = (message, userId, readAt = formatChatTimestamp()) => {
  if (!message || !userId) return

  if (!Array.isArray(message.readBy)) {
    message.readBy = []
  }

  const existingRead = message.readBy.find((entry) => entry.userId === userId)
  if (existingRead) {
    existingRead.readAt = readAt
    return
  }

  message.readBy.push({ userId, readAt })
}

const markRoomAsRead = (room, userId) => {
  if (!room || !userId) return

  const readAt = formatChatTimestamp()
  normalizeRoomMessages(room)

  room.messages.forEach((message) => {
    if (message.senderId === userId) return
    upsertMessageRead(message, userId, readAt)
  })
}

const scheduleSimulatedReadReceipts = (room, message) => {
  if (!room || !message) return

  room.participantIds
    .filter((userId) => userId !== message.senderId)
    .forEach((userId, index) => {
      const timerKey = `${room.id}:${message.id}:${userId}`
      if (simulatedReadReceiptTimers.has(timerKey)) return

      const delay = room.type === 'dm' ? 1200 : 1200 + index * 700
      const timerId = window.setTimeout(() => {
        upsertMessageRead(message, userId, formatChatTimestamp())
        simulatedReadReceiptTimers.delete(timerKey)
      }, delay)

      simulatedReadReceiptTimers.set(timerKey, timerId)
    })
}

const syncWorkspaceChatRooms = () => {
  if (!team.value?.id) return

  const participantIds = teamMembers.value.map((member) => member.id)
  if (!participantIds.length) return

  const groupRoomId = `team-${team.value.id}-group`
  const existingGroupRoom = mockWorkspaceChats.find((room) => room.id === groupRoomId)

  if (!existingGroupRoom) {
    mockWorkspaceChats.push({
      id: groupRoomId,
      teamId: team.value.id,
      type: 'group',
      name: '팀 전체 채팅',
      participantIds: [...participantIds],
      messages: [
        {
          id: Date.now(),
          senderId: participantIds[0],
          text: `${team.value.teamName} 워크스페이스 채팅이 열렸습니다. 팀 소통은 이곳에서 이어가세요.`,
          type: 'notice',
          sentAt: formatChatTimestamp(),
          readBy: [
            {
              userId: participantIds[0],
              readAt: formatChatTimestamp()
            }
          ]
        }
      ]
    })
  } else {
    existingGroupRoom.participantIds = [...new Set(participantIds)]
  }

  mockWorkspaceChats
    .filter((room) => room.teamId === team.value.id && room.type === 'dm')
    .forEach((room) => {
      room.participantIds = room.participantIds.filter((id) => participantIds.includes(id))
    })

  mockWorkspaceChats
    .filter((room) => room.teamId === team.value.id)
    .forEach((room) => normalizeRoomMessages(room))
}

watch(
  [() => team.value?.id, () => teamMembers.value.map((member) => member.id).join(',')],
  () => {
    syncWorkspaceChatRooms()
  },
  { immediate: true }
)

const workspaceChatRooms = computed(() => {
  const visibleRooms = mockWorkspaceChats.filter((room) => {
    if (room.teamId !== team.value.id) return false
    if (room.type === 'group') return true
    return !!currentUser.value && room.participantIds.includes(currentUser.value.id)
  })

  return [...visibleRooms].sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === 'group' ? -1 : 1
    }

    const leftTimestamp = left.messages?.at(-1)?.sentAt || ''
    const rightTimestamp = right.messages?.at(-1)?.sentAt || ''
    return rightTimestamp.localeCompare(leftTimestamp)
  })
})

const totalUnreadChatCount = computed(() => {
  return workspaceChatRooms.value.reduce((total, room) => {
    if (!currentUser.value) return total

    const unreadCount = (room.messages || []).filter((message) => {
      return message.senderId !== currentUser.value.id && !isMessageReadByUser(message, currentUser.value.id)
    }).length

    return total + unreadCount
  }, 0)
})

watch(
  workspaceChatRooms,
  (rooms) => {
    if (!rooms.some((room) => room.id === activeChatRoomId.value)) {
      activeChatRoomId.value = rooms[0]?.id || ''
    }
  },
  { immediate: true }
)

const activeChatRoom = computed(() => {
  return workspaceChatRooms.value.find((room) => room.id === activeChatRoomId.value) || null
})

const chatPopupStyle = computed(() => {
  return {
    transform: `translate(${chatPopupOffset.value.x}px, ${chatPopupOffset.value.y}px)`
  }
})

const openChatPopup = (roomId = activeChatRoomId.value || workspaceChatRooms.value[0]?.id) => {
  if (roomId) {
    activeChatRoomId.value = roomId
  }

  isChatPopupOpen.value = true
}

const closeChatPopup = () => {
  isChatPopupOpen.value = false
}

const scrollChatToBottom = () => {
  const viewport = chatMessageViewport.value
  if (!viewport) return

  viewport.scrollTop = viewport.scrollHeight
}

const clampChatPopupOffset = () => {
  const panel = chatPopupPanel.value
  if (!panel) return

  const rect = panel.getBoundingClientRect()
  let nextOffsetX = chatPopupOffset.value.x
  let nextOffsetY = chatPopupOffset.value.y

  if (rect.left < CHAT_POPUP_MARGIN) {
    nextOffsetX += CHAT_POPUP_MARGIN - rect.left
  } else if (rect.right > window.innerWidth - CHAT_POPUP_MARGIN) {
    nextOffsetX -= rect.right - (window.innerWidth - CHAT_POPUP_MARGIN)
  }

  if (rect.top < CHAT_POPUP_MARGIN) {
    nextOffsetY += CHAT_POPUP_MARGIN - rect.top
  } else if (rect.bottom > window.innerHeight - CHAT_POPUP_MARGIN) {
    nextOffsetY -= rect.bottom - (window.innerHeight - CHAT_POPUP_MARGIN)
  }

  if (nextOffsetX !== chatPopupOffset.value.x || nextOffsetY !== chatPopupOffset.value.y) {
    chatPopupOffset.value = { x: nextOffsetX, y: nextOffsetY }
  }
}

const stopChatPopupDrag = () => {
  isDraggingChatPopup.value = false
  chatPopupDragState.value = null
  window.removeEventListener('pointermove', handleChatPopupDrag)
  window.removeEventListener('pointerup', stopChatPopupDrag)
  window.removeEventListener('pointercancel', stopChatPopupDrag)
}

const handleChatPopupDrag = (event) => {
  const dragState = chatPopupDragState.value
  if (!dragState) return

  const deltaX = event.clientX - dragState.startX
  const deltaY = event.clientY - dragState.startY
  const maxLeft = Math.max(CHAT_POPUP_MARGIN, window.innerWidth - dragState.width - CHAT_POPUP_MARGIN)
  const maxTop = Math.max(CHAT_POPUP_MARGIN, window.innerHeight - dragState.height - CHAT_POPUP_MARGIN)
  const nextLeft = Math.min(maxLeft, Math.max(CHAT_POPUP_MARGIN, dragState.left + deltaX))
  const nextTop = Math.min(maxTop, Math.max(CHAT_POPUP_MARGIN, dragState.top + deltaY))

  chatPopupOffset.value = {
    x: dragState.startOffsetX + (nextLeft - dragState.left),
    y: dragState.startOffsetY + (nextTop - dragState.top)
  }
}

const startChatPopupDrag = (event) => {
  if (event.button !== 0) return

  const panel = chatPopupPanel.value
  if (!panel) return

  const rect = panel.getBoundingClientRect()
  chatPopupDragState.value = {
    startX: event.clientX,
    startY: event.clientY,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    startOffsetX: chatPopupOffset.value.x,
    startOffsetY: chatPopupOffset.value.y
  }

  isDraggingChatPopup.value = true
  window.addEventListener('pointermove', handleChatPopupDrag)
  window.addEventListener('pointerup', stopChatPopupDrag)
  window.addEventListener('pointercancel', stopChatPopupDrag)
}

watch(
  [activeChatRoom, currentUser],
  ([room, user]) => {
    if (!room || !user) return
    markRoomAsRead(room, user.id)
  },
  { immediate: true }
)

watch(
  [isChatPopupOpen, () => activeChatRoom.value?.messages?.length, () => activeChatRoomId.value],
  async ([isOpen]) => {
    if (!isOpen) return
    await nextTick()
    clampChatPopupOffset()
    scrollChatToBottom()
  }
)

const getDmPartner = (room) => {
  if (!room || room.type !== 'dm' || !currentUser.value) return null
  const partnerId = room.participantIds.find((participantId) => participantId !== currentUser.value.id)
  return syncedUsers.value.find((user) => user.id === partnerId) || null
}

const getRoomLabel = (room) => {
  if (!room) return ''
  if (room.type === 'group') return room.name
  return getDmPartner(room)?.nickname || room.name
}

const getRoomMeta = (room) => {
  if (!room) return ''
  if (room.type === 'group') return `${room.participantIds.length}명 참여 중`

  const partner = getDmPartner(room)
  return partner?.role || '1:1 대화'
}

const getLastMessagePreview = (room) => {
  return room?.messages?.at(-1)?.text || '아직 대화가 없습니다.'
}

const isNoticeMessage = (message) => {
  if (!message) return false
  if (message.type === 'notice') return true

  return /채팅이 시작되었습니다|워크스페이스 채팅이 열렸습니다/.test(message.text || '')
}

const hasUnreadMessages = (room) => {
  if (!room || !currentUser.value) return false

  return (room.messages || []).some((message) => {
    return message.senderId !== currentUser.value.id && !isMessageReadByUser(message, currentUser.value.id)
  })
}

const getMessageSender = (message) => {
  return syncedUsers.value.find((user) => user.id === message.senderId) || null
}

const isOwnMessage = (message) => {
  return !!currentUser.value && message.senderId === currentUser.value.id
}

const getGroupReadUsers = (message, room) => {
  if (!message || !room) return []

  return (room.participantIds || [])
    .filter((userId) => userId !== message.senderId && isMessageReadByUser(message, userId))
    .map((userId) => syncedUsers.value.find((user) => user.id === userId))
    .filter(Boolean)
}

const getGroupReadLabel = (message, room) => {
  const readUsers = getGroupReadUsers(message, room)
  if (!readUsers.length) return '아직 읽은 팀원이 없습니다.'

  if (readUsers.length <= 2) {
    return readUsers.map((user) => user.nickname).join(', ')
  }

  return `${readUsers.slice(0, 2).map((user) => user.nickname).join(', ')} 외 ${readUsers.length - 2}명`
}

const getDirectReadLabel = (message, room) => {
  if (!message || !room || room.type !== 'dm' || !isOwnMessage(message)) return ''

  const partner = getDmPartner(room)
  if (!partner) return ''

  return isMessageReadByUser(message, partner.id) ? `읽음 · ${partner.nickname}` : '전송됨'
}

const openDirectMessage = (member) => {
  if (!currentUser.value || currentUser.value.id === member.id) return

  const participantIds = [currentUser.value.id, member.id].sort((left, right) => left - right)
  const roomId = `team-${team.value.id}-dm-${participantIds.join('-')}`
  let room = mockWorkspaceChats.find((candidate) => candidate.id === roomId)

  if (!room) {
    room = {
      id: roomId,
      teamId: team.value.id,
      type: 'dm',
      name: `${currentUser.value.nickname} · ${member.nickname}`,
      participantIds,
      messages: [
        {
          id: Date.now(),
          senderId: currentUser.value.id,
          text: `${member.nickname}님과의 1:1 채팅이 시작되었습니다.`,
          type: 'notice',
          sentAt: formatChatTimestamp(),
          readBy: [
            {
              userId: currentUser.value.id,
              readAt: formatChatTimestamp()
            }
          ]
        }
      ]
    }
    mockWorkspaceChats.push(room)
    normalizeRoomMessages(room)
  }

  openChatPopup(room.id)
}

const sendChatMessage = () => {
  if (!currentUser.value || !activeChatRoom.value || !chatDraft.value.trim()) return
  if (isChatComposing.value) return

  const trimmedMessage = chatDraft.value.trim()
  const now = Date.now()
  const roomId = activeChatRoom.value.id

  if (
    recentChatSend.value.roomId === roomId &&
    recentChatSend.value.text === trimmedMessage &&
    now - recentChatSend.value.at < 500
  ) {
    return
  }

  const nextMessage = {
    id: now,
    senderId: currentUser.value.id,
    text: trimmedMessage,
    sentAt: formatChatTimestamp(),
    readBy: [
      {
        userId: currentUser.value.id,
        readAt: formatChatTimestamp()
      }
    ]
  }

  activeChatRoom.value.messages.push(nextMessage)
  scheduleSimulatedReadReceipts(activeChatRoom.value, nextMessage)
  recentChatSend.value = { roomId, text: trimmedMessage, at: now }

  chatDraft.value = ''
}

const handleChatKeydown = (event) => {
  if (event.key !== 'Enter' || event.shiftKey) return
  if (event.isComposing || isChatComposing.value || event.repeat) return

  event.preventDefault()
  sendChatMessage()
}

onBeforeUnmount(() => {
  stopChatPopupDrag()
  simulatedReadReceiptTimers.forEach((timerId) => window.clearTimeout(timerId))
  simulatedReadReceiptTimers.clear()
})

// ─── Sprint Board ───────────────────────────────────────
const tasks = ref([
  { id: 1, title: '웹소켓 통신 인터페이스 구축', status: 'In Progress', assignee: 'Alex_Dev', priority: 'High', due: '2026.04.10', desc: '실시간 채팅 및 협업을 위한 소켓 모듈 구현' },
  { id: 2, title: '컴포넌트 구조 설계서 작성', status: 'Done', assignee: '건축가_Kim', priority: 'High', due: '2026.04.08', desc: '프론트 아키텍처 문서화' },
  { id: 3, title: '메인 랜딩페이지 퍼블리싱', status: 'To Do', assignee: 'Web3_Ninja', priority: 'Medium', due: '2026.04.12', desc: '디자인 시안 기반 반응형 퍼블리싱' }
])

const STATUSES = ['To Do', 'In Progress', 'Done']

// Task modal
const isTaskModalOpen = ref(false)
const editingTask = ref(null)
const taskForm = ref({ title: '', status: 'To Do', assignee: '', priority: 'Medium', due: '', desc: '' })

const openNewTask = (status = 'To Do') => {
  editingTask.value = null
  taskForm.value = { title: '', status, assignee: '', priority: 'Medium', due: '', desc: '' }
  isTaskModalOpen.value = true
}

const openEditTask = (task) => {
  editingTask.value = task
  taskForm.value = { ...task }
  isTaskModalOpen.value = true
}

const saveTask = () => {
  if (!taskForm.value.title.trim()) return
  if (editingTask.value) {
    const idx = tasks.value.findIndex(t => t.id === editingTask.value.id)
    if (idx !== -1) tasks.value[idx] = { ...taskForm.value, id: editingTask.value.id }
  } else {
    tasks.value.push({ ...taskForm.value, id: Date.now() })
  }
  isTaskModalOpen.value = false
}

const deleteTask = (id) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

const moveTaskStatus = (task, dir) => {
  const idx = STATUSES.indexOf(task.status)
  const next = STATUSES[idx + dir]
  if (next) task.status = next
}

// Close all modals before navigating away to prevent Vue Transition crash
onBeforeRouteLeave(() => {
  stopChatPopupDrag()
  isTaskModalOpen.value = false
  isEditorOpen.value = false
  isNewDocModalOpen.value = false
  isUploadModalOpen.value = false
  isSubmitModalOpen.value = false
  isChatPopupOpen.value = false
})

// ─── Documents ─────────────────────────────────────────
const documents = ref([
  { id: 1, name: '서비스 기획 및 요구사항 정의서', type: '기획서', updated: '2시간 전', content: '# 서비스 기획서\n\n## 개요\n\n본 문서는 서비스의 핵심 요구사항을 정의합니다.\n\n## 주요 기능\n\n- 실시간 협업 대시보드\n- 팀 스프린트 보드\n- 문서 공동 편집\n\n## 기술 스택\n\n- Vue.js 3\n- Supabase\n- Tailwind CSS' },
  { id: 2, name: '초기 아키텍처 설계 문서', type: '디자인', updated: '1일 전', content: '# 아키텍처 설계\n\n## 시스템 구성도\n\n프론트엔드 → API Gateway → Supabase\n\n## 컴포넌트 구조\n\n- NavBar\n- WorkspaceView\n- SprintBoard\n- DocEditor' }
])

const isEditorOpen = ref(false)
const isNewDocModalOpen = ref(false)
const newDocName = ref('')
const currentDoc = ref(null)
const editorContent = ref('')
const isSaved = ref(true)

const openEditor = (doc) => {
  currentDoc.value = doc
  editorContent.value = doc.content || ''
  isSaved.value = true
  isEditorOpen.value = true
}

const openNewDocModal = () => {
  newDocName.value = ''
  isNewDocModalOpen.value = true
}

const createNewDoc = () => {
  if (!newDocName.value.trim()) return
  const doc = { id: Date.now(), name: newDocName.value.trim(), type: '문서', updated: '방금 전', content: `# ${newDocName.value.trim()}\n\n내용을 작성하세요.` }
  documents.value.unshift(doc)
  isNewDocModalOpen.value = false
  openEditor(doc)
}

const saveDoc = () => {
  if (currentDoc.value) {
    const idx = documents.value.findIndex(d => d.id === currentDoc.value.id)
    if (idx !== -1) {
      documents.value[idx].content = editorContent.value
      documents.value[idx].updated = '방금 전'
    }
    isSaved.value = true
  }
}

const onEditorInput = () => { isSaved.value = false }

const insertFormat = (prefix, suffix = '') => {
  const ta = document.getElementById('doc-editor-textarea')
  if (!ta) return
  const start = ta.selectionStart, end = ta.selectionEnd
  const sel = editorContent.value.slice(start, end)
  editorContent.value = editorContent.value.slice(0, start) + prefix + sel + suffix + editorContent.value.slice(end)
  isSaved.value = false
  setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, end + prefix.length) }, 0)
}

const deleteDocument = (id) => {
  if (confirm('정말 이 문서를 삭제하시겠습니까?')) {
    documents.value = documents.value.filter(d => d.id !== id)
  }
}

// Upload modal
const isUploadModalOpen = ref(false)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadedFile = ref(null)

const handleDrop = (e) => {
  e.preventDefault(); isDragging.value = false
  if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0])
}
const handleFileSelect = (e) => { if (e.target.files?.length) processFile(e.target.files[0]) }
const processFile = (file) => {
  uploadedFile.value = file; isUploading.value = true
  let p = 0
  const iv = setInterval(() => {
    p += 10; uploadProgress.value = p
    if (p >= 100) { clearInterval(iv); setTimeout(completeUpload, 500) }
  }, 150)
}
const completeUpload = () => {
  if (uploadedFile.value) {
    const ext = uploadedFile.value.name.split('.').pop().toLowerCase()
    const type = ext === 'pdf' ? '기획서' : ['fig','png','jpg'].includes(ext) ? '디자인' : '문서'
    documents.value.unshift({ id: Date.now(), name: uploadedFile.value.name, type, updated: '방금 전', content: '' })
  }
  isUploadModalOpen.value = false; isUploading.value = false; uploadProgress.value = 0; uploadedFile.value = null
}

// Final submit
const isSubmitModalOpen = ref(false)
const submitForm = ref({ projectName: '', description: '', link: '', selectedDocs: [] })
const openSubmitModal = () => { submitForm.value = { projectName: '', description: '', link: '', selectedDocs: [] }; isSubmitModalOpen.value = true }
const handleFinalSubmit = () => {
  if (!submitForm.value.projectName || !submitForm.value.description) { alert('프로젝트 명과 상세 설명을 입력해주세요.'); return }
  const selectedDocs = documents.value.filter((doc) => submitForm.value.selectedDocs.includes(doc.id))
  const existingSubmission = mockGlobalSubmissions.find((submission) => submission.teamId === team.value.id && submission.hackathonId === hackathon.value.id)
  const nextSubmission = {
    id: existingSubmission?.id || Date.now(),
    hackathonId: hackathon.value.id,
    teamId: team.value.id,
    teamName: team.value.teamName,
    projectName: submitForm.value.projectName,
    description: submitForm.value.description,
    submittedAt: formatReviewDate(),
    status: '심사 전',
    score: null,
    detailedScores: {},
    award: null,
    review: null,
    reviewedAt: null,
    rewardDistribution: [],
    rewardsApplied: false,
    links: [submitForm.value.link].filter(Boolean),
    files: selectedDocs.map((doc) => ({
      name: doc.name,
      size: '업로드 완료',
      type: doc.type
    })),
    members: teamMembers.value.map((member) => ({
      nickname: member.nickname,
      role: member.role,
      avatar: member.avatar
    })),
    tasks: tasks.value.map((task) => ({ ...task })),
    documents: documents.value.map((doc) => ({
      name: doc.name,
      type: doc.type,
      updated: doc.updated
    }))
  }

  if (existingSubmission) {
    Object.assign(existingSubmission, nextSubmission)
  } else {
    mockGlobalSubmissions.push(nextSubmission)
  }

  alert('최종 제출이 완료되었습니다. 심사 결과는 워크스페이스와 마이페이지에서 확인할 수 있습니다.')
  isSubmitModalOpen.value = false
}

const docTypeIcon = (type) => type === '기획서' ? '📄' : type === '디자인' ? '🎨' : '📝'
const priorityClass = (p) => p === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : p === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
const statusClass = (s) => s === 'In Progress' ? 'text-teal-500 bg-teal-500/10 border-teal-500/20' : s === 'Done' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : 'text-sync-muted bg-black/10 dark:bg-white/10 border-sync-border'

// Timeline Status Logic
const getTimelineStatus = (dateStr) => {
  if (!dateStr) return { label: '예정', color: 'text-sync-muted bg-black/10' }
  
  const now = new Date()
  const parts = dateStr.split(' - ')
  
  // Handle single date or range
  const startStr = parts[0].trim().replace(/\./g, '-')
  const endPart = (parts[1] || parts[0]).trim()
  const endStr = endPart.length <= 5 ? startStr.substring(0, 5) + endPart.replace(/\./g, '-') : endPart.replace(/\./g, '-')
  
  const startDate = new Date(startStr)
  const endDate = new Date(endStr)
  endDate.setHours(23, 59, 59) // End of the day

  if (now < startDate) {
    return { label: '예정', color: 'text-blue-500 bg-blue-500/10 border border-blue-500/20' }
  } else if (now > endDate) {
    return { label: '마감됨', color: 'text-gray-400 bg-gray-500/10 border border-gray-500/20' }
  } else {
    // Check if it's "Closing Soon" (within 2 days of endDate)
    const diffTime = endDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 2) {
      return { label: '곧 마감됨', color: 'text-amber-500 bg-amber-500/10 border border-amber-500/20 animate-pulse' }
    }
    return { label: '진행 중', color: 'text-teal-500 bg-teal-500/10 border border-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.2)]' }
  }
}

</script>

<template>
  <div class="max-w-[1240px] mx-auto px-4 py-8 animate-fade-in min-h-[calc(100vh-4rem)]">

    <!-- Header -->
    <button @click="router.push('/mypage')" class="text-xs font-bold text-sync-muted hover:text-sync-text mb-6 flex items-center gap-2 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
      돌아가기
    </button>

    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-outfit font-black text-sync-text">{{ team.teamName }} <span class="text-xl text-sync-muted font-medium ml-2">Workspace</span></h1>
        <p class="text-sm font-medium text-sync-muted mt-2 border border-sync-border px-3 py-1 rounded bg-black/5 dark:bg-white/5 inline-block">{{ hackathon.title }} 전용 협업 공간</p>
      </div>
      <button @click="openSubmitModal" class="px-5 py-2.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-xs font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
        🚀 최종 제출
      </button>
    </div>

    <!-- Main Layout: Sidebar + Main Content -->
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-4">
      
      <!-- LEFT SIDEBAR -->
      <div class="w-full lg:w-80 shrink-0 flex flex-col gap-8">
         
         <!-- Timeline Card -->
         <div class="glass-card p-6 md:p-8 rounded-[2rem] border border-sync-border flex flex-col gap-6 shadow-sm">
           <h2 class="text-xl font-bold text-sync-text mb-2">⏳ 진행 상황</h2>
           <div class="relative flex flex-col gap-8 pl-2">
             <div class="absolute left-[19px] top-2 bottom-2 w-0.5 bg-sync-border/50 border-l border-dashed border-sync-border"></div>
             <div v-for="(item, idx) in hackathon.timeline" :key="idx" class="relative pl-10 group">
               <div class="absolute left-0 top-1 w-5 h-5 rounded-full bg-sync-bg border-4 flex items-center justify-center transition-all duration-500 z-10"
                    :class="getTimelineStatus(item.date).label === '진행 중' ? 'border-sync-primary shadow-[0_0_12px_rgba(50,132,255,0.4)]' : getTimelineStatus(item.date).label === '곧 마감됨' ? 'border-amber-500' : 'border-sync-border'">
                 <div v-if="getTimelineStatus(item.date).label === '진행 중'" class="w-1.5 h-1.5 rounded-full bg-sync-primary animate-pulse"></div>
               </div>
               <div class="flex flex-col gap-1.5">
                 <span class="text-[11px] font-bold text-sync-muted uppercase tracking-widest">{{ item.date }}</span>
                 <h4 class="text-[15px] font-bold text-sync-text">{{ item.step }}</h4>
                 <span class="inline-flex items-center gap-1.5 w-max px-2.5 py-1 rounded-full text-[10px] font-bold border mt-0.5"
                       :class="{
                         'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20': getTimelineStatus(item.date).label === '진행 중',
                         'text-amber-500 bg-amber-500/10 border-amber-500/20': getTimelineStatus(item.date).label === '곧 마감됨',
                         'text-blue-500 bg-blue-500/10 border-blue-500/20': getTimelineStatus(item.date).label === '예정',
                         'text-gray-400 bg-gray-500/10 border-gray-500/20': getTimelineStatus(item.date).label === '마감됨'
                       }">
                   <span v-if="getTimelineStatus(item.date).label === '진행 중'" class="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                   {{ getTimelineStatus(item.date).label }}
                 </span>
               </div>
             </div>
             <div v-if="!hackathon.timeline?.length" class="text-sync-muted text-sm font-bold">등록된 상세 일정이 없습니다.</div>
           </div>
         </div>

         <!-- Members Card -->
         <div class="glass-card p-6 md:p-8 rounded-[2rem] border border-sync-border flex flex-col gap-6 shadow-sm">
           <div class="flex justify-between items-center mb-2">
             <h2 class="text-xl font-bold text-sync-text">👥 팀 멤버</h2>
             <span class="text-sm font-bold text-sync-muted bg-black/5 border border-sync-border px-3 py-1 rounded-lg">{{ teamMembers.length }}명</span>
           </div>
           <div class="flex flex-col gap-3">
             <div v-for="user in teamMembers" :key="user.id"
                  class="flex items-center gap-4 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-sync-border hover:border-sync-primary/40 hover:bg-black/10 transition-colors cursor-pointer group"
                  @click="router.push(`/user/${user.id}`)">
               <UserAvatar
                 :user="user"
                 size-class="w-12 h-12"
                 avatar-class="border-2 border-white dark:border-[#181A20] shadow-sm"
                 image-class="group-hover:scale-105 transition-transform"
               />
               <div class="flex flex-col flex-1 min-w-0">
                 <div class="flex items-center gap-2 min-w-0">
                   <span class="text-[15px] font-bold text-sync-text group-hover:text-sync-primary transition-colors truncate">{{ user.nickname }}</span>
                   <span v-if="isCurrentUser(user)" class="shrink-0 rounded-full bg-sync-primary/10 px-2 py-0.5 text-[10px] font-black text-sync-primary border border-sync-primary/20">나</span>
                 </div>
                 <UserBadgeStrip
                   :badge-ids="user.selectedBadges || []"
                   size="xs"
                   badge-class="bg-black/5 dark:bg-white/10 border-sync-border"
                 />
                 <span class="text-[12px] text-sync-muted font-medium truncate mt-0.5">{{ user.role }}</span>
               </div>
               <button
                 v-if="isTeamParticipant && !isCurrentUser(user)"
                 @click.stop="openDirectMessage(user)"
                 class="shrink-0 rounded-xl border border-sync-border px-3 py-2 text-[11px] font-bold text-sync-muted hover:border-sync-primary/40 hover:text-sync-primary transition-colors"
               >
                 1:1 채팅
               </button>
             </div>
           </div>
         </div>
         <!-- GitHub Repo Card -->
         <div class="glass-card p-6 md:p-7 rounded-[2rem] border border-sync-border flex flex-col gap-4 shadow-sm">
           <div class="flex items-center justify-between">
             <div class="flex items-center gap-2">
               <svg class="w-5 h-5 text-sync-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
               <h2 class="text-base font-bold text-sync-text">GitHub 레포지토리</h2>
             </div>
             <button @click="showGithubInput = !showGithubInput" class="text-xs font-bold text-sync-primary hover:underline">{{ githubRepoUrl ? '변경' : '+ 연결' }}</button>
           </div>

           <!-- URL Input -->
           <div v-if="showGithubInput" class="flex gap-2">
             <input v-model="githubRepoInput" type="url" placeholder="https://github.com/..." class="flex-1 bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl px-3 py-2 text-sm text-sync-text outline-none focus:border-sync-primary">
             <button @click="saveGithubRepo" class="px-4 py-2 bg-sync-primary text-white text-xs font-bold rounded-xl hover:bg-sync-primaryHover transition-colors">저장</button>
           </div>

           <!-- Repo Link Display -->
           <a v-if="githubRepoUrl && !showGithubInput" :href="githubRepoUrl" target="_blank"
              class="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-sync-border hover:border-sync-primary/40 transition-colors text-sm font-bold text-sync-text hover:text-sync-primary truncate">
             <svg class="w-4 h-4 shrink-0 text-sync-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
             <span class="truncate">{{ githubRepoUrl.replace('https://', '') }}</span>
           </a>
           <p v-else-if="!githubRepoUrl && !showGithubInput" class="text-xs text-sync-muted">팀 GitHub 레포지토리를 연결하여 팀원들과 코드를 공유하세요.</p>
         </div>

      </div>

      <!-- RIGHT MAIN CONTENT -->
      <div class="flex-1 flex flex-col min-w-0 gap-6">

        <div
          v-if="latestSubmission"
          class="glass-card overflow-hidden rounded-[2rem] border border-sync-border shadow-sm"
        >
          <div class="bg-gradient-to-r from-sync-primary/10 via-transparent to-transparent px-6 py-5 border-b border-sync-border">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div class="flex flex-col gap-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-white dark:bg-[#10131A] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-sync-primary border border-sync-primary/20">심사 결과 알림</span>
                  <span class="rounded-full border px-3 py-1 text-[11px] font-bold" :class="reviewStatusClass(latestSubmission.status || '심사 전')">
                    {{ latestSubmission.status || '심사 전' }}
                  </span>
                  <span v-if="latestSubmission.award" class="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold text-yellow-500">
                    🏆 {{ latestSubmission.award }}
                  </span>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-sync-text">{{ latestSubmission.projectName }}</h3>
                  <p class="mt-2 max-w-3xl text-sm leading-relaxed text-sync-muted">
                    {{ isSubmissionReviewed
                      ? (latestSubmission.review || '심사 결과가 등록되었습니다. 팀원별 지급 포인트와 총평을 확인해보세요.')
                      : '최종 결과물이 접수되었습니다. 어드민 심사 완료 후 이 영역에 결과가 공지됩니다.' }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 xl:min-w-[320px]">
                <div class="rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 px-4 py-3">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-sync-muted">제출일</span>
                  <p class="mt-1 text-sm font-bold text-sync-text">{{ latestSubmission.submittedAt }}</p>
                </div>
                <div class="rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 px-4 py-3">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-sync-muted">결과 발표</span>
                  <p class="mt-1 text-sm font-bold text-sync-text">{{ latestSubmission.reviewedAt || '심사 진행 중' }}</p>
                </div>
                <div class="rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 px-4 py-3">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-sync-muted">팀 지급 포인트</span>
                  <p class="mt-1 text-sm font-black text-sync-primary">{{ teamRewardTotal ? `${teamRewardTotal.toLocaleString()} PTS` : '발표 전' }}</p>
                </div>
                <div class="rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 px-4 py-3">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-sync-muted">내 보상</span>
                  <p class="mt-1 text-sm font-black" :class="myReviewReward ? 'text-teal-500' : 'text-sync-muted'">
                    {{ myReviewReward ? `${myReviewReward.total.toLocaleString()} PTS` : '해당 없음' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="isSubmissionReviewed && latestSubmission.rewardDistribution?.length"
            class="grid grid-cols-1 md:grid-cols-2 gap-3 px-6 py-5"
          >
            <div
              v-for="reward in latestSubmission.rewardDistribution"
              :key="reward.userId"
              class="rounded-2xl border border-sync-border bg-black/5 dark:bg-white/5 px-4 py-3"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-sm font-bold text-sync-text truncate">{{ reward.nickname }}</p>
                  <p class="text-[11px] font-medium text-sync-muted truncate">{{ reward.role }}</p>
                </div>
                <span class="text-sm font-black text-sync-primary">{{ reward.total.toLocaleString() }} PTS</span>
              </div>
              <p class="mt-2 text-[11px] leading-relaxed text-sync-muted">{{ reward.breakdown.join(' · ') }}</p>
            </div>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="flex gap-2 border-b border-sync-border mb-2 overflow-x-auto custom-scrollbar pb-px">
          <button @click="activeTab = 'board'" class="px-6 py-4 text-[15px] font-bold border-b-2 transition-all shrink-0" :class="activeTab==='board' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">📋 스프린트 보드</button>
          <button @click="activeTab = 'docs'" class="px-6 py-4 text-[15px] font-bold border-b-2 transition-all shrink-0" :class="activeTab==='docs' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">📄 문서 & 기획서</button>
          <button @click="activeTab = 'github'" class="px-6 py-4 text-[15px] font-bold border-b-2 transition-all shrink-0" :class="activeTab==='github' ? 'border-sync-primary text-sync-primary' : 'border-transparent text-sync-muted hover:text-sync-text'">🌿 기여 현황</button>
        </div>

        <!-- ── TAB 1: Sprint Board ── -->
        <div v-if="activeTab === 'board'" class="animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="status in STATUSES" :key="status" class="flex flex-col gap-4">
              <!-- Column Header -->
              <div class="flex items-center justify-between px-2 mb-2">
                <span class="text-xs font-bold uppercase tracking-widest" :class="status==='In Progress' ? 'text-teal-500' : 'text-sync-muted'">{{ status }}</span>
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded flex items-center justify-center font-bold text-[11px]" :class="status==='In Progress' ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20' : 'bg-black/10 dark:bg-white/10 text-sync-muted'">{{ tasks.filter(t=>t.status===status).length }}</span>
                  <button @click="openNewTask(status)" class="w-6 h-6 rounded flex items-center justify-center text-sync-muted hover:text-sync-primary hover:bg-sync-primary/10 transition-colors text-xl font-bold leading-none" title="태스크 추가">+</button>
                </div>
              </div>

              <!-- Task Cards -->
              <div v-for="t in tasks.filter(t=>t.status===status)" :key="t.id"
                   class="p-5 rounded-2xl border transition-all group cursor-pointer"
                   :class="status==='In Progress' ? 'bg-teal-50 dark:bg-teal-500/5 border-teal-500/30 hover:border-teal-500/60 shadow-[0_4px_16px_rgba(20,184,166,0.06)]' : status==='Done' ? 'bg-black/5 dark:bg-white/5 border-sync-border opacity-60 hover:opacity-100 hover:border-sync-primary/40' : 'bg-black/5 dark:bg-white/5 border-sync-border hover:border-sync-primary/40 shadow-sm hover:shadow-md'"
                   @click="openEditTask(t)">
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-1 rounded text-[10px] font-bold border tracking-wider" :class="priorityClass(t.priority)">{{ t.priority }}</span>
                  <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
                    <button v-if="STATUSES.indexOf(t.status)>0" @click="moveTaskStatus(t,-1)" class="w-6 h-6 flex items-center justify-center text-sync-muted hover:text-sync-primary text-xs rounded-lg hover:bg-sync-primary/10 transition-colors" title="이전 상태">◀</button>
                    <button v-if="STATUSES.indexOf(t.status) < STATUSES.length - 1" @click="moveTaskStatus(t,1)" class="w-6 h-6 flex items-center justify-center text-sync-muted hover:text-teal-500 text-xs rounded-lg hover:bg-teal-500/10 transition-colors" title="다음 상태">▶</button>
                    <button @click="deleteTask(t.id)" class="w-6 h-6 flex items-center justify-center text-sync-muted hover:text-red-500 text-xs rounded-lg hover:bg-red-500/10 transition-colors" title="삭제">✕</button>
                  </div>
                </div>
                <p class="text-base font-bold text-sync-text mt-2 leading-snug" :class="status==='Done' ? 'line-through text-sync-muted' : ''">{{ t.title }}</p>
                <p v-if="t.desc" class="text-xs text-sync-muted mt-2 line-clamp-2 font-medium leading-relaxed">{{ t.desc }}</p>
                <div class="mt-5 pt-3 border-t border-sync-border flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border border-sync-border flex items-center justify-center text-[10px] font-bold text-sync-text shadow-sm">{{ t.assignee[0] }}</div>
                    <span class="text-xs text-sync-muted font-bold truncate max-w-[100px]">{{ t.assignee }}</span>
                  </div>
                  <span v-if="t.due" class="text-[10px] text-sync-muted bg-black/5 dark:bg-white/5 py-1 px-2 rounded font-mono">{{ t.due }}</span>
                </div>
              </div>

              <!-- Add Task Button (empty state) -->
              <button v-if="tasks.filter(t=>t.status===status).length===0" @click="openNewTask(status)" class="w-full py-8 rounded-2xl border-2 border-dashed border-sync-border hover:border-sync-primary/50 text-sync-muted hover:text-sync-primary text-[13px] font-bold transition-all hover:bg-sync-primary/5">
                + 새 태스크 추가
              </button>
            </div>
          </div>
        </div>

        <!-- ── TAB 2: Documents ── -->
        <div v-if="activeTab === 'docs'" class="animate-fade-in flex flex-col gap-6">
          <div class="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 md:p-6 rounded-2xl border border-sync-border shadow-sm">
            <p class="text-sm text-sync-text font-bold">기획서 및 문서를 공동 작성합니다.</p>
            <div class="flex gap-2">
              <button @click="isUploadModalOpen=true" class="px-5 py-2.5 rounded-xl border border-sync-border text-[13px] font-bold text-sync-text hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                <span class="hidden sm:inline">업로드</span>
              </button>
              <button @click="openNewDocModal" class="px-5 py-2.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(50,132,255,0.25)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                문서 작성
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div v-for="doc in documents" :key="doc.id"
                 class="glass-card p-6 md:p-8 rounded-[2rem] border border-sync-border hover:border-sync-primary/40 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                 @click="openEditor(doc)">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-sync-primary/10 transition-all border border-sync-border group-hover:border-sync-primary/30">
                    <span class="text-2xl">{{ docTypeIcon(doc.type) }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-lg font-bold text-sync-text truncate group-hover:text-sync-primary transition-colors leading-tight mb-1">{{ doc.name }}</p>
                    <p class="text-xs text-sync-muted font-medium flex items-center gap-2">{{ doc.updated }} 업데이트</p>
                  </div>
                </div>
                <button @click.stop="deleteDocument(doc.id)" class="w-10 h-10 flex-shrink-0 flex items-center justify-center text-sync-muted hover:text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
              <div class="mt-5 text-sm text-sync-muted line-clamp-2 font-mono bg-black/5 dark:bg-white/5 rounded-xl p-4 leading-relaxed">{{ (doc.content || '').slice(0,180) }}<span v-if="(doc.content||'').length>180">...</span></div>
            </div>

            <!-- Empty state -->
            <div v-if="documents.length===0" class="py-24 text-center border-2 border-dashed border-sync-border rounded-[2rem] bg-black/5 dark:bg-white/5">
              <span class="text-5xl block mb-4">📂</span>
              <p class="text-sync-muted text-base font-bold">문서가 없습니다. 새 문서를 작성하거나 파일을 업로드하세요.</p>
            </div>
          </div>
        </div>

        <!-- ── TAB 4: GitHub Contributions ── -->
        <div v-if="activeTab === 'github'" class="animate-fade-in flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <p class="text-sm text-sync-muted font-medium">팀원들의 최근 12주 GitHub 커밋 기여 현황입니다.</p>
            <a v-if="githubRepoUrl" :href="githubRepoUrl" target="_blank" class="flex items-center gap-1.5 text-xs font-bold text-sync-primary hover:underline">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              레포지토리 열기
            </a>
          </div>

          <div class="flex flex-col gap-8">
            <div class="glass-card p-10 border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-sm relative overflow-hidden group">
               <div class="absolute -right-24 -top-24 w-80 h-80 bg-sync-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-sync-primary/20 transition-all duration-1000"></div>
               
               <div class="flex justify-between items-center mb-10 border-b border-sync-border pb-6">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <svg class="w-7 h-7 text-sync-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                     </div>
                     <div class="flex flex-col gap-1">
                        <h3 class="text-2xl font-black text-sync-text tracking-tight font-outfit">Team Contributions</h3>
                        <p class="text-sm font-bold text-sync-muted">팀원들의 현재 기여도 현황</p>
                     </div>
                  </div>
                  <div v-if="authStore.user.githubConnected" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/5 border border-teal-500/10 shadow-sm transition-all duration-300">
                    <span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span>
                    <span class="text-xs font-black text-teal-600 dark:text-teal-400 tracking-wide uppercase">Connected</span>
                  </div>
               </div>

               <div v-if="authStore.user.githubConnected" class="flex flex-col gap-3 animate-fade-in">
	                  <div v-for="u in teamMembers" :key="u.id" class="flex flex-row items-center gap-8 p-4 px-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-sync-border/50 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all group/item">
	                    <!-- Profile Column -->
	                    <div class="flex items-center gap-4 w-48 shrink-0">
	                       <UserAvatar
                          :user="u"
                          size-class="w-10 h-10"
                          avatar-class="border-2 border-white dark:border-sync-bg shadow-sm"
                          show-status
                          alt="team member avatar"
                        />
	                       <div class="flex flex-col min-w-0">
	                          <div class="flex items-center gap-2 min-w-0">
                            <span class="text-[14px] font-black text-sync-text truncate">{{ u.nickname }}</span>
                            <span v-if="isCurrentUser(u)" class="shrink-0 rounded-full bg-sync-primary/10 px-2 py-0.5 text-[9px] font-black text-sync-primary border border-sync-primary/20">나</span>
                          </div>
	                          <UserBadgeStrip
	                            :badge-ids="u.selectedBadges || []"
	                            size="xs"
                            badge-class="bg-black/5 dark:bg-white/10 border-sync-border"
                          />
	                          <span class="text-[10px] font-bold text-sync-muted uppercase tracking-tight truncate">{{ u.role }}</span>
	                       </div>
	                    </div>
                    
                    <!-- Contribution Column -->
                    <div class="flex-1 flex flex-col justify-center overflow-hidden">
                       <div class="flex gap-1 overflow-x-auto custom-scrollbar pb-1 pointer-events-none opacity-80 group-hover/item:opacity-100 transition-opacity">
                          <div v-for="(week, wi) in generateContribs(u.id)" :key="wi" class="flex flex-col gap-[3px]">
                             <div v-for="(day, di) in week" :key="di"
                                  class="w-2 h-2 rounded-[1.5px] transition-all"
                                  :class="contribColor(day)"
                             ></div>
                          </div>
                       </div>
                    </div>

                    <!-- Stats Column (Optional but adds premium feel) -->
                    <div class="hidden md:flex flex-col items-end gap-0.5 w-24 shrink-0 pr-2">
                       <span class="text-[16px] font-black text-sync-text tabular-nums">{{ generateContribs(u.id).flat().reduce((a,b)=>a+b,0) }}</span>
                       <span class="text-[9px] font-black text-sync-muted uppercase tracking-widest">Commits</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between px-2 text-[10px] font-black text-sync-muted uppercase tracking-widest opacity-60">
                    <span>Last 12 Weeks</span>
                    <div class="flex items-center gap-1.5">
                       <span>Less</span>
                       <div class="flex gap-1">
                          <div class="w-2.5 h-2.5 rounded-sm bg-black/5 dark:bg-white/5 border border-sync-border"></div>
                          <div class="w-2.5 h-2.5 rounded-sm bg-teal-500/20"></div>
                          <div class="w-2.5 h-2.5 rounded-sm bg-teal-500/50"></div>
                          <div class="w-2.5 h-2.5 rounded-sm bg-teal-500"></div>
                       </div>
                       <span>More</span>
                    </div>
                    <span>Today</span>
                  </div>
               </div>

               <!-- Not Connected State -->
               <div v-else class="flex flex-col items-center justify-center py-20 px-8 border-2 border-dashed border-sync-border rounded-[2.5rem] bg-black/[0.02] dark:bg-white/[0.02] max-w-2xl mx-auto">
                  <div class="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-4xl mb-6 shadow-inner border border-white/10 opacity-70">⚡️</div>
                  <h4 class="text-xl font-black text-sync-text tracking-tight mb-2">GitHub 연동이 필요합니다</h4>
                  <p class="text-xs font-bold text-sync-muted text-center max-w-xs mb-8 leading-relaxed">
                     팀원들의 실시간 기여도를 확인하려면 계정을 연동해주세요.
                  </p>
                  <button @click="authStore.user.githubConnected = true" class="px-8 py-3.5 bg-sync-primary hover:bg-sync-primaryHover text-white rounded-2xl font-bold text-sm transition-all shadow-md">GitHub 연결하기</button>
               </div>
            </div>
          </div>

          <div v-if="!githubRepoUrl" class="p-6 rounded-2xl border-2 border-dashed border-sync-border text-center">
            <p class="text-sm text-sync-muted font-bold mb-3">사이드바에서 GitHub 레포지토리를 연결하면 실제 기여 현황을 볼 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="isTeamParticipant" class="pointer-events-none fixed bottom-5 right-5 z-[95] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <div
        v-if="isChatPopupOpen"
        ref="chatPopupPanel"
        :style="chatPopupStyle"
        class="pointer-events-auto flex h-[72vh] max-h-[44rem] w-[calc(100vw-1rem)] max-w-[40rem] flex-col overflow-hidden rounded-[1.75rem] border border-sync-border bg-white/95 shadow-[0_18px_56px_rgba(0,0,0,0.28)] backdrop-blur-xl dark:bg-[#0F1218]/95"
      >
        <div class="flex items-center justify-between border-b border-sync-border px-5 py-4">
          <div
            class="min-w-0 flex-1 select-none pr-4 touch-none"
            :class="isDraggingChatPopup ? 'cursor-grabbing' : 'cursor-grab'"
            @pointerdown="startChatPopupDrag"
          >
            <p class="text-[11px] font-black uppercase tracking-[0.24em] text-sync-primary">Team Chat</p>
            <h3 class="mt-1 truncate text-xl font-black text-sync-text">{{ team.teamName }} 채팅</h3>
          </div>
          <button
            @click="closeChatPopup"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-sync-border text-sync-muted transition-colors hover:border-sync-primary/30 hover:text-sync-primary"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[12.75rem_minmax(0,1fr)]">
          <div class="flex min-h-0 flex-col border-b border-sync-border md:border-b-0 md:border-r">
            <div class="border-b border-sync-border px-4 py-3">
              <h4 class="text-sm font-black uppercase tracking-[0.18em] text-sync-muted">채널</h4>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto custom-scrollbar px-3 py-3">
              <div class="flex flex-col gap-2">
                <button
                  v-for="room in workspaceChatRooms"
                  :key="room.id"
                  @click="activeChatRoomId = room.id"
                  class="rounded-xl border px-3 py-3 text-left transition-all"
                  :class="activeChatRoomId === room.id ? 'border-sync-primary bg-sync-primary/5 shadow-sm' : 'border-sync-border hover:border-sync-primary/30 hover:bg-black/5 dark:hover:bg-white/5'"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="flex items-center gap-2 text-sm font-bold leading-tight text-sync-text">
                        <span class="truncate">{{ room.type === 'group' ? '💬' : '✉️' }} {{ getRoomLabel(room) }}</span>
                        <span v-if="hasUnreadMessages(room)" class="h-2 w-2 shrink-0 rounded-full bg-sync-primary shadow-[0_0_8px_rgba(50,132,255,0.45)]"></span>
                      </p>
                      <p class="mt-1 truncate text-[12px] font-medium text-sync-muted">{{ getRoomMeta(room) }}</p>
                    </div>
                    <span class="shrink-0 text-[11px] font-bold text-sync-muted">{{ room.messages?.at(-1)?.sentAt?.slice(11) || '' }}</span>
                  </div>
                  <p class="mt-2 line-clamp-2 text-[12px] leading-relaxed text-sync-muted">{{ getLastMessagePreview(room) }}</p>
                </button>
              </div>
            </div>

            <div class="border-t border-sync-border px-4 py-3">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-black uppercase tracking-[0.18em] text-sync-muted">빠른 1:1</h4>
                <span class="text-[10px] font-bold uppercase tracking-widest text-sync-muted">DM</span>
              </div>
              <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-1 md:flex-col md:overflow-visible md:pb-0">
                <button
                  v-for="member in teamMembers.filter((user) => !isCurrentUser(user))"
                  :key="`popup-dm-${member.id}`"
                  @click="openDirectMessage(member)"
                  class="flex min-w-[9.5rem] items-center gap-3 rounded-xl border border-sync-border px-3 py-2.5 text-left transition-colors hover:border-sync-primary/30 hover:bg-black/5 dark:hover:bg-white/5 md:min-w-0"
                >
                  <UserAvatar
                    :user="member"
                    size-class="w-9 h-9"
                    avatar-class="border border-sync-border"
                  />
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-sync-text">{{ member.nickname }}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="flex min-h-0 flex-col">
            <div v-if="activeChatRoom" class="flex items-center justify-between gap-3 border-b border-sync-border px-5 py-4">
              <div class="min-w-0">
                <h3 class="truncate text-xl font-black text-sync-text">{{ getRoomLabel(activeChatRoom) }}</h3>
                <p class="mt-1 truncate text-[13px] font-medium text-sync-muted">{{ getRoomMeta(activeChatRoom) }}</p>
              </div>
              <span class="rounded-full border border-sync-border bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sync-muted dark:bg-white/5">
                {{ activeChatRoom.type === 'group' ? 'Group' : 'Direct' }}
              </span>
            </div>

            <div v-if="activeChatRoom" class="flex min-h-0 flex-1 flex-col">
              <div ref="chatMessageViewport" class="min-h-0 flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
                <div class="flex flex-col gap-4">
                  <div
                    v-for="message in activeChatRoom.messages"
                    :key="message.id"
                    class="flex flex-col"
                    :class="isNoticeMessage(message) ? 'items-center' : isOwnMessage(message) ? 'items-end' : 'items-start'"
                  >
                    <template v-if="isNoticeMessage(message)">
                      <div class="flex w-full items-center gap-3 py-1">
                        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-sync-border to-transparent"></div>
                        <div class="max-w-[20rem] rounded-xl border border-sync-border bg-black/5 px-4 py-3 text-center shadow-sm backdrop-blur-sm dark:bg-white/5">
                          <div class="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-sync-primary">
                            <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sync-primary/10 text-[11px]">i</span>
                            공지
                          </div>
                          <p class="mt-2 text-sm font-bold leading-relaxed text-sync-text">{{ message.text }}</p>
                          <span class="mt-2 block text-[10px] font-medium text-sync-muted">{{ message.sentAt }}</span>
                        </div>
                        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-sync-border to-transparent"></div>
                      </div>
                    </template>

                    <template v-else>
                      <p
                        v-if="activeChatRoom.type === 'group' && !isOwnMessage(message)"
                        class="mb-1 text-[11px] font-bold text-sync-muted"
                      >
                        {{ getMessageSender(message)?.nickname || '알 수 없음' }}
                      </p>
                      <div
                        class="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
                        :class="isOwnMessage(message) ? 'bg-sync-primary text-white rounded-br-md' : 'bg-white dark:bg-[#151922] border border-sync-border text-sync-text rounded-bl-md'"
                      >
                        {{ message.text }}
                      </div>
                      <div
                        class="mt-1 flex items-center gap-2 px-1"
                        :class="isOwnMessage(message) ? 'justify-end' : 'justify-start'"
                      >
                        <span class="text-[10px] font-medium text-sync-muted">{{ message.sentAt }}</span>
                        <span
                          v-if="activeChatRoom.type === 'dm' && isOwnMessage(message)"
                          class="text-[10px] font-bold"
                          :class="getDirectReadLabel(message, activeChatRoom).startsWith('읽음') ? 'text-teal-500' : 'text-sync-muted'"
                        >
                          {{ getDirectReadLabel(message, activeChatRoom) }}
                        </span>
                      </div>
                      <div
                        v-if="activeChatRoom.type === 'group' && isOwnMessage(message)"
                        class="mt-1 flex max-w-[82%] items-center gap-2 px-1"
                      >
                        <div v-if="getGroupReadUsers(message, activeChatRoom).length" class="flex -space-x-1.5">
                          <UserAvatar
                            v-for="reader in getGroupReadUsers(message, activeChatRoom).slice(0, 3)"
                            :key="`popup-reader-${message.id}-${reader.id}`"
                            :user="reader"
                            size-class="w-4 h-4"
                            avatar-class="border border-white dark:border-[#0D0F14] shadow-sm"
                          />
                        </div>
                        <span class="text-[10px] font-medium text-sync-muted">
                          {{ getGroupReadUsers(message, activeChatRoom).length ? `읽음 ${getGroupReadLabel(message, activeChatRoom)}` : getGroupReadLabel(message, activeChatRoom) }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div class="border-t border-sync-border px-5 py-4">
                <div class="flex flex-col gap-3">
                  <textarea
                    v-model="chatDraft"
                    rows="3"
                    class="w-full resize-none rounded-2xl border border-sync-border bg-black/5 px-4 py-3 text-sm text-sync-text outline-none transition-colors focus:border-sync-primary dark:bg-white/5"
                    placeholder="팀에게 공유할 메시지를 남겨보세요."
                    @keydown="handleChatKeydown"
                    @compositionstart="isChatComposing = true"
                    @compositionend="isChatComposing = false"
                  ></textarea>
                  <div class="flex items-center justify-between gap-4">
                    <p class="text-[11px] font-medium text-sync-muted">`Enter` 전송, `Shift + Enter` 줄바꿈</p>
                    <button
                      @click="sendChatMessage"
                      class="shrink-0 whitespace-nowrap rounded-xl bg-sync-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-sync-primaryHover shadow-[0_4px_14px_rgba(50,132,255,0.22)]"
                    >
                      보내기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-1 items-center justify-center px-8 text-center">
              <div class="flex flex-col gap-3">
                <h3 class="text-xl font-black text-sync-text">채널을 선택하세요.</h3>
                <p class="text-sm font-medium leading-relaxed text-sync-muted">팀 전체 채팅 또는 1:1 대화를 바로 확인할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="isChatPopupOpen ? closeChatPopup() : openChatPopup()"
        class="pointer-events-auto relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-sync-primary text-white shadow-[0_14px_32px_rgba(50,132,255,0.35)] transition-all hover:-translate-y-1 hover:bg-sync-primaryHover"
        :aria-label="isChatPopupOpen ? '채팅창 닫기' : '채팅창 열기'"
      >
        <svg v-if="!isChatPopupOpen" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.489C3.512 15.042 3 13.57 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <svg v-else class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span
          v-if="totalUnreadChatCount > 0"
          class="absolute -right-1 -top-1 flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-sync-primary shadow-sm"
        >
          {{ totalUnreadChatCount > 9 ? '9+' : totalUnreadChatCount }}
        </span>
      </button>
    </div>
  </Teleport>

  <!-- ══ Task Modal ══ -->
  <Teleport to="body">
    <div v-if="isTaskModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isTaskModalOpen=false"></div>
      <div class="glass-card relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in flex flex-col gap-5">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-sync-text">{{ editingTask ? '태스크 수정' : '새 태스크 추가' }}</h3>
          <button @click="isTaskModalOpen=false" class="text-sync-muted hover:text-sync-text transition-colors p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">제목 *</label>
            <input v-model="taskForm.title" type="text" placeholder="태스크 제목을 입력하세요" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">설명</label>
            <textarea v-model="taskForm.desc" rows="2" placeholder="상세 설명 (선택)" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all resize-none custom-scrollbar"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">상태</label>
              <div class="relative">
                <select v-model="taskForm.status" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all appearance-none">
                  <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sync-muted"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">우선순위</label>
              <div class="relative">
                <select v-model="taskForm.priority" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all appearance-none">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sync-muted"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">담당자</label>
              <input v-model="taskForm.assignee" type="text" placeholder="닉네임" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">마감일</label>
              <input v-model="taskForm.due" type="text" placeholder="2026.04.15" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="isTaskModalOpen=false" class="flex-1 py-3 rounded-xl border border-sync-border text-sync-muted hover:text-sync-text text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">취소</button>
          <button @click="saveTask" class="flex-1 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all">저장하기</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ Document Editor Modal ══ -->
  <Teleport to="body">
    <div v-if="isEditorOpen" class="fixed inset-0 z-[100] flex flex-col">
      <div class="flex-1 bg-white dark:bg-[#0A0A0A] flex flex-col overflow-hidden">

        <!-- Editor Navbar -->
        <div class="flex items-center justify-between px-6 py-3 border-b border-sync-border bg-black/5 dark:bg-white/5 flex-shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <span class="text-xl flex-shrink-0">{{ docTypeIcon(currentDoc?.type) }}</span>
            <h3 class="font-bold text-sync-text truncate">{{ currentDoc?.name }}</h3>
            <span class="text-[10px] px-2 py-0.5 rounded-full border transition-colors flex-shrink-0" :class="isSaved ? 'text-teal-500 border-teal-500/30 bg-teal-500/10' : 'text-amber-500 border-amber-500/30 bg-amber-500/10'">{{ isSaved ? '✓ 저장됨' : '● 미저장' }}</span>
          </div>

          <div class="flex items-center gap-4">
            <!-- Collaboration Avatars (Notion style) -->
	            <div class="hidden sm:flex items-center">
	              <div class="flex -space-x-2.5">
	                <UserAvatar
                    v-for="user in teamMembers.slice(1,3)"
                    :key="user.id"
                    :user="user"
                    size-class="w-7 h-7"
                    wrapper-class="relative z-10 hover:z-20 transition-all hover:-translate-y-0.5"
                    avatar-class="border-2 border-white dark:border-[#0A0A0A] shadow-sm"
                    :alt="user.nickname + '님이 함께 보고 있습니다.'"
                  />
	              </div>
              <div class="flex items-center gap-1.5 ml-3 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded-full">
                <div class="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                <span class="text-[10px] font-bold text-teal-600 dark:text-teal-400">2명 참여 중</span>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0 border-l border-sync-border pl-4">
              <button @click="saveDoc" class="px-5 py-2 bg-sync-primary hover:bg-sync-primaryHover text-white text-[13px] font-bold rounded-xl shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                저장
              </button>
              <button @click="isEditorOpen=false" class="p-2 text-sync-muted hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Formatting Toolbar -->
        <div class="flex items-center gap-1 px-6 py-2 border-b border-sync-border bg-black/[0.02] dark:bg-white/[0.02] flex-shrink-0 overflow-x-auto custom-scrollbar">
          <button @click="insertFormat('**','**')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-bold" title="굵게">B</button>
          <button @click="insertFormat('*','*')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm italic" title="기울임">I</button>
          <button @click="insertFormat('~~','~~')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm line-through" title="취소선">S</button>
          <div class="w-px h-5 bg-sync-border mx-1 flex-shrink-0"/>
          <button @click="insertFormat('# ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold" title="제목 1">H1</button>
          <button @click="insertFormat('## ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold" title="제목 2">H2</button>
          <button @click="insertFormat('### ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold" title="제목 3">H3</button>
          <div class="w-px h-5 bg-sync-border mx-1 flex-shrink-0"/>
          <button @click="insertFormat('- ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm" title="목록">≡</button>
          <button @click="insertFormat('> ')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm" title="인용">❝</button>
          <button @click="insertFormat('`','`')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-mono" title="인라인 코드">&lt;/&gt;</button>
          <button @click="insertFormat('\n```\n','\n```')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-mono" title="코드 블록">{ }</button>
          <div class="w-px h-5 bg-sync-border mx-1 flex-shrink-0"/>
          <button @click="insertFormat('---\n')" class="px-2.5 py-1.5 rounded-lg text-sync-muted hover:text-sync-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs" title="구분선">——</button>
          <div class="ml-auto flex items-center gap-2 text-[11px] text-sync-muted flex-shrink-0">
            <span>{{ (editorContent||'').length.toLocaleString() }} 자</span>
          </div>
        </div>

        <!-- Editor Body -->
        <div class="flex-1 overflow-hidden flex">
          <textarea
            id="doc-editor-textarea"
            v-model="editorContent"
            @input="onEditorInput"
            class="flex-1 w-full p-8 text-sm text-sync-text bg-transparent outline-none resize-none font-mono leading-relaxed custom-scrollbar"
            placeholder="내용을 작성하세요. 마크다운 문법을 지원합니다&#10;&#10;예시:&#10;# 제목&#10;## 소제목&#10;**굵게** *기울임*&#10;- 항목1&#10;- 항목2"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ New Doc Name Modal ══ -->
  <Teleport to="body">
    <div v-if="isNewDocModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isNewDocModalOpen=false"></div>
      <div class="glass-card relative w-full max-w-sm bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in">
        <h3 class="text-xl font-bold text-sync-text mb-5">새 문서 이름 입력</h3>
        <input v-model="newDocName" type="text" placeholder="예: 기능 명세서 v1.0" @keyup.enter="createNewDoc"
               class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all mb-5"/>
        <div class="flex gap-3">
          <button @click="isNewDocModalOpen=false" class="flex-1 py-3 rounded-xl border border-sync-border text-sync-muted text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">취소</button>
          <button @click="createNewDoc" class="flex-1 py-3 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all">만들기</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ Upload Modal ══ -->
  <Teleport to="body">
    <div v-if="isUploadModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="!isUploading && (isUploadModalOpen=false)"></div>
      <div class="glass-card relative w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-sync-text">파일 업로드</h3>
          <button v-if="!isUploading" @click="isUploadModalOpen=false" class="text-sync-muted hover:text-sync-text transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div v-if="!isUploading"
             @dragover.prevent="isDragging=true" @dragleave.prevent="isDragging=false" @drop="handleDrop"
             class="relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group"
             :class="isDragging ? 'border-sync-primary bg-sync-primary/5' : 'border-sync-border hover:border-sync-primary/50 hover:bg-black/5 dark:hover:bg-white/5'">
          <input type="file" @change="handleFileSelect" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".zip,.pdf,.jpg,.png,.fig,.doc,.docx"/>
          <div class="w-16 h-16 rounded-full bg-sync-card border border-sync-border flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">☁️</div>
          <p class="font-bold text-sync-text text-center">클릭하거나 파일을 드래그 앤 드롭</p>
          <p class="text-xs text-sync-muted mt-2">최대 50MB (PDF, ZIP, FIG 등 지원)</p>
        </div>
        <div v-else class="flex flex-col items-center py-8">
          <div class="w-16 h-16 rounded-full bg-sync-primary/10 border border-sync-primary/20 flex items-center justify-center mb-6 animate-pulse"><span class="text-2xl animate-bounce">📦</span></div>
          <p class="font-bold text-sync-text mb-4">{{ uploadedFile?.name }} 업로드 중...</p>
          <div class="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border border-sync-border">
            <div class="h-full bg-sync-primary rounded-full transition-all duration-150 font-bold text-sync-text" :style="`width:${uploadProgress}%` "></div>
          </div>
          <p class="text-xs font-bold text-sync-primary mt-2">{{ uploadProgress }}%</p>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══ Final Submit Modal ══ -->
  <Teleport to="body">
    <div v-if="isSubmitModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isSubmitModalOpen=false"></div>
      <div class="glass-card relative w-full max-w-2xl bg-white dark:bg-[#0A0A0A] border border-sync-border rounded-[2rem] p-8 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center mb-6 border-b border-sync-border pb-4">
          <h3 class="text-xl font-bold text-sync-text">🚀 프로젝트 최종 제출</h3>
          <button @click="isSubmitModalOpen=false" class="text-sync-muted hover:text-sync-text transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-5">
          <p class="text-sm text-sync-muted">해커톤 주관사에게 최종 결과물을 제출합니다. 마감 기한 내에는 덮어쓰기가 가능합니다.</p>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">프로젝트 명 <span class="text-red-500">*</span></label>
            <input v-model="submitForm.projectName" type="text" placeholder="예: Decentralized Escrow Protocol" class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">프로젝트 상세 설명 <span class="text-red-500">*</span></label>
            <textarea v-model="submitForm.description" rows="4" placeholder="주요 기능과 혁신성을 설명해주세요." class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all custom-scrollbar"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">저장소 링크 (Github)</label>
            <input v-model="submitForm.link" type="text" placeholder="https://github.com/..." class="w-full bg-black/5 dark:bg-white/5 border border-sync-border rounded-xl p-3.5 text-sm text-sync-text outline-none focus:border-sync-primary focus:ring-1 focus:ring-sync-primary transition-all"/>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-sync-muted uppercase tracking-wider">첨부 문서 선택</label>
            <div v-if="documents.length===0" class="p-4 border border-dashed border-sync-border rounded-xl text-center text-sync-muted text-sm">업로드된 문서가 없습니다.</div>
            <label v-for="doc in documents" :key="doc.id" class="flex items-center gap-3 p-3 border border-sync-border rounded-xl cursor-pointer transition-colors has-[:checked]:border-sync-primary has-[:checked]:bg-sync-primary/5 hover:bg-black/5 dark:hover:bg-white/5">
              <input type="checkbox" :value="doc.id" v-model="submitForm.selectedDocs" class="w-4 h-4 rounded text-sync-primary bg-black/10 border-sync-border focus:ring-sync-primary focus:ring-offset-0"/>
              <span class="text-xl">{{ docTypeIcon(doc.type) }}</span>
              <span class="text-sm font-bold text-sync-text truncate select-none">{{ doc.name }}</span>
            </label>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-sync-border">
          <button @click="handleFinalSubmit" class="w-full py-3.5 rounded-xl bg-sync-primary hover:bg-sync-primaryHover text-white text-sm font-bold shadow-[0_4px_14px_rgba(50,132,255,0.3)] transition-all">주최사에게 제출하기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width:5px; height:5px; }
.custom-scrollbar::-webkit-scrollbar-track { background:transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(150,150,150,0.3); border-radius:4px; }
#doc-editor-textarea { tab-size: 2; }
</style>
