<script setup lang="ts">
import { ref, computed, provide } from 'vue'

interface Tab {
  /** Tab label (used for slot name) */
  label: string
  /** Optional icon class */
  icon?: string
  /** Disabled state */
  disabled?: boolean
}

interface Props {
  /** Array of tab definitions */
  tabs: (string | Tab)[]
  /** Initially active tab (label) */
  defaultTab?: string
  /** ID prefix for accessibility */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: undefined,
  id: undefined,
})

const emit = defineEmits<{
  change: [tab: string]
}>()

// Normalize tabs to consistent format
const normalizedTabs = computed(() =>
  props.tabs.map((tab) =>
    typeof tab === 'string'
      ? { label: tab, icon: undefined, disabled: false }
      : { label: tab.label, icon: tab.icon, disabled: tab.disabled ?? false }
  )
)

// Active tab state
const activeTab = ref(props.defaultTab || normalizedTabs.value[0]?.label || '')

// Generate unique IDs
const groupId = computed(() => props.id || `tabs-${Math.random().toString(36).slice(2, 9)}`)
const getTabId = (label: string) =>
  `${groupId.value}-tab-${label.toLowerCase().replace(/\s+/g, '-')}`
const getPanelId = (label: string) =>
  `${groupId.value}-panel-${label.toLowerCase().replace(/\s+/g, '-')}`

// Convert label to slot name (handle spaces)
const getSlotName = (label: string) => label

function selectTab(label: string) {
  const tab = normalizedTabs.value.find((t) => t.label === label)
  if (tab && !tab.disabled) {
    activeTab.value = label
    emit('change', label)
  }
}

// Keyboard navigation
function handleKeydown(event: KeyboardEvent, index: number) {
  const enabledTabs = normalizedTabs.value.filter((t) => !t.disabled)
  const currentTab = normalizedTabs.value[index]
  if (!currentTab) return

  const currentEnabledIndex = enabledTabs.findIndex((t) => t.label === currentTab.label)

  let newIndex = currentEnabledIndex

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      newIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1
      break
    case 'ArrowRight':
      event.preventDefault()
      newIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      break
    case 'End':
      event.preventDefault()
      newIndex = enabledTabs.length - 1
      break
    default:
      return
  }

  const newTab = enabledTabs[newIndex]
  if (newTab) {
    selectTab(newTab.label)
    // Focus the new tab button
    const tabButton = document.getElementById(getTabId(newTab.label))
    tabButton?.focus()
  }
}

// Provide active tab to child components (if needed)
provide('activeTab', activeTab)
provide('groupId', groupId)
</script>

<template>
  <div class="tab-group">
    <!-- Tab List -->
    <div
      role="tablist"
      aria-label="Content tabs"
      class="tab-list flex border-b border-border overflow-x-auto scrollbar-hide"
    >
      <button
        v-for="(tab, index) in normalizedTabs"
        :id="getTabId(tab.label)"
        :key="tab.label"
        role="tab"
        :aria-selected="activeTab === tab.label"
        :aria-controls="getPanelId(tab.label)"
        :tabindex="activeTab === tab.label ? 0 : -1"
        :disabled="tab.disabled"
        class="tab-button relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
        :class="[
          activeTab === tab.label ? 'text-primary' : 'text-text-muted hover:text-text-primary',
          tab.disabled && 'opacity-50 cursor-not-allowed',
        ]"
        @click="selectTab(tab.label)"
        @keydown="handleKeydown($event, index)"
      >
        <span class="flex items-center gap-2">
          <i v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
          {{ tab.label }}
        </span>

        <!-- Active indicator -->
        <span
          v-if="activeTab === tab.label"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          aria-hidden="true"
        />
      </button>
    </div>

    <!-- Tab Panels -->
    <div class="tab-panels mt-4">
      <div
        v-for="tab in normalizedTabs"
        :id="getPanelId(tab.label)"
        :key="tab.label"
        role="tabpanel"
        :aria-labelledby="getTabId(tab.label)"
        :hidden="activeTab !== tab.label"
        :tabindex="activeTab === tab.label ? 0 : -1"
        class="tab-panel"
      >
        <slot v-if="activeTab === tab.label" :name="getSlotName(tab.label)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-list {
  /* Fade edges on scroll */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 1rem,
    black calc(100% - 1rem),
    transparent
  );
}

/* Remove mask on desktop where scroll is unlikely */
@media (min-width: 768px) {
  .tab-list {
    mask-image: none;
  }
}

/* Focus ring for accessibility */
.tab-button:focus-visible {
  @apply outline-none ring-2 ring-primary ring-offset-2 rounded;
}
</style>
