const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		maxlength: 32
	},
	email: {
		type: String,
		trim: true,
		required: true,
		unique: 32
	},
	password_hash: {			//password taken in as string and saved as hash
		type: String,
		
		required: true
	},
	info: {						
		type: String,
		trim: true,
	},
	salt: String, 				//used for password encryption
	role: {
		type: Number,			//0 for normal user, 1 for admin
		default: 0
	},
	history: {					//history of past purchases
		type: Array,
		default: []
	}
}, {timestamps: true}
);


userSchema.virtual('password')
.set(function(password) {	
	this._password = password; 		//temp variable
	this.salt = uuidv1();
	this.password_hash = this.encryptPassword(password);
})
.get(function() {
	return this._password
})

userSchema.methods = {
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.password_hash;
	},

	
	encryptPassword: function(password) {
		if(!password) return '';
		try {
			return crypto.createHmac('sha1', this.salt)
					.update(password)
					.digest('hex');
		} catch (err) {
			return "";
		}
	}
};

module.exports = mongoose.model("User", userSchema);