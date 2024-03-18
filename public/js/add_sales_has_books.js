// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors / GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11

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

addRowToTable = (data) => {
    // Get a reference to the current table on the pPrice and clear it out.
    let currentTable = document.getElementById("sale_books_table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let SaleCell = document.createElement("TD");
    let BookCell = document.createElement("TD");
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";

    deleteCell.onclick = function () {
        deleteSalesHasBooks(parsedData[parsedData.length - 1].sales_has_books_id);
    };

    // Fill the cells with correct data
    idCell.innerText = newRow.sales_has_books_id;
    SaleCell.innerText = newRow.sale;
    BookCell.innerText = newRow.title;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(SaleCell);
    row.appendChild(BookCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute("data-value", newRow.sales_has_books_id);

    // Add the row to the table
    currentTable.appendChild(row);
};

