# Vim Editor

A custom editor for `.orca-vim` files, in TypeScript with no build step. `editor/sync.ts` keeps the file in step through `orca.document.session` (replace its stand-in `mergeText` with your format's merge), and `editor/main.ts` is the view. `orca plugin test .` runs `editor/sync.test.ts` in Node with `mockEditorHost`; `orca plugin check .` reads every file the editor loads; `orca plugin shot <plugin-key> --editor <file>` saves a PNG of it. `"frame": "isolated"` keeps it to the Orca desktop app. Loading it needs approval: `orca plugin dev watch .` prints the exact access and the `--approve` fingerprint.

## Develop

```sh
orca plugin validate .
orca plugin dev watch .    # loads this folder into Orca and prints its logs and reloads; Ctrl-C unloads it
```

Orca names the publisher after where the plugin is installed from: the GitHub or GitLab owner of
its repository, or `local` for a folder. See
https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md.
