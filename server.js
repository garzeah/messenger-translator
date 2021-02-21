const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const keys = require("./config/keys");
require("dotenv").config();

// Routes
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const convoRouter = require("./routes/convoRoute");

// Connecting to remote Mongo database
mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});

// Initializing express
const app = express();

// Initializing Middlewares
app.use(express.json());
app.use(cookieParser());

// Initializing Routes
app.use(authRouter);
app.use(userRouter);
app.use(convoRouter);

// Makes sure Express behaves correctly in production environment
if (process.env.NODE_ENV === "production") {
	// Express will serve up production assets like main.js or main.css
	app.use(express.static("client/build"));

	// Express will serve up the index.html file if it doesn't recognize the route
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

// Starting our server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server has started on port ${PORT}`);
});
