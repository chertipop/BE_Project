const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { types } = require('pg');

const UserSchema = new mongoose.Schema({
        name:{
                type: String,
                required: [true, 'Please add a name']
        },
        telephoneNumber:{
                type: String,
                required: [true,'Please add a telephone number'],
                unique: true,
                match: [/^(08|09|06)\d{8}$/, 'Please enter a valid telephone number']
        },
        email:{
                type: String,
                required: [true,'Please add an email'],
                unique: true,
                match: [
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        ,'Please add a valid email'     
                ]
        },
        role:{
                type: String,
                enum: ['user','admin'],
                default: 'user'
        },
        password:{
                type: String,
                required: [true, 'Please add a password'],
                minLength: 6,
                select: false
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        createdAt:{
                type: Date,
                default:Date.now
        }
}, { versionKey: false });

UserSchema.pre('save', async function(next){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.getSignedJwtToken = function(){
        return jwt.sign({id:this._id},process.env.JWT_SECRET,{
                expiresIn: process.env.JWT_EXPIRE
        });
}

UserSchema.methods.matchPassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);