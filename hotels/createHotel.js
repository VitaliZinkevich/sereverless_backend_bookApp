// const validator = require('validator');
// const UserModel = require('./model/User.js');
const HotelModel = require ('./model/Hotel')

let util = require('./utils');

module.exports.createHotel = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const hotel = new HotelModel({
    type: data.type,
    name: data.name,
    region: data.region,
    stars: data.stars,
    rooms: data.rooms,
    description:data.description
  });

  // if (user.validateSync()) {
  //   callback(null, util.createErrorResponse(400, 'Incorrect user data'));
  //   return;
  // }

  util.dbConnectAndExecute(util.mongoString, () => (
    hotel
      .save()
      .then(() => callback(null, {
        statusCode: 200,
        body: JSON.stringify({ id: hotel.id }),
      }))      
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

// module.exports.deleteUser = (event, context, callback) => {
//   if (!validator.isAlphanumeric(event.pathParameters.id)) {
//     callback(null, createErrorResponse(400, 'Incorrect id'));
//     return;
//   }

//   dbConnectAndExecute(mongoString, () => (
//     UserModel
//       .remove({ _id: event.pathParameters.id })
//       .then(() => callback(null, { statusCode: 200, body: JSON.stringify('Ok') }))
//       .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
//   ));
// };

// module.exports.updateUser = (event, context, callback) => {
//   const data = JSON.parse(event.body);
//   const id = event.pathParameters.id;

//   if (!validator.isAlphanumeric(id)) {
//     callback(null, createErrorResponse(400, 'Incorrect id'));
//     return;
//   }

//   const user = new UserModel({
//     _id: id,
//     name: data.name,
//     firstname: data.firstname,
//     birth: data.birth,
//     city: data.city,
//     ip: event.requestContext.identity.sourceIp,
//   });

//   if (user.validateSync()) {
//     callback(null, createErrorResponse(400, 'Incorrect parameter'));
//     return;
//   }

//   dbConnectAndExecute(mongoString, () => (
//     UserModel.findByIdAndUpdate(id, user)
//       .then(() => callback(null, { statusCode: 200, body: JSON.stringify('Ok') }))
//       .catch(err => callback(err, createErrorResponse(err.statusCode, err.message)))
//   ));
// };
