// CORE MODULES
const http = require("http");
const path = require("path");

// MODULES
const express = require("express");
const socketio = require("socket.io");

// CONFIGS VARIABLES
const port = process.env.PORT || 3000;
const app = express();
const publicDirPath = path.join(__dirname, "../public");
const server = http.createServer(app);
const io = socketio(server);

// SETUPS
app.use(express.static(publicDirPath));

// GLOBAL VARIABLES

// SOCKETS

io.on("connection", (socket) => {
  console.log("New Connection");
  socket.emit("newClient", "Welcome");

  socket.on("sendMessage", (msg) => {
    io.emit("newMessage", msg);
  });
});

// ENDPOINTS
server.listen(port, () => {
  console.log(`Server running at Port ${port}!`);
});
