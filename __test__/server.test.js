'use strict'
const supertest = require('supertest');

const server = require('../lib/server');
const request = supertest(server.app);

describe ('Testing application server',()=>{

  it('Should be able to read message from server', async ()=>{
    const response = await request.get('/')
    expect(response.status).toBe(200);
    expect(response.body).toEqual('Welcome to CodeBreak');

  })
});