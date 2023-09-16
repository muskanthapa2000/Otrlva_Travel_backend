const mongoose = require ("mongoose")

const connection = mongoose.connect("mongodb+srv://muskanthapa:muskan@cluster0.lh0f6z8.mongodb.net/?retryWrites=true&w=majority")

module.exports = {connection}