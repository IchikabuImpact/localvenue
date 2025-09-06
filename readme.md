# 地方競馬(サラ系）の予想プログラムです。
# src
git clone https://github.com/kenchanbaken/localvenue.git
# node.js v18.16.0
npm install
# config.jsを手動で作成します。
```
module.exports = {
  mysql: {
    user: 'youruser',
    password: 'yourepass'
  }
}
```
# MySQL
```
CREATE DATABASE localkeiba CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
grant ALL on *.* to YOURE_USER_NAME@localhost IDENTIFIED BY "YOURE_PASS";
```
# tableを作成します。
localkeiba.sql
# 1.今月の開催情報をDBに登録します。
node kaisai-info.js
# 2.開催情報をAPIとして起動します。
node api-todays-venue.js &
# 3.本日開催されるレース情報をDBに登録します。
save-race-count-by-date.js yyyymmdd

# step実行するには
.vscode/launch.jsonを作成します
`````````
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "現在のファイルをデバッグ実行",
      "type": "node",
      "request": "launch",
      "program": "${file}",
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "kaisai-info.js (引数あり)",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/kaisai-info.js",
      "args": ["2025", "09"],         // ← process.argv[2], [3] に入ります
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "stopOnEntry": true,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "npm script をデバッグ（例: dev）",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    },
    {
      "name": "実行中の Node にアタッチ",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "restart": true
    }
  ]
}
```

