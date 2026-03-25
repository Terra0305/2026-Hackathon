<script setup>
const props = defineProps({
  message: {
    type: String,
    default: '표시할 데이터가 없습니다.' // Document Standard
  },
  icon: {
    type: String,
    default: '📝'
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  }
})
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center text-center bg-black/5 dark:bg-white/[0.02] border border-dashed border-sync-border rounded-[2rem] transition-all"
       :class="{
         'py-12 px-6 gap-4': size === 'md',
         'py-8 px-4 gap-2': size === 'sm',
         'py-24 px-10 gap-6': size === 'lg'
       }">
    
    <div class="flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 border border-sync-border shadow-inner"
         :class="{
           'w-16 h-16 text-2xl': size === 'md',
           'w-10 h-10 text-xl': size === 'sm',
           'w-24 h-24 text-4xl': size === 'lg'
         }">
       <span class="opacity-80 grayscale">{{ icon }}</span>
    </div>
    
    <div class="flex flex-col gap-1 md:gap-2">
       <h4 class="font-bold text-sync-text tracking-tight"
           :class="{
             'text-lg md:text-xl': size === 'md',
             'text-sm': size === 'sm',
             'text-2xl md:text-3xl font-black': size === 'lg'
           }">{{ message }}</h4>
       <p v-if="size !== 'sm'" class="text-xs md:text-sm text-sync-muted mt-1 font-medium">
         새로운 데이터를 탐색하거나 필터를 초기화해 보세요.
       </p>
    </div>
    
    <slot name="action"></slot>
  </div>
</template>
