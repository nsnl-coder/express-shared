const objectIdSchema = require('./yup-schemas/objectIdSchema');
const reqQuerySchema = require('./yup-schemas/reqQuerySchema');
const validateRequest = require('./middlewares/validateRequest');

module.exports = { objectIdSchema, reqQuerySchema, validateRequest };
