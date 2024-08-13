import mongoose from 'mongoose';

const bookSchema  = new mongoose.Schema({
    bookname: String,
    authname: String,
    url: String,
});

const bookModel = mongoose.model('book', bookSchema );

export {bookModel};
