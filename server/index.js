const express = require('express');
const app = express();
const port = 3006;
const path = require('path');
const create = require('../database/controllers/addNew.js');
const fetchData = require('../database/controllers/getPosts.js');

app.use(express.json())
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// endpoints to add new documents to DB: users, events, posts
app.post('/api/adduser', async (req, res) => {
  await create.newUser(req.body)
  res.end()
});

app.post('/api/addevent', async (req, res) => {
  await create.newEvent(req.body)
  res.end()
});

app.post('/api/addpost/:eventID', async (req, res) => {
  const event = req.params.eventID;
  await create.newPost(req.body, event)
  res.end()
});

// fetch all posts and comments for event page
app.get('/api/getposts/:eventID', async (req, res) => {
  const event = req.params.eventID;
  const posts = await fetchData.getPosts(event);
  res.end()
})

app.get('/testformat', (req, res) => {
  const {name, description, isDone, createdAt, updatedAt} = req.body;
  console.log(name);
  res.end()
})