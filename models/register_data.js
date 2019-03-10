const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

mongoose.set('useCreateIndex', true);

//Create Registration Schema and model
const RegSchema = new Schema({
    name:{
        type: String,
        lowercase: true,
        unique: true,
        required:[true, "can't be blank"],
        match: [/^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$/, 'is invalid'],
        index: true},
    Email:{
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true},
    password:{
        type: String,
        required: true },
});

RegSchema.pre('save',function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
RegSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('RegisterData', RegSchema);
