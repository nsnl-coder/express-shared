const yup = require('yup');
const objectId = require('./objectId');

const reqParams = yup.object({
  id: objectId,
});

module.exports = reqParams;
