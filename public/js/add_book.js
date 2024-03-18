// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors / GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11

// Get the objects we need to modify
let addBookForm = document.getElementById("add-book-form-ajax");

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {
  console.log("add book - add_book.js");

  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputLocation = document.getElementById("input-location");
  let inputTitle = document.getElementById("input-title");
  let inputAuthor = document.getElementById("input-author");
  let inputGenre = document.getElementById("input-genre");
  let inputPrice = document.getElementById("input-price");

  // Get the values from the form fields
  let LocationValue = inputLocation.value;
  let TitleValue = inputTitle.value;
  let AuthorValue = inputAuthor.value;
  let GenreValue = inputGenre.value;
  let PriceValue = inputPrice.value;

  // Put our data we want to send in a javascript object
  let data = {
    location: LocationValue,
    title: TitleValue,
    author: AuthorValue,
    genre: GenreValue,
    price: PriceValue,
  };

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
      inputLocation.value = "";
      inputTitle.value = "";
      inputAuthor.value = "";
      inputGenre.value = "";
      inputPrice.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
  // location.reload();
});

// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {
  // Get a reference to the current table on the pPrice and clear it out.
  let currentTable = document.getElementById("books-table");

  // // Get the location where we should insert the new row (end of table) - we never use this
  // let newRowIndex = currentTable.rows.length;

  // Get a reference to the new row from the database query (last object)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and 4 cells
  let row = document.createElement("TR");
  let idCell = document.createElement("TD");
  let LocationCell = document.createElement("TD");
  let TitleCell = document.createElement("TD");
  let AuthorCell = document.createElement("TD");
  let GenreCell = document.createElement("TD");
  let PriceCell = document.createElement("TD");

  // Fill the cells with correct data
  idCell.innerText = newRow.book_id;
  LocationCell.innerText = newRow.location;
  TitleCell.innerText = newRow.title;
  AuthorCell.innerText = newRow.author;
  GenreCell.innerText = newRow.genre;
  PriceCell.innerText = newRow.price;

  deleteCell = document.createElement("button");
  deleteCell.innerHTML = "Delete";
  deleteCell.onclick = function () {
    deleteBook(newRow.book_id);
  };

  // Add the cells to the row
  row.appendChild(idCell);
  row.appendChild(LocationCell);
  row.appendChild(TitleCell);
  row.appendChild(AuthorCell);
  row.appendChild(GenreCell);
  row.appendChild(PriceCell);
  row.appendChild(deleteCell);

  // Add a row attribute so the deleteRow function can find a newly added row
  row.setAttribute("data-value", newRow.book_id);

  // Add the row to the table
  currentTable.appendChild(row);
};
