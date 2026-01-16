<script setup lang="ts">
import { computed, ref } from 'vue'
import AngleControls from './AngleControls.vue'
import SpecialAngleButtons from './SpecialAngleButtons.vue'
import TrigValuesDisplay from './TrigValuesDisplay.vue'
import WaveGraphs from './WaveGraphs.vue'
import { useUnitCircle } from '@/composables/useUnitCircle'
import { degreesToRadians } from '@/utils/math/trigonometry'
import type { AngleUnit } from '@/utils/math/trigonometry'

interface Props {
  /** Initial angle in degrees */
  initialAngle?: number
  /** Initial unit (degrees or radians) */
  initialUnit?: AngleUnit
  /** Sync state to URL */
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialAngle: 45,
  initialUnit: 'degrees',
  syncUrl: false,
})

const {
  angle,
  unit,
  showMoreAngles,
  showWaves,
  trigValues,
  exactValues,
  quadrant,
  quadrantSigns,
  referenceAngle,
  pointOnCircle,
  radianDisplay,
  firstQuadrantAngles,
  remainingSpecialAngles,
  setAngle,
  setUnit,
} = useUnitCircle({
  initialAngle: props.initialAngle,
  initialUnit: props.initialUnit,
  syncUrl: props.syncUrl,
})

// SVG dimensions
const svgSize = 320
const padding = 40
const radius = (svgSize - padding * 2) / 2
const center = svgSize / 2

// Calculated SVG points
const pointSvg = computed(() => ({
  x: center + pointOnCircle.value.x * radius,
  y: center - pointOnCircle.value.y * radius, // Y is inverted in SVG
}))

// Angle arc path
const arcPath = computed(() => {
  const arcRadius = 30
  const endAngle = -(angle.value * Math.PI) / 180 // Negate for SVG coordinate system
  const largeArcFlag = angle.value > 180 ? 1 : 0

  const startX = center + arcRadius
  const startY = center
  const endX = center + arcRadius * Math.cos(endAngle)
  const endY = center + arcRadius * Math.sin(endAngle)

  // Special case for 0 degrees
  if (angle.value === 0) return ''

  return `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${endX} ${endY}`
})

// Handlers
function handleAngleUpdate(newAngle: number) {
  setAngle(newAngle)
}

function handleUnitUpdate(newUnit: AngleUnit) {
  setUnit(newUnit)
}

function handleSelectSpecialAngle(degrees: number) {
  setAngle(degrees)
}

function handleToggleMore() {
  showMoreAngles.value = !showMoreAngles.value
}

// Angle in radians for wave graphs
const angleRadians = computed(() => degreesToRadians(angle.value))

// SVG hover state
const isPointHovered = ref(false)
</script>

<template>
  <div class="unit-circle-explorer" data-testid="unit-circle-explorer">
    <!-- Controls Section -->
    <div class="space-y-4 mb-6">
      <AngleControls
        :angle="angle"
        :unit="unit"
        :radian-symbolic="radianDisplay.symbolic"
        @update:angle="handleAngleUpdate"
        @update:unit="handleUnitUpdate"
      />

      <SpecialAngleButtons
        :first-quadrant-angles="firstQuadrantAngles"
        :remaining-angles="remainingSpecialAngles"
        :show-more="showMoreAngles"
        :current-angle="angle"
        @select-angle="handleSelectSpecialAngle"
        @toggle-more="handleToggleMore"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: Unit Circle SVG -->
      <div class="card p-4" data-testid="unit-circle-svg">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-circle-notch mr-2" aria-hidden="true" />
          Unit Circle
        </h3>

        <div class="flex justify-center">
          <svg
            :width="svgSize"
            :height="svgSize"
            :viewBox="`0 0 ${svgSize} ${svgSize}`"
            class="unit-circle-svg"
            aria-label="Unit circle showing angle, point, and trigonometric projections"
            role="img"
          >
            <!-- Grid lines -->
            <g class="grid-lines stroke-border" stroke-width="0.5">
              <line :x1="center" :y1="padding" :x2="center" :y2="svgSize - padding" />
              <line :x1="padding" :y1="center" :x2="svgSize - padding" :y2="center" />
            </g>

            <!-- Unit circle -->
            <circle
              :cx="center"
              :cy="center"
              :r="radius"
              fill="none"
              class="stroke-text-secondary"
              stroke-width="2"
            />

            <!-- Quadrant indicators (subtle) -->
            <text :x="center + radius / 2" :y="center - radius / 2 - 10" class="fill-text-muted text-[10px]" text-anchor="middle">I</text>
            <text :x="center - radius / 2" :y="center - radius / 2 - 10" class="fill-text-muted text-[10px]" text-anchor="middle">II</text>
            <text :x="center - radius / 2" :y="center + radius / 2 + 15" class="fill-text-muted text-[10px]" text-anchor="middle">III</text>
            <text :x="center + radius / 2" :y="center + radius / 2 + 15" class="fill-text-muted text-[10px]" text-anchor="middle">IV</text>

            <!-- Axis labels -->
            <text :x="svgSize - padding + 15" :y="center + 4" class="fill-text-secondary text-xs">x</text>
            <text :x="center - 4" :y="padding - 10" class="fill-text-secondary text-xs">y</text>

            <!-- Key points on circle -->
            <g class="key-points">
              <circle :cx="center + radius" :cy="center" r="3" class="fill-text-muted" />
              <circle :cx="center" :cy="center - radius" r="3" class="fill-text-muted" />
              <circle :cx="center - radius" :cy="center" r="3" class="fill-text-muted" />
              <circle :cx="center" :cy="center + radius" r="3" class="fill-text-muted" />
            </g>

            <!-- Key point labels -->
            <text :x="center + radius + 10" :y="center - 5" class="fill-text-muted text-[10px]">(1, 0)</text>
            <text :x="center + 5" :y="center - radius - 5" class="fill-text-muted text-[10px]">(0, 1)</text>
            <text :x="center - radius - 35" :y="center - 5" class="fill-text-muted text-[10px]">(-1, 0)</text>
            <text :x="center + 5" :y="center + radius + 15" class="fill-text-muted text-[10px]">(0, -1)</text>

            <!-- Angle arc -->
            <path
              v-if="arcPath"
              :d="arcPath"
              fill="none"
              stroke="var(--color-primary)"
              stroke-width="2"
              data-testid="angle-arc"
            />

            <!-- Radius line to point -->
            <line
              :x1="center"
              :y1="center"
              :x2="pointSvg.x"
              :y2="pointSvg.y"
              stroke="var(--color-primary)"
              stroke-width="2"
            />

            <!-- Cos projection (horizontal dashed line) -->
            <line
              :x1="pointSvg.x"
              :y1="pointSvg.y"
              :x2="pointSvg.x"
              :y2="center"
              stroke="var(--color-secondary, #8b5cf6)"
              stroke-width="1.5"
              stroke-dasharray="4 2"
            />

            <!-- Sin projection (vertical dashed line) -->
            <line
              :x1="center"
              :y1="pointSvg.y"
              :x2="pointSvg.x"
              :y2="pointSvg.y"
              stroke="var(--color-accent, #f59e0b)"
              stroke-width="1.5"
              stroke-dasharray="4 2"
            />

            <!-- Point on circle -->
            <circle
              :cx="pointSvg.x"
              :cy="pointSvg.y"
              :r="isPointHovered ? 8 : 6"
              fill="var(--color-primary)"
              class="cursor-pointer transition-all duration-150"
              :style="isPointHovered ? 'filter: drop-shadow(0 0 6px var(--color-primary))' : ''"
              data-testid="point-on-circle"
              @mouseenter="isPointHovered = true"
              @mouseleave="isPointHovered = false"
            />

            <!-- Point label -->
            <text
              :x="pointSvg.x + 10"
              :y="pointSvg.y - 10"
              class="fill-text-primary text-xs font-mono"
            >
              ({{ pointOnCircle.x.toFixed(2) }}, {{ pointOnCircle.y.toFixed(2) }})
            </text>

            <!-- Angle label -->
            <text
              v-if="angle > 0"
              :x="center + 45"
              :y="center - 5"
              class="fill-primary text-xs font-mono"
            >
              {{ angle }}°
            </text>
          </svg>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 justify-center mt-3 text-xs text-text-muted">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-primary" />
            Point (cos θ, sin θ)
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-0.5" style="background-color: #f59e0b" />
            sin θ
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-0.5" style="background-color: #8b5cf6" />
            cos θ
          </div>
        </div>
      </div>

      <!-- Right: Trig Values -->
      <div class="card p-4">
        <TrigValuesDisplay
          :angle="angle"
          :trig-values="trigValues"
          :exact-values="exactValues"
          :quadrant="quadrant"
          :quadrant-signs="quadrantSigns"
          :reference-angle="referenceAngle"
          :radian-display="radianDisplay"
        />
      </div>
    </div>

    <!-- Wave Graphs Toggle -->
    <div class="mt-4">
      <label class="flex items-center gap-2 cursor-pointer text-sm">
        <input
          v-model="showWaves"
          type="checkbox"
          data-testid="show-waves-toggle"
          class="rounded border-border accent-primary"
        />
        <span class="text-text-secondary">Show wave graphs</span>
      </label>
    </div>

    <!-- Wave Graphs -->
    <Transition name="fade">
      <div v-if="showWaves" class="mt-4 card p-4" data-testid="wave-graphs">
        <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          <i class="fa-solid fa-wave-square mr-2" aria-hidden="true" />
          Wave Graphs
        </h3>
        <WaveGraphs :angle-radians="angleRadians" />
      </div>
    </Transition>

    <!-- Share link hint -->
    <p v-if="syncUrl" class="mt-4 text-xs text-text-muted text-center">
      <i class="fa-solid fa-link mr-1" aria-hidden="true" />
      Share this URL to show these settings to others
    </p>
  </div>
</template>

<style scoped>
.card {
  @apply bg-surface border border-border rounded-lg;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.unit-circle-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
