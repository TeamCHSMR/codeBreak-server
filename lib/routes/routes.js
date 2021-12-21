const express = require('express');

const router = express.Router();

const { preferences, notes } = require('../models/index');
const basicAuth = require('../auth/middleware/basicAuth');
const bearerAuth = require('../auth/middleware/bearerAuth');

router.post('/pref', bearerAuth, createPreference);
router.get('/pref', bearerAuth, getUserPreferences);
router.put('/pref/:id', bearerAuth, updatePreferences);
router.delete('/pref/:id', bearerAuth, deletePreferences);
router.get('/pref/all', getAllPreferences);

async function createPreference(req, res, next) {
  const pref = {
    user: req.user.username,
    zip: req.body.zip,
    theme: req.body.theme,
  };
  const newRecord = await preferences.create(pref);
  res.status(201).json(newRecord);
}

async function getUserPreferences(req, res, next) {
  try {
    const user = req.user.username;
    const getRecord = await preferences.findAll({ where: { user } });
    res.status(200).json(getRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function updatePreferences(req, res, next) {
  let id = req.params.id;
  let user = req.user.username;
  const pref = {
    user: req.user.username,
    zip: req.body.zip,
    theme: req.body.theme,
  };
  const getRecord = await preferences.findOne({ where: { id, user } });

  const newRecord = await getRecord.update(pref);
  res.status(201).json(newRecord);
}

async function deletePreferences(req, res, next) {
  let id = req.params.id;
  let user = req.user.username;
  const getRecord = await preferences.findOne({ where: { id, user } });
  const newRecord = await getRecord.destroy();
  res.status(201).json(newRecord);
}

async function getAllPreferences(req, res, next) {
  try {
    const getRecord = await preferences.findAll();
    res.status(200).json(getRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}
module.exports = router;
