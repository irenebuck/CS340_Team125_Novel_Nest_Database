-- Project Group 125
-- Data Definition Queries

--- SELECTS ---

-- select all books
SELECT * FROM Books;

-- select all stores
SELECT * FROM Stores;

-- select all customers
SELECT * FROM Customers;

-- select all sales
SELECT * FROM Sales;

-- select all sales , replace fks location and customer with name from stores and customers table
SELECT Sales.sale_id, Stores.store_name AS location, Customers.name AS sale_customer, Sales.sales_no_tax, Sales.tax_collected, Sales.purchase_date 
FROM Sales 
INNER JOIN Stores ON Sales.location = Stores.store_id 
INNER JOIN Customers ON Sales.sale_customer = Customers.customer_id 
ORDER BY Sales.sale_id ASC;

-- select all sales_has_books , replace fk books with title from books table
SELECT Sales_has_Books.sales_has_books_id, Sales_has_Books.sale, Books.title
FROM Sales_has_Books
INNER JOIN Books ON Sales_has_Books.book = Books.book_id
ORDER BY Sales_has_Books.sales_has_books_id ASC;

--- INSERTS ---

-- insert a new store
INSERT INTO Stores (store_name, store_address)
VALUES (:store_name, :store_address);

-- insert a new customer
INSERT INTO Customers (name, email)
VALUES (:name, :email);

-- insert a new book
INSERT INTO Books (location, title, author, genre, purchased_price)
VALUES (:location, :title, :author, :genre, :purchased_price);

-- insert a new sale
INSERT INTO SALES (location, sale_customer, sales_no_tax, tax_collected, purchase_date)
VALUES (:location, :sale_customer, :sales_no_tax, :tax_collected, :purchase_date);

-- insert a sales_has_books record
INSERT INTO Sales_has_Books (sale, book)
VALUES (:sale, :book);

--- DELETES ---

-- delete a book from Books
DELETE FROM Books
WHERE book_id = :book_id;

-- delete a store from Stores
DELETE FROM Stores
WHERE store_id = :store_id;

-- delete a customer
DELETE FROM Customers WHERE customer_id = ?;

-- delete sales has books record
DELETE FROM Sales_has_Books WHERE sales_has_books_id = ?;

-- delete a sale
DELETE FROM Sales WHERE sale_id = ?;

--- UPDATES ---

-- update a book
UPDATE Books SET title = ?, author = ?, genre = ?, price = ? WHERE book_id = ?;

-- update customer
UPDATE Customers SET name = ?, email = ? WHERE customer_id = ?;

-- update store
UPDATE Stores SET store_name = ?, store_address = ? WHERE store_id = ?;

-- update sales
UPDATE Sales_has_Books SET sale = ?, book = ? WHERE sales_has_books_id = ?;
