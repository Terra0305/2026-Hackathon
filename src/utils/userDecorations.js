import { availableBadges, mockShopItems } from '../data/mockData'

const legacyBorderMap = {
  'border-sync-primary shadow-[0_0_15px_rgba(50,132,255,0.3)]': 'neon'
}

const validBorderIds = new Set(
  (mockShopItems.decorations || [])
    .filter((item) => item.type === 'border')
    .map((item) => item.id)
)

export const normalizeProfileBorder = (profileBorder) => {
  if (!profileBorder) return null
  if (validBorderIds.has(profileBorder)) return profileBorder
  return legacyBorderMap[profileBorder] ?? null
}

export const getBadgeById = (badgeId) => {
  return availableBadges.find((badge) => badge.id === badgeId) ?? null
}

export const getBadgesByIds = (badgeIds = []) => {
  return (Array.isArray(badgeIds) ? badgeIds : [])
    .map((badgeId) => getBadgeById(badgeId))
    .filter(Boolean)
}

export const normalizeSelectedBadges = (badgeIds = []) => {
  return getBadgesByIds(badgeIds)
    .map((badge) => badge.id)
    .slice(0, 3)
}

export const normalizeOwnedItems = (ownedItems = [], profileBorder = null) => {
  const normalizedOwnedItems = [
    ...new Set(
      (Array.isArray(ownedItems) ? ownedItems : []).filter(
        (itemId) => typeof itemId === 'string' && itemId.length > 0
      )
    )
  ]
  const normalizedBorder = normalizeProfileBorder(profileBorder)

  if (normalizedBorder && !normalizedOwnedItems.includes(normalizedBorder)) {
    normalizedOwnedItems.unshift(normalizedBorder)
  }

  return normalizedOwnedItems
}

const normalizePointValue = (value, fallback = 0) => {
  const numericValue = Number(value)
  if (Number.isFinite(numericValue) && numericValue >= 0) {
    return Math.floor(numericValue)
  }

  return fallback
}

const getEarnedPointsFromHistory = (pointHistory = []) => {
  return (Array.isArray(pointHistory) ? pointHistory : []).reduce((total, historyItem) => {
    if (historyItem?.type !== 'earn') return total
    return total + normalizePointValue(historyItem.amount)
  }, 0)
}

export const getAvailablePoints = (user = {}) => {
  const fallbackPoints = normalizePointValue(user.points)
  return normalizePointValue(user.walletPoints, fallbackPoints)
}

export const normalizeUserDecorations = (user = {}) => {
  const normalizedBorder = normalizeProfileBorder(user.profileBorder)
  const rawPoints = normalizePointValue(user.points)
  const hasWalletPoints = user.walletPoints !== undefined && user.walletPoints !== null
  const normalizedPoints = hasWalletPoints
    ? rawPoints
    : Math.max(rawPoints, getEarnedPointsFromHistory(user.pointHistory))

  return {
    ...user,
    points: normalizedPoints,
    walletPoints: normalizePointValue(user.walletPoints, rawPoints),
    profileBorder: normalizedBorder,
    selectedBadges: normalizeSelectedBadges(user.selectedBadges),
    ownedItems: normalizeOwnedItems(user.ownedItems, normalizedBorder)
  }
}
