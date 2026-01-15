<script setup lang="ts">
interface Props {
  icon: string // e.g., 'fa-solid fa-bars' or 'fa-regular fa-sun'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  spin?: boolean
  fixedWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  spin: false,
  fixedWidth: false,
})

const sizeClasses: Record<string, string> = {
  xs: 'fa-xs',
  sm: 'fa-sm',
  md: '',
  lg: 'fa-lg',
  xl: 'fa-xl',
}
</script>

<template>
  <i
    :class="[icon, sizeClasses[props.size], { 'fa-spin': spin, 'fa-fw': fixedWidth }]"
    aria-hidden="true"
  />
</template>
