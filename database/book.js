const mongoose = require("monogoose");

//creating a book schema
const BookSchema = mongoose.Schema({
       ISBN: String,
      title: String,
      authors: [Number],
      language: String,
      pubDate: String,
      numOfPage: Number,
      category: [String],
      publication: Number,
});

//create a model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel