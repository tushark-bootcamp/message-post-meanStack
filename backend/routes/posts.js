const express = require("express");

const router = express.Router();

const Post = require("../models/post");

router.post("", (req, res, next) => {

    // can instantiate Post() as below because of the model() method from mongoose (@See mongoose.model('Post', postSchema))
    // the model(..) method gives us the constructor function which allows us to construct a new javascript object --> new Post()
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save().then(createdPost => {
      console.log(post);
      res.status(201).json({
        message: "Post added successfully",
        postId: createdPost._id
      });
    });
  });
  
  router.put("/:id", (req, res, next) => {
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content
    });
    Post.updateOne({
      _id: req.params.id
    }, post).then(updatedPost => {
      console.log(updatedPost);
      res.status(200).json({
        message: "Post updated successfully"
      });
    });
  });
  
  router.get("", (req, res, next) => {
    Post.find().then(documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    });
  });
  
  router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        console.log(post);
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'No post with id: ' + req.params.id + ' found'
        });
      }
  
    });
  });
  
  router.delete("/:id", (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({
      _id: req.params.id
    }).then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Post deleted'
      });
    });
  });

  module.exports = router;