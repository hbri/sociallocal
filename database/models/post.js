const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  timestamp: {type: Date, default: Date.now},
  content: String,
  image: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  likes: {type: Number, default: 0},
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'}]
});

const Post = mongoose.model('Post', postSchema);

// const makeID = mongoose.Types.ObjectId;
// const id1 = new makeID;

module.exports = Post;

