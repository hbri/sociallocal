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

// Authorization using Bearer Token. Data will be in req.rawHeaders array as
// 'Bearer thisisallthetokeninformation' string. This is why 'split(' ')[1]
// will get the token info. req.get('Authorization) is a better way to access
// that string though rather than object notation
const handleAuth = async (req, res, next) => {
  // isAuth key and boolean value will enable restricting access to some things
  // but allowing for other things. Used instead of a blanket req denial if not
  // authorized. Can still view events e.g.
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
  // if there exists and Authorization Token in the req, attempt to  verify it with jwt
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'mysecretkeydontlook')
    // decoded token values/keys / data are whatever was defined when created. This one
    // was in resolvers and had authID: authUser.id, token: authToken,
    // tokenExpiration: 1
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

// using handleAuth as middleware will run it on every request since graphQL is
// a single route /graphql. this is why handleAuth doesn't throw any errors and
// instead only adds meta data
app.use(handleAuth)

app.use('/graphql', graphqlHTTP({
  schema: gSchema.graphqlSchema,
  rootValue: gResolvers.resolvers,
  graphiql: true
}));
