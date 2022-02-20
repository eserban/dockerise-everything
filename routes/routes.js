const express = require("express");
const {bookModel} = require("../models.js");
let router = express.Router();

require('dotenv').config();

const dbName = "dockerise";

const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



(async () => {
    await client.connect();
    const booksCollection = await client.db(dbName).collection("books");


    router.get('/books', async (req, res) => {

        
        const books = await booksCollection.find().toArray();

        res.status(200).send(books);
    });


    router.post('/books', async(req, res) => {

        

        const isbn = req.body.isbn ?? null;
        const title = req.body.title ?? null;
        const author = req.body.author ?? null;
        const overview = req.body.overview ?? null;
        const picture = req.body.picture ?? null;
        const readCount = req.body.read_count ?? 1;

        console.log(typeof isbn);
        console.log(typeof title);
        console.log(typeof author);
        console.log(typeof overview);
        console.log(typeof picture);
        console.log(typeof readCount);

        let success = true;
        let code = 200;
        let errors = [];
        let response = [];

        let book = await booksCollection.find({"isbn": isbn}).toArray();

        if(!isbn || !title || !author) {
            success = false;
            code = 422;
            errors.push("Les éléments obligatoires ne sont pas fournis");
        }

        if(isbn.length > 13 || typeof isbn !== "string"){
            success = false;
            code = 422;
            errors.push("L'isbn doit faire 13 caractères max");
        }

        if(title.length > 200 || typeof title !== "string") {
            success = false;
            code = 422;
            errors.push("Le titre ne doit pas dépasser les 200 caractères");
        }

        if(title.length > 150 || typeof title !== "string") {
            success = false;
            code = 422;
            errors.push("Le nom de l'autheur ne doit pas dépasser les 150 caractères");
        }

        if(overview && (overview.length > 1500 || typeof overview !== "string")){
            success = false;
            code = 422;
            errors.push("La 4ème de couverture ne doit pas depasser les 1500 caractères");
        }

        if(success && book.lengh > 0){
            success = false;
            code = 422;
            errors.push("Ce livre existe deja");
        }

        if(success) {
            let finalBook = bookModel(isbn, title, author, overview, picture, readCount)
            await booksCollection.insertOne(finalBook);
            response = await booksCollection.findOne(finalBook);
        }

       let data = {
           "errors": errors,
           "book": response
       }

        res.status(code).send(data);

    });


})();

module.exports = router;