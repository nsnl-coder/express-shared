const validateRequest = require('./middlewares/validateRequest');
const requiredFields = require('./middlewares/requiredFields');
//
const objectId = require('./yup-schemas/objectId');
const objectIdArray = require('./yup-schemas/objectIdArray');
const reqQuery = require('./yup-schemas/reqQuery');
const reqParams = require('./yup-schemas/reqParams');

module.exports = {
  // middlewares
  validateRequest,
  requiredFields,

  // schemas
  objectId,
  objectIdArray,
  reqQuery,
  reqParams,
};
