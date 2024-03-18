// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors / GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11

// Get the object to modify
let updateSalesHasBooks = document.getElementById(
    "update-sales-has-books-form-ajax"
);

// Modification
updateSalesHasBooks.addEventListener("submit", function (e) {

    // prevents form submission
    e.preventDefault();

    // get form fields
    let inputID = document.getElementById("update-books-saleID");
    let inputSale = document.getElementById("newSale");
    let inputBook = document.getElementById("newBook");

    // get the values in the form fields
    let IDValue = inputID.value;
    let SaleValue = inputSale.value;
    let BookValue = inputBook.value;

    // Stop if either value is NULL
    if (isNaN(IDValue) || isNaN(SaleValue) || isNaN(BookValue)) {
        console.log("caught null");
        return;
    }

    // Make a JSON with the data we want to send
    let data = {
        sales_has_books_id: IDValue,
        sale: SaleValue,
        book: BookValue,
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-sales-has-books-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Direct AJAX resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the book's location
            updateRow(xhttp.response, IDValue);

            // Clear the input fields for another transaction
            inputID.value = "";
            inputBook.value = "";
            inputSale.value = "";
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send request and await response
    xhttp.send(JSON.stringify(data));
});

function updateRow(data) {
    let parseData = JSON.parse(data);

    console.log(parseData);

    var table = document.getElementById("sale_books_table");

    for (var i = 0, row; (row = table.rows[i]); i++) {
        if (row.getAttribute("data-value") == parseData[0].sales_has_books_id) {
            var updatedSale = parseData[0].sale;
            var updatedBook = parseData[0].title;

            //update a cell here
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td_sale = updateRowIndex.getElementsByTagName("td")[1];
            let td_book = updateRowIndex.getElementsByTagName("td")[2];

            td_sale.innerHTML = updatedSale;
            td_book.innerHTML = updatedBook;

            break;
        }
    }
}
