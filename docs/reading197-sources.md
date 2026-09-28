# 読みやすい日本語（197）

会話・会話の選択肢・道具一覧・道具の説明に適用する表示専用レイヤー。
小学1～5年配当の漢字は上にひらがな、小学6年配当以降は単語の読みをひらがなで表示する。難しい用語は `simpleWords197.mjs`、道具の表示名は `itemNames197.mjs` で管理する。「採掘セット」は「たんけんセット」と表示する。道具の保存キー・価格・効果・選択結果は変更しない。英語表示は従来の翻訳を使用する。

Canvas上のふりがなを含めて幅を測り、会話の折り返し・ページ送り・文字送りに反映する。表示パーツをキャッシュし、ブラウザーには形態素解析器や大型辞書を読み込まない。

## 配当表

文部科学省「小学校学習指導要領（平成29年告示）」の学年別漢字配当表（2020年度以降、1026字）に基づく。1～5年は835字。
- https://www.mext.go.jp/content/20220606-mxt_kyoiku02-100002607_002.pdf
- 機械可読転記: https://jp-cos.github.io/821/0000100000000

## 読み辞書と再生成

kuromoji.js 0.1.2 / IPADICを開発時にだけ使用。既存ソースと公開マップの文字列から読み候補を作り、`tools/readingOverrides197.json` の手動指定を優先する。IPADICの権利表示・免責は `docs/licenses/ipadic-reading197.txt` に保持する。
- https://github.com/takuyaa/kuromoji.js

`npm install --prefix artifacts/reading197/runtime kuromoji@0.1.2 acorn@8.15.0 --ignore-scripts --no-audit --no-fund`

公開マップAPIのJSONを `artifacts/reading197/published.json` に保存した上で `node tools/buildReading197.cjs`。配当表は `tools/fixtures/grades197.json` を使う。追加の独自会話・固有名詞は生成時に読みを点検し、必要なら手動辞書へ追加する。名前の読みを推測してセーブデータを書き換えることはしない。

## 検証

`node tools/verifyReading197.cjs` は実ゲームのモジュールをテストブラウザーに読み込み、全道具の名前・説明の漢字配当とふりがな、道具名の重複、折り返し幅、会話ページ送り、選択結果の保存キー保持を検証する。公開版は `BASE_URL` に本番URLを設定して同じ検証を行う。
