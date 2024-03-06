// Modification
updateLocation.addEventListener("submit", function (e) {

    // prevents form submission
    e.preventDefault();

    // get form fields, then get values
    let inputBookID = document.getElementById("input-bookID");
    let inputBookPrice = document.getElementById("input-newPrice");
    let bookIDValue = inputBookID.value;
    let newBookPrice = inputBookPrice.value;

    // Stop if either value is NULL
    if (isNaN(bookIDValue) || isNaN(newBookPrice)) {
        return;
    }

    // Make a JSON with the data we want to send
    let data = {
        book_id: bookIDValue,
        price: newBookPrice
    }
    console.log(data)

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Direct AJAX resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the book's location
            updateRow(xhttp.response, bookIDValue);

            // Clear the input fields for another transaction
            inputBookID.value = '';
            inputBookPrice.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request and await response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, book) {
    let parseData = JSON.parse(data);

    var table = document.getElementById("books-table");
    var counter;

    for (var i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == book) {
            var counter = i;
            // Creates reference to the books table we want to update
            let currentTable = document.getElementById("books-table");
            // Get the locaiton where we found the matching book
            let updateRowIndex = currentTable.getElementsByTagName("tr")[counter];
            // Get the td of location value
            var td = updateRowIndex.getElementsByTagName("td")[4];
            // Reassign location
            td.innerHTML = parseData[0].newPrice;
        }
    }
}