const headers = require('./headers')
module.exports =  (res) => {
  res.writeHead(400, headers)
  res.write(JSON.stringify({
    status: false,
    message: '欄位不正確或無此id',
    error: error
  }))
  res.end()
}