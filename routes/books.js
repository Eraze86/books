const nanoId = require("nanoid");
var express = require("express");
var router = express.Router();
const fs = require ("fs");
const { Console } = require("console");

router.get("/", function (req, res) {

  fs.readFile("books.json", (err, data) =>{
    if(err){ 
      console.log("didnt work")
    }

      let books = JSON.parse(data)
      let printBooks = "";
      let h1 = `<h2>Böcker</h2>`;

      books.forEach((book) => {
      printBooks += `Namn: <a href="/books/${book.id}"> ${book.bookName}</a>, 
                Utlånad: ${book.borrowed ? "Ja" : "Nej"} <br/>
                `;

  });
  let addBooks = `Lägg till <a href="/books/newBook">ny bok</a>`;
   res.send(h1 + printBooks + addBooks);
  })
  

  


 
 

});
router.get("/newBook", function(req, res){

      let printForm = `
    
    <form action="newBook " method="post">
    <h2>lägg till ny bok</h2>
    <p>Bokens namn:</p>
    <input type="text" name="bookName">
    <p>Författare:</p>
    <input type="text" name="author">
    <p>Antal sidor:</p>
    <input type="text" name="pages">
    <button> Lägg till</button>
    `
  res.send(printForm);
})
router.post("/newBook", function (req, res) {

  fs.readFile("books.json", (err, data) => {
    if(err){
      console.log("error", err)
    }
    let books = JSON.parse(data)
    let newBook = {...req.body, id: nanoId.nanoid(), borrowed: false}
    
    books.push(newBook);
    
  
  fs.writeFile("books.json", JSON.stringify(books, null, 5), (err) => {
    if(err){
      console.log("didnt work", err)
    }
  })

  res.redirect("/books");
})
});


router.get("/:id", function (req, res) {
  fs.readFile("books.json", (err, data) => {
    if(err){
      console.log("error", err)
    } 

    let books = JSON.parse(data)
    let findBook = books.find((book) => book.id == req.params.id);
    let printBook = ` Namn: ${findBook.bookName} <br/>
                      Författare: ${findBook.author}<br/>
                      Sidor: ${findBook.pages} <br/>
                      Låna: ${findBook.borrowed ? "Utlånad" : "ledig"} <br/>
                      <a href='/books/rentBook/${findBook.id}'>Hyra</a>
                      `;
  
    res.send(printBook);
  })
 
});

router.get("/rentBook/:id", function(req, res) {
  
  fs.readFile("books.json", (err, data) => {
      if (err) {
          console.log("didnt work", err)
      }
      // Hämta
      let books = JSON.parse(data)
           // Ändra
      let findBook = books.find((book) => book.id == req.params.id)
      findBook.borrowed = true

      console.log(findBook)
      
    
      // Spara
      fs.writeFile("books.json", JSON.stringify(books, null, 5), (err) =>  {   
          if (err) {
              console.log("gick ej att låna boken")
          }
      })
      res.redirect("/books")
  })
  
})

module.exports = router;
