const express = "express";
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => {
      res
        .status(500)
        .json({ error: "we encountered an arror while adding the user" });
    });
});

router.post("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  const postDetails = { ...req.body, user_id: id };
  Posts.insert(postDetails)
    .then(post => {
      res.status(210).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: "we encountered an error while creating this post for the user"
      });
    });
});

router.get("/", (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "encountered an error getting the user" });
    });
});

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
    res.status(400).json({ message: 'missing required "name" field!' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing post data!" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field!" });
  } else {
    next();
  }
  // next();
}

module.exports = router;
