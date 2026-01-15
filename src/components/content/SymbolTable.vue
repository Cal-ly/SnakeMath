<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MathSymbol } from '@/types'
import SearchInput from '@/components/ui/SearchInput.vue'
import MathBlock from '@/components/content/MathBlock.vue'

interface Props {
  /** Array of symbols to display */
  symbols: MathSymbol[]
  /** Enable search functionality */
  searchable?: boolean
  /** Columns to display */
  columns?: ('symbol' | 'name' | 'latex' | 'meaning' | 'programmingAnalogy' | 'pythonExample')[]
  /** Show LaTeX rendered instead of raw code */
  renderLatex?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  columns: () => ['symbol', 'name', 'meaning', 'programmingAnalogy'],
  renderLatex: false,
  searchPlaceholder: 'Search symbols...',
})

const searchQuery = ref('')

// Column labels
const columnLabels: Record<string, string> = {
  symbol: 'Symbol',
  name: 'Name',
  latex: 'LaTeX',
  meaning: 'Meaning',
  programmingAnalogy: 'Python',
  pythonExample: 'Example',
}

// Filter symbols based on search query
const filteredSymbols = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.symbols
  }

  const q = searchQuery.value.toLowerCase()
  return props.symbols.filter(
    (s) =>
      s.symbol.includes(searchQuery.value) ||
      s.name.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      s.programmingAnalogy?.toLowerCase().includes(q) ||
      s.latex.toLowerCase().includes(q)
  )
})

// Result count for screen readers
const resultText = computed(() => {
  const count = filteredSymbols.value.length
  const total = props.symbols.length
  if (!searchQuery.value) return ''
  return `${count} of ${total} symbols`
})

// Get value for a column
function getColumnValue(symbol: MathSymbol, col: string): string {
  return (symbol[col as keyof MathSymbol] as string) || '—'
}
</script>

<template>
  <div class="symbol-table">
    <!-- Search -->
    <div v-if="searchable" class="mb-4">
      <SearchInput
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        aria-label="Search symbols"
      />
      <!-- Live region for screen readers -->
      <div v-if="resultText" class="sr-only" role="status" aria-live="polite">
        {{ resultText }}
      </div>
      <p v-if="searchQuery && filteredSymbols.length === 0" class="mt-2 text-sm text-text-muted">
        No symbols found for "{{ searchQuery }}"
      </p>
      <p v-else-if="searchQuery" class="mt-2 text-sm text-text-muted">
        Showing {{ filteredSymbols.length }} of {{ symbols.length }} symbols
      </p>
    </div>

    <!-- Desktop: Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b-2 border-border">
            <th
              v-for="col in columns"
              :key="col"
              scope="col"
              class="text-left py-3 px-3 font-semibold text-text-primary bg-surface-alt"
            >
              {{ columnLabels[col] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="symbol in filteredSymbols"
            :key="symbol.symbol + symbol.name"
            class="border-b border-border/50 hover:bg-surface-alt/50 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col"
              class="py-3 px-3"
              :class="{
                'text-2xl': col === 'symbol',
                'font-mono text-primary text-xs':
                  col === 'programmingAnalogy' || col === 'pythonExample' || col === 'latex',
                'text-text-muted': col === 'meaning',
              }"
            >
              <template v-if="col === 'symbol' && renderLatex">
                <MathBlock :formula="symbol.latex" />
              </template>
              <template v-else-if="col === 'latex'">
                <code class="bg-code-bg px-1.5 py-0.5 rounded">{{ symbol.latex }}</code>
              </template>
              <template v-else>
                {{ getColumnValue(symbol, col) }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: Card View -->
    <div class="md:hidden space-y-3">
      <div
        v-for="symbol in filteredSymbols"
        :key="symbol.symbol + symbol.name"
        class="card p-4"
      >
        <div class="flex items-start gap-4">
          <!-- Symbol -->
          <div class="text-3xl w-12 text-center shrink-0">
            <template v-if="renderLatex">
              <MathBlock :formula="symbol.latex" />
            </template>
            <template v-else>
              {{ symbol.symbol }}
            </template>
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-text-primary">{{ symbol.name }}</h3>
            <p class="text-sm text-text-muted mt-1">{{ symbol.meaning }}</p>

            <!-- Programming analogy -->
            <div v-if="symbol.programmingAnalogy" class="mt-2">
              <code class="text-xs font-mono text-primary bg-code-bg px-2 py-1 rounded">
                {{ symbol.programmingAnalogy }}
              </code>
            </div>

            <!-- LaTeX (if in columns) -->
            <div v-if="columns.includes('latex')" class="mt-2 text-xs text-text-muted">
              LaTeX: <code class="bg-code-bg px-1 rounded">{{ symbol.latex }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredSymbols.length === 0 && searchQuery"
        class="text-center py-8 text-text-muted"
      >
        <i class="fa-solid fa-search text-3xl mb-2 opacity-50" aria-hidden="true" />
        <p>No symbols match your search</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure table doesn't break layout */
table {
  table-layout: auto;
}
</style>
