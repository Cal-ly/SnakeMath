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
    ],
  },
  // Future topics will be added here:
  // { id: 'algebra', title: 'Algebra', ... },
  // { id: 'statistics', title: 'Statistics', ... },
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
