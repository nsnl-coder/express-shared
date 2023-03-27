const yup = require('yup');

const reqParamsSchema = yup.object({
  id: objectIdSchema,
  deleteList: yup.array().of(objectIdSchema),
  updateList: yup.array().of(objectIdSchema),
});

module.exports = reqParamsSchema;
