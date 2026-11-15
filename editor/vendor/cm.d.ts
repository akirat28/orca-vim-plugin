export type Typography = {
  cssFontFamily?: string
  fontSize?: number
  lineHeight?: number
  wordWrap?: 'on' | 'off'
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
}
