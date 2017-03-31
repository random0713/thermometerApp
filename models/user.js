'use strict';

//module dependencies
//database
var mongoose = require('mongoose');

//to hash passwords
var bcrypt = require('bcryptjs');

//User Schema

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},

	password: {
		type: String
	},
	email: {
		type: String
		
	},
	name: {
		type: String
	},
	firstname: {
		type: String
	},
	roles: [{
		type: String

		}]
	});


var User = module.exports = mongoose.model('User', UserSchema);

//Methods to use in users.js
module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(error, salt) {
		bcrypt.hash(newUser.password, salt, function(error, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.getUserByUserName = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}
/* Not yet added
module.exports.getUserByEmail = function(email, callback) {
	var query = {email: email};
	User.findOne(query, callback);
}*/
module.exports.comparePassword = function(aPassword, hash, callback) {
	bcrypt.compare(aPassword, hash, function(error, isMatch) {
		if(error) throw error;
		callback(null, isMatch);
	});
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

