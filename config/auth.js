module.exports = {

    'facebookAuth': {
        'clientID': '187656285122089',// App ID
        'clientSecret': '605cc054e24a7fe2f36aa1719fceb7a7', // App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',        
        'profileFields' : ['id', 'emails', 'name'], // For requesting permissions from Facebook API
        'passReqToCallback' : true
    }
    ,
    'twitterAuth' : {
        'consumerKey'       : 'gpbpvdTCtK5vvp99bU4gUbklu',
        'consumerSecret'    : 'YSgmPGZyKUSN1uJ5KemS0s530pSDbYEBr23pd5FeaXnMmbtrky',
        'callbackURL'       : 'http://127.0.0.1:3000/auth/twitter/callback'
    }
}