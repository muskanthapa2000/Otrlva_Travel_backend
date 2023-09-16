const mongoose = require ("mongoose");

const userSchema = mongoose.Schema({
    email :{type : String},
    first_name : {type : String},
    second_name : {type : String},
    contact : {type : String},
    password : {type : String}
})

const UserModel = mongoose.model("user" , userSchema)

module.exports= {UserModel};