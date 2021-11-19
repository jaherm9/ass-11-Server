const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ztnx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("FoodBuz Server is Running");
});

client.connect(err => {
  const servicesCollection = client.db("foodBuzDb").collection("services");
  const bookingsCollection = client.db("foodBuzDb").collection("bookings");
  // perform actions on the collection object
  // client.close();



  // add services

  app.post("/addServices", async (req, res) =>{
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
  });

  // get services
  app.get("/allServices", async (req, res) =>{
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  })


  // get single product
  app.get("/singleProduct/:id", async (req, res) => {
    // console.log(req.params.id);
    const result = await servicesCollection
    .find({ _id: ObjectId(req.params.id) })
    .toArray();
    res.send(result[0]);
  });

  // order confirm
  app.post("/confirmOrder", async (req, res) =>{
    const result = await bookingsCollection.insertOne(req.body);
    res.send(result);
  })

  // user confirmed order
  app.get("/myOrders/:email", async(req, res) =>{
    const result = await bookingsCollection.find({ email: req.params.email }).toArray();
    res.send(result);
  });

  // Cancel Order
  app.delete("/cancelOrder/:id", async (req, res) =>{
    const cancelOrder = await bookingsCollection.deleteOne({
    _id: ObjectId(req.params.id)
  })
  res.send(cancelOrder);
});
  // get all Order
  app.get("/allOrders", async(req, res) =>{
    const allOrder = await bookingsCollection.find({}).toArray();
    res.send(allOrder);
  });
 // status update
 app. put("/updateStatus/:id", (req, res) =>{
   const id = req.params.id;
   const statusUpdate = req.body.status;
   const filter = {_id: ObjectId(id)};
   console.log(statusUpdate);
   bookingsCollection.updateOne(filter,{
     $set:{status: statusUpdate}, 
   })
   .then((result) =>{
     console.log(result);
   })
 });
});

app.listen(process.env.PORT || port);