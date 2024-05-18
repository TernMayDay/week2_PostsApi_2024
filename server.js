const http = require('http')
const mongoose = require('mongoose');
const headers = require('./headers')
const successHandle = require('./successHandle')
const errorHandle = require('./errorHandle')
const Posts = require('./model/posts');

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


// crud
const requestListener = async(req, res) => {

  let body = ''
  req.on('data', chunk => body += chunk)

  if( req.url === '/posts' && req.method === 'GET'){
    const postData = await Posts.find()
    successHandle(res, postData)
  } else if ( req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const newPosts = await Posts.create(
          {
            name: data.name,
            tags: data.tags,
            type: data.type,
            image: data.image,
            content: data.content
          }
        )
        successHandle(res, newPosts)
      } catch (error) {
        errorHandle(res)
      } 
    })
  } else if ( req.url === '/posts' && req.method === 'DELETE') {
    // 刪除全部貼文
    const newPosts = await Posts.deleteMany({})
    successHandle(res, newPosts)
  } else if ( req.url.startsWith('/posts/') && req.method === 'DELETE') {
    // 刪除一則貼文
    try {
      const id = req.url.split('/').pop()
      await Posts.findByIdAndDelete(id) // 刪除
      const postData = await Posts.find()
      successHandle(res, postData)
    } catch (error) {
      errorHandle(res)
    }
  } else if ( req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end' , async () => {
      try {
        const id = req.url.split('/').pop()
        const updateData = JSON.parse(body)
        await Posts.findByIdAndUpdate(id, updateData)
        const postData = await Posts.find()
        successHandle(res, postData)
      } catch (error) {
        errorHandle(res)
      }
    })
  } else if ( req.method === 'OPTIONS') {
    res.writeHead(200, headers)
    res.end()
  } else {
    res.writeHead(404, headers)
    res.write(JSON.stringify({
      status: 'false',
      message: '無此路由'
    }))
    res.end()
  }

}

const server = http.createServer(requestListener)
server.listen(process.env.PORT)