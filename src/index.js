// CORE MODULES
const http = require("http");
const path = require("path");

// MODULES
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

// IMPORTS
const reverseGeocode = require("./utils/reverseGeocode");

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
  socket.emit("message", "Welcome!");

  socket.broadcast.emit("message", "New user has joined the chat!");

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    reverseGeocode({ latitude, longitude }, (error, address) => {
      if (error) {
        console.log(error);
      } else {
        socket.broadcast.emit(
          "location",
          address,
          `https://google.com/maps?q=${latitude},${longitude}`
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
    io.emit("message", msg);
    callback();
  });

  socket.on("disconnect", () =>
    io.emit("message", "A user has left the chat!")
  );
});

// ENDPOINTS
server.listen(port, () => {
  console.log(`Server running at Port ${port}!`);
});
