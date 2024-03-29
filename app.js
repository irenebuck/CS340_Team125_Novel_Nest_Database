// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors/GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11 


var db = require("./database/db-connector");

const { engine } = require("express-handlebars");
var exphbs = require("express-handlebars");
var express = require("express"); // We are using the express library for the web server
var app = express(); // We need to instantiate an express object to interact with the server in our code

PORT = 27240; // Set a port number at the top so it's easy to change in the future

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.use(express.json()); // lines 7-9 enable express to handle JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/*
    ROUTES
*/

// renders the Home page
app.get("/", function (req, res) {
  res.render("index");
});

// renders the Books page
app.get("/books", function (req, res) {
  let query1 = "SELECT * FROM Books;";
  let query2 = "SELECT * FROM Stores;";

  db.pool.query(query1, function (error, rows, fields) {
    // Save the books
    let books = rows;

    // Run the second query
    db.pool.query(query2, (error, rows, fields) => {
      // Save the stores
      let stores = rows;

      let storemap = {};
      stores.map((store) => {
        let id = parseInt(store.store_id, 10);
        storemap[id] = store["store_name"];
      });

      // this overwrite the store_id number with the location name AKA store_name
      books = books.map((book) => {
        return Object.assign(book, { location: storemap[book.location] });
      });

      // console.log(books, stores);
      return res.render("books", { data: books, stores: stores });
    });
  });
});

// renders the Stores page
app.get("/stores", function (req, res) {
  let query1 = `SELECT * FROM Stores;`;
  db.pool.query(query1, function (error, rows, fields) {
    res.render("stores", { data: rows });
  });
});

// renders the Customers page
app.get("/customers", function (req, res) {
  let query1 = `SELECT * FROM Customers;`;
  db.pool.query(query1, function (error, rows, fields) {
    res.render("customers", { data: rows });
  });
});

// renders the Sales page
app.get("/sales", function (req, res) {
  let query1 =
    "SELECT Sales.sale_id, Stores.store_name AS location, Customers.name AS sale_customer, Sales.sales_no_tax, Sales.tax_collected, Sales.purchase_date FROM Sales INNER JOIN Stores ON Sales.location = Stores.store_id INNER JOIN Customers ON Sales.sale_customer = Customers.customer_id ORDER BY Sales.sale_id ASC;";
  let query2 = "SELECT * FROM Stores;";
  let query3 = "SELECT * FROM Customers";

  db.pool.query(query1, function (error, rows, fields) {
    let sales = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let stores = rows;

      db.pool.query(query3, function (error, rows, fields) {
        let customers = rows;

        return res.render("sales", {
          data: sales,
          stores: stores,
          customers: customers,
        });
      });
    });
  });
});

// renders the Sales_has_Books page
app.get("/sales_has_books", function (req, res) {
  console.log("app.js - getting sales has books");
  let query1 = `SELECT Sales_has_Books.sales_has_books_id, Sales_has_Books.sale, Books.title
    FROM Sales_has_Books
    INNER JOIN Books ON Sales_has_Books.book = Books.book_id
    ORDER BY Sales_has_Books.sales_has_books_id ASC;`;

  let query2 = "SELECT * FROM Sales;";
  let query3 = "SELECT * FROM Books;";

  db.pool.query(query1, function (error, rows, fields) {
    let bookSales = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let sales = rows;

      db.pool.query(query3, (error, rows, fields) => {
        let books = rows;

        let bookmap = {};
        books.map((book) => {
          let id = parseInt(book.book_id, 10);
          bookmap[id] = book["title"];
        });

        return res.render("sales_has_books", {
          data: bookSales,
          sales: sales,
          books: books,
        });
      });
    });
  });
});

// POST ROUTES

// Add a book
app.post("/add-book-form-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Capture NULL values
  let parsedPrice = parseInt(data.price);
  if (isNaN(parsedPrice)) {
    parsedPrice = "NULL";
  }

  // Create the query and run it on the database
  let query1 = `INSERT INTO Books (location, title, author, genre, price) VALUES ('${data.location}', '${data.title}', '${data.author}', '${data.genre}', ${parsedPrice})`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
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
      });
    }
  });
});

// Add a customer
app.post("/add-customer-form-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  let query1 = `INSERT INTO Customers (name, email) VALUES ('${data.name}', '${data.email}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // If the insert operation was successful, fetch the updated data
      let query2 = `SELECT * FROM Customers;`;
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          // Send the fetched data as the response
          res.send(rows);
        }
      });
    }
  });
});

//add sales has books
app.post("/add-sales-has-books-form-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  let query1 = `INSERT INTO Sales_has_Books (sale, book) VALUES ('${data.sale}', '${data.book}')`;
  db.pool.query(query1, function (error, result) {
    // Check for errors
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      // If the insert operation was successful, fetch the updated data
      let query2 = `SELECT Sales_has_Books.sales_has_books_id, Sales_has_Books.sale, Books.title
            FROM Sales_has_Books
            INNER JOIN Books ON Sales_has_Books.book = Books.book_id
            ORDER BY Sales_has_Books.sales_has_books_id ASC;`;
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          // Send the fetched data as the response
          res.send(rows);
        }
      });
    }
  });
});

// add sale
app.post("/add-sale-form-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Capture NULL values
  let parsedCustomer = parseInt(data.sale_customer);
  if (isNaN(parsedCustomer)) {
    parsedCustomer = "NULL";
  }

  // Create the query and run it on the database
  let query1 = `INSERT INTO Sales(location, sale_customer, sales_no_tax, tax_collected, purchase_date) VALUES ('${data.location}', ${parsedCustomer}, '${data.sales_no_tax}', '${data.tax_collected}', '${data.purchase_date}')`;
  db.pool.query(query1, function (error, result) {
    // Check for errors
    if (error) {
      res.sendStatus(400);
    } else {
      // If the insert operation was successful, fetch the updated data
      let query2 =
        "SELECT Sales.sale_id, Stores.store_name AS location, Customers.name AS sale_customer, Sales.sales_no_tax, Sales.tax_collected, Sales.purchase_date FROM Sales INNER JOIN Stores ON Sales.location = Stores.store_id INNER JOIN Customers ON Sales.sale_customer = Customers.customer_id ORDER BY Sales.sale_id ASC;";
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          res.sendStatus(400);
        } else {
          // Send the fetched data as the response
          res.send(rows);
        }
      });
    }
  });
});

// add store
app.post("/add-store-form-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  let query1 = `INSERT INTO Stores (store_name, store_address) VALUES ('${data.store_name}', '${data.store_address}')`;
  db.pool.query(query1, function (error, result) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // If the insert operation was successful, fetch the updated data
      let query2 = `SELECT * FROM Stores;`;
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      });
    }
  });
});

// DELETE ROUTES

// Delete a book
// Books table Cascades on delete, so we don't need multiple queries
app.delete("/delete-book-ajax/", function (req, res, next) {
  let data = req.body;
  let book_id = parseInt(data.book_id);
  let deleteBook = `DELETE FROM Books WHERE book_id = ?`; // Books table, book_id is PK

  // Run the query
  db.pool.query(deleteBook, [book_id], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Delete a customer
app.delete("/delete-customer-ajax/", function (req, res, next) {
  let data = req.body;
  let customer_id = parseInt(data.customer_id);

  let deleteCustomer = `DELETE FROM Customers WHERE customer_id = ?`;

  // Run the query
  db.pool.query(deleteCustomer, [customer_id], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Delete sales has books
app.delete("/delete-sales-has-books-ajax/", function (req, res, next) {
  let data = req.body;
  let sales_has_books_id = parseInt(data.sales_has_books_id);
  let deleteBook = `DELETE FROM Sales_has_Books WHERE sales_has_books_id = ?`;

  // Run the query
  db.pool.query(
    deleteBook,
    [sales_has_books_id],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

// Delete a sale
app.delete("/delete-sale-ajax/", function (req, res, next) {
  let data = req.body;
  let id = parseInt(data.sale_id);

  let deleteSale = `DELETE FROM Sales WHERE sale_id = ?`;

  // Run the query
  db.pool.query(deleteSale, [id], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Delete a store
app.delete("/delete-store-ajax/", function (req, res, next) {
  let data = req.body;
  let store_id = parseInt(data.store_id);

  let deleteStore = `DELETE FROM Stores WHERE store_id = ?`;

  // Run the query
  db.pool.query(deleteStore, [store_id], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// UPDATE ROUTES

// update a book
app.put("/update-book-form-ajax", function (req, res, next) {
  console.log("putting book - app.js");
  let data = req.body;
  let bookID = parseInt(data.book_id);
  let title = data.title;
  let author = data.author;
  let genre = data.genre;
  let price = parseInt(data.price);

  queryUpdateBook = `UPDATE Books SET title = ?, author = ?, genre = ?, price = ? WHERE book_id = ?`;
  selectBook = `SELECT * FROM Books WHERE book_id = ?`;

  // 1st query
  db.pool.query(
    queryUpdateBook,
    [title, author, genre, price, bookID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        // console.log("second query");
        // 2nd query
        db.pool.query(selectBook, [bookID], function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            // console.log("we good");
            res.send(rows);
          }
        });
      }
    }
  );
});

//update customer
app.put("/update-customer-form-ajax", function (req, res, next) {
  let data = req.body;
  let name = data.name;
  let email = data.email;
  let customer_id = parseInt(data.customer_id);

  queryUpdateCustomer = `UPDATE Customers SET name = ?, email = ? WHERE customer_id = ?`;
  selectCustomer = `SELECT * FROM Customers WHERE customer_id = ?`;

  // 1st query
  db.pool.query(
    queryUpdateCustomer,
    [name, email, customer_id],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        // 2nd query
        db.pool.query(
          selectCustomer,
          [customer_id],
          function (error, rows, fields) {
            if (error) {
              console.log(error);
              res.sendStatus(400);
            } else {
              // console.log(rows);
              res.send(rows);
            }
          }
        );
      }
    }
  );
});

//update sales has books
app.put("/update-sales-has-books-form-ajax", function (req, res, next) {
    let data = req.body;
    let salesHasBooksID = parseInt(data.sales_has_books_id);
    let sale = parseInt(data.sale);
    let book = parseInt(data.book);

    console.log(sale, book);

    queryUpdateBook = `UPDATE Sales_has_Books SET sale = ?, book = ? WHERE sales_has_books_id = ?`;
    selectBook = `SELECT Sales_has_Books.sales_has_books_id, Sales_has_Books.sale, Books.title
    FROM Sales_has_Books
    INNER JOIN Books ON Sales_has_Books.book = Books.book_id
    WHERE sales_has_books_id = ?;`;

    // 1st query
    db.pool.query(
        queryUpdateBook,
        [sale, book, salesHasBooksID],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                // console.log("second query");
                // 2nd query
                db.pool.query(
                    selectBook,
                    [salesHasBooksID],
                    function (error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // console.log("we good");
                            res.send(rows);
                        }
                    }
                );
            }
        }
    );
});


//update store
app.put("/update-store-form-ajax", function (req, res, next) {
  let data = req.body;
  let name = data.store_name;
  let address = data.store_address;
  let id = parseInt(data.store_id);

  queryUpdateStore = `UPDATE Stores SET store_name = ?, store_address = ? WHERE store_id = ?`;
  selectStores = `SELECT * FROM Stores WHERE store_id = ?`;

  // 1st query
  db.pool.query(
    queryUpdateStore,
    [name, address, id],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        // 2nd query
        db.pool.query(selectStores, [id], function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            res.send(rows);
          }
        });
      }
    }
  );
});

//update sales has books
app.put("/update-sales-has-books-form-ajax", function (req, res, next) {
  let data = req.body;
  let salesHasBooksID = parseInt(data.sales_has_books_id);
  let sale = parseInt(data.sale);
  let book = parseInt(data.book);

  console.log(sale, book);

  queryUpdateBook = `UPDATE Sales_has_Books SET sale = ?, book = ? WHERE sales_has_books_id = ?`;
  selectBook = `SELECT Sales_has_Books.sales_has_books_id, Sales_has_Books.sale, Books.title
    FROM Sales_has_Books
    INNER JOIN Books ON Sales_has_Books.book = Books.book_id
    WHERE sales_has_books_id = ?;`;

  // 1st query
  db.pool.query(
    queryUpdateBook,
    [sale, book, salesHasBooksID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        // console.log("second query");
        // 2nd query
        db.pool.query(
          selectBook,
          [salesHasBooksID],
          function (error, rows, fields) {
            if (error) {
              console.log(error);
              res.sendStatus(400);
            } else {
              // console.log("we good");
              res.send(rows);
            }
          }
        );
      }
    }
  );
});

/*
   LISTENER
*/
app.listen(PORT, function () {
  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});
