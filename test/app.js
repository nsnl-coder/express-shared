const express = require('express');
const app = express();
const yup = require('yup');

const validateRequest = require('../src/middlewares/validateRequest');
const reqQuery = require('../src/yup-schemas/reqQuery');
const reqParams = require('../src/yup-schemas/reqParams');
const objectId = require('../src/yup-schemas/objectId');

app.use(express.json());

const schema = yup.object({
  body: yup.object({
    name: yup.string().default('default string'),
    username: yup.string(),
    email: yup.string().uppercase(),
    price: yup.number().min(0).max(10),
    id: objectId,
  }),
  params: reqParams,
  query: reqQuery,
});

app.use('/:id', validateRequest(schema), (req, res, next) => {
  res.status(200).json({
    body: req.body,
    params: req.params,
    query: req.query,
  });
});

module.exports = { app };
