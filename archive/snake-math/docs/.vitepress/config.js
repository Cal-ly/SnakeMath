export default {
  title: 'Snake Math',
  description: 'Interactive mathematical concepts powered by Python in your browser',
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Group Vue components together
            'components': [
              './docs/.vitepress/theme/components/ExponentialCalculator.vue',
              './docs/.vitepress/theme/components/LinearSystemSolver.vue',
              './docs/.vitepress/theme/components/StatisticsCalculator.vue',
              './docs/.vitepress/theme/components/ProbabilitySimulator.vue'
            ],
            // Separate heavy math/visualization components
            'math-viz': [
              './docs/.vitepress/theme/components/UnitCircleExplorer.vue',
              './docs/.vitepress/theme/components/FunctionPlotter.vue',
              './docs/.vitepress/theme/components/MatrixTransformations.vue'
            ],
            // Group utility components
            'utils': [
              './docs/.vitepress/theme/components/InteractiveSlider.vue',
              './docs/.vitepress/theme/components/MathDisplay.vue'
            ]
          }
        }
      },
      chunkSizeWarningLimit: 600
    }
  },
  head: [
    // PyScript 2025.5.1 CSS
    ['link', { 
      rel: 'stylesheet', 
      href: 'https://pyscript.net/releases/2025.5.1/core.css' 
    }],
    // PyScript 2025.5.1 Core JS  
    ['script', { 
      type: 'module',
      src: 'https://pyscript.net/releases/2025.5.1/core.js' 
    }],
    // Optional: Add some custom styling for PyScript output
    ['style', {}, `
      .py-terminal {
        background: #f8f9fa;
        border-left: 4px solid #4CAF50;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
      }
      
      .py-terminal:before {
        content: "🐍 Python Output:";
        display: block;
        font-weight: bold;
        color: #2E7D32;
        margin-bottom: 0.5rem;
        font-family: system-ui, sans-serif;
      }
    `]
  ],
  base: '/snake-math/',
  markdown: {
    math: true
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Basics', link: '/basics/' },
      { text: 'Algebra', link: '/algebra/' },
      { text: 'Statistics', link: '/statistics/' },
      { text: 'Trigonometry', link: '/trigonometry/' },
      { text: 'Linear Algebra', link: '/linear-algebra/' },
      { text: 'Calculus', link: '/calculus/' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Mathematical Foundations', link: '/basics/foundations' }
          ]
        },
        {
          text: 'Basics',
          items: [
            { text: 'Overview', link: '/basics/' },
            { text: 'Mathematical Foundations', link: '/basics/foundations' },
            { text: 'Variables & Expressions', link: '/basics/variables-expressions' },
            { text: 'Functions & Plotting', link: '/basics/functions' },
            { text: 'Number Theory', link: '/basics/number-theory' },
            { text: 'Order of Operations', link: '/basics/order-of-operations' }
          ]
        },
        {
          text: 'Algebra',
          items: [
            { text: 'Overview', link: '/algebra/' },
            { text: 'Summation Notation (Σ)', link: '/algebra/summation-notation/' },
            { text: 'Product Notation (Π)', link: '/algebra/product-notation/' },
            { text: 'Linear Equations', link: '/algebra/linear-equations/' },
            { text: 'Quadratic Functions', link: '/algebra/quadratics/' },
            { text: 'Exponentials & Logarithms', link: '/algebra/exponentials-logarithms/' }
          ]
        },
        {
          text: 'Statistics',
          items: [
            { text: 'Overview', link: '/statistics/' },
            { text: 'Descriptive Statistics', link: '/statistics/descriptive-stats/' },
            { text: 'Probability Distributions', link: '/statistics/probability/' }
          ]
        },
        {
          text: 'Trigonometry',
          items: [
            { text: 'Overview', link: '/trigonometry/' },
            { text: 'Unit Circle & Trig Functions', link: '/trigonometry/unit-circle/' }
          ]
        },
        {
          text: 'Linear Algebra',
          items: [
            { text: 'Overview', link: '/linear-algebra/' },
            { text: 'Vectors & Operations', link: '/linear-algebra/vectors/' },
            { text: 'Matrix Operations', link: '/linear-algebra/matrices/' }
          ]
        },
        {
          text: 'Calculus',
          items: [
            { text: 'Overview', link: '/calculus/' },
            { text: 'Limits & Continuity', link: '/calculus/limits/' }
          ]
        }
      ]
    }
  }
}