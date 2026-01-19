<script setup lang="ts">
import type { SamplingPreset } from '@/composables/useSamplingSimulator'

interface Props {
  /** Available presets */
  presets: SamplingPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [presetId: string]
}>()

function handleSelect(presetId: string) {
  emit('select', presetId)
}

// Icons for each preset
const presetIcons: Record<string, string> = {
  'user-survey': 'fa-clipboard-list',
  'quality-inspection': 'fa-industry',
  'performance-benchmark': 'fa-gauge-high',
  'election-poll': 'fa-check-to-slot',
  'ab-test': 'fa-vials',
}
</script>

<template>
  <div class="sampling-presets" data-testid="sampling-presets">
    <h4 class="text-sm font-medium text-text-muted uppercase tracking-wide mb-3">
      <i class="fa-solid fa-bookmark mr-2" aria-hidden="true" />
      Presets
    </h4>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.id"
        type="button"
        class="px-3 py-2 rounded-lg border border-border bg-surface-alt
               hover:border-primary hover:text-primary
               focus:outline-none focus:ring-2 focus:ring-primary/30
               transition-colors text-sm"
        :title="preset.scenario"
        :data-testid="`preset-${preset.id}`"
        @click="handleSelect(preset.id)"
      >
        <i
          class="fa-solid mr-2"
          :class="presetIcons[preset.id] || 'fa-folder'"
          aria-hidden="true"
        />
        {{ preset.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sampling-presets button {
  min-height: 44px;
}
</style>
