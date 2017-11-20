var express = require('express');
var router = express.Router();
var passport = require('passport');


// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

// handle the callback after facebook has authenticated the user
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/users/login'
    }));

// =====================================
// TWITTER ROUTES ======================
// =====================================
// route for twitter authentication and login
router.get('/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
router.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/users/login'
    }));

module.exports = router;