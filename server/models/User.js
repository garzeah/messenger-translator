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
	// Lets users sign in on multiple devices w/ invalidating other tokens
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
});

// Generating an auth token for our user
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, "myToken");

	// Concatenating and saving it to our document
	user.tokens = user.tokens.concat({ token: token });
	await user.save();

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

userSchema.plugin(uniqueValidator);

const User = mongoose.model("users", userSchema);
module.exports = User;
