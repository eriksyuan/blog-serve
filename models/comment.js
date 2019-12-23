const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article'
  },
  content: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    default: Date.now
  },
})

commentSchema.statics.newComment = function (article, content, from) {
  return this.create({ article, content, from }).exec()
}



const CommentModel = mongoose.model('comment', CommentSchema)

module.exports = CommentModel

