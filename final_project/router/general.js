const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("username is: ", username);

    if (username && password) {
        if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const all_books = await books;
    res.send(JSON.stringify(all_books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book_details = await books[isbn];
    res.send(book_details);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const book_list = await Object.values(books);

    const book = book_list.filter((book) => book.author === author);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const book_list = await Object.values(books);

    const book = book_list.filter((book) => book.title === title);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const get_review = await books[isbn]['reviews'];
    res.send(get_review);
});

module.exports.general = public_users;
