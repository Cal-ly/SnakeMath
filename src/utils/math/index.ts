export {
  classifyNumber,
  parseNumberInput,
  getClassificationDescription,
  generatePythonCode,
} from './numberClassification'

export {
  calculateVertex,
  calculateDiscriminant,
  solveQuadratic,
  toVertexForm,
  toFactoredForm,
  evaluateQuadratic,
  generateQuadraticPoints,
  getAxisOfSymmetry,
  getYIntercept,
  opensUpward,
  formatNumber,
} from './quadratic'

export type {
  QuadraticCoefficients,
  Vertex,
  DiscriminantResult,
  QuadraticRoots,
  VertexForm,
  FactoredForm,
} from './quadratic'

export {
  evaluateExponential,
  evaluateLogarithm,
  analyzeGrowthDecay,
  calculateDoublingTime,
  calculateHalfLife,
  calculateCompoundInterest,
  calculateContinuousInterest,
  compareComplexities,
  generateExponentialPoints,
  generateLogarithmPoints,
  isValidExponentialBase,
  isValidLogarithmInput,
  formatExponentialNumber,
  getComplexityDescription,
  complexityFunctions,
  complexityLabels,
  complexityColors,
  complexityExamples,
} from './exponential'

export type {
  ExponentialParams,
  LogarithmParams,
  GrowthDecayResult,
  CompoundInterestParams,
  CompoundInterestResult,
  ComplexityClass,
  ComplexityComparison,
} from './exponential'

export {
  calculateSum,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateRange,
  calculateVariance,
  calculateStdDev,
  calculatePercentile,
  calculateQuartiles,
  detectOutliers,
  calculateSkewness,
  suggestBinCount,
  generateHistogramBins,
  calculateFullStatistics,
  validateStatisticsInput,
  parseDataInput,
  formatStatValue,
  datasetPresets,
} from './statistics'

export type {
  DescriptiveStats,
  SpreadStats,
  Quartiles,
  OutlierAnalysis,
  SkewnessAnalysis,
  HistogramBin,
  HistogramData,
  FullStatistics,
  DatasetPreset,
  ParseResult,
  ValidationResult,
} from './statistics'
