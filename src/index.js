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
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

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

  socket.on("join", (info, callback) => {
    const { error, user } = addUser({ id: socket.id, ...info });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage("Admin", "Welcome!"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined the room!`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    reverseGeocode({ latitude, longitude }, (error, address) => {
      if (error) {
      } else {
        const user = getUser(socket.id);
        io.to(user.room).emit(
          "location",
          location(
            user.username,
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

    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(user.username, msg));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user[0].room).emit(
        "message",
        generateMessage("Admin", `${user[0].username} has left the chat!`)
      );
      io.to(user[0].room).emit("roomData", {
        room: user[0].room,
        users: getUsersInRoom(user[0].room),
      });
    }
  });
});

// ENDPOINTS
server.listen(port, () => {
  console.log(`Server running at Port ${port}!`);
});
