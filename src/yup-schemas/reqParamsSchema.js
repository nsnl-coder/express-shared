const yup = require('yup');
const objectIdSchema = require('./objectIdSchema');

const reqParamsSchema = yup.object({
  id: objectIdSchema,
  deleteList: yup.array().of(objectIdSchema),
  updateList: yup.array().of(objectIdSchema),
});

module.exports = reqParamsSchema;
