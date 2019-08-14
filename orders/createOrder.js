const OrderModel = require ('./model/Order')
let util = require('./utils');

module.exports.createOrder = (event, context, callback) => {
  
  //USER IDENTITY START < ================
  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  // cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx:CognitoSignIn:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const parts = authProvider.split(':');
  const userPoolUserId = parts[parts.length - 1];
  //USER IDENTITY END < ================
  
  const data = JSON.parse(event.body);
  
  const order = new OrderModel({
   ...data.order
  });

  order.userId = userPoolUserId;

  util.dbConnectAndExecute(util.mongoString, () => (
    order
      .save()
      .then(() => callback(null, {
        statusCode: 200,
        body: JSON.stringify({ id: order.id }),
        headers: {  
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true }
      }))      
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};