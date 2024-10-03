# ジョブカン出退勤API

Google Cloud Functionsにデプロイすることで
ジョブカンの出退勤が行えます

各企業によって出退勤画面が変わると思うので
出退勤処理内は各々で書く想定でコミットしています。

# 引数
・ジョブカンID
・パスワード
・出退勤パラメータ
　punch_in : 出勤
  punch-out : 退勤

Google Cloud Functions詳細
https://cloud.google.com/functions/docs/concepts/overview?hl=ja

# デプロイ
```bash
gcloud functions deploy scrapeUrl \
--runtime nodejs16 \
--trigger-http \
--allow-unauthenticated \
--memory 512MB
```
