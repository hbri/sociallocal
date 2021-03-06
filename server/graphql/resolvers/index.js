const create = require('../../../database/controllers/addNew.js');
const fetchData = require('../../../database/controllers/getRecords.js');
const bcrypt = require('bcryptjs');
const User = require('../../../database/models/user.js');
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
  allGroups: async (args) => {
    const allGroupData = await fetchData.getAllGroups()
    return allGroupData;
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
    console.log(req)
    if (!req.isAuth) {
      throw new Error('not authorized')
    }
    const dbUserID = req.authUserID;
    const eventID = args.postInput.eventid
    const mongoFormat = {
      content: args.postInput.content,
      postedBy: dbUserID
    }

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
  removeUserAttending: async (args) => {
    const userRemoving = args.userid;
    const eventRemoving = args.eventid;

    const userObj = await create.removeAttendance(userRemoving, eventRemoving)

    return {
      ...userObj._doc,
      _id: userObj.id
    }
  },
  addUserInterested: async (args) => {
    const userInterested = args.userid;
    const eventInterested = args.eventid;

    const userObj = await create.newInterested(userInterested, eventInterested)

    return {
      ...userObj._doc,
      _id: userObj.id
    }
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
  approveMemberToGroup: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authorized')
    }
    const dbUserID = req.authUserID;
    const requestingUser = args.requestinguser;
    const groupID = args.groupid

    const newMember = await create.approveGroupMember(requestingUser, groupID)
    return newMember
  },
  addLikes: async (args) => {
    const userObj = await create.newLike(args.eventID, args.userid);
    return userObj
  },
  requestJoinGroup: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Please log in to join this group!')
    }
    const requester = args.userid;
    const requested = args.groupid;

    const response = await create.requestGroup(requester, requested)

    return response
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