const fs = require('fs')

const removeFile = async function (ctx, next) {
  let { filename } = ctx.request.body
  let arr = __dirname.split('\\')
  arr.pop()
  let path = arr.join('/')+ '/public/images/' + filename
  fs.unlinkSync(path)
  ctx.body = {
    status: 0,
    message: '删除成功',
    data: null
  }
}


module.exports = [
  { 'method': 'delete', 'path': '/admin/removefile', 'fn': removeFile }
]