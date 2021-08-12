const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  commentText: {
    type: String,
  },
  commentCreator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);
