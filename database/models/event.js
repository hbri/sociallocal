const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  date: {type: Date, default: Date.now},
  time: {
    start: Date,
    end: Date
  },
  location: String,
  description: String,
  tags: [{type: String}],
  image: String,
  interested: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  likes: {
    type: Number,
    default: 0
  }

})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;