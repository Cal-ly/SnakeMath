<script setup lang="ts">
interface Props {
  expanded?: boolean
}

withDefaults(defineProps<Props>(), {
  expanded: false,
})

defineEmits<{
  expand: []
}>()
</script>

<template>
  <div
    class="causation-warning p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg"
    data-testid="causation-warning"
  >
    <h4 class="font-bold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
      <i class="fa-solid fa-exclamation-circle" aria-hidden="true" />
      Correlation ≠ Causation
    </h4>

    <p class="text-sm text-red-600 dark:text-red-400 mb-3">
      Just because two variables are correlated does NOT mean one causes the other.
    </p>

    <div v-if="expanded" class="space-y-3">
      <div class="text-sm text-red-600 dark:text-red-400">
        <p class="font-medium mb-2">Three possibilities when X and Y are correlated:</p>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li><strong>X causes Y</strong> — X directly influences Y</li>
          <li><strong>Y causes X</strong> — The relationship is reversed</li>
          <li><strong>Z causes both</strong> — A hidden "confounding" variable</li>
        </ul>
      </div>

      <div class="p-3 bg-red-100 dark:bg-red-800/30 rounded-lg">
        <p class="text-sm text-red-700 dark:text-red-300 font-medium mb-2">Famous Examples:</p>
        <ul class="text-xs text-red-600 dark:text-red-400 space-y-1">
          <li>
            <strong>Ice cream sales ↔ Drowning deaths</strong>
            (r ≈ 0.9) — Both caused by summer heat
          </li>
          <li>
            <strong>Shoe size ↔ Reading ability</strong>
            (r ≈ 0.8 in children) — Both caused by age
          </li>
          <li>
            <strong>Nicolas Cage films ↔ Pool drownings</strong>
            — Spurious correlation from data mining
          </li>
        </ul>
      </div>

      <div class="p-3 bg-red-100 dark:bg-red-800/30 rounded-lg">
        <p class="text-sm text-red-700 dark:text-red-300 font-medium mb-1">For programmers:</p>
        <p class="text-xs text-red-600 dark:text-red-400">
          When your ML model finds a correlation between feature X and target Y, it doesn't mean X
          <em>causes</em> Y. The model might be picking up on confounders, reverse causation,
          or spurious patterns. Establishing causation requires controlled experiments or causal inference techniques.
        </p>
      </div>
    </div>

    <button
      v-if="!expanded"
      class="text-sm text-red-600 dark:text-red-400 underline mt-2"
      @click="$emit('expand')"
    >
      Learn more about this critical concept
    </button>
  </div>
</template>
