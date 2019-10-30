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
  Users.get(req.query)
    .then(users => res.status(200).json(users))
    .catch(err => {
      res.status(500).json({ message: "Error retrieving the users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "encountered an error getting the user" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message:
          "encountered an error while retrieving the posts for the specified user"
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(data => {
      if (data) {
        res.status(200).json({ message: "The user has been deleted" });
      } else {
        res
          .status(404)
          .json({ message: "The user could not be found on our database" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "encountered an error while removing the user" });
    });
});

router.put("/:id", (req, res) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "error while updating the user"
      });
    });
});

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
