<script setup lang="ts">
import { useTrigPlayground } from '@/composables/useTrigPlayground'
import DemoTabs from './DemoTabs.vue'
import RotationDemo from './RotationDemo.vue'
import WaveDemo from './WaveDemo.vue'
import CircularDemo from './CircularDemo.vue'
import ProjectileDemo from './ProjectileDemo.vue'

const {
  activeDemo,
  setActiveDemo,
  // Rotation
  rotationPointX,
  rotationPointY,
  rotationAngle,
  rotatedPoint,
  // Wave
  waveFrequency,
  waveAmplitude,
  wavePhase,
  wavePoints,
  // Circular
  circularRadius,
  circularPeriod,
  circularTime,
  circularPosition,
  isCircularAnimating,
  toggleCircularAnimation,
  resetCircularTime,
  // Projectile
  projectileSpeed,
  projectileAngle,
  trajectory,
  range,
  maxHeight,
} = useTrigPlayground()
</script>

<template>
  <div class="trig-code-playground" data-testid="trig-code-playground">
    <!-- Demo type selector -->
    <DemoTabs :active-demo="activeDemo" @update:active-demo="setActiveDemo" />

    <!-- Demo content -->
    <div class="mt-4">
      <!-- Rotation Demo -->
      <RotationDemo
        v-if="activeDemo === 'rotation'"
        v-model:point-x="rotationPointX"
        v-model:point-y="rotationPointY"
        v-model:angle="rotationAngle"
        :rotated-point="rotatedPoint"
      />

      <!-- Wave Demo -->
      <WaveDemo
        v-if="activeDemo === 'wave'"
        v-model:frequency="waveFrequency"
        v-model:amplitude="waveAmplitude"
        v-model:phase="wavePhase"
        :wave-points="wavePoints"
      />

      <!-- Circular Motion Demo -->
      <CircularDemo
        v-if="activeDemo === 'circular'"
        v-model:radius="circularRadius"
        v-model:period="circularPeriod"
        :time="circularTime"
        :position="circularPosition"
        :is-animating="isCircularAnimating"
        @toggle-animation="toggleCircularAnimation"
        @reset="resetCircularTime"
      />

      <!-- Projectile Demo -->
      <ProjectileDemo
        v-if="activeDemo === 'projectile'"
        v-model:speed="projectileSpeed"
        v-model:angle="projectileAngle"
        :trajectory="trajectory"
        :range="range"
        :max-height="maxHeight"
      />
    </div>
  </div>
</template>
