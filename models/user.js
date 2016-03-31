/**
 * Created by Maples7 on 2016/3/18.
 */

var mongoose = require('mongoose');
var Promise = require('bluebird');

var Schema = mongoose.Schema;

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MsgBoard');

var userSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  head_pic: {
    type: String,
    unique: true
  }
});

var User = mongoose.model('User', userSchema);

mongoose = Promise.promisifyAll(mongoose);

module.exports = User;
