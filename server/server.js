require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const { connectDB } = require("./config/db");
const PORT = process.env.PORT || 5000;
const { initializeSocket } = require("./services/socket.service");
const http = require("http");
const server = http.createServer(app);

const startServer = async () => {
  // Use CORS middleware
  app.use(cors());
  app.use(express.json());
  // Connect to DB
  await connectDB();
  console.log("MongoDB connected. Starting server...");

  app.use(bodyParser.json());
  initializeSocket(server);
  // Routes
  app.use("/", routes);

  server.listen(PORT, () => console.log(`Server running on ${PORT}`));
};

startServer();
