# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

Orca のエディタタブに Vim キーバインドを提供するプラグイン（id `vim-editor`、公開キー `akirat28.vim-editor`）。CodeMirror 6 + `@replit/codemirror-vim` をバンドル済みで同梱し、`execution: "sandboxed-ui"` / `frame: "isolated"` の iframe 内で動く。`package.json` は無く、ビルド・テストはすべて `orca` CLI で行う。

## コマンド

```sh
orca plugin types .          # .orca/types/ に型定義を生成（tsconfig が extends している。Git 管理外）
orca plugin validate .       # マニフェスト検証
orca plugin check .          # 検証 + カスタムエディタの静的チェック
orca plugin test .           # *.test.ts をすべて実行（node:test、orca/testing が解決される）
orca plugin dev watch .      # 開発版として Orca に読み込み、ログとリロードを表示
orca plugin dev inspect      # 開いているエディタの DevTools

cd vendor-src && npm ci && npm run build   # cm.js の再生成（tsc → esbuild → 1 MiB チェック）
vendor-src/node_modules/.bin/tsc -p . --noEmit   # editor/ の型チェック（npm ci 後）
```

- `orca plugin test` には個別テストの絞り込みオプションが無い。単一テストだけ回したいときは、そのファイルだけを含む一時フォルダを作るか、`test.only` を使う。
- 開発版とインストール版を同時に読み込むとエディタが重複登録される。`orca plugin dev unload <path>` で外す。

## アーキテクチャ

**エントリの仕組み**: `orca-plugin.json` の `customEditors` が言語グループごとに 14 個あり（すべて `title: "Vim"`）、それぞれ `editor/langs/<lang>.ts` を entry に持つ。各 entry は `await run('<lang>')` の 1 行だけ。言語を追加するときは「マニフェストのエントリ」「`langs/*.ts`」「`cm.js` 内の `T5()` の switch」の 3 か所を揃える必要があり、最後の 1 か所はバンドルの再生成が必要。`vim-plain`（言語 `plain` → ハイライトなし）は多数の拡張子と `filenames`（`.env`、`Makefile` など）を受け持つ。

**`editor/main.ts`**: DOM・CSS の準備（色はすべて `--orca-*` CSS 変数）、`mountVim()` の呼び出し、Orca との配線を行う。
- 編集 → `onChange` → `doc.change(text)` で Orca に逐次反映する。ディスクへの保存は Orca 側（Cmd/Ctrl+S）。
- `:w`/`:wq`/`:x` → `doc.flush()` + トースト通知。
- `:q` / `:q!` → Orca にタブを閉じる API が無いため、閉じずに通知だけ行う。`:q!` は `baseline`（開いた時点・外部からの置換・`editor.flush` 時点のテキスト）に戻して flush する。
- テーマ（`orca.on('theme')`）とフォント（`editor.readTypography` / `editor.typography.changed`）に追従する。

**`editor/sync.ts`**: Orca と通信する唯一の層。`orca.document.session({ merge: mergeText })` を返す。`mergeText` はテンプレート由来の暫定実装で、両側が変更していると `outside\nmine` と連結する（`sync.test.ts` もこの挙動を前提にしている）。

**`editor/vendor/cm.js`**: esbuild でバンドルした minify 済みの成果物（`cm.d.ts` がその型）。`mountVim()` の中で以下を定義している。
- Ex コマンド `write`/`wq`/`xit`/`quit`/`qall` の上書き
- `jj`→`<Esc>`（挿入モード）、`Y`→`y$`
- `setText` は annotation 付きで dispatch し、`onChange` に戻ってこないようにしている

配色はテーマ用の compartment にまとめてあり、`setDark` / `setHighlight` で組み直す。`highlight.theme` が `auto` で色の上書きが無いときは、従来どおり One Dark（ダーク）/ CodeMirror 標準（ライト）になる。色の上書きは、テーマの `specs` の後ろに同じタグの spec を追加して後勝ちにしている。

Vim の挙動・言語・配色を変える場合は `vendor-src/cm-entry.ts` を編集してバンドルを再生成し、`editor/vendor/cm.d.ts` も合わせて更新する。**`cm.js` は 1 MiB 以下に収めること**（Orca の変換ファイルサイズ上限。現状は約 880 KiB、`size-check.mjs` で検査）。`vendor-src/node_modules` があると `orca plugin inspect .` が symlink エラーで失敗する（開発版の読み込みでは `node_modules` は除外されるので問題ない）。

**設定**: `orca-plugin.json` の `contributes.settings`（`highlight.enabled`、`highlight.theme`、`color.<要素>`）と `capabilities: [{ "kind": "settings:own" }]`。`editor/settings.ts` の `readHighlight()` が設定値を `Highlight` に変換し、色は `CSS.supports('color', …)` で検証する。`main.ts` は起動時に読み込み、`orca.settings.onDidChange` で反映する。設定を追加するときは、マニフェスト、`settings.ts`（`COLOR_KEYS`）、`cm-entry.ts`（`COLOR_TAGS`）を揃える。

**できないこと**: テキストのカスタムエディタには、ファイル名も拡張子も渡されない（`fileType` が渡されるのは bytes エディタだけ）。そのため、拡張子ごとの言語の切り替えや、Vim で開く拡張子を設定で変えることはできない。

## 注意点

- プラグイン id に `orca-` 接頭辞は使えない（予約済み）。
- バージョン・ファイル・権限が変わるとインストール時のフィンガープリント（`ap1-…`）が変わり、ユーザーは再承認が必要になる。
- Orca が標準で開く形式（`.ts`、`.json`、`.md` など）は、`priority: "default"` でも自動では Vim で開かない。ファイルごとに切り替えが必要（Orca の仕様）。
- README とユーザー向けメッセージ（トースト）は日本語、コードコメントとコミットメッセージは英語。
- 同梱ライブラリの構成を変えたら `THIRD_PARTY_NOTICES.md` も更新する。
