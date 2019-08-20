'use strict';
const AWS = require("aws-sdk");

module.exports.messageRecieved = function(event, context, callback) {

  let {email , message} = JSON.parse (event.body);
  console.log(email , message);
  // ------------------------------- START SES ----------------------------
  //AWS.config.update({ region: "eu-west-1" });
  // console.log('Handling confirmation email to', event);
  
  // // if (!event.email.match(/^[^@]+@[^@]+$/)) {
  // //   console.log('Not sending: invalid email address', event);
  // //   context.done(null, "Failed");
  // //   return;
  // // }

  // // const name = event.name.substr(0, 40).replace(/[^\w\s]/g, '');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Ваше сообщение получено, мы ответим как можно скорее.</p>
      </body>
    </html>
  `;

  const textBody = `
    текст тела письма
  `;

  // Create sendEmail params
  const paramsContacter = {
    Destination: {
      ToAddresses: [`${email}`]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Сообщение сайта"
      }
    },
    Source: "vitalizinkevich@gmail.com"
  };
  const paramsAdmin = {
    Destination: {
      ToAddresses: [`vitalizinkevich@gmail.com`]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `Сообщение ${message} от  ${email}`
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Сообщение сайта"
      }
    },
    Source: "vitalizinkevich@gmail.com"
  };

  // Create the promise and SES service object
  const sendContacter = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(paramsContacter)
    .promise();

    const sendAdmin = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(paramsAdmin)
    .promise();

  Promise.all ([sendContacter, sendAdmin]).then (()=> callback(null, {
  statusCode: 200,
  body: JSON.stringify({message: 'Email was sent'}),
  headers: {  
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true },
  })).catch (err => console.log(err))
  // ------------------------------- END SES ----------------------------
};
