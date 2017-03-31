'use strict';

//module dependencies
var should = require('chai').should();
var expect = require('chai').expect;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/loginapp');

var User = require('../../models/user');

//global variables
var user, user2;

//tests
describe('Unit Test', function() {
	describe('Model User:', function() {
		before(function(done) {
			user = new User({
				name: 'name',
				firstname: 'firstname',
				email: 'atest@atest.com',
				username: 'user',
				password: 'password'
			});
			user2 = new User(user);
			
			done();
		});
		
		describe('Method Save', function() {
			it('should begin without the test user', function(done) {
				User.find({email: 'atest@atest.com'}, function(error, users) {
					users.should.have.length(0);
					done();
				});
			});
			
			it('should be able to save without problems', function(done) {
				user.save(done);
				
			});
			
			it('should fail to save an existing user again', function(done) {
				user.save();
				user2.save(function(error) {
					should.exist(error);
					done();
				});
			});
			
			it('should show any error when try to save without name', function(done) {
				user.name = '';
				user.save(function(error) {
					should.not.exist(error);
					done();
					
				});
			});
			
			it('should show any error when try to save without firstname', function(done) {
				user.firstname = '';
				user.save(function(error) {
					should.not.exist(error);
					done();
				});
			});
			
			it('should show any error when try to save without username',function(done) {
				user.username = '';
				user.save(function(error) {
					should.not.exist(error);
					done();
				});
			});
			
			it('should show any error when try to save without password',function(done) {
				user.password = '';
				user.save(function(error) {
					should.not.exist(error);
					done();
				});
			});
			
			it('should show any error when trying to save with a short (<6) password', function(done) {
				user.password = '123456';
				user.save(function(error) {
					expect(user.password).to.have.length.above(5);
					done();
				});
			});
		});
		
		after(function(done) {
			user.remove();
			done();
		});
	})
});