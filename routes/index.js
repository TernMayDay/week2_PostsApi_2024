const HttpControllers = require('../controllers/http') // 引入 http request
const PostsControllers = require('../controllers/posts') // 引入 posts request

const routes = async (req, res) => {
  const { url, method} = req
  console.log(method, url);

  let body = ''
  req.on('data', chunk => body += chunk)

  if( url === '/posts' && method === 'GET'){
      PostsControllers.getPosts(req, res)
  } else if ( url === '/posts' && method === 'POST') {
    req.on('end', async () => {
      PostsControllers.createdPosts( { body, req, res } ) // { 解構 } 不用擔心讀取順序
    })
  } else if ( url === '/posts' && method === 'DELETE') {
      // 刪除全部貼文
      PostsControllers.deleteAllPosts(req, res)
  } else if ( url.startsWith('/posts/') && method === 'DELETE') {
    // 刪除一則貼文
    PostsControllers.deletePosts(req, res)
  } else if ( url.startsWith('/posts/') && method === 'PATCH') {
    // 編輯修改一則貼文
    req.on('end' , async () => {
      PostsControllers.editPosts( { body, req, res } ) // { 解構 } 不用擔心讀取順序
    })
  } else if ( method === 'OPTIONS') {
    HttpControllers.cors(res)
  } else {
    HttpControllers.notFound(res)
  }
}

module.exports = routes