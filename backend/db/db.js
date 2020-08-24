const mongoose = require("mongoose");



mongoose.connection.on("connected", () => {
    console.log("Connection Established");
});

mongoose.connection.on("reconnected", () => {
    console.log("Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
    console.log("Connection Disconnected");
});

mongoose.connection.on("close", () => {
    console.log("Connection Closed");
});

mongoose.connection.on("error", error => {
    console.log("ERROR: " + error);
});


async function connect(url) {
    return await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
};



module.exports.connect = connect;