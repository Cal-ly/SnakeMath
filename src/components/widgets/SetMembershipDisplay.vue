<script setup lang="ts">
import MathBlock from '@/components/content/MathBlock.vue'

interface NumberSet {
  symbol: string
  latex: string
  name: string
  description: string
  isMember: boolean
}

interface Props {
  sets: NumberSet[]
}

defineProps<Props>()
</script>

<template>
  <div class="set-membership space-y-2">
    <div
      v-for="set in sets"
      :key="set.symbol"
      class="flex items-center gap-3 p-3 rounded-lg transition-colors"
      :class="set.isMember ? 'bg-primary/10' : 'bg-surface-alt'"
    >
      <!-- Membership indicator -->
      <span
        class="w-6 h-6 rounded-full flex items-center justify-center text-sm"
        :class="set.isMember ? 'bg-primary text-white' : 'bg-border text-text-muted'"
      >
        <i :class="set.isMember ? 'fa-solid fa-check' : 'fa-solid fa-minus'" aria-hidden="true" />
      </span>

      <!-- Set symbol -->
      <span class="text-xl w-8 text-center">
        <MathBlock :formula="set.latex" />
      </span>

      <!-- Set info -->
      <div class="flex-1 min-w-0">
        <span class="font-medium" :class="set.isMember ? 'text-text-primary' : 'text-text-muted'">
          {{ set.name }}
        </span>
        <span class="text-xs text-text-muted ml-2 hidden sm:inline">
          {{ set.description }}
        </span>
      </div>

      <!-- Membership text for screen readers -->
      <span class="sr-only">
        {{ set.isMember ? 'Member' : 'Not a member' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
