var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var locationSchema = Schema({
	name:String,
	division:String,
	isSpecial:{type:Boolean,default:false}
});

var Location = mongoose.model('Location',locationSchema);
module.exports = Location;