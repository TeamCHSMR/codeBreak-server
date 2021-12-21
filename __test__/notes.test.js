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

  it('Should be able to add notes to the DB and returns an object with the added notes', async ()=>{
    const responseUser = await request.post('/signup').send({
      username: 'Happy',
      password: 'Gilmore'
    })
    const userObject = responseUser.body.user;
    token = userObject.token
    const response = await request.post('/notes').set('Authorization', `Bearer ${token}`).send({
      notes: 'You better pass this test!',
      userId: userObject.id,
      user: userObject.username
    });
    expect(response.status).toEqual(201);
    expect(response.body.notes).toEqual('You better pass this test!');
  });

  it('Should be able to return all notes of user using GET ', async ()=>{
    const response = await request.get('/notes').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(typeof response.body).toEqual('object');

  });
  it('Should be able to return single note by ID using GET /:model/:id', async ()=>{
    const response = await request.get('/notes/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.notes).toEqual('You better pass this test!');

  });

  it('Should be able to update single note by ID using PUT ', async ()=>{
    const response = await request.put('/notes/1').set('Authorization', `Bearer ${token}`).send({
      notes: 'Whats up!'  
    })
    expect(response.status).toEqual(201);
    expect(response.body.notes).toEqual('Whats up!');

  });

  it('Should be able to delete single note by ID using DELETE ', async ()=>{
    const responseDel = await request.delete('/notes/1').set('Authorization', `Bearer ${token}`);
    expect(responseDel.body).toBe(1);
    
    const response = await request.get('/notes/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body === null).toBe(true);
  });

})