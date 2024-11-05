// // Import express and ejs
// var express = require ('express')
// var ejs = require('ejs')


// //Import mysql module
// var mysql = require('mysql2')


// // Create the express application object
// const app = express()
// const port = 8000

// // Tell Express that we want to use EJS as the templating engine
// app.set('view engine', 'ejs')

// // Set up the body parser 
// app.use(express.urlencoded({ extended: true }))

// // Set up public folder (for css and statis js)
// app.use(express.static(__dirname + '/public'))

// // Define the database connection
// const db = mysql.createConnection ({
//     host: 'localhost',
//     user: 'bettys_books_app',
//     password: 'qwertyuiop',
//     database: 'bettys_books'
// })
// // Connect to the database
// db.connect((err) => {
//     if (err) {
//         throw err
//     }
//     console.log('Connected to database')
// })
// global.db = db

// // Define our application-specific data
// app.locals.shopData = {shopName: "Bettys Books"}

// // Load the route handlers
// const mainRoutes = require("./routes/main")
// app.use('/', mainRoutes)

// // Load the route handlers for /users
// const usersRoutes = require('./routes/users')
// app.use('/users', usersRoutes)

// // Load the route handlers for /books
// const booksRoutes = require('./routes/books')
// app.use('/books', booksRoutes)

// // Start the web app listening
// app.listen(port, () => console.log(`Node app listening on port ${port}!`))



// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
var session = require ('express-session')

//Import mysql module
var mysql = require('mysql2')


// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Middleware to check if user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login'); // Redirect to login if not logged in
    } else {
        next(); // Proceed to the requested route if logged in
    }
};

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'bettys_books_app',
    password: 'qwertyuiop',
    database: 'bettys_books'
})
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

// Define our application-specific data
app.locals.shopData = {shopName: "Bettys Books"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', redirectLogin, booksRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))