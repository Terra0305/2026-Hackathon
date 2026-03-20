import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDbStore = defineStore('db', () => {
  const hackathons = ref([])
  const teams = ref([])
  const submissions = ref([])
  const leaderboards = ref([])
  const isInitialized = ref(false)

  const defaultHackathons = [
    { id: '1', slug: 'ai-hack', title: '2026 글로벌 AI 해커톤', status: 'ongoing', tags: ['AI', 'MACHINE LEARNING'], startDate: '2026.05.01', endDate: '2026.05.07', participants: 128, description: '차세대 인공지능 모델을 활용한 혁신적인 서비스를 빌드하세요. 전 세계 엔지니어들과 경쟁하며 미래의 디지털 생태계를 설계하는 72시간의 몰입 여정입니다.', prizePool: '$50k', evaluation: '혁신성(30%), 기술성(30%), 사업성(20%), 완성도(20%)' },
    { id: '2', slug: 'cyber-sec', title: '차세대 보안 아키텍처 챌린지', status: 'ongoing', tags: ['SECURITY', 'CLOUD'], startDate: '2026.06.12', endDate: '2026.06.15', participants: 84, description: '안전한 인프라 구축을 위한 보안 아키텍처 워크톤입니다.', prizePool: '$30k', evaluation: '보안성(40%), 성능(30%), 확장성(30%)' },
    { id: '3', slug: 'web3-nexus', title: 'Sync Web3 넥서스', status: 'ended', tags: ['WEB3', 'NFT'], startDate: '2026.03.20', endDate: '2026.03.22', participants: 215, description: '탈중앙화 서비스를 위한 Web3 넥서스 해커톤입니다.', prizePool: '$100k', evaluation: '탈중앙성(30%), 혁신성(30%), 기술성(40%)' },
    { id: '4', slug: 'backend-infra', title: '백엔드 시스템 아키텍처 공모전', status: 'upcoming', tags: ['BACKEND', 'INFRA'], startDate: '2026.07.15', endDate: '2026.07.25', participants: 42, description: 'Quality products require excellent education networks.', prizePool: '$20k', evaluation: '아키텍처 완성도(50%), 성능 최적화(50%)' }
  ]

  const defaultTeams = [
    { id: '1', hackathonSlug: 'ai-hack', name: 'Neural Sparks', intro: 'AI 기반 서비스 개발 단체입니다. 인간의 지능을 확장하는 새로운 인터페이스를 탐구합니다.', isOpen: true, lookingFor: ['프론트엔드', '백엔드', '디자이너'], contactUrl: 'https://open.kakao.com/o/sample1', memberCount: 3, maxMembers: 5 },
    { id: '2', hackathonSlug: 'web3-nexus', name: 'Web3 Pioneers', intro: '탈중앙화 금융 솔루션을 구축하고 있습니다. 복잡한 블록체인 경험을 심리스하게 만듭니다.', isOpen: true, lookingFor: ['스마트컨트랙트 개발', '백엔드'], contactUrl: 'https://open.kakao.com/o/sample2', memberCount: 2, maxMembers: 4 },
    { id: '3', hackathonSlug: '', name: 'Zero Gravity', intro: '오프라인 경험을 디지털로 연결하는 O4O 프로젝트입니다.', isOpen: true, lookingFor: ['프론트엔드', '기획자'], contactUrl: 'https://open.kakao.com/o/sample3', memberCount: 1, maxMembers: 4 }
  ]

  const defaultLeaderboards = [
    { id: '1', hackathonSlug: 'ai-hack', userId: 'user1', nickname: 'NexusDev_01', score: 28900, rank: 1, status: 'LIVE', avatarSeed: 'Sam' },
    { id: '2', hackathonSlug: 'ai-hack', userId: 'user2', nickname: 'PixelWizard', score: 12450, rank: 2, status: 'IDLE', avatarSeed: 'Jude' },
    { id: '3', hackathonSlug: 'ai-hack', userId: 'user3', nickname: 'LunaCore', score: 11200, rank: 3, status: 'STABLE', avatarSeed: 'Jack' },
    { id: '4', hackathonSlug: 'ai-hack', userId: 'user4', nickname: 'HyperLogic', score: 9840, rank: 4, status: 'STABLE', avatarSeed: '4' },
    { id: '5', hackathonSlug: 'ai-hack', userId: 'user5', nickname: 'AstroDev', score: 8550, rank: 5, status: 'RISING', avatarSeed: '5' }
  ]

  function initialize() {
    if (isInitialized.value) return

    const load = (key, defaultData) => {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultData
    }

    hackathons.value = load('hackathons', defaultHackathons)
    teams.value = load('teams', defaultTeams)
    submissions.value = load('submissions', [])
    leaderboards.value = load('leaderboards', defaultLeaderboards)

    isInitialized.value = true
  }

  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Watchers to auto-save
  watch(hackathons, (val) => save('hackathons', val), { deep: true })
  watch(teams, (val) => save('teams', val), { deep: true })
  watch(submissions, (val) => save('submissions', val), { deep: true })
  watch(leaderboards, (val) => save('leaderboards', val), { deep: true })

  // Actions
  function addTeam(team) {
    team.id = Date.now().toString()
    teams.value.push(team)
  }

  function addSubmission(sub) {
    sub.id = Date.now().toString()
    submissions.value.push(sub)
  }

  return {
    hackathons,
    teams,
    submissions,
    leaderboards,
    initialize,
    addTeam,
    addSubmission
  }
})
