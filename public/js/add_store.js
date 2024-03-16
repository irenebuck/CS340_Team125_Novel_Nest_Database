// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data


// Get the objects we need to modify
let addStoreForm = document.getElementById('add-store-form-ajax');

// Modify the objects we need
addStoreForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_name = document.getElementById("storeName");
    let input_store_address = document.getElementById("storeAddress");


    // Get the values from the form fields
    let nameValue = input_name.value;
    let storeAddressValue = input_store_address.value;


    // Put our data we want to send in a javascript object
    let data = {
        store_name: nameValue,
        store_address: storeAddressValue
    }

    console.log("data: ", data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-store-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_name.value = '';
            input_store_address.value = '';
            // location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload();
})

// Creates a single row from an Object representing a single record from 
addRowToTable = (data) => {

    // Get a reference to the current table on the pPrice and clear it out.
    let currentTable = document.getElementById("stores-table");
    console.log("cur table: ", currentTable)

    // // Get the location where we should insert the new row (end of table) - we never use this
    // let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    console.log(data, parsedData)

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let NameCell = document.createElement("TD");
    let AddressCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.store_id;
    NameCell.innerText = newRow.store_name;
    AddressCell.innerText = newRow.store_address;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteStore(newRow.store_id);
    };

    editCell = document.createElement("button");
    editCell.innerHTML = "Edit";
    editCell.onclick = function () {
        updateStore(newRow.store_id);
    };


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(NameCell);
    row.appendChild(AddressCell);
    row.appendChild(deleteCell);
    // row.appendChild(editCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.store_id);

    // Add the row to the table
    currentTable.appendChild(row);
}