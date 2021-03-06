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
    console.log
    return {
      ...user._doc,
      _id: user.id,
      events: getevents.bind(this, user.events),
      posts: getposts.bind(this, user.posts)
    };
  } catch (err) {
    throw err;
  }
}
const getusers = async (userIDs) => {
  try {
    const users = await User.find({ _id: { $in: userIDs } });
    return users.map(user => {
      return {
        ...user._doc,
        _id: user.id,
        events: getevents.bind(this, user.events),
        posts: getposts.bind(this, user.posts),
        groups: getgroups.bind(this, user.groups)
      };
    })
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

const getgroup = async (groupID) => {
  const group = await Group.findOne({_id: groupID})
  return {
    ...group._doc,
    _id: group.id,
    members: getusers.bind(this, group.members),
    events: getevents.bind(this, group.events),
    owner: getuser.bind(this, group.owner)
  }
}

const getgroups = async (groupIDs) => {
  const groups = await Group.find({_id: { $in: groupIDs }})
  return groups.map(group => {
    return {
      ...group._doc,
      _id: group.id,
      members: getusers.bind(this, group.members),
      events: getevents.bind(this, group.events),
      owner: getuser.bind(this, group.owner)
    }
  })
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

module.exports.getGroup = async function(groupID) {
  const group = await Group.findOne({_id: groupID})
  // console.log(group._doc)
  return {
    ...group._doc,
    _id: group.id,
    members: getusers.bind(this, group.members),
    events: getevents.bind(this, group.events),
    owner: getuser.bind(this, group.owner),
    pendingRequests: getusers.bind(this, group.pendingRequests)
  }
}

module.exports.getEvent = async function(eventID) {
  const curEvent = await Event.findOne({_id: eventID})
  return {
    ...curEvent._doc,
    _id: curEvent.id,
    host: getuser.bind(this, curEvent.host),
    posts: getposts.bind(this, curEvent.posts),
    group: getgroup.bind(this, curEvent.group),
    pendingRequests: getusers.bind(this, curEvent.pendingRequests),
    attendees: getusers.bind(this, curEvent.attendees),
    interested: getusers.bind(this, curEvent.interested)
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

module.exports.getAllGroups = async function() {
  const allGroups = await Group.find()
  return allGroups.map((group) => {
    return {
      ...group._doc,
      _id: group.id,
      members: getusers.bind(this, group.members),
      events: getevents.bind(this, group.events),
      owner: getuser.bind(this, group.owner)
    }
  })
}

module.exports.getUser = async function(userID) {
  try {
    const user = await User.findOne({ _id: userID });
    console.log(user.id)
    return {
      ...user._doc,
      _id: user.id,
      events: getevents.bind(this, user.events),
      posts: getposts.bind(this, user.posts),
      going: getevents.bind(this, user.going),
      groups: getgroups.bind(this, user.groups),
      pendingEvents: getevents.bind(this, user.pendingEvents),
      pendingGroups: getgroups.bind(this, user.pendingGroups)
    };
  } catch (err) {
    throw err;
  }
}

module.exports.addEventToUser = async function (userID, eventID) {
  const curUser = await User.findOne({_id: userID})
  await curUser.events.push(eventID)
  await curUser.save()
  return curUser
}