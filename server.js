const express = "express";
const server = express();
const userRouter = require("./users/userRouter");
server.use(express.json());

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
}
server.use(logger);
server.use(userRouter);
server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

module.exports = server;
