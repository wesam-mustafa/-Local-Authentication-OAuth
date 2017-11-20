var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var configAuth = require('../config/auth');
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function (req, res, next) {
  res.render('register', {
    'title': 'Register'
  });
});
router.get('/login', function (req, res, next) {
  res.render('login', {
    'title': 'login'
  });
});
router.post('/register', function (req, res, next) {
  //Get the Form Values
  console.log(req.body.name);
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Form Validation 
  req.checkBody('name', 'name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not Vaild').isEmail();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //Check for errors
  var errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,

    });

    //Create User
    User.createUser(newUser, function (err, user) {
      if (err) throw err;
      console.log(user);
    });
    //Success Message
    req.flash('Success', 'You now registered and may log in');
    res.location('/');
    res.redirect('/');
  }

});
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

//Facebook Authentication
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: configAuth.facebookAuth.profileFields
  },
  function (token, refreshToken, profile, done) {
    console.log(profile);
    process.nextTick(function () {
      User.findOne({
        'facebook.id': profile.id
      }, function (err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.email = profile.emails[0].value;
          // save our user to the database
          newUser.save(function (err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }
));

//Twitter Authentication
passport.use(new TwitterStrategy({

    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL
  },
  function (token, tokenSecret, profile, done) {
    console.log(profile);
    process.nextTick(function () {
      User.findOne({
        'twitter.id': profile.id
      }, function (err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.twitter.id          = profile.id;
          newUser.twitter.token       = token;
          newUser.twitter.username    = profile.username;
          newUser.twitter.displayName = profile.displayName;
          // save our user to the database
          newUser.save(function (err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }
));

//Local Authentication 
passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user) {
      console.log('Unknown User');
      return done(null, false, {
        message: 'Unknown User'
      })
    }
    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        console.log('Invalid Password');
        return done(null, false, {
          message: 'Invalid Password'
        });
      }
    });
  });
}));
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: 'Invalid username or password'
}), function (req, res) {
  console.log('Authentication Successful');
  req.flash('success', 'you are logged in');
  res.redirect('/');
});
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
});
module.exports = router;