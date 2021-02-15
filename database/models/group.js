const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: String,
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pendingRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  logo: String

})

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;