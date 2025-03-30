const { Server } = require("socket.io");
const { createServer } = require("http");
const timetableService = require("../services/Teacher/timetable.service");
const { responseStatusSocket } = require("../globals/handler");
const socketMiddlewares = require("../middlewares/socket.middlewares");
require("dotenv").config();

const initSocket = (app) => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  io.use(socketMiddlewares.authSocket);

  io.on("connection", (socket) => {
    let userId = socket.user.id;

    console.log("Connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.id);
    });

    socket.on("newTimetable", async (timetable) => {
      try {
        let result = await timetableService.insertOne(timetable, userId);
        if (result.affectedRows > 0) {
          responseStatusSocket(
            io,
            "onTimetable",
            "success",
            "Inserted timetable"
          );
        } else {
          responseStatusSocket(io, "onTimetable", "success", result);
        }
      } catch (e) {
        responseStatusSocket(io, "onTimetable", "failed", e.message);
      }
    });
  });

  const PORT = process.env.SOCKET_URL || 3000;

  httpServer.listen(PORT);
};

module.exports = initSocket;
