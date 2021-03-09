// Connection options to bypass CORS error
export const connectionOptions = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
};

// Determines which socket server URL to choose
export const socketServerURL = () => {
	if (process.env.NODE_ENV === "production") {
		return "https://decipher-io.herokuapp.com/";
	} else {
		return "http://localhost:5000/";
	}
};
