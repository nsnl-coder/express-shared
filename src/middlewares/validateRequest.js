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
    return res.status(400).json({
      status: 'fail',
      message: 'Data validation failed',
      errors: err.errors,
    });
  }
};

module.exports = validateRequest;
