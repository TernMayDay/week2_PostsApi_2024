const successHandle = require('../service/successHandle')
const errorHandle = require('../service/errorHandle')
const Posts = require('../model/posts')

const posts = {
  async getPosts (req, res) {
    const postData = await Posts.find()
    successHandle(res, postData)
  },
  async createdPosts( { req, res, body } ) {
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
  },
  async deleteAllPosts(req, res) {
     // 刪除全部貼文
     const newPosts = await Posts.deleteMany({})
     successHandle(res, newPosts)
  },
  async deletePosts(req, res) {
    // 刪除一則貼文
    try {
      const id = req.url.split('/').pop()
      await Posts.findByIdAndDelete(id) // 刪除
      const postData = await Posts.find()
      successHandle(res, postData)
    } catch (error) {
      errorHandle(res)
    }
  },
  async editPosts( { req, res, body } ) {
    // 編輯修改一則貼文
    try {
      const id = req.url.split('/').pop()
      const updateData = JSON.parse(body)
      await Posts.findByIdAndUpdate(id, updateData)
      const postData = await Posts.find()
      successHandle(res, postData)
    } catch (error) {
      errorHandle(res)
    }
  }
}

module.exports = posts