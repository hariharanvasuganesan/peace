const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const app = express();

// Passport Config
require('./config/passport')(passport);

//DB Config
//const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect('mongodb://localhost/hope', { useNewUrlParser: true ,useUnifiedTopology: true })
   .then(() => console.log('Mongodb Connected...'))
   .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/css', express.static('css')); // upload CSS file
app.use('/img', express.static('img')); // upload Images file
app.use('/js', express.static('js')); // upload javaScript file

app.get('/', function(req,res){ // upload HTML file in ejs
    res.sendFile('index.html', {root: path.join(__dirname, '/')})});

app.get('/dashboard', function(req,res){ // upload HTML file in ejs
    res.sendFile('dash.html', {root: path.join(__dirname, '/')})});

// Express body parser
app.use(express.urlencoded({ extended: true }));

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
