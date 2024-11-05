const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();

// Middleware to check if user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login'); // Redirect to login if not logged in
    }
    next(); // Proceed to the requested route if logged in
};

// Search Route
router.get('/search', function(req, res, next) {
    res.render("search.ejs");
});

router.get('/search_result', function(req, res, next) {
    // Secure the search query using parameterized statements
    const searchText = `%${req.query.search_text}%`;
    const sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    
    db.query(sqlquery, [searchText], (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("list.ejs", { availableBooks: result });
    });
});

// Add Book Route (GET and POST)
router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render('addbook.ejs');
});

router.post('/bookadded', redirectLogin, function(req, res, next) {
    const { name, price } = req.body;
    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";

    db.query(sqlquery, [name, price], (err, result) => {
        if (err) {
            return next(err);
        }
        res.send(`This book has been added to the database: name: ${name}, price: ${price}`);
    });
});

// Bargain Books Route
router.get('/bargainbooks', function(req, res, next) {
    const sqlquery = "SELECT * FROM books WHERE price < 20";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("bargains.ejs", { availableBooks: result });
    });
});

// Protected Book List Route
router.get('/list', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT * FROM books";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("list.ejs", { availableBooks: result });
    });
});

// Login Route (GET and POST)
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function(req, res, next) {
    const { username, password: plainPassword } = req.body;

    const sqlquery = "SELECT * FROM user WHERE Username = ?";
    db.query(sqlquery, [username], (err, users) => {
        if (err) {
            return next(err);
        }

        if (users.length === 0) {
            return res.send("No user found with that username.");
        }

        const user = users[0];
        const hashedPassword = user.Hashed_Password;

        bcryptjs.compare(plainPassword, hashedPassword, function(err, result) {
            if (err) {
                return next(err);
            }

            if (result) {
                // Passwords match; save user session
                req.session.userId = user.Username;
                res.send(`Welcome back, ${user.First_name} ${user.Last_name}! You are successfully logged in.`);
            } else {
                res.send("Invalid username or password. Please try again.");
            }
        });
    });
});

// Export the router object so index.js can access it
module.exports = router;
