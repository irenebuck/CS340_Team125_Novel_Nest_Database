// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Get the object to modify
let updateCustomer = document.getElementById("put-customer-form-ajax");

// Modification
updateCustomer.addEventListener("submit", function (e) {
  console.log("updating customer - update_customer.js");
  // prevents form submission
  e.preventDefault();

  // get form fields, then get values
  let inputCustomer = document.getElementById("update-customerID");
  let inputName = document.getElementById("updateCustName");
  let inputEmail = document.getElementById("updateCustEmail");

  let CustomerValue = inputCustomer.value;
  let NameValue = inputName.value;
  let EmailValue = inputEmail.value;

  // Make a JSON with the data we want to send
  let data = {
    customer_id: CustomerValue,
    name: NameValue,
    email: EmailValue,
  };

  console.log("data: ", data);

  // Setup AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-customer-form-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Direct AJAX resolution
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Update the book's location
      updateRow(xhttp.response, CustomerValue);

      // Clear the input fields for another transaction
      inputCustomer.value = "";
      inputName.value = "";
      inputEmail.value = "";
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

  var table = document.getElementById("customers-table");
  // console.log("table", table);

  for (var i = 0, row; (row = table.rows[i]); i++) {
    if (row.getAttribute("data-value") == parseData[0].customer_id) {
      var updatedName = parseData[0].name;
      var updatedEmail = parseData[0].email;

      //update a cell here

      let updateRowIndex = table.getElementsByTagName("tr")[i];

      let td_name = updateRowIndex.getElementsByTagName("td")[1];
      let td_email = updateRowIndex.getElementsByTagName("td")[2];

      td_name.innerHTML = updatedName;
      td_email.innerHTML = updatedEmail;

      break;
    }
  }
}
