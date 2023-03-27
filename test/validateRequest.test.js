const request = require('supertest');
const { app } = require('./app');

it('should return correct body if input is valid', async () => {
  const { body } = await request(app)
    .post('/00000020f51bb4362eee2a4d?name=book')
    .send({
      username: 'testusername',
      email: 'test@test.com',
      price: '6',
      id: '00000020f51bb4362eee2a4d',
    })
    .expect(200);

  expect(body).toEqual({
    body: {
      name: 'default string',
      username: 'testusername',
      email: 'TEST@TEST.COM',
      price: 6,
      id: '00000020f51bb4362eee2a4d',
    },
    params: { id: '00000020f51bb4362eee2a4d' },
    query: { filter: { name: 'book' } },
  });
});
