'use strict';

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to CodeBreak');
});

module.exports = {
  app,
  start: port => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  },
};
