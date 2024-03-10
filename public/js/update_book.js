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

  // console.log("updating book data: ", data);

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

//data = price, book_id, rows (row that data is in)
function updateRow(data) {
  let parseData = JSON.parse(data);

  // console.log("info passed to updateRow: ", parseData[0].book_id);

  var table = document.getElementById("books-table");
  // console.log("table", table);

  for (var i = 0, row; (row = table.rows[i]); i++) {
    if (row.getAttribute("data-value") == parseData[0].book_id) {
      var updatedPrice = parseData[0].price;

      //update a cell here

      let updateRowIndex = table.getElementsByTagName("tr")[i];

      let td = updateRowIndex.getElementsByTagName("td")[4];

      td.innerHTML = updatedPrice;

      break;
    }
  }
}
