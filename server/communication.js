var portAddress = '/dev/pts/2';
var admin = require('../routes/admin'); // refractor later
var baudrate = 57600;
var timingOut = 3000; // 50 ms
var timingCheck = 120000; // 2 minutes
var repeater = false;
var async = require('async');
//var SerialPort = require('serialport').SerialPort;
var opened = false;
var port;

var lastRequest = new Object();
var jobQueue = [];

// exports.open = function() {
// 	console.log('going to open port');	
// 	port = new SerialPort(portAddress, 
// 		{	
// 			baudrate: baudrate, 
// 			parser: require('serialport').parsers.readline("\n") 
// 		}
// 	);
// 	openPort(function() {		
// 		console.log('open port ' + portAddress + " sucessfully");
// 		setInterval(run, timingOut);
// 		setInterval(checkStateDevice, 20000);
// 		console.log('after run declared!');
// 	});
// };

exports.command = function(req, res) {					
	addQuery(req.body.id, req.body.command);
	res.send('processing!');
};

function addQuery(id, command) {
	var job = new Object();
	job.id = id;
	job.command = command;
	console.log('add ' + job.id + ' ' + job.command);
	jobQueue.push(job);
}

function run() {	
	if (jobQueue.length > 0) {		
		lastRequest = jobQueue.shift();
		console.log(jobQueue.length + " " + lastRequest.id + ' ' + lastRequest.command);		
		var cmd = new String();
		encodeCommand(lastRequest.id, lastRequest.command, cmd);				
		send(cmd);		
	} else {
		lastRequest.id = -1;
	}
}

function checkStateDevice() {
	var devices;
	async.series([
			function(done) {
				//devices = admin.getDevices();				
				done();
			},

			function(done) {
				//addQuery(103, 'read_power_on_off');						
				addQuery(103, 'read_temp');				
				//console.log(JSON.stringify(devices));
				// console.log(devices);
				// for (var i = 0; i < devices.length; ++i) {
				// 	var id = devices[i].id;

				// 	addQuery(id, 'read_power_on_off');		
				// 	addQuery(id, 'read_temp');
				// }			
				done();
			}
		]);
	
}

function encodeCommand(id, command, encodedCommand) {	
	var commandCode;
	switch (command) {
		case 'power_on'				: commandCode = 'A'; break;
		case 'power_off'			: commandCode = 'B'; break;
		case 'on_fan' 				: commandCode = 'C'; break;
		case 'off_fan'				: commandCode = 'D'; break;
		case 'mode_fan'				: commandCode = 'E'; break;
		case 'increase_temp'		: commandCode = 'F'; break;
		case 'decrease_temp'		: commandCode = 'G'; break;
		case 'choise_mode'			: commandCode = 'H'; break;
		case 'read_power_on_off' 	: commandCode = 'I'; break;
		case 'read_fan_on_off'		: commandCode = 'K'; break;
		case 'read_temp'			: commandCode = 'L'; break; 
		default						: commandCode = 'X'; break;
	}

	encodedCommand = 'd' + (repeater == true ? 'R' : 'D') + id + commandCode + '\n'; // aicon, with repeater!
}

function send(data) {
	if (opened) {		
		port.write(data);
	} else {
		console.log('Serial port is not opened yet! Will try to open!');
		async.series([
			function(done) {	
				openPort(function() {
					console.log('open port ok!');
					done();
				});
			} 
			, function(done) { 
				port.write(data); 				
				done(); 
			}
		]);
	}	
}

function openPort(callback) {
	port.on('open', function() {				
		callback();
		opened = true;
		port.on('data', function(data) { // when receive data
			var curTime = new Date().getTime();						
			var str = new String(data);
			var command = lastRequest.command;
			console.log(lastRequest.id + ' ' + lastRequest.command);
			if (lastRequest.id > 0) {
				console.log('Received: ' + str);			
				str = str.substr(1).trim();
				console.log('Alterred: ' + str + '\n');			

				if (str == 'OK') {								
					switch (command) {
						case 'power_on'				: admin.updateRunningState(lastRequest.id, true);	 break;
						case 'power_off'			: admin.updateRunningState(lastRequest.id, false); 	 break;
						case 'on_fan' 				: break;
						case 'off_fan'				: break;
						case 'mode_fan'				: break;
						case 'increase_temp'		: break;
						case 'decrease_temp'		: break;
						case 'choise_mode'			: break;				
						default: console.log('Unknown command!'); break;
					}

				} else if (str == 'NOTOK') {				
					console.log('Control ' + lastRequest.command + ' not ok!');

				} else if (str == 'ON' || str == 'OFF') {
					switch(command) {
						case 'read_power_on_off' 	: admin.updateRunningState(lastRequest.id, str == 'ON' ? true : false); break;
						case 'read_fan_on_off'		: admin.updateFan(lastRequest.id, str == 'ON' ? true : false); break;
						default: console.log('Unknown command!'); break;
					}

					console.log('check status ' + lastRequest.command + ' ' + str);			

				} else if (str[0] == 'T') {				
					var t = str.substr(2, str.length - 2).valueOf();
					console.log("get temperature = " + t);
					if (command == 'read_temp') {
						admin.updateTemp(lastRequest.id, t);
					}
				} else {
					console.log("UNKOWN!");
				}
			} else {
				console.log('TOO LATE');
			}
		});	
	});
};

function setRequest(id, command) {
	lastRequest.id = id;
	lastRequest.command = command;
	lastRequest.time = new Date().getTime();
}	
