const express = require("express");
const {bookModel,booksProjectionSchema} = require("../models.js");
const jwt = require('jsonwebtoken');
let router = express.Router();

require('dotenv').config();

const dbName = "dockerise";

const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const { is } = require("express/lib/request");
const { json } = require("express/lib/response");
const res = require("express/lib/response");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



(async () => {
    await client.connect();
    const booksCollection = await client.db(dbName).collection("books");


    router.get('/books', async (req, res) => {
        const token = req.header('access-token') ?? null;

        let success = true;
        let code = 200;
        let errorMessage = null;
        let result = [];

        if (!token) {
            success = false;
            code = 403;
            errorMessage = "Authentification Failed"
        } else {
            tokenObject = jwt.verify(token, process.env.JWT_KEY) ?? null;
            if (!tokenObject) {
                success = false;
                code = 500;
                errorMessage = "Your connection token is not valid";
            }
        }
        
        if(success) {
            result = await booksCollection.find().project(booksProjectionSchema()).toArray();
        }

        const data = {
            "success": success,
            "requestCode": code,
            "error": errorMessage,
            "result" : result,
        };

        res.status(code).send(data);
    });

    router.get('/books/:isbn', async (req, res) => {
        const token = req.header('access-token') ?? null;

        let isbn = req.params.isbn ?? null;

        let success = true;
        let code = 200;
        let errors = [];
        let response = null;

        const book = await booksCollection
                        .find({"isbn": isbn})
                        .project(booksProjectionSchema())
                        .toArray();

        if (!token) {
            success = false;
            code = 403;
            errorMessage = "Authentification Failed"
        } else if(book.length == 0) {
            success = false;
            code = 404;
            errors.push("Ce livre n'existe pas");
        }else {
            tokenObject = jwt.verify(token, process.env.JWT_KEY) ?? null;
            if (!tokenObject) {
                success = false;
                code = 500;
                errorMessage = "Your connection token is not valid";
            }
        }

        if(success) {
            response = book;
        }

        const data = {
            "success": success,
            "requestCode": code,
            "error": errors[0] ?? null,
            "result" : response,
        };

        res.status(code).send(data);

    });

    router.post('/books', async(req, res) => {
        const token = req.header('access-token') ?? null;

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

        if (!token) {
            success = false;
            code = 403;
            errorMessage = "Authentification Failed"
        } else{
            tokenObject = jwt.verify(token, process.env.JWT_KEY) ?? null;
            if (!tokenObject) {
                success = false;
                code = 500;
                errorMessage = "Your connection token is not valid";
            }
        }

        if (!isbn || !title || !author) {
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

        if(author.length > 150 || typeof author !== "string") {
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
            response = await booksCollection.findOne(finalBook).project(booksProjectionSchema());
        }

        const data = {
            "success": success,
            "requestCode": code,
            "error": errors,
            "result" : response,
        };

        res.status(code).send(data);

    });

    router.patch('/books/:isbn', async(req, res) => {
        const token = req.header('access-token') ?? null;

        let isbn = req.params.isbn ?? null;

        const jsonBody = req.body;
        console.log(jsonBody);

        const oldIsbn = req.body.isbn ?? null;
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
        let response = null;

        let book = await booksCollection.find({"isbn": isbn}).toArray();

        if (!token) {
            success = false;
            code = 403;
            errorMessage = "Authentification Failed"
        } else {
            tokenObject = jwt.verify(token, process.env.JWT_KEY) ?? null;
            if (!tokenObject) {
                success = false;
                code = 500;
                errorMessage = "Your connection token is not valid";
            }
        }

        if(title && (title.length > 200 || typeof title !== "string")) {
            success = false;
            code = 422;
            errors.push("Le titre ne doit pas dépasser les 200 caractères");
        }

        if(author && (author.length > 150 || typeof author !== "string")) {
            success = false;
            code = 422;
            errors.push("Le nom de l'autheur ne doit pas dépasser les 150 caractères");
        }

        if(overview && (overview.length > 1500 || typeof overview !== "string")){
            success = false;
            code = 422;
            errors.push("La 4ème de couverture ne doit pas depasser les 1500 caractères");
        }

        if(success && book.length == 0) {
            success = false;
            code = 404;
            errors.push("Ce livre n'existe pas");
        }

        if(success) {
            await booksCollection.updateOne({"isbn": isbn}, {$set: jsonBody});
            response = await booksCollection.find({"isbn": isbn}).project(booksProjectionSchema()).toArray();
        }

        const data = {
            "success": success,
            "requestCode": code,
            "error": errors,
            "result" : response[0],
        };

        res.status(code).send(data);


    });

    router.delete('/books/:isbn', async (req, res) => {
        const token = req.header('access-token') ?? null;

        let isbn = req.params.isbn ?? null;

        let success = true;
        let code = 204;
        let errors = [];
        let response = null;

        const book = await booksCollection
                        .find({"isbn": isbn})
                        .project(booksProjectionSchema())
                        .toArray();

        if (!token) {
            success = false;
            code = 403;
            errorMessage = "Authentification Failed"
        } else {
            tokenObject = jwt.verify(token, process.env.JWT_KEY) ?? null;
            if (!tokenObject) {
                success = false;
                code = 500;
                errorMessage = "Your connection token is not valid";
            }
        }

        if(book.length == 0) {
            success = false;
            code = 404;
            errors.push("Ce livre n'existe pas");
        }

        if(success) {
            await booksCollection.deleteOne({"isbn": isbn});
        }

        const data = {
            "success": success,
            "requestCode": code,
            "error": errors[0] ?? null,
            "result" : response,
        };

        res.status(code).send(data);
    });

    router.post('/test', async(req, res) => {
        console.log(req.body);
        res.send('done');
    })
})();

module.exports = router;