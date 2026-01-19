export interface NavTopic {
  id: string
  title: string
  description: string
  faIcon: string // Font Awesome icon class
  path: string
  subtopics: NavSubtopic[]
}

export interface NavSubtopic {
  id: string
  title: string
  description?: string
  path: string
  faIcon?: string
  unicodeIcon?: string // For special characters like Σ when no icon library has them
}

export const topics: NavTopic[] = [
  {
    id: 'basics',
    title: 'Foundations',
    description: 'Core mathematical concepts every programmer should know',
    faIcon: 'fa-solid fa-cubes',
    path: '/basics',
    subtopics: [
      {
        id: 'foundations',
        title: 'The Basics',
        description: 'Everything breaks down to four operators',
        path: '/basics/foundations',
        faIcon: 'fa-solid fa-plus-minus',
      },
      {
        id: 'symbols',
        title: 'Math Symbols',
        description: "A programmer's guide to mathematical notation",
        path: '/basics/symbols',
        faIcon: 'fa-solid fa-signs-post',
      },
      {
        id: 'number-types',
        title: 'Number Types',
        description: 'Nested sets from counting numbers to complex—pick the right container',
        path: '/basics/number-types',
        faIcon: 'fa-solid fa-hashtag',
      },
      {
        id: 'functions',
        title: 'Functions',
        description: 'Math machines—same input, same output, every time',
        path: '/basics/functions',
        faIcon: 'fa-solid fa-arrow-right-arrow-left',
      },
      {
        id: 'variables',
        title: 'Variables & Expressions',
        description: 'Labeled boxes for values, recipes that combine them',
        path: '/basics/variables',
        faIcon: 'fa-solid fa-box-archive',
      },
      {
        id: 'order-of-operations',
        title: 'Order of Operations',
        description: 'PEMDAS: the dressing order for math operations',
        path: '/basics/order-of-operations',
        faIcon: 'fa-solid fa-list-ol',
      },
    ],
  },
  {
    id: 'algebra',
    title: 'Algebra',
    description: 'Equations, patterns, and the language of mathematics',
    faIcon: 'fa-solid fa-superscript',
    path: '/algebra',
    subtopics: [
      {
        id: 'summation',
        title: 'Summation',
        description: 'Sigma is just a for loop',
        path: '/algebra/summation',
        unicodeIcon: 'Σ',
      },
      {
        id: 'product-notation',
        title: 'Product Notation',
        description: 'Pi is just a for loop with multiplication',
        path: '/algebra/product-notation',
        unicodeIcon: 'Π',
      },
      {
        id: 'linear-equations',
        title: 'Linear Equations',
        description: 'Systems of equations and linear algebra',
        path: '/algebra/linear-equations',
        faIcon: 'fa-solid fa-equals',
      },
      {
        id: 'quadratics',
        title: 'Quadratic Functions',
        description: 'Parabolas, roots, and the quadratic formula',
        path: '/algebra/quadratics',
        faIcon: 'fa-solid fa-chart-line',
      },
      {
        id: 'exponentials',
        title: 'Exponentials & Logarithms',
        description: 'Growth, decay, and algorithm complexity',
        path: '/algebra/exponentials',
        faIcon: 'fa-solid fa-arrow-up-right-dots',
      },
    ],
  },
  {
    id: 'trigonometry',
    title: 'Trigonometry',
    description: 'Angles, circles, and periodic functions',
    faIcon: 'fa-solid fa-circle-notch',
    path: '/trigonometry',
    subtopics: [
      {
        id: 'unit-circle',
        title: 'The Unit Circle',
        description: 'Every angle tells a story through its coordinates',
        path: '/trigonometry/unit-circle',
        faIcon: 'fa-solid fa-circle',
      },
      {
        id: 'right-triangles',
        title: 'Right Triangle Trig',
        description: 'SOHCAHTOA—the gateway to understanding angles',
        path: '/trigonometry/right-triangles',
        faIcon: 'fa-solid fa-draw-polygon',
      },
      {
        id: 'identities',
        title: 'Trig Identities',
        description: 'Equations that are always true—the cheat codes of trig',
        path: '/trigonometry/identities',
        faIcon: 'fa-solid fa-equals',
      },
      {
        id: 'inverse-functions',
        title: 'Inverse Functions',
        description: 'From coordinates to angles—atan2 is your best friend',
        path: '/trigonometry/inverse-functions',
        faIcon: 'fa-solid fa-rotate-left',
      },
      {
        id: 'trig-in-code',
        title: 'Trig in Code',
        description: 'Practical implementations: rotation, waves, physics, and more',
        path: '/trigonometry/trig-in-code',
        faIcon: 'fa-solid fa-code',
      },
    ],
  },
  {
    id: 'linear-algebra',
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and the math of machine learning',
    faIcon: 'fa-solid fa-arrows-up-down-left-right',
    path: '/linear-algebra',
    subtopics: [
      {
        id: 'vectors',
        title: 'Vectors in 2D',
        description: 'Arrows with purpose—magnitude and direction in one package',
        path: '/linear-algebra/vectors',
        faIcon: 'fa-solid fa-arrow-right',
      },
      {
        id: 'matrices',
        title: 'Matrices in 2D',
        description: 'Spreadsheets with superpowers—transform, rotate, reshape',
        path: '/linear-algebra/matrices',
        faIcon: 'fa-solid fa-table-cells',
      },
      {
        id: 'vectors-3d',
        title: 'Vectors in 3D',
        description: 'Cross products, right-hand rule, and physics applications',
        path: '/linear-algebra/vectors-3d',
        faIcon: 'fa-solid fa-cube',
      },
      {
        id: 'matrices-3d',
        title: 'Matrices in 3D',
        description: 'Rotation matrices, Euler angles, and 3D transformations',
        path: '/linear-algebra/matrices-3d',
        faIcon: 'fa-solid fa-cubes',
      },
    ],
  },
  {
    id: 'statistics',
    title: 'Statistics',
    description: 'Describing and analyzing data through numbers',
    faIcon: 'fa-solid fa-chart-pie',
    path: '/statistics',
    subtopics: [
      {
        id: 'descriptive',
        title: 'Descriptive Statistics',
        description: "Summarize any dataset's personality with a few key numbers",
        path: '/statistics/descriptive',
        faIcon: 'fa-solid fa-chart-simple',
      },
      {
        id: 'distributions',
        title: 'Probability Distributions',
        description: 'Each distribution is a personality profile for randomness',
        path: '/statistics/distributions',
        faIcon: 'fa-solid fa-bell',
      },
      {
        id: 'sampling',
        title: 'Sampling & Estimation',
        description: 'Measure some, estimate all — with confidence',
        path: '/statistics/sampling',
        faIcon: 'fa-solid fa-hand-pointer',
      },
      {
        id: 'hypothesis-testing',
        title: 'Hypothesis Testing',
        description: 'The scientific method, formalized — make decisions with data',
        path: '/statistics/hypothesis-testing',
        faIcon: 'fa-solid fa-scale-balanced',
      },
      {
        id: 'correlation',
        title: 'Correlation & Regression',
        description: 'Measuring relationships — the foundation of predictive modeling',
        path: '/statistics/correlation',
        faIcon: 'fa-solid fa-chart-scatter',
      },
    ],
  },
  {
    id: 'calculus',
    title: 'Calculus',
    description: 'The mathematics of change and accumulation',
    faIcon: 'fa-solid fa-infinity',
    path: '/calculus',
    subtopics: [
      {
        id: 'limits',
        title: 'Limits',
        description: 'What happens when we get really, really close?',
        path: '/calculus/limits',
        faIcon: 'fa-solid fa-arrows-to-dot',
      },
      {
        id: 'derivatives',
        title: 'Derivatives',
        description: 'Slopes, rates of change, and optimization',
        path: '/calculus/derivatives',
        faIcon: 'fa-solid fa-chart-line',
      },
    ],
  },
]

export function getTopicByPath(path: string): NavTopic | undefined {
  return topics.find((t) => path.startsWith(t.path))
}

export function getSubtopicByPath(path: string): NavSubtopic | undefined {
  for (const topic of topics) {
    const subtopic = topic.subtopics.find((s) => s.path === path)
    if (subtopic) return subtopic
  }
  return undefined
}

export function getBreadcrumbs(
  path: string,
): Array<{ label: string; path?: string; icon?: string }> {
  const crumbs: Array<{ label: string; path?: string; icon?: string }> = [
    { label: 'Home', path: '/', icon: 'fa-solid fa-house' },
  ]

  const topic = getTopicByPath(path)
  if (topic && path !== '/') {
    if (path === topic.path) {
      // On topic index page
      crumbs.push({ label: topic.title })
    } else {
      // On subtopic page
      crumbs.push({ label: topic.title, path: topic.path })

      const subtopic = topic.subtopics.find((s) => s.path === path)
      if (subtopic) {
        crumbs.push({ label: subtopic.title })
      }
    }
  }

  return crumbs
}
