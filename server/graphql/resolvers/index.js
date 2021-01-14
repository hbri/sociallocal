const create = require('../../../database/controllers/addNew.js');
const fetchData = require('../../../database/controllers/getRecords.js');
const bcrypt = require('bcryptjs');
const User = require('../../../database/models/user.js');
const Event = require('../../../database/models/event.js');
const Post = require('../../../database/models/post.js');
const Group = require('../../../database/models/group.js');
require('../../../database/index.js');
const jwt = require('jsonwebtoken');

module.exports.resolvers = {
  events: (args) => {
    const eventID = args.eventID
    return fetchData.getEvent(eventID)
  },
  posts: async (args) => {
    const eventID = args.eventID;
    const fetchedPosts = await fetchData.getPosts(eventID)
    return fetchedPosts.posts
  },
  user: async (args) => {
    const userID = args.userID
    const userData = await fetchData.getUser(userID)
    return userData
  },
  group: async (args) => {
    const groupID = args.groupID
    const groupData = await fetchData.getGroup(groupID)
    return groupData
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authorized')
    }
    const dbUserID = req.authUserID;

    const mongoFormat = {
      title: args.eventInput.title,
      startTime: args.timeInput.start,
      endTime: args.timeInput.end,
      location: args.eventInput.location,
      description: args.eventInput.description,
      tags: args.eventInput.tags,
      image: args.eventInput.image,
      group: args.eventInput.group,
      host: dbUserID
    };
    const createdEvent = await create.newEvent(mongoFormat);
    await fetchData.addEventToUser(dbUserID, createdEvent._id)
    return createdEvent
  },
  createUser: async (args) => {
    const encrypt = bcrypt.hashSync(args.userInput.password, 12)
    fetchData.getUser(args.userInput.userid)
    const mongoFormat = {
      name: args.userInput.name,
      location: {
        city: args.userInput.locationCity,
        state: args.userInput.locationState
      },
      photo: args.userInput.photo,
      userid: args.userInput.userid,
      password: encrypt
    }
    const res = await create.newUser(mongoFormat)
    return res
  },
  createPost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authorized')
    }
    const dbUserID = req.authUserID;
    const mongoFormat = {
      content: args.postInput.content,
      postedBy: dbUserID
    }

    const eventID = '5feebbffd21fe00f292ca356'
    const createdPost = await create.newPost(mongoFormat, eventID)
    return createdPost
  },
  addUserAttending: async (args) => {
    // add userid to Events.attendees array
    // add eventid to Users.going array
    const userAttending = args.attendeeInput.userid;
    const eventAttending = args.attendeeInput.eventid;

    const userObj = await create.newAttendance(userAttending, eventAttending)

    return userObj
  },
  createGroup: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authorized')
    }
    const dbUserID = req.authUserID
    const mongoFormat = {
      name: args.groupInput.name,
      location: args.groupInput.location,
      logo: args.groupInput.logo,
      owner: dbUserID
    }
    const createdGroup = await create.newGroup(mongoFormat)
    return createdGroup
  },
  addMemberToGroup: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authorized')
    }
    const dbUserID = req.authUserID
    const groupID = args.groupid

    const newMember = await create.newGroupMember(dbUserID, groupID)
    return newMember
  },
  addLikes: async (args) => {
    const eventObj = await create.newLike(args.eventID)
    return eventObj
  },
  login: async ({userid, password}) => {
    const authUser = await User.findOne({userid: userid})
    if (!authUser) {
      throw new Error('user doesn\'t exist')
    }
    const passMatch = bcrypt.compareSync(password, authUser.password)
    if (!passMatch) {
      throw new Error('password does not match')
    }
    const authToken = jwt.sign({authUserID: authUser.id, userid: authUser.userid}, 'mysecretkeydontlook', {
      expiresIn: '12h'
    })
    return {
      authID: authUser.id,
      token: authToken,
      tokenExpiration: 12
    }
  }
}