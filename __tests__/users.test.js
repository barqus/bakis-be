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
describe('users Endpoints', () => {

  it('GET /users should show users', async () => {
    const res = await requestWithSupertest.get('/users')
    .set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('GET /users unauthorized 403', async () => {
    const res = await requestWithSupertest.get('/users')
    .set('Authorization','Bearer '+ "token");
    expect(res.status).toEqual(403);
  });

  it('Put /users/role/-1 throw 500', async () => {
    const res = await requestWithSupertest.put('/users/role/-1')
    .send({re: 'test'}).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });


  it('Get /all should show users', async () => {
    const res = await requestWithSupertest.get('/users/all')
    .set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(200);
  });

});
