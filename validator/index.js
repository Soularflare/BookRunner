exports.userSignupValidator = (req,res, next) => {
	req.check('name', 'Name required').notEmpty();
	req.check('email', 'email required')
		.matches(/.+\@.+\..+/)
		.withMessage('Email must contain @')
		.isLength({
			min: 4,
			max: 32
		});
		req.check('password', 'Password required').notEmpty();
		req.check('password')
		.isLength({min: 6})
		.withMessage('Password must have at least 6 characters')
		.matches(/\d/)
		.withMessage('Password must have a number');
		const errors = req.validationErrors();
		if(errors) {
			const firstError = errors.map(error => error.msg)[0];
			return res.status(400).json({ error: firstError });
		}
		next();

};