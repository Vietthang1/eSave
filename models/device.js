var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var deviceSchema = Schema({
	id:{type:Number,unique:true},
	location:{type:Schema.Types.ObjectId,ref:'Location'},
	kind:{type:String,default:'aircon'},
	running:{type:Boolean,default:false},
	temp:{type:Number,default:26},
	modeFan:{type:String,default:'medium'},
	choiseMode:{type:String,default:'cool'}
});

var Device = mongoose.model('Device',deviceSchema);
module.exports = Device;