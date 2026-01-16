# SnakeMath - Increment 4D: Visualizations

## Context
Adding visual representations: a number line showing position and a Venn diagram showing set membership hierarchy.

## Design Decisions
- **Number line**: Auto-zoom with reasonable bounds (-100 to 100 default)
- **Venn diagram**: Nested circles for ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ
- **Toggleable**: User can show/hide each visualization

## Archive Reference
Claude Code should review for inspiration (adapt, don't copy):
- `archive/snake-math-vue/src/components/` - Any visualization components
- `archive/snake-math/docs/number-theory.md` - Visual descriptions

## Task
Create NumberLine and SetVennDiagram components, integrate with NumberTypeExplorer.

## Requirements

### 1. Create NumberLine Component
Create `src/components/widgets/NumberLine.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** The number to display on the line */
  value: number | null
  /** Minimum value to show */
  min?: number
  /** Maximum value to show */
  max?: number
  /** Whether to auto-zoom to fit the value */
  autoZoom?: boolean
  /** Show tick marks */
  showTicks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: -10,
  max: 10,
  autoZoom: true,
  showTicks: true,
})

// Calculate display range based on value
const displayRange = computed(() => {
  if (!props.autoZoom || props.value === null || !Number.isFinite(props.value)) {
    return { min: props.min, max: props.max }
  }
  
  const absValue = Math.abs(props.value)
  
  // If value fits in default range, use it
  if (absValue <= Math.max(Math.abs(props.min), Math.abs(props.max))) {
    return { min: props.min, max: props.max }
  }
  
  // Auto-scale with some padding
  const padding = absValue * 0.2
  const newMax = Math.ceil(absValue + padding)
  return { min: -newMax, max: newMax }
})

// Calculate position as percentage
const valuePosition = computed(() => {
  if (props.value === null || !Number.isFinite(props.value)) return null
  
  const { min, max } = displayRange.value
  const range = max - min
  const position = ((props.value - min) / range) * 100
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, position))
})

// Generate tick marks
const ticks = computed(() => {
  if (!props.showTicks) return []
  
  const { min, max } = displayRange.value
  const range = max - min
  
  // Determine nice tick interval
  const rawInterval = range / 10
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)))
  const normalized = rawInterval / magnitude
  
  let interval: number
  if (normalized < 1.5) interval = magnitude
  else if (normalized < 3) interval = 2 * magnitude
  else if (normalized < 7) interval = 5 * magnitude
  else interval = 10 * magnitude
  
  // Generate ticks
  const ticks: { value: number; position: number; label: string }[] = []
  const start = Math.ceil(min / interval) * interval
  
  for (let v = start; v <= max; v += interval) {
    const position = ((v - min) / range) * 100
    const label = Number.isInteger(v) ? v.toString() : v.toFixed(1)
    ticks.push({ value: v, position, label })
  }
  
  return ticks
})

// Check if value is out of bounds
const isOutOfBounds = computed(() => {
  if (props.value === null || !Number.isFinite(props.value)) return false
  const { min, max } = displayRange.value
  return props.value < min || props.value > max
})
</script>

<template>
  <div 
    class="number-line"
    role="img"
    :aria-label="value !== null ? `Number line showing ${value}` : 'Number line'"
  >
    <!-- Line container -->
    <div class="relative h-16 mx-4">
      <!-- Main line -->
      <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
      
      <!-- Zero marker (if in range) -->
      <div 
        v-if="displayRange.min <= 0 && displayRange.max >= 0"
        class="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-text-muted"
        :style="{ left: `${((0 - displayRange.min) / (displayRange.max - displayRange.min)) * 100}%` }"
      />
      
      <!-- Tick marks -->
      <template v-if="showTicks">
        <div
          v-for="tick in ticks"
          :key="tick.value"
          class="absolute top-1/2"
          :style="{ left: `${tick.position}%` }"
        >
          <!-- Tick line -->
          <div 
            class="w-px h-3 -translate-y-1/2"
            :class="tick.value === 0 ? 'bg-text-primary h-4' : 'bg-text-muted'"
          />
          <!-- Tick label -->
          <span 
            class="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-text-muted whitespace-nowrap"
          >
            {{ tick.label }}
          </span>
        </div>
      </template>
      
      <!-- Value marker -->
      <div
        v-if="valuePosition !== null"
        class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
        :style="{ left: `${valuePosition}%` }"
      >
        <!-- Marker point -->
        <div class="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg" />
        
        <!-- Value label -->
        <div 
          class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-white text-sm rounded whitespace-nowrap"
        >
          {{ typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(4)) : value }}
        </div>
      </div>
      
      <!-- Direction arrows -->
      <div class="absolute top-1/2 -translate-y-1/2 -left-2 text-text-muted">
        <i class="fa-solid fa-caret-left" aria-hidden="true" />
      </div>
      <div class="absolute top-1/2 -translate-y-1/2 -right-2 text-text-muted">
        <i class="fa-solid fa-caret-right" aria-hidden="true" />
      </div>
    </div>
    
    <!-- Out of bounds indicator -->
    <p v-if="isOutOfBounds" class="text-xs text-text-muted text-center mt-2">
      Value extends beyond visible range
    </p>
    
    <!-- No value indicator -->
    <p v-else-if="value === null" class="text-xs text-text-muted text-center mt-2">
      Enter a real number to see its position
    </p>
    
    <!-- Infinity/NaN indicator -->
    <p v-else-if="!Number.isFinite(value)" class="text-xs text-text-muted text-center mt-2">
      {{ value === Infinity ? '∞ extends infinitely right' : value === -Infinity ? '-∞ extends infinitely left' : 'Not a finite number' }}
    </p>
  </div>
</template>

<style scoped>
.number-line {
  @apply py-4;
}
</style>
```

### 2. Create SetVennDiagram Component
Create `src/components/widgets/SetVennDiagram.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface SetMembership {
  isNatural: boolean
  isInteger: boolean
  isRational: boolean
  isReal: boolean
  isComplex: boolean
}

interface Props {
  /** Set membership data */
  membership: SetMembership | null
  /** Show labels on diagram */
  showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabels: true,
})

// Define set colors (using CSS variables where possible)
const sets = computed(() => [
  { 
    id: 'complex', 
    label: 'ℂ', 
    name: 'Complex',
    color: '#8b5cf6', // purple
    isMember: props.membership?.isComplex ?? false,
    radius: 95,
    cx: 50,
    cy: 50,
  },
  { 
    id: 'real', 
    label: 'ℝ', 
    name: 'Real',
    color: '#3b82f6', // blue
    isMember: props.membership?.isReal ?? false,
    radius: 75,
    cx: 45,
    cy: 50,
  },
  { 
    id: 'rational', 
    label: 'ℚ', 
    name: 'Rational',
    color: '#22c55e', // green
    isMember: props.membership?.isRational ?? false,
    radius: 55,
    cx: 42,
    cy: 50,
  },
  { 
    id: 'integer', 
    label: 'ℤ', 
    name: 'Integer',
    color: '#f59e0b', // amber
    isMember: props.membership?.isInteger ?? false,
    radius: 35,
    cx: 40,
    cy: 50,
  },
  { 
    id: 'natural', 
    label: 'ℕ', 
    name: 'Natural',
    color: '#ef4444', // red
    isMember: props.membership?.isNatural ?? false,
    radius: 18,
    cx: 38,
    cy: 50,
  },
])

// Find the innermost set the number belongs to
const innermostSet = computed(() => {
  if (!props.membership) return null
  
  if (props.membership.isNatural) return 'natural'
  if (props.membership.isInteger) return 'integer'
  if (props.membership.isRational) return 'rational'
  if (props.membership.isReal) return 'real'
  if (props.membership.isComplex) return 'complex'
  
  return null
})

// Get the innermost set data for marker position
const markerSet = computed(() => {
  if (!innermostSet.value) return null
  return sets.value.find(s => s.id === innermostSet.value)
})
</script>

<template>
  <div 
    class="set-venn-diagram"
    role="img"
    :aria-label="innermostSet 
      ? `Venn diagram showing number belongs to ${innermostSet} numbers and all containing sets` 
      : 'Venn diagram of number sets'"
  >
    <svg viewBox="0 0 100 100" class="w-full max-w-md mx-auto">
      <defs>
        <!-- Gradient for each set -->
        <radialGradient 
          v-for="set in sets" 
          :key="`gradient-${set.id}`" 
          :id="`gradient-${set.id}`"
        >
          <stop 
            offset="0%" 
            :stop-color="set.color" 
            :stop-opacity="set.isMember ? 0.3 : 0.05" 
          />
          <stop 
            offset="100%" 
            :stop-color="set.color" 
            :stop-opacity="set.isMember ? 0.15 : 0.02" 
          />
        </radialGradient>
      </defs>
      
      <!-- Draw sets from largest to smallest -->
      <g v-for="set in sets" :key="set.id">
        <circle
          :cx="set.cx"
          :cy="set.cy"
          :r="set.radius"
          :fill="`url(#gradient-${set.id})`"
          :stroke="set.color"
          :stroke-width="set.isMember ? 2 : 0.5"
          :stroke-opacity="set.isMember ? 1 : 0.3"
          class="transition-all duration-300"
        />
        
        <!-- Set label -->
        <text
          v-if="showLabels"
          :x="set.cx - set.radius + 5"
          :y="set.cy - set.radius + 12"
          :fill="set.color"
          class="text-[8px] font-bold"
          :opacity="set.isMember ? 1 : 0.4"
        >
          {{ set.label }}
        </text>
      </g>
      
      <!-- Marker for the number's position -->
      <g v-if="markerSet" class="animate-pulse">
        <circle
          :cx="markerSet.cx"
          :cy="markerSet.cy"
          r="4"
          fill="white"
          stroke="currentColor"
          stroke-width="2"
          class="text-primary"
        />
        <circle
          :cx="markerSet.cx"
          :cy="markerSet.cy"
          r="2"
          class="fill-primary"
        />
      </g>
    </svg>
    
    <!-- Legend -->
    <div class="flex flex-wrap justify-center gap-3 mt-4 text-sm">
      <div 
        v-for="set in sets" 
        :key="`legend-${set.id}`"
        class="flex items-center gap-1.5"
        :class="set.isMember ? 'opacity-100' : 'opacity-40'"
      >
        <span 
          class="w-3 h-3 rounded-full" 
          :style="{ backgroundColor: set.color }"
        />
        <span>{{ set.label }} {{ set.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>
```

### 3. Create VisualizationToggle Component
Create `src/components/widgets/VisualizationToggle.vue`:

```vue
<script setup lang="ts">
interface Props {
  modelValue: boolean
  label: string
  icon?: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors"
    :class="modelValue 
      ? 'border-primary bg-primary/10 text-primary' 
      : 'border-border text-text-muted hover:border-primary hover:text-primary'"
    :aria-pressed="modelValue"
    @click="emit('update:modelValue', !modelValue)"
  >
    <i v-if="icon" :class="icon" aria-hidden="true" />
    {{ label }}
    <i 
      :class="modelValue ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'" 
      class="ml-1 opacity-60"
      aria-hidden="true" 
    />
  </button>
</template>
```

### 4. Update Widgets Barrel Export
Update `src/components/widgets/index.ts`:

```typescript
export { default as NumberInput } from './NumberInput.vue'
export { default as SetMembershipDisplay } from './SetMembershipDisplay.vue'
export { default as NumberProperties } from './NumberProperties.vue'
export { default as NumberTypeExplorer } from './NumberTypeExplorer.vue'
export { default as NumberLine } from './NumberLine.vue'
export { default as SetVennDiagram } from './SetVennDiagram.vue'
export { default as VisualizationToggle } from './VisualizationToggle.vue'
```

### 5. Integrate Visualizations into NumberTypeExplorer
Update `src/components/widgets/NumberTypeExplorer.vue` to add visualization section:

Add these imports and state:
```vue
<script setup lang="ts">
// ... existing imports ...
import NumberLine from './NumberLine.vue'
import SetVennDiagram from './SetVennDiagram.vue'
import VisualizationToggle from './VisualizationToggle.vue'

// ... existing props and setup ...

// Visualization toggles
const showNumberLine = ref(true)
const showVennDiagram = ref(true)

// Get real part for number line (complex numbers use real part)
const realPartForLine = computed(() => {
  if (parsedNumber.value === null) return null
  if (typeof parsedNumber.value === 'object') {
    return parsedNumber.value.real
  }
  return parsedNumber.value
})
</script>
```

Add visualization section to template (after the main grid):

```vue
<template>
  <div class="number-type-explorer">
    <!-- Main content grid (existing) -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- ... existing input and results sections ... -->
    </div>
    
    <!-- Visualizations Section -->
    <div v-if="parsedNumber !== null && isValid" class="mt-6">
      <!-- Toggle buttons -->
      <div class="flex flex-wrap gap-2 mb-4">
        <VisualizationToggle
          v-model="showNumberLine"
          label="Number Line"
          icon="fa-solid fa-ruler-horizontal"
        />
        <VisualizationToggle
          v-model="showVennDiagram"
          label="Set Diagram"
          icon="fa-solid fa-circle-nodes"
        />
      </div>
      
      <!-- Visualization panels -->
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Number Line -->
        <div 
          v-if="showNumberLine" 
          class="card p-4"
        >
          <h4 class="text-sm font-semibold text-text-muted mb-3">
            <i class="fa-solid fa-ruler-horizontal mr-2" aria-hidden="true" />
            Position on Number Line
          </h4>
          <NumberLine 
            :value="realPartForLine" 
            :auto-zoom="true"
          />
          <p 
            v-if="typeof parsedNumber === 'object'" 
            class="text-xs text-text-muted mt-2 text-center"
          >
            Showing real part only (complex numbers exist in 2D)
          </p>
        </div>
        
        <!-- Venn Diagram -->
        <div 
          v-if="showVennDiagram" 
          class="card p-4"
        >
          <h4 class="text-sm font-semibold text-text-muted mb-3">
            <i class="fa-solid fa-circle-nodes mr-2" aria-hidden="true" />
            Set Membership
          </h4>
          <SetVennDiagram 
            :membership="classification" 
            :show-labels="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

## Success Criteria
- [ ] Number line shows position with auto-zoom
- [ ] Number line handles large numbers gracefully
- [ ] Number line shows tick marks with nice intervals
- [ ] Venn diagram shows nested sets correctly
- [ ] Active sets are highlighted in Venn diagram
- [ ] Marker appears in innermost set
- [ ] Toggle buttons show/hide visualizations
- [ ] Complex numbers show real part on number line
- [ ] Infinity shows appropriate message
- [ ] Visualizations are responsive
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes

## Verification
1. Enter `42` - number line shows at 42, Venn highlights ℕ through ℂ
2. Enter `1000` - number line auto-zooms to fit
3. Enter `-7` - number line shows negative, Venn highlights ℤ through ℂ
4. Enter `3+4i` - number line shows 3, Venn highlights only ℂ
5. Enter `infinity` - number line shows appropriate message
6. Toggle buttons - visualizations show/hide correctly

## Next Increment
After completion, proceed to `inc_4e.md` for content migration from archive.
