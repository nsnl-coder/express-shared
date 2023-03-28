# yup schemas for express, mongoose

## How to install

    $ npm install yups-schema

## What can yup schemas do?

For example, with **reqQuery**, you can easily implement features such as:

- params valdiation
- pagination
- limit fields
- sorting
- filtering

## Introduction

This package exports 2 middlewares and 4 pre-build schemas:

```javascript
const {
  validateRequest, // middleware
  requiredFields, // middleware
  //
  reqParams, // yup schema to validate req.params
  reqQuery, // yup schema to parse req.query
  objectId, // use to check if string is valid mongodb objectid
  objectIdArray, // use to validate if an array only contains objectid
} = require('yups-schema');
```

## Detail

- `validateRequest`: accept yup schema as input and validate `req.body`. Return 400 error if validation failed.

- `requiredFields`: accepts a string or multiple strings and check if they are defined. Return 400 error if the required fields are not defined.

## You can use these pre-build yup schemas to:

- `reqParams`: check if `req.params.id` is a valid `objectId`
- `reqQuery`: validate and parse `req.query`
- `objectId`: check if a field is a valid `objectId`
- `objectIdArray`: check if a field is array of `objectIds`

## How to use ?

To use yup-schemas, you first need to install yup:

`$ npm install yup`

Then, you need to define your schema using yup and yup-schemas

```javascript
// using schema to quickly validate
const yup = require('yup');
const { objectId, reqQuery } = require('yup-schemas');

const productSchema = yup.object({
  body: yup.object({
    // write your code to validate req.body here
  }),

  // validate req.params
  params: reqParams, // check if req.params.id is a valid mongodb ObjectId

  // validate and parse req.query
  query: reqQuery,
});
```

Finally, import schema and pass it to route handler like this example:

```javascript
// Using middleware to validate
const express = require('express');
const { requiredFields, validateRequest } = require('yup-schemas');
const router = express();

router.use(
  '/',
  requiredField('name', 'price'), // make sure name and price are required
  validateRequest(productSchema), // validate req.body, req.params and req.query using defined schema
  yourHandlerHere,
);
```

## Here are some examples how `reqQuery` parse your query

There are 2 types of queries: special queries & normal queries

## How special queries being parsed:

Special queries includes: `page, itemsPerPage, sort, fields, skip, limit`

| endpoint                           | req.query                                     |
| ---------------------------------- | --------------------------------------------- |
| /products?page=1                   | `{ page : 1, filter : {} }`                   |
| /products?itemsPerPage=1           | `{ itemsPerPage : 1, filter : {} }`           |
| /products?fields=price,name,status | `{ fields:"price name status", filter : {} }` |
| /products?sort=price,-name,status  | `{ sort:"price -name status", filter : {} }`  |
| /products?skip=1                   | `{ skip : 1, filter : {} }`                   |
| /products?limit=1                  | `{ limit : 1, filter : {} }`                  |

## How other queries being parsed:

| endpoint                                  | req.query                                                         |
| ----------------------------------------- | ----------------------------------------------------------------- |
| /products?price=24                        | `{ filter : { price: '24' } }`                                    |
| /products?price=26,12                     | `{ filter : { price: { $in: [ '26', '12' ] } } }`                 |
| /products?price=15&status=active&price=14 | `{ filter : { price: { $in: [ '15', '14' ] }, status:"active"} }` |
| /products?price[gt]=4                     | `{ filter : { price: { $gt: 4 }} }`                               |
| /products?price[gte]=4                    | `{ filter : { price: { $gte: 4 }} }`                              |
| /products?price[lt]=4                     | `{ filter : { price: { $lt: 4 }} }`                               |
| /products?price[lte]=4                    | `{ filter : { price: { $lte: 4 }} }`                              |

## Example

Implement pagination, limit fields, sorting and filter using **reqQuery**.

```javascript
// productSchema.js
const reqQuery = require('yup-schemas');
const yup = require('yup');

const productSchema = yup.object({
  body: yup.object({
    // your product schema definition here
  }),
  query: reqQuery,
});
```

```javascript
// productRoutes.js
const express = require('express');
const router = express.Router();
const productSchema = require('./productSchema'); // import yup schema

// parse query and validate query before getAllProducts handler
router.get('/', validateRequest(productSchema), getAllProducts);
```

```javascript
// productControllers.js
const express = require('express');
const router = express.Router();
const productSchema = require('./productSchema'); // import yup schema
const Product = require('./productModel'); // import your mongoose model here

const getManyProducts = async (req, res, next) => {
  const {
    fields,
    sort = '-createdAt', // new to old
    page = 1,
    itemsPerPage = 20,
    filter,
  } = req.query;

  // 0. check how many result
  const matchingResults = await Product.countDocuments(filter);
  const totalPages = Math.ceil(matchingResults / itemsPerPage);

  if (page > totalPages) {
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: [],
    });
  }

  // 1. create inital query but not await it
  let query = Product.find(filter);

  // 2. sorting
  query = query.sort(sort);

  // 3. limit fields
  if (fields) {
    query = query.select(fields);
  }

  // 4. pagination
  const skip = (page - 1) * itemsPerPage;
  const limit = itemsPerPage;

  query = query.skip(skip).limit(limit);

  // 5. finally await query
  const ones = await query;

  res
    .status(200)
    .json({ status: 'success', totalPages, results: ones.length, data: ones });
};
```

### Dependencies

This package only have 2 dependencies: yup & mongoose
