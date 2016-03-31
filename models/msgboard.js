/**
 * Created by Maples7 on 2016/3/18.
 */

var mongoose = require('mongoose');
var Promise = require('bluebird');

var Schema = mongoose.Schema;

mongoose.Promise = Promise;

var commentSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  user_name: String,
  time: {
    type: Date,
    default: new Date()
  },
  content: String
}, {
  autoIndex: false,
  _id: false
});

var messageSchema = new Schema({
  user_name: String,
  content: String,
  time: {
    type: Date,
    default: new Date()
  },
  count_comments: {
    type: Number,
    default: 0
  },
  comments: {
    type: [commentSchema],
    default: []
  }
}, {
  autoIndex: false
});

var Message = mongoose.model('Message', messageSchema);

mongoose = Promise.promisifyAll(mongoose);

module.exports = Message;
