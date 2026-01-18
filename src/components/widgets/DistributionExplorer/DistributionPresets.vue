<script setup lang="ts">
import type { DistributionPreset } from '@/utils/math/distributions'

interface Props {
  presets: DistributionPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [presetId: string]
}>()

function handleSelect(presetId: string) {
  emit('select', presetId)
}
</script>

<template>
  <div class="distribution-presets" data-testid="distribution-presets">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-bookmark mr-2" aria-hidden="true" />
      Quick Presets
    </h3>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.id"
        class="px-3 py-1.5 text-sm rounded-lg border border-border
               bg-surface-alt hover:border-primary hover:text-primary
               focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors"
        :data-testid="`preset-btn-${preset.id}`"
        :title="preset.description"
        @click="handleSelect(preset.id)"
      >
        {{ preset.name }}
      </button>
    </div>
  </div>
</template>
