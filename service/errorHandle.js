const headers = require('./headers')
module.exports = ({ res, error }) => {
  let errorMessages = error.message
  if(error.errors) {
    errorMessages = Object.values(error.errors).map(error => error.message);
  }
  res.writeHead(400, headers)
  res.write(JSON.stringify({
    status: false,
    message: errorMessages || error.message,
  }))
  res.end()
}