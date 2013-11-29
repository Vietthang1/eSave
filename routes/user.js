var user = require('../models/user');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
  res.render('user/login');
};

exports.doLogin = function(req,res){
	user.find({username:req.body.username,password:req.body.password},function(err,users){
		if(!err){
			if(users.length>=1){
				req.session.user=users[0];
				res.redirect('/');
			}else{
				res.redirect('/login');
			}
		}else{
			res.redirect('/error');
		}
	});
}

exports.logout = function(req,res){
	req.session.destroy();
	res.redirect('/login');
}

exports.profile = function(req,res){
	res.render('user/profile');
}