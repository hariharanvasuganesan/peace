const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const Volunteer = require('../models/Volunteer')

const { forwardAuthenticated } = require('../config/auth');

//Login Page
router.get('/login', forwardAuthenticated, (req,res) => res.render("login"));

//Register Page
router.get('/register', forwardAuthenticated, (req,res) => res.render("register"));



// Register
router.post('/register', (req, res) => {
  const { name, phone, email, governmentIdName, governmentIdNo, password, password2 } = req.body;
  let errors = [];

  if (!name || !phone || !email || !governmentIdName || !governmentIdNo|| !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (phone.length < 10 || phone.length >= 11) {
    errors.push({ msg: 'Please enter a valid mobile number' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

 
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      phone,
      email,
      governmentIdName,
      governmentIdNo,
      password,
      password2
    });
  }  else {
    User.findOne({ phone: phone }).then(user => {
      if (user) {
        errors.push({ msg: 'Mobile Number already exists' });
        res.render('register', {
          errors,
          name,
          phone,
          email,
          governmentIdName,
          governmentIdNo,
          password,
          password2
        });
      }else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          phone,
          email,
          governmentIdName,
          governmentIdNo,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          phone,
          email,
          governmentIdName,
          governmentIdNo,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
};
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
 
//Volunteer
router.get('/volunteer', (req,res) => res.render("volunteer"));

router.post('/volunteer', (req, res) => {
  const { name, phone, email, specialization } = req.body;
  let errors = [];

  if (!name || !phone || !email || !specialization) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (phone.length < 10 || phone.length >= 11) {
    errors.push({ msg: 'Please enter a valid mobile number' });
  }

  if (errors.length > 0) {
    res.render('volunteer', {
      errors,
      name,
      phone,
      email,
      specialization
    });
  }else {
    Volunteer.findOne({ phone: phone }).then(user => {
      if (user) {
        errors.push({ msg: 'Mobile number already exists' });
        res.render('volunteer', {
          errors,
          name,
          phone,
          email,
          specialization
        });
      } else {
    Volunteer.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('volunteer', {
          errors,
          name,
          phone,
          email,
          specialization
        });
      } else {
        const newVolunteer = new Volunteer({
          name,
          phone,
          email,
          specialization
        });
        newVolunteer
         .save()
         .then(user => {
          req.flash(
                'success_msg',
                'You are now registered and we will get back to you within 2-3 days'
            );
          res.redirect('/users/volunteer');
              })
          .catch(err => console.log(err));
      }
    });
  }
});
  };
});


module.exports = router;
