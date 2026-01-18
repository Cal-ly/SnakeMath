<script setup lang="ts">
import type { DemoType } from '@/utils/math/trigApplications'

interface Props {
  activeDemo: DemoType
}

defineProps<Props>()

const emit = defineEmits<{
  select: [demo: DemoType]
}>()

const demos: { id: DemoType; label: string; icon: string }[] = [
  { id: 'rotation', label: 'Rotation', icon: 'fa-solid fa-rotate' },
  { id: 'wave', label: 'Waves', icon: 'fa-solid fa-wave-square' },
  { id: 'circular', label: 'Circular', icon: 'fa-solid fa-circle-notch' },
  { id: 'projectile', label: 'Projectile', icon: 'fa-solid fa-meteor' },
]
</script>

<template>
  <div class="demo-tabs" data-testid="demo-tabs">
    <div class="flex flex-wrap gap-2" role="tablist" aria-label="Demo selection">
      <button
        v-for="demo in demos"
        :key="demo.id"
        role="tab"
        :aria-selected="activeDemo === demo.id"
        class="px-4 py-2 rounded-lg border transition-all text-sm font-medium flex items-center gap-2"
        :class="[
          activeDemo === demo.id
            ? 'bg-primary text-white border-primary'
            : 'bg-surface-alt border-border hover:border-primary/50',
        ]"
        @click="emit('select', demo.id)"
      >
        <i :class="demo.icon" aria-hidden="true" />
        {{ demo.label }}
      </button>
    </div>
  </div>
</template>
