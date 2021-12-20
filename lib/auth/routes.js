const express = require('express');

const authRouter = express.Router();

const { users } = require('../models/index');
const basicAuth = require('./middleware/basicAuth.js');

authRouter.post('/signup', async (req, res, next) => {
  try {
    console.log(req.body,'-----------yellow---')
    const userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  console.log(req.body,'-----------yellow---')
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(user);
});

authRouter.delete('/delete/:user', async (req, res, next) => {
  const username = req.params.user;
  const deletedRecord = await users.destroy({ where: { username } });
  res.status(200).json(deletedRecord);
});

authRouter.get('/users', async (req, res, next) => {
  const userRecords = await users.findAll();
  res.status(200).json(userRecords);
});

module.exports = authRouter;
