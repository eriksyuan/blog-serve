const mongoose = require('mongoose')


const adminSchema = new mongoose.Schema({
  name:String,
  username:String,
  password:{
    type:String,
    required:true
  },
  avator:{
    type:String,
    default:"https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png"
  },
  status:Number,
  telephone:String,
  lastLoginTime:{
    type:Number,
    default:Date.now
  },
  lastLoginIp:{
    type:String
  },
  deleted:{
    type:Number,
    default:0
  },
  roleId:{
    type:String,
    default:'admin'
  },
  lang:{
    type:String,
    default:'zh-CN'
  },
  token:{
    type:String
  }
})


var AdminModel = moongoose.model('admin', adminSchema)

module.exports = AdminModel