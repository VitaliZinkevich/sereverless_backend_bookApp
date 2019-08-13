const mongoose = require('mongoose');
// const validator = require('validator');

const model = mongoose.model('Order', {
userId: { // cognito identity pool id
    type: String,
},
adults: {
    type: Number,
},
children: {
    type: Number,
},
contactAdress: {
    type: String,
},
contactTel: {
    type: String,
},
date: {
    type: String,
},
hotel: {
    type: String,
},
night: {
    type: Number,
},
number: {
    type: Number,
},
dateOfCreation: {
    type: Date,
},
orderCreatorEmail: {
    type: String,
},
paymentPart: {
    type: Number,
},
price: {
    type: Number,
},
room: {
    type: String,
},
statusConfirmed: {
    type: Number,
},
statusPayment: {
    type: Number,
},
touristsData: [{
    firstName : {
        type: String
    },
    lastName : {
        type: String
    },
    passNumber : {
        type: String
    },
    passSeries : {
        type: String
    },
    passValidTill : {
        type: String
    },
}]

});

module.exports = model;