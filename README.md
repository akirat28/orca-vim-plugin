# Vim Editor for Orca

Orca のエディタタブで、Vim のキーバインドが使えるようになるプラグインです。
[CodeMirror 6](https://codemirror.net/) と [`@replit/codemirror-vim`](https://github.com/replit/codemirror-vim) を同梱しており、ネットワーク接続は不要です。

- ノーマル / 挿入 / ビジュアルモード、オペレータ + モーション、テキストオブジェクト、`.` リピート、レジスタ、マクロ、`/` 検索、`:s` 置換など
- Orca のテーマ（ライト / ダーク）とエディタのフォント設定に追従
- 設定画面で配色テーマや、キーワード・文字列・コメントなどの色を変更可能
- 構文ハイライト: JavaScript / TypeScript / JSON / Markdown / Python / CSS / HTML / YAML / Rust / Go / Perl / XML / SQL / PHP

## インストール

### 前提

- Orca が起動していること。
- プラグインが有効になっていること（設定 → Plugins → 「Turn on plugins」）。
- 非公開リポジトリから入れる場合は、Orca を動かしている PC で Git の認証が通っていること（例: `gh auth setup-git`）。

### 手順

**1. インストールコマンドを実行する**

```sh
orca plugin install akirat28/orca-vim-plugin
```

このプラグインはコードを実行するエディタ（`sandboxed-ui`）のため、Orca は承認なしにはインストールしません。次のような表示が出て、**何もインストールされないまま**止まります（終了コード 3）。これは正常な動作です。

```
akirat28.vim-editor 0.1.0 needs approval before it can run.
Approving Vim Editor (akirat28.vim-editor 0.1.0) grants:
- Shows its own code in sandboxed panels or editors inside Orca; an editor reads every file it opens.
- Read and change the plugin's own settings
Adds: customEditors "Vim", customEditors "Vim", ...
Source: github.com/akirat28/orca-vim-plugin at commit xxxxxxxxxxxx.
Publisher: akirat28.
...
Fingerprint: ap1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Next step: To approve, run: orca plugin install akirat28/orca-vim-plugin --approve ap1-xxxxxxxx...
Next step: Nothing was installed.
```

**2. 表示内容を確認する**

| 項目 | 確認すること |
|---|---|
| Source / Publisher | `github.com/akirat28/orca-vim-plugin`、公開元が `akirat28` であること |
| grants | 付与される権限が「サンドボックス内で動くエディタ。開いたファイルの内容を読む」と「このプラグイン自身の設定の読み書き」のみであること（ネットワーク、ターミナル操作、ファイル書き込みなどの権限は含まれません） |
| Adds | `customEditors "Vim"` が 15 件並ぶこと |
| 警告文 | 「Orca が検証していないリポジトリ」という警告は、公式カタログ以外からの場合に必ず出る定型文です。公開元を信頼できる場合のみ続行してください |

**3. フィンガープリント付きのコマンドで承認する**

`Fingerprint:`（`ap1-` で始まる文字列）は、「このプラグイン・このバージョン・このファイル・この権限」に紐づく承認コードです。表示された値を、そのまま `--approve` に指定して再実行します。

```sh
orca plugin install akirat28/orca-vim-plugin --approve ap1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- フィンガープリントは、**実際に表示された値**を使ってください。この README の `ap1-xxxx…` はダミーです。
- バージョン、ファイル、権限のいずれかが変わると、フィンガープリントも変わります。更新時は、もう一度確認して承認し直す必要があります。
- 表示されていない値を、他の人から聞いたものなどで指定しないでください。

**4. インストールを確認する**

```sh
orca plugin list      # akirat28.vim-editor が表示されれば OK
```

Vim で開くファイルのタブを、一度閉じて開き直すと、Vim エディタで開きます。

### バージョンを固定する場合

```sh
orca plugin install akirat28/orca-vim-plugin@v0.1.0
```

（タグが無い場合は、`main` の最新コミットに固定されます。）同様に承認が必要です。

### 開発版が読み込まれている場合

同じエディタが重複して登録されるのを避けるため、先に開発版を外してください。

```sh
orca plugin dev unload <プラグインのフォルダのパス>
```

### 更新

```sh
orca plugin update
```

新しいバージョンに権限や内容の変更があると、再度の承認（新しいフィンガープリント）を求められます。表示内容を確認して、同じ手順で `--approve` を指定してください。

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

`.js` `.mjs` `.cjs` `.jsx` / `.tsx` `.mts` `.cts` / `.jsonc` `.json5` / `.markdown` `.mdx` / `.py` `.pyi` / `.css` `.scss` `.less` / `.html` `.htm` `.vue` `.svelte` / `.yml` / `.rs` / `.go` / `.pl` `.pm` `.cgi` / `.xml` `.svg` `.plist` / `.sql` / `.txt` `.log` `.conf` `.ini` `.toml` `.sh` `.zsh` `.bash` `.rb` `.java` `.c` `.h` `.cpp` `.hpp` `.swift` `.kt` `.lua` `.vim` `.cfg` `.tsv` `.diff` `.patch` `.php` `.cs` `.dart` `.ex` `.exs` `.zig`

ファイル名: `.env` `.gitignore` `.zshrc` `.bashrc` `.vimrc` `Makefile` `Dockerfile`

（一部は Orca が標準で開く形式のため、実際には切替が必要になる場合があります。）

### 基本の流れ

1. ファイルを Vim で開くと、下部に `--NORMAL--` と表示されます（ノーマルモード）。
2. `i` で挿入モードに入って入力し、`Esc`（または `jj`）でノーマルモードに戻ります。
3. 編集内容は自動で Orca に反映されます。`:w` で即時に反映できます。
4. **ディスクへの保存は Orca の保存（Cmd/Ctrl+S）で行います。**

### 設定（色付け）

Orca の設定 → Plugins → Vim Editor で変更できます。変更は開いているエディタにすぐ反映されます。

| 設定 | 内容 |
|---|---|
| シンタックスハイライト | オフにすると色付けしません |
| 配色テーマ | Orca に合わせる（既定。ダークなら One Dark、ライトなら CodeMirror 標準）/ One Dark / ライト（CodeMirror 標準）/ GitHub 風ライト / GitHub 風ダーク / Solarized 風 |
| 色: キーワード、文字列、コメント、数値、関数名、型・クラス名、プロパティ・属性名、タグ名 | 配色テーマの色を要素ごとに上書きします。`#c678dd` や `rgb(...)`、`orange` など CSS の色で指定します。空欄ならテーマの色のまま、無効な値は無視して通知します |

Vim で開く拡張子は設定では変更できません（Orca がエディタにファイル名を渡さないため）。拡張子を増やす場合は `orca-plugin.json` の `customEditors` を編集します。

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
| `:q` | 変更が無ければ案内を表示、変更があれば `E37` の警告（タブは Orca 側で閉じます） |
| `:q!` | 変更を破棄して、開いたとき（または最後の保存時）の内容に戻します。タブを閉じる API が Orca に無いため、タブは Cmd/Ctrl+W で閉じてください |
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

`editor/vendor/cm.js` は、`vendor-src/cm-entry.ts` を esbuild でバンドルした成果物です（型定義は `editor/vendor/cm.d.ts`。両方を揃えて変更します）。作り直す手順:

```sh
cd vendor-src
npm ci
npm run build    # 型チェック → バンドル → サイズ確認
```

`vendor-src/node_modules` がある間は、`orca plugin inspect .` とフォルダからのインストールが「symlink not allowed」で失敗します（開発版の読み込みと、GitHub からのインストールには影響しません）。必要なら `rm -rf vendor-src/node_modules` で消してください。

`cm.js` は 1 MiB を超えないようにしてください（Orca の変換ファイルサイズ上限）。

## ライセンス

このプラグインは [MIT ライセンス](LICENSE) です。
同梱している CodeMirror 6 と `@replit/codemirror-vim` などは、いずれも MIT ライセンスです。表記は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を参照してください。
