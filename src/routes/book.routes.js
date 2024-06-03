
const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

//MIDDLEWARE
const getBook = async(req, res, next) => {
    const { id } = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
            {
                message: 'el id es invalido'
            }
        )
    }

    try {
        const book = await Book.findById(id)
        if(!book){
            return res.status(404).json(
                {
                    message: 'el libro no se encontro'
                }
            )
        }

        res.book = book;
        next();
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
};

//obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if (books.length === 0){
            return res.status(204).json([])
        }
        res.json(books)

    } catch(error){
        res.status(500).json({ message: error.message })
    }
})

//crear un nuevo libro (recurso) [POST]

router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req?.body
    if (!title || !author || !genre || !publication_date ){
        return res.status(400).json({
            message: 'los campos titulos, autor, genero y fecha son oblilgatorios'
        })
    }

    const newBook = new Book(
        {
            title, 
            author, 
            genre, 
            publication_date
        }
    )

    try {
        const savedBook = await newBook.save()
        console.log(savedBook)
        res.status(201).json(savedBook)
    } catch(error) {
        res.status(400).json({
            message: error.message
        })
    }
})


//g/p/p/d

router.get('/:id', getBook, async(req, res) => {
    res.json(res.book);
})

router.put('/:id', getBook, async(req, res) => {
    try{
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)

    } catch (error){
        res.status(400).json({
            message: error.message
        })
    }
})

router.put('/:id', getBook, async(req, res) => {
    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        res.status(400).json({
            mesagge: 'Al menos uno de estos campos deben ser enviados: Título, Autor, Género o fecha de publicación'
        })
    }
    try{
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)

    } catch (error){
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getBook, async(req, res) => {
    try {
        const book = res.book
        await book.remove
        res.json({
            message:`El libro ${book.title} fue eliminado correctamente`
        })
    } catch(error){
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router
