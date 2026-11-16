import type { ColorKey, Highlight } from './vendor/cm.js'

/** The `color.<key>` settings declared in orca-plugin.json, in display order. */
export const COLOR_KEYS: ColorKey[] = ['keyword', 'string', 'comment', 'number', 'function', 'type', 'property', 'tag']

/** Turns the plugin's settings into a Highlight. `isColor` decides which strings are valid CSS
 *  colours; invalid ones are left out and returned so the caller can tell the person. */
export function readHighlight(
  settings: Record<string, unknown>,
  isColor: (value: string) => boolean
): { highlight: Highlight; invalid: string[] } {
  const colors: Highlight['colors'] = {}
  const invalid: string[] = []
  for (const key of COLOR_KEYS) {
    const raw = settings[`color.${key}`]
    const value = typeof raw === 'string' ? raw.trim() : ''
    if (!value) {
      continue
    }
    if (isColor(value)) {
      colors[key] = value
    } else {
      invalid.push(`color.${key}`)
    }
  }
  const theme = settings['highlight.theme']
  return {
    highlight: {
      enabled: settings['highlight.enabled'] !== false,
      theme: typeof theme === 'string' ? theme : 'auto',
      colors
    },
    invalid
  }
}
