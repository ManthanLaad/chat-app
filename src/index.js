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

io.on("connection", () => {
  console.log("New WebSocket connection");
});

// ENDPOINTS
server.listen(port, () => {
  console.log(`Server running at Port ${port}!`);
});
