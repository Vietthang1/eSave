var device = require('../models/device');
var location = require('../models/location');
var _ = require('underscore');

exports.index = function(req, res){
	if(req.session.user === undefined) {
		res.redirect('/login');
	} else {
		res.render('index', { title: 'eSave'});
	}
};

exports.getDevices = function(req,res){
	device.find({}).populate({path:'location',select:'name division'}).exec(function(err,devices){
		if(!err){
			res.json(devices);
		}else{
			res.redirect('/error');
		}
	});
	
}
