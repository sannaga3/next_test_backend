const express = require("express");
const http = require("http");
const cors = require("cors");
const postsRoute = require("./router/posts");
const authRoute = require("./router/auth");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/posts", postsRoute);
app.use("/api/auth", authRoute);

const createApp = () => {
  const server = http.createServer(app);
  return server;
};

module.exports = { createApp };
