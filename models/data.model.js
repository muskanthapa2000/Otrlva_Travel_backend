const mongoose = require ("mongoose");

const dataSchema = mongoose.Schema({
    Country : {type : String},
    name : {type : String},
    url : {type : String},
    description : {type : String},
    cost : {type : String},
    title : {type : String},
    heading : {type : String},
    urls :{type : String},
    url1 : {type : String},
    url2 : {type : String},
    url3 : {type : String},
    url4 : {type : String},
    guestDetail : {type : String},
    description1 : {type : String}
})
const DataModel = mongoose.model("task" , dataSchema);




module.exports= {DataModel };
