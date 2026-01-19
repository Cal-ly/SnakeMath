<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import TabGroup from '@/components/ui/TabGroup.vue'
import SymbolTable from '@/components/content/SymbolTable.vue'
import {
  arithmeticSymbols,
  algebraSymbols,
  calculusSymbols,
  setSymbols,
  logicSymbols,
  constantSymbols,
  mlSymbols,
} from '@/data/symbols'
import { greekLetters } from '@/data/symbols/greek'
import type { MathSymbol } from '@/types'

const relatedTopics = [
  { title: 'Foundations', path: '/basics/foundations', description: 'Core concepts' },
  { title: 'Number Types', path: '/basics/number-types', description: 'N, Z, Q, R, C' },
]

const tabs = [
  { label: 'Arithmetic', icon: 'fa-solid fa-plus-minus' },
  { label: 'Algebra', icon: 'fa-solid fa-superscript' },
  { label: 'Calculus', icon: 'fa-solid fa-wave-square' },
  { label: 'Sets', icon: 'fa-solid fa-diagram-project' },
  { label: 'Constants', icon: 'fa-solid fa-infinity' },
  { label: 'Greek', icon: 'fa-solid fa-font' },
  { label: 'ML', icon: 'fa-solid fa-brain' },
]

// Convert Greek letters to MathSymbol format for the table
const greekAsSymbols: MathSymbol[] = greekLetters.map((g) => ({
  symbol: `${g.lowercase} / ${g.uppercase}`,
  name: g.name,
  latex: g.latex,
  meaning: g.commonUses.join(', '),
  programmingAnalogy: `# ${g.latex} in LaTeX`,
  category: 'greek',
}))

// Combine sets and logic
const setsAndLogicSymbols = [...setSymbols, ...logicSymbols]
</script>

<template>
  <TopicPage
    title="Math Symbols"
    description="A programmer's guide to mathematical notation."
    :related-topics="relatedTopics"
  >
    <div class="space-y-6">
      <div class="card p-6">
        <p class="mb-6">
          Mathematical notation can look intimidating, but most symbols have simple
          programming equivalents. Use the tabs below to explore different categories,
          and search to find specific symbols.
        </p>

        <TabGroup :tabs="tabs" default-tab="Arithmetic">
          <template #Arithmetic>
            <SymbolTable
              :symbols="arithmeticSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Algebra>
            <SymbolTable
              :symbols="algebraSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Calculus>
            <SymbolTable
              :symbols="calculusSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Sets>
            <SymbolTable
              :symbols="setsAndLogicSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Constants>
            <SymbolTable
              :symbols="constantSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
            />
          </template>

          <template #Greek>
            <SymbolTable
              :symbols="greekAsSymbols"
              :columns="['symbol', 'name', 'latex', 'meaning']"
              search-placeholder="Search Greek letters..."
            />
          </template>

          <template #ML>
            <SymbolTable
              :symbols="mlSymbols"
              :columns="['symbol', 'name', 'meaning', 'programmingAnalogy']"
              search-placeholder="Search ML symbols..."
            />
          </template>
        </TabGroup>
      </div>
    </div>

  </TopicPage>
</template>
