var Auth = require('./controllers/auth') //include the authorization controller
//var User = require('./models/user') //include the User model //We are no longer using this because we are having the passport do it for me. 
var passportService = require('./services/passport');
var passport = require('passport');
console.log("Router being read")
var requireAuth = passport.authenticate('jwt', {session: false})//Have the passport use jwt to authenticate the WITHOUT COOKIES
var requireSignin = passport.authenticate('local', {session: false}) //THis is the local signin that is requried for the /signin route below
module.exports = function(app){ //sets routes
	console.log("Exports?")
	app.get('/',  function(req, res){ //Adding the requireAuth means that we need a token in order for shit to work. 
		res.send("index.html")
	}) 
	app.post('/signup', Auth.signup)
	app.post('/signin',requireSignin, Auth.signin) //the Require signin is jwt thing. 

}