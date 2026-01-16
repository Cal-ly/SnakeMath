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
