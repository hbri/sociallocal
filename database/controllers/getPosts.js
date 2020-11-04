const User = require('../models/user.js');
const Event = require('../models/event.js');
const Post = require('../models/post.js');
const Group = require('../models/group.js');
require('../index.js');

module.exports.getPosts = async function(eventID) {
  Event.findOne({_id: eventID})
    .populate('posts')
    .then((allposts) => {
      console.log(allposts)
    })
}