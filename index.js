'use strict';

const app = require('./lib/server');
require('dotenv').config();

const PORT = process.env.PORT || 3003;
const { db } = require('./lib/models');

db.sync().then(() => {
  app.start(PORT);
});
