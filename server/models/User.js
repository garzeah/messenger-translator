const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(email) {
			if (!validator.isEmail(email)) throw new Error("Email is invalid");
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: 6
	},
	avatar: {
		type: Buffer
	}
});

// Strips sensitive information when returning user on every request
userSchema.methods.toJSON = function () {
	const userObject = this.toObject();

	// Removing unnecessary information for the user to have
	delete userObject.password;

	// REMOVE LATER
	delete userObject.avatar;

	return userObject;
};

// Generating an auth token for our user
userSchema.methods.generateAuthToken = async function () {
	const token = jwt.sign(
		{ _id: this._id.toString() },
		process.env.ACCESS_TOKEN_SECRET
	);

	return token;
};

// Checks to see if a user's email and password matches upon login
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) throw new Error("Incorrect information");
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error("Incorrect information");

	return user;
};

// Our middleware for hashing passwords
userSchema.pre("save", async function (next, err) {
	const user = this;

	if (user.isModified("password"))
		user.password = await bcrypt.hash(user.password, 8);

	next();
});

// Adds an error message if we try to save over a unique value
userSchema.plugin(uniqueValidator);

const User = mongoose.model("users", userSchema);
module.exports = User;
