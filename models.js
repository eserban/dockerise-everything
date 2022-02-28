function bookModel(isbn, title, author, overview, picture, read_count){
    return {
        "isbn": isbn,
        "title": title,
        "author": author,
        "overview": overview,
        "picture": picture,
        "red_count": read_count
    };
}

function booksProjectionSchema(){
    return {
        "_id": 0
    }
}

function jwtSignSchema(id, username, email){
    return {
        "id": id,
        "username": username,
        "email": email,
    }
}

function userSchema(username, email, password){
    return {
        "username": username,
        "email": email,
        "createdAt": new Date().toISOString().slice(0, 16).replace('T', ' '),
        "password": password
    };
}

module.exports = {
    bookModel,
    booksProjectionSchema,
    jwtSignSchema,
    userSchema
}