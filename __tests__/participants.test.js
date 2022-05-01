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
describe('participants Endpoints', () => {

  it('GET /participants should show all participants', async () => {
    const res = await requestWithSupertest.get('/participants');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('GET  /participants/-1 throw 500', async () => {
    const res = await requestWithSupertest.get('/participants/-1');
    expect(res.status).toEqual(500);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('GET  /participants/-1/qna throw 500', async () => {
    const res = await requestWithSupertest.get('/participants/-1/qna');
    expect(res.status).toEqual(500);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('Post /participant empty body {} throw 400', async () => {
    const res = await requestWithSupertest.post('/participants')
    .send({})
    .set('Authorization','Bearer '+ token);

    expect(res.status).toEqual(400);
  });

  it('Put  /participants/-1 throw 400', async () => {
    const res = await requestWithSupertest.put('/participants/-1')
    .set('Authorization','Bearer '+ token);;
    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('Post /participant wrong body', async () => {
    const res = await requestWithSupertest.post('/participants').send([{question: 'test', participant: 'test'}]).set('Authorization','Bearer '+ token);
    console.log()
    expect(res.status).toEqual(500);
  });

  it('Post /participant without token throw 401', async () => {
    const res = await requestWithSupertest.post('/participants').send([{question: 'test', participant: 'test'}]);
    expect(res.status).toEqual(401);
  });

  // it('Put /participant/id should update', async () => {
  //   const res = await requestWithSupertest.put('/participants/'+itemToUse).send({participant: 'test2'}).set('Authorization','Bearer '+ token);
  //   console.log(res)
  //   expect(res.status).toEqual(201);
  // });

  it('Put by ID /participant with wrong id shouldnt update', async () => {

    const res = await requestWithSupertest.put('/participants/'+-1).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });

  // it('Delete by ID /participant should delete throw unauthorized', async () => {
  //   const res = await requestWithSupertest.delete('/participants/'+itemToUse);
  //   expect(res.status).toEqual(401);
  // });

  // it('Delete by ID /participant should delete', async () => {

  //   const res = await requestWithSupertest.delete('/participants/'+itemToUse).set('Authorization','Bearer '+ token);
  //   expect(res.status).toEqual(204);
  // });

  it('Delete by ID /participant with wrong id shouldnt delete', async () => {

    const res = await requestWithSupertest.delete('/participants/'+-1).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });
});
