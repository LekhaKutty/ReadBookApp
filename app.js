require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

//const auth = require('http-auth');
const routes = require('./routes/index');

const app =express();
app.use(express.static(__dirname + '/public'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));

app.use(bodyParser.urlencoded({extended: true}));
app.use('/',routes);
//mongoose.connect(config.database);
mongoose.connect(process.env.DATABASE,{useNewUrlParser: true});
mongoose.Promise = global.Promise;
mongoose.connection
    .on('connected',()=>{
        console.log(`Mongoose connection open on ${process.env.DATABASE}`)
    })
    .on('error',(err)=>{
        console.log(`Connection error: ${err.message}`);
    });

require('./models/register_data');



//listen for requests
app.listen(process.env.port || 3000,function(){
    console.log("listening port 3000");

});
