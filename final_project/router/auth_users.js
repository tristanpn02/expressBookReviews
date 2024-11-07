const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Filter users by username
  let validUsers = users.filter((user) => {
    return (user.username === username);
  });

  // Return false if the username already exists
  if (validUsers.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter users by username and password
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  // Return true if the user is authenticated
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(406).json({message: "Credentials missing. Check username and password"});
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
