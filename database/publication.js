const mongoose = require("mongoose");


//Publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//Author Model
const AuthorModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;