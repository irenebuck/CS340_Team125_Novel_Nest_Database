// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Get the object to modify
let updateBook = document.getElementById("put-book-form-ajax");

// Modification
updateBook.addEventListener("submit", function (e) {
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
    price: newBookPrice,
  };

  console.log("updating book data: ", data);

  // Setup AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-book-form-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Direct AJAX resolution
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Update the book's location
      updateRow(xhttp.response, bookIDValue);

      // Clear the input fields for another transaction
      inputBookID.value = "";
      inputBookPrice.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send request and await response
  xhttp.send(JSON.stringify(data));
});

function updateRow(data, book) {
  let parseData = JSON.parse(data);

  var table = document.getElementById("books-table");
  var counter;

  //   console.log("parsed data", parseData);

  for (var i = 0, row; (row = table.rows[i]); i++) {
    if (table.rows[i].getAttribute("data-value") == book) {
      var counter = i;
      // Creates reference to the books table we want to update
      let currentTable = document.getElementById("books-table");
      // Get the locaiton where we found the matching book
      let updateRowIndex = currentTable.getElementsByTagName("tr")[counter];
      // Get the td of location value
      var td = updateRowIndex.getElementsByTagName("td")[4];
      // Reassign location
      //   td.innerHTML = parseData[0].price; //TODO: bug
    }
  }
}
