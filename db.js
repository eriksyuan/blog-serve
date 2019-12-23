const mongoose = require('mongoose');

const DB_Url = 'mongodb://localhost:27017/blog';

mongoose.connect(DB_Url, { useFindAndModify: false })

mongoose.connection.on('connected', function () {
    console.log('mongoose connection open to ' + DB_Url);
})

mongoose.connection.on('error', function (err) {
    console.log('mongoose connection error' + err);
})

mongoose.connection.on('disconnected', function () {
    console.log('mongoose connection disconnected');
})

module.exports = mongoose;