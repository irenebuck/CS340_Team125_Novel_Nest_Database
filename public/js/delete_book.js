// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data


function deleteBook(bookID) {
    var link = '/delete-book-ajax/';
    let data = {
        book_id: bookID
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(bookID);
        }
    })
}

function deleteRow(bookID) {
    let table = document.getElementById("books-table");

    // skip the first row of table (the header)
    for (let i = 1, row; row = table.rows[i]; i++) {
        console.log(table.rows[i].getAttribute("data-value"));
        if (table.rows[i].getAttribute("data-value") == bookID) {
            console.log("Performing delete operation...");
            table.deleteRow(i);
            break;
        }
    }
}

