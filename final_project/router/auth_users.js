const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let existing_user = users.filter((user) => {
        return user.username === username;
    });
    if (existing_user.length > 0 ) {
        return false;
    }
    else{
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validate_user = users.filter((user)=> {
        return (user.username === username && user.password === password);
    });
    if (validate_user.length > 0){
        return true;
    } else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken,username
        }

        return res.status(200).send("User successfully logged in");
    }
    else{
        return res.status(208).json({message:"Invalid username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review;
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(books[isbn]){
        let book = books[isbn];
        book.reviews[username] = review;

        return res.status(200).send("Review added.");
    }else{
        return res.status(404).json({message:`ISBN ${isbn} not found`});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
