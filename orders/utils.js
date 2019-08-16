const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
mongoose.set('useFindAndModify', false);

module.exports.mongoString = 'mongodb+srv://furstUserDb:0E3x2C1tnAdnwVAD@firstclustermongo-glrqh.mongodb.net/test?retryWrites=true&w=majority'; // MongoDB Url

module.exports.createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: {  'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true},
  body: message || 'Incorrect id',
});

const dbExecute = (db, fn) => db.then(fn).finally(() => { mongoose.connection.close() });

module.exports.dbConnectAndExecute = function (dbUrl, fn) {
  return dbExecute(mongoose.connect(dbUrl, { useNewUrlParser: true }), fn);
}