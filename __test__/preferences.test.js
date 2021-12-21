'use strict';

const { db } = require('../lib/models/index');
const supertest = require('supertest');
const server = require('../lib/server.js');
const request = supertest(server.app);

beforeAll(async()=>{
  await db.sync();
});
afterAll(async()=>{
  await db.drop();
});
let token = null;

describe ('Testing authentication routes',()=>{

  it('Should be able to add notes to the DB and returns an object with the added preferences', async ()=>{
    const responseUser = await request.post('/signup').send({
      username: 'Happy',
      password: 'Gilmore'
    })
    const userObject = responseUser.body.user;
    token = userObject.token
    const response = await request.post('/preferences').set('Authorization', `Bearer ${token}`).send({
      zip: 99999,
      theme:1,
      userId: userObject.id,
      user: userObject.username
    });
    expect(response.status).toEqual(201);
    expect(response.body.zip).toEqual(99999);
    expect(response.body.theme).toEqual(1);
  });

  it('Should be able to return all preferences of user using GET ', async ()=>{
    const response = await request.get('/preferences').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(typeof response.body).toEqual('object');

  });
  it('Should be able to return single preference by ID using GET /:model/:id', async ()=>{
    const response = await request.get('/preferences/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.zip).toEqual(99999);
    expect(response.body.theme).toEqual(1);
  });

  it('Should be able to update single preference by ID using PUT ', async ()=>{
    const response = await request.put('/preferences/1').set('Authorization', `Bearer ${token}`).send({
      zip: 11111,
      theme:0, 
    })
    expect(response.status).toEqual(201);
    expect(response.body.zip).toEqual(11111);
    expect(response.body.theme).toEqual(0);

  });

  it('Should be able to delete single preference by ID using DELETE ', async ()=>{
    const responseDel = await request.delete('/preferences/1').set('Authorization', `Bearer ${token}`);
    expect(responseDel.body).toBe(1);
    
    const response = await request.get('/preferences/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body === null).toBe(true);
  });

})