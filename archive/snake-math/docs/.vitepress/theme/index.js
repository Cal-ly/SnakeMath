// docs/.vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import InteractiveSlider from './components/InteractiveSlider.vue'
import MathDisplay from './components/MathDisplay.vue'
import SummationDemo from './components/SummationDemo.vue'
import ProductNotationVisualizer from './components/ProductNotationVisualizer.vue'
import VariableExpressionExplorer from './components/VariableExpressionExplorer.vue'
import FunctionPlotter from './components/FunctionPlotter.vue'
import LinearSystemSolver from './components/LinearSystemSolver.vue'
import QuadraticExplorer from './components/QuadraticExplorer.vue'
import ExponentialCalculator from './components/ExponentialCalculator.vue'
import StatisticsCalculator from './components/StatisticsCalculator.vue'
import ProbabilitySimulator from './components/ProbabilitySimulator.vue'
import UnitCircleExplorer from './components/UnitCircleExplorer.vue'
import VectorOperations from './components/VectorOperations.vue'
import MatrixTransformations from './components/MatrixTransformations.vue'
import LimitsExplorer from './components/LimitsExplorer.vue'
import FunctionsVisualization from './components/FunctionsVisualization.vue'
import NumberTypeExplorer from './components/NumberTypeExplorer.vue'
import OperatorPrecedenceExplorer from './components/OperatorPrecedenceExplorer.vue'
import CodeFold from './components/CodeFold.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register all components globally
    app.component('InteractiveSlider', InteractiveSlider)
    app.component('MathDisplay', MathDisplay)
    app.component('SummationDemo', SummationDemo)
    app.component('ProductNotationVisualizer', ProductNotationVisualizer)
    app.component('VariableExpressionExplorer', VariableExpressionExplorer)
    app.component('FunctionPlotter', FunctionPlotter)
    app.component('LinearSystemSolver', LinearSystemSolver)
    app.component('QuadraticExplorer', QuadraticExplorer)
    app.component('ExponentialCalculator', ExponentialCalculator)
    app.component('StatisticsCalculator', StatisticsCalculator)
    app.component('ProbabilitySimulator', ProbabilitySimulator)
    app.component('UnitCircleExplorer', UnitCircleExplorer)
    app.component('VectorOperations', VectorOperations)
    app.component('MatrixTransformations', MatrixTransformations)
    app.component('LimitsExplorer', LimitsExplorer)
    app.component('FunctionsVisualization', FunctionsVisualization)
    app.component('NumberTypeExplorer', NumberTypeExplorer)
    app.component('OperatorPrecedenceExplorer', OperatorPrecedenceExplorer)
    app.component('CodeFold', CodeFold)
  }
}