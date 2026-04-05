import { mockUsers } from '../data/mockData'
import { getAvailablePoints, normalizeUserDecorations } from './userDecorations'

export const PARTICIPATION_REWARD = 250

const SCORE_BONUS_RULES = [
  { minScore: 95, bonus: 700, label: '최상위 심사 성과 보너스' },
  { minScore: 90, bonus: 500, label: '우수 심사 성과 보너스' },
  { minScore: 80, bonus: 300, label: '심사 통과 보너스' },
  { minScore: 0, bonus: 150, label: '완주 보너스' }
]

const AWARD_BONUS_RULES = [
  { pattern: /(Grand Prize|1등|대상|금융위원장상)/i, bonus: 2400, label: '대상 수상 보너스' },
  { pattern: /(Excellence|2등|최우수상|혁신상)/i, bonus: 1600, label: '상위권 수상 보너스' },
  { pattern: /(Innovation|3등|우수상|특별상|참여상)/i, bonus: 1100, label: '입상 보너스' }
]

export const formatReviewDate = (date = new Date()) => {
  return new Date(date).toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1)
}

const getAwardBonusMeta = (award = '') => {
  return AWARD_BONUS_RULES.find((rule) => rule.pattern.test(award)) ?? { bonus: 0, label: '' }
}

const getScoreBonusMeta = (score = 0) => {
  return SCORE_BONUS_RULES.find((rule) => Number(score) >= rule.minScore) ?? SCORE_BONUS_RULES.at(-1)
}

export const inferSubmissionUsers = (submission = {}) => {
  const memberNicknames = (submission.members || [])
    .map((member) => member?.nickname)
    .filter(Boolean)

  return mockUsers.filter((user) => memberNicknames.includes(user.nickname))
}

export const buildSubmissionRewardDistribution = (submission = {}) => {
  const awardBonusMeta = getAwardBonusMeta(submission.award || '')
  const scoreBonusMeta = getScoreBonusMeta(Number(submission.score) || 0)

  return inferSubmissionUsers(submission).map((user) => {
    const memberMeta = (submission.members || []).find((member) => member.nickname === user.nickname)
    const total = PARTICIPATION_REWARD + scoreBonusMeta.bonus + awardBonusMeta.bonus

    return {
      userId: user.id,
      nickname: user.nickname,
      role: memberMeta?.role || user.role,
      participationReward: PARTICIPATION_REWARD,
      scoreReward: scoreBonusMeta.bonus,
      awardReward: awardBonusMeta.bonus,
      total,
      breakdown: [
        `${PARTICIPATION_REWARD} PTS 참가 리워드`,
        `${scoreBonusMeta.bonus} PTS ${scoreBonusMeta.label}`,
        awardBonusMeta.bonus ? `${awardBonusMeta.bonus} PTS ${awardBonusMeta.label}` : null
      ].filter(Boolean)
    }
  })
}

export const getSubmissionRewardForUser = (submission = {}, userId) => {
  if (!userId) return null
  return (submission.rewardDistribution || []).find((reward) => reward.userId === userId) ?? null
}

export const getSubmissionRewardTotal = (submission = {}) => {
  return (submission.rewardDistribution || []).reduce((total, reward) => total + (reward.total || 0), 0)
}

const syncSessionUser = (nextUser) => {
  if (typeof localStorage === 'undefined') return

  const rawSessionUser = localStorage.getItem('sync_user')
  if (!rawSessionUser) return

  try {
    const parsedSessionUser = JSON.parse(rawSessionUser)
    if (parsedSessionUser?.id !== nextUser.id) return

    const normalizedUser = normalizeUserDecorations({
      ...parsedSessionUser,
      ...nextUser
    })

    localStorage.setItem('sync_user', JSON.stringify(normalizedUser))
  } catch {
    // Ignore malformed local session data.
  }
}

export const refreshUserRanks = () => {
  const previousRanks = new Map(mockUsers.map((user) => [user.id, user.rank || Number.MAX_SAFE_INTEGER]))
  const sortedUsers = [...mockUsers].sort((left, right) => (right.points || 0) - (left.points || 0))

  sortedUsers.forEach((user, index) => {
    const targetUser = mockUsers.find((candidate) => candidate.id === user.id)
    if (!targetUser) return

    const nextRank = index + 1
    const previousRank = previousRanks.get(user.id) ?? nextRank

    targetUser.rank = nextRank

    if (nextRank < previousRank) {
      targetUser.status = 'up'
    } else if (nextRank > previousRank) {
      targetUser.status = 'down'
    }
  })
}

export const applySubmissionRewards = (submission = {}, nextDistribution = []) => {
  const previousDistribution = Array.isArray(submission.rewardDistribution) ? submission.rewardDistribution : []
  const rewardsWereApplied = submission.rewardsApplied === true
  const rewardDate = submission.reviewedAt || formatReviewDate()
  const affectedUserIds = new Set([
    ...previousDistribution.map((reward) => reward.userId),
    ...nextDistribution.map((reward) => reward.userId)
  ])

  affectedUserIds.forEach((userId) => {
    const targetUser = mockUsers.find((user) => user.id === userId)
    if (!targetUser) return

    const previousTotal = rewardsWereApplied
      ? (previousDistribution.find((reward) => reward.userId === userId)?.total || 0)
      : 0
    const nextReward = nextDistribution.find((reward) => reward.userId === userId)
    const nextTotal = nextReward?.total || 0
    const delta = nextTotal - previousTotal

    if (delta !== 0) {
      targetUser.points = Math.max(0, Number(targetUser.points || 0) + delta)
      targetUser.walletPoints = Math.max(0, getAvailablePoints(targetUser) + delta)
      targetUser.monthlyPoints = Math.max(0, Number(targetUser.monthlyPoints || 0) + delta)
    }

    if (!Array.isArray(targetUser.pointHistory)) {
      targetUser.pointHistory = []
    }

    const historyId = `submission-reward-${submission.id}-${userId}`
    const historyIndex = targetUser.pointHistory.findIndex((item) => String(item.id) === historyId)

    if (nextTotal > 0) {
      const detail = `${submission.teamName} · ${submission.projectName} 심사 보상${submission.award ? ` (${submission.award})` : ''}`
      const nextHistoryItem = {
        id: historyId,
        type: 'earn',
        amount: nextTotal,
        detail,
        date: rewardDate
      }

      if (historyIndex === -1) {
        targetUser.pointHistory.unshift(nextHistoryItem)
      } else {
        targetUser.pointHistory[historyIndex] = nextHistoryItem
      }
    } else if (historyIndex !== -1) {
      targetUser.pointHistory.splice(historyIndex, 1)
    }

    syncSessionUser(targetUser)
  })

  submission.rewardDistribution = nextDistribution
  submission.rewardsApplied = true
  refreshUserRanks()
}
