const validateRequest = require('./middlewares/validateRequest');
//
const objectId = require('./yup-schemas/objectId');
const objectIdArray = require('./yup-schemas/objectIdArray');
const reqQuery = require('./yup-schemas/reqQuery');
const reqParams = require('./yup-schemas/reqParams');

module.exports = {
  validateRequest,

  // schemas
  objectId,
  objectIdArray,
  reqQuery,
  reqParams,
};
