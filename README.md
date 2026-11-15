# Vim Editor for Orca

Orca のエディタタブで、Vim のキーバインドが使えるようになるプラグインです。
[CodeMirror 6](https://codemirror.net/) と [`@replit/codemirror-vim`](https://github.com/replit/codemirror-vim) を同梱しており、ネットワーク接続は不要です。

- ノーマル / 挿入 / ビジュアルモード、オペレータ + モーション、テキストオブジェクト、`.` リピート、レジスタ、マクロ、`/` 検索、`:s` 置換など
- Orca のテーマ（ライト / ダーク）とエディタのフォント設定に追従
- 構文ハイライト: JavaScript / TypeScript / JSON / Markdown / Python / CSS / HTML / YAML / Rust / Go / XML / SQL

## インストール

前提: Orca が起動していて、プラグインが有効になっていること（設定 → Plugins → 「Turn on plugins」）。

```sh
orca plugin install akirat28/orca-vim-plugin
```

実行すると、付与される権限（`sandboxed-ui`: 開いたファイルの内容を読むエディタ）と公開元が表示され、承認が必要なため一度止まります（終了コード 3）。表示内容を確認し、問題なければ表示された `--approve` 付きのコマンドをそのまま実行してください。

```sh
orca plugin install akirat28/orca-vim-plugin --approve ap1-xxxxxxxx   # ap1-... は実際に表示された値
```

バージョンを固定する場合:

```sh
orca plugin install akirat28/orca-vim-plugin@v0.1.0
```

確認:

```sh
orca plugin list      # *.vim-editor が表示されれば OK
```

### 更新

```sh
orca plugin update
```

## アンインストール

```sh
orca plugin list                       # プラグインキーを確認（例: akirat28.vim-editor）
orca plugin uninstall <プラグインキー>
```

一時的に無効にするだけなら:

```sh
orca plugin disable <プラグインキー>
orca plugin enable <プラグインキー>
```

## 使い方

### Vim で開く

| ファイルの種類 | 動作 |
|---|---|
| 下記「自動で Vim で開く拡張子」 | 右ペインのファイル一覧でクリックするだけで Vim エディタで開きます |
| `.ts` `.json` `.md` `.yaml` `.csv` `.env` など、Orca が標準で開く形式 | 最初は通常のエディタ（Source）で開きます。エディタ右上の切替ボタン（ペン形のアイコン。ツールチップは「Vim」）で Vim に切り替えます |

- 切替の選択は**ファイルごと**に記憶されます。閉じて開き直しても Vim のままですが、別のファイルでは再度切り替えが必要です。
- Orca の仕様上、標準で開く形式をプラグインから自動で Vim にすることはできません。

**自動で Vim で開く拡張子**

`.js` `.mjs` `.cjs` `.jsx` / `.tsx` `.mts` `.cts` / `.jsonc` `.json5` / `.markdown` `.mdx` / `.py` `.pyi` / `.css` `.scss` `.less` / `.html` `.htm` `.vue` `.svelte` / `.yml` / `.rs` / `.go` / `.xml` `.svg` `.plist` / `.sql` / `.txt` `.log` `.conf` `.ini` `.toml` `.sh` `.zsh` `.bash` `.rb` `.java` `.c` `.h` `.cpp` `.hpp` `.swift` `.kt` `.lua` `.vim` `.cfg` `.tsv` `.diff` `.patch` `.php` `.pl` `.cs` `.dart` `.ex` `.exs` `.zig`

ファイル名: `.env` `.gitignore` `.zshrc` `.bashrc` `.vimrc` `Makefile` `Dockerfile`

（一部は Orca が標準で開く形式のため、実際には切替が必要になる場合があります。）

### 基本の流れ

1. ファイルを Vim で開くと、下部に `--NORMAL--` と表示されます（ノーマルモード）。
2. `i` で挿入モードに入って入力し、`Esc`（または `jj`）でノーマルモードに戻ります。
3. 編集内容は自動で Orca に反映されます。`:w` で即時に反映できます。
4. **ディスクへの保存は Orca の保存（Cmd/Ctrl+S）で行います。**

## 対応している Vim コマンド

### モード
| キー | 動作 |
|---|---|
| `Esc` / `jj` / `Ctrl-[` | ノーマルモードへ（`jj` は挿入モードのみ） |
| `i` `a` `I` `A` | 挿入（カーソル前 / 後 / 行頭 / 行末） |
| `o` `O` | 下 / 上に行を追加して挿入 |
| `v` `V` `Ctrl-v` | ビジュアル（文字 / 行 / 矩形） |
| `R` | 置換モード |

### 移動
| キー | 動作 |
|---|---|
| `h` `j` `k` `l` | 左 / 下 / 上 / 右 |
| `w` `b` `e` `W` `B` `E` | 単語単位 |
| `0` `^` `$` | 行頭 / 最初の文字 / 行末 |
| `gg` `G` `{n}G` | 先頭 / 末尾 / n 行目 |
| `{` `}` | 段落単位 |
| `%` | 対応する括弧へ |
| `f{c}` `F{c}` `t{c}` `T{c}` | 行内で文字へ移動（`;` `,` で繰り返し） |
| `H` `M` `L` | 画面の上 / 中 / 下 |
| `Ctrl-d` `Ctrl-u` `Ctrl-f` `Ctrl-b` | 半画面 / 1 画面スクロール |
| `zz` `zt` `zb` | カーソル行を中央 / 上 / 下に |

### 編集
| キー | 動作 |
|---|---|
| `x` `X` | 1 文字削除 |
| `dd` `D` | 行削除 / 行末まで削除 |
| `cc` `C` `s` `S` | 変更（削除して挿入） |
| `r{c}` | 1 文字置換 |
| `yy` `Y` | 行ヤンク（`Y` は行末まで） |
| `p` `P` | 貼り付け（後 / 前） |
| `u` `Ctrl-r` | 元に戻す / やり直し |
| `.` | 直前の変更を繰り返す |
| `~` `gu` `gU` | 大文字小文字の切替 / 小文字 / 大文字 |
| `J` | 行を連結 |
| `>>` `<<` | インデント / 逆インデント |
| `Ctrl-a` `Ctrl-x` | 数値を増減 |

### オペレータ + 範囲
`d` `c` `y` `>` `<` `gu` `gU` に、移動またはテキストオブジェクトを続けて使います。

- 移動との組み合わせ: `dw` `d$` `dG` `y}` など
- テキストオブジェクト: `iw` `aw` `ip` `ap` `i"` `a"` `i'` `i(` `a(` `i{` `a{` `i[` `it` `at`
- 例: `ciw`（単語を変更）、`di"`（引用符の中を削除）、`yap`（段落をヤンク）
- 回数指定: `3dd` `d2w` `5x`

### 検索・置換
| キー | 動作 |
|---|---|
| `/` `?` | 前方 / 後方検索 |
| `n` `N` | 次 / 前の検索結果 |
| `*` `#` | カーソル下の単語を検索 |
| `:s/old/new/g` | 行内で置換 |
| `:%s/old/new/g` | 全体で置換 |
| `:noh` | 検索ハイライトを消す |

### レジスタ・マーク・マクロ
| キー | 動作 |
|---|---|
| `"{r}y` `"{r}p` | 名前付きレジスタでヤンク / 貼り付け |
| `m{a-z}` `'{a-z}` `` `{a-z} `` | マークの設定 / 移動 |
| `q{r}` … `q` | マクロ記録 |
| `@{r}` `@@` | マクロ再生 / 直前を再生 |

### Ex コマンド（`:`）
| コマンド | 動作 |
|---|---|
| `:w` `:wq` `:x` | 変更を Orca に反映（ディスクへの保存は Cmd/Ctrl+S） |
| `:q` | 案内メッセージを表示（タブは Orca 側で閉じます） |
| `:{n}` | n 行目へ移動 |
| `:set ...` | 一部のオプション |
| `:map` 系 | キー割り当て |

### このプラグインで設定済みのキー割り当て
- 挿入モードの `jj` → `Esc`
- ノーマルモードの `Y` → `y$`

## 制限事項

- Orca が標準で開く形式（`.ts` `.json` `.md` など）は、ファイルごとに切替が必要です。Orca のプラグイン仕様による制約です。
- 切替ボタンのアイコンはペン形で固定です（プラグイン側では変更できません）。
- 分割ウィンドウ（`:sp` `Ctrl-w`）、`:e`、vimrc の読み込みには対応していません。
- Orca のショートカットと競合するキーがある場合があります。

## 開発

```sh
orca plugin validate .
orca plugin dev watch .     # Orca に読み込み、ログと再読み込みを表示（Ctrl-C で解除）
orca plugin test .
orca plugin check .
```

`editor/vendor/cm.js` は、CodeMirror を esbuild でバンドルした成果物です。バンドル元の `cm-entry.ts`（`vendor-src/` 内、Git 管理外）はこのリポジトリにはまだ含まれていません。作り直す場合の手順（`cm-entry.ts` は自分で用意）:

```sh
mkdir vendor-src && cd vendor-src
npm init -y
npm i -D esbuild codemirror @codemirror/state @codemirror/view @codemirror/commands \
  @codemirror/language @codemirror/search @codemirror/theme-one-dark @replit/codemirror-vim \
  @codemirror/lang-javascript @codemirror/lang-json @codemirror/lang-markdown @codemirror/lang-python \
  @codemirror/lang-css @codemirror/lang-html @codemirror/lang-yaml @codemirror/lang-rust \
  @codemirror/lang-go @codemirror/lang-xml @codemirror/lang-sql
# cm-entry.ts を置いて:
./node_modules/.bin/esbuild cm-entry.ts --bundle --format=esm --minify --target=es2022 --outfile=../editor/vendor/cm.js
```

`cm.js` は 1 MiB を超えないようにしてください（Orca の変換ファイルサイズ上限）。

## ライセンス

同梱している CodeMirror と `@replit/codemirror-vim` はいずれも MIT ライセンスです。
