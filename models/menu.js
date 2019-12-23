const mongoose = require('mongoose')


const menuSchema = new mongoose.Schema({
  rank:{
    type:Number
  },
  name:{
    type:String,
    require:true
  },
  //菜单类型 0：主菜单；1：子菜单
  menuType:{
    type:Number,
    default:0
  },
  //上级菜单id
  supMenu:{
    type:mongoose.Schema.Types.ObjectId
  },
  //是否显示；1：隐藏；2：显示
  show:{
    type:Number,
    default:0
  }
})