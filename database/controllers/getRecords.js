const User = require('../models/user.js');
const Event = require('../models/event.js');
const Post = require('../models/post.js');
const Group = require('../models/group.js');
require('../index.js');

module.exports.getPosts = async function(eventID) {
  const allPosts = await Event.findOne({_id: eventID}).populate('posts')
  return allPosts;
}

module.exports.getEvent = async function(eventID) {
  const curEvent = await Event.findOne({_id: eventID})
  return curEvent;
}