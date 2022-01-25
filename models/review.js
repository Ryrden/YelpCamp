const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Numbers
})

module.exports = mongoose.model('Review',reviewSchema);