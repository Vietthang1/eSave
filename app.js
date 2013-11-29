var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var admin = require('./routes/admin');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var com = require('./server/communication.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/eSave');

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs',engine);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride(	));
app.use(express.cookieParser('your secret here'));
app.use(express.session({ cookie: { maxAge: 3600000 }}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/*',function(req,res,next){
	app.locals.session = req.session;
	next();
});

app.get('/admin/*',function(req,res,next){
	app.locals.adminNav = req.url.replace('/admin/','');
	next();
});

app.locals.isActive = function(text){
	if(app.locals.adminNav==text){
		return 'active';
	}
	return '';
}

// Route
app.get('/', routes.index);
app.get('/login',  user.login);
app.post('/login', user.doLogin);
app.get('/logout', user.logout);


app.get('/admin/scheduling', admin.scheduling);
app.get('/admin/user', admin.user);

// device
app.get('/admin/devices', admin.devices);
app.get('/admin/deleteDevice/:id', admin.deleteDevice);
app.get('/admin/editDevice/:id', admin.editDevice);
app.get('/admin/addDevice', admin.editDevice);
app.post('/admin/editDevice', admin.doEditDevice);
app.post('/getDevices', routes.getDevices)
app.post('/cmd', com.command);

//Location
app.get('/admin/locations', admin.locations);
app.get('/admin/addLocation', admin.editLocation);
// app.get('/admin/editLocation/:name', admin.editLocations);
// app.get('/admin/deleteLocations/:name', admin.deleteLocations);
// app.get('/admin/editLocations', admin.doEditLocations);
// app.get('/getLocations', admin.locations);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
  // com.open(function() {
  // 	console.log('open successfully!');
  // });
});
