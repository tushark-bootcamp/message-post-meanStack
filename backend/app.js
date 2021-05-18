const express = require("express");

// Depricated as of Express 4.16 onwards
//const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();

//The DB connect URL: "mongodb+srv://mean-stack-posts:wLtL7tYR4rFbVBc@cluster0.ttur7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// myFirstDatabase is the default name provided by Mongo in its connection string.
// We renamed it to postsAppDB. This is required the first time the Node express connects with database 
// @See lecture 54.Storing data in Database
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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
