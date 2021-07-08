// CORE MODULES
const http = require("http");
const path = require("path");

// MODULES
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

// IMPORTS
const reverseGeocode = require("./utils/reverseGeocode");
const { generateMessage, location } = require("./utils/messages");

// CONFIGS VARIABLES
const port = process.env.PORT || 3000;
const app = express();
const publicDirPath = path.join(__dirname, "../public");
const server = http.createServer(app);
const io = socketio(server);

// SETUPS
app.use(express.static(publicDirPath));

// GLOBAL VARIABLES
const adult = true;

// SOCKETS

io.on("connection", (socket) => {
  console.log("New Connection");
  socket.emit("message", generateMessage("Welcome!"));

  socket.broadcast.emit(
    "message",
    generateMessage("New user has joined the chat!")
  );

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    reverseGeocode({ latitude, longitude }, (error, address) => {
      if (error) {
        console.log(error);
      } else {
        socket.broadcast.emit(
          "location",
          location(
            address,
            `https://google.com/maps?q=${latitude},${longitude}`
          )
        );
        callback();
      }
    });
  });

  socket.on("sendMessage", (msg, callback) => {
    const filter = new Filter();
    if (filter.isProfane(msg) && adult) {
      return callback("Profanity is not allowed");
    }
    io.emit("message", generateMessage(msg));
    callback();
  });

  socket.on("disconnect", () =>
    io.emit("message", generateMessage("A user has left the chat!"))
  );
});

// ENDPOINTS
server.listen(port, () => {
  console.log(`Server running at Port ${port}!`);
});
