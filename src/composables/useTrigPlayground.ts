import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { DemoType, Point2D, WaveParams, ProjectileParams } from '@/utils/math/trigApplications'
import {
  rotatePoint,
  circularMotion,
  sineWave,
  generateWavePoints,
  projectilePosition,
  projectileTrajectory,
  projectileRange,
  projectileMaxHeight,
  getPresetsByType,
  getTrigDemoPreset,
} from '@/utils/math/trigApplications'

export interface UseTrigPlaygroundOptions {
  syncUrl?: boolean
}

export function useTrigPlayground(options: UseTrigPlaygroundOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  // ============= State =============

  const activeDemo = ref<DemoType>('rotation')

  // Rotation demo state
  const rotationAngle = ref(45)
  const rotationPointX = ref(100)
  const rotationPointY = ref(0)

  // Wave demo state
  const waveFrequency = ref(1)
  const waveAmplitude = ref(50)
  const wavePhase = ref(0)

  // Circular motion state
  const circularRadius = ref(80)
  const circularPeriod = ref(5)
  const circularTime = ref(0)
  const isCircularAnimating = ref(false)

  // Projectile state
  const projectileSpeed = ref(20)
  const projectileAngle = ref(45)

  // Animation
  let animationFrame: number | null = null

  // ============= Computed =============

  // Rotation computed
  const rotatedPoint = computed<Point2D>(() => {
    return rotatePoint(
      { x: rotationPointX.value, y: rotationPointY.value },
      rotationAngle.value
    )
  })

  // Wave computed
  const waveParams = computed<WaveParams>(() => ({
    frequency: waveFrequency.value,
    amplitude: waveAmplitude.value,
    phase: wavePhase.value,
  }))

  const wavePoints = computed(() => {
    return generateWavePoints(waveParams.value, 2, 100) // 2 seconds, 100 samples/sec
  })

  // Circular motion computed
  const circularPosition = computed<Point2D>(() => {
    const angularSpeed = (2 * Math.PI) / circularPeriod.value
    return circularMotion(circularTime.value, circularRadius.value, angularSpeed)
  })

  // Projectile computed
  const projectileParams = computed<ProjectileParams>(() => ({
    speed: projectileSpeed.value,
    angleDeg: projectileAngle.value,
  }))

  const trajectory = computed(() => {
    return projectileTrajectory(projectileParams.value, 50)
  })

  const range = computed(() => {
    return projectileRange(projectileParams.value)
  })

  const maxHeight = computed(() => {
    return projectileMaxHeight(projectileParams.value)
  })

  // Presets for current demo
  const currentPresets = computed(() => {
    return getPresetsByType(activeDemo.value)
  })

  // ============= Methods =============

  function setActiveDemo(demo: DemoType) {
    activeDemo.value = demo
    stopAnimation()
    updateUrl()
  }

  // Rotation methods
  function setRotationAngle(angle: number) {
    rotationAngle.value = angle
    updateUrl()
  }

  function setRotationPoint(x: number, y: number) {
    rotationPointX.value = x
    rotationPointY.value = y
    updateUrl()
  }

  // Wave methods
  function setWaveFrequency(freq: number) {
    waveFrequency.value = freq
    updateUrl()
  }

  function setWaveAmplitude(amp: number) {
    waveAmplitude.value = amp
    updateUrl()
  }

  function setWavePhase(phase: number) {
    wavePhase.value = phase
    updateUrl()
  }

  // Circular motion methods
  function setCircularRadius(radius: number) {
    circularRadius.value = radius
    updateUrl()
  }

  function setCircularPeriod(period: number) {
    circularPeriod.value = period
    updateUrl()
  }

  function toggleCircularAnimation() {
    isCircularAnimating.value = !isCircularAnimating.value
    if (isCircularAnimating.value) {
      startCircularAnimation()
    } else {
      stopAnimation()
    }
  }

  function startCircularAnimation() {
    let lastTime = performance.now()

    function animate(currentTime: number) {
      const deltaTime = (currentTime - lastTime) / 1000 // Convert to seconds
      lastTime = currentTime
      circularTime.value += deltaTime

      if (isCircularAnimating.value) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
  }

  function stopAnimation() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
    isCircularAnimating.value = false
  }

  function resetCircularTime() {
    circularTime.value = 0
  }

  // Projectile methods
  function setProjectileSpeed(speed: number) {
    projectileSpeed.value = speed
    updateUrl()
  }

  function setProjectileAngle(angle: number) {
    projectileAngle.value = angle
    updateUrl()
  }

  // Preset application
  function applyPreset(presetId: string) {
    const preset = getTrigDemoPreset(presetId)
    if (!preset) return

    activeDemo.value = preset.demoType

    switch (preset.demoType) {
      case 'rotation':
        rotationPointX.value = preset.params.x ?? 100
        rotationPointY.value = preset.params.y ?? 0
        rotationAngle.value = preset.params.angle ?? 45
        break
      case 'wave':
        waveFrequency.value = preset.params.frequency ?? 1
        waveAmplitude.value = preset.params.amplitude ?? 50
        wavePhase.value = preset.params.phase ?? 0
        break
      case 'circular':
        circularRadius.value = preset.params.radius ?? 80
        circularPeriod.value = preset.params.period ?? 5
        break
      case 'projectile':
        projectileSpeed.value = preset.params.speed ?? 20
        projectileAngle.value = preset.params.angle ?? 45
        break
    }

    updateUrl()
  }

  // ============= URL State Sync =============

  function updateUrl() {
    if (options.syncUrl === false) return

    const params: Record<string, string> = {
      demo: activeDemo.value,
    }

    switch (activeDemo.value) {
      case 'rotation':
        params.angle = rotationAngle.value.toString()
        params.px = rotationPointX.value.toString()
        params.py = rotationPointY.value.toString()
        break
      case 'wave':
        params.freq = waveFrequency.value.toString()
        params.amp = waveAmplitude.value.toString()
        params.phase = wavePhase.value.toString()
        break
      case 'circular':
        params.radius = circularRadius.value.toString()
        params.period = circularPeriod.value.toString()
        break
      case 'projectile':
        params.speed = projectileSpeed.value.toString()
        params.pangle = projectileAngle.value.toString()
        break
    }

    router.replace({ query: params })
  }

  function loadFromUrl() {
    if (options.syncUrl === false) return

    const { demo, angle, px, py, freq, amp, phase, radius, period, speed, pangle } = route.query

    if (demo && ['rotation', 'wave', 'circular', 'projectile'].includes(demo as string)) {
      activeDemo.value = demo as DemoType
    }

    // Rotation params
    if (angle) rotationAngle.value = parseFloat(angle as string) || 45
    if (px) rotationPointX.value = parseFloat(px as string) || 100
    if (py) rotationPointY.value = parseFloat(py as string) || 0

    // Wave params
    if (freq) waveFrequency.value = parseFloat(freq as string) || 1
    if (amp) waveAmplitude.value = parseFloat(amp as string) || 50
    if (phase) wavePhase.value = parseFloat(phase as string) || 0

    // Circular params
    if (radius) circularRadius.value = parseFloat(radius as string) || 80
    if (period) circularPeriod.value = parseFloat(period as string) || 5

    // Projectile params
    if (speed) projectileSpeed.value = parseFloat(speed as string) || 20
    if (pangle) projectileAngle.value = parseFloat(pangle as string) || 45
  }

  // Load initial URL state
  loadFromUrl()

  // Watch for route changes
  watch(
    () => route.query,
    () => loadFromUrl(),
    { deep: true }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    stopAnimation()
  })

  return {
    // State
    activeDemo,
    rotationAngle,
    rotationPointX,
    rotationPointY,
    waveFrequency,
    waveAmplitude,
    wavePhase,
    circularRadius,
    circularPeriod,
    circularTime,
    isCircularAnimating,
    projectileSpeed,
    projectileAngle,

    // Computed
    rotatedPoint,
    waveParams,
    wavePoints,
    circularPosition,
    projectileParams,
    trajectory,
    range,
    maxHeight,
    currentPresets,

    // Methods
    setActiveDemo,
    setRotationAngle,
    setRotationPoint,
    setWaveFrequency,
    setWaveAmplitude,
    setWavePhase,
    setCircularRadius,
    setCircularPeriod,
    toggleCircularAnimation,
    resetCircularTime,
    setProjectileSpeed,
    setProjectileAngle,
    applyPreset,
    stopAnimation,
  }
}
