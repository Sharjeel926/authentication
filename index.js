const express = require("express");
const app = express();
const port = 5000;
//const swaggerUI = require("swagger-ui-express");
const logRoutes = require("./routes/route");
const db = require("./database/db");
//const swagger = require("./swagger/swagger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
app.use(express.json());
const http = require("http");

const path = require("path");
// server & socket.io configuration

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: true,
});
let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removedUser = (socketId) => {
  users = users.filter((user) => user.socketId === socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  // if user not added
  // console.log('a user connected');
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    // console.log(users);
    io.emit("getUsers", users);
  });
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    // console.log(users);
    // console.log(receiverId,senderId,text);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  socket.on("sendNotification", ({ senderId, receiverId, text }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("sendNotification", {
      senderId,
    });
  });
  socket.on("disconnect", () => {
    // console.log("User disconnected");
    removedUser(socket.id);
    io.emit("getUsers", users);
  });
});
app.use(express.static(path.resolve(__dirname, "public")));

app.get("/mes", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", logRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
  //console.log(swaggerDocRoute);
});
