const mongoose = require('mongoose');
const mongooseURI = 'mongodb://localhost/sociallocal';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(mongooseURI, mongooseOptions);
const db = mongoose.connection;

db.on('error', console.error.bind(console, '--> connection error -->'));

db.once('open', () => {
  console.log('--> connection open! -->')
})

