var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = Schema({
	username: { type: String, unique: true },
	password: String,
	fullName: String,
	role: [ { type: Schema.Types.ObjectId, ref:'Location' } ],
	isAdmin: Boolean
});

var User = mongoose.model('User',userSchema);
module.exports = User;