'use strict';

const express = require('express');
const router = express.Router();
const dataModules = require('../models/index');
const bearerAuth = require('../auth/middleware/bearerAuth');
const axios = require('axios');

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.post('/food', getFoodHandler);
router.post('/:model', bearerAuth, createHandler);
router.get('/:model', bearerAuth, getHandler);
router.get('/:model/:id', bearerAuth, getOneHandler);
router.put('/:model/:id', bearerAuth, updateHandler);
router.delete('/:model/:id', bearerAuth, deleteHandler);
router.get('/:model/all', getAllHandler);

async function createHandler(req, res, next) {
  try {
    const obj = {
      ...req.body,
      userId: req.user.id,
      user: req.user.username,
    };
    const newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getHandler(req, res, next) {
  try {
    const user = req.user.username;
    const getRecord = await req.model.get(user);
    res.status(200).json(getRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}
async function getOneHandler(req, res, next) {
  try {
    const user = req.user.username;
    const id = req.params.id;
    const getRecord = await req.model.get(user, id);
    res.status(200).json(getRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function updateHandler(req, res, next) {
  try {
    let id = req.params.id;
    let user = req.user.username;
    const obj = req.body;
    const newRecord = await req.model.update(id, user, obj);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function deleteHandler(req, res, next) {
  try {
    let id = req.params.id;
    let user = req.user.username;
    const getRecord = await req.model.delete(id, user);
    res.status(201).json(getRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getAllHandler(req, res, next) {
  try {
    const getRecord = await req.model.get();
    res.status(200).json(getRecord);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getFoodHandler(req, res, next) {
  let term = req.body.cuisine;
  let location = req.body.postalcode;
  const key = process.env.YELP_API_KEY;

  let YELP_API_URL = `https://api.yelp.com/v3/businesses/search?location=${location}&term=${term}&limit=5`;

  try {
    let results = await axios.get(YELP_API_URL, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
    const restaurants = results.data.businesses;
    res.status(200).send(restaurants);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

module.exports = router;
