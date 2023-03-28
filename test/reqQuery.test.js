const request = require('supertest');
const { app } = require('./app');

describe('should parse req.query correctly', () => {
  it('successfully parse random fields', async () => {
    const { body } = await request(app)
      .post('/00000020f51bb4362eee2a4d?name=book')
      .expect(200);

    expect(body.query.filter.name).toEqual('book');
  });

  it('should parse special field: sort, limit, itemsPerPage, page & fields', async () => {
    const query =
      'sort=-name,price,createdAt&limit=100&fields=name,price,createdAt&page=4&itemsPerPage=100';

    const { body } = await request(app)
      .post(`/00000020f51bb4362eee2a4d?${query}`)
      .expect(200);

    expect(body.query).toEqual({
      page: 4,
      itemsPerPage: 100,
      limit: 100,
      sort: '-name price createdAt',
      fields: 'name price createdAt',
      filter: {},
    });
  });

  it('should parse normal field but its value is comma seperate list', async () => {
    const { body } = await request(app)
      .post('/00000020f51bb4362eee2a4d?status=active,inactive')
      .expect(200);

    expect(body.query).toEqual({
      filter: {
        status: { $in: ['active', 'inactive'] },
      },
    });
  });

  it('should parse field with special filter such as gte,gt,lte,lt', async () => {
    const { body } = await request(app)
      .post(
        '/00000020f51bb4362eee2a4d?price[gt]=10&price[lt]=100&review[gte]=4&review[lte]=5',
      )
      .expect(200);

    expect(body.query).toEqual({
      filter: {
        price: {
          $gt: '10',
          $lt: '100',
        },
        review: {
          $lte: '5',
          $gte: '4',
        },
      },
    });
  });

  it('should parse all types of queries together', async () => {
    const query =
      'sort=-name,price&limit=100&fields=name,price&page=4&itemsPerPage=100&price[gt]=4&review=3&status=active,inactive';

    const { body } = await request(app)
      .post(`/00000020f51bb4362eee2a4d?${query}`)
      .expect(200);

    expect(body.query).toEqual({
      sort: '-name price',
      limit: 100,
      page: 4,
      itemsPerPage: 100,
      fields: 'name price',
      filter: {
        price: {
          $gt: '4',
        },
        review: '3',
        status: { $in: ['active', 'inactive'] },
      },
    });
  });
});
