var passport = require('passport')
var User = require ('../models/user')
var config = require('../config')
var JwtStrategy = require('passport-jwt').Strategy //means to authenticate users
var ExtractJwt = require('passport-jwt').ExtractJwt
var LocalStrategy = require('passport-local')

var localOptions = {usernameField : 'email'}
var localLogin = new LocalStrategy(localOptions, function (email, password, done){
	User.findOne({email: email}, function(err, user){
		console.log("Searching for user with email: " + email)
		if(err){
			console.log("There was an error")
			return done(err)
		}
		if(!user) {  //if there is no user with that email
			return (done(null, false))
		}

		user.comparePassword(password, function(err, isMatch){
			console.log("Comparing Password")
			if(err) { 
				return done(err)
			}
			if(!isMatch) {
				console.log("There Was No Match")
				return done(null, false)
			}
			console.log("Found A Match!")
			return done(null, user)

		})
	})
})

var jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'), //The authorization header holds the token. (See postman setup)
	secretOrKey: config.secret //(the secret comes from the config file which you set yourself)
}

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){ //the payload holds the user model, and contains the Id and stuff. 
	User.findById(payload.sub, function(err, user){ //the user parameter is fot the user that was found with this Id
		if(err){
			return done(err, false)
		}
		if(user) {
			console.log("We found a user")
			done(null, user)
		} else {
			console.log("no error simply no user")
			done(null, false)
		}
	})
})

passport.use(localLogin)
passport.use(jwtLogin); //This tells the passport to user jwtLogin in order do the authorization stuffs.