// Citation for the following webpage:
// Date: 3/1/2024
// The following source was used to write the following code
// Code source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data


// Get the object to modify
let updateBook = document.getElementById("update-book-form-ajax");

// Modification
updateBook.addEventListener("submit", function (e) {

    // prevents form submission
    e.preventDefault();

    // get form fields
    let inputID = document.getElementById("update-bookID");
    let inputTitle = document.getElementById("newTitle");
    let inputAuthor = document.getElementById("newAuthor");
    let inputGenre = document.getElementById("newGenre");
    let inputPrice = document.getElementById("newPrice");
    
    // get the values in the form fields
    let IDValue = inputID.value;
    let TitleValue = inputTitle.value;
    let AuthorValue = inputAuthor.value;
    let GenreValue = inputGenre.value;
    let PriceValue = inputPrice.value;

    // Stop if either value is NULL
    if (isNaN(IDValue) || isNaN(PriceValue))
    {
        return;
    }

    // Make a JSON with the data we want to send
    let data = {
        book_id: IDValue,
        title: TitleValue,
        author: AuthorValue,
        genre: GenreValue,
        price: PriceValue          
    }
    console.log(data)  

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-book-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Direct AJAX resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the book's location
            updateRow(xhttp.response, IDValue);

            // Clear the input fields for another transaction
            inputID.value = "";
            inputTitle.value = "";
            inputAuthor.value = "";
            inputGenre.value = "";
            inputPrice.value = "";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request and await response
    xhttp.send(JSON.stringify(data));
    location.reload();
})


function updateRow(data, book) {
    let parseData = JSON.parse(data);

    var table = document.getElementById("books-table");

    for (var i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute("data-value") == book) {
            var updatedTitle = parseData[0].title;
            var updatedAuthor = parseData[0].author;
            var updatedGenre = parseData[0].genre;
            var updatedPrice = parseData[0].price;

            //update a cell here
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td_title = updateRowIndex.getElementsByTagName("td")[2];
            let td_author = updateRowIndex.getElementsByTagName("td")[3];
            let td_genre = updateRowIndex.getElementsByTagName("td")[4];
            let td_price = updateRowIndex.getElementsByTagName("td")[5];

            td_title.innerHTML = updatedTitle;
            td_author.innerHTML = updatedAuthor;
            td_genre.innerHTML = updatedGenre;
            td_price.innerHTML = updatedPrice;

            break;
        }
    }
}