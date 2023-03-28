const objectId = require('./objectId');
const yup = require('yup');
const objectIdArray = yup.array().of(objectId);

module.exports = objectIdArray;
