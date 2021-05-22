const express = require("express");
const multer = require("multer");

const router = express.Router();

const Post = require("../models/post");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// ** Imp Note: This function does not create the image directory automatically. 
// There has to be a directory pre-created: in our example the images folder had to be created.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    // The path "backend/images" is stored relative to the server.js file
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  // can instantiate Post() as below because of the model() method from mongoose (@See mongoose.model('Post', postSchema))
  // the model(..) method gives us the constructor function which allows us to construct a new javascript object --> new Post()
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    console.log(post);
    res.status(201).json({
      message: "Post added successfully",
      // post: {
      //   id: createdPost._id,
      //   title: createdPost.title,
      //   content: createdPost.content,
      //   imagePath: createdPost.imagePath
      // }
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  } 
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({
    _id: req.params.id
  }, post).then(updatedPost => {
    console.log(updatedPost);
    res.status(200).json({
      message: "Post updated successfully",
      imagePath: updatedPost.imagePath
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
