const express = require('express');
const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator/check');
const router = express.Router();
router.use(bodyParser.urlencoded({extended:true}));
const RegisterData = require('../models/register_data');
const ReadBookData = require('../models/read_book_data');
const booksearch = require('google-books-search');

//Register form Get
router.get('/register', (req, res,next) => {
    const empty_array = [];
    res.render('regi', { title: 'Registration Form', 
                         errors: empty_array});
});
//Register form Post
router.post('/register',[
    body('name')
      .isLength({min:2})
      .withMessage('Please Enter a Name'),
    body('Email')
      .isEmail()
      .withMessage('Check Email'),
    body('password')
      .isLength({min:5})
      .withMessage('Password is weak!')
      .custom((value,{req})=>{
        if(value !== req.body.confirm_password){
            throw new Error('Passwords must match')
        }else{
            return value;
        }
    }),
    ],
    (req,res,next)=>{
        const errors = validationResult(req);
        var err = [];
        if(errors.isEmpty()){
            console.log(req.body);
            const newUser = new RegisterData(req.body);
            newUser.save()
              .then(()=>{res.redirect('/login');});
        }
        else{
            var manyerrors = errors.array();
            var i =0;
            manyerrors.forEach(error => {
                console.log(error.msg);
                err[i++] = error.msg;

            });
            console.log(err);
            res.render('regi', {
                title:'Registration form',err
            });
            }
        }
    );
//login form
router.get('/login',(req,res) => {
    const empty_arr = [];
    res.render('login',{title: 'Log In',errors:empty_arr});
});
router.post('/login',function(req,res) {
    var name = req.body.name;
    var password = req.body.password;

    RegisterData.findOne({name:name}, function(err,user){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!user){
            console.log(err);
            err = 'Incorrect username or password';
            return res.render('login', {err});
        }else{
            user.comparePassword(password, (err, ismatch) => {
                if(ismatch){
                    var id = name;
                    req.session.user = user;
                    return res.redirect('/MyBook/'+id);
                }
                else{
                    err = 'Incorrect username or password';
                    return res.render('login', {err});

                }
                
            }) 
        }
        

    })
});
//Read Book Store
router.get('/MyBook/:name',(req,res) => {
    const empty_arr = [];
    username = req.params.name;
    ReadBookData.find({user_name:username},function(err,user){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!user){
            return res.status(404).send();
        }else{
            res.render('BookData',{user,username});
                      
        }
    })
});
router.get('/MyBookSearch',(req,res)=>{
    var results = [];
    res.render('searchbook',{title:'Search Book',results});
});
router.post('/MyBookSearch',(req,res)=>{
    var searchbook = req.body.book_search;
    booksearch.search(searchbook, function(error, results) {
        if ( ! error ) {
            results.forEach(function(book){
                console.log(book.title);
                console.log(book.authors);
                console.log(book.description);
                console.log(book.averageRating);
                // console.log(book.language);
                console.log(book.link);
                //console.log(book.images);
                res.render('searchbook',{title:'Search Book',results});
            })
        } else {
            console.log(error);
        }
    });
       
});

router.post('/MyBook/:name',(req,res)=>{
     var id = req.params.name;
    const newBookData = new ReadBookData();
    newBookData.user_name = req.params.name;
    newBookData.book_name = req.body.book_name;
    newBookData.book_author = req.body.book_author;
    newBookData.book_rate = req.body.book_rate;
    newBookData.book_review = req.body.book_review;
    newBookData.save(function(err, AddedBook){
        if(err){
            console.log(err);
            return res.status(500).send;
        }
        return res.redirect('/MyBook/'+id);
    })
                           
});

module.exports = router;
