// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data



var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code

PORT = 27290;                 // Set a port number at the top so it's easy to change in the future

app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');
app.use(express.json())         // lines 7-9 enable express to handle JSON and form data
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));


// Data Manipulation Queries
// --select authors(add all author data in addition to new "book(s)" column)
// SELECT
// Authors.first_name AS "First Name",
//     Authors.last_name AS "Last Name",
//         GROUP_CONCAT(Books.title ORDER BY Books.title ASC SEPARATOR ', ') AS Books
// FROM Authors
// LEFT JOIN Book_has_Authors ON Authors.author_id = Book_has_Authors.author
// LEFT JOIN Books ON Book_has_Authors.book = Books.book_id
// GROUP BY Authors.author_id, Authors.first_name;

// --select sales(add all sales data in addition to new "book(s) sold" column and replace all fks with actual names)
// SELECT
// Stores.store_name as "Location",
//     Customers.name as "Customer",
//     Sales.sales_no_tax as "Sale (No Tax)",
//     Sales.tax_collected as "Tax Collected",
//     Sales.purchase_date as "Purchase Date",
//     GROUP_CONCAT(Books.title ORDER BY Books.title ASC SEPARATOR ', ') AS Books
// FROM Sales
// LEFT JOIN Stores ON Sales.location = Stores.store_id
// LEFT JOIN Customers ON Sales.sale_customer = Customers.customer_id
// LEFT JOIN Sales_has_Books ON Sales.sale_id = Sales_has_Books.sale
// LEFT JOIN Books ON Sales_has_Books.book = Books.book_id
// GROUP BY
// Stores.store_name,
//     Customers.name,
//     Sales.sales_no_tax,
//     Sales.tax_collected,
//     Sales.purchase_date;

// --- INSERTS-- -

//     --insert a new store
// INSERT INTO Stores(store_name, store_address)
// VALUES(: store_name, : store_address);

// --insert a new customer
// INSERT INTO Customers(name, email)
// VALUES(: name, : email);

// --insert a new author
// INSERT INTO Authors(first_name, last_name)
// VALUES(: first_name, : last_name);

// --insert a new book(this insert will require a query getting a store_id)
// INSERT INTO Books(location, title, genre, purchased_price)
// VALUES(: location, : title, : genre, : purchased_price);

// --insert a new sale(this insert will require a query getting store_id, customer_id)
// INSERT INTO SALES(location, sale_customer, sales_no_tax, tax_collected, purchase_date)
// VALUES(: location, : sale_customer, : sales_no_tax, : tax_collected, : purchase_date);

// --- DELETES-- -

//     -- delete a book from Books(this delete will require a query getting a book_id)
// DELETE FROM Books
// WHERE book_id = : book_id;

// --- UPDATES-- -

//     --update the customer associated with a sale
// UPDATE Sales
// SET sale_customer = : sale_customer
// WHERE sale_id = : sale_id;

// --- DYNAMIC SEARCH-- -

//     --search for sales by customer
// SELECT
// Stores.store_name as "Location",
//     Customers.name as "Customer",
//     Sales.sales_no_tax as "Sale (No Tax)",
//     Sales.tax_collected as "Tax Collected",
//     Sales.purchase_date as "Purchase Date",
//     GROUP_CONCAT(Books.title ORDER BY Books.title ASC SEPARATOR ', ') AS Books
// FROM Sales
// LEFT JOIN Stores ON Sales.location = Stores.store_id
// LEFT JOIN Customers ON Sales.sale_customer = Customers.customer_id
// LEFT JOIN Sales_has_Books ON Sales.sale_id = Sales_has_Books.sale
// LEFT JOIN Books ON Sales_has_Books.book = Books.book_id
// WHERE Customers.name = : Customers.name
// GROUP BY
// Stores.store_name,
//     Customers.name,
//     Sales.sales_no_tax,
//     Sales.tax_collected,
//     Sales.purchase_date;

/*
    ROUTES
*/

// renders the Home page
app.get('/', function (req, res) {
    res.render('index');
});

// renders the Books page
app.get('/books', function (req, res) {

    console.log("/books - app.js");
    // If there is no query string, we just perform a basic SELECT
    // If there is a field in the search box, this does the search return
    let query1;

    if (req.query.title === undefined) {
        query1 = `SELECT * FROM Books`;
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Books WHERE title LIKE "${req.query.title}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Stores;";

    db.pool.query(query1, function (error, rows, fields) {
        // Save the books
        let books = rows;

        // Run the second query for dropdown Stores
        db.pool.query(query2, (error, rows, fields) => {

            // Save the stores
            let stores = rows;

            return res.render('books', { data: books, stores: stores });
        })
    })
});

// renders the Authors page
app.get('/authors', function (req, res) {
    let query1 = `SELECT * FROM Authors;`;
    db.pool.query(query1, function (error, rows, fields) {
        res.render('authors', { data: rows });
    })
});

// renders the Books_has_Authors page
app.get('/book_has_authors', function (req, res) {
    let query1 = `SELECT * FROM Book_has_Authors;`;
    db.pool.query(query1, function (error, rows, fields) {
        res.render('book_has_authors', { data: rows });
    })
});

// renders the Stores page
app.get('/stores', function (req, res) {
    let query1 = `SELECT * FROM Stores;`;
    db.pool.query(query1, function (error, rows, fields) {
        res.render('stores', { data: rows });
    })
});

// renders the Customers page
app.get('/customers', function (req, res) {
    let query1 = `SELECT * FROM Customers;`;
    db.pool.query(query1, function (error, rows, fields) {
        res.render('customers', { data: rows });
    })
});

// renders the Sales page
app.get('/sales', function (req, res) {
    let query1 = `SELECT * FROM Sales;`;
    db.pool.query(query1, function (error, rows, fields) {
        res.render('sales', { data: rows });
    })
});

// renders the Sales_has_Books page
app.get('/sales_has_books', function (req, res) {
    let query1 = `SELECT * FROM Sales_has_Books;`;
    db.pool.query(query1, function (error, rows, fields) {
        res.render('sales_', { data: rows });
    })
})



// POST ROUTES
app.post('/add-book-form-ajax', function (req, res) {

    console.log("add book - app.js");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let parsedPrice = parseInt(data.price);
    if (isNaN(parsedPrice)) {
        parsedPrice = 'NULL'
    }

    // Create the query and run it on the database
    let query1 = `INSERT INTO Books (location, title, genre, price) VALUES ('${data.location}', '${data.title}', '${data.genre}', ${parsedPrice})`;
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

// Add a customer
app.post('/add-customer-form-ajax', function (req, res) {

    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Customers (name, email) VALUES ('${data.name}', '${data.email}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }   
    })
});


// Add a author
app.post('/add_author', function (req, res) {

    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Customers (name, email) VALUES ('${data.first_name}', '${data.last_name}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
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


// Delete a customer
app.delete('/delete-customer-ajax/', function (req, res, next) {
    let data = req.body;
    let customer_id = parseInt(data.book_id);
    let deleteCustomer = `DELETE FROM Customers WHERE customer_id = ?`;   // Books table, book_id is PK

    // Run the query
    db.pool.query(deleteBook, [customer_id], function (error, rows, fields) {

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