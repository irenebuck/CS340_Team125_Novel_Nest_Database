
Citation for the following webpage and database project:

A sample code from a similar front and backend CRUD implementation was used to write our project code. 
Date: 3/18/2024
Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
Sample code authors: gkochera - George Kochera, Dr. Curry - currym-osu, Cortona1, and dmgs11 

**Overview**

Novel Nest is a small, independent bookseller with three physical locations. With an average of 15,000 used book sales from 2021 to 2023 and over 10,000 customers on file, managing inventory is key to maximizing sales. The owner is looking to increase sales by 10% this year, an additional 1,500 books for a total number of sales in 2024 of 16,500 books.

Implementing a database-driven website for this business ensures real-time inventory updates, offers valuable sales metrics like which store is selling the most, and email marketing potential to existing customers. A database-driven website will record Sales of Books to Customers at three different Stores.

PK = Primary Key
FK =Foreign Key
NN = Not Null


**Database Outline**

**Stores:** three stores, name and address needed for invoicing. Inventory pulled from Books entity. 
store_id: int(11), auto_increment, unique, NN, PK
store_name: VARCHAR(255), NN
store_address: VARCHAR(255), NN
Relationships:
- 1:M between Stores and Sales as one store can sell many books but only one location can ring up a transaction, implemented with Stores primary key store_id as a foreign key in Sales.
- 1:M between Stores and Books as one store can have many books on its shelves but a single physical book can be in one place. Each book in inventory will have its own book_id; the same title and author for two copies will have two unique book_id attributes. This is implemented with Stores primary key store_id as a foreign key in Books.

**Books:** each book in inventory will have all attributes completed with just one answer. A book could be returned and resold, potentially being sold many times. To see the inventory at a store, you’d sort this table by location. Purchase price is what the owner paid for the used book. A gifted book is entered as $0. 
book_id: int(11), auto_increment, unique, NN, PK
location: store_id from Stores entity, int(11), NN, FK
title: VARCHAR(255), NN
genre: VARCHAR(255), NN
purchase_price: decimal(10,2), NN
Relationships:
- M:N between Sales and Books, see Sales_has_Books entity.

**Customers:** future store openings would rely on zip codes and date of births would be relied on for annual birthday month coupons. Customers are not attached to a local store. 
customer_id: int(11), auto_increment, unique, NN, PK
name: VARCHAR(255), NN
email: VARCHAR(255), NN
Relationships:
- 1:M between Customers and Sales as one customer may have many transactions but one transaction is attributed to a single customer, implemented with customer_id as FK from Customers in Sales. 

**Sales:** tracks each sale, which store it was purchased from, and which customer made the purchase. Sales_no_tax is the selling price of the book. 
sale_id: int(11), auto_increment, unique, NN, PK
location: store_id from Stores entity, int(11), NN, FK
sale_customer: customer_id from Customers entity,  int(11),  FK
sales_no_tax: decimal(10,2), NN
tax_collected: decimal(10,2), NN
purchase_date: date, NN
Relationships:
- 1:M between Location and Sales as one location will have many sales/transactions but a sale can only occur at one location, implemented with store_id as FK from Locations.
- M:N between Sales and Books, see Sales_has_Books entity.
If the customer exists in the system with a customer_id, M:1 relationship between Sales and Customer using Customer entity’s customer_id as a FK in Sales.

**Sales_has_Books:** tracks the books sold in each sale.
sales_has_books_id: int(11), auto_increment, unique, NN, PK
sale: sale_id from Sales entity, int(11), unique, NN, FK
book: book_id from Books entity, int(11), unique, NN, FK
Relationships:
- M:N relationship between Sales and Books. One sale can have many books and one book can be a part of multiple sales.

