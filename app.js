//module dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//database
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/loginapp');
var db = mongoose.connection;

//routes
var routes = require('./routes/index');
var users = require('./routes/users');

//init app
var app = express();

//handlebars helper used for the templates
var handlebars = require('handlebars');

//checks if user.roles = "admin" or user.roles = "authenticated"
handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

			if (lvalue == rvalue)
				return options.fn(this);
			else
				return options.inverse(this);
			});

//gives the list of all users (for admin)
handlebars.registerHelper('each', function(context, options) {
	var ret = "";
	
	for (var i = 0, j= context.length; i<j; i++) {
		ret = ret + options.fn(context[i]);
	}
	
	return ret;
});


app.engine('handlebars', exphbs({defaultLayout: 'main'}));


//view engines .handlebars as default layout
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'handlebars');

//bodyParser 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//css usw
app.use(express.static(path.join(__dirname, 'public')));

//express-session middleware
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

//Passport init session
app.use(passport.initialize());
app.use(passport.session());

//express-validator for body-parsing
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect-flash for flash messages
app.use(flash());

//global variable for flash
app.use(function(request, response, next) {
	response.locals.success_msg = request.flash('success_msg');
	response.locals.error_msg = request.flash('error_msg');
	response.locals.error = request.flash('error');
	response.locals.user = request.user || null;
	next();
});


//Define routes
app.use('/', routes);
app.use('/users', users);

//start app
var debug = require('debug')('my-application');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
	console.log('Server started on port' + app.get('port'));
});
