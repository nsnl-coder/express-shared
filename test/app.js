const express = require('express');
const app = express();
const yup = require('yup');

const validateRequest = require('../src/middlewares/validateRequest');
const reqQuerySchema = require('../src/yup-schemas/reqQuerySchema');
const objectIdSchema = require('../src/yup-schemas/objectIdSchema');

app.use(express.json());

const schema = yup
  .object({
    body: yup.object({
      name: yup.string().default('default string'),
      username: yup.string(),
      price: yup.number().min(0).max(10),
      id: objectIdSchema,
    }),
    params: yup.object({
      id: objectIdSchema,
    }),
    // query: reqQuerySchema,
  })
  .strict(true);

app.use('/:id', validateRequest(schema), (req, res, next) => {
  res.status(200).json({
    body: req.body,
    params: req.params,
    query: req.query,
  });
});

module.exports = { app };
