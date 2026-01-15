/**
 * Content structure types for SnakeMath educational content
 */

/**
 * A major topic area (e.g., Basics, Algebra, Calculus)
 */
export interface Topic {
  /** URL-friendly identifier */
  id: string
  /** Display title */
  title: string
  /** Brief description for cards/previews */
  description: string
  /** Emoji or icon identifier */
  icon: string
  /** List of subtopics within this topic */
  subtopics: Subtopic[]
}

/**
 * A page within a topic
 */
export interface Subtopic {
  /** URL-friendly identifier */
  id: string
  /** Display title */
  title: string
  /** Brief description */
  description: string
  /** Full route path (e.g., '/basics/foundations') */
  path: string
}

/**
 * A collapsible section within a content page
 */
export interface ContentSection {
  /** Anchor ID for deep linking */
  id: string
  /** Section title */
  title: string
  /** Whether section is expanded by default */
  defaultExpanded: boolean
}

/**
 * Navigation breadcrumb item
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string
  /** Route path (omit for current/last item) */
  path?: string
}

/**
 * Difficulty level for content
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

/**
 * Metadata for a content page
 */
export interface ContentMeta {
  title: string
  description: string
  difficulty: DifficultyLevel
  prerequisites: string[]
  relatedTopics: string[]
  hasInteractive: boolean
  hasCodeExamples: boolean
}
