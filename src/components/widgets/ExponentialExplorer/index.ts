export { default as ExponentialExplorer } from './ExponentialExplorer.vue'
export { default as FunctionExplorerTab } from './FunctionExplorerTab.vue'
export { default as ComplexityComparisonTab } from './ComplexityComparisonTab.vue'
export { default as BaseSelector } from './BaseSelector.vue'
export { default as FunctionTypeSelector } from './FunctionTypeSelector.vue'
export { default as GrowthDecayPanel } from './GrowthDecayPanel.vue'
export { useExponentialExplorer } from './useExponentialExplorer'
export { basePresets, scenarioPresets, getBasePreset, getScenarioPreset } from './presets'
export type {
  FunctionType,
  ExplorerTab,
  BasePreset,
  ScenarioPreset,
  BasePresetId,
  ScenarioPresetId,
} from './types'
