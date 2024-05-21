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
        const { name, tags, type, image, content } = data
        
        if(!content?.trim()) throw new Error('貼文內容不能空白ㄛ~');
        
        const newPosts = await Posts.create(
          {
            name,
            tags,
            type,
            image,
            content: content.trim()
          }
        )
        successHandle(res, newPosts)
        
      } catch (error) {
        errorHandle({ res, error })
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

      // 檢查 id 是否是有效的 ObjectId
      if (!mongoose.Types.ObjectId.isValid(id))  throw new Error(`無效的貼文 ID : ${id}`);

      // 貼文 是否存在
      const post = await Posts.findById(id);
      if (!post) throw new Error(`此貼文不存在：${id}`);

      await Posts.findByIdAndDelete(id) // 刪除
      const postData = await Posts.find()
      successHandle(res, postData)
      
    } catch (error) {
      errorHandle({ res, error })
    }
  } else if ( req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end' , async () => {
      try {
        const id = req.url.split('/').pop()

        // 檢查 id 是否是有效的 ObjectId
        if (!mongoose.Types.ObjectId.isValid(id))  throw new Error(`無效的貼文 ID : ${id}`);

        // 貼文 是否存在
        const post = await Posts.findById(id);
        if (!post) throw new Error(`此貼文不存在：${id}`);
        
        const data = JSON.parse(body)
        const { name, tags, type, image, content } = data
        if( !content?.trim()) throw new Error('貼文內容不能空白ㄛ~');
        
        const updateData = {
          name,
          tags,
          type,
          image,
          content: content.trim()
        }

        // Patch 更新貼文成功時，可以在第三個變數帶入 { new: true } 就能取得最新的更新後的資訊。
        const updatedPost = await Posts.findByIdAndUpdate(id, updateData, { new: true });
        successHandle(res, updatedPost)      
        
      } catch (error) {
        errorHandle({ res, error })
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