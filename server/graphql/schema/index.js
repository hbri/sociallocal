const { buildSchema } = require('graphql');

module.exports.graphqlSchema = buildSchema(`
type Time {
  start: String
  end: String
}

type Group {
  _id: ID
  name: String
  members: [User]
  location: String
  events: [Event]
  owner: User
  pendingRequests: [User]
}

input GroupInput {
  name: String
  location: String
  logo: String
  owner: String
}

type Event {
  _id: ID
  title: String!
  time: Time
  description: String!
  location: String
  tags: String
  image: String
  group: Group
  attendees: [User]
  interested: [User]
  host: User
  likes: [User]
  posts: [Post]
  pendingRequests: [User]
}

type User {
  _id: ID
  name: String
  userid: String
  locationCity: String
  locationState: String
  photo: String
  password: String
  events: [Event]
  posts: [Post]
  groups: [Group]
  going: [Event]
  pendingEvents: [Event]
  pendingGroups: [Group]
  likes: [Event]
}

type AuthData {
  authID: ID!
  token: String!
  tokenExpiration: Int!
}

type Post {
  _id: ID
  content: String
  postedBy: User
  timestamp: String
  comments: [Post]
}

input UserInput {
  name: String
  userid: String
  locationCity: String
  locationState: String
  photo: String
  password: String
}

input EventInput {
  title: String!
  time: TimeInput
  description: String!
  location: String
  tags: String
  image: String
  group: String
  host: String
}

input TimeInput {
  start: String
  end: String
}

input PostInput {
  content: String
  eventid: String
}

input AttendeeInput {
  eventid: String
  userid: String
}


type RootQuery {
  events(eventID: String): Event
  posts(eventID: String): [Post]
  user(userID: String): User
  login(userid: String, password: String): AuthData!
  group(groupID: String): Group
  allGroups: [Group]
}

type RootMutation {
  createEvent(eventInput: EventInput, timeInput: TimeInput): Event
  createUser(userInput: UserInput): User
  createPost(postInput: PostInput): Post
  addUserAttending(attendeeInput: AttendeeInput): User
  removeUserAttending(eventid: String, userid: String): User
  addUserInterested(eventid: String, userid: String): User
  addLikes(eventID: String, userid: String): User
  createGroup(groupInput: GroupInput): Group
  approveMemberToGroup(groupid: String, requestinguser: String): User
  requestJoinGroup(groupid: String, userid: String) : Boolean
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`)

