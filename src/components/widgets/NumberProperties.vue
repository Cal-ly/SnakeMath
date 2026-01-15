<script setup lang="ts">
import type { NumberProperties as NumberPropsType } from '@/types'

interface Props {
  properties: NumberPropsType | null
  inputValue: string
}

defineProps<Props>()

// Format property value for display
function formatValue(value: unknown): string {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return value.toString()
    return value.toFixed(6).replace(/\.?0+$/, '')
  }
  return String(value)
}
</script>

<template>
  <div v-if="properties" class="number-properties">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Properties</h3>

    <div class="grid grid-cols-2 gap-2 text-sm">
      <!-- Type -->
      <div class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Type:</span>
        <span class="ml-1 font-medium text-text-primary capitalize">
          {{ properties.type }}
        </span>
      </div>

      <!-- Sign -->
      <div v-if="properties.sign !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Sign:</span>
        <span class="ml-1 font-medium text-text-primary">
          {{ properties.sign > 0 ? 'Positive' : properties.sign < 0 ? 'Negative' : 'Zero' }}
        </span>
      </div>

      <!-- Integer check -->
      <div v-if="properties.isInteger !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Integer:</span>
        <span
          class="ml-1 font-medium"
          :class="properties.isInteger ? 'text-primary' : 'text-text-muted'"
        >
          {{ formatValue(properties.isInteger) }}
        </span>
      </div>

      <!-- Even/Odd (for integers) -->
      <div v-if="properties.isEven !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Parity:</span>
        <span class="ml-1 font-medium text-text-primary">
          {{ properties.isEven ? 'Even' : 'Odd' }}
        </span>
      </div>

      <!-- Prime (for positive integers) -->
      <div v-if="properties.isPrime !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">Prime:</span>
        <span
          class="ml-1 font-medium"
          :class="properties.isPrime ? 'text-primary' : 'text-text-muted'"
        >
          {{ formatValue(properties.isPrime) }}
        </span>
      </div>

      <!-- Absolute value -->
      <div v-if="properties.absoluteValue !== undefined" class="p-2 rounded bg-surface-alt">
        <span class="text-text-muted">|x|:</span>
        <span class="ml-1 font-medium font-mono text-text-primary">
          {{ formatValue(properties.absoluteValue) }}
        </span>
      </div>

      <!-- Complex parts -->
      <template v-if="properties.type === 'complex'">
        <div class="p-2 rounded bg-surface-alt">
          <span class="text-text-muted">Real:</span>
          <span class="ml-1 font-medium font-mono text-text-primary">
            {{ formatValue(properties.realPart) }}
          </span>
        </div>
        <div class="p-2 rounded bg-surface-alt">
          <span class="text-text-muted">Imaginary:</span>
          <span class="ml-1 font-medium font-mono text-text-primary">
            {{ formatValue(properties.imaginaryPart) }}
          </span>
        </div>
      </template>

      <!-- Special value indicator -->
      <div v-if="properties.isSpecial" class="p-2 rounded bg-math-highlight col-span-2">
        <span class="text-text-muted">Special:</span>
        <span class="ml-1 font-medium text-text-primary">
          {{ properties.specialName || inputValue }}
        </span>
      </div>
    </div>
  </div>
</template>
