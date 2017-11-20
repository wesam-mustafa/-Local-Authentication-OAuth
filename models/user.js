var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uri = 'mongodb://127.0.0.1/nodeauth';
mongoose.connect(uri, {
    useMongoClient: true
});
var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    facebook:{
        id:String,
        token: String,
        name : String,
        email: String
    },
    twitter: {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    }
});
var User = module.exports = mongoose.model('User', UserSchema);

    module.exports.comparePassword=function(candidatePassword,hash,callback){
        bcrypt.compare(candidatePassword,hash,function(err,isMatch){
            if (err) return callback(err);
            callback(null,isMatch);
        })
    }

    module.exports.getUserByUsername=function(username,callback){
        var query={username:username};
        User.findOne(query,callback);
    }
    module.exports.getUserById=function(id,callback){
        User.findById(id,callback);
    }
module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) throw err;
        //Set hashed password
        newUser.password = hash;
        //Create User
        console.log('...........')
        newUser.save(callback);
    });
}