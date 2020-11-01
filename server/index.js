const express = require('express');
const app = express();
const port = 3006;
const path = require('path')

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});