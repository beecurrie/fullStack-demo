const express =require('express');//includes express
const app = express(); //calls the express method
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//cross origin resource sharing
const cors = require('cors');//cross origin restriction to be waived
const bcrypt = require('bcryptjs');
const config = require('./config.json');
const product = require('./Products.json');
const Product = require('./models/products.js');

const port = 5000;

//use ends here
app.use((req,res,next)=>{
 console.log(`${req.method} request ${req.url}`);
  next();
})

app.use(bodyParser.json());//calling body parser method
app.use(bodyParser.urlencoded({extended:false}));//using default

app.use(cors()); //calling cors method

app.get('/',(req,res)=> res.send('Hello! I am from the backend'))

 mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@testcluster.${config.MONGO_CLUSTER_NAME}.mongodb.net/Sample?retryWrites=true&w=majority`, {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log('DB connected!'))
.catch(err=>{
  console.log(`DBConnectionError:${err.message}`);
});

//post method to write or create a document in mongodb
app.post('/addProduct',(req,res)=>{
  const dbProduct = new Product({
    _id : new mongoose.Types.ObjectId,
    name : req.body.name,
    price: req.body.price,
    image_url : req.body.imageUrl
  });
  
  //save to the database and notify the user
  dbProduct.save().then(result=>{
    res.send(result);
  }).catch(err=>res.send(err));
})




//get method to access data from Products.json
//routing to the endpoint
app.get('/allProducts', (req,res)=>{
  res.json(product);
})

app.get('/products/p=:id',(req,res)=>{
  const idParam = req.params.id;
  for (let i =0; i<product.length; i++){
    if (idParam.toString() === product[i].id.toString()){
      res.json(product[i]);
    }
  }
});


//listening to port

app.listen(port,()=>console.log(`My fullstack application is listening on port ${port}`))
