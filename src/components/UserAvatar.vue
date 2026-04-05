<script setup>
import { computed } from 'vue'
import { normalizeProfileBorder } from '../utils/userDecorations'
import UserBadgeStrip from './UserBadgeStrip.vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  sizeClass: {
    type: String,
    default: 'w-10 h-10'
  },
  wrapperClass: {
    type: String,
    default: ''
  },
  avatarClass: {
    type: String,
    default: 'border border-sync-border shadow-sm'
  },
  imageClass: {
    type: String,
    default: ''
  },
  borderScaleClass: {
    type: String,
    default: 'scale-110'
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  statusSizeClass: {
    type: String,
    default: 'w-3 h-3'
  },
  statusPositionClass: {
    type: String,
    default: '-bottom-0.5 -right-0.5'
  },
  statusBorderClass: {
    type: String,
    default: 'border-2 border-white dark:border-[#181A20]'
  },
  alt: {
    type: String,
    default: ''
  },
  showBadgeOverlay: {
    type: Boolean,
    default: false
  },
  badgeIds: {
    type: Array,
    default: () => []
  },
  badgeLimit: {
    type: Number,
    default: 3
  },
  badgeSize: {
    type: String,
    default: 'xs'
  },
  badgePositionClass: {
    type: String,
    default: '-bottom-1 -right-2'
  },
  badgeContainerClass: {
    type: String,
    default: ''
  },
  badgeClass: {
    type: String,
    default: 'bg-[#2D313A]/95 border-white/10 text-white'
  }
})

const normalizedBorder = computed(() => {
  return normalizeProfileBorder(props.user?.profileBorder)
})

const statusColorClass = computed(() => {
  if (props.user?.status === 'down') return 'bg-orange-400'
  if (props.user?.status === 'up') return 'bg-teal-400'
  return 'bg-sync-muted'
})

const altText = computed(() => {
  return props.alt || props.user?.nickname || 'User avatar'
})

const hasBadgeOverlay = computed(() => {
  return props.showBadgeOverlay && Array.isArray(props.badgeIds) && props.badgeIds.length > 0
})
</script>

<template>
  <div :class="['relative flex items-center justify-center shrink-0', sizeClass, wrapperClass]">
    <div
      v-if="normalizedBorder"
      class="absolute inset-0 profile-border-container z-0"
      :class="[borderScaleClass, `profile-border-${normalizedBorder}`]"
    ></div>

    <div
      :class="[
        'relative z-10 h-full w-full rounded-full overflow-hidden bg-slate-200',
        avatarClass
      ]"
    >
      <img
        :src="props.user?.avatar"
        :alt="altText"
        :class="['h-full w-full object-cover', imageClass]"
      />
    </div>

    <div
      v-if="showStatus"
      :class="[
        'absolute z-20 rounded-full',
        statusSizeClass,
        statusPositionClass,
        statusBorderClass,
        statusColorClass
      ]"
    ></div>

    <div
      v-if="hasBadgeOverlay"
      :class="['absolute z-30 pointer-events-none', badgePositionClass]"
    >
      <div
        :class="[
          'rounded-full border border-black/10 dark:border-white/10 bg-[#2D313A]/92 px-1.5 py-0.5 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.28)]',
          badgeContainerClass
        ]"
      >
        <UserBadgeStrip
          :badge-ids="badgeIds"
          :limit="badgeLimit"
          :size="badgeSize"
          overlap
          wrapper-class="-space-x-1"
          :badge-class="badgeClass"
        />
      </div>
    </div>
  </div>
</template>
