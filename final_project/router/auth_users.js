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
  const isbn = req.params.isbn;
  const title = req.body.title;
  const body = req.body.body;
  const reviewer = req.session.authorization.username;

  if (isbn) {
    let book = books[isbn];

    if (book) {
      // Return error if title or body is missing
      if (!title || !body) {
        return res.status(406).json({message: "Title or body missing."})
      }

      // Append review to book under reviewer's username
      book.reviews[Object.keys(book.reviews).length + 1] = {
        "reviewer": reviewer,
        "title": title,
        "body": body,
        "source": "Review submitted through application."
      }

      return res.status(200).send("Review successfully submitted!");
    }
    return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
  }
  return res.status(406).json({message: "No ISBN provided."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (isbn) {
    let book = books[isbn];

    if (book) {
      let reviews = book.reviews;

      Object.keys(reviews).forEach((key, value) => {
        if (reviews[key].reviewer === username) {
          delete reviews[key];
        }
      });

      res.status(200).json({message: "Review deleted successfully."});
    } else {
      res.status(404).json({message: "Book not found"});
    }
  } else {
    res.status(406).json({message: `Book with ISBN ${isbn} not found.`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
