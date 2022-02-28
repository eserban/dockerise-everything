var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtUserSignSchema, userSchema } = require("../../models.js");
var router = express.Router();
let dbName = "benevold_db"

require('dotenv').config();

const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const uri = process.env.MONGO_URI || "mongodb+srv://admin-benevold:MaqLBQjdNLmm6b4R@cluster0.qf07i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async() => {

    await client.connect();


    router.get('/', (req, res) => {
        res.send("This is the user authentification region"); 
    });

    router.post("/connexion", async (req, res) => {
        try{
            const login = req.body.email ?? null;
            const password = req.body.password ?? null;

            let success         = true;
            let code            = 200;
            let errorMessage    = null;
            let token           = null;

            const userCollection    = await client.db(dbName).collection("users");
            const user              = await userCollection.find({"email": login }).limit(1).toArray();

            if(!username || !password)
            {
                success         = false;
                code            = 400;
                errorMessage    = "Une adresse mail valide ainsi qu'un mot de passe sont requis."
            }else if (user.length < 1)
            {
                success         = false;
                code            = 404;
                errorMessage    = "Cet email n'est associé à aucun compte";
            }else if (!bcrypt.compare(password, user[0].password)){
                success           = false;
                code              = 400;
                errorMessage      = "Le mot de passe est pas valide";
            }

            if(success){
                //if body entries are OK we generate a token for the user
                let tokenSignSchema = jwtUserSignSchema(user[0]._id, user[0].username, user[0].email);
                
                token = jwt.sign(tokenSignSchema, process.env.JWT_KEY, {
                    expiresIn: 86400 // expires in 24 hours
                });
            }

            const data = {
                "success": success,
                "requestCode": code,
                "error": errorMessage,
                "token" : token,
            };

            res.status(code).send(data);
        }catch(err){
            console.error(err);
        }

    });


})();