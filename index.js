const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DataModel } = require("./models/data.model");
const { connection } = require("./config/db");
const { UserModel } = require("./models/user.model");



const app = express();
// const PORT = process.env.PORT || 8080;
app.use(cors({
  origin : "*"
}))
app.use(express.json());


const authentication = (req,res,next)=>{
  const token = req.headers.authorization?.split(" ")[1];
  if(!token){
      res.send("log in first")
  }
  else{
      jwt.verify(token, "abc",function(err,decode){
               if(err){
                  res.send("login first")
               }
               else{
                const {userID} = decode;
                req.userID= userID;
                  next()
               }
      })
  }
}


app.post("/signup", async(req,res)=>{
   const {email, first_name, second_name, contact, password} = req.body;
   bcrypt.hash(password, 4,async function(err, hash) {
if(err){
  res.send({ msg :"some worong gose, please recheck"});

}
else{
  const data = await  UserModel.create({
    email,
    first_name,
    second_name,
    contact,
    password:hash
  })
  res.send(data);
}

  });
try{

}catch(err){
  console.log("something  wrong", err);
}
})

app.post('/login', async(req,res)=>{
  const {email, password} = req.body;
  const is_user = await UserModel.findOne({email});
  if(is_user){
    const userPassword = is_user.password;
    bcrypt.compare(password,userPassword,function(err,result){
      if(result){
        const token = jwt.sign({userID : is_user._id},"abc")
        res.send({ msg :"login successfull", token : token} );
      }
      else{
        res.send("login fail",err)
    }
    })}
})


// app.get("/user", async(req, res) => {
//    try{
//        const data = await UserModel.data();
//    }catch(err){
//     console.log(err);
//    }
// });


app.get("/", (req, res) => {
    res.send("home page");
});



app.get("/data/:id", async (req, res) => {
  const { id  } = req.params;
  console.log("Received ID:", id);

  if (!id || id === "undefined") {
    return res.status(400).send("Invalid ID");
  }

  try {
    const data = await DataModel.findById(id);
    if (!data) {
      return res.status(404).send("Product not found");
    }
    res.send(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.get("/data", async (req, res) => {
  const { _sort, _order, search, _page, _limit } = req.query;

  try {
    const query = {};

    if (search) {
      // Use the correct option 'i' for case-insensitive search
      query.Country = { $regex: search, $options: "i" };
    }

    let sortObject = {};
    if (_sort) {
      sortObject[_sort] = _order === "desc" ? -1 : 1;
    }

    const page = parseInt(_page) || 1; // Parse _page as an integer with a default of 1
    const limit = parseInt(_limit) || 10; // Parse _limit as an integer with a default of 10

    const data = await DataModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortObject);

    const totalCount = await DataModel.countDocuments(query);

    res.set("X-Total-Count", totalCount); // Set total count in response header
    res.json(data);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.listen("8080", async () => {
    try {
        await connection;
        console.log("DB Connected");
    } catch (err) {
        console.error("DB Not Connected", err);
    }
    console.log(`8080 is running`);
});