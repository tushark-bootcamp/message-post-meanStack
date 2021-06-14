const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(createdUser => {
            console.log(user);
            res.status(201).json({
              message: "User created successfully",
              result: createdUser
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              message: "It looks like you are already a member. Login to start writing posts."
            })
          });
      });
  }

  exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Invalid credentials"
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
      })
      .then(result => {
        console.log(result);
        if (!result) {
          return res.status(401).json({
            message: "Invalid credentials"
          });
        }
        const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        }, process.env.JWT_KEY, {
          expiresIn: "1h"
        });
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          userName: fetchedUser.email
        });
      })
      .catch(err => {
        console.log(err);
        return res.status(401).json({
          message: "Invalid credentials"
        });
      })
  }