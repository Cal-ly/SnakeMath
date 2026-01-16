<script setup lang="ts">
import type { TrigValues, ExactTrigValues, Quadrant, QuadrantSigns, RadianDisplay } from '@/utils/math/trigonometry'

interface Props {
  angle: number
  trigValues: TrigValues
  exactValues: ExactTrigValues | null
  quadrant: Quadrant
  quadrantSigns: QuadrantSigns
  referenceAngle: number
  radianDisplay: RadianDisplay
}

defineProps<Props>()

function formatDecimal(value: number | null, precision: number = 4): string {
  if (value === null) return 'undefined'
  return value.toFixed(precision)
}

function getQuadrantName(q: Quadrant): string {
  const names = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
  return names[q]
}

function getSignSymbol(sign: 1 | -1): string {
  return sign === 1 ? '+' : '−'
}
</script>

<template>
  <div class="trig-values space-y-4">
    <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide">
      <i class="fa-solid fa-calculator mr-2" aria-hidden="true" />
      Trigonometric Values
    </h3>

    <!-- Sin -->
    <div data-testid="trig-value-sin">
      <div class="font-mono text-text-primary">
        <span class="text-text-muted">sin({{ angle }}°)</span>
        <span class="mx-2">=</span>
        <span class="font-semibold">{{ exactValues?.sin ?? formatDecimal(trigValues.sin) }}</span>
      </div>
      <div v-if="exactValues && exactValues.sin !== formatDecimal(trigValues.sin)" class="text-sm text-text-muted pl-4">
        ≈ {{ formatDecimal(trigValues.sin) }}
      </div>
    </div>

    <!-- Cos -->
    <div data-testid="trig-value-cos">
      <div class="font-mono text-text-primary">
        <span class="text-text-muted">cos({{ angle }}°)</span>
        <span class="mx-2">=</span>
        <span class="font-semibold">{{ exactValues?.cos ?? formatDecimal(trigValues.cos) }}</span>
      </div>
      <div v-if="exactValues && exactValues.cos !== formatDecimal(trigValues.cos)" class="text-sm text-text-muted pl-4">
        ≈ {{ formatDecimal(trigValues.cos) }}
      </div>
    </div>

    <!-- Tan -->
    <div data-testid="trig-value-tan">
      <div class="font-mono text-text-primary">
        <span class="text-text-muted">tan({{ angle }}°)</span>
        <span class="mx-2">=</span>
        <span class="font-semibold">{{ exactValues?.tan ?? formatDecimal(trigValues.tan) }}</span>
      </div>
      <div
        v-if="exactValues && exactValues.tan !== 'undefined' && exactValues.tan !== formatDecimal(trigValues.tan)"
        class="text-sm text-text-muted pl-4"
      >
        ≈ {{ formatDecimal(trigValues.tan) }}
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-border pt-3 space-y-2">
      <!-- Quadrant -->
      <div class="flex items-center gap-2" data-testid="quadrant-display">
        <span class="text-sm text-text-muted">Quadrant:</span>
        <span class="font-semibold text-text-primary">{{ getQuadrantName(quadrant) }}</span>
      </div>

      <!-- Signs in Quadrant -->
      <div class="flex items-center gap-2" data-testid="quadrant-signs">
        <span class="text-sm text-text-muted">Signs:</span>
        <span class="font-mono text-sm">
          sin {{ getSignSymbol(quadrantSigns.sin) }}, cos {{ getSignSymbol(quadrantSigns.cos) }}, tan
          {{ getSignSymbol(quadrantSigns.tan) }}
        </span>
      </div>

      <!-- Reference Angle -->
      <div class="flex items-center gap-2" data-testid="reference-angle-display">
        <span class="text-sm text-text-muted">Reference:</span>
        <span class="font-mono text-text-primary">{{ referenceAngle }}°</span>
      </div>

      <!-- Radians -->
      <div class="flex items-center gap-2" data-testid="radians-display">
        <span class="text-sm text-text-muted">Radians:</span>
        <span class="font-mono text-text-primary">{{ radianDisplay.formatted }}</span>
      </div>
    </div>
  </div>
</template>
