'use strict';

const express = require('express');
const router = express.Router();
const dataModules = require('../models/index');
const bearerAuth = require('../auth/middleware/bearerAuth');
const CITY_KEY = process.env.LOCATION_CITY_KEY;
const RESTAURANT_API_KEY = process.env.RESTAURANT_API_KEY;
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
    console.log('---------------->', user);
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
    console.log('helloooooo');
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
  try {
    console.log('FOOD!');
    console.log(req.body.postalcode, 'sss');

    let foodiqUrl = `https://us1.locationiq.com/v1/search.php?key=${CITY_KEY}&postalcode=${req.body.postalcode}&countrycodes=us&format=json`;
    console.log(foodiqUrl);
    let coordinates = await axios.get(foodiqUrl);

    let latitude = coordinates.data[0].lat;
    let longitude = coordinates.data[0].lon;

    let foodurl = `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${latitude}&longitude=${longitude}&limit=5&currency=USD&distance=2&open_now=false&lunit=km&lang=en_US`;

    let config2 = {
      headers: {
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        'x-rapidapi-key': RESTAURANT_API_KEY,
      },
    };
    let foodData = await axios.get(foodurl, config2);
    res.status(200).send(foodData.data);
  } catch (err) {
    res.status(400).send(err);
  }
}
module.exports = router;
