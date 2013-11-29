var device = require('../models/device');
var location = require('../models/location');
var async = require('async');
var _ = require('underscore');

exports.devices = function(req,res) {
	device.find({}).populate({path:'location',select:'name division'}).exec(function(err,devices){
		if(!err){
			res.render('admin/devices',{devices:devices});
		}else{
			res.redirect('/error');
		}
	});
}

exports.locations = function(req,res) {
	location.find({}).exec(function(err,locations){
		if(!err){
			res.render('admin/locations',{locations:locations});
		}else{
			res.redirect('/error***');
		}
	});
}

exports.getDevices = function() {
	device.find({}).exec(function(err, dev) {
		if (!err) {
			console.log('total ' + dev.length);
			return dev;
		} else {			
			console.log('!Something wrong!\n' + err);
			return "[]";
		}
	});
}

exports.getLocations = function() {
	location.find({}).exec(function(err, loc) {
		if (!err) {
			console.log('total ' + loc.length);
			return loc;
		} else {			
			console.log('!Something wrong!\n' + err);
			return "[]";
		}
	});
}

exports.scheduling = function(req,res) {
	res.render('admin/scheduling');
}

exports.user = function(req,res) {
	res.render('admin/user');
}

exports.deleteDevice=function(req,res) {
	device.remove({_id:req.params.id},function(err) {
		if(!err) {
			exports.devices(req,res);
		} else {
			res.redirect('/error');
		}
	})
}

exports.editDevice=function(req,res) {
	location.find({},function(err,locations) {
		if(!err){
			if(req.params.id===undefined) {
				res.render('admin/editDevice',{device:{},locations:locations});
			}
			device.find({_id:req.params.id}).populate({path:'location',select:'name division'}).exec(function(err,devices){
				if(!err){
					res.render('admin/editDevice',{device:devices[0],locations:locations});
				}else{
					res.redirect('/error');
				}
			});
		}else{
			res.redirect('/error');
		}
	});
			
}

exports.editLocation=function(req,res) {
	res.render('admin/editLocation');
}
// exports.editLocation=function(req,res) {
// 	location.find({},function(err,locations) {
// 		if(!err){
// 			if(req.params.id===undefined) {
// 				res.render('admin/editLocation',{locations:locations});
// 			}
// 			device.find({_id:req.params.id}).populate({path:'location',select:'name division'}).exec(function(err,devices){
// 				if(!err){
// 					res.render('admin/editDevice',{device:devices[0],locations:locations});
// 				}else{
// 					res.redirect('/error');
// 				}
// 			});
// 		}else{
// 			res.redirect('/error');
// 		}
// 	});
			
// }



exports.doEditDevice = function(req,res) {
	if(req.body._id=='') {
		new device({id:req.body.id,location:req.body.location}).save(function(err,device){
			if(!err) {
				res.redirect('/admin/editDevice/'+device._id);
			} else {
				res.redirect('/error');
			}
		});
	}else{
		device.update({_id:req.body._id},{id:req.body.id,location:req.body.location},function(err){
			if(!err){
				res.redirect('/admin/editDevice/'+req.body._id);
			}else{
				res.redirect('/error');
			}
		});
	}		
}

exports.updateRunningState = function(id, state) {
	device.update({id : id}, {running: state}, function(err) {
		if (!err) {
			console.log('update ok!');
		} else {
			console.log('update running of ' + id + ' to ' + state + ' NOT OK!');
		}
	});
}

exports.updateTemp = function(id, temperature) {
	device.update({id : id}, {temp: temperature}, function(err) {
		if (!err) {
			console.log('update ok!');
		} else {
			console.log('update temp of ' + id + ' to ' + state + ' NOT OK!');
		}
	});	
}

exports.updateFanState = function(id, state) {

}