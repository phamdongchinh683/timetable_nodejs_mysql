const { Server } = require("socket.io");
const { createServer } = require("http");
require("dotenv").config();

const initSocket = (app) => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("Connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.id);
    });
  });
  const PORT = process.env.SOCKET_URL || 3000;

  httpServer.listen(PORT);
};

module.exports = initSocket;
