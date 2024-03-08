let updateAuthorForm = document.getElementById("update_author_form");

// Modification
updateAuthorForm.addEventListener("submit", function (e) {

    // prevents form submission
    e.preventDefault();

    // get form fields
    let author_id = document.getElementById("updateAuthorID");
    let authorFirst = document.getElementById("authorfNameUpdate");
    let authorLast = document.getElementById("authorlNameUpdate");

    // get values of form entries
    let idValue = author_id.value;
    let fnameValue = authorFirst.value;
    let lnameValue = authorLast.value;

    // Stop if either value is NULL
    if (isNaN(bookIDValue) || isNaN(newBookPrice)) {
        return;
    }

    // Make a JSON with the data we want to send
    let data = {
        author_id: idValue,
        first_name: fnameValue,
        last_name: lnameValue
    };

    // Check that the fields are completed
    for (let key in data) {
        if (!data[key]) {
            alert('Please complete first and last name,, even if you are only changing one of the fields. Thank you!');
            return;
        }
    }

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update_author_form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Direct AJAX resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the author with new data
            updateRow(xhttp.response, idValue);

            // Clear the input fields for another transaction
            author_id.value = '';
            authorFirst.value = '';
            authorLast.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request and await response
    xhttp.send(JSON.stringify(data));
    location.reload();
})


function updateRow(data, author_id) {
    let parseData = JSON.parse(data);
    let table = document.getElementById("authors-table");

    for (var i = 0, row; row = table.rows[i]; i++) {
        // if the row is the author's row(the one to update)
        if (table.rows[i].getAttribute("data-value") == author_id) {
            // save the index to rowIndex
            let rowIndex = i;
            // update the values in each cell            
            for (let j = 1; j < dataLen; j++) {
                table.rows[rowIndex].cells[j].textContent = parseData[j].value;
            }
        }
    }
};