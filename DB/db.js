import mongoose from 'mongoose';
var mongo = require('./setting');


mongoose.connect(mongo.url, {useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'conection error:'));

db.once('open', function () {
  console.log('数据库连接成功');
  
})