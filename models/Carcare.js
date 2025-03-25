const mongoose = require('mongoose');

const CarcareSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:true,
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref:"Car",
    },
    service: {
        type: String,
        required: true,
        enum: ["Oil Change", "Tire Rotation", "Gear Checkup", "Break Inspection", "Battery Replacement"],
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["Scheduled", "Completed", "Canceled"],
        defaule: "Scheduled",
    },
    createdAt: {
        type: Date,
        defaule: Date.now,
    },
});

module.exports = mongoose.model("Carcare", CarcareSchema);