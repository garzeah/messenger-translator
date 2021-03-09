const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const socketio = require("socket.io");
require("dotenv").config();

// Routes
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const convoRouter = require("./routes/convoRoute");

// Connecting to remote Mongo database
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});

// Initializing express and our socket.io server
const app = express();
// Creates a new instance of io so we can configure server w/ sockets
// const io = socketio(server);

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

// Initializing our express server
const PORT = process.env.PORT || 5000;
const expressServer = app.listen(PORT, () => {
	console.log(`Server has started on port ${PORT}`);
});
// Socket server is listening to our express server
const io = socketio(expressServer);

// Socket.io related code
io.on("connection", (socket) => {
	socket.on("messageToServer", (msg) => {
		console.log(msg);
	});

	socket.emit("messageFromServer", "Hello from server!");
});
