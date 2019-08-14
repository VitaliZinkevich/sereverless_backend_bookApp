const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider();
const OrderModel = require ('./model/Order')

let util = require('./utils');

module.exports.getOrder = (event, context, callback) => {

    //USER IDENTITY START < ================


    const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    // cognito authentication provider looks like:
    // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx:CognitoSignIn:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const parts = authProvider.split(':');
    const userPoolIdParts = parts[parts.length - 3].split('/');
    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
    const userPoolUserId = parts[parts.length - 1];
  
    // async function  getAttr (){
    //   try {
    //     const user = await cognito.adminGetUser({
    //       UserPoolId:userPoolId,
    //       Username: userPoolUserId
    //     }).promise()
    //     .then (res=>{
    //       console.log('then getGroup')
    //       console.log(res)
    //     })
    //     //console.log(user.UserAttributes)
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }
  
    async function  getGroup (){
      try {
        const group = await cognito.adminListGroupsForUser({
          UserPoolId:userPoolId,
          Username: userPoolUserId
        }).promise()
        // console.log(JSON.stringify (group))
        // console.lo(JSON.stringify (group.Groups[0].GroupName));
        let findOpt = {};
        if (!!group.Groups.length && group.Groups[0].GroupName === 'admin'){
          // return all
        } else {
          findOpt.userId = userPoolUserId;
        }
        
        util.dbConnectAndExecute(util.mongoString, () => (
          OrderModel
            .find({...findOpt})
            .then(orders => callback(null, { statusCode: 200, body: JSON.stringify(orders),
              headers: {  
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true }, }))
            .catch(err => callback(null, util.createErrorResponse(err.statusCode, err.message)))
        ));        
        


      } catch (err) {
        console.log(err)
      }
    }
   
    // getAttr();
    getGroup();
    //USER IDENTITY END < ================

};