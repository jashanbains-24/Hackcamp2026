/**
 * Theme catalog.
 *
 * Color values live in styles.css / themes.css — this file is metadata only.
 */

export const THEMES = [
  {
    id: 'neighbourgrid',
    label: 'NeighbourGrid',
    description: 'Calm civic-tech mist ground with teal action and navy structure.',
  },
  {
    id: 'paper',
    label: 'Paper',
    description: 'Neutral light alternate for scaffold tooling.',
  },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

/** Read the currently active theme id from <html data-theme>. */
export function getActiveTheme(): ThemeId {
  if (typeof document === 'undefined') return 'neighbourgrid'
  const id = document.documentElement.getAttribute('data-theme') as ThemeId | null
  return id ?? 'neighbourgrid'
}

/** Look up a theme entry by id, or fall back to the first theme. */
export function getTheme(id: string) {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
