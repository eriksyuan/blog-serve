const fs = require('fs')

let path = __dirname + '/public/images/1576135196033.jpg'
fs.unlink(path, function (err) {
  if (err) {  
    return console.log(err)
  }
  console.log('done')
})