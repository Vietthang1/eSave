var mongoose = require('mongoose');
var async = require('async');
mongoose.connect('mongodb://localhost/eSave');
var db = mongoose.connection;

var location = require('./models/location');
var device = require('./models/device');
var user = require('./models/user');

db.once('open', function callback () {
	//reset location
	async.series([
		function resetLocation(done){
			location.remove({},function(){
				console.log('locations removed');
				async.parallel([
					function(done){new location({name:'101',division:'Floor 1'}).save(done);},
					function(done){new location({name:'102',division:'Floor 1'}).save(done);},
					function(done){new location({name:'103',division:'Floor 1'}).save(done);},
					function(done){new location({name:'104',division:'Floor 1'}).save(done);},
					function(done){new location({name:'105',division:'Floor 1'}).save(done);},
					function(done){new location({name:'106',division:'Floor 1'}).save(done);},
					function(done){new location({name:'107',division:'Floor 1'}).save(done);},
					function(done){new location({name:'108',division:'Floor 1'}).save(done);},
					function(done){new location({name:'109',division:'Floor 1'}).save(done);},
					function(done){new location({name:'110',division:'Floor 1'}).save(done);},
					function(done){new location({name:'201',division:'Floor 2'}).save(done);},
					function(done){new location({name:'202',division:'Floor 2'}).save(done);},
					function(done){new location({name:'203',division:'Floor 2'}).save(done);},
					function(done){new location({name:'204',division:'Floor 2'}).save(done);},
					function(done){new location({name:'205',division:'Floor 2'}).save(done);},
					function(done){new location({name:'206',division:'Floor 2'}).save(done);},
					function(done){new location({name:'207',division:'Floor 2'}).save(done);},
					function(done){new location({name:'208',division:'Floor 2'}).save(done);},
					function(done){new location({name:'209',division:'Floor 2'}).save(done);},
					function(done){new location({name:'210',division:'Floor 2'}).save(done);},
					function(done){new location({name:'301',division:'Floor 3'}).save(done);},
					function(done){new location({name:'302',division:'Floor 3'}).save(done);},
					function(done){new location({name:'303',division:'Floor 3'}).save(done);},
					function(done){new location({name:'304',division:'Floor 3'}).save(done);},
					function(done){new location({name:'305',division:'Floor 3'}).save(done);},
					function(done){new location({name:'401',division:'Floor 4'}).save(done);},
					function(done){new location({name:'402',division:'Floor 4'}).save(done);},
					function(done){new location({name:'404',division:'Floor 4'}).save(done);},
					function(done){new location({name:'405',division:'Floor 4'}).save(done);},
					function(done){new location({name:'500',division:'Floor 5'}).save(done);},
					function(done){new location({name:'501',division:'Floor 5'}).save(done);},
					function(done){new location({name:'502',division:'Floor 5'}).save(done);}
				],function(){
					console.log('location reset ok!');
					done();
				});
			});
		},
		function resetDevice(done){
			device.remove({},function(){
				console.log('devices removed');
				location.find({},function(err,locations){
					var l = locations.length;
					var count = 0;
					for(var i = 0; i<l;i++){
						var random = Math.floor((Math.random()*2)); 
						new device({
							id:Number(locations[i].name),
							location:locations[i]._id,
							running:(random==0)?true:false
						}).save(function(err){
							count++;
							if(count>=l){
								console.log('devices reset ok');
								done();
							}
						});
					}
					
				});
			});
			
		},
		function resetUser(done){
			user.remove({},function(){
				console.log('users removed');
				count = 0;
				new user({
					username:'admin',
					password:'admin',
					fullName:'Nguyen Van A',
					isAdmin:true
				}).save(function(){
					count++;
					if(2==count){
						done();
					}
				});
				new user({
					username:'user',
					password:'user',
					fullName:'Tran Van B',
					isAdmin:false
				}).save(function(){
					count++
					if(2==count){
						done();
					}
				});
			});
		}
	],function(){
		console.log('everythings ok');
		process.exit(1);
	});
	
});
