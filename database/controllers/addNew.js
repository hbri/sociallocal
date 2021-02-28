const User = require('../models/user.js');
const Event = require('../models/event.js');
const Post = require('../models/post.js');
const Group = require('../models/group.js');
require('../index.js');


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

const getgroup = async (groupID) => {
  try {
    const group = await Group.findOne({_id: groupID})
    return {
      ...group._doc,
      _id: group.id,
      owner: getuser.bind(this, group._doc.owner),
      members: getusers.bind(this, group._doc.members),
      events: getevents.bind(this, group._doc.events)
    }
  } catch (err) {
    throw err
  }
}

const getusers = async (userIDs) => {
  try {
    const user = await User.find({ _id: { $in: userIDs } });
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

exports.newUser = async function(data) {
  let newUserData = await {
    name: data.name,
    location: {
      city: data.location.city,
      state: data.location.state
    },
    photo: data.photo,
    userid: data.userid,
    password: data.password
  };

  let newUserObj = new User(newUserData);
  return newUserObj.save().then(res => {
    return {...res._doc, _id: res.id}
  })
};
// 2020-11-13T13:30:00.
exports.newEvent = async function(data) {
  try {
    const newEventData = {
      title: data.title,
      time: {
        start: data.startTime,
        end: data.endTime
      },
      location: data.location,
      description: data.description,
      tags: [data.tags],
      image: data.image,
      group: data.group,
      host: data.host
    };

    const newEventObj = new Event(newEventData);
    const createdEvent = await newEventObj.save()

    const eventGroup = await Group.findOne({_id: data.group})
    await eventGroup.events.push(createdEvent._id)
    await eventGroup.save()

    return {
      ...createdEvent._doc,
      _id: createdEvent.id,
      host: getuser.bind(this, createdEvent._doc.host),
      group: getgroup.bind(this, createdEvent._doc.group)
    }

  } catch (err) {
    console.error(err)
  }
};

exports.newPost = async function(data, eventID) {
  const newPostData = {
    content: data.content,
    postedBy: data.postedBy
  };
  console.log(newPostData)
  // create & save new post document
  const newPostObj = new Post(newPostData);
  const newPost = await newPostObj.save()
  const postId = newPost._id;
  // push new post _id to the event's posts array
  const curEvent = await Event.findOne({_id: eventID})
  await curEvent.posts.push(postId)
  await curEvent.save()
  // push new post _id to the user's posts array
  const curUser = await User.findOne({_id: data.postedBy})
  await curUser.posts.push(postId)
  await curUser.save()
  return {
    ...newPost._doc,
    _id: newPost.id,
    postedBy: getuser.bind(this, newPost.postedBy)
  }

};

exports.newLike = async function(eventID) {
  const curEvent = await Event.findOne({_id: eventID})
  curEvent.likes = curEvent.likes + 1
  await curEvent.save()
  return curEvent
};

exports.newGroup = async function(groupData) {

  const newGroupModel = new Group(groupData);
  const newGroupObj = await newGroupModel.save()

  const groupOwnerId = newGroupObj._doc.owner
  const groupOwner = await User.findOne({ _id: groupOwnerId })
  await groupOwner.groups.push(newGroupObj._id)
  await groupOwner.save()

  return {
    ...newGroupObj._doc,
    _id: newGroupObj.id,
    members: getusers.bind(this, newGroupObj.members),
    owner: getuser.bind(this, newGroupObj.owner)
  }
};

exports.newAttendance = async function(userID, eventID) {
  const curUser = await User.findOne({_id: userID})
  await curUser.going.push(eventID)
  await curUser.save()

  const curEvent = await Event.findOne({_id: eventID})
  await curEvent.attendees.push(userID)
  await curEvent.save()

  return curUser
};

exports.approveGroupMember = async function(userID, groupID) {
  const group = await Group.findOne({_id: groupID})
  await group.members.push(userID)
  await group.pendingRequests.pull({_id: userID})
  await group.save()

  const member = await User.findOne({_id: userID})
  await member.groups.push(groupID)
  await member.pendingGroups.pull({_id: groupID})
  const updatedMember = await member.save()

  return {
    ...updatedMember._doc,
    _id: updatedMember.id
  }
}

exports.requestGroup = async function(userID, groupID) {
  try {
    const requestingUser = await User.findOne({ _id: userID })
    await requestingUser.pendingGroups.push(groupID)
    await requestingUser.save()

    const requestedGroup = await Group.findOne({ _id: groupID })
    await requestedGroup.pendingRequests.push(userID)
    await requestedGroup.save()

    return true

  } catch (err) {
    console.log(err)
  }
}

