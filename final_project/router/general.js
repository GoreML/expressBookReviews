const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.use(express.json());

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Account created successfully."});
    } else {
      return res.status(404).json({message: "User already exists."});
    }
  } 
  return res.status(404).json({message: "Unable to register."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  //res.send(JSON.stringify(books,null,4));
  try {
    const response = await axios.get('http://localhost:5000/');

    console.error(response.data);
    //return res.status(200).send(JSON.stringify(" ", null, 4));
   
    if (response.data) {
        return res.status(200).send(JSON.stringify(response.data[books], null, 4));
    } else {
        return res.status(404).send("cant get books, error.");
    }
    } catch (error) {
        // Handle errors, e.g., network issues or API errors
        console.error(error);
        return res.status(500).send("Internal Server Error");
    } 
});


// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  retrieveBookFromTitle(title).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});
// Task 13: Retrieve book details from title using Promise callbacks or async-await using axios
function retrieveBookFromTitle(title) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookTitle = books[bookISBN].title;
      if (bookTitle === title) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided book title does not exist"));
    }
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  //const ISBN = req.params.isbn;
  let isbn = req.params.isbn;
  //res.send(books[ISBN])
  try {
    const response = await axios.get('http://localhost:5000/');

    if (response.data[isbn]) {
      return res.status(200).send(JSON.stringify(response.data[isbn], null, 4));
    } else {
      return res.status(404).send("No book found with ISBN " + isbn);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
 });

 // Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  retrieveBookFromISBN(isbn).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});
 // Task 11: Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
function retrieveBookFromISBN(isbn) {
  let book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject(new Error("The provided book does not exist"));
    }
  });
}

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //let mylist= [] 
    let author = req.params.author;
    let booksByAuthor = [];
    /*
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                mylist.push(books[key]);
            }
        }
    }
    if(mylist.length == 0){
        return res.status(300).json({message: "No books available."});
    }
    res.send(mylist);
    */
    try {
        // Assuming the API endpoint for getting all books is http://localhost:5000/books
        const response = await axios.get('http://localhost:5000');
    
        for (let isbn in response.data) {
          if (response.data[isbn].author == author) {
            booksByAuthor.push(response.data[isbn]);
          }
        }
    
        if (booksByAuthor.length > 0) {
          return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
        } else {
          return res.status(404).send("No book found with author " + author);
        }
    } catch (error) {
        // Handle errors, e.g., network issues or API errors
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});


// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  retrieveBookFromAuthor(author).then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});
// Task 12: Retrieve book details by author using Promise Callbacks or async-await using axios
function retrieveBookFromAuthor(author) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookAuthor = books[bookISBN].author;
      if (bookAuthor === author) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided author does not exist"));
    }
  });
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  //let mylist= []
  let title = req.params.title;
  let booksByTitle = [];
    /*
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              mylist.push(books[key]);
          }
      }
  }
  if(mylist.length == 0){
      return res.status(300).json({message: "Book not found."});
  }
  res.send(mylist);
  */
  try {
    // Assuming the API endpoint for getting all books is http://localhost:5000/books
    const response = await axios.get('http://localhost:5000/');

    for (let isbn in response.data) {
      if (response.data[isbn].title == title) {
        booksByTitle.push(response.data[isbn]);
      }
    }

    if (booksByTitle.length > 0) {
      return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
      return res.status(404).send("No book found with title " + title);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here const ISBN = req.params.isbn;
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});


// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios
function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBookList().then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );  
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
function getFromISBN(isbn){
  let book_ = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book_) {
      resolve(book_);
    }else{
      reject("Unable to find book!");
    }    
  })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  )
 });

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.
function getFromAuthor(author){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.
function getFromTitle(title){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
