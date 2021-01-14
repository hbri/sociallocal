const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const gSchema = require('./graphql/schema/index.js');
const gResolvers = require('./graphql/resolvers/index.js');
// const graphQLEventSchema = require('./graphQLEventSchema.js');
const app = express();
const port = 3006;
const path = require('path');
const jwt = require('jsonwebtoken');


app.use(express.json())

// app.use('/event/:eventId', express.static('public'))
app.use('/', express.static('public'))


const handleAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  // validate token on req then add 'isAuth: true' and the mongo user _id to the req
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'mysecretkeydontlook')
    /*
    token structure defined in graphql/resolvers/index.js
    authID: authUser.id, token: authToken, tokenExpiration: 1
    */
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.authUserID = decodedToken.authUserID;

  next()
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/*
  handleAuth middleware only adds metadata / throws no errors
  since being used on single api point /graphql : needs to allow
  access to both non-restricted content and to restricted content
*/
app.use(handleAuth)

app.use('/graphql', graphqlHTTP({
  schema: gSchema.graphqlSchema,
  rootValue: gResolvers.resolvers,
  graphiql: {
    headerEditorEnabled: true
  }
}));
