const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  userid: Number,
  location: {
    city: String,
    state: String
  },
  photo: String,
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  interested: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  going: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]

});

const User = mongoose.model('User', userSchema);

module.exports = User;