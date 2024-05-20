const routes = require('./routes')

// 連接資料庫
require('./connections')

// crud
const app = async(req, res) => {
  routes(req, res)
}

module.exports = app