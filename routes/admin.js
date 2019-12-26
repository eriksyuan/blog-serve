const token = require('../models/token')



async function login(ctx, next) {
  let { username, password } = ctx.request.body

  if (username == 'admin' & password == '8914de686ab28dc22f30d3d8e107ff6c') {
    ctx.body = {
      code: 200,
      message: '',
      result: {
        'token': token
      }
    }
  } else {
    ctx.body = {
      code: 400
    }
  }
}


const getInfo = async function (ctx, next) {
  ctx.body = {
    code: 200,
    message: '',
    result: {
      'id': 234335354,
      'name': '你好',
      'username': 'admin',
      'password': '',
      'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
      'status': 1,
      'telephone': '',
      'lastLoginIp': '27.154.74.117',
      'lastLoginTime': 1534837621348,
      'creatorId': 'admin',
      'createTime': 1497160610259,
      'deleted': 0,
      'roleId': 'admin',
      'lang': 'zh-CN',
    }
  }
}



module.exports = [
  { 'method': 'post', 'path': '/admin/login', 'fn': login },
  { 'method': 'get', 'path': '/admin/info', 'fn': getInfo },
]