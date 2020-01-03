const mongoose = require('mongoose')
const moment = require('moment')

const Classify = require('./classify')

const articleSchme = new mongoose.Schema({
    // 文章标题
    title: {
        type: String,
        required: true
    },
    // 分类
    classify: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classify'
    },
    // 文章内容数据
    content: {
        type: String,
        default: '# 标题'
    },
    // 主图
    image: {
        type: String,
        default: ''
    },
    // 创建时间
    createTime: {
        type: Date,
        default: Date.now
    },
    // 点赞数量
    likeNum: {
        type: Number,
        default: 0
    },
    // 阅读次数
    readNum: {
        type: Number,
        default: 0
    },
    //最后编辑时间
    lastEditTime: {
        type: Date,
        default: Date.now
    },
    //是否发布
    issue: {
        type: Number,
        default: 1
    },
    //发布时间
    issueTime: {
        type: String,
        default: Date.now
    },
    //隐式删除
    delete: {
        type: Number,
        default: 1
    },
    comment: [
        { type: mongoose.Schema.Types.ObjectId }
    ],
    description: {
        type: String
    }
})

//新建文章
articleSchme.statics.creatNewArticle = function (id, classify, title = '新建文章', content = '# 标题', issue = 1, image = '', description = '') {
    let that = this
    return new Promise(function (resolve, reject) {
        if (id.length > 0) {
            that.findByIdAndUpdate(id, { $set: { classify, title, content, issue, image, description } }, { new: true }, function (err, doc) {
                if (err) reject(err)
                resolve(doc)
            })
        } else {
            that.create({ classify, title, content, issue, image, description }, function (err, data) {
                if (err) reject(err)
                Classify.findByIdAndUpdate(classify, { $push: { articles: data._id } }, function (e) {
                    if (e) reject(e)
                    resolve(data)
                })
            })
        }
    })
}

//删除
articleSchme.statics.removeById = function (id) {
    let that = this
    return new Promise(function (resolve, reject) {
        that.findByIdAndRemove(id, function (err, doc) {
            if (err) reject(err)
            if (doc && doc.classify) {
                Classify.findByIdAndUpdate(doc.classify, { $pull: { articles: id } }, function (err, o) {
                    if (err) reject(err)
                    resolve(o)
                })
            } else {
                reject()
            }
        })
    })
}


//更改 编辑文章
articleSchme.statics.changeArticle = function (id, obj) {
    let setObj = {}
    let time = Date.now()
    for (let key in obj) {
        if (obj[key] || obj[key] === 0) {
            setObj[key] = obj[key]
        }
    }
    setObj.lastEditTime = time
    let that = this

    if (Object.keys(setObj).includes('issue') & setObj.issue === 0) {
        setObj.issueTime = time
    }
    console.log(setObj)
    if (Object.keys(setObj).includes('classify')) {
        return new Promise(function (resolve, reject) {
            that.findById(id).exec().then(res => {
                Classify.findByIdAndUpdate(res.classify, { $pull: { articles: id } }).exec().then(old => {
                    Classify.findByIdAndUpdate(setObj.classify, { $push: { articles: id } }).exec().then(newa => {
                        that.findByIdAndUpdate(id, { $set: setObj }, { new: true }, function (err, article) {
                            if (err) reject(err)
                            resolve(article)
                        })
                    })
                })
            })
        })
    }
    return that.findByIdAndUpdate(id, { $set: setObj }, { new: true }).exec()
}

//获取所有文章列表
articleSchme.statics.getAll = function () {
    return this.find({ delete: { $gt: 0 } }, '-delete').populate({ path: 'classify', select: 'name' }).exec()
}


articleSchme.statics.fifterArticle = function (keyword, obj, skip, sort) {
    let setObj = {}
    let s = sort
    let p = skip
    let that = this
    for (let key in obj) {
        if (obj[key] || obj[key] === 0) {
            setObj[key] = obj[key]
        }
    }
    Object.assign(setObj, {
        delete: { $gt: 0 }
    })
    if (keyword) {
        setObj.$or = [
            { title: { $regex: keyword } }
        ]
    }
    if (sort === {}) {
        s = { lastEditTime: 1 }
    }
    if (skip === {}) {
        p = {
            page: 0,
            num: 0
        }
    }
    return new Promise(function (resolve, reject) {
        that.count(setObj, function (err, count) {
            if (err) reject(err)
            that.find(setObj).sort(s).skip(p.page * p.num).limit(p.num).exec(function (err, data) {
                if (err) reject(err)
                resolve([count, data])
            })
        })
    })
}
articleSchme.statics.getAllArticlesOfIssue = function () {
    return this.find({ issue: 0 }, '-issue -delete -issueTime').sort({createTime:-1}).populate('classify').exec()
}

articleSchme.statics.getDetail = function (id) {
    let that = this
    return new Promise(function (resolve, reject) {
        that.findOneAndUpdate({ issue: 0, _id: id }, {
            $inc: { readNum: 1 }
        }, function (err, doc) {
            if (err) reject(err)
            if (doc && doc._id) {
                that.find({ issue: 0 }, '-issue -delete -issueTime').sort({ createTime: -1 }).exec(function (er, arr) {
                    let i
                    var data = {}
                    arr.forEach((item, index) => {
                        if (item.id === id) {
                            i = index
                            return
                        }
                    })
                    data.detail = arr[i]
                    if (arr.length === 1) {
                        data.next = {}
                        data.last = {}
                    } else if (arr.length === i + 1) {
                        data.last = arr[i - 1]
                        data.next = {}
                    } else {
                        data.next = arr[i + 1]
                        data.last = arr[i - 1]
                    }
                    resolve(data)
                })
            } else {
                reject(Error('err'))
            }
        })
    })

}

articleSchme.statics.adminGetDetail = function (id) {
    let that = this
    return new Promise(function (resolve, reject) {
        that.findById(id, function (err, doc) {
            if (err) reject(err)
            resolve(doc)
        })
    }
    )
}


const articleModel = mongoose.model('article', articleSchme)


module.exports = articleModel