// const validator = require('validator');
// const UserModel = require('./model/User.js');
const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider();
const OrderModel = require ('./model/Order')

let util = require('./utils');

module.exports.createOrder = (event, context, callback) => {
  
  //USER IDENTITY START < ================


  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  // cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx:CognitoSignIn:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const parts = authProvider.split(':');
  const userPoolIdParts = parts[parts.length - 3].split('/');
  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  async function  getAttr (){
    try {
      const user = await cognito.adminGetUser({
        UserPoolId:userPoolId,
        Username: userPoolUserId
      }).promise()
      .then (res=>{
        console.log('then getGroup')
        console.log(res)
      })
      //console.log(user.UserAttributes)
    } catch (err) {
      console.log(err)
    }
  }

  async function  getGroup (){
    try {
      const group = await cognito.adminListGroupsForUser({
        UserPoolId:userPoolId,
        Username: userPoolUserId
      }).promise().then (res=>{
        console.log('then getGroup')
        console.log(res)
      })
      //console.log(JSON.stringify (group))
    } catch (err) {
      console.log(err)
    }
  }
  
  getAttr();
  getGroup();
  //USER IDENTITY END < ================
  
  const data = JSON.parse(event.body);
  
  const order = new OrderModel({
   ...data.order
  });

  order.userId = userPoolUserId;

  // if (user.validateSync()) {
  //   callback(null, util.createErrorResponse(400, 'Incorrect user data'));
  //   return;
  // }

  util.dbConnectAndExecute(util.mongoString, () => (
    order
      .save()
      .then(() => callback(null, {
        statusCode: 200,
        body: JSON.stringify({ id: order.id }),
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
