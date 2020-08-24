const express = require("express");
const cors = require("cors");
const db = require("./db/db.js");
const Message = require("./models/message.js");

const port = 8463;
const dbUrl = "mongodb://localhost:27017/chat-demo";
const frontUrl = "http://localhost:3000";



async function main() {
    try {
        await db.connect(dbUrl);
    } catch (except) {
        console.log("Error during connection to the database:");
        console.error(except);
        process.exit(1);
    }

    const app = express();
    app.use(cors({
	    origin: frontUrl,
	    optionsSuccessStatus: 200,
	    credentials: true,
	}));
    const server = app.listen(port, () => console.log(`Server running on port ${port}.`));

    const socket = require("socket.io")(server);
    socket.on("connection", async (client) => {
    	console.log("client connected...");

    	client.on("message", async (msg) => {
    		let message = await Message.Schema.statics.create(msg);
    		socket.emit("message", message);
    	});

    	let latest = await Message.Schema.statics.latest(10);
    	client.emit("latest", latest);
    });
}


main();