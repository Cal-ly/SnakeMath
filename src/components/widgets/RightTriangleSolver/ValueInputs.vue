<script setup lang="ts">
interface Props {
  inputA: string
  inputB: string
  inputC: string
  inputAngleA: string
  inputAngleB: string
  enabledA: boolean
  enabledB: boolean
  enabledC: boolean
  enabledAngleA: boolean
  enabledAngleB: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:inputA': [value: string]
  'update:inputB': [value: string]
  'update:inputC': [value: string]
  'update:inputAngleA': [value: string]
  'update:inputAngleB': [value: string]
  'update:enabledA': [value: boolean]
  'update:enabledB': [value: boolean]
  'update:enabledC': [value: boolean]
  'update:enabledAngleA': [value: boolean]
  'update:enabledAngleB': [value: boolean]
}>()

interface InputConfig {
  key: 'a' | 'b' | 'c' | 'A' | 'B'
  label: string
  description: string
  unit: string
  min: number
  max: number
  step: number
}

const sideInputs: InputConfig[] = [
  { key: 'a', label: 'Side a', description: 'Opposite to angle A', unit: '', min: 0.01, max: 9999, step: 0.1 },
  { key: 'b', label: 'Side b', description: 'Adjacent to angle A', unit: '', min: 0.01, max: 9999, step: 0.1 },
  { key: 'c', label: 'Side c', description: 'Hypotenuse', unit: '', min: 0.01, max: 9999, step: 0.1 },
]

const angleInputs: InputConfig[] = [
  { key: 'A', label: 'Angle A', description: 'At vertex A', unit: '°', min: 0.1, max: 89.9, step: 0.1 },
  { key: 'B', label: 'Angle B', description: 'At vertex B', unit: '°', min: 0.1, max: 89.9, step: 0.1 },
]

function getInputValue(key: string): string {
  switch (key) {
    case 'a': return props.inputA
    case 'b': return props.inputB
    case 'c': return props.inputC
    case 'A': return props.inputAngleA
    case 'B': return props.inputAngleB
    default: return ''
  }
}

function getEnabled(key: string): boolean {
  switch (key) {
    case 'a': return props.enabledA
    case 'b': return props.enabledB
    case 'c': return props.enabledC
    case 'A': return props.enabledAngleA
    case 'B': return props.enabledAngleB
    default: return false
  }
}

function handleInputChange(key: string, value: string) {
  switch (key) {
    case 'a':
      emit('update:inputA', value)
      break
    case 'b':
      emit('update:inputB', value)
      break
    case 'c':
      emit('update:inputC', value)
      break
    case 'A':
      emit('update:inputAngleA', value)
      break
    case 'B':
      emit('update:inputAngleB', value)
      break
  }
}

function handleEnabledChange(key: string, enabled: boolean) {
  switch (key) {
    case 'a':
      emit('update:enabledA', enabled)
      break
    case 'b':
      emit('update:enabledB', enabled)
      break
    case 'c':
      emit('update:enabledC', enabled)
      break
    case 'A':
      emit('update:enabledAngleA', enabled)
      break
    case 'B':
      emit('update:enabledAngleB', enabled)
      break
  }
}
</script>

<template>
  <div class="value-inputs space-y-4" data-testid="value-inputs">
    <!-- Sides Section -->
    <div>
      <h4 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
        <i class="fa-solid fa-ruler mr-2" aria-hidden="true" />
        Sides
      </h4>
      <div class="space-y-2">
        <div
          v-for="input in sideInputs"
          :key="input.key"
          class="flex items-center gap-3"
        >
          <label class="flex items-center gap-2 cursor-pointer min-w-0 flex-shrink-0">
            <input
              type="checkbox"
              :checked="getEnabled(input.key)"
              :data-testid="`enable-${input.key}`"
              class="rounded border-border accent-primary"
              @change="handleEnabledChange(input.key, ($event.target as HTMLInputElement).checked)"
            />
            <span
              class="text-sm font-medium w-16"
              :class="getEnabled(input.key) ? 'text-text-primary' : 'text-text-muted'"
            >
              {{ input.label }}
            </span>
          </label>

          <input
            type="number"
            :value="getInputValue(input.key)"
            :disabled="!getEnabled(input.key)"
            :min="input.min"
            :max="input.max"
            :step="input.step"
            :placeholder="input.description"
            :data-testid="`input-${input.key}`"
            class="flex-1 px-3 py-1.5 text-sm font-mono bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            @input="handleInputChange(input.key, ($event.target as HTMLInputElement).value)"
          />

          <span class="text-sm text-text-muted w-6">{{ input.unit }}</span>
        </div>
      </div>
    </div>

    <!-- Angles Section -->
    <div>
      <h4 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
        <i class="fa-solid fa-angle mr-2" aria-hidden="true" />
        Angles
      </h4>
      <div class="space-y-2">
        <div
          v-for="input in angleInputs"
          :key="input.key"
          class="flex items-center gap-3"
        >
          <label class="flex items-center gap-2 cursor-pointer min-w-0 flex-shrink-0">
            <input
              type="checkbox"
              :checked="getEnabled(input.key)"
              :data-testid="`enable-${input.key}`"
              class="rounded border-border accent-primary"
              @change="handleEnabledChange(input.key, ($event.target as HTMLInputElement).checked)"
            />
            <span
              class="text-sm font-medium w-16"
              :class="getEnabled(input.key) ? 'text-text-primary' : 'text-text-muted'"
            >
              {{ input.label }}
            </span>
          </label>

          <input
            type="number"
            :value="getInputValue(input.key)"
            :disabled="!getEnabled(input.key)"
            :min="input.min"
            :max="input.max"
            :step="input.step"
            :placeholder="input.description"
            :data-testid="`input-${input.key}`"
            class="flex-1 px-3 py-1.5 text-sm font-mono bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            @input="handleInputChange(input.key, ($event.target as HTMLInputElement).value)"
          />

          <span class="text-sm text-text-muted w-6">{{ input.unit }}</span>
        </div>
      </div>

      <p class="text-xs text-text-muted mt-2 italic">
        Note: Angle C is always 90° (right angle)
      </p>
    </div>

    <!-- Help text -->
    <div class="text-xs text-text-muted bg-surface-alt p-3 rounded border border-border">
      <p class="font-medium mb-1">How to use:</p>
      <ul class="list-disc list-inside space-y-0.5">
        <li>Check the boxes for values you know</li>
        <li>Enter at least 2 values (one must be a side)</li>
        <li>The solver will calculate the rest</li>
      </ul>
    </div>
  </div>
</template>
