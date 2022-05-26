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
describe('Question Endpoints', () => {

  it('GET /questions should show all questions', async () => {
    const res = await requestWithSupertest.get('/questions');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('Post /question should create', async () => {
    const res = await requestWithSupertest.post('/questions').send({question: 'test'}).set('Authorization','Bearer '+ token);
    itemToUse = res.body.result[0].id
    expect(res.status).toEqual(201);
  });


  it('Post /question should create without token throw 401', async () => {
    const res = await requestWithSupertest.post('/questions').send({question: 'test'});
    expect(res.status).toEqual(401);
  });

  it('Put /question/id should update', async () => {
    const res = await requestWithSupertest.put('/questions/'+itemToUse).send({question: 'test2'}).set('Authorization','Bearer '+ token);

    expect(res.status).toEqual(201);
  });

  it('Put by ID /question with wrong id shouldnt update', async () => {

    const res = await requestWithSupertest.put('/questions/'+-1).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });

  it('Delete by ID /question should delete throw unauthorized', async () => {
    const res = await requestWithSupertest.delete('/questions/'+itemToUse);
    expect(res.status).toEqual(401);
  });

  it('Delete by ID /question should delete', async () => {

    const res = await requestWithSupertest.delete('/questions/'+itemToUse).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(204);
  });

  it('Delete by ID /question with wrong id shouldnt delete', async () => {

    const res = await requestWithSupertest.delete('/questions/'+-1).set('Authorization','Bearer '+ token);
    expect(res.status).toEqual(500);
  });
});
