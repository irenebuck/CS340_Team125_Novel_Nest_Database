// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Get the object to modify
let updateAuthor = document.getElementById("put-author-form-ajax");

// Modification
updateAuthor.addEventListener("submit", function (e) {
  console.log("updating author - update_author.js");
  // prevents form submission
  e.preventDefault();

  // get form fields, then get values
  let inputAuthor = document.getElementById("updateAuthorID");
  let inputFName = document.getElementById("authorfNameUpdate");
  let inputLName = document.getElementById("authorlNameUpdate");

  let AuthorValue = inputAuthor.value;
  let FNameValue = inputFName.value;
  let LNameValue = inputLName.value;

  // Make a JSON with the data we want to send
  let data = {
    author_id: AuthorValue,
    first_name: FNameValue,
    last_name: LNameValue,
  };

  console.log("data: ", data);

  // Setup AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-author-form-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Direct AJAX resolution
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Update the book's location
      updateRow(xhttp.response, AuthorValue);

      // Clear the input fields for another transaction
      inputAuthor.value = "";
      inputFName.value = "";
      inputLName.value = "";
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

  var table = document.getElementById("authors-table");
  // console.log("table", table);

  for (var i = 0, row; (row = table.rows[i]); i++) {
    if (row.getAttribute("data-value") == parseData[0].author_id) {
      var updatedFName = parseData[0].first_name;
      var updatedLName = parseData[0].last_name;

      //update a cell here

      let updateRowIndex = table.getElementsByTagName("tr")[i];

      let td_fname = updateRowIndex.getElementsByTagName("td")[1];
      let td_lname = updateRowIndex.getElementsByTagName("td")[2];

      td_fname.innerHTML = updatedFName;
      td_lname.innerHTML = updatedLName;

      break;
    }
  }
}
