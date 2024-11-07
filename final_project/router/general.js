const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  if (isbn) {
    let book = books[isbn]

    // Return book details if book by ISBN provided exists
    if (book) {
      return res.send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
    }
  } else {
    return res.status(406).json({message: "ISBN not provided."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let authorsBooks = []; // Array to be populated with books by author

  // Return array of books by author provided if they exist
  if (author) {
    // Iterate through books array, check if author matches the one provided and add to authorsBooks
    Object.keys(books).forEach((key, value) => {
      if (books[key].author === author) {
        authorsBooks.push(books[key]);
      }
    })

    // Check if books have been added to authorsBooks array
    if (authorsBooks.length > 0) {
      return res.send(JSON.stringify(authorsBooks, null, 4));
    } else {
      return res.status(404).json({message: `No books by author ${author} found.`})
    }
  } else {
    return res.status(406).json({message: "Author not provided."})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
