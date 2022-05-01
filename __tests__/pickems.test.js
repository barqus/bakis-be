const server = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);
const jwt = require('jsonwebtoken')
const config = require('../config');

function generateAccessToken(userContext) {
  return jwt.sign(userContext, config.token_secret, { expiresIn: '1800s' });
}

var itemToUse = ""
const token = generateAccessToken({ user_id: -1, role: "admin" })
describe('pickems Endpoints', () => {

  it('GET /pickems/-1 throw 500', async () => {
    const res = await requestWithSupertest.get('/pickems/-1')
    .set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });
  it('Delete by ID /pickems with wrong id shouldnt delete', async () => {

    const res = await requestWithSupertest.delete('/pickems/'+-1).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });
});
