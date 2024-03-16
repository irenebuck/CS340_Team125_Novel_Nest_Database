// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Get the objects we need to modify
let addSalesHasBooksForm = document.getElementById(
    "add-sales-has-books-form-ajax"
);

// Modify the objects we need
addSalesHasBooksForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSale = document.getElementById("input-sale");
    let inputBook = document.getElementById("input-book");

    // Get the values from the form fields
    let BookValue = inputBook.value;
    let SaleValue = inputSale.value;

    // Put our data we want to send in a javascript object
    let data = {
        sale: SaleValue,
        book: BookValue,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sales-has-books-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // console.log("xhttp block");
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSale.value = "";
            inputBook.value = "";
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log(
                "There was an error with the input. status: ",
                xhttp.status,
                " readystate: ",
                xhttp.readyState
            );
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {
    // console.log("adding row to table in add_book.js" + data)

    // Get a reference to the current table on the pPrice and clear it out.
    let currentTable = document.getElementById("sales_books_table");
    console.log(currentTable);

    // // Get the location where we should insert the new row (end of table) - we never use this
    // let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    console.log(parsedData);

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let SaleCell = document.createElement("TD");
    let BookCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.sales_has_books_id;
    SaleCell.innerText = newRow.sale;
    BookCell.innerText = newRow.book;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(SaleCell);
    row.appendChild(BookCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute("data-value", newRow.sales_has_books_id);

    // Add the row to the table
    currentTable.appendChild(row);
};