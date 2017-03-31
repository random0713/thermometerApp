//module dependencies
var express = require('express');
var expressValidator = require('express-validator');
var mongo = require('mongodb').MongoClient;
var router = express.Router();
var passport = require('../config/passport');
var LocalStrategy = require('passport-local').Strategy;
var url = 'mongodb://localhost:27017/loginapp';


var User = require('../models/user');

//method to check if a username is not already taken while signing up
router.use(expressValidator({
    customValidators: {
      isUsernameAvailable(username) {
        return new Promise((resolve, reject) => {
          User.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if(user == null) {
              resolve();
            } else {
              reject();
            }
          });
        });
      }
    }
  })
);

//render the 'register' template
router.get('/register',function(request, response) {
	response.render('register');
});

//render the 'login' page
router.get('/login',function(request, response) {
	response.render('login');
});

//logout
router.get('/logout', function(request, response) { 
	request.logout();
	request.flash('success_msg', 'Sie sind jetzt abgemeldet');
	response.redirect('/users/login');
});
	
//gives the list of all users(admin functionnality)
router.get('/profile',function(request, response) {
	User.find({}).exec(function(error, users) {
		if (error) throw error;
		response.render('profile', {"users": users});
	});
});

//login
router.post('/login',
	//localDatabase
	passport.authenticate('local', {successRedirect: '/', 
									failureRedirect: '/users/login',
									failureFlash: true}), 
	function(request, response) {
		response.redirect('/');
	});

//signup post	
router.post('/register', function(request, response) {

				var name = request.body.name;
				var firstname = request.body.firstname;
				var username = request.body.username;
				var email = request.body.email;
				var password = request.body.password;
				var passwordConfirm = request.body.passwordConfirm;
				
				
				//Validation
				request.checkBody('name', 'Sie muessen Ihren Name eingeben').notEmpty();
				request.checkBody('firstname', 'Sie muessen Ihren Vorname eingeben').notEmpty();
				request.checkBody('email', 'Sie  muessen eine E-Mail Adresse eingeben').notEmpty();
				request.checkBody('email', 'Email ist nicht gültig').isEmail();
				request.checkBody('username','Sie muessen einen Betnuzername eingeben').notEmpty();
				request.checkBody('username', "Benutzername ist schon von jemanden verwendet").isUsernameAvailable();
				request.checkBody('password', 'Sie muessen ein Passwort geben').notEmpty();
				request.checkBody('password', 'Das Passwort ist zu kurz. Geben Sie bitte mindestens 6 Zeichen').isLength({min: 6});
				request.checkBody('passwordConfirm', 'Die Passworten stimmen nicht mit überein').equals(request.body.password);
				
				
				request.asyncValidationErrors().then(() => {
					//no errors, create user
					var newUser = new User({
						name: name,
						firstname: firstname,
						email: email,
						username: username,
						password: password,
						roles: 'authenticated'
					});
		
					User.createUser(newUser, function(error, user) {
						if(error) throw error;
						console.log(user);
					});
			
					request.flash('success_msg', 'Sie sind jetzt registriert und können sich anmelden');
					response.redirect('/users/login');}).catch((errors) => {
					if (errors) {
					
						response.render('register', {
						errors: errors
					});
					}; 
				});
});



//allows admin to give a user the role of an administrator
router.post('/profile', function(request, response) {
	var username = request.body.username;
	
	mongo.connect(url, function(error, db){
		if (error) throw error;
		//collection in database
		try{
		db.collection('users').updateOne({"username": username}, {$set: {"roles": ["admin"]}}, function(error, result)  {
			if (error) throw error;
			console.log('admin updated');
			db.close();
			response.redirect('/users/profile');
		});
		} catch (e) {
			console.log(e);
		}
	});
});

module.exports = router;
