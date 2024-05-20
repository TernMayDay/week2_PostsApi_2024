const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env"})

// 連接資料庫
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
    .then(() => { console.log('資料庫連線成功')})
    .catch((error) => {console.log('reason =>',error.reason)});