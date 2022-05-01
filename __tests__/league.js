const server = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);
const jwt = require('jsonwebtoken')
const config = require('../config');

function generateAccessToken(userContext) {
  return jwt.sign(userContext, config.token_secret, { expiresIn: '1800s' });
}

var itemToUse = ""
const token = generateAccessToken({ user_id: 1, role: "admin" })
describe('League Endpoints', () => {

  it('GET /league/standings should show standings', async () => {
    const res = await requestWithSupertest.get('/league/standings ');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('GET /league/history should show standings', async () => {
    const res = await requestWithSupertest.get('/league/history');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

});
