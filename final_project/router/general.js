const axios = require("axios").default;
const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  } else {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "Customer successfully registered. Now you can login" });
  }
});

function getBooks() {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books, null, 4));
  });
}
// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let booksList = await getBooks();
  return res.send(booksList);
});

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
};
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then((resolve) => res.send(resolve))
    .catch((err) => res.status(400).json({ message: err }));
});

// // Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   let isbn = req.params.isbn;
//   return res.send(books[isbn]);
// });

const getBookByAuthor = (author) => {
  return new Promise((resolve) => {
    let booksByAuthor = [];
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        booksByAuthor.push({
          isbn: isbn,
          title: books[isbn].title,
          reviews: books[isbn].reviews,
        });
      }
    });
    resolve(JSON.stringify({ bookbyauthor: booksByAuthor }, null, 4));
  });
};

//Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  getBookByAuthor(author).then((resolve) => {
    res.send(resolve);
  });
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   let booksByAuthor = [];
//   Object.keys(books).forEach((isbn) => {
//     if (books[isbn].author === req.params.author) {
//       booksByAuthor.push({
//         isbn: isbn,
//         title: books[isbn].title,
//         reviews: books[isbn].reviews,
//       });
//     }
//   });

//   return res.send(JSON.stringify({ bookbyauthor: booksByAuthor }, null, 4));
// });

const getBookByTitle = (title) => {
  return new Promise((resolve) => {
    let booksByTitle = [];
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) {
        booksByTitle.push({
          isbn: isbn,
          author: books[isbn].author,
          reviews: books[isbn].reviews,
        });
      }
    });
    resolve(JSON.stringify({ bookbytitle: booksByTitle }, null, 4));
  });
};

//Get book details based on title
public_users.get("/title/:title", function (req, res) {
  getBookByTitle(req.params.title).then((resolve) => {
    res.send(resolve);
  });
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   let booksByTitle = [];
//   Object.keys(books).forEach((isbn) => {
//     if (books[isbn].title === req.params.title) {
//       booksByTitle.push({
//         isbn: isbn,
//         author: books[isbn].author,
//         reviews: books[isbn].reviews,
//       });
//     }
//   });

//   return res.send(JSON.stringify({ bookbytitle: booksByTitle }, null, 4));
// });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let booksReviews = books[req.params.isbn].reviews;
  return res.send(JSON.stringify(booksReviews, null, 4));
});

module.exports.general = public_users;
