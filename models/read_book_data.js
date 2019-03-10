const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

//Create Registration Schema and model
const ReadBookSchema = new Schema({
    user_name:{
        type:String
    },
    book_name:{
        type: String,
        unique: true,
        required:[true, "can't be blank"],
        index: true},
    book_author:{
        type: String,
        unique: false,
        index:false
        },
    book_rate:{
        type:String
    },
    book_review:{
        type: String }
});

module.exports = mongoose.model('ReadBookData', ReadBookSchema);