
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Address1: {
        type: String,
        required: true
    },
    Address2: {
        type: String
    },
    State: {
        type: String,
        required: true,
        trim: true
    },
    City: {
        type: String,
        required: true,
        trim: true
    },
    PhoneNumber: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    id: false,
    toJSON: {
        getters: true,
        virtuals: true
    },
    toObject: {
        getters: true,
        virtuals: true
    }
}, {
    collection: 'agency'
}
);

module.exports = schema;