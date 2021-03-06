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

module.exports = {
    bookModel,
    booksProjectionSchema
}