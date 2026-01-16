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
        description: 'Understanding ℕ, ℤ, ℚ, ℝ, and ℂ',
        path: '/basics/number-types',
        faIcon: 'fa-solid fa-hashtag',
      },
      {
        id: 'functions',
        title: 'Functions',
        description: 'Input, output, and the f(x) notation',
        path: '/basics/functions',
        faIcon: 'fa-solid fa-arrow-right-arrow-left',
      },
      {
        id: 'variables',
        title: 'Variables & Expressions',
        description: 'Named values and how to combine them',
        path: '/basics/variables',
        faIcon: 'fa-solid fa-box-archive',
      },
      {
        id: 'order-of-operations',
        title: 'Order of Operations',
        description: 'PEMDAS and operator precedence',
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
        title: 'Summation Notation',
        description: 'Sigma is just a for loop',
        path: '/algebra/summation',
        faIcon: 'fa-solid fa-sigma',
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
        description: 'Sine, cosine, and angles on a circle',
        path: '/trigonometry/unit-circle',
        faIcon: 'fa-solid fa-circle',
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
        description: 'Mean, median, variance, and data visualization',
        path: '/statistics/descriptive',
        faIcon: 'fa-solid fa-chart-simple',
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
