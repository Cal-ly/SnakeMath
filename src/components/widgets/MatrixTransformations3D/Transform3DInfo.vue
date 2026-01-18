<script setup lang="ts">
import type { Rotation3DType } from '@/types/math'

interface Props {
  transformationType: Rotation3DType
  determinant: number
  isOrthogonal: boolean
  isRotation: boolean
  preservesOrientation: boolean
}

defineProps<Props>()

// Get description for current transformation type
function getTypeDescription(type: Rotation3DType): string {
  const descriptions: Record<Rotation3DType, string> = {
    identity: 'No transformation - vectors remain unchanged.',
    rotationX: 'Rotation around the X-axis (pitch). Y and Z coordinates change.',
    rotationY: 'Rotation around the Y-axis (yaw). X and Z coordinates change.',
    rotationZ: 'Rotation around the Z-axis (roll). X and Y coordinates change.',
    combined: 'Sequential rotations around X, Y, then Z axes (Euler angles).',
    scale: 'Uniform scaling - all coordinates multiplied by the same factor.',
  }
  return descriptions[type] || ''
}
</script>

<template>
  <div class="transform-3d-info space-y-4">
    <!-- Transformation Description -->
    <div class="text-sm text-text-secondary">
      {{ getTypeDescription(transformationType) }}
    </div>

    <!-- Properties -->
    <div class="space-y-2">
      <!-- Determinant -->
      <div class="flex justify-between items-center p-2 rounded bg-surface">
        <span class="text-sm text-text-muted">Determinant</span>
        <span class="font-mono text-sm" :class="determinant > 0 ? 'text-green-600' : 'text-red-600'">
          {{ determinant.toFixed(4) }}
        </span>
      </div>

      <!-- Property badges -->
      <div class="flex flex-wrap gap-2">
        <span
          v-if="isOrthogonal"
          class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          title="Preserves lengths and angles"
        >
          Orthogonal
        </span>
        <span
          v-if="isRotation"
          class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          title="Pure rotation (det = 1)"
        >
          Rotation
        </span>
        <span
          v-if="preservesOrientation"
          class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
          title="Handedness preserved (det > 0)"
        >
          Orientation+
        </span>
        <span
          v-else
          class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          title="Handedness flipped (det < 0)"
        >
          Orientation-
        </span>
      </div>
    </div>

    <!-- Key concepts -->
    <div class="p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <p class="text-xs text-text-secondary">
        <strong class="text-primary">Key:</strong>
        det = 1 for rotations, |det| = scale&sup3; for scaling.
        Orthogonal matrices preserve the unit cube's volume.
      </p>
    </div>
  </div>
</template>
