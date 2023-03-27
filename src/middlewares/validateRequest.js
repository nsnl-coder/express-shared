const validateRequest = (schema) => async (req, res, next) => {
  try {
    const { body, query, params } = await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false,
      },
    );
    req.body = body;
    req.query = query;
    req.params = params;
    return next();
  } catch (err) {
    let errors = err.errors;

    if (process.env.NODE_ENV === 'development') {
      errors = err;
    }

    return res.status(400).json({
      status: 'fail',
      message: 'Data validation failed',
      errors,
    });
  }
};

module.exports = validateRequest;
