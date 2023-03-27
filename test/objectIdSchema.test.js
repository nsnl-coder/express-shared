const request = require('supertest');
const { app } = require('./app');
const objectIdSchema = require('../src/yup-schemas/objectIdSchema');

it('return 400 if objectid is not valid', async () => {
  // random string is not valid
  const attempt1 = await request(app).post('/ddssdds').expect(400);

  expect(attempt1.body.message).toEqual('Data validation failed');
  expect(attempt1.body.errors).toContain('Invalid ObjectId');

  // 12 character string is not valid
  const attempt2 = await request(app).post('/123456789000').expect(400);

  expect(attempt2.body.message).toEqual('Data validation failed');
  expect(attempt2.body.errors).toContain('Invalid ObjectId');
});

it('returns 200 if objectid is valid', async () => {
  // random string is not valid
  const attempt1 = await request(app)
    .post('/00000020f51bb4362eee2a4d')
    .expect(200);

  expect(attempt1.body.params.id).toEqual('00000020f51bb4362eee2a4d');
});

it('validate body.id if it is defined and not validate if it is undefined', async () => {
  // don't return error if body.id is missing
  await request(app).post('/00000020f51bb4362eee2a4d').expect(200);

  // return 400 if body.id is not valid
  await request(app)
    .post('/00000020f51bb4362eee2a4d')
    .send({
      id: 'not-valid-id',
    })
    .expect(400);

  // return 200 if body.id is  valid
  await request(app)
    .post('/00000020f51bb4362eee2a4d')
    .send({
      id: '00000020f51bb4362eee2a4d',
    })
    .expect(200);
});
