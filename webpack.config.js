const path = require('path');

module.exports = {
  entry: './client/src/app.jsx',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  }
};