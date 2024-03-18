// Citation for the following webpage and database project:

// A sample code from a similar front and backend CRUD implementation was used to write our project code.
// Date: 3 / 18 / 2024
// Sample code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Sample code authors / GitHub users: gkochera - George Kochera, Dr.Curry - currym - osu, Cortona1, and dmgs11

// Get the objects we need to modify
let addSaleForm = document.getElementById("add-sale-form-ajax");

// Modify the objects we need
addSaleForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputLocation = document.getElementById("input-location");
  let inputCustomer = document.getElementById("input-customer");
  let inputSubtotal = document.getElementById("input-subtotal");
  let inputTax = document.getElementById("input-tax");
  let inputDate = document.getElementById("input-date");
  let inputTime = document.getElementById("input-time");

  //get datetime
  let dateTimeValue = inputDate.value + " " + inputTime.value;

  // Get the values from the form fields
  let LocationValue = inputLocation.value;
  let CustomerValue = inputCustomer.value;
  let SubtotalValue = inputSubtotal.value;
  let TaxValue = inputTax.value;
  let DateValue = inputDate.value;

  // Put our data we want to send in a javascript object
  let data = {
    location: LocationValue,
    sale_customer: CustomerValue,
    sales_no_tax: SubtotalValue,
    tax_collected: TaxValue,
    purchase_date: dateTimeValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-sale-form-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      addRowToTable(xhttp.response);

      // Clear the input fields for another transaction
      inputLocation.value = "";
      inputCustomer.value = "";
      inputSubtotal.value = "";
      inputTax.value = "";
      inputDate.value = "";
      inputTime.value = "";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log(
        "There was an error with the input. status: ",
        xhttp.status,
        " readystate: ",
        xhttp.readyState
      );
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
  // location.reload();
});

// Creates a single row from an Object representing a single record
addRowToTable = (data) => {
  // Get a reference to the current table on the pPrice and clear it out.
  let currentTable = document.getElementById("sales-table");

  // Get a reference to the new row from the database query (last object)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and 4 cells
  let row = document.createElement("TR");
  let idCell = document.createElement("TD");
  let LocationCell = document.createElement("TD");
  let CustomerCell = document.createElement("TD");
  let SubtotalCell = document.createElement("TD");
  let TaxCell = document.createElement("TD");
  let DateCell = document.createElement("TD");

  // Fill the cells with correct data
  idCell.innerText = newRow.sale_id;
  LocationCell.innerText = newRow.location;
  CustomerCell.innerText = newRow.sale_customer;
  SubtotalCell.innerText = "$" + newRow.sales_no_tax;
  TaxCell.innerText = "$" + newRow.tax_collected;
  // Format the date
  let formattedDate = new Date(newRow.purchase_date).toLocaleString();
  DateCell.innerText = formattedDate;

  // Add the cells to the row
  row.appendChild(idCell);
  row.appendChild(LocationCell);
  row.appendChild(CustomerCell);
  row.appendChild(SubtotalCell);
  row.appendChild(TaxCell);
  row.appendChild(DateCell);

  // Add a row attribute so the deleteRow function can find a newly added row
  row.setAttribute("data-value", newRow.sale_id);

  // Add the row to the table
  currentTable.appendChild(row);
};
