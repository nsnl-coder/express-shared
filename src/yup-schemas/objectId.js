const ObjectId = require('mongoose').Types.ObjectId;
const yup = require('yup');

/**
 * mongodb objectid schema
 */
const objectId = yup
  .string()
  .test(
    'is-object-id',
    'Invalid ObjectId',
    (value) =>
      value === undefined ||
      (ObjectId.isValid(value) && String(new ObjectId(value)) === value),
  );
module.exports = objectId;
