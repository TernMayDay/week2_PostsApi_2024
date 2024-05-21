# Node.js NPM 整合 MongoDB

## 仿照 express 進行拆分

### [從 server.js 進行拆分](https://github.com/TernMayDay/week2_PostsApi_2024/tree/imitate-express)

1. connections / index.js：連接資料庫
2. bin / www：開啟 wrb server
    * 將 requestListener 與 server.js 改名為 app
    * package.json 更改正確的注入點 `"start": "node bin/www"`
3. routes / index.js：設置 routes
    * 將 app.js 裡面的 crud 內容，拆到 routes / index.js
    * 新增 service 資料夾，將 headers、successHandle、errorHandle 放進去。

### 從 routes / index.js 拆分

1. controllers / http.js：設置 http request
2. controllers / posts.js：設置 posts request

* [API 路徑](https://week2-postsapi-2024-imitate-express.onrender.com/)
指令：`npm start`

## [設計一個/ posts 路由](https://github.com/TernMayDay/week2_PostsApi_2024)

* Mongoose 連接遠端資料庫
* dotenv 加上環境變數，讓程式更安全
* 部署到 Render 主機
* 提供 Postman API
* [API 路徑](https://week2-postsapi-2024.onrender.com/)

版本號：node 20.10.0
指令：`nodemon server.js`