const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const port = 4000;

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("Hello World!");
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tfohb.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("eValleyStore").collection("products");

  app.get('/products', (req, res) =>{
    productsCollection.find()
    .toArray((err, products) => {
      res.send(products)
    })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding data :', newProduct)
    productsCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    const id = ObjectID(req.params.id)
    console.log('delete this', id)
    productsCollection.deleteOne({_id: id})
    .then(result => {
      console.log(result)
    })
  })
//   client.close();
});


app.listen(port);
