<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ALL_IDENTITIES,
  getIdentitiesByCategory,
  getAllCategories,
  getCategoryLabel,
  type TrigIdentity,
  type IdentityCategory,
} from '@/utils/math/trigIdentities'
import IdentityCard from './IdentityCard.vue'

interface Props {
  syncUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: false,
})

const route = useRoute()
const router = useRouter()

// State
const selectedCategory = ref<IdentityCategory>('pythagorean')
const selectedIdentityId = ref<string>('pythagorean-main')
const angleDeg = ref(45)
const angleDeg2 = ref(30) // For sum/difference identities

// Get all categories
const categories = getAllCategories()

// Get identities for current category
const currentIdentities = computed(() => {
  return getIdentitiesByCategory(selectedCategory.value)
})

// Get selected identity
const selectedIdentity = computed(() => {
  return ALL_IDENTITIES.find(i => i.id === selectedIdentityId.value)
})

// Handle category change
function selectCategory(category: IdentityCategory) {
  selectedCategory.value = category
  // Select first identity in category
  const identities = getIdentitiesByCategory(category)
  if (identities.length > 0 && identities[0]) {
    selectedIdentityId.value = identities[0].id
  }
  updateUrl()
}

// Handle identity selection
function selectIdentity(identity: TrigIdentity) {
  selectedIdentityId.value = identity.id
  updateUrl()
}

// URL sync
function updateUrl() {
  if (!props.syncUrl) return
  router.replace({
    query: {
      ...route.query,
      category: selectedCategory.value,
      identity: selectedIdentityId.value,
      angle: angleDeg.value.toString(),
      angle2: angleDeg2.value.toString(),
    },
  })
}

function loadFromUrl() {
  if (!props.syncUrl) return
  if (route.query.category) {
    const cat = route.query.category as IdentityCategory
    if (categories.includes(cat)) {
      selectedCategory.value = cat
    }
  }
  if (route.query.identity) {
    const id = route.query.identity as string
    if (ALL_IDENTITIES.some(i => i.id === id)) {
      selectedIdentityId.value = id
    }
  }
  if (route.query.angle) {
    const a = parseInt(route.query.angle as string, 10)
    if (!isNaN(a)) {
      angleDeg.value = a
    }
  }
  if (route.query.angle2) {
    const a2 = parseInt(route.query.angle2 as string, 10)
    if (!isNaN(a2)) {
      angleDeg2.value = a2
    }
  }
}

// Watch for angle changes
watch(angleDeg, () => updateUrl())
watch(angleDeg2, () => updateUrl())

onMounted(() => {
  loadFromUrl()
})

// Check if current identity is a two-angle identity
const isTwoAngle = computed(() => {
  return ['sum-sin', 'diff-sin', 'sum-cos', 'diff-cos', 'sum-tan'].includes(selectedIdentityId.value)
})
</script>

<template>
  <div class="trig-identity-explorer" data-testid="trig-identity-explorer">
    <!-- Category Tabs -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="[
            selectedCategory === category
              ? 'bg-primary text-white'
              : 'bg-surface-alt border border-border hover:border-primary text-text-secondary hover:text-primary',
          ]"
          @click="selectCategory(category)"
        >
          {{ getCategoryLabel(category) }}
        </button>
      </div>
    </div>

    <!-- Angle Controls -->
    <div class="mb-6 p-4 bg-surface-alt rounded-lg border border-border">
      <div class="flex flex-wrap items-center gap-6">
        <!-- Primary angle -->
        <div class="flex items-center gap-3">
          <label for="angle-slider" class="text-sm font-medium text-text-secondary">
            θ = {{ angleDeg }}°
          </label>
          <input
            id="angle-slider"
            v-model.number="angleDeg"
            type="range"
            min="0"
            max="360"
            step="5"
            class="w-40 accent-primary"
          >
        </div>

        <!-- Secondary angle (for sum/diff) -->
        <div v-if="isTwoAngle" class="flex items-center gap-3">
          <label for="angle2-slider" class="text-sm font-medium text-text-secondary">
            B = {{ angleDeg2 }}°
          </label>
          <input
            id="angle2-slider"
            v-model.number="angleDeg2"
            type="range"
            min="0"
            max="360"
            step="5"
            class="w-40 accent-primary"
          >
        </div>

        <!-- Quick angle buttons -->
        <div class="flex gap-1">
          <button
            v-for="angle in [0, 30, 45, 60, 90, 180]"
            :key="angle"
            class="px-2 py-1 text-xs rounded border transition-colors"
            :class="[
              angleDeg === angle
                ? 'bg-primary text-white border-primary'
                : 'bg-surface border-border hover:border-primary',
            ]"
            @click="angleDeg = angle"
          >
            {{ angle }}°
          </button>
        </div>
      </div>
    </div>

    <!-- Identity Cards -->
    <div class="space-y-4">
      <IdentityCard
        v-for="identity in currentIdentities"
        :key="identity.id"
        :identity="identity"
        :angle-deg="angleDeg"
        :angle-deg2="angleDeg2"
        :is-selected="selectedIdentityId === identity.id"
        @select="selectIdentity(identity)"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="currentIdentities.length === 0"
      class="p-8 text-center text-text-muted"
    >
      <i class="fa-solid fa-equals text-4xl mb-2" aria-hidden="true" />
      <p>No identities in this category yet.</p>
    </div>
  </div>
</template>
