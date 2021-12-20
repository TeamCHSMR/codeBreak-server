'use strict';

const supertest = require('supertest');
const { db } = require('../lib/models/index');
const server = require('../lib/server');
const base64 = require('base-64');


const request = supertest(server.app);

beforeAll(async()=>{
  await db.sync();
});
afterAll(async()=>{
  await db.drop();
});

describe ('Testing authentication routes',()=>{

  it('Should be able to create a new User', async ()=>{
    const response = await request.post('/signup').send({
      username: 'Harvey',
      password: 'doe123',
      role: 'user'
    })
    const userObject = response.body.user;
    expect(response.status).toBe(201);
    expect(userObject.username).toBe('Harvey');
    expect(typeof userObject.token).toBe('string');
  })

  it ('Should be able to sign with an encoded auth header', async () => {
    let encodedUserPass = base64.encode(`Harvey:doe123`);
    
    const response = await request.post('/signin').set({
      Authorization: `Basic ${encodedUserPass}`,
    });

    expect(response.status).toBe(200);
  });
  it ('Should be able to get all users', async () => {
    const response = await request.get('/users')
    expect(response.status).toBe(200);
    expect(response.body[0].username).toBe('Harvey');
  });
  it ('Should be able to delete user by username', async () => {
    const response = await request.delete('/delete/Harvey')
    expect(response.status).toBe(200);
    expect(response.body).toBe(1);
  });
})