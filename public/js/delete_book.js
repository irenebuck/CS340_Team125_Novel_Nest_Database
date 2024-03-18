// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors / GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11


function deleteBook(book_id) {
    var link = '/delete-book-ajax/';
    let data = {
        book_id: book_id
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8", 
        success: function (result) {
            deleteRow(book_id);
        }
    })
}

function deleteRow(book_id) {
    let table = document.getElementById("books-table");

    // skip the first row of table (the header)
    for (let i = 1, row; row = table.rows[i]; i++) {
        console.log(table.rows[i].getAttribute("data-value"));
        if (table.rows[i].getAttribute("data-value") == book_id) {
            console.log("Performing delete operation...");
            table.deleteRow(i);
            break;
        }
    }
}