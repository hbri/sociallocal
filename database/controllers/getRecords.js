const User = require('../models/user.js');
const Event = require('../models/event.js');
const Post = require('../models/post.js');
const Group = require('../models/group.js');
require('../index.js');

// fetch a user by its _id to be used instead of the populate method when fetching Events
// graphQL, if it has a function instead of returning it like if it had a string or avalue it will call it and return the return value
const getuser = async (userID) => {
  try {
    const user = await User.findOne({ _id: userID });
    return {
      ...user._doc,
      _id: user.id,
      events: getevents.bind(this, user._doc.events),
      posts: getposts.bind(this, user._doc.posts)
    };
  } catch (err) {
    throw err;
  }
}
// fetch events by id from user events array
const getevents = async (eventIDs) => {
  try {
    const events = await Event.find({ _id: { $in: eventIDs } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        host: getuser.bind(this, event.host),
        posts: getposts.bind(this, event.posts)
      };
    });
  } catch (err) {
    throw err;
  }
}

const getposts = async (postIDs) => {
  const posts = await Post.find({ _id: { $in: postIDs } });
  return posts.map(post => {
    return {
      ...post._doc,
      _id: post.id,
      postedBy: getuser.bind(this, post.postedBy)
    };
  });
}

module.exports.getPosts = async function(eventID) {
  const allPosts = await Event.findOne({_id: eventID}).populate({
    path: 'posts',
    populate: {
      path: 'postedBy'
    }
  })
  return allPosts;
}

module.exports.getEvent = async function(eventID) {
  const curEvent = await Event.findOne({_id: eventID})
  return {
    ...curEvent._doc,
    _id: curEvent.id,
    hosts: getuser.bind(this, curEvent._doc.host),
    posts: getposts.bind(this, curEvent._doc.posts)
  }

  // return Event.findOne({_id:eventID})
  //   .then(event => {
  //       return {
  //         ...event._doc,
  //         _id: event.id,
  //         host: getuser.bind(this, event._doc.host),
  //         posts: getposts.bind(this, event._doc.posts)
  //       }
  //   })
}

module.exports.getUser = async function(userID) {
  const curUser = await User.findOne({userid: userID})
  return curUser
}

module.exports.addEventToUser = async function (userID, eventID) {
  const curUser = await User.findOne({_id: userID})
  await curUser.events.push(eventID)
  await curUser.save()
  return curUser
}