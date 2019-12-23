const mongoose = require('mongoose')

const replaySchema = new mongoose.Schema({
  //回复的主评论
  comment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'commnet'
  },
  //回复类型（‘comment’回复评论，‘reply’回复回复）
  replyType:{
    type:'String',
    default:'comment'
  },
  //谁回复
  from:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  //回复谁
  to:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  //回复内容
  content:{
    type:String,
    require:true
  },
  //回复类型是comment,为评论id,回复类型是reply,为回复id
  replyTo:{
    type:mongoose.Schema.Types.ObjectId
  },
  dateTime:{
    type:Date,
    default:Date.now
  }
})


const ReplyModel = mongoose.model('reply',replaySchema)

module.exports = ReplyModel