// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please inlcude all fields.');
	}

	res.send('Register route');
};

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = (req, res) => {
	res.send('Login route');
};

module.exports = {
	registerUser,
	loginUser
};
