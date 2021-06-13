const Post = require("../models/post");

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    // can instantiate Post() as below because of the model() method from mongoose (@See mongoose.model("Post", postSchema))
    // the model(..) method gives us the constructor function which allows us to construct a new javascript object --> new Post()
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save()
    .then(createdPost => {
      console.log(post);
      res.status(201).json({
        message: "Post added successfully",
        // Transform the serverside Post to client side post{}.
        // post: {
        //   id: createdPost._id,
        //   title: createdPost.title,
        //   content: createdPost.content,
        //   imagePath: createdPost.imagePath
        // }
        // Create the clientside post {} using the spread operator.
        post: {
          ...createdPost,
          id: createdPost._id,
        }
      });
    })
    .catch( error => {
      console.log(error);
      return res.status(500).json({
        message: "Creating a post failed"
      });
    });
  }

  exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      // creator is still set as the user id of the user who has logged in
      // a possible security hole if a user calls the edit post from the URL on someone else's post -
      // ** NOT Quite a security hole because the update call is made on the post-id and the userId 
      // who originally created the post 
      creator: req.userData.userId
    });
    Post.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, post)
    .then(updatedPost => {
      console.log(updatedPost);
      if(updatedPost.nModified > 0) {
        res.status(200).json({
          message: "Post updated successfully",
          imagePath: updatedPost.imagePath
        });
      } else {
        res.status(401).json({
          message: "You are not authorised"
        });
      }
    })
    .catch( error => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't update post!"
      });
    });
  }

  exports.getPosts = (req, res, next) => {
    // sample url to send query params
    //http://localhost:3000/api/posts?pagesize=2&pageindex=1
    console.log(req.query);
    // Use +req instead of req to convert string into number
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    // the below find() method only gets executed when you call the .then()
    const postQuery = Post.find();
    if (pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.then(documents => {
        console.log(documents);
        fetchedPosts = documents;
        return Post.count();
      })
      .then(count => {
        console.log(count);
        res.status(200).json({
          message: "Posts fetched successfully",
          posts: fetchedPosts,
          postCount: count
        });
      })
      .catch( error => {
        console.log(error);
        return res.status(500).json({
          message: "Fetching posts failed!"
        });
      });
  }

  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
      if (post) {
        console.log(post);
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The requested post: " + req.params.id + " was not found!"
        });
      }
    })
    .catch( error => {
      console.log(error);
      return res.status(500).json({
        message: "Fetching post failed!"
      });
    });
  }

  exports.deletePost = (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({
      _id: req.params.id
    })
    .then((result) => {
      console.log(result);
      if(result.n > 0) {
        res.status(200).json({
          message: "Deletion successful!",
        });
      } else {
        res.status(401).json({
          message: "Not authorised"
        });
      }
    })
    .catch( error => {
      console.log(error);
      return res.status(500).json({
        message: "Coundn't delete post!"
      });
    });
  }