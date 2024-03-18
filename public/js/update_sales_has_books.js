// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Get the object to modify
let updateSalesHasBooks = document.getElementById(
  "update-sales-has-books-form-ajax"
);

// Modification
updateSalesHasBooks.addEventListener("submit", function (e) {
  //   console.log("updating a book - update_book.js");

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
  console.log(data);

  //   debugger;

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
  //   location.reload();
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
