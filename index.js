const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 4000;
//middleWires
// app.use(express.json()); 
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

//app routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})


//mongoDB connect
const uri = `${process.env.DB_URL}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoDB database req res operations

client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION2}`);
 

  // perform actions on the collection object

  //app routes
  app.post('/addProduct',(req,res) =>{
    const products =req.body;
    // console.log(products);
    productCollection.insertOne(products)
    .then(result =>{
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    })
  })

  app.get('/products', (req,res)=>{
    productCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.get('/products/:key', (req,res)=>{
    productCollection.find({key:req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  //for more than one products in order review 
  app.post('/productsByKeys',(req,res)=>{
    const productKeys =req.body;
    productCollection.find({key: {$in: productKeys}})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  //orders 
  app.post('/addOrder',(req,res) =>{
    const order =req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount>0);
    })
  })

//listening middleWire
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

  client.close();
});



//git push new branch

