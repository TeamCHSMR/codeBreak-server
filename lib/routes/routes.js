const express = require('express');

const router = express.Router();

const { preferences,notes } = require('../models/index');
const basicAuth = require('../auth/middleware/basicAuth')
const bearerAuth = require('../auth/middleware/bearerAuth')

router.post('/pref',bearerAuth, createPreference);


async function createPreference(req,res,next){
  console.log(req.body,'--------body')
  const pref = {
    user: req.user.username,
    zip: req.body.zip,
    theme: req.body.theme
    };
  const newRecord = await preferences.create(pref)
  res.status(201).json(newRecord)
}
module.exports = router;