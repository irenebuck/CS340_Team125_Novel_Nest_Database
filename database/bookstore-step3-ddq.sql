-- Project Group 125
-- Step3 Draft
-- Data Definition Queries

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- create stores table
CREATE OR REPLACE TABLE Stores (
    store_id INT NOT NULL AUTO_INCREMENT, -- pk
    store_name VARCHAR(255) NOT NULL,
    store_address VARCHAR(255) NOT NULL,
    PRIMARY KEY (store_id)
);

-- create authors table
CREATE OR REPLACE TABLE Authors (
    author_id INT NOT NULL AUTO_INCREMENT, -- pk
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (author_id)
);

-- create books table
CREATE OR REPLACE TABLE Books (
    book_id INT NOT NULL AUTO_INCREMENT, -- pk
    location INT NOT NULL,  -- fk, store_id from Stores
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    purchased_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (book_id),
    FOREIGN KEY (location) REFERENCES Stores(store_id)
);

-- create books_has_authors table
CREATE OR REPLACE TABLE Book_has_Authors (
    book_has_authors_id INT NOT NULL AUTO_INCREMENT, -- pk
    book INT NOT NULL, -- fk, book_id from Books
    author INT NOT NULL, -- fk, author_id from Authors
    PRIMARY KEY (book_has_authors_id),
    FOREIGN KEY (book) REFERENCES Books(book_id),
    FOREIGN KEY (author) REFERENCES Authors(author_id)
);

-- create customers table
CREATE OR REPLACE TABLE Customers (
    customer_id INT NOT NULL AUTO_INCREMENT, -- pk
    name VARCHAR(255),
    email VARCHAR(255),
    PRIMARY KEY (customer_id)
);

-- create sales table
CREATE OR REPLACE TABLE Sales (
    sale_id INT NOT NULL AUTO_INCREMENT, -- pk
    location INT NOT NULL, -- fk, store_id from Stores
    sale_customer INT NOT NULL, -- fk, customer_id from Customers
    sales_no_tax DECIMAL(10, 2) NOT NULL,
    tax_collected DECIMAL(10, 2) NOT NULL,
    purchase_date DATETIME NOT NULL,
    PRIMARY KEY (sale_id),
    FOREIGN KEY (location) REFERENCES Stores(store_id),
    FOREIGN KEY (sale_customer) REFERENCES Customers(customer_id)
);

-- create sales_has_books table
CREATE OR REPLACE TABLE Sales_has_Books (
    sales_has_books_id INT NOT NULL AUTO_INCREMENT, -- pk
	sale INT NOT NULL, -- fk, sale_id from Sales
    book INT NOT NULL, -- fk, book_id from Books
	PRIMARY KEY (sales_has_books_id),
    FOREIGN KEY (sale) REFERENCES Sales(sale_id),
    FOREIGN KEY (book) REFERENCES Books(book_id)
);

-- add data to Stores table
INSERT INTO Stores (store_name, store_address)
VALUES
    ('Novel Nest - Portland', '1825 SW Broadway, Portland, OR 97201'),
    ('Novel Nest - Corvallis', '1500 SW Jefferson Way, Corvallis, OR 97331'),
    ('Novel Nest - Rocklin', '5100 Sierra College Blvd, Rocklin, CA 95677');

-- add data to Authors table
INSERT INTO Authors (first_name, last_name)
VALUES
    ('Wanda', 'Dunn'),
    ('Stephen', 'Cooper'),
    ('Randy', 'Pausch'),
    ('Stephen', 'Kochan'),
    ('Marijn', 'Haverbeke'),
    ('Micheal', 'Kerrisk'),
    ('Simson', 'Garfinkel'),
    ('Gene', 'Spafford'),
    ('Alan', 'Schwartz'),
    ('Jeffrey', 'Zaslow');

-- add data to Books table
INSERT INTO Books (location, title, genre, purchased_price)
VALUES
    ((SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Portland'), 'Practical Unix & Internet Security', 'Technology', 30),
    ((SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Corvallis'), 'Eloquent JavaScript', 'Self-Help', 25),
    ((SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Rocklin'), 'Programming In C', 'Technology', 30),
    ((SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Corvallis'), 'The Linux Programming Interface', 'Technology', 45),
    ((SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Rocklin'), 'Learning To Program In ALICE', 'Romance', 15),
    ((SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Portland'), 'The Last Lecture', 'Autobiography', 10);

-- add data to Customers table
INSERT INTO Customers (name, email)
VALUES
    ('Deshawn Cooper', 'Cooper_Man@gmail.com'),
    ('Lily Baber', 'im_such_a_babe@yahoo.com'),
    ('Francis Lee', 'OleeOleeO@gmail.com'),
    ('Jin Park', 'pahkthecahinhavadyahd@gmail.com'),
    ('Juan Ruiz', 'juanado@osu.edu');

-- add data to Sales table
INSERT INTO Sales (location, sale_customer, sales_no_tax, tax_collected, purchase_date)
VALUES
    (
        (SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Portland'),
        (SELECT customer_id FROM Customers WHERE name = 'Jin Park'),
        40,
        4.00,
        '2020-01-01 13:00:00'
    ),
    (
        (SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Corvallis'),
        (SELECT customer_id FROM Customers WHERE name = 'Lily Baber'),
        15,
        1.50,
        '2021-02-02 15:14:00'
    ),
    (
        (SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Corvallis'),
        (SELECT customer_id FROM Customers WHERE name = 'Juan Ruiz'),
        35,
        3.50,
        '2022-03-03 16:00:00'
    ),
    (
        (SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Rocklin'),
        (SELECT customer_id FROM Customers WHERE name = 'Juan Ruiz'),
        40,
        4.00,
        '2023-08-08 09:01:00'
    ),
    (
        (SELECT store_id FROM Stores WHERE store_name = 'Novel Nest - Portland'),
        (SELECT customer_id FROM Customers WHERE name = 'Deshawn Cooper'),
        60,
        6.00,
        '2024-02-14 11:11:00'
    );

-- add data to Book_has_Authors table
INSERT INTO Book_has_Authors (book, author)
VALUES
    (
        (SELECT book_id FROM Books WHERE title = 'Practical Unix & Internet Security'),
        (SELECT author_id FROM Authors WHERE first_name = 'Simson' AND last_name = 'Garfinkel')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'Practical Unix & Internet Security'),
        (SELECT author_id FROM Authors WHERE first_name = 'Gene' AND last_name = 'Spafford')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'Practical Unix & Internet Security'),
        (SELECT author_id FROM Authors WHERE first_name = 'Alan' AND last_name = 'Schwartz')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'Eloquent JavaScript'),
        (SELECT author_id FROM Authors WHERE first_name = 'Marijn' AND last_name = 'Haverbeke')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'Programming In C'),
        (SELECT author_id FROM Authors WHERE first_name = 'Stephen' AND last_name = 'Kochan')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'The Linux Programming Interface'),
        (SELECT author_id FROM Authors WHERE first_name = 'Micheal' AND last_name = 'Kerrisk')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'Learning To Program In ALICE'),
        (SELECT author_id FROM Authors WHERE first_name = 'Wanda' AND last_name = 'Dunn')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'Learning To Program In ALICE'),
        (SELECT author_id FROM Authors WHERE first_name = 'Stephen' AND last_name = 'Cooper')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'Learning To Program In ALICE'),
        (SELECT author_id FROM Authors WHERE first_name = 'Randy' AND last_name = 'Pausch')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'The Last Lecture'),
        (SELECT author_id FROM Authors WHERE first_name = 'Randy' AND last_name = 'Pausch')
    ),
    (
        (SELECT book_id FROM Books WHERE title = 'The Last Lecture'),
        (SELECT author_id FROM Authors WHERE first_name = 'Jeffrey' AND last_name = 'Zaslow')
    );

-- add data to Sales_has_Books table
INSERT INTO Sales_has_Books (sale, book)
VALUES
(
    (SELECT sale_id FROM Sales WHERE purchase_date = '2020-01-01 13:00:00' AND location = '1'),
    (SELECT book_id FROM Books WHERE title = 'Programming In C')
),
(
    (SELECT sale_id FROM Sales WHERE purchase_date = '2021-02-02 15:14:00' AND location = '2'),
    (SELECT book_id FROM Books WHERE title = 'The Last Lecture')
),
(
    (SELECT sale_id FROM Sales WHERE purchase_date = '2022-03-03 16:00:00' AND location = '2'),
    (SELECT book_id FROM Books WHERE title = 'Eloquent JavaScript')
),
(
    (SELECT sale_id FROM Sales WHERE purchase_date = '2023-08-08 09:01:00' AND location = '3'),
    (SELECT book_id FROM Books WHERE title = 'Practical Unix & Internet Security')
),
(
    (SELECT sale_id FROM Sales WHERE purchase_date = '2024-02-14 11:11:00' AND location = '1'),
    (SELECT book_id FROM Books WHERE title = 'Programming In C')
),
(
    (SELECT sale_id FROM Sales WHERE purchase_date = '2024-02-14 11:11:00' AND location = '1'),
    (SELECT book_id FROM Books WHERE title = 'Practical Unix & Internet Security')
);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
