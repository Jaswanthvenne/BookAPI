const mongoose = require("mongoose");

//Author schema
const AuthoeSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//Author Model
const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;