const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on("chat message", (data) => {
    console.log(`${data.nickname} says: ${data.message} in room: ${data.room}`);
    io.to(data.room).emit("chat message", data);
  });

  socket.on("disconnect", (reason) => {
    console.log(`user disconnected due to ${reason}`);
  });
});

server.listen(3000, () => console.log("listening on *:3000"));
