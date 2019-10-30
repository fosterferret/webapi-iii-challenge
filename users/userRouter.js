const express = "express";
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {});

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(400).json({ message: "invalid user ID" });
      } else {
        req.user = req.params.id;
        next();
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "encountered an error validating user ID" });
    });
}

function validateUser(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing user data!" });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'Missing required "name" field!' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing post data!" });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field!' });
  } else {
    next();
  }
  // next();
}

module.exports = router;
