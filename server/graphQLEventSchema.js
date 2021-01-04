const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema} = require('graphql');
const axios = require('axios');

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    eventID: { type: GraphQLString},
    tags: {type: GraphQLString},
    host: {type: UserType},
    title: {type: GraphQLString},
    description: {type: GraphQLString},
    tags: {type: GraphQLString}
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    userID: { type: GraphQLString},
    name: {type: GraphQLString},
    host: {type: UserType}
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    content: {type: GraphQLString}
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //this is used to pull down a list, multiple of obj like comments
    events: {
      type: new GraphQLList(EventType),
      resolve(parent, args) {
        return axios.get('/urlEndpoint')
          .then(res => res.data)
      }
    },
    //this is singular, not needing GraphQLList
    event: {
      type: EventType,
      args: {
        eventID: {type: GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3006/api/getevent/${args.eventID}`)
          .then(res => res.data)
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      args: {
        eventID: {type: GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3006/api/getposts/${args.eventID}`)
          .then(res => res.data)
      }
    }
  }
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addComment:{
      type: PostType,
      args: {
        eventID: {type: GraphQLString},
        content: {type: GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.post(`http://localhost:3006/addpost/${args.eventID}`, {
          eventID: args.eventID,
          content: args.content
        })
          .then(res => res.data)
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
  // can also take in mutations here for CRUD
})