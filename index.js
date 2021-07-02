require("dotenv").config();

//frame work

const express = require("express");
const mongoose = require("mongoose");

//database
const database = require("./database/index");

//Modelsq
const BookModels = require("./database/book");
const AuthorModels = require("./database/author");
const PublicationModels = require("./database/publication");

//Initializing express
const shapeAI = express();

//configurations
shapeAI.use(express.json());

//Establish Database connection
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology:true,
  useFindAndModify: false,  
})
mongoose.connection.on('connected',()=>{
  console.log("Connected to MongoDB")
})
mongoose.connection.on('error',()=>{
  console.log("err connecting")
})
    
/*route        /
description    get all books
access         public
parameters     none
method         get
*/

shapeAI.get("/", (req, res) => {
    return res.json({ books: database.books });
});

/*route        /is
description    get specific book based on isbn
access         public
parameters     isbn
method         get
*/
shapeAI.get("/is/:isbn", (req, res) => {
    const getspecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if (getspecificBook.length === 0) {
        return res.json({
            error: `no book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({ book: getspecificBook });
});

/*route        /C
description    get a list of books based on category
access         public
parameters     category
method         get
*/

shapeAI.get("/c/:category", (req, res) => {
    const getspecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if (getspecificBook.length === 0) {
        return res.json({
            error: `no book found for the category of ${req.params.category}`,
        });
    }
    return res.json({ book: getspecificBook });
})

/*route        /ISBN
description    get specific books based on author
access         public
parameters     authorid
method         get
*/

shapeAI.get("/isbn/authors", (req, res) => {
    console.log(database.books);
    const getspecificBook = database.books.filter(
        (book) => book.authors.includes(req.params.authors)
    );
    if (getspecificBook.length === 0) {
        return res.json({
            error: `no book found for the author of ${req.params.authors}`,
        });
    }
    return res.json({ book: getspecificBook });
});

/*
route        /author
description    get all author
access         public
parameters     none
method         get
*/


shapeAI.get("/author", (req, res) => {
    return res.json({ authors: database.authors });
});

/*route         /author
description    get a list of authors based on a books ISBN
access         public
parameters     isbn
method         get
*/

shapeAI.get("/author/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) =>
      author.books.includes(req.params.isbn)
    );
    console.log("isbn");
  
    if (getSpecificAuthors.length === 0) {
      return res.json({
        error: `No author found for the book ${req.params.isbn}`,
      });
    }
  
    return res.json({ authors: getSpecificAuthors });
  });

/*route        /publications
description    get all publications
access         public
parameters     none
method         get
*/

shapeAI.get("/publication", (req, res) => {
   return res.json({publication: database.publications });
});

/*
route          /book/new
description    add new books
access         public
parameters     none
method         post
*/

shapeAI.post("/book/new", (req, res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books, message: "book was added!"});
});

/*
route          /author/new
description    add new author
access         public
parameters     none
method         post
*/


shapeAI.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    database.authors.push(newAuthor);
    return res.json({ authors: database.authors, message: "author was added!"});
});

/*
route          /publication/new
description    add new publication
access         public
parameters     none
method         POST
*/

shapeAI.post("/publication/new", (req, res) => {
    const { newpublication } = req.body;
    database.publications.push(newpublication);
    return res.json({ publictions: database.publications, message: "publication was added"});
});

/*
route          /book/update/
description    update title of a book
access         public
parameters     isbn
method         PUT
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
  database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
          book.title = req.body.bookTitle;
          return;
      }
  });
  return res.json({ books: database.books });

});

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn)
        return book.authors.push(req.body.newAuthor);
    });
  
    // update the author database
    database.authors.forEach((author) => {
      if (author.id === req.body.newAuthor)
        return author.books.push(req.params.isbn);
    });
  
    return res.json({
      books: database.books,
      authors: database.authors,
      message: "New author was added 🚀",
    });
  });

  /*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

shapeAI.put("/publication/update/book/:isbn", (req, res) =>{
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }

    });

    //update the book database
    database.books.forEach((book) =>{
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books, 
        publications: database.publications, 
        message: "succesfully update publication"});

});

/*
Route           /publications/update
Description     update/add  publication name
Access          PUBLIC
Parameters      id
Method          PUT
*/

shapeAI.put("/publications/update/:id", (req, res) => {
    database.publications.forEach((publication) =>{
        if(publication.name === req.body.pubName) {
            return publications.push(req.params.id);
       }
    });
    return res.json({publications: database.publications,
    message: "publication name is updated"
    });
});

/*
Route           /book/delete
Description     update/add  publication name
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
 const updateBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
   );
   database.books = updateBookDatabase;
   return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn,author id
Method          DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        const newAuthorList = book.authors.filter(
          (author) => author !== parseInt(req.params.authorId)
        );
        book.authors = newAuthorList;
        return;
      }
    });
  
    // update the author database
    database.authors.forEach((author) => {
      if (author.id === parseInt(req.params.authorId)) {
        const newBooksList = author.books.filter(
          (book) => book !== req.params.isbn
        );
  
        author.books = newBooksList;
        return;
      }
    });
  
    return res.json({
      message: "author was deleted!!!!!!😪",
      book: database.books,
      author: database.authors,
    });
  });

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
  });
});

  
    
shapeAI.listen(3000, () => console.log("server running!!"));