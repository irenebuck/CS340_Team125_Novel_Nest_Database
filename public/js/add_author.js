// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data


// Get the objects we need to modify
let addAuthorForm = document.getElementById('add_author');

// Modify the objects we need
addAuthorForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_author_fname = document.getElementById("authorfName");
    let input_author_lname = document.getElementById("authorlName");
    

    // Get the values from the form fields
    let fNameValue = input_author_fname.value;
    let lNameValue = input_author_lname.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        first_name: fNameValue,
        last_name: lNameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_author", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            input_author_fname.value = '';
            input_author_lname.value = '';
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

    let currentTable = document.getElementById("authors-table");

    // // Get the location where we should insert the new row (end of table) - we never use this
    // let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let fNameCell = document.createElement("TD");
    let lNameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.author_id;
    fNameCell.innerText = newRow.first_name;
    lNameCell.innerText = newRow.last_name;

    updateCell = document.createElement("button");
    updateCell.innerHTML = "Edit";
    updateCell.onclick = function () {
        updateAuthor(newRow.author_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(fNameCell);
    row.appendChild(lNameCell);
    row.appendChild(updateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.author_id);

    // Add the row to the table
    currentTable.appendChild(row);
};