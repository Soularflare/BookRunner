const User = require('../models/user');
const jwt = require('jsonwebtoken'); 		//generates signed tokens
const expressJwt = require('express-jwt');	//checks authorization
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.signup = (req,res) => {
	const user = new User(req.body);
	user.save((err, user) => {		//either creates a new user or throws an error of 400
		if(err) {
			return res.status(400).json({
				err: errorHandler(err)
			});
		}
		user.salt = undefined;
		user.password_hash = undefined;
		res.json({
			user
		});
	});
};




exports.signin = (req, res) => {
	//find user through email
	const {email, password} = req.body;
	User.findOne({email}, (err, user) => {
		if(err || !user) {
			return res.status(400).json({
				err: 'User does not exist.'
			});
		}

		//match password and email to user
		if(!user.authenticate(password)) {
			return res.status(401).json({
				error: 'Email/Password does not match'
			})
		}

		const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
		res.cookie('t', token, {expire: new Date() + 9999});
		const {_id, name, email, role} = user;
		return res.json({token, user: {_id, email, name, role}});
	});
};





exports.signout = (req, res) => {
	res.clearCookie('t');
	res.json({ message: "You have been signed out"});
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if(!user) {
		return res.status(403).json({
			error: 'Acess denied'
		})
	}
	next();
};


exports.isAdmin = (req, res, next) => {
	if(req.profile.role === 0) {
		return res.status(403).json({
			error: 'Admin access required'
			});
		}
		next();
};