var mongoose = require('mongoose')
var Schema = mongoose.Schema;  //Schema is the scaffolding for an object in the database
var bcrypt = require('bcrypt-nodejs')

var userSchema = new Schema({ //Creates a new instance of the variable Schema 
	email: { //Adds a new field called email
		type: String,  //Sets the type to string
		unique: true, //makes sure that nothing else in the DB can have the same email
		lowercase: true, //Sets all the characters to lowercase
	},
	password: String  //Creates field password of type striin g
});
 
userSchema.pre('save', function(next){ //
	console.log("Save Function called")
	var user = this
	console.log(user)
	bcrypt.genSalt(10, function(err, salt){  //generates salt results in a salt
		if(err) {
			return next(err);
			console.log("FAILURE")
		}
		bcrypt.hash(user.password, salt, null, function(err, hash){ //hashes based on salt and the user pasword and gives back a hashed password
			if(err){
				console.log("FAILUER SALTIN", salt)
				return next(err);
			}

			user.password = hash;
			console.log("New Password: " + user.password)
			next()
		})
	})
})

userSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){ //compares the entered password(candidate) to the user's password returns 
		if(err) {
			return callback(done)
		}
		callback(null, isMatch) //returns  the boolean 
	})
}

var model = mongoose.model('user', userSchema) // creates a variable called model that encapsulates the schema with a name in the db (based on the way mongoose wants it_)
module.exports = model; //exports it
