const mongoose = require('mongoose');
// const validator = require('validator');

const model = mongoose.model('Hotel', {
type: {
    type: String,
},
name: {
    type: String,
},
region: {
    type: String,
},
stars: {
    type: Number,
},
rooms: [{
    name : {
        type: String
    },
    accomodation : [{
        type: String
    }],
    price: {
        adult: {
            type: Number
        },
        children : {
            type: Number
        }
    }
}],
description: {
    text:  {
        type: String
    },
    fotos: [
        {type: String}
    ]
}
});

module.exports = model;