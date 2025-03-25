const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
        pickupdate: {
                type: Date,
                required: true
        },
        returndate: {
                type: Date,
                required: true
        },
        user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
        },
        car: {
                type: mongoose.Schema.ObjectId,
                ref: 'Car',
                required: true
        },
        atedAt: {
                type: Date,
                default: Date.now
        }
}, { versionKey: false });

module.exports = mongoose.model('Reservation', ReservationSchema);