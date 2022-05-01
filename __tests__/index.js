const server = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);
const jwt = require('jsonwebtoken')
const config = require('../config');

describe('index Endpoints', () => {

  it('GET / should show status', async () => {
    const res = await requestWithSupertest.get('/');
    expect(res.status).toEqual(200);

  });
})