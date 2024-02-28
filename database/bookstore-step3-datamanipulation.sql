-- Project Group 125
-- Step3 Draft
-- Data Definition Queries

--- SELECTS ---

-- select stores
SELECT Stores.store_name AS "Store Name", Stores.store_address AS "Store Address"
FROM Stores;

-- select customers
SELECT Customers.name AS "Name", Customers.email AS "Email"
FROM Customers;

-- select authors (add all author data in addition to new "book(s)" column)
SELECT 
    Authors.first_name AS "First Name", 
    Authors.last_name AS "Last Name", 
    GROUP_CONCAT(Books.title ORDER BY Books.title ASC SEPARATOR ', ') AS Books
FROM Authors
LEFT JOIN Book_has_Authors ON Authors.author_id = Book_has_Authors.author
LEFT JOIN Books ON Book_has_Authors.book = Books.book_id
GROUP BY Authors.author_id, Authors.first_name;

-- select sales (add all sales data in addition to new "book(s) sold" column and replace all fks with actual names)
SELECT 
    Stores.store_name as "Location", 
    Customers.name as "Customer", 
    Sales.sales_no_tax as "Sale (No Tax)", 
    Sales.tax_collected as "Tax Collected", 
    Sales.purchase_date as "Purchase Date", 
    GROUP_CONCAT(Books.title ORDER BY Books.title ASC SEPARATOR ', ') AS Books
FROM Sales
LEFT JOIN Stores ON Sales.location = Stores.store_id
LEFT JOIN Customers ON Sales.sale_customer = Customers.customer_id
LEFT JOIN Sales_has_Books ON Sales.sale_id = Sales_has_Books.sale
LEFT JOIN Books ON Sales_has_Books.book = Books.book_id
GROUP BY 
    Stores.store_name, 
    Customers.name, 
    Sales.sales_no_tax, 
    Sales.tax_collected, 
    Sales.purchase_date;


-- select books (add all book data in addtion to new "author(s)" column and replace fk location with actual store name)
SELECT 
    Stores.store_name AS "Location", 
    Books.title AS "Title", Books.genre AS "Genre", 
    Books.purchased_price AS "Purchase Price", 
    GROUP_CONCAT(Authors.last_name ORDER BY Authors.last_name ASC SEPARATOR ', ') AS Authors
FROM Books
LEFT JOIN Book_has_Authors ON Books.book_id = Book_has_Authors.book
LEFT JOIN Authors ON Book_has_Authors.author = Authors.author_id
LEFT JOIN Stores ON Books.location = Stores.store_id
GROUP BY Books.book_id, Stores.store_name, Books.title, Books.genre, Books.purchased_price;

-- select Sales_has_Books
SELECT Sales_has_Books.sale AS "Sale ID", Books.title AS "Book Title"
FROM Sales_has_Books
LEFT JOIN Books ON Sales_has_Books.book = Books.book_id;

-- select Book_has_Authors
SELECT Books.title AS "Book Title", Authors.last_name AS "Author"
FROM Book_has_Authors
LEFT JOIN Books ON Book_has_Authors.book = Books.book_id
LEFT JOIN Authors ON Book_has_Authors.author = Authors.author_id;

--- INSERTS ---

-- insert a new store
INSERT INTO Stores (store_name, store_address)
VALUES (:store_name, :store_address);

-- insert a new customer
INSERT INTO Customers (name, email)
VALUES (:name, :email);

-- insert a new author
INSERT INTO Authors (first_name, last_name)
VALUES (:first_name, :last_name);

-- insert a new book (this insert will require a query getting a store_id)
INSERT INTO Books (location, title, genre, purchased_price)
VALUES (:location, :title, :genre, :purchased_price);

-- insert a new sale (this insert will require a query getting store_id, customer_id)
INSERT INTO SALES (location, sale_customer, sales_no_tax, tax_collected, purchase_date)
VALUES (:location, :sale_customer, :sales_no_tax, :tax_collected, :purchase_date);

-- insert a sales_has_books record
INSERT INTO Sales_has_Books (sale, book)
VALUES (:sale, :book);

-- insert a book_has_authors record
INSERT INTO Book_has_Authors (book, author)
VALUES (:book, :author);

--- DELETES ---

-- delete a book from Books (this delete will require a query getting a book_id)
-- deleting a book cascades to deleting the associated book_has_author entry
DELETE FROM Books
WHERE book_id = :book_id;
DELETE FROM Book_has_Authors
WHERE book = :book_id;

-- delete a store from Stores
-- deleting a store cascades to deleting the associated books at the location
DELETE FROM Stores
WHERE store_id = :store_id;
DELETE FROM Books
WHERE location = :store_id;

--- UPDATES ---

-- update a book
UPDATE Books
SET location = :location
SET title = :title
SET genre = :genre
SET purchased_price = :purchased_price
WHERE book_id = :book_id;

-- update an author
UPDATE Authors
SET first_name = :first_name
SET last_name = :last_name
WHERE author_id = :author_id;

-- -- update the customer associated with a sale
-- UPDATE Sales
-- SET sale_customer = :sale_customer
-- WHERE sale_id = :sale_id;

--- DYNAMIC SEARCH ---

-- dynamically select all location names to fill the dropdown menus
SELECT Stores.store_name
FROM Stores;

-- -- search for sales by customer
-- SELECT 
--     Stores.store_name as "Location", 
--     Customers.name as "Customer", 
--     Sales.sales_no_tax as "Sale (No Tax)", 
--     Sales.tax_collected as "Tax Collected", 
--     Sales.purchase_date as "Purchase Date", 
--     GROUP_CONCAT(Books.title ORDER BY Books.title ASC SEPARATOR ', ') AS Books
-- FROM Sales
-- LEFT JOIN Stores ON Sales.location = Stores.store_id
-- LEFT JOIN Customers ON Sales.sale_customer = Customers.customer_id
-- LEFT JOIN Sales_has_Books ON Sales.sale_id = Sales_has_Books.sale
-- LEFT JOIN Books ON Sales_has_Books.book = Books.book_id
-- WHERE Customers.name = :Customers.name
-- GROUP BY 
--     Stores.store_name, 
--     Customers.name, 
--     Sales.sales_no_tax, 
--     Sales.tax_collected, 
--     Sales.purchase_date;

-- 

--- Possible supplemental queries noted to be useful above ---

-- retrieve a store id

-- retrieve a customer id

-- retrieve a book id