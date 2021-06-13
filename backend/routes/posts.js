//const path = require("path");
const express = require("express");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/image-file");

const PostsController = require("../controllers/posts");

const router = express.Router();

// checkAuth is the middleware introduced to decode the token and insert userId and user email in the request object
router.post("", checkAuth, extractFile, PostsController.createPost);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPost);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
