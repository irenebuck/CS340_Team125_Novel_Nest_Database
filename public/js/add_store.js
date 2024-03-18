// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors / GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11


// Get the objects we need to modify
let addStoreForm = document.getElementById('add-store-form-ajax');

// Modify the objects we need
addStoreForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();
    debugger;

    // Get form fields we need to get data from
    let input_name = document.getElementById("storeName");
    let input_store_address = document.getElementById("storeAddress");


    // Get the values from the form fields
    let nameValue = input_name.value;
    let addressValue = input_store_address.value;


    // Put our data we want to send in a javascript object
    let data = {
        store_name: nameValue,
        store_address: addressValue
    }

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

    let currentTable = document.getElementById("stores-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let addressCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.store_id;
    nameCell.innerText = newRow.store_name;
    addressCell.innerText = newRow.store_address;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteStore(newRow.store_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(NameCell);
    row.appendChild(AddressCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.store_id);

    // Add the row to the table
    currentTable.appendChild(row);
}