// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors / GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11


// Get the object to modify
let updateCustomer = document.getElementById("update-customer-form-ajax");

// Modification
updateCustomer.addEventListener("submit", function (e) {
    // prevents form submission
    e.preventDefault();

    // get form fields, then get values
    let inputID = document.getElementById("update-customerID");
    let inputName = document.getElementById("updateCustName");
    let inputEmail = document.getElementById("updateCustEmail");

    let IDValue = inputID.value;
    let NameValue = inputName.value;
    let EmailValue = inputEmail.value;

    // Make a JSON with the data we want to send
    let data = {
        customer_id: IDValue,
        name: NameValue,
        email: EmailValue,
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-customer-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Direct AJAX resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the book's location
            updateRow(xhttp.response, IDValue);

            // Clear the input fields for another transaction
            inputID.value = "";
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

    var table = document.getElementById("customers-table");

    for (var i = 0, row; (row = table.rows[i]); i++) {
        if (row.getAttribute("data-value") == parseData[0].customer_id) {
            var updatedName = parseData[0].name;
            var updatedEmail = parseData[0].email;

            // Find the row and cells where the update is being made
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td_name = updateRowIndex.getElementsByTagName("td")[1];
            let td_email = updateRowIndex.getElementsByTagName("td")[2];

            // update cells
            td_name.innerHTML = updatedName;
            td_email.innerHTML = updatedEmail;

            break;
        }
    }
}