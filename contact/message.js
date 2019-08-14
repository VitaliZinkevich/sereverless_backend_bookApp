'use strict';
const AWS = require("aws-sdk");
var nodemailer = require('nodemailer');

module.exports.messageRecieved = function(event, context, callback) {

  let {email , message} = JSON.parse (event.body);
  console.log(email , message);

  // ------------------------------- START NODEMAILER -----------------------
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'vitalizinkevich@gmail.com',
           pass: 'kie#xaiB$u1quei'
       }
   });

   const mailOptionsToContacter = {
    // from: 'sender@email.com', // sender address
    to: email, // list of receivers
    subject: 'Ваше сообщение получено', // Subject line
    html: '<p>Ваше сообщение получено, ответ на него придет на указанною вами почту.</p>'// plain text body
  };

  const mailOptionsToAdmin = {
    // from: 'sender@email.com', // sender address
    to: 'vitalizinkevich@gmail.com', // list of receivers
    subject: 'Получено обращение с сайта', // Subject line
  html: `<p>Почта ${email} <br/>
            Сообщение ${message}</p>`// plain text body
  };


  let contacter = transporter.sendMail(mailOptionsToContacter, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });

 let admin = transporter.sendMail(mailOptionsToAdmin, function (err, info) {
  if(err)
    console.log(err)
  else
    console.log(info);
});

Promise.all ([admin, contacter]).then (()=> callback(null, {
  statusCode: 200,
  body: JSON.stringify({message: 'Email was sent'}),
  headers: {  
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true },
}))

 callback(null, {
  statusCode: 200,
  body: JSON.stringify({message: 'Email was sent'}),
  headers: {  
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true },
})

  // ------------------------------- END NODEMAILER -----------------------

  // ------------------------------- START SES ----------------------------
  //AWS.config.update({ region: "eu-west-1" });
  // console.log('Handling confirmation email to', event);
  
  // // if (!event.email.match(/^[^@]+@[^@]+$/)) {
  // //   console.log('Not sending: invalid email address', event);
  // //   context.done(null, "Failed");
  // //   return;
  // // }

  // // const name = event.name.substr(0, 40).replace(/[^\w\s]/g, '');

  // const htmlBody = `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //     </head>
  //     <body>
  //       <p>Hi Vitali,</p>
  //       <p>...</p>
  //     </body>
  //   </html>
  // `;

  // const textBody = `
  //   Hi name,
  //   ...
  // `;

  // // Create sendEmail params
  // const params = {
  //   Destination: {
  //     ToAddresses: ['vitalizinkevich@gmail.com']
  //   },
  //   Message: {
  //     Body: {
  //       Html: {
  //         Charset: "UTF-8",
  //         Data: htmlBody
  //       },
  //       Text: {
  //         Charset: "UTF-8",
  //         Data: textBody
  //       }
  //     },
  //     Subject: {
  //       Charset: "UTF-8",
  //       Data: "Thanks for registering with ACME!"
  //     }
  //   },
  //   Source: "vitalizinkevich@gmail.com"
  // };

  // // Create the promise and SES service object
  // const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
  //   .sendEmail(params)
  //   .promise();

  // // Handle promise's fulfilled/rejected states
  // sendPromise
  //   .then(data => {
  //     console.log(data.MessageId);
  //     context.done(null, "Success");
  //   })
  //   .catch(err => {
  //     console.error(err, err.stack);
  //     context.done(null, "Failed");
  //   });
    // ------------------------------- END SES ----------------------------
};
