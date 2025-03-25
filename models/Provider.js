const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
        name:{
                type: String,
                required: [true, 'Please add a name']
        },
        address: {
                type: String,
                required: [true, 'Please add an address']
        },
        telephoneNumber:{
                type: String,
                required: [true,'Please add a telephone number'],
                unique: true,
                match: [/^(08|09|06)\d{8}$/, 'Please enter a valid telephone number']
        },
});

module.exports=mongoose.model('Provider',ProviderSchema);