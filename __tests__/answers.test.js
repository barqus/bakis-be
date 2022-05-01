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
describe('Answers Endpoints', () => {

  it('GET /answers should show all answers', async () => {
    const res = await requestWithSupertest.get('/answers');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('Post /answer should create', async () => {
    const q = await requestWithSupertest.get('/questions');
    const p = await requestWithSupertest.get('/participants');
    const res = await requestWithSupertest.post('/answers').send([{answer: 'test', question_id: q.body[0].id, participant_id:  p.body.participants[0].id}]).set('Authorization','Bearer '+ token);

    expect(res.status).toEqual(201);
  });

  it('Post /answer wrong body', async () => {
    const res = await requestWithSupertest.post('/answers').send([{question: 'test', answer: 'test'}]).set('Authorization','Bearer '+ token);
    console.log()
    expect(res.status).toEqual(500);
  });

  it('Post /answer without token throw 401', async () => {
    const res = await requestWithSupertest.post('/answers').send([{question: 'test', answer: 'test'}]);
    expect(res.status).toEqual(401);
  });

  // it('Put /answer/id should update', async () => {
  //   const res = await requestWithSupertest.put('/answers/'+itemToUse).send({answer: 'test2'}).set('Authorization','Bearer '+ token);
  //   console.log(res)
  //   expect(res.status).toEqual(201);
  // });

  it('Put by ID /answer with wrong id shouldnt update', async () => {

    const res = await requestWithSupertest.put('/answers/'+-1).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });

  // it('Delete by ID /answer should delete throw unauthorized', async () => {
  //   const res = await requestWithSupertest.delete('/answers/'+itemToUse);
  //   expect(res.status).toEqual(401);
  // });

  // it('Delete by ID /answer should delete', async () => {

  //   const res = await requestWithSupertest.delete('/answers/'+itemToUse).set('Authorization','Bearer '+ token);
  //   expect(res.status).toEqual(204);
  // });

  it('Delete by ID /answer with wrong id shouldnt delete', async () => {

    const res = await requestWithSupertest.delete('/answers/'+-1).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });
});
