const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const app = express();
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');
// Passport Config
require('./config/passport')(passport);

//Connect to Mongo
mongoose.connect('mongodb://localhost/peace', { useNewUrlParser: true ,useUnifiedTopology: true })
   .then(() => console.log('Mongodb Connected...'))
   .catch(err => console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/css', express.static('css')); 
app.use('/img', express.static('img')); 
app.use('/js', express.static('js')); 

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


//html 
app.get('/', function(req,res){ 
    res.sendFile('index.html', {root: path.join(__dirname, '/')})});

app.get('/dashboard', ensureAuthenticated, function(req,res){ 
    res.sendFile('dash.html', {root: path.join(__dirname, '/')})});

// Express body parser
app.use(express.urlencoded({ extended: true }));


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Routes 

app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
