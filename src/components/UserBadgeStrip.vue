<script setup>
import { computed } from 'vue'
import { getBadgesByIds } from '../utils/userDecorations'

const props = defineProps({
  badgeIds: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 3
  },
  size: {
    type: String,
    default: 'md'
  },
  overlap: {
    type: Boolean,
    default: false
  },
  wrapperClass: {
    type: String,
    default: ''
  },
  badgeClass: {
    type: String,
    default: ''
  }
})

const sizeClassMap = {
  xs: 'w-4 h-4 text-[9px]',
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-7 h-7 text-sm',
  lg: 'w-8 h-8 text-base',
  xl: 'w-10 h-10 text-xl'
}

const badges = computed(() => {
  return getBadgesByIds(props.badgeIds).slice(0, props.limit)
})

const badgeClasses = computed(() => {
  return [
    'rounded-full border flex items-center justify-center shadow-sm text-sync-text',
    sizeClassMap[props.size] ?? sizeClassMap.md,
    props.badgeClass || 'bg-white/80 dark:bg-[#181A20]/80 border-sync-border'
  ]
})
</script>

<template>
  <div
    v-if="badges.length"
    :class="['flex items-center', overlap ? '-space-x-1.5' : 'gap-1.5', wrapperClass]"
  >
    <div
      v-for="badge in badges"
      :key="badge.id"
      :class="badgeClasses"
      :title="badge.name"
    >
      {{ badge.icon }}
    </div>
  </div>
</template>
