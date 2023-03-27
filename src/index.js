const validateRequest = require('./middlewares/validateRequest');
//
const objectIdSchema = require('./yup-schemas/objectIdSchema');
const reqQuerySchema = require('./yup-schemas/reqQuerySchema');
const reqParamsSchema = require('./yup-schemas/reqParamsSchema');

module.exports = {
  objectIdSchema,
  reqQuerySchema,
  validateRequest,
  reqParamsSchema,
};
