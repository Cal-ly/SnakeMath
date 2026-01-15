export interface NavTopic {
  id: string
  title: string
  description: string
  icon: string
  path: string
  subtopics: NavSubtopic[]
}

export interface NavSubtopic {
  id: string
  title: string
  path: string
}

export const topics: NavTopic[] = [
  {
    id: 'basics',
    title: 'Mathematical Foundations',
    description: 'Core concepts every programmer should know',
    icon: '🧱',
    path: '/basics',
    subtopics: [
      { id: 'foundations', title: 'Foundations', path: '/basics/foundations' },
      { id: 'symbols', title: 'Math Symbols', path: '/basics/symbols' },
      { id: 'number-types', title: 'Number Types', path: '/basics/number-types' },
    ],
  },
  // Future topics will be added here
]

export function getTopicByPath(path: string): NavTopic | undefined {
  return topics.find((t) => path.startsWith(t.path))
}

export function getBreadcrumbs(path: string): Array<{ label: string; path?: string }> {
  const crumbs: Array<{ label: string; path?: string }> = [{ label: 'Home', path: '/' }]

  const topic = getTopicByPath(path)
  if (topic) {
    crumbs.push({ label: topic.title, path: topic.path })

    const subtopic = topic.subtopics.find((s) => s.path === path)
    if (subtopic) {
      crumbs.push({ label: subtopic.title })
    }
  }

  return crumbs
}
