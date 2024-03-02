// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data


//    SETUP for simple web app

// Express
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())         // lines 7-9 enable express to handle JSON and form data
app.use(express.urlencoded({ extended: true }))

PORT = 27290;                 // Set a port number at the top so it's easy to change in the future


// Database
var db = require('./database/db-connector')


// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));


/*
    ROUTES
*/


// GET ROUTES
app.get('/', function (req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.title === undefined) {
        query1 = "SELECT * FROM Books;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Books WHERE title LIKE "${req.query.title}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Stores;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {

        // Save the books
        let books = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {

            // Save the locations
            let stores = rows;

            let storemap = {}
            stores.map(store => {
                let id = parseInt(store.store_id, 10);
                console.log(id)
                storemap[id] = store["search-title"];
            })

            books = books.map(book => {
                return Object.assign(book, { location: storemap[book.location] })
            })

            return res.render('index', { data: books, stores: stores });
        })
    })
});

// POST ROUTES
app.post('/add-book-form-ajax', function (req, res) {

    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let parsedPrice = parseInt(data.price);
    if (isNaN(parsedPrice)) {
        parsedPrice = 'NULL'
    }

    // Create the query and run it on the database
    let query1 = `INSERT INTO Books (location, title, genre, price) VALUES ('${data.location}', '${data.title}', ${data.genre}, ${parsedPrice})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            let query2 = `SELECT * FROM Books;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});


// DELETE ROUTES
// Books table Cascades on delete, so we don't need multiple queries
app.delete('/delete-book-ajax/', function (req, res, next) {
    let data = req.body;
    let book_id = parseInt(data.book_id);
    let deleteBook = `DELETE FROM Books WHERE book_id = ?`;   // Books table, book_id is PK

    // Run the query
    db.pool.query(deleteBook, [book_id], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});


// UPDATE ROUTES
app.put('/put-book-location-ajax', function (req, res, next) {
    let data = req.body;
    let price = parseInt(data.price);
    let bookID = parseInt(data.book_id);


    queryUpdatePrice = `UPDATE Books SET price = ? WHERE book_id = ?`;
    selectPrice = `SELECT * FROM Books WHERE book_id = ?`;

    // 1st query
    db.pool.query(queryUpdatePrice, [price, bookID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // 2nd query
            db.pool.query(selectPrice, [price, bookID], function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


/*
   LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
