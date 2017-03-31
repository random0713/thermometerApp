'use strict';
//modules dependencies
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User =  require('../models/user');
var passport = require('passport');

//checks if a username is already taken
passport.use('local-get', new LocalStrategy(
    function(username, password, done) {
			User.getUserByUserName(username, function(error, user) {
				if (error) 
					return done(error);
				if (!user) {
					return done(null, false, {message: 'Unbekannter Benutzer'} );
				} 
					
				
			});
		}));

//LocalStrategy: Benutzername empfangen, und 'match' mit dem vom User 
//gegebenen Benutzername
//dasgleich mit Passwort
passport.use( new LocalStrategy(
	function(username, password, done) {
		User.getUserByUserName(username, function(error, user) {
			if (error) throw error;
			if(!user) {
				return done(null, false, {message: 'Unbekannter Benutzer'});
			}
			
			User.comparePassword(password, user.password, function(error, isMatch) {
				if (error) throw error;
				if(isMatch) {
					return  done(null, user);
				} else {
					return done(null, false, {message: 'Falsche Passwort'});
				}
			});
		});
	}));
	
//serialize user for session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

//deserialize user
passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(error, user) {
		done(error, user);
	});
});

module.exports = passport;