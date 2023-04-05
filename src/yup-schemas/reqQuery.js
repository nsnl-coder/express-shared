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
    page: yup.number().integer().min(1).max(200),
    itemsPerPage: yup.number().integer().min(1).max(200),
    skip: yup.number().integer().min(1).max(200),
    limit: yup.number().integer().min(1).max(200),
    sort: yup
      .string()
      .transform((value) => value.replaceAll(',', ' '))
      .max(100),
  })
  .transform((value) => {
    let {
      fields,
      page,
      itemsPerPage,
      sort,
      skip,
      limit,
      searchBy,
      keyword,
      ...filter
    } = value;

    filter = handleQueryList(filter);
    let filterStr = JSON.stringify(filter);
    filterStr = filterStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    const filterObject = JSON.parse(filterStr);

    return {
      fields,
      page,
      itemsPerPage,
      sort,
      skip,
      limit,
      filter: {
        ...filterObject,
        ...handleSearch(searchBy, keyword),
      },
    };
  });

function handleSearch(searchBy, keyword) {
  if (!searchBy || !keyword) return {};
  if (typeof keyword !== 'string') return {};

  if (typeof searchBy === 'string' && !searchBy.includes(',')) {
    return {
      [searchBy]: {
        $regex: keyword,
        $options: 'i',
      },
    };
  }

  if (typeof searchBy === 'string' && searchBy.includes(',')) {
    searchBy = searchBy.split(',');
  }

  if (!Array.isArray(searchBy)) return {};

  const matchArr = searchBy.map((key) => {
    return {
      [key]: {
        $regex: keyword,
        $options: 'i',
      },
    };
  });

  return {
    $or: matchArr,
  };
}

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
