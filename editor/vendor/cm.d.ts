// Typings of cm.js, built from vendor-src/cm-entry.ts: keep both in step.
export type Typography = {
  cssFontFamily?: string
  fontSize?: number
  lineHeight?: number
  wordWrap?: 'on' | 'off'
}
export type ColorKey = 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'type' | 'property' | 'tag'
export type Highlight = {
  enabled: boolean
  /** `auto`, `one-dark`, `light`, `github-light`, `github-dark` or `solarized`; unknown means `auto`. */
  theme: string
  /** Already-validated CSS colours; missing keys keep the theme's colour. */
  colors: Partial<Record<ColorKey, string>>
}
export type MountOptions = {
  parent: HTMLElement
  text: string
  readOnly: boolean
  language: string
  dark: boolean
  onChange(text: string): void
  onWrite(): void
  onNotify(message: string): void
  onQuit(force: boolean): void
}
export function mountVim(opts: MountOptions): {
  focus(): void
  getText(): string
  setText(next: string): void
  setReadOnly(v: boolean): void
  setTypography(t: Typography): void
  setDark(dark: boolean): void
  setHighlight(highlight: Highlight): void
}
