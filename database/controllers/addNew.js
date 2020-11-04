const User = require('../models/user.js');
const Event = require('../models/event.js');
const Post = require('../models/post.js');
const Group = require('../models/group.js');
require('../index.js');

exports.newUser = async function(data) {
  let newUserData = await {
    name: data.name,
    location: {
      city: data.city,
      state: data.state
    },
    photo: data.photo,
  };

  let newUserObj = new User(newUserData);
  await newUserObj.save()
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
    await newEventObj.save()
  } catch (err) {
    console.error(err)
  }
};

exports.newPost = async function(data, eventID) {
  const newPostData = {
    content: data.content,
    postedBy: '5fa1d33ed51893be5f4fc736'
  };
  // create & save new post document
  const newPostObj = new Post(newPostData);
  const newPost = await newPostObj.save()
  const postId = newPost._id;
  // push new post _id to the event's posts array
  const curEvent = await Event.findOne({_id: eventID})
  await curEvent.posts.push(postId)
  await curEvent.save()
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
}