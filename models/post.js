const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  postText: {
    type: String,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  postCreator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }

}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema);
