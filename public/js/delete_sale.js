// Citation for the following webpage:
// Date: 3/5/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data


function deleteSale(sale_id) {
    var link = '/delete-sale-ajax/';
    let data = {
        sale_id: sale_id
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(sale_id);
        }
    })
}

function deleteRow(sale_id) {
    let table = document.getElementById("sales-table");

    // skip the first row of table (the header)
    for (let i = 1, row; row = table.rows[i]; i++) {
        console.log(table.rows[i].getAttribute("data-value"));
        if (table.rows[i].getAttribute("data-value") == sale_id) {
            console.log("Performing delete operation...");
            table.deleteRow(i);
            break;
        }
    }
}