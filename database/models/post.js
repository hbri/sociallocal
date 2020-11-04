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
  likes: [],
  comments: [
    {
      message: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {type: Date, default: Date.now},
      likes: Number
    }
  ]

});

const Post = mongoose.model('Post', postSchema);

// const makeID = mongoose.Types.ObjectId;
// const id1 = new makeID;

module.exports = Post;

