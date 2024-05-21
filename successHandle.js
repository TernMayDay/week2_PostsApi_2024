const headers = require('./headers')
module.exports = (res, posts) => {
  res.writeHead(200, headers)
  res.write(JSON.stringify({
    status: 'success',
    posts
  }))
  res.end()
}