const express = require("express");

// Depricated as of Express 4.16 onwards
//const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

//The DB connect URL: "mongodb+srv://mean-stack-posts:wLtL7tYR4rFbVBc@cluster0.ttur7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// myFirstDatabase is the default name provided by Mongo in its connection string.
// We renamed it to postsAppDB
mongoose.connect("mongodb+srv://mean-stack-posts:wLtL7tYR4rFbVBc@cluster0.ttur7.mongodb.net/postsAppDB?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database');
  });

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {

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

app.get('/api/posts', (req, res, next) => {
  // const posts = [{
  //     id: 'fhioer4r9',
  //     title: 'First server post',
  //     content: 'This is the first ever post'
  //   },
  //   {
  //     id: 'fhtrter37',
  //     title: 'Second server post',
  //     content: 'This is now the second post'
  //   }
  // ]
  Post.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
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



module.exports = app;
