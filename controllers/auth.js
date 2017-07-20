var User = require('../models/user');
var jwt = require('jwt-simple'); //Allows us to create a web token
// var config = require('../config');
var mongoose = require('mongoose')

mongoose.connect('mongodb://greenebj:50011055Bg@cluster0-shard-00-00-mzj5k.mongodb.net:27017,cluster0-shard-00-01-mzj5k.mongodb.net:27017,cluster0-shard-00-02-mzj5k.mongodb.net:27017/bucket?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
function createUserToken(user) {
	var timestamp = new Date().getTime()
	return jwt.encode({sub: user.id, iat: timestamp}, "config.secret")
}
function createUserToken(user){
	var timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next){
	//User has already had their email and pw auth;d
	//we just need to give them a token
	res.send({ token: createUserToken(req.user) });

}

exports.signup = function(req, res, next){

	console.log("entering signup cycle")
	//console.log(req)
	var email = req.body.email;
	var password = req.body.password;

	if( !email || !password){
		console.log("Either no email, or no password")
		return res.status(418).send({error: 'You must provide email and pw.'});
	}

	console.log(User)

	User.findOne({ email: email }, function(err, existingUser){
		console.log("Searching for a user with the same email")
		if(err) {
			return next(err); 
		}
		if(existingUser){
			return res.status(418).send("Email is in use");
		}

		var user = new User({
			email: email,
			password: password  
		});

		user.save(function(err){
			if(err) { return next(err); }
			res.json({token: createUserToken(user)}); //upon creating a user, the user is given a token 
		});
	});
}

exports.signin = function(req, res, next){
	//This is after the Require signin thing. This just gives a token for the session
	res.send({token: createUserToken(req.user)})
	console.log("crack")
}