const moongoose = require('../db')

const ArticleModel = require('../models/article')


var ClassifySchema = new moongoose.Schema({
    name: { type: String, unique: true, required: true },
    articles: [
        {
            type: moongoose.Schema.Types.ObjectId,
            ref: 'article'
        }
    ]
})


ClassifySchema.statics.findByname = name => {
    return new Promise((resolve, reject) => {
        this.find({ name: name }, function (err, doc) {
            if (err) reject(err)
            resolve(doc)
        })
    })
}


ClassifySchema.statics.saveByName = function (name) {
    let that = this
    return new Promise(function (resolve, reject) {
        that.count({}, function (err, count) {
            console.log(count)
            if (count > 10) {
                reject('count')
            } else {
                that.create({ name: name, articles: [] }, function (err, doc) {
                    if (err) reject(err)
                    resolve(doc)
                })
            }
        })
    })
}

ClassifySchema.statics.findAll = function () {

    let that = this
    return new Promise(function (resolve, reject) {
        that.find({ name: { '$ne': '回收站' } }).populate({ path: 'articles' }).exec().then(function (data) {
            console.log(data)
            resolve(data)
        }).catch(function (err) {
            reject(err)
        })
    })
}




ClassifySchema.statics.changeName = function (name, newName) {
    let that = this
    return new Promise(function (resolve, reject) {
        that.findOneAndUpdate({ name: name }, { name: newName }, function (err, doc) {
            if (err) reject(err)
            resolve(doc)
        })
    })
}

ClassifySchema.statics.removeByName = function (name) {
    let that = this
    return new Promise(function (resolve, reject) {
        that.count({}, function (err, count) {
            if (count == 1) {
                reject('count')
            } else {
                that.findOneAndRemove({ name: name }, function (err, data) {
                    if (err) reject(err)
                    resolve(data)
                })
            }
        })
    })
}

ClassifySchema.statics.deleteById = function (id) {
    let that = this;
    return new Promise(function (resolve, reject) {
        that.findByIdAndRemove(id, function (err, doc) {
            if (err) reject(err)
            if (doc & doc.articles.length > 0) {
                that.find({}).exec().then(function (classifies) {
                    for (let index = 0; index < doc.articles.length; index++) {
                        const element = doc.articles[index];
                        ArticleModel.findByIdAndUpdate(element, { classify:classifies[0]._id})
                    }
                    resolve(classifies[0])
                })
            }else{
                resolve()
            }
        })
    })
}




var ClassifyModel = moongoose.model('Classify', ClassifySchema)


module.exports = ClassifyModel