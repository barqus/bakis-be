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
describe('auth Endpoints', () => {

  it('GET /auth/twitch/code should throw 400 ', async () => {
    const res = await requestWithSupertest.get('/auth/twitch/test');
    expect(res.status).toEqual(400);
  });

  it('GET /confirm/:activation_code should throw 200 ', async () => {
    const res = await requestWithSupertest.get('/auth/confirm/:activation_code');
    expect(res.status).toEqual(200);
  });


  it('Post /auth/new_password bad body 500', async () => {
    const res = await requestWithSupertest.post('/auth/new_password')
    .send({test: "BAD BODY"})
    .set('Authorization','Bearer '+ token);

    expect(res.status).toEqual(500);
  });

  it('Post /auth/reset bad body 500', async () => {
    const res = await requestWithSupertest.post('/auth/reset')
    .send({test: "BAD BODY"})
    .set('Authorization','Bearer '+ token);

    expect(res.status).toEqual(500);
  });

  it('Post /auth/login bad body 400', async () => {
    const res = await requestWithSupertest.post('/auth/login')
    .send({test: "BAD BODY"})
    .set('Authorization','Bearer '+ token);

    expect(res.status).toEqual(400);
  });
  

  it('Post /auth/register bad body 400', async () => {
    const res = await requestWithSupertest.post('/auth/register')
    .send({test: "BAD BODY"})
    .set('Authorization','Bearer '+ token);

    expect(res.status).toEqual(400);
  });

});
