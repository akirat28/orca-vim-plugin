import { mountVim } from './vendor/cm.js'
import { start } from './sync'
import { readHighlight } from './settings'

/** Mounts the Vim editor for one language group. Called by editor/langs/<language>.ts. */
export async function run(language: string): Promise<void> {
  const doc = await start()

  document.documentElement.style.height = '100%'
  document.body.style.cssText = 'margin:0;height:100vh;overflow:hidden'
  const style = document.createElement('style')
  style.textContent = `
    #vim-root { position: fixed; inset: 0; }
    .cm-editor { height: 100%; color: var(--orca-foreground); background: var(--orca-background); }
    .cm-editor.cm-focused { outline: none; }
    .cm-scroller { font-family: ui-monospace, Menlo, monospace;
      scrollbar-color: color-mix(in srgb, var(--orca-muted-foreground) 45%, transparent) var(--orca-background); }
    .cm-scroller::-webkit-scrollbar-corner { background: var(--orca-background); }
    .cm-gutters { background: var(--orca-background); color: var(--orca-muted-foreground); border: 0; }
    .cm-activeLine, .cm-activeLineGutter { background: color-mix(in srgb, var(--orca-accent) 55%, transparent); }
    .cm-cursor, .cm-dropCursor { border-left-color: var(--orca-foreground); }
    .cm-fat-cursor { background: var(--orca-primary) !important; color: var(--orca-primary-foreground) !important; }
    .cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground {
      background: color-mix(in srgb, var(--orca-primary) 35%, transparent) !important; }
    .cm-panels { background: var(--orca-card); color: var(--orca-card-foreground);
      border-top: 1px solid var(--orca-border, transparent); font-family: ui-monospace, Menlo, monospace; }
    .cm-vim-panel { padding: 2px 10px; }
    .cm-vim-panel input { background: transparent; color: inherit; border: 0; outline: 0; font: inherit; }
    .cm-searchMatch { background: color-mix(in srgb, var(--orca-primary) 30%, transparent); }
    .cm-matchingBracket { background: color-mix(in srgb, var(--orca-primary) 30%, transparent); }
    html.dark .cm-content { caret-color: var(--orca-foreground); }
    #toast { position: fixed; right: 12px; bottom: 36px; padding: 4px 10px; border-radius: 6px;
      background: var(--orca-popover); color: var(--orca-popover-foreground); font: 12px system-ui;
      opacity: 0; transition: opacity .2s; pointer-events: none; }
    #toast.show { opacity: 1; }
  `
  document.head.append(style)
  const root = document.createElement('div')
  root.id = 'vim-root'
  const toast = document.createElement('div')
  toast.id = 'toast'
  document.body.append(root, toast)

  let timer: ReturnType<typeof setTimeout> | undefined
  const notify = (message: string) => {
    toast.textContent = message
    toast.classList.add('show')
    clearTimeout(timer)
    timer = setTimeout(() => toast.classList.remove('show'), 2200)
  }

  // The text as last known to be in step with Orca/disk: the opening text, a file change from
  // outside, or what a save/flush sent. `:q!` goes back to it.
  let baseline = doc.value

  const editor = mountVim({
    parent: root,
    text: doc.value,
    readOnly: doc.readOnly,
    language,
    dark: document.documentElement.classList.contains('dark'),
    onChange: (text) => doc.change(text),
    onWrite: () => {
      doc.flush().then(
        () => notify('変更を反映しました（ディスクへの保存は Cmd/Ctrl+S）'),
        (e: unknown) => notify(`反映に失敗: ${String((e as { code?: string })?.code ?? e)}`)
      )
    },
    onNotify: notify,
    onQuit: (force) => {
      if (force) {
        editor.setText(baseline)
        doc.change(baseline)
        doc.flush().catch(() => undefined)
        notify('変更を破棄しました。タブは Cmd/Ctrl+W で閉じてください')
      } else if (editor.getText() !== baseline) {
        notify('E37: 最後の保存後に変更があります（:q! で破棄）')
      } else {
        notify('タブは Cmd/Ctrl+W で閉じてください')
      }
    }
  })

  doc.onReplace((value) => {
    baseline = value
    editor.setText(value)
  })

  const applyDark = () => {
    const dark = document.documentElement.classList.contains('dark')
    // Native widgets (scrollbars) follow color-scheme, not the theme class.
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    editor.setDark(dark)
  }
  applyDark()
  orca.on('theme', applyDark)

  const applyTypography = (t: Parameters<typeof editor.setTypography>[0]) => editor.setTypography(t)
  try {
    applyTypography(await orca.host.call('editor.readTypography', undefined))
  } catch {
    // Typography is cosmetic; fall back to the stylesheet defaults.
  }
  try {
    orca.on('editor.typography.changed', applyTypography)
  } catch {
    // Needs no capability, but keep the editor usable if the event is unavailable.
  }

  // Let a pending edit reach Orca before it saves.
  orca.on('editor.flush', () => {
    baseline = editor.getText()
    doc.flush().catch(() => undefined)
  })

  editor.focus()

  // Colours come last and are not awaited, so a slow settings read never delays the flush
  // handler or focus.
  const applySettings = async () => {
    const { highlight, invalid } = readHighlight(await orca.settings.get(), (v) => CSS.supports('color', v))
    editor.setHighlight(highlight)
    if (invalid.length > 0) {
      notify(`色の指定が無効なため無視しました: ${invalid.join(', ')}`)
    }
  }
  try {
    orca.settings.onDidChange(() => {
      applySettings().catch(() => undefined)
    })
  } catch {
    // Settings are cosmetic; keep the default colours if they cannot be read.
  }
  applySettings().catch(() => undefined)
}
