const User = require('../models/user.js');
const Event = require('../models/event.js');
const Post = require('../models/post.js');
const Group = require('../models/group.js');
require('../index.js');

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
    let newEventData = {
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

    let newEventObj = new Event(newEventData);
    return newEventObj.save().then(result => {
      return {...result._doc, id: result.id}
    })
  } catch (err) {
    console.error(err)
  }
};

exports.newPost = async function(data, eventID) {
  const newPostData = {
    content: data.content,
    postedBy: data.postedBy
  };
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
  return newPost._doc
};

exports.newLike = async function(eventID) {
  const curEvent = await Event.findOne({_id: eventID})
  curEvent.likes = curEvent.likes + 1
  await curEvent.save()
  return curEvent
};

exports.newGroup = async function(req, res) {
  let newGroupData = await {
    name: req.body.string,
    location: req.body.location
  }
  let newGroupObj = new Group(newGroupData);
  await newGroupObj.save((err, newGroupObj) => {
    if (err) {
      console.error(err)
    }
  })
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