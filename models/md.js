import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const mdSchema = new Schema({
  fileName: String,
  saveAt: String,
  category: {type: String, default: ''},
  tags: [{
    tagName: {type: String, default: ''}
  }],
  createdAt: Date,
  comment: [{
    username: {type: String, default: ''},
    content: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now},
    email: {type: String, default: ''},
    reply: [{
      username: {type: String, default: ''},
      content: {type: String, default: ''},
      toWho: {type: String, default: ''},
    }]
  }]
})
const md = mongoose.model('md', mdSchema);

export default md;