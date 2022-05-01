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
describe('Settings Endpoints', () => {

  it('GET /settings should show settings', async () => {
    const res = await requestWithSupertest.get('/settings');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('Post /settings wrong body shouldnt create', async () => {
    const res = await requestWithSupertest.post('/settings').send({re: 'test'}).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });


  it('Put /settings wrong body shouldnt create', async () => {
    const res = await requestWithSupertest.put('/settings').send({re: 'test'}).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });

});
