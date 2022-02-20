const express = require("express");
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


    router.get('/books', async (req, res) => {

        const booksCollection = await client.db(dbName).collection("books");
        const books = await booksCollection.find().toArray();

        res.status(200).send(books);
    });

})();

module.exports = router;