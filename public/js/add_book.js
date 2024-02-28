// Get the objects we need to modify
let addBookForm = document.getElementById('add-book-form-ajax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLocation = document.getElementById("input-location");
    let inputTitle = document.getElementById("input-title");
    let inputGenre = document.getElementById("input-genre");
    let inputPrice = document.getElementById("input-price");

    // Get the values from the form fields
    let LocationValue = inputLocation.value;
    let TitleValue = inputTitle.value;
    let GenreValue = inputGenre.value;
    let PriceValue = inputPrice.value;

    // Put our data we want to send in a javascript object
    let data = {
        location: LocationValue,
        title: TitleValue,
        genre: GenreValue,
        purchase_price: PriceValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputLocation.value = '';
            inputTitle.value = '';
            inputGenre.value = '';
            inputPrice.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the pPrice and clear it out.
    let currentTable = document.getElementById("books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let LocationCell = document.createElement("TD");
    let TitleCell = document.createElement("TD");
    let GenreCell = document.createElement("TD");
    let PriceCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.book_id;
    LocationCell.innerText = newRow.location;
    TitleCell.innerText = newRow.title;
    GenreCell.innerText = newRow.genre;
    PriceCell.innerText = newRow.purchase_price;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(LocationCell);
    row.appendChild(TitleCell);
    row.appendChild(GenreCell);
    row.appendChild(PriceCell);

    // Add the row to the table
    currentTable.appendChild(row);
}