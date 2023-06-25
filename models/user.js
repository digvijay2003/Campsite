const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const passportLocalmongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email :{
        type:String,
        required:true,
        unique:true
    }
});

UserSchema.plugin(passportLocalmongoose);

module.exports = mongoose.model('User', UserSchema);