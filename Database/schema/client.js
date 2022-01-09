
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    AgencyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'agency'
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    PhoneNumber: {
        type: Number,
        required: true
    },
    TotalBill: {
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
    collection: 'client'
}
);

module.exports = schema;