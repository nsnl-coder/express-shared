const yup = require('yup');

/**
 * reqQuerySchema is yup schema for req.query
 */
const reqQuerySchema = yup
  .object({
    fields: yup.string().transform((value) => value.replaceAll(',', ' ')),
    itemsPerPage: yup.number().min(1),
    page: yup.number().min(1),
    sort: yup.string().transform((value) => value.replaceAll(',', ' ')),
  })
  .transform((value) => {
    const { fields, itemsPerPage, page, sort, ...filter } = value;

    let filterStr = JSON.stringify(filter);
    filterStr = filterStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    return {
      fields,
      page,
      itemsPerPage,
      sort,
      filter,
    };
  });

module.exports = reqQuerySchema;
