const yup = require('yup');

/**
 * reqQuerySchema is yup schema for req.query
 */
const reqQuerySchema = yup
  .object({
    fields: yup
      .string()
      .transform((value) => value.replaceAll(',', ' '))
      .max(100),
    page: yup.number().min(1).max(200),
    itemsPerPage: yup.number().min(1).max(200),
    skip: yup.number().min(1).max(200),
    limit: yup.number().min(1).max(200),
    sort: yup
      .string()
      .transform((value) => value.replaceAll(',', ' '))
      .max(100),
  })
  .transform((value) => {
    let { fields, page, itemsPerPage, sort, skip, limit, ...filter } = value;

    filter = handleQueryList(filter);
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
      skip,
      limit,
      filter: JSON.parse(filterStr),
    };
  });

function handleQueryList(filter) {
  const keys = Object.keys(filter);

  keys.forEach((key) => {
    if (typeof filter[key] === 'string' && filter[key].includes(',')) {
      filter[key] = { $in: filter[key].split(',') };
    }
  });

  return filter;
}

module.exports = reqQuerySchema;
