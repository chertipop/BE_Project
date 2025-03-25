const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
        brand: {
                type: String,
                required: [true, 'Please add a brand'],
                maxLength:[50,'Name can not be more than 50 characters']
        },
        seat: {
                type: String,
                required: [true, 'Please add a seat']
        },
        gearType: {
                type: String,
                enum: ['automatic','manual'],
                default: 'automatic'
        },
        price :{
                type: String,
                required: [true, 'Please add a price']
        },
        pickupaddress: {
                type: String,
                required: [true,'Please add a pickup']
        },
        picture: {
                type: String,
                required: [true,'Please add a picture']
        }
},{
        toJSON: {virtuals:true},
        toObject: {virtuals:true}
}, { versionKey: false });

CarSchema.virtual('reservations',{
        ref: 'Reservation',
        localField: '_id',
        foreignField: 'car',
        justOne: false
});

module.exports=mongoose.model('Car',CarSchema);