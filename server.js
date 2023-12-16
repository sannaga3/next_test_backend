const express = require("express");
const http = require("http");
const cors = require("cors");
const postsRoute = require("./router/posts");
const authRoute = require("./router/auth");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = 5001;

app.use(cors());
app.use("/api/posts", postsRoute);
app.use("/api/auth", authRoute);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`server is running on Port ${PORT}`));

module.exports = server;
