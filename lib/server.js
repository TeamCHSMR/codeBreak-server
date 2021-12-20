'use strict';

const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth/routes')
const router = require('./routes/routes')
const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(authRoutes);
app.use(router);

app.get('/', (req, res) => {
  res.status(200).json('Welcome to CodeBreak');
});

module.exports = {
  app,
  start: port => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  },
};
