const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
    {
        title:                  String,
        author:                 String,
        genre:                  String,
        publication_date:       String,
        image:                  String,
    }
)

module.exports = mongoose.model('book', bookSchema)