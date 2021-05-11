const express = require("express");

// Depricated as of Express 4.16 onwards
//const bodyParser = require("body-parser");

const app = express();

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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added successfully"
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [{
      id: 'fhioer4r9',
      title: 'First server post',
      content: 'This is the first ever post'
    },
    {
      id: 'fhtrter37',
      title: 'Second server post',
      content: 'This is now the second post'
    }
  ]
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts
  });
});

module.exports = app;
