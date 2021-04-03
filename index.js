const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4czm1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

client.connect(err => {
  const productCollection = client.db("freshVally").collection("product");
  const orders = client.db("freshVally").collection("order");
  const cart = client.db("freshVally").collection("cart");
  
    app.post('/admin/addProduct',(req,res)=>{
      productCollection.insertOne(req.body)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
    })

    app.get('/products',(req,res)=>{
      productCollection.find({})
      .toArray((err,documents)=>{
        res.send(documents)
      })
    })
    app.get('/product/:id', (req, res)=>{
      productCollection.find({_id : ObjectId(req.params.id)})
      .toArray((err, documents)=>{
          res.send(documents[0])
      })
  })
  app.delete('/delete/:id',(req,res)=>{
    productCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

  app.post('/placeOrder',(req,res)=>{
    orders.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/getOrders',(req,res)=>{
    // console.log(req.query.email)
    orders.find({email : req.query.email})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  app.delete('/orderDelete/:id',(req,res)=>{
    orders.deleteOne({_id : ObjectId(req.params.id)})
    .then((result)=>{
      res.send(result.deletedCount > 0)
    })
  })
  
  app.post('/addCart',(req,res)=>{
    cart.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/userCart',(req,res)=>{
    cart.find({email: req.query.email})
    .toArray((err,document)=> {
      res.send(document)
    })
  })

  app.delete('/clearCart/:id',(req,res)=>{
    cart.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=> {
      res.send(result.deletedCount > 0)
    })
  })

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})