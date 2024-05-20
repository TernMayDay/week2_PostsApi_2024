const headers = require('../service/headers')

const http = {
  cors(res) {
    res.writeHead(200, headers)
    res.end()
  },
  notFound(res){
    res.writeHead(404, headers)
    res.write(JSON.stringify({
      status: 'false',
      message: '無此路由'
    }))
    res.end()
  }
}

module.exports = http