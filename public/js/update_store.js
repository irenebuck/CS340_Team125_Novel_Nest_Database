// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Get the object to modify
let updateStore = document.getElementById("update-store-form-ajax");

// Modification
updateStore.addEventListener("submit", function (e) {
  // prevents form submission
  e.preventDefault();

  // get form fields, then get values
  let inputID = document.getElementById("update-storeID");
  let inputName = document.getElementById("updateStoreName");
  let inputAddress = document.getElementById("updateStoreAddress");

  let IDValue = inputID.value;
  let NameValue = inputName.value;
  let AddressValue = inputAddress.value;

  // Make a JSON with the data we want to send
  let data = {
    store_id: IDValue,
    store_name: NameValue,
    store_address: AddressValue,
  };

  // Setup AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-store-form-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Direct AJAX resolution
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Update the book's location
      updateRow(xhttp.response, IDValue);

      // Clear the input fields for another transaction
      inputID.value = "";
      inputName.value = "";
      inputAddress.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send request and await response
  xhttp.send(JSON.stringify(data));
});

function updateRow(data) {
  let parseData = JSON.parse(data);

  var table = document.getElementById("stores-table");

  for (var i = 0, row; (row = table.rows[i]); i++) {
    if (row.getAttribute("data-value") == parseData[0].store_id) {
      var updatedName = parseData[0].store_name;
      var updatedAddress = parseData[0].store_address;

      // find row related to id
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      // find applicable cells that will update
      let td_name = updateRowIndex.getElementsByTagName("td")[1];
      let td_address = updateRowIndex.getElementsByTagName("td")[2];
      // update the values in the cells
      td_name.innerHTML = updatedName;
      td_address.innerHTML = updatedAddress;

      break;
    }
  }
}
