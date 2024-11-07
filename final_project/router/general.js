const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    // If any user with the same username is found, return error
    if (!isValid(username)) {
      return res.status(406).json({message: "User already exists!"});
    } else {
      // Otherwise add new user
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered!"});
    }
  } else if (!username) {
    return res.status(406).json({message: "No username provided."})
  } else {
    return res.status(406).json({message: "No password provided."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4))
  })
  .then((data) => {
    return res.status(200).send(data)
  })
  .catch((error) => {
    return res.status(400).json({message: error})
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;

    if (!isbn) {
      reject("No ISBN provided.");
    } else {
      const book = books[isbn];
      if (!book) {
        reject(`Book with ISBN ${book} found.`);
      } else {
        resolve(JSON.stringify(book, null, 4));
      }
    }
  })
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author;
    let booksByAuthor = []; // Array to be populated with books by author

    // Return array of books by author provided if they exist
    if (!author) {
      reject("No author provided");
    } else {
    // Iterate through books array, check if author matches the one provided and add to booksByAuthor
      Object.keys(books).forEach((key, value) => {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      });

      // Check if books have been added to booksByAuthor array
      if (!(booksByAuthor.length > 0)) {
        reject(`No books by author ${author} found`);
      } else {
        resolve(JSON.stringify(booksByAuthor, null, 4));
      }
    }
  })
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title;
    let booksByTitle = []; // Array to be populated with books by title

    // Return array of books by title provided if they exist
    if (!title) {
      reject("No title provided");
    } else {
    // Iterate through books array, check if title matches the one provided and add to booksByTitle
      Object.keys(books).forEach((key, value) => {
        if (books[key].title === title) {
          booksByTitle.push(books[key]);
        }
      });

      // Check if books have been added to booksByTitle array
      if (!(booksByTitle.length > 0)) {
        reject(`No books with title ${title} found`);
      } else {
        resolve(JSON.stringify(booksByTitle, null, 4));
      }
    }
  })
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  if (isbn) {
    let book = books[isbn];

    // Return book reviews if book by ISBN provided exists
    if (book) {
      return res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
    }
  } else {
    return res.status(406).json({message: "ISBN not provided"});
  }
});

module.exports.general = public_users;
