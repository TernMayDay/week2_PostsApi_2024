const mongoose = require('mongoose');
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
  },
  async editPosts( { req, res, body } ) {
    // 編輯修改一則貼文
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
  }
}

module.exports = posts